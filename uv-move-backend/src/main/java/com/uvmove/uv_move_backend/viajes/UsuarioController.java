package com.uvmove.uv_move_backend.viajes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public static class RegistroRequest {
        public String idUsuario;
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@RequestBody RegistroRequest request) {
        if (request.idUsuario == null || request.idUsuario.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El idUsuario es obligatorio.");
        }

        // Verificar si ya existe
        if (usuarioRepository.existsById(request.idUsuario)) {
            return ResponseEntity.ok("El usuario ya existe en Db2.");
        }

        // Crear nuevo usuario activo
        Usuario nuevo = new Usuario();
        nuevo.setIdUsuario(request.idUsuario);
        nuevo.setEstatusActivo(true);
        usuarioRepository.save(nuevo);

        return ResponseEntity.ok("Usuario registrado exitosamente en Db2.");
    }
}
