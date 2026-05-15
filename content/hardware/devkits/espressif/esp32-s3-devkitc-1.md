# ESP32-S3-DevKitC-1

DevKit oficial de referencia para [ESP32-S3](../../socs/esp32-s3.md).

Docs oficiales: [ESP32-S3-DevKitC-1 user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide.html)

## Specs

| Spec | Valor |
|---|---|
| SoC | [ESP32-S3](../../socs/esp32-s3.md) |
| Flash/PSRAM | 8 MB / 2 MB (variante **N16R8**: 16 MB / 8 MB) |
| USB | Micro-B x2 (OTG nativo + bridge) |
| Módulo interno | [WROOM-1](../../modulos/wroom.md) / WROOM-1U / WROOM-2 |
| GPIO | 45 |
| Extras | RGB LED onboard |
## Variantes de módulo

| Part number | Flash | PSRAM | Antena |
|---|---|---|---|
| `ESP32-S3-WROOM-1-N8` | 8 MB | ❌ | PCB |
| `ESP32-S3-WROOM-1-N8R2` | 8 MB | 2 MB | PCB |
| `ESP32-S3-WROOM-1-N16R8` | 16 MB | 8 MB | PCB |
| `ESP32-S3-WROOM-1U-N16R8` | 16 MB | 8 MB | U.FL (externa) |
| `ESP32-S3-WROOM-2-N32R8V` | 32 MB octal | 8 MB octal | PCB |

## Casos de uso típicos

- Cámaras (PSRAM 8 MB + interfaz DVP/MIPI)
- Nodos de referencia con muchos sensores I2C (heap holgado)
- Display + audio + USB nativo
