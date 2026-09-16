package com.uvmove.uv_move_backend.flota;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/flota")
public class FlotaController {

    @Autowired
    private FlotaService flotaService;

    @GetMapping("/cercanos")
    public List<FlotaVehiculos> obtenerCercanos() {
        // En un sistema real se filtraría por radio y coordenadas.
        // Aquí retornamos los disponibles como dice la entrega 9.
        return flotaService.obtenerVehiculosDisponiblesGPS();
    }
}
