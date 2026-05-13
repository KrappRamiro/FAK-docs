# Nodo Cámara

Captura fotos del cultivo para timelapse, [NDVI](../sensores/luz/conceptos-par.md) visual y diagnóstico remoto. Stream básico HTTP en LAN.

## Hardware

| Componente | Notas |
|---|---|
| [ESP32-S3-DevKitC-1 N16R8](../hardware/devkits/espressif/esp32-s3-devkitc-1.md) | 16 MB flash + 8 MB PSRAM (PSRAM crítico para buffer de imagen) |
| Cámara OV2640 o OV5640 | OV2640 = 2MP (más barato, comunidad masiva), OV5640 = 5MP |
| Interface | Header DVP o MIPI CSI según cámara |
| Alimentación 5V estable | Sensor de imagen es sensible al ruido |

> Alternativa todo-en-uno: el [XIAO ESP32-S3 Sense](../hardware/devkits/seeed-xiao/xiao-esp32-s3-sense.md) incluye OV2640 + mic PDM + slot de SD card en formato $21 \times 17.5\,\text{mm}$. Ideal para deployment final discreto.

## Por qué ESP32-S3 y no S2 o C3

- **PSRAM 8 MB obligatorio** - un frame OV5640 5MP en RGB565 ocupa 6.6 MB. Sin PSRAM no entra.
- **DMA dedicado para cámara** - captura sin saturar el core
- **Interfaz DVP / MIPI CSI** integrada - única familia que la trae

El C3/C6/H2 no tienen interfaz de cámara. El S2 sí, pero con menos PSRAM.

## Cableado OV2640 (16 pines DVP)

```
OV2640 ESP32-S3-DevKitC-1
───────── ─────────────────
D0 GPIO11
D1 GPIO9
D2 GPIO8
D3 GPIO10
D4 GPIO12
D5 GPIO18
D6 GPIO17
D7 GPIO16
XCLK GPIO15
PCLK GPIO13
VSYNC GPIO6
HREF GPIO7
SDA (SIOD) GPIO4
SCL (SIOC) GPIO5
PWDN GPIO-1 (no usado)
RESET GPIO-1 (no usado)
3V3 3V3
GND GND
```

> Estos pines son los que vienen en el `board_config` default de `esp32-camera` para S3. Si usás un módulo "ESP32-CAM" tradicional (AI Thinker), el pinout es distinto - verificar antes de cablear.

## Frame buffer en PSRAM

```c
camera_config_t config = {
 .pin_pwdn = -1,
 .pin_reset = -1,
 .pin_xclk = 15,
 .pin_sccb_sda = 4,
 .pin_sccb_scl = 5,
 .pin_d7 = 16, .pin_d6 = 17, .pin_d5 = 18,
 .pin_d4 = 12, .pin_d3 = 10, .pin_d2 = 8,
 .pin_d1 = 9, .pin_d0 = 11,
 .pin_vsync = 6,
 .pin_href = 7,
 .pin_pclk = 13,
 .xclk_freq_hz = 20000000,
 .pixel_format = PIXFORMAT_JPEG,
 .frame_size = FRAMESIZE_UXGA, // 1600x1200
 .jpeg_quality = 12, // 0-63, lower = better
 .fb_count = 2,
 .fb_location = CAMERA_FB_IN_PSRAM,
 .grab_mode = CAMERA_GRAB_LATEST,
};

esp_camera_init(&config);
```

## Modos de operación

### 1. Timelapse de bajo consumo

Una foto cada N minutos, guardar en SD o publicar a [MQTT](../conectividad/mqtt-stack.md) como base64 o adjunto.

```c
while (1) {
 camera_fb_t *fb = esp_camera_fb_get();
 save_to_sd(fb); // o publish_jpeg_b64(fb);
 esp_camera_fb_return(fb);
 deep_sleep(15 * 60 * 1000000ULL); // 15 min
}
```

Con deep sleep entre capturas, el nodo puede operar a batería + panel solar pequeño.

### 2. Stream HTTP

Servir un endpoint `/stream` con MJPEG, accesible desde [Grafana](../conectividad/mqtt-stack.md) o un navegador en LAN.

> ⚠️ El stream HTTP **debe quedar en LAN local**. Nunca exponerlo a internet sin auth (es trivial encontrar miles de cámaras ESP32-CAM abiertas en Shodan). Si necesitás acceso remoto, usar túnel VPN/[Tailscale](../seguridad-iot/exposicion-externa.md). Ver [`../seguridad-iot/exposicion-externa.md`](../seguridad-iot/exposicion-externa.md).

### 3. NDVI con filtros

Para [NDVI](../sensores/luz/conceptos-par.md) real necesitás un filtro pasa-NIR delante de la cámara (bloquea rojo y azul, deja pasar NIR e infrarrojo cercano). Filtro Wratten 25A o similar. Procesamiento por pixel:

$$\text{NDVI} = \frac{\text{NIR}_{\text{pixel}} - \text{Rojo}_{\text{pixel}}}{\text{NIR}_{\text{pixel}} + \text{Rojo}_{\text{pixel}}}$$

Más práctico hacer [NDVI](../sensores/luz/conceptos-par.md) con el [AS7341](../sensores/luz/as7341.md), que ya tiene canales separados.

## Almacenamiento

Para timelapse de 6 meses con 1 foto cada 15 min, JPEG ~80 KB cada una:

$$6\,\text{meses} \times 30\,\frac{\text{días}}{\text{mes}} \times 24\,\frac{\text{h}}{\text{día}} \times 4\,\frac{\text{fotos}}{\text{h}} \times 80\,\text{KB} \approx 1.7\,\text{GB}$$

Opciones:

| Opción | Pros | Contras |
|---|---|---|
| MicroSD en el nodo | Local, sin red | Sacar la SD para revisar |
| Publicar JPEG vía [MQTT](../conectividad/mqtt-stack.md) al broker $\rightarrow$ carpeta en el servidor | Centralizado, acceso desde [Grafana](../conectividad/mqtt-stack.md) | Ocupa ancho de banda WiFi |
| Publicar a HTTP server del servidor con POST | Más eficiente que [MQTT](../conectividad/mqtt-stack.md) para binarios | Menos elegante que el flujo [MQTT](../conectividad/mqtt-stack.md) |

## Topics

| Topic | Frecuencia | Contenido |
|---|---|---|
| `greenhouse/zone-A/camera/snapshot` | Cada 15 min | `{"ts","filename","url"}` (apunta a un archivo en el servidor) |
| `greenhouse/zone-A/camera/status` | 1/min | `{"ts","fb_failed","ndvi_mean","frame_size"}` |
| `greenhouse/zone-A/node/heartbeat` | 1/min | Heartbeat estándar |

## Ubicación física

- **Encima del cultivo, mirando hacia abajo** para timelapse/[NDVI](../sensores/luz/conceptos-par.md)
- **Iluminación estable** - sombrear de luz directa intermitente que cambia el balance de blanco frame a frame
- **Fuera del rango de spray de riego** - la lente se ensucia rápido
- **Caja con ventana de vidrio o policarbonato** (no plástico - se opaca con UV en meses)

## Trampas

| Problema | Causa | Fix |
|---|---|---|
| `Camera capture failed` | Cableado D0-D7 invertido o mal contacto | Verificar pin a pin con multímetro |
| Frame mostly green / pink | Sensor power supply ruidoso | Capacitor $100\,\mu\text{F}$ + 100nF muy cerca del módulo cámara |
| Banding horizontal | XCLK frecuencia mal | Probar 10 MHz, 16 MHz, 20 MHz hasta estabilizar |
| White balance variable hora a hora | Auto-WB no compensa cambios de luz lentos | Fijar WB manual durante setup; o procesar offline |
| [OTA](../seguridad-iot/ota-firmado.md) fail después de habilitar PSRAM | Partition table sin espacio para 2 [OTA](../seguridad-iot/ota-firmado.md) + 8MB PSRAM mapping | Custom partition table con `factory + ota_0 + ota_1` + spiffs reducido |
