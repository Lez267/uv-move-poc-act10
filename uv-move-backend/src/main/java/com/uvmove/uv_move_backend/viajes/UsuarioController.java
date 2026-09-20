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

    // endpoint para cuando se loguean por primera vez y hay que guardarlos
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@RequestBody RegistroRequest request) {
        if (request.idUsuario == null || request.idUsuario.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El idUsuario es obligatorio.");
        }

        // si ya lo tenemos guardado no hacemos nada
        if (usuarioRepository.existsById(request.idUsuario)) {
            return ResponseEntity.ok("El usuario ya existe en Db2.");
        }

        // guardamos al usuario nuevo y lo ponemos como activo
        Usuario nuevo = new Usuario();
        nuevo.setIdUsuario(request.idUsuario);
        nuevo.setEstatusActivo(true);
        usuarioRepository.save(nuevo);

        return ResponseEntity.ok("Usuario registrado exitosamente en Db2.");
    }
}
