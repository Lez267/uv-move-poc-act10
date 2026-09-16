package com.uvmove.uv_move_backend.flota;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlotaRepository extends JpaRepository<FlotaVehiculos, String> {
    
    // Método para obtener vehículos disponibles y pintar los pines (Mencionado en ACT9)
    List<FlotaVehiculos> findByEstadoFisico(String estadoFisico);
}
