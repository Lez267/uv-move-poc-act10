package com.uvmove.uv_move_backend.viajes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/viajes")
public class ViajesController {

    @Autowired
    private ViajesService viajesService;

    public static class ViajeRequest {
        public String idUsuario;
        public String idVehiculo;
    }

    // endpoint para cuando escanean el qr e inician el viaje
    @PostMapping("/iniciar")
    public ResponseEntity<?> iniciarViaje(@RequestBody ViajeRequest request) {
        try {
            ViajeRegistro viaje = viajesService.iniciarViaje(request.idUsuario, request.idVehiculo);
            return ResponseEntity.ok(viaje);
        } catch (IllegalStateException e) {
            // regla de negocio: si no se puede iniciar tiramos error (ej. ya tiene viaje o no sirve el vehiculo)
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            // si mandan datos malos
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // endpoint para cuando terminan el viaje
    @PostMapping("/{idViaje}/finalizar")
    public ResponseEntity<?> finalizarViaje(@PathVariable Integer idViaje) {
        try {
            ViajeRegistro viaje = viajesService.finalizarViaje(idViaje);
            return ResponseEntity.ok(viaje);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
