---
title: "Humedad de Suelo"
description: "Comparativa de sensores capacitivos de humedad de sustrato y estrategia de validación con TEROS 11."
tags:
  - sensores
  - indice
  - investigacion
---

# Humedad de Suelo

Sensores para medir humedad volumétrica del sustrato.

> Antes de elegir un sensor: leer [vwc.md](./vwc.md) - qué es VWC, por qué los sensores capacitivos no dan VWC absoluto sin calibración por sustrato, y el procedimiento gravimétrico de calibración.

> Leer https://extension.okstate.edu/fact-sheets/understanding-soil-water-content-and-thresholds-for-irrigation-management

**EL METER TEROS es CARISIMO!**

## Comparativa

| Sensor | Tecnología | Mide | Salida | Para publicación |
| --- | --- | --- | --- | --- |
| [Capacitivo v2.0](./capacitivo-soil-v2.md) | Capacitivo | Humedad relativa al sustrato | Analógico (ADC) | Con [calibración gravimétrica](./vwc.md) documentada |
| [METER TEROS 11](./teros-11.md) | Capacitivo (70 MHz) | VWC + temperatura | SDI-12 / DDI | ✅ referencia académica, factory-calibrated |

## Por qué NO usar sensores resistivos

Los "soil moisture sensors" resistivos (los que tienen dos contactos metálicos expuestos) se corroen en **semanas** por electrólisis en suelo húmedo + 3.3V DC. Dan lecturas no reproducibles y se descalibran continuamente.

**Usar capacitivos (sin contactos expuestos al sustrato) o TEROS 11.**

## Estrategia típica con TEROS 11

Una sola unidad puede usarse como **referencia móvil** rotando entre nodos para [calibración cruzada](../../investigacion/calibracion-cruzada.md):

1. Instalar TEROS 11 + capacitivo v2.0 en el mismo punto durante 2-4 semanas
2. Comparar series temporales paralelas, calcular $R^2$
3. $R^2 > 0.95$ $\rightarrow$ validación aceptada por reviewers
4. Mover el TEROS 11 al siguiente nodo, repetir

Un solo TEROS 11 valida múltiples capacitivos baratos a lo largo del experimento.
