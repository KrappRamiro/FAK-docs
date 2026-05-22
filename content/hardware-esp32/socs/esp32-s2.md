---
title: "ESP32-S2"
description: "Ficha del ESP32-S2: Xtensa LX7 single-core sin Bluetooth, con USB OTG FS nativo y soporte de hasta 128 MB de flash."
tags:
  - hardware-esp32
  - soc
  - esp32-s2
  - xtensa
  - wifi
---

# ESP32-S2

Xtensa LX7, single-core.

Datasheet oficial: [Espressif ESP32-S2](https://www.espressif.com/en/products/socs/esp32-s2), [Datasheet PDF](https://www.espressif.com/sites/default/files/documentation/esp32-s2_datasheet_en.pdf)

## Specs

- Single-core 240 MHz, **sin Bluetooth**
- WiFi 4
- 320 KB SRAM, 43 GPIO, DAC 2ch, 14 canales touch
- **Native USB OTG FS** (USB 2.0 full-speed device/host) - primero en el lineup
- **Hasta 128 MB** de flash externo soportado - el mayor de la familia
- ULP co-procesador: ULP-RISC-V y ULP-FSM (ambos disponibles)
- Deep-sleep: ~$22\,\mu\text{A}$ con ULP sensor-monitored, ~$20\,\mu\text{A}$ con RTC timer únicamente (per [datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s2_datasheet_en.pdf), Tabla 5-9)
- ISA: Xtensa LX7 (ver [arquitecturas-cpu.md](../arquitecturas-cpu.md))

## Casos de uso típicos

- Proyectos USB device/host (HID, CDC, MSC) sin necesidad de Bluetooth
- IoT seguro donde no se requiere BT
- Cámaras conectadas vía DVP (interface presente)

## Módulos asociados

- **SOLO** / SOLO-2 / SOLO-U / SOLO-2U - módulos single-core específicos del S2. Ver [modulos/solo.md](../modulos/solo.md).
- **MINI-1 / 1U / MINI-2 / 2U** - módulos compactos. Ver [modulos/mini.md](../modulos/mini.md).
- **WROOM / WROOM-I** y **WROVER / WROVER-I** - también disponibles para el S2 (este último con 2 MB PSRAM). Ver [modulos/wroom.md](../modulos/wroom.md) y [modulos/wrover.md](../modulos/wrover.md).

## DevKits

- [ESP32-S2-DevKitC-1](../devkits/espressif/esp32-s2-devkitc-1.md)
- [ESP32-S2-Kaluga-1](../devkits/espressif/esp32-s2-kaluga-1.md)
- [Adafruit ESP32-S2 Feather](../devkits/adafruit/adafruit-feather-s2.md) / [Feather S2 TFT](../devkits/adafruit/adafruit-feather-s2-tft.md)
- [LOLIN S2 Mini](../devkits/wemos-lolin/lolin-s2-mini.md)
