package com.uvmove.uv_move_backend.flota;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FlotaService {

    @Autowired
    private FlotaRepository flotaRepository;

    /**
     * Interfaz: obtenerEstado(idVehiculo)
     * Contrato: Devuelve el estado actual o lanza excepción si no existe.
     */
    public String obtenerEstado(String idVehiculo) {
        return flotaRepository.findById(idVehiculo)
                .map(FlotaVehiculos::getEstadoFisico)
                .orElseThrow(() -> new IllegalArgumentException("Vehículo no encontrado"));
    }

    /**
     * Interfaz: actualizarEstado(idVehiculo, nuevoEstado)
     */
    @Transactional
    public void actualizarEstado(String idVehiculo, String nuevoEstado) {
        FlotaVehiculos vehiculo = flotaRepository.findById(idVehiculo)
                .orElseThrow(() -> new IllegalArgumentException("Vehículo no encontrado"));
        vehiculo.setEstadoFisico(nuevoEstado);
        flotaRepository.save(vehiculo);
    }

    /**
     * Servicio de lectura para el frontend (Mapa)
     */
    public List<FlotaVehiculos> obtenerVehiculosDisponiblesGPS() {
        return flotaRepository.findByEstadoFisico("Disponible");
    }
}
