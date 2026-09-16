package com.uvmove.uv_move_backend.viajes;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "VIAJES_REGISTRO")
public class ViajeRegistro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_VIAJE")
    private Integer idViaje;

    @Column(name = "ID_USUARIO", nullable = false)
    private String idUsuario;

    @Column(name = "ID_VEHICULO", nullable = false)
    private String idVehiculo;

    @Column(name = "HORA_INICIO", nullable = false)
    private LocalDateTime horaInicio;

    @Column(name = "HORA_FIN")
    private LocalDateTime horaFin;

    @Column(name = "ESTADO_VIAJE", nullable = false)
    private String estadoViaje; // Ej: "Activo", "Finalizado"

    public Integer getIdViaje() { return idViaje; }
    public void setIdViaje(Integer idViaje) { this.idViaje = idViaje; }

    public String getIdUsuario() { return idUsuario; }
    public void setIdUsuario(String idUsuario) { this.idUsuario = idUsuario; }

    public String getIdVehiculo() { return idVehiculo; }
    public void setIdVehiculo(String idVehiculo) { this.idVehiculo = idVehiculo; }

    public LocalDateTime getHoraInicio() { return horaInicio; }
    public void setHoraInicio(LocalDateTime horaInicio) { this.horaInicio = horaInicio; }

    public LocalDateTime getHoraFin() { return horaFin; }
    public void setHoraFin(LocalDateTime horaFin) { this.horaFin = horaFin; }

    public String getEstadoViaje() { return estadoViaje; }
    public void setEstadoViaje(String estadoViaje) { this.estadoViaje = estadoViaje; }
}
