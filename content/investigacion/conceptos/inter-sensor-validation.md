---
title: "Inter-sensor Validation"
description: "Qué es inter-sensor validation, cómo difiere de absolute calibration, y qué aceptan los journals."
tags:
  - investigacion
  - concepto
---

> [!warning] Work In Progress
> Esta sección está en construcción y pendiente de revisión y cambios.

# Inter-sensor Validation

## Dos tipos de validación

Cuando comparás dos sensores, hay dos situaciones muy distintas:

**Absolute calibration (calibración absoluta):**  
Tu sensor de referencia ya fue calibrado previamente contra un estándar nacional o internacional (NIST en EE.UU.[^nist], PTB en Alemania, etc.).

**Inter-sensor validation:**
Comparás dos sensores entre sí, sin que ninguno tenga certificación externa. El de "referencia" es simplemente el más confiable de los dos según las especificaciones del fabricante, **no un estándar certificado**. El resultado dice _"estos dos sensores tienen las mismas mediciones"_, pero no dice _"ambos miden el valor físico real"_.

## Cuándo aplica cada uno

| Situación                                    | Tipo de validación                                                             |
| -------------------------------------------- | ------------------------------------------------------------------------------ |
| SHT40 validado contra SHT45                  | Inter-sensor (ninguno tiene certificado externo)                               |
| MH-Z19B validado contra SCD41                | Inter-sensor (SCD41 tiene specs muy precisas pero no trazabilidad NIST per se) |
| BH1750 validado contra AS7341                | Inter-sensor (ninguno tiene cal. NIST para PAR)                                |
| Capacitivo suelo calibrado gravimétricamente | Absolute (método físico con masa conocida)                                     |

## Qué aceptan los journals

Depende del journal, habria que verificar las _author guidelines_ antes de asumir que alcanza. Dicho eso, las condiciones mínimas para que un reviewer lo considere válido son:

1. Declararlo explícitamente: "inter-sensor validation against [modelo]", no simplemente un "calibration against reference"
2. Reportar [R²](./r-cuadrado.md), [RMSE](https://es.wikipedia.org/wiki/Ra%C3%ADz_del_error_cuadr%C3%A1tico_medio), n de observaciones pareadas, y la ventana de tiempo
3. Listarlo como limitación en la sección de _Discussion_ o _Limitations_

Sin esas condiciones, es casi seguro que un reviewer lo rechaza. Con ellas, hay chance, pero no es garantía.

## Cómo declararlo si se publica formalmente

Mal (sobredeclara):

> _"Sensors were calibrated against a reference instrument."_

Bien:

> _"BH1750 lux sensors were cross-validated against AS7341 spectral sensors used as relative reference (inter-sensor validation; absolute PAR calibration traceability was not established). Paired deployment over 2 weeks yielded R² = 0.97 ± 0.02 (n = 2016 per node pair, 1-min resolution). Limitations on absolute irradiance accuracy are acknowledged."_

## Por qué importa la distinción

Un reviewer sabe que inter-sensor validation no garantiza exactitud absoluta. Pero también sabe que si R² > 0.95 entre dos sensores distintos del mismo fabricante, los datos son internamente consistentes y reproducibles. Para muchos experimentos de sensores en campo, eso es suficiente.

Lo que **no** podés decir con inter-sensor validation es que tus valores absolutos son exactos. Podés decir que las diferencias relativas entre puntos del experimento son confiables.

[^nist]: NIST (National Institute of Standards and Technology) es el mismo organismo que publica los estándares de ciberseguridad (NIST SP 800, etc.), pero también mantiene patrones físicos de medición: temperatura, masa, longitud, etc. En el contexto de calibración de sensores siempre se habla de esta rama de metrología, no de la de ciberseguridad.
