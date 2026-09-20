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

    // iniciamos el viaje validando varias cosas primero
    @Transactional
    public ViajeRegistro iniciarViaje(String idUsuario, String idVehiculo) {
        // validamos que el usuario exista y no este baneado
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no existe en el sistema."));

        if (!usuario.getEstatusActivo()) {
            throw new IllegalStateException("El usuario está inactivo o suspendido.");
        }

        // checamos si ya anda en un viaje
        boolean tieneViajeActivo = viajesRepository.existsByIdUsuarioAndEstadoViaje(idUsuario, "Activo");
        if (tieneViajeActivo) {
            throw new IllegalStateException("El usuario ya tiene un viaje activo.");
        }

        // verificamos que el vehiculo este libre
        String estadoVehiculo = flotaService.obtenerEstado(idVehiculo);
        if (!"Disponible".equals(estadoVehiculo)) {
            // si esta ocupado o descompuesto, no lo dejamos rentar
            throw new IllegalStateException("El vehículo no está disponible para renta. Estado actual: " + estadoVehiculo);
        }

        // creamos el registro del viaje con la hora actual
        ViajeRegistro nuevoViaje = new ViajeRegistro();
        nuevoViaje.setIdUsuario(idUsuario);
        nuevoViaje.setIdVehiculo(idVehiculo);
        nuevoViaje.setHoraInicio(LocalDateTime.now());
        nuevoViaje.setEstadoViaje("Activo");
        
        ViajeRegistro guardado = viajesRepository.save(nuevoViaje);

        // marcamos el vehiculo como ocupado
        flotaService.actualizarEstado(idVehiculo, "En uso");

        return guardado;
    }

    // funcion para terminar el viaje y liberar la bici/scooter
    @Transactional
    public ViajeRegistro finalizarViaje(Integer idViaje) {
        ViajeRegistro viaje = viajesRepository.findById(idViaje)
                .orElseThrow(() -> new IllegalArgumentException("Viaje no encontrado."));

        if (!"Activo".equals(viaje.getEstadoViaje())) {
            throw new IllegalStateException("El viaje no está activo.");
        }

        viaje.setHoraFin(LocalDateTime.now());
        viaje.setEstadoViaje("Finalizado");
        
        // regresamos el vehiculo a disponible para que otro lo use
        flotaService.actualizarEstado(viaje.getIdVehiculo(), "Disponible");

        return viajesRepository.save(viaje);
    }
}
