---
title: "ESP32-C2 (a.k.a. ESP8684)"
description: "Ficha del ESP32-C2: el SoC RISC-V más pequeño y barato del lineup, orientado a producción en volumen."
tags:
  - hardware-esp32
  - soc
  - esp32-c2
---

# ESP32-C2 (a.k.a. ESP8684)

RISC-V, single-core.

Datasheet oficial: [Espressif ESP32-C2 / ESP8684](https://www.espressif.com/en/products/socs/esp32-c2), [Datasheet PDF](https://www.espressif.com/sites/default/files/documentation/esp8684_datasheet_en.pdf)

## Specs

- Single-core 120 MHz
- WiFi 4 + BLE 5.0
- 272 KB SRAM (16 KB para cache), 14 GPIO (menos que el [ESP8266](../migracion-esp8266.md))
- El die más pequeño y barato del lineup
- Sin DAC, sin touch, sin PSRAM, **sin USB** (solo JTAG por pines GPIO para debug)
- Deep-sleep ~$5\,\mu\text{A}$ - per [datasheet](https://www.espressif.com/sites/default/files/documentation/esp8684_datasheet_en.pdf)
- ISA: RISC-V (ver [arquitecturas-cpu.md](../arquitecturas-cpu.md))

## Casos de uso típicos

- Volumen alto (>10k unidades) donde de diferencia importa
- BOM mínimo en producción
- **No recomendado para desarrollo / hobby** - pocos DevKits, GPIO escasos

## Módulos asociados

- **ESP8684-MINI-1 / 1U** - formato compacto. Ver [modulos/mini.md](../modulos/mini.md).
- **ESP8684-WROOM-01C / 02C / 02UC / 03 / 04C / 05 / 06C / 07** - varios formatos WROOM, ver [catálogo Espressif](https://www.espressif.com/en/products/socs/esp32-c2). El C2 tiene más variantes de módulo WROOM que la mayoría del lineup.
