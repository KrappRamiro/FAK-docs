---
title: "ESP32-C3-DevKitC-02"
description: "DevKit oficial de referencia Espressif para ESP32-C3 con 22 GPIO, módulo WROOM-02 y microUSB."
tags:
  - hardware-esp32
  - devkit
  - espressif
  - esp32-c3
---

# ESP32-C3-DevKitC-02

DevKit oficial de entrada para [ESP32-C3](../../socs/esp32-c3.md).

Docs oficiales: [ESP32-C3-DevKitC-02 user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c3/esp32-c3-devkitc-02/user_guide.html)

## Specs

| Spec | Valor |
|---|---|
| SoC | [ESP32-C3](../../socs/esp32-c3.md) |
| Flash/PSRAM | 4 MB / - |
| USB | microUSB, CP2102 bridge |
| Módulo interno | [WROOM-02](../../modulos/wroom.md) / WROOM-02U |
| GPIO | 22 |
| Extras | RGB LED en GPIO8 |
## Casos de uso típicos

- Evaluación RISC-V
- Reemplazo moderno del [ESP8266](../../migracion-esp8266.md)
- Proyectos WiFi + BLE básicos (nodos sensor / actuador / análisis de suelo)

## Hermano con USB nativo

Para flashear y debuggear sin chip bridge, ver [ESP32-C3-DevKit-RUST-1](./esp32-c3-devkit-rust-1.md).
