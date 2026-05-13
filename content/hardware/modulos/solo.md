# Módulos SOLO

Específico del **[ESP32-S2](../socs/esp32-s2.md)** (single-core, sin Bluetooth). Footprint similar al [WROOM](./wroom.md) pero con nombre propio. El S2 además tiene variantes WROOM y WROVER en el catálogo Espressif.

## Variantes

| Variante | Antena | Flash interna típica |
|---|---|---|
| ESP32-S2-SOLO | PCB | 4 MB |
| ESP32-S2-SOLO-U | U.FL | 4 MB |
| ESP32-S2-SOLO-2 | PCB | 4 MB + 2 MB PSRAM |
| ESP32-S2-SOLO-2U | U.FL | 4 MB + 2 MB PSRAM |

## Datasheets oficiales

| Módulo | Datasheet |
|---|---|
| ESP32-S2-SOLO / SOLO-U | [PDF](https://www.espressif.com/sites/default/files/documentation/esp32-s2-solo_esp32-s2-solo-u_datasheet_en.pdf) |
| ESP32-S2-SOLO-2 / SOLO-2U | [PDF](https://www.espressif.com/sites/default/files/documentation/esp32-s2-solo-2_esp32-s2-solo-2u_datasheet_en.pdf) |

## Trampa importante

El ESP32-S2-DevKitC-1 es la única excepción a la dicotomía DevKitC $\rightarrow$ WROOM del lineup Espressif: lleva módulos SOLO en lugar de WROOM. Históricamente "DevKitC" se llamaba así por "Compact" (antes de que existieran los formatos MINI), y la convención DevKitC = WROOM se mantuvo en los chips modernos excepto en el S2, porque Espressif eligió darle nombre propio "SOLO" a los módulos single-core del S2.

Ver [ESP32-S2-DevKitC-1](../devkits/espressif/esp32-s2-devkitc-1.md).
