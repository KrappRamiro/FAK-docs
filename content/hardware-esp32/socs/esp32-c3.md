---
title: "ESP32-C3"
description: "Ficha del ESP32-C3: RISC-V single-core con WiFi 4, BLE 5.0 y USB Serial/JTAG nativo; reemplazo moderno del ESP8266."
tags:
  - hardware-esp32
  - soc
  - esp32-c3
---

# ESP32-C3

RISC-V, single-core.

Datasheet oficial: [Espressif ESP32-C3](https://www.espressif.com/en/products/socs/esp32-c3), [Datasheet PDF](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf)

## Specs

- Single-core 160 MHz
- WiFi 4 + BLE 5.0
- 400 KB SRAM (16 KB para cache) + 8 KB RTC SRAM, 22 GPIO
- **USB Serial/JTAG nativo integrado** - flasheo y debug sin chip bridge externo
- 6 canales ADC, **todos ADC1** (no existe la restricción ADC2/WiFi del clásico)
- Sin DAC, sin touch, sin PSRAM in-package
- Deep-sleep ~$5\,\mu\text{A}$ (RTC timer + RTC memory) - per [datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf), Tabla 5-9
- ISA: RISC-V (ver [arquitecturas-cpu.md](../arquitecturas-cpu.md))

## Casos de uso típicos

- Reemplazo moderno del [ESP8266](../migracion-esp8266.md) (ver guía de migración)
- Nodos sensor / actuador básicos con WiFi + BLE
- Cualquier proyecto donde alcance con I2C / UART / ADC y no se necesite cámara, PSRAM o BT Classic

## Módulos asociados

- **WROOM-02** / **WROOM-02U** - módulos estándar. Ver [modulos/wroom.md](../modulos/wroom.md).
- **MINI-1** / **MINI-1U** - formato compacto. Ver [modulos/mini.md](../modulos/mini.md).

## DevKits comunes

- [ESP32-C3-DevKitC-02](../devkits/espressif/esp32-c3-devkitc-02.md) - referencia oficial
- [ESP32-C3-DevKit-RUST-1](../devkits/espressif/esp32-c3-devkit-rust-1.md)
- [XIAO ESP32-C3](../devkits/seeed-xiao/xiao-esp32-c3.md)
- [Adafruit QT Py ESP32-C3](../devkits/adafruit/adafruit-qt-py-c3.md)
