---
title: "ESP32-S3"
description: "Ficha del ESP32-S3: Xtensa LX7 dual-core con WiFi 4, BLE 5.0, USB OTG e interfaz de cámara MIPI integrada."
tags:
  - hardware-esp32
  - soc
  - esp32-s3
  - xtensa
  - wifi
  - bluetooth
---

# ESP32-S3

Xtensa LX7, dual-core.

Datasheet oficial: [Espressif ESP32-S3](https://www.espressif.com/en/products/socs/esp32-s3), [Datasheet PDF](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)

## Specs

- Dual-core 240 MHz
- WiFi 4 + BLE 5.0
- 512 KB SRAM, 45 GPIO, 14 canales touch
- **Native USB OTG FS**
- **MIPI Camera + LCD**, SD/MMC - la única familia con interfaz de cámara integrada
- Deep-sleep ~$7\,\mu\text{A}$ (RTC memory powered, peripherals off) - per [datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf), Tabla 5-10
- **Sin DAC** (presente en clásico y S2, desaparece desde S3)
- ISA: Xtensa LX7 (ver [arquitecturas-cpu.md](../arquitecturas-cpu.md))

## Casos de uso típicos

- Cámaras (frame buffer en PSRAM, interfaz DVP/MIPI integrada)
- Display + audio + USB (smart-display, voice assistant)
- Nodos con varios sensores I2C donde el heap holgado importa
- Cualquier proyecto que requiera USB nativo + Bluetooth

## Módulos asociados

- **WROOM-1** / **WROOM-1U** / **WROOM-2** - módulos estándar. Ver [modulos/wroom.md](../modulos/wroom.md).
- **MINI-1** / **MINI-1U** - formato compacto. Ver [modulos/mini.md](../modulos/mini.md).
- Variantes de memoria: `N4`, `N8`, `N16` (flash) + `R2`, `R8` (PSRAM). La variante `N16R8` (16 MB flash + 8 MB PSRAM) es la más usada para cámaras.

## DevKits oficiales y comunes

- [ESP32-S3-DevKitC-1](../devkits/espressif/esp32-s3-devkitc-1.md) - referencia oficial
- [ESP32-S3-DevKitM-1](../devkits/espressif/esp32-s3-devkitm-1.md)
- [ESP32-S3-BOX-3](../devkits/espressif/esp32-s3-box-3.md)
- [ESP32-S3-Korvo-2](../devkits/espressif/esp32-s3-korvo-2.md)
- [XIAO ESP32-S3](../devkits/seeed-xiao/xiao-esp32-s3.md) / [XIAO ESP32-S3 Sense](../devkits/seeed-xiao/xiao-esp32-s3-sense.md)
- [LOLIN S3](../devkits/wemos-lolin/lolin-s3.md)
- [Waveshare ESP32-S3-Zero](../devkits/otros/waveshare-esp32-s3-zero.md)
- [DFRobot FireBeetle 2 ESP32-S3](../devkits/otros/dfrobot-firebeetle-2-esp32-s3.md)
