package com.uvmove.uv_move_backend.viajes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// repositorio basico para los usuarios
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {
}
