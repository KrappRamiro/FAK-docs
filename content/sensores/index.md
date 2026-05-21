---
title: "Sensores"
description: "Índice de sensores para monitoreo de invernadero: temperatura, CO2, luz, humedad de suelo y pH."
tags:
  - sensores
  - indice
  - investigacion
---

# Sensores

Cada sensor tiene su propia página con specs, link a fabricante y notas de implementación.

## Temperatura + humedad ambiental

| Sensor                                | Precisión T                   | Precisión HR  | Notas                                                        |
| ------------------------------------- | ----------------------------- | ------------- | ------------------------------------------------------------ |
| [SHT31](temperatura-humedad/sht31.md) | $\pm 0.2\,^\circ\text{C}$     | $\pm 2\%$     | Tolera 5V, generación 3                                      |
| [SHT40](temperatura-humedad/sht40.md) | $\pm 0.2\,^\circ\text{C}$     | $\pm 1.8\%$   | Heater 3 niveles                                             |
| [SHT41](temperatura-humedad/sht41.md) | $\pm 0.2\,^\circ\text{C}$     | $\pm 1.8\%$   | Misma silicon que SHT40, factory cal más rigurosa            |
| [SHT45](temperatura-humedad/sht45.md) | **$\pm 0.1\,^\circ\text{C}$** | **$\pm 1\%$** | Para publicación. Variante con filtro PTFE para invernadero. |
| [SHTC3](temperatura-humedad/shtc3.md) | $\pm 0.2\,^\circ\text{C}$     | $\pm 2\%$     | Footprint ultra-compacto                                     |

## CO2

| Sensor                    | Tecnología | Rango        | Interface | Notas                                         |
| ------------------------- | ---------- | ------------ | --------- | --------------------------------------------- |
| [MH-Z19B](co2/mh-z19b.md) | NDIR       | 0-5000 ppm   | UART      | Económico. **Desactivar ABC en invernadero.** |
| [MH-Z19C](co2/mh-z19c.md) | NDIR       | 0-2000 ppm   | UART      | Mejor resolución en rango más acotado         |
| [SCD41](co2/scd41.md)     | PAS NDIR   | 400-5000 ppm | I2C       | Compensación interna T+HR, mayor estabilidad  |

## Luz / PAR / espectro

Conceptos (lux vs PAR vs PPFD, NDVI): [conceptos-par.md](luz/conceptos-par.md)

| Sensor                                | Mide                                    | Para publicación                                                                   |
| ------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------- |
| [BH1750](luz/bh1750.md)               | Lux                                     | Con limitaciones declaradas (no con LEDs de cultivo)                               |
| [TSL2591](luz/tsl2591.md)             | Lux dinámico                            | Idem BH1750, rango mayor                                                           |
| [AS7341](luz/as7341.md)               | Espectro 11 canales                     | ✅ con calibración contra Apogee                                                   |
| [Apogee SQ-500](luz/apogee-sq-500.md) | PAR $\mu\text{mol}/\text{m}^2/\text{s}$ | ✅ gold standard, trazable a NIST vía transfer standards (no per-unit certificate) |

## Humedad de suelo

Conceptos (calibración gravimétrica, VWC): [vwc.md](humedad-suelo/vwc.md)

| Sensor                                                 | Para publicación                         |
| ------------------------------------------------------ | ---------------------------------------- |
| [Capacitivo v2.0](humedad-suelo/capacitivo-soil-v2.md) | Con calibración gravimétrica documentada |
| [METER TEROS 11](humedad-suelo/teros-11.md)            | ✅ referencia académica                  |

## pH de suelo

> Continuous soil pH measuring is thus very complex and rather infeasible in any practical applications.
> https://www.reddit.com/r/diyelectronics/comments/hsue3w/anyone_know_what_the_deal_with_soil_ph_sensors_is/

## Principio rector para publicación académica

Para peer review, lo que importa **no es la precisión nominal del datasheet**, sino la **trazabilidad** y la **validación cruzada**. Ver [`../investigacion/`](../investigacion/) para detalles. Resumen:

1. ¿El sensor tiene certificado de calibración trazable a un estándar nacional / internacional?
2. ¿Cuál es la deriva documentada en el tiempo?
3. ¿Cómo validaste que las lecturas son correctas en campo?

Un SHT45 sin certificado es **menos válido académicamente** que un SHT31 con [calibración cruzada](../investigacion/calibracion-cruzada.md) documentada contra un instrumento de referencia.
