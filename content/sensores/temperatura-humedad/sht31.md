---
title: "SHT31 (Sensirion)"
description: "Sensor digital de temperatura y humedad relativa generación 3, con soporte hasta 5.5V e interfaz I2C."
tags:
  - sensores
  - componente
  - i2c
  - temperatura
  - humedad
---

# SHT31 (Sensirion)

Sensor digital de temperatura + humedad relativa, generación 3.

Página del fabricante: [Sensirion SHT31-DIS-B](https://sensirion.com/products/catalog/SHT31-DIS-B), [Datasheet SHT3x (PDF)](https://sensirion.com/media/documents/213E6A3B/63A5A569/Datasheet_SHT3x_DIS.pdf)

## Specs

| Spec | Valor |
|---|---|
| Precisión temperatura | $\pm 0.2\,^\circ\text{C}$ típica @ 0-90 $^\circ\text{C}$ (degrada a ~$\pm 0.5\,^\circ\text{C}$ en extremos) |
| Precisión HR | $\pm 2\%$ RH típica |
| Rango operativo | -40 a +125 $^\circ\text{C}$, 0-100 %RH (datasheet Tables 1 y 2) |
| Heater | Integrado, **on/off único** (single-stage). 3.6-33 mW según VDD. No es selectable por niveles - eso es del SHT4x |
| Voltaje | 2.15-5.5V |
| Interface | I2C @ 0x44 (0x45 alt). Max 1 MHz |
| Tiempo de respuesta HR (τ63%) | 8 s |
| Integridad de datos | CRC-8 obligatorio (polinomio 0x31, init 0xFF) |

## Notas

- Más robusto eléctricamente que SHT4x (tolera hasta 5.5V vs 3.6V).
- Heater integrado (single-stage en SHT3x), suficiente para condensación moderada pero limitado en ambientes muy húmedos.
- Buen candidato para prototipado donde el voltaje no es controlado.
- Para publicación académica requiere [calibración cruzada](../../investigacion/calibracion-cruzada.md) contra un instrumento certificado.

## Breakout boards comunes

- [Adafruit SHT31 breakout (#2857)](https://www.adafruit.com/product/2857) con STEMMA QT
