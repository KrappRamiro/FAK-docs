# WiFi en el Invernadero

## Por qué el alcance baja brutalmente

- Estructura metálica (perfiles, malla anti-granizo) 
- Humedad alta constantem porque el agua absorbe RF, especialmente 2.4 GHz
- Las plantas absorben RF
- Motores y bombas meten un MONTON de Ruido eléctrico 

Un [ESP32](../hardware-esp32/socs/index.md) con antena PCB tiene **MUCHO MENOS alcance efectivo** en este ambiente.

---

## Antena PCB vs U.FL externa

### Antena PCB (default)
- Integrada en el módulo [WROOM](../hardware-esp32/modulos/wroom.md)
- Adecuada para distancias cortas 
- Cero costo adicional

### Conector U.FL + antena externa
- Módulo con sufijo **`U`** en el nombre (ej. `ESP32-S3-WROOM-1U-N16R8`)
- Antena externa
- **Aumenta el alcance efectivo** en ambiente hostil
- Antena se puede orientar para optimizar señal

### Cuándo usar U.FL - obligatorio

- Dentro de un gabinete metálico (la caja se convierte en Faraday)
- Cuando observás reconexiones frecuentes con antena PCB
- Cuando el RSSI está debajo de **-50 dBm** consistentemente

En escenario B (APs mesh cercanos a pocos metros), la antena PCB es suficiente.

---

## RSSI - la métrica que te dice si estás bien

Reportar siempre `WiFi.RSSI` en el payload MQTT para saber qué tan bien está cada nodo:

| RSSI (dBm) | Estado |
|---|---|
| > -50 | Excelente |
| -50 a -65 | Bueno |
| -65 a -75 | Aceptable |
| -75 a -85 | Marginal - reconexiones frecuentes |
| < -85 | Inutilizable |

Si en producción ves nodos con RSSI < -75 dBm:
1. Reubicar más cerca de un AP, o
2. Agregar un AP mesh adicional en esa zona, o
3. Cambiar al DevKit con `U` y antena externa

---



## Reconexión robusta

WiFi puede desconectarse por:
- Router reiniciándose
- AP fuera de rango temporalmente (motor cercano arranca y satura)
- Conflictos de canal con otros routers

El firmware debe **reconectar automáticamente** sin bloquearse:

**No bloquear** la lectura de sensores durante reintentos de WiFi - buffear las lecturas en RAM (o en otro medio, analizar!) y enviarlas cuando MQTT vuelva a conectar. Si el nodo está sin red 30 min, no deberiamos perder datos.

---

## Seguridad básica de WiFi

- **Nunca hardcodear SSID + password** en el firmware. Usar [NVS](../seguridad-iot/secrets-en-firmware.md) encriptado o WiFi Provisioning. Ver [`../seguridad-iot/secrets-en-firmware.md`](../seguridad-iot/secrets-en-firmware.md)
- **WPA2-Personal o WPA3** - nunca WEP, nunca open
- **VLAN dedicada para IoT** si el router lo soporta, aisla los [ESP32](../hardware-esp32/socs/index.md) del resto de la red doméstica
- **No exponer puertos al WAN** - el broker MQTT debe vivir en LAN, acceso remoto solo vía VPN
