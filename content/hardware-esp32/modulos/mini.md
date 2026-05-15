# Módulos MINI

Formato compacto: mismas capacidades que [WROOM](./wroom.md) pero menor footprint y menos GPIO accesibles.

## Chips disponibles en formato MINI

- [ESP32-S2](../socs/esp32-s2.md) $\rightarrow$ ESP32-S2-MINI-1 / 1U / MINI-2 / 2U
- [ESP32-S3](../socs/esp32-s3.md) $\rightarrow$ ESP32-S3-MINI-1 / 1U
- [ESP32-C2](../socs/esp32-c2.md) $\rightarrow$ ESP8684-MINI-1 / 1U
- [ESP32-C3](../socs/esp32-c3.md) $\rightarrow$ ESP32-C3-MINI-1 / 1U
- [ESP32-H2](../socs/esp32-h2.md) $\rightarrow$ ESP32-H2-MINI-1 / 1U

> El [ESP32-P4](../socs/esp32-p4.md) hoy no tiene módulo MINI ni WROOM en el catálogo oficial de Espressif - solo se distribuye como SoC bare-die.

## Datasheets oficiales

| Módulo | Datasheet |
|---|---|
| ESP32-S2-MINI-1 / 1U | [PDF](https://www.espressif.com/sites/default/files/documentation/esp32-s2-mini-1_esp32-s2-mini-1u_datasheet_en.pdf) |
| ESP32-S2-MINI-2 / 2U | [PDF](https://www.espressif.com/sites/default/files/documentation/esp32-s2-mini-2_esp32-s2-mini-2u_datasheet_en.pdf) |
| ESP32-S3-MINI-1 / 1U | [PDF](https://www.espressif.com/sites/default/files/documentation/esp32-s3-mini-1_mini-1u_datasheet_en.pdf) |
| ESP32-C3-MINI-1 | [PDF](https://www.espressif.com/sites/default/files/documentation/esp32-c3-mini-1_datasheet_en.pdf) |
| ESP32-H2-MINI-1 / 1U | [PDF](https://www.espressif.com/sites/default/files/documentation/esp32-h2-mini-1_mini-1u_datasheet_en.pdf) |
| ESP8684-MINI-1 / 1U | [PDF](https://www.espressif.com/sites/default/files/documentation/esp8684-mini-1_mini-1u_datasheet_en.pdf) |

## Cuándo elegir MINI vs WROOM

- **Espacio físico limitado** en la PCB / gabinete
- No necesitás acceso a todos los GPIO del chip
- No necesitás PSRAM (las MINI raramente la traen)

Para más GPIO o PSRAM, ir a [WROOM](./wroom.md).
