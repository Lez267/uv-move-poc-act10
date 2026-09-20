package com.uvmove.uv_move_backend.flota;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlotaRepository extends JpaRepository<FlotaVehiculos, String> {
    
    // metodo para sacar los vehiculos segun su estado (lo ocupamos para los pines del mapa)
    List<FlotaVehiculos> findByEstadoFisico(String estadoFisico);
}
