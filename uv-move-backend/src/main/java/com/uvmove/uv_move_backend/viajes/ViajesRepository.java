package com.uvmove.uv_move_backend.viajes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ViajesRepository extends JpaRepository<ViajeRegistro, Integer> {
    boolean existsByIdUsuarioAndEstadoViaje(String idUsuario, String estadoViaje);
}
