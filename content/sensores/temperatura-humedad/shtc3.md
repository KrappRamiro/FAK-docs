---
title: "SHTC3 (Sensirion)"
description: "Sensor digital de temperatura y humedad relativa en formato ultra-compacto DFN 2×2 mm con interfaz I2C."
tags:
  - sensores
  - componente
  - i2c
  - temperatura
  - humedad
---

# SHTC3 (Sensirion)

Sensor digital de temperatura + humedad relativa, formato ultra-compacto.

Página del fabricante: [Sensirion SHTC3](https://sensirion.com/products/catalog/SHTC3), [Datasheet SHTC3 (PDF)](https://sensirion.com/media/documents/643F9C8E/63A5A436/Datasheet_SHTC3.pdf)

## Specs

| Spec | Valor |
|---|---|
| Precisión temperatura | $\pm 0.2\,^\circ\text{C}$ típica |
| Precisión HR | $\pm 2\%$ RH típica (20-80% RH) |
| Rango operativo | -40 a +125 $^\circ\text{C}$ (datasheet §2.2 Table 4) |
| Heater | No integrado |
| Modos de bajo consumo | Normal / Low-Power / Sleep (datasheet §2.1 Table 3) |
| Voltaje | 1.62-3.6V (típ 3.3V) |
| Interface | I2C @ 0x70 |
| Integridad de datos | CRC-8 (polinomio 0x31, init 0xFF) - datasheet §5.9 |
| Footprint | DFN 2x2x0.75 mm |

## Notas

- **Más chico que SHT4x** - pensado para wearables y dispositivos donde el espacio manda.
- Integrado de fábrica en boards como el [ESP32-C3-DevKit-RUST-1](../../hardware-esp32/devkits/espressif/esp32-c3-devkit-rust-1.md).
- Precisión un escalón abajo del SHT4x - para uso preciso en publicación, preferir [SHT45](sht45.md).
