#  UV Move - Prueba de Concepto (Actividad 10)

**Módulos a desarrollar:** Gestor de Viajes y Gestor de Flota.  
**Objetivo (Sprint Goal):** Implementar una PoC mínima que permita comprobar que ambos módulos pueden colaborar respetando sus interfaces, contratos, reglas de negocio y modelo de datos, simulando el inicio de un viaje.

---

## Stack Tecnológico Definido
Cumpliendo con las restricciones de la actividad, se utilizó el siguiente stack:
* **Frontend:** React + Vite (Interfaz web mínima).
* **Autenticación:** Supabase Auth.
* **Backend:** Spring Boot (Lógica de `com.uvmove.viajes` y `com.uvmove.flota`).
* **Base de Datos Core:** IBM Db2.
* **Control de Versiones:** Git + GitHub.

---

##  Trazabilidad

| Elemento | Evidencia / Definición |
| :--- | :--- |
| **Requisito** | **R9:** Iniciar viaje escaneando QR. **R10:** Registrar hora de inicio. |
| **Regla de negocio** | **RN7:** Un vehículo solo puede ser rentado si su estatus físico actual es "Disponible". |
| **Módulo solicitante** | Gestor de Viajes (`com.uvmove.viajes`). |
| **Interfaz / servicio** | `obtenerEstado(idVehiculo)` y `actualizarEstado(idVehiculo, nuevoEstado)` |
| **Contrato** | **Input:** `idVehiculo` (String). **Condición:** Ejecutar RN7. **Output:** `estado` (String) o `Excepción 409` si no está disponible. |
| **Módulo proveedor** | Gestor de Flota (`com.uvmove.flota`). |
| **Entidades/tablas Db2** | `FLOTA_VEHICULOS`, `VIAJES_REGISTRO`. |
| **Escenario exitoso** | Escaneo QR **B-001** (Disponible) ➔ Validación OK ➔ INSERT de Viaje ➔ UPDATE de Flota a 'En uso' ➔ UI Pantalla 3. |
| **Escenario de rechazo** | Escaneo QR **B-002** (Mantenimiento) ➔ Falla validación RN7 ➔ Rollback ➔ UI Pantalla 4 (Pop-up Error). |
| **Resultado esperado** | Los módulos colaboran validando el estado físico antes de persistir un viaje, previniendo inconsistencias. |

---

## Scripts de Base de Datos (IBM Db2)
*El script completo se encuentra en el archivo `database/init_db2.sql` de este repositorio.*

```sql
-- Creación de tablas principales homologadas
CREATE TABLE USUARIO (
    ID_USUARIO VARCHAR(50) NOT NULL PRIMARY KEY,
    ESTATUS_ACTIVO BOOLEAN NOT NULL
);

CREATE TABLE FLOTA_VEHICULOS (
    ID_VEHICULO VARCHAR(10) NOT NULL PRIMARY KEY,
    TIPO_VEHICULO VARCHAR(20) NOT NULL,
    ESTADO_FISICO VARCHAR(20) NOT NULL,
    NIVEL_BATERIA INT,
    LATITUD DECIMAL(9,6),
    LONGITUD DECIMAL(9,6)
);

CREATE TABLE VIAJES_REGISTRO (
    ID_VIAJE INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) NOT NULL PRIMARY KEY,
    ID_USUARIO VARCHAR(50) NOT NULL,
    ID_VEHICULO VARCHAR(10) NOT NULL,
    HORA_INICIO TIMESTAMP DEFAULT CURRENT TIMESTAMP NOT NULL,
    HORA_FIN TIMESTAMP,
    ESTADO_VIAJE VARCHAR(15) NOT NULL,
    CONSTRAINT FK_USUARIO FOREIGN KEY (ID_USUARIO) REFERENCES USUARIO(ID_USUARIO),
    CONSTRAINT FK_VEHICULO FOREIGN KEY (ID_VEHICULO) REFERENCES FLOTA_VEHICULOS(ID_VEHICULO)
);

-- (Datos de prueba omitidos aquí por brevedad, consultar database/init_db2.sql)
```

---

## Conclusión y Hallazgos (Pregunta Final)

**¿La implementación confirmó el diseño que propusimos o reveló una inconsistencia que fue necesario corregir?**

La implementación **confirmó el diseño** planteado en la fase de modelado. Al llevar la arquitectura a código, comprobamos que el Gestor de Viajes puede operar sin acceder directamente a la tabla de vehículos, utilizando estrictamente el contrato de `FlotaService` (métodos `obtenerEstado` y `actualizarEstado`). 

**Principal hallazgo:** Separar las responsabilidades en dos módulos distintos fue clave. Al principio, a nivel de código, parecía más "fácil" hacer un solo query SQL en Viajes que revisara el estado del vehículo directamente. Sin embargo, al respetar el diseño y forzar la comunicación a través de la interfaz de Flota, logramos aislar la Regla de Negocio 7 (Disponibilidad), comprobando que los módulos colaboran sin romper el encapsulamiento.
