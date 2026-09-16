package com.uvmove.uv_move_backend.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebConfig {

    @RequestMapping(value = {"/mapa", "/escaner", "/viaje-activo/**"})
    public String forward() {
        return "forward:/index.html";
    }
}
