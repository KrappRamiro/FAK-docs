# WiFi en el Invernadero

## Por qué el alcance baja brutalmente

| Causa | Efecto |
|---|---|
| Estructura metálica (perfiles, malla anti-granizo) | Atenúa 2.4 GHz hasta 10-20 dB |
| Humedad alta constante | El agua absorbe RF, especialmente 2.4 GHz |
| Plantas densas | Absorción adicional, **varía con el crecimiento del cultivo** |
| Motores y bombas | Ruido eléctrico interfiere con el radio |

Un [ESP32](../hardware/socs/index.md) con antena PCB tiene **5-10 m de alcance efectivo** en este ambiente, vs. los 50 m teóricos al aire libre.

---

## Antena PCB vs U.FL externa

### Antena PCB (default)
- Integrada en el módulo [WROOM](../hardware/modulos/wroom.md)
- Adecuada para distancias cortas (< 10 m sin obstáculos)
- Cero costo adicional

### Conector U.FL + antena externa
- Módulo con sufijo **`U`** en el nombre (ej. `ESP32-S3-WROOM-1U-N16R8`)
- Antena dipolo externa 2-5 dBi
- **Triplica el alcance efectivo** en ambiente hostil
- Antena se puede orientar para optimizar señal

### Cuándo usar U.FL - obligatorio

- Dentro de un gabinete metálico (la caja se convierte en Faraday)
- Distancia > 20 m con estructura metálica de por medio
- Cuando observás reconexiones frecuentes con antena PCB
- Cuando el RSSI está debajo de **-75 dBm** consistentemente

En escenario B (APs mesh cercanos a pocos metros), la antena PCB es suficiente.

---

## RSSI - la métrica que te dice si estás bien

Reportar siempre `WiFi.RSSI` en el payload [MQTT](mqtt-stack.md) para saber qué tan bien está cada nodo:

| RSSI (dBm) | Estado |
|---|---|
| > -50 | Excelente |
| -50 a -65 | Bueno |
| -65 a -75 | Aceptable |
| -75 a -85 | Marginal - reconexiones frecuentes |
| < -85 | Inutilizable |

```c
int8_t rssi = 0;
wifi_ap_record_t ap_info;
if (esp_wifi_sta_get_ap_info(&ap_info) == ESP_OK) {
 rssi = ap_info.rssi;
 ESP_LOGI(TAG, "RSSI: %d dBm", rssi);
}
```

Si en producción ves nodos con RSSI < -75 dBm:
1. Reubicar más cerca de un AP, o
2. Agregar un AP mesh adicional en esa zona, o
3. Cambiar al DevKit con `U` y antena externa

---

## Canales 2.4 GHz

En 2.4 GHz hay **11 canales en América** (1-11). Solo 1, 6 y 11 no se solapan.

- Configurar el router/APs para usar **6** o **11** si el barrio está saturado en 1
- Verificar con apps tipo WiFi Analyzer (Android) o `airport -s` (macOS)
- Los [ESP32](../hardware/socs/index.md) escanean automáticamente, no tenés que fijar canal en firmware

---

## DHCP vs IP estática

| | DHCP | IP estática |
|---|---|---|
| Setup inicial | Más simple | Más laborioso |
| Identificación de nodos | Por MAC en el router | Directa por IP |
| Comportamiento si el router se reinicia | El nodo recupera IP automáticamente | El nodo conserva su IP |
| Para producción del invernadero | Funciona, pero IPs cambian | **Recomendado** |

Con DHCP, identificar nodos por **MAC address** o **hostname** (configurable en `tcpip_adapter_set_hostname`).

```c
esp_netif_set_hostname(netif, "greenhouse-temp-zone-A");
```

---

## Reconexión robusta

WiFi puede desconectarse por:
- Router reiniciándose
- AP fuera de rango temporalmente (motor cercano arranca y satura)
- Conflictos de canal con otros routers

El firmware debe **reconectar automáticamente** sin bloquearse:

```c
static void wifi_event_handler(void* arg, esp_event_base_t event_base,
 int32_t event_id, void* event_data) {
 if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_DISCONNECTED) {
 ESP_LOGW(TAG, "WiFi desconectado, reintentando...");
 esp_wifi_connect();
 } else if (event_base == IP_EVENT && event_id == IP_EVENT_STA_GOT_IP) {
 ESP_LOGI(TAG, "WiFi conectado");
 }
}
```

**No bloquear** la lectura de sensores durante reintentos de WiFi - buffer las lecturas en RAM y enviarlas cuando [MQTT](mqtt-stack.md) vuelva a conectar. Si el nodo está sin red 30 min, no debe perder datos.

---

## Seguridad básica de WiFi

- **Nunca hardcodear SSID + password** en el firmware. Usar [NVS](../seguridad-iot/secrets-en-firmware.md) encriptado o WiFi Provisioning. Ver [`../seguridad-iot/secrets-en-firmware.md`](../seguridad-iot/secrets-en-firmware.md)
- **WPA2-Personal o WPA3** - nunca WEP, nunca open
- **VLAN dedicada para IoT** si el router lo soporta - aísla los [ESP32](../hardware/socs/index.md) del resto de la red doméstica
- **No exponer puertos al WAN** - el broker [MQTT](mqtt-stack.md) vive en LAN, acceso remoto solo vía VPN/[Tailscale](../seguridad-iot/exposicion-externa.md)
