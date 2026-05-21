---
title: "Módulos WROVER"
description: "Ficha del módulo WROVER: formato con PSRAM integrada para el ESP32 clásico y S2; deprecado en chips modernos a favor de WROOM con sufijo R."
tags:
  - hardware-esp32
  - modulo
---

# Módulos WROVER

Formato del ESP32 clásico (Xtensa LX6) que incluye PSRAM en el módulo. Para el clásico, los WROVER-E / WROVER-IE traen 8 MB PSRAM (variantes EOL trajeron 2 MB). También existe **ESP32-S2-WROVER** / **WROVER-I** con 2 MB PSRAM.

> NOTE: para [S3](../socs/esp32-s3.md) y posteriores no existe variante WROVER, porque la PSRAM va dentro del [WROOM](./wroom.md) con el sufijo `R` (ej. `WROOM-1-N16R8` = WROOM con 16 MB flash + 8 MB PSRAM).

## Datasheets oficiales

| Módulo                     | Datasheet                                                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| ESP32-WROVER-E / IE        | [PDF](https://www.espressif.com/sites/default/files/documentation/esp32-wrover-e_esp32-wrover-ie_datasheet_en.pdf)    |
| ESP32-S2-WROVER / WROVER-I | [PDF](https://www.espressif.com/sites/default/files/documentation/esp32-s2-wrover_esp32-s2-wrover-i_datasheet_en.pdf) |

## Estado de uso

Como el ESP32 clásico tiene una vulnerabilidad de voltage glitching ([Fatal Fury / LimitedResults 2019](../../seguridad-iot/fatal-fury-esp32.md)) y los chips modernos lo reemplazan, los módulos WROVER son **historia** para diseños nuevos. Si necesitás PSRAM, usar [WROOM](./wroom.md) con sufijo `R` en un chip moderno (S3, P4, etc.).
