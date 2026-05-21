---
title: "Temperatura + Humedad Ambiental"
description: "Comparativa de la familia SHT de Sensirion para temperatura y humedad relativa en aplicaciones de invernadero."
tags:
  - sensores
  - indice
  - i2c
---

# Temperatura + Humedad Ambiental

Familia SHT de Sensirion - sensores digitales I2C para temperatura del aire y humedad relativa.

Página del fabricante: [Sensirion Humidity & Temperature Sensors](https://sensirion.com/products/sensor-portfolio/humidity-and-temperature-sensors)

## Comparativa

| Sensor | Generación | Precisión T | Precisión HR | Voltaje | Heater | Para publicación |
|---|---|---|---|---|---|---|
| [SHT31](./sht31.md) | 3ra | $\pm 0.2^\circ\text{C}$ | $\pm 2\%$ | 2.15-5.5V | 1 nivel | Con [calibración cruzada](../../investigacion/calibracion-cruzada.md) |
| [SHT40](./sht40.md) | 4ta | $\pm 0.2^\circ\text{C}$ | $\pm 1.8\%$ | 1.08-3.6V | 3 niveles | Con [calibración cruzada](../../investigacion/calibracion-cruzada.md) |
| [SHT41](./sht41.md) | 4ta | $\pm 0.2^\circ\text{C}$ | $\pm 1.8\%$ | 1.08-3.6V | 3 niveles | Mismo silicon que SHT40, factory cal más rigurosa |
| [SHT45](./sht45.md) | 4ta | $\pm 0.1^\circ\text{C}$ | **$\pm 1\%$** | 1.08-3.6V | 3 niveles | ✅ directo (variante AD1F-R2 con filtro PTFE) |
| [SHTC3](./shtc3.md) | ❌ | $\pm 0.2^\circ\text{C}$ | $\pm 2\%$ | 1.62-3.6V | ❌ | Footprint ultra-compacto (2x2x0.75 mm) |

## Notas comunes

- Todos hablan I2C estándar (excepto SHTC3 que está @ 0x70, los demás @ 0x44)
- SHT4x y SHT3x tienen comandos CRC-8 obligatorios para validar lecturas
- Filtro PTFE (sufijo `F` en SHT45-AD1F-R2) es **no-negociable** en ambientes con condensación / nebulización
- Sensirion documenta deriva típica < 0.5 $^\circ\text{C}$ / año en condiciones controladas; en campo, recalibración cruzada cada temporada es necesario

