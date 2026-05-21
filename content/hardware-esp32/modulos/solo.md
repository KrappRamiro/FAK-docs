---
title: "Módulos SOLO"
description: "Ficha del módulo SOLO: exclusivo del ESP32-S2, con variantes de antena PCB y U.FL y opciones con 2 MB PSRAM."
tags:
  - hardware-esp32
  - modulo
  - esp32-s2
---

# Módulos SOLO

Específico del **[ESP32-S2](../socs/esp32-s2.md)** (single-core, sin Bluetooth). Footprint similar al [WROOM](./wroom.md). El S2 además tiene variantes [WROOM](./wroom.md) y [WROVER](./wrover.md) en el catálogo de Espressif.

## Variantes

| Variante         | Antena | Flash interna típica |
| ---------------- | ------ | -------------------- |
| ESP32-S2-SOLO    | PCB    | 4 MB                 |
| ESP32-S2-SOLO-U  | U.FL   | 4 MB                 |
| ESP32-S2-SOLO-2  | PCB    | 4 MB + 2 MB PSRAM    |
| ESP32-S2-SOLO-2U | U.FL   | 4 MB + 2 MB PSRAM    |

## Datasheets oficiales

| Módulo                    | Datasheet                                                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| ESP32-S2-SOLO / SOLO-U    | [PDF](https://www.espressif.com/sites/default/files/documentation/esp32-s2-solo_esp32-s2-solo-u_datasheet_en.pdf)    |
| ESP32-S2-SOLO-2 / SOLO-2U | [PDF](https://www.espressif.com/sites/default/files/documentation/esp32-s2-solo-2_esp32-s2-solo-2u_datasheet_en.pdf) |

## A tener en cuenta

El ESP32-S2-DevKitC-1 es el unico DevKitC de Espressif que no usa [WROOM](./wroom.md), sino que usa módulos SOLO.

Ver [ESP32-S2-DevKitC-1](../devkits/espressif/esp32-s2-devkitc-1.md).
