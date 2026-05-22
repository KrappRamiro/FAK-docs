---
title: "Metodología"
description: "Arquitectura de dos capas de sensores y qué reportar en la sección M&M si algún día se publica formalmente."
tags:
  - investigacion
  - guia
---

> [!warning] Work In Progress
> Esta sección está en construcción y pendiente de revisión y cambios.

# Metodología

## Arquitectura de dos capas

```mermaid
graph TD
    Control[Nodos de control - muchos, baratos<br/>SHT40 + MH-Z19B ABC off + BH1750 + capacitivo suelo v2.0]
    Reference[Nodos de referencia - 1 o 2 calibrados<br/>SHT45-AD1F-R2 + SCD41 + AS7341 + Atlas EZO-pH]
    Control -.->|validación cruzada<br/>R² > 0.95| Reference
```

### Por qué dos capas

El problema: los reviewers no confían en sensores baratos *a priori*. Si usás solo nodos baratos, te van a preguntar "¿cómo sabés que son correctos?". No podés responder con el precio ni con el datasheet — tenés que demostrarlo con datos.

La solución: desplegás 1-2 nodos de referencia (sensores más precisos) junto a los baratos durante un período de validación. Demostrás con [$R^2$](./conceptos/r-cuadrado.md) que los baratos rastrean fielmente a los de referencia en tus condiciones reales. Con eso, el reviewer acepta los datos de los baratos porque tenés prueba documentada de que son confiables.

Resultado:

- **Cobertura espacial** → muchos nodos baratos que cubren todo el invernadero
- **Validez académica** → unos pocos nodos de referencia que certifican la confiabilidad de los baratos
- **Costo manejable** → los nodos de referencia son pocos y no necesitan quedarse todo el experimento

### Costo vs precisión

| Aspecto | Solo nodos caros | Solo nodos baratos | Dos capas ✅ |
|---|---|---|---|
| Costo | Prohibitivo a 10+ puntos | Bajo | Medio |
| Cobertura espacial | Limitada (~1-2 puntos) | Excelente | Excelente |
| Validez académica | ✅ directa | Cuestionable | ✅ con validación documentada |
| Riesgo si se rompe uno | Pierdes todo | Pierdes un punto | Si rompiste un control, los demás cubren; si rompiste el referencia, mantenés la cobertura |

---

## Variables del experimento

| Variable | Unidad | Frecuencia | Sensor control | Sensor referencia |
|---|---|---|---|---|
| Temperatura aire | $^\circ\text{C}$ | 1/min | [SHT40](../sensores/temperatura-humedad/sht40.md) | [SHT45-AD1F-R2](../sensores/temperatura-humedad/sht45.md) |
| Humedad relativa aire | % | 1/min | [SHT40](../sensores/temperatura-humedad/sht40.md) | [SHT45-AD1F-R2](../sensores/temperatura-humedad/sht45.md) |
| CO2 | ppm | 1/min | [MH-Z19B](../sensores/co2/mh-z19b.md) (ABC off) | [SCD41](../sensores/co2/scd41.md) |
| [PAR](../sensores/luz/conceptos-par.md) / [PPFD](../sensores/luz/conceptos-par.md) | $\mu\text{mol}/\text{m}^2/\text{s}$ | 1/min | [BH1750](../sensores/luz/bh1750.md) + caveat | [AS7341](../sensores/luz/as7341.md) (inter-sensor) |
| [NDVI](../sensores/luz/conceptos-par.md) | adimensional | 1/15min | ❌ | [AS7341](../sensores/luz/as7341.md) (NIR + F7) |
| [VWC](../sensores/humedad-suelo/vwc.md) suelo | % | 1/15min | Capacitivo v2.0 calibrado | ❌ solo calibración [gravimétrica](https://es.wikipedia.org/wiki/An%C3%A1lisis_gravim%C3%A9trico) |
| Temperatura suelo | $^\circ\text{C}$ | 1/15min | ❌ | ❌ |
| EC suelo | dS/m | 1/15min | ❌ | ❌ |
| pH suelo | pH | **1/semana (muestreo ex-situ)** | ❌ | Atlas [EZO-pH](../sensores/ph-suelo/ezo-ph.md) - muestreo periódico con protocolo suelo:agua (ver [`ph-suelo/README.md`](../sensores/ph-suelo/index.md)). La medición continua in-situ no es metodológicamente válida. |

---

## Procedimiento experimental

### Pre-deployment (1-2 semanas antes)

1. Calibración de sensores capacitivos para el sustrato del experimento (procedimiento [gravimétrico](https://es.wikipedia.org/wiki/An%C3%A1lisis_gravim%C3%A9trico), ver [VWC](../sensores/humedad-suelo/vwc.md))
2. Desactivación de ABC en cada [MH-Z19B](../sensores/co2/mh-z19b.md) vía UART
3. Calibración 3-puntos del electrodo [EZO-pH](../sensores/ph-suelo/ezo-ph.md) con buffers NIST-traceable
4. Deployment del [AS7341](../sensores/luz/as7341.md) como referencia de luz para [inter-sensor validation](./conceptos/inter-sensor-validation.md) contra [BH1750](../sensores/luz/bh1750.md) (sin calibración absoluta de irradiancia)
5. Cross-deployment 1 semana entre nodo de control y nodo de referencia en la misma posición - registrar $R^2$ inicial

### Durante el experimento

- Lecturas continuas según frecuencia tabla anterior
- Heartbeat cada minuto de cada nodo
- Backup diario de InfluxDB en ubicación física separada
- Recalibración de [EZO-pH](../sensores/ph-suelo/ezo-ph.md) cada 4 semanas
- Inspección visual de los nodos (humedad, suciedad, plantas tapando sensores) cada 2 semanas


### Post-experimento

- Recalibración final de capacitivos en mismo sustrato + condiciones, registrar drift
- Cálculo de $R^2$ final entre nodos de control y referencia
- Identificación de outliers y eventos atípicos (cortes de luz, eventos climáticos, intervenciones humanas)

---

## Texto sugerido para sección "Materials and Methods"

> "A two-tier sensor network was deployed in a greenhouse comprising 12 low-cost control nodes for spatial coverage and 2 reference nodes for calibration validation. Control nodes (n=12) were based on [ESP32-C6](../hardware-esp32/socs/esp32-c6.md) microcontrollers (Espressif Systems) reading [SHT40](../sensores/temperatura-humedad/sht40.md) air temperature/humidity sensors (Sensirion AG), [MH-Z19B](../sensores/co2/mh-z19b.md) NDIR CO2 sensors (Winsen Electronics) with Automatic Baseline Correction (ABC) disabled, [BH1750](../sensores/luz/bh1750.md) light sensors (Rohm), and capacitive soil moisture sensors (v2.0, resistive-corrosion-resistant). Reference nodes (n=2) were based on [ESP32-S3](../hardware-esp32/socs/esp32-s3.md) microcontrollers (Espressif Systems) reading [SHT45-AD1F-R2](../sensores/temperatura-humedad/sht45.md) sensors with integrated PTFE filter (Sensirion AG, $\pm 0.1\,^\circ\text{C}$, $\pm 1\%$ RH), [SCD41](../sensores/co2/scd41.md) photoacoustic NDIR CO2 sensors (Sensirion AG, $\pm 40\,\text{ppm}$), [AS7341](../sensores/luz/as7341.md) 11-channel spectral sensors ([ams-OSRAM](../sensores/luz/as7341.md)) used as relative PAR reference (inter-sensor validation; absolute irradiance traceability not established). Soil pH was measured separately via periodic ex-situ sampling (weekly) following [ASTM D4972](https://www.astm.org/d4972-19.html) (1:2.5 soil:water suspension) using an [Atlas Scientific EZO-pH](../sensores/ph-suelo/ezo-ph.md) circuit with laboratory-grade BNC electrode (3-point NIST-traceable calibration before each session). Continuous in-situ measurement of soil pH was excluded as methodologically unreliable. Data from continuous sensors was published via MQTT (TLS-encrypted, mutually authenticated) to a local Mosquitto broker and stored in InfluxDB; pH spot measurements were entered manually with metadata (sample timestamp, soil:water ratio, electrode slope). Low-cost capacitive soil moisture sensors were calibrated gravimetrically for each substrate type by fitting a second-order polynomial regression ($R^2 > 0.98$); cross-validation against a traceable reference was not performed due to instrument unavailability."

---

## Eventos a documentar

Cualquier intervención humana o evento atípico se registra en un log separado:

- Inicio/fin del experimento
- Recalibraciones (qué sensor, qué buffer, slope antes/después)
- Reemplazo de sensores
- Reflasheo de firmware (versión nueva, motivo)
- Eventos climáticos extremos
- Intervenciones de riego manual (fuera del control automatizado)
- Cortes de luz
- Mantenimiento del invernadero (poda, fumigación)

Si se llegara a publicar formalmente, este log se cita como "eventos excluidos del análisis" o se procesa por separado.
