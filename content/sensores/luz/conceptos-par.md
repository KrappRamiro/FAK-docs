---
title: "Conceptos: Lux, PAR, PPFD, NDVI"
description: "Marco teórico sobre magnitudes de luz para plantas: diferencias entre lux, PAR, PPFD y el índice NDVI."
tags:
  - sensores
  - referencia
  - investigacion
---

# Conceptos: Lux, PAR, PPFD, NDVI

Marco teórico para entender qué miden los distintos sensores de luz / radiación.

## Magnitudes

| Magnitud | Unidad                              | Qué mide                                                                                                                                                                                                |
| -------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Lux**  | lx                                  | Iluminancia ponderada por **percepción humana** (curva fotópica CIE 1924 / ISO 11664, pico 555 nm)                                                                                                      |
| **PAR**  | -                                   | Photosynthetically Active Radiation: el **rango de radiación** 400-700 nm que las plantas usan . No es una unidad                                                                          |
| **PPFD** | $\mu\text{mol}/\text{m}^2/\text{s}$ | Photosynthetic Photon Flux Density - la **unidad de medida** del PAR sobre una superficie. PAR y PPFD se usan a veces como sinónimos pero estrictamente PAR es el concepto/banda, PPFD es cómo lo medís |

La fotosíntesis usa fotones 400-700 nm con eficiencia aproximadamente plana: un fotón rojo (680 nm) y uno azul (450 nm) contribuyen casi igual. El ojo humano, en cambio, es máximamente sensible a verde (555 nm), algo completamente irrelevante para la planta.

## Por qué los luxómetros fallan con LEDs de cultivo

Conversión solar de referencia: **~54 lux $\approx 1$ $\mu\text{mol}/\text{m}^2/\text{s}$**, derivada empíricamente para luz solar con espectro continuo.

Un LED de cultivo emite principalmente en rojo (~660 nm) y azul (~450 nm) - exactamente los colores donde el **ojo humano es menos sensible**. El luxómetro los "ve" como poca luz aunque tengan muchos fotones útiles para la planta.

| Fuente                | Lux medidos | PPFD ($\mu\text{mol}/\text{m}^2/\text{s}$) | Factor lux --> PPFD aproximado |
| --------------------- | ----------- | ------------------------------------------ | ------------------------------ |
| Luz solar             | 54.000      | ~1.000                                     | ~54                            |
| LED blanco cálido     | 54.000      | ~900                                       | ~60                            |
| LED cultivo rojo/azul | 54.000      | ~1.800                                     | ~30                            |
| LED rojo puro 660 nm  | 54.000      | ~3.200                                     | ~17                            |

> Factores ilustrativos derivados de comparaciones de Apogee y Waveform Lighting; no hay una única fuente canónica para LEDs específicos. Para datos exactos en un LED particular, hay que medir contra un quantum sensor como el [Apogee SQ-500](apogee-sq-500.md).

Usar el factor 54 con LEDs de cultivo puede **subestimar el PPFD real entre 2x y 3x**, invalidando análisis de correlación entre radiación y crecimiento vegetal.

## NDVI (Normalized Difference Vegetation Index)

Índice de salud del canopeo:

$$\text{NDVI} = \frac{\text{NIR} - \text{Rojo}}{\text{NIR} + \text{Rojo}}$$

| NDVI      | Estado de la planta             |
| --------- | ------------------------------- |
| 0.6 a 0.9 | Sana, alta densidad foliar      |
| 0.2 a 0.5 | Estrés hídrico o nutricional    |
| 0 a 0.2   | Muy deteriorada o suelo desnudo |
| Negativo  | Agua, roca, sin vegetación      |

Las hojas sanas absorben fuertemente el rojo (~660 nm) para fotosíntesis y reflejan fuertemente el NIR (~800 nm) como mecanismo de protección térmica. Plantas enfermas o estresadas degradan la clorofila y cambian este patrón.

## Sensores por nivel

| Necesidad                                   | Sensor típico                                                     |
| ------------------------------------------- | ----------------------------------------------------------------- |
| Detectar día/noche, trigger de cámara       | [BH1750](bh1750.md) o [TSL2591](tsl2591.md) - solo lux            |
| Calcular PAR real para horticultura / paper | [AS7341](as7341.md) - espectral 11 canales                        |
| Referencia gold standard (calibrar AS7341)  | [Apogee SQ-500](apogee-sq-500.md) - quantum sensor NIST-traceable |
