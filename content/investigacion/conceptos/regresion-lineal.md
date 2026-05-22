---
title: "Regresión Lineal"
description: "Qué es una regresión lineal, qué son slope e intercept, y cómo leer el output del script de calibración."
tags:
  - investigacion
  - concepto
---

> [!warning] Work In Progress
> Esta sección está en construcción y pendiente de revisión y cambios.

# Regresión Lineal

## Qué es

Imaginá que graficás 1000 puntos donde:
- El eje X es la lectura del sensor barato
- El eje Y es la lectura del sensor de referencia

Esos puntos forman una nube. La regresión lineal encuentra **la línea recta que mejor pasa por el medio de esa nube**.

La ecuación de esa línea es:

$$Y = \text{slope} \times X + \text{intercept}$$

o en palabras: `lectura_referencia ≈ slope × lectura_barata + intercept`

## Qué son slope e intercept

**Slope (pendiente):** cuánto cambia el sensor de referencia por cada unidad que cambia el sensor barato.

| Slope | Qué significa |
|---|---|
| ≈ 1.0 | Los dos sensores escalan igual — ideal |
| 1.05 | El sensor barato lee 5% más bajo de lo que debería — hay que corregir |
| 0.95 | El sensor barato lee 5% más alto de lo que debería |

**Intercept (ordenada al origen):** offset constante entre los dos sensores, independiente del valor medido.

| Intercept | Qué significa |
|---|---|
| ≈ 0 | Sin offset constante — ideal |
| +2.0 | El sensor barato siempre lee 2°C por debajo del real |
| -1.5 | El sensor barato siempre lee 1.5°C por encima del real |

**Coeficientes** es el nombre genérico para slope e intercept juntos.

## Ejemplo en Python

```python
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

# Lecturas del sensor barato y del sensor de referencia (mismos momentos)
barato    = [[20.1], [21.3], [22.0], [23.5], [24.1]]
referencia = [20.4,   21.5,   22.3,   23.7,   24.5]

model  = LinearRegression().fit(barato, referencia)
r2     = r2_score(referencia, model.predict(barato))

print(f"R²        = {r2:.4f}")
print(f"Slope     = {model.coef_[0]:.4f}")
print(f"Intercept = {model.intercept_:.4f}")
```

Output de ejemplo:

```
R²        = 0.9987
Slope     = 1.0245
Intercept = 0.2134
```

Esto se lee: *el sensor barato y el de referencia correlacionan casi perfectamente (R² = 0.9987). Por cada grado que sube el barato, el de referencia sube 1.02°C, más un offset fijo de +0.21°C.*

Un slope de 1.02 y un intercept de 0.21 para temperatura significa que el sensor barato lee sistemáticamente un poco menos que la referencia, pero de forma muy predecible.

## ¿Cuándo aplicar la corrección?

Si R² > 0.95 y slope ≈ 1.0 (±0.05) e intercept ≈ 0 (±0.3 para temperatura):
→ Reportar solo el R² si se publica formalmente. No hace falta aplicar la corrección.

Si R² > 0.95 pero slope o intercept se desvían notablemente:
→ Aplicar la corrección a los datos y reportar la ecuación si se publica formalmente.
