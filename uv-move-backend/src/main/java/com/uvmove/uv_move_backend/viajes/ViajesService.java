package com.uvmove.uv_move_backend.viajes;

import com.uvmove.uv_move_backend.flota.FlotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ViajesService {

    @Autowired
    private ViajesRepository viajesRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Dependencia hacia el módulo de Flota (Proveedor)
    @Autowired
    private FlotaService flotaService;

    /**
     * Interfaz: iniciarViaje(idUsuario, idVehiculo)
     */
    @Transactional
    public ViajeRegistro iniciarViaje(String idUsuario, String idVehiculo) {
        // RN1 / RN2: Verificar que el usuario exista, esté activo y no tenga viajes activos
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no existe en el sistema."));

        if (!usuario.getEstatusActivo()) {
            throw new IllegalStateException("El usuario está inactivo o suspendido.");
        }

        boolean tieneViajeActivo = viajesRepository.existsByIdUsuarioAndEstadoViaje(idUsuario, "Activo");
        if (tieneViajeActivo) {
            throw new IllegalStateException("El usuario ya tiene un viaje activo.");
        }

        // RN7: Verificar disponibilidad del vehículo usando el contrato del módulo de Flota
        String estadoVehiculo = flotaService.obtenerEstado(idVehiculo);
        if (!"Disponible".equals(estadoVehiculo)) {
            // Rechazo por Regla de Negocio
            throw new IllegalStateException("El vehículo no está disponible para renta. Estado actual: " + estadoVehiculo);
        }

        // R10: Registrar viaje con hora exacta
        ViajeRegistro nuevoViaje = new ViajeRegistro();
        nuevoViaje.setIdUsuario(idUsuario);
        nuevoViaje.setIdVehiculo(idVehiculo);
        nuevoViaje.setHoraInicio(LocalDateTime.now());
        nuevoViaje.setEstadoViaje("Activo");
        
        ViajeRegistro guardado = viajesRepository.save(nuevoViaje);

        // Actualizar el estado del vehículo usando el contrato del módulo de Flota
        flotaService.actualizarEstado(idVehiculo, "En uso");

        return guardado;
    }

    @Transactional
    public ViajeRegistro finalizarViaje(Integer idViaje) {
        ViajeRegistro viaje = viajesRepository.findById(idViaje)
                .orElseThrow(() -> new IllegalArgumentException("Viaje no encontrado."));

        if (!"Activo".equals(viaje.getEstadoViaje())) {
            throw new IllegalStateException("El viaje no está activo.");
        }

        viaje.setHoraFin(LocalDateTime.now());
        viaje.setEstadoViaje("Finalizado");
        
        // Actualizar vehículo a Disponible (o En revisión, dependiendo del requerimiento, pero Disponible es lo estándar)
        flotaService.actualizarEstado(viaje.getIdVehiculo(), "Disponible");

        return viajesRepository.save(viaje);
    }
}
