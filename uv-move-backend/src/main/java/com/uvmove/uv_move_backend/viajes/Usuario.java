package com.uvmove.uv_move_backend.viajes;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "USUARIO")
public class Usuario {

    @Id
    @Column(name = "ID_USUARIO")
    private String idUsuario;

    @Column(name = "ESTATUS_ACTIVO")
    private Boolean estatusActivo;

    public String getIdUsuario() { return idUsuario; }
    public void setIdUsuario(String idUsuario) { this.idUsuario = idUsuario; }

    public Boolean getEstatusActivo() { return estatusActivo; }
    public void setEstatusActivo(Boolean estatusActivo) { this.estatusActivo = estatusActivo; }
}
