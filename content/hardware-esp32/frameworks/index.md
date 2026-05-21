---
title: "Frameworks de Firmware"
description: "Catálogo y tabla comparativa de frameworks para programar ESP32: ESP-IDF, Arduino, PlatformIO, Rust y ESPHome."
tags:
  - hardware-esp32
  - indice
---

# Frameworks de Firmware

Catálogo de opciones para programar un ESP32. Cada framework tiene su propia página con docs, casos de uso y trade-offs.

## Por framework

| Framework | Lenguaje | Página |
|---|---|---|
| [ESP-IDF](./esp-idf.md) | C / C++ | SDK oficial de Espressif, FreeRTOS nativo |
| [Arduino](./arduino.md) | C++ Arduino | Capa Arduino sobre ESP-IDF |
| [PlatformIO](./platformio.md) | C / C++ | Tooling sobre Arduino o ESP-IDF |
| [Rust](./rust.md) | Rust | std (con ESP-IDF + FreeRTOS) o no_std (bare metal + [Embassy](https://github.com/embassy-rs/embassy)) |
| [ESPHome](./esphome.md) | YAML | Declarativo, para Home Assistant |

## Tabla resumen

| Framework | Para quién | Pros | Contras |
|---|---|---|---|
| **[ESP-IDF](./esp-idf.md)** | Devs de sistemas, producción | Control total, CMake, FreeRTOS, JTAG/GDB | Curva de aprendizaje, boilerplate |
| **[Arduino](./arduino.md)** | Makers, prototipado | Ecosistema masivo | `delay()` bloquea scheduler |
| **[PlatformIO](./platformio.md)** | Devs con tooling pro | Dep mgmt, unit test, multi-board | Es tooling, necesita Arduino o IDF debajo |
| **[Rust (std)](./rust.md)** | Devs Rust + IoT batería incluida | Type/memory safety, `std::thread`, bindings 1:1 con ESP-IDF | Toolchain Xtensa custom, binario más grande |
| **[Rust (no_std)](./rust.md)** | Devs Rust + footprint/control crítico | Idiomático Rust, async con Embassy, binario chico | Stack más manual (sin batteries de ESP-IDF) |
| **[ESPHome](./esphome.md)** | Usuarios Home Assistant | Zero código, OTA | Sólo dentro de HA |

