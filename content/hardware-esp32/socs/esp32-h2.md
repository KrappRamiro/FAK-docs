---
title: "ESP32-H2"
description: "Ficha del ESP32-H2: RISC-V sin WiFi, con BLE 5.0 y 802.15.4; optimizado para end-nodes Thread/Zigbee a batería."
tags:
  - hardware-esp32
  - soc
  - esp32-h2
---

# ESP32-H2

RISC-V, single-core. **Sin WiFi.**

Datasheet oficial: [Espressif ESP32-H2](https://www.espressif.com/en/products/socs/esp32-h2), [Datasheet PDF](https://www.espressif.com/sites/default/files/documentation/esp32-h2_datasheet_en.pdf)

## Specs

- Single-core 96 MHz
- **Sin WiFi**, BLE 5.0 + 802.15.4
- 320 KB HP SRAM + 4 KB LP SRAM, 19 GPIO (QFN32)
- USB Serial/JTAG nativo
- Deep-sleep ~$7\,\mu\text{A}$ (LP timer + LP memory) - per [datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-h2_datasheet_en.pdf), Tabla 5-9
- ISA: RISC-V (ver [arquitecturas-cpu.md](../arquitecturas-cpu.md))

## Casos de uso típicos

- End-nodes 802.15.4 (Thread/Zigbee) a batería con duración de años
- Sensores remotos donde el ratio "BLE/Thread + bajo consumo" es la prioridad y WiFi no se necesita

## Módulos asociados

- **MINI-1** / **MINI-1U** - formato compacto. Ver [modulos/mini.md](../modulos/mini.md).

## DevKits comunes

- [ESP32-H2-DevKitM-1](../devkits/espressif/esp32-h2-devkitm-1.md)
