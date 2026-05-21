---
title: "ESP32-S3-Korvo-2"
description: "DevKit de referencia Espressif para asistente de voz con ESP32-S3, array de micrófonos y codec ES8311."
tags:
  - hardware-esp32
  - devkit
  - espressif
  - esp32-s3
---

# ESP32-S3-Korvo-2

DevKit de referencia para asistente de voz basado en [ESP32-S3](../../socs/esp32-s3.md).

Docs oficiales: [ESP32-S3-Korvo-2 V3.1 user guide (ESP-ADF)](https://docs.espressif.com/projects/esp-adf/en/latest/design-guide/dev-boards/user-guide-esp32-s3-korvo-2.html)

## Specs

| Spec | Valor |
|---|---|
| SoC | [ESP32-S3](../../socs/esp32-s3.md) |
| Flash/PSRAM | 16 MB / 8 MB |
| Módulo interno | [WROOM-1](../../modulos/wroom.md) |
| Audio | **2 micrófonos en línea** (near/far-field), codec ES8311, ADC ES7210 (4-channel), amp NS4150 |
| Batería | Li-ion 3.7V (single-cell, opcional) |
| USB | Micro-B x2 (UART vía CP2102N + alimentación) |
## Cuándo elegirlo

- Asistente de voz / wake-word detection
- Beam-forming con array de micrófonos
