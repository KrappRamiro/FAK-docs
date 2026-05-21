---
title: "Hardware ESP32"
description: "Índice y árbol de decisión rápido para elegir chip y DevKit en la línea ESP32 de Espressif."
tags:
  - hardware-esp32
  - indice
---

## Árbol de decisión rápido

### ¿Qué chip uso?

```mermaid
graph TD
    Q1{¿Cámara o video?}
    Q1 -->|Sí| S3[ESP32-S3<br/>N16R8 para PSRAM 8 MB]
    Q1 -->|No| Q2{¿BT Classic - audio A2DP?}
    Q2 -->|Sí| Classic[ESP32 clásico<br/>único con BT Classic]
    Q2 -->|No| C3[ESP32-C3<br/>RISC-V, WiFi+BLE, barato, USB-JTAG nativo]
```

### ¿Qué DevKit compro?

Recomendaciones por caso de uso típico:

| Caso                                                               | DevKit típico                                                                                                                    |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Cámara o nodo de referencia con muchos sensores                    | [ESP32-S3-DevKitC-1](devkits/espressif/esp32-s3-devkitc-1.md) **N16R8**                                                          |
| Nodo sensor / actuador / análisis de suelo (WiFi + GPIO + I2C/ADC) | [ESP32-C3-DevKitC-02](devkits/espressif/esp32-c3-devkitc-02.md)                                                                  |
| Dispositivo Matter / Thread / Zigbee                               | [ESP32-C6-DevKitC-1](devkits/espressif/esp32-c6-devkitc-1.md) o [ESP32-H2-DevKitM-1](devkits/espressif/esp32-h2-devkitm-1.md)    |
| Audio Bluetooth Classic (A2DP)                                     | ESP32 clásico (no documentado en este repo, ver [Fatal Fury ESP32](../seguridad-iot/fatal-fury-esp32.md)) |

Detalle de variantes y trampas en [`devkits.md`](./devkits.md).
