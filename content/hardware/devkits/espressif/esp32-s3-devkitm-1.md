# ESP32-S3-DevKitM-1

DevKit oficial compacto para [ESP32-S3](../../socs/esp32-s3.md). Footprint reducido con módulo MINI.

Docs oficiales: [ESP32-S3-DevKitM-1 user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitm-1/user_guide.html)

## Specs

| Spec | Valor |
|---|---|
| SoC | [ESP32-S3](../../socs/esp32-s3.md) |
| Flash/PSRAM | 8 MB / - (variante **N4R2**: 4 MB / 2 MB) |
| USB | Micro-B $\times 2$ (OTG nativo + bridge) |
| Módulo interno | [MINI-1](../../modulos/mini.md) / MINI-1U |
| GPIO | 36 (todos los GPIO del chip ESP32-S3FN8 ruteados a headers excepto los del SPI flash interno) |
| Extras | RGB LED onboard (GPIO48), footprint reducido vs DevKitC-1 |
## Cuándo elegirlo sobre el DevKitC-1

- Espacio físico limitado en la breadboard / gabinete
- No se necesita PSRAM
- No se necesita acceso a todos los GPIO
