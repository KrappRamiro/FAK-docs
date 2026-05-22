---
title: "R² — Coeficiente de Determinación"
description: "Qué es R², cómo leerlo, y por qué se usa 0.95 como umbral en papers de sensores."
tags:
  - investigacion
  - concepto
---

> [!warning] Work In Progress
> Esta sección está en construcción y pendiente de revisión y cambios.

# R² — Coeficiente de Determinación

## Qué es

R² (se lee "R cuadrado") es un número entre 0 y 1 que mide **qué tan bien correlacionan las lecturas de dos sensores**.

Si el sensor de referencia sube 1°C, ¿el sensor barato también sube ~1°C? ¿Siempre? ¿O a veces sube 0.5°C y a veces sube 2°C? R² captura eso.

## Cómo leerlo

| Valor de R² | Qué significa |
|---|---|
| 1.00 | Correlación perfecta — cada cambio en uno se refleja exactamente en el otro |
| 0.95 | Muy buena correlación — el 95% de las variaciones de uno las explica el otro |
| 0.80 | Correlación aceptable en algunos contextos, débil para publicación de sensores |
| 0.50 | Correlación débil — los sensores no rastrean bien entre sí |
| 0.00 | Sin relación — uno puede hacer cualquier cosa mientras el otro hace otra |

## Por qué el umbral es 0.95

Es simplemente un minimo que establecimos de forma arbitrara.
Significa que los sensores rastrean juntos lo suficientemente bien como para que los datos del sensor barato sean representativos de lo que mediría el de referencia.

Algunos journals podrian llegar a exigir 0.97. Otros podrian aceptar 0.90 con justificación. **0.95 es el mínimo seguro para no tener problemas a futuros.**

## Qué hacer si R² < 0.95

Antes de descartar los datos, investigar la causa:

- **Los sensores no estaban en el mismo punto**: diferencia espacial real, no error del sensor
- **Uno de los sensores tiene algo mal**: sucio, tapado, mal conectado, firmware con bug
- **Interferencia ambiental**: un sensor en sol directo y el otro no
- **La relación no es lineal**: raro en sensores físicos, pero puede pasar en extremos del rango

Si la causa es corregible, hay que corregir y re-medir.
