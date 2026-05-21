---
title: "ESP32-C5"
description: "Ficha del ESP32-C5: único ESP32 con WiFi 6 dual-band (2.4 + 5 GHz), BLE 5.0 y 802.15.4 en RISC-V."
tags:
  - hardware-esp32
  - soc
  - esp32-c5
---

# ESP32-C5

RISC-V, single-core + LP co-processor.

Datasheet oficial: [Espressif ESP32-C5](https://www.espressif.com/en/products/socs/esp32-c5)

## Specs

- Single-core HP 240 MHz + LP RISC-V co-processor 48 MHz
- **WiFi 6 dual-band (2.4 GHz + 5 GHz)** - único ESP32 con 5 GHz
- BLE 5.0 (Bluetooth Core 6.0 certified)
- **802.15.4** (Thread 1.4, Zigbee 3.0) - además del C6 y H2
- 384 KB HP SRAM + 16 KB LP SRAM, 29 GPIO (QFN48)
- USB Serial/JTAG nativo
- Deep-sleep ~$12\,\mu\text{A}$ (RTC timer + LP memory) - per [datasheet](https://documentation.espressif.com/esp32-c5_datasheet_en.pdf), Tabla 5-12
- ISA: RISC-V (ver [arquitecturas-cpu.md](../arquitecturas-cpu.md))

## Casos de uso típicos

- Dispositivos que deben conectarse a redes WiFi 6 en banda de 5 GHz exclusivas
- Reducir congestión en entornos con muchos dispositivos 2.4 GHz

## DevKits comunes

- [ESP32-C5-DevKitC-1](../devkits/espressif/esp32-c5-devkitc-1.md)
- [XIAO ESP32-C5](../devkits/seeed-xiao/xiao-esp32-c5.md)
