# Módulos WROOM

Módulo estándar para chips dual-core o multi-radio. Es el formato más común en la línea ESP32 moderna.

## Chips que vienen en WROOM

- [ESP32-S2](../socs/esp32-s2.md) $\rightarrow$ ESP32-S2-WROOM / WROOM-I
- [ESP32-S3](../socs/esp32-s3.md) $\rightarrow$ ESP32-S3-WROOM-1 / 1U / 2
- [ESP32-C3](../socs/esp32-c3.md) $\rightarrow$ ESP32-C3-WROOM-02 / 02U
- [ESP32-C5](../socs/esp32-c5.md) $\rightarrow$ ESP32-C5-WROOM-1 / 1U
- [ESP32-C6](../socs/esp32-c6.md) $\rightarrow$ ESP32-C6-WROOM-1 / 1U

> El ESP32 clásico también tenía módulos WROOM (WROOM-32E, WROOM-32UE) pero queda fuera de scope. El [ESP32-S2](../socs/esp32-s2.md) tiene tanto WROOM/WROOM-I como [SOLO](./solo.md) y [WROVER](./wrover.md).

## Datasheets oficiales

| Módulo | Datasheet |
|---|---|
| ESP32-S2-WROOM / WROOM-I | [PDF](https://www.espressif.com/sites/default/files/documentation/esp32-s2-wroom_esp32-s2-wroom-i_datasheet_en.pdf) |
| ESP32-S3-WROOM-1 / 1U | [PDF](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf) |
| ESP32-S3-WROOM-2 | [PDF](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-2_datasheet_en.pdf) |
| ESP32-C3-WROOM-02 / 02U | [PDF](https://www.espressif.com/sites/default/files/documentation/esp32-c3-wroom-02_datasheet_en.pdf) |
| ESP32-C5-WROOM-1 / 1U | [PDF](https://www.espressif.com/sites/default/files/documentation/esp32-c5-wroom-1_wroom-1u_datasheet_en.pdf) |
| ESP32-C6-WROOM-1 / 1U | [PDF](https://www.espressif.com/sites/default/files/documentation/esp32-c6-wroom-1_wroom-1u_datasheet_en.pdf) |

## Variantes de memoria (chips modernos)

Los chips modernos incluyen flash y opcionalmente PSRAM en el mismo módulo vía sufijos:

| Sufijo | Significado |
|---|---|
| `N4` / `N8` / `N16` / `N32` | Flash en MB, temperatura normal (-40 a +$85\,°\text{C}$) |
| `H4` / `H8` | Flash en MB, temperatura alta (-40 a +$105\,°\text{C}$) |
| `R2` / `R8` | PSRAM en MB |

Ejemplo: `ESP32-S3-WROOM-1-N16R8` = 16 MB flash + 8 MB PSRAM.

## Sufijo de antena

| Sufijo | Antena |
|---|---|
| Sin `U` | PCB trace integrada |
| `U` | Conector U.FL para antena externa |
