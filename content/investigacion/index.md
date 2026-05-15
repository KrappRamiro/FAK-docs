---
title: Investigación
---

# Investigación / Paper

Lo que necesitás documentar para que tu sistema pase peer review.

| Archivo | Tema |
|---|---|
| [`metodologia.md`](./metodologia.md) | Arquitectura 2-capas, qué reportar en M&M del paper |
| [`calibracion-cruzada.md`](./calibracion-cruzada.md) | Protocolo de validación: cómo demostrar $R^2 > 0.95$ |
| [`trazabilidad.md`](./trazabilidad.md) | Qué pide un reviewer y por qué |

## Principio rector

**La trazabilidad importa más que la precisión nominal del datasheet.**

Un [SHT45](../sensores/temperatura-humedad/sht45.md) de Temu sin certificado de calibración es **menos válido académicamente** que un [SHT31](../sensores/temperatura-humedad/sht31.md) con [calibración cruzada](calibracion-cruzada.md) documentada contra un instrumento de referencia.

## Stack de publicación

| Capa | Sensor de control | Sensor de referencia |
|---|---|---|
| T + HR aire | [SHT40](../sensores/temperatura-humedad/sht40.md) | [SHT45-AD1F-R2](../sensores/temperatura-humedad/sht45.md) |
| CO2 | [MH-Z19B](../sensores/co2/mh-z19b.md) (ABC off) | [SCD41](../sensores/co2/scd41.md) |
| [PAR](../sensores/luz/conceptos-par.md) | [BH1750](../sensores/luz/bh1750.md) (con limitaciones) | [AS7341](../sensores/luz/as7341.md) + [Apogee SQ-500](../sensores/luz/apogee-sq-500.md) |
| [VWC](../sensores/humedad-suelo/vwc.md) suelo | Capacitivo v2.0 calibrado | [TEROS 11](../sensores/humedad-suelo/teros-11.md) |
| pH suelo | ❌ | Atlas [EZO-pH](../sensores/ph-suelo/ezo-ph.md) |

Los nodos de control son baratos y abundantes - cubren espacialmente todo el invernadero. Los nodos de referencia son pocos (1-2 unidades) y calibrados - son la fuente de verdad contra la que se valida todo lo demás.

## Lo que un reviewer va a preguntar

1. ¿Tiene certificado de calibración trazable a un estándar nacional o internacional?
2. ¿Cuál es la deriva documentada en el tiempo?
3. ¿Cómo validaste que las lecturas son correctas en campo?
4. ¿Cómo manejaste los outliers?
5. ¿Cuál fue el procedimiento de mantenimiento durante el experimento?

## Links de relevancia

[MDPI Sensors in Agriculture and Forestry](https://www.mdpi.com/journal/sensors/topical_collections/sensor_agriculture_forestry)
[Research de American Society of Agronomy, Crop Science Society of America, and Soil Science Society of America](https://acsess.onlinelibrary.wiley.com/)
