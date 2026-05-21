---
title: "Calibración Cruzada"
description: "Protocolo de validación de sensores baratos contra referencia para demostrar R² > 0.95."
tags:
  - investigacion
  - guia
---

# Calibración Cruzada

## Qué es

Comparar lecturas paralelas de un sensor barato con un sensor calibrado (referencia) durante una ventana suficientemente larga, en condiciones reales del experimento. Resultado: una correlación cuantitativa ($R^2$) y opcionalmente una ecuación de corrección.

```mermaid
graph TD
    A[Sensor barato] -->|deployment paralelo<br/>en mismo punto<br/>N semanas| C[ADC raw o lectura cruda]
    B[Sensor referencia] -->|deployment paralelo<br/>en mismo punto<br/>N semanas| D[Lectura calibrada<br/>en unidades reales]
    C --> E[Regresión lineal]
    D --> E
    E --> F[Coeficientes + R²]
    F --> G{R² > 0.95?}
    G -->|Sí| H[Aceptable para paper]
    G -->|No| I[Investigar o aplicar corrección]

greenhouse/zone-A/sht40/data ← control
greenhouse/reference/sht45/data ← referencia
sql
SELECT mean("temp_c")
FROM "sht40"
WHERE time > now - 14d
GROUP BY time(1m)
bash
influx query 'from(bucket: "sensors") |> range(start: -14d) ...' \
 --raw > control_temp.csv
python
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

control = pd.read_csv("control_temp.csv", parse_dates=["time"])
ref = pd.read_csv("ref_temp.csv", parse_dates=["time"])

merged = pd.merge_asof(
 control.sort_values("time"),
 ref.sort_values("time"),
 on="time", direction="nearest",
 tolerance=pd.Timedelta("1min"),
 suffixes=("_control", "_ref"),
).dropna()

X = merged[["temp_c_control"]].values
y = merged["temp_c_ref"].values

model = LinearRegression().fit(X, y)
y_pred = model.predict(X)
r2 = r2_score(y, y_pred)

print(f"R² = {r2:.4f}")
print(f"Slope = {model.coef_[0]:.4f}")
print(f"Intercept = {model.intercept_:.4f}")
python
df["rolling_mean"] = df["value"].rolling(window=60).mean()
df["rolling_std"] = df["value"].rolling(window=60).std()
df["outlier"] = abs(df["value"] - df["rolling_mean"]) > 3 * df["rolling_std"]
```

---

## Drift temporal

Los sensores derivan en el tiempo. Para detectarlo:

1. **Pre-experimento:** medir cross-calibration. $R^2$ inicial.
2. **Post-experimento:** medir cross-calibration nuevamente. $R^2$ final.
3. Si $R^2_{\text{final}} < R^2_{\text{inicial}} - 0.02$, hay drift. Reportar en limitaciones del paper.

Drift típico por sensor:

| Sensor                                                                 | Drift esperado                                                                                                                              |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| [SHT45](../sensores/temperatura-humedad/sht45.md) (con filtro PTFE) | < 0.03 $^\circ\text{C}$ / año (típ.), máx. < 0.04 $^\circ\text{C}$ / año [^sht45drift]                                                                  |
| [SHT40](../sensores/temperatura-humedad/sht40.md)                   | < 0.2 %RH / año (típ.) [^sht40drift]                                                                                                       |
| [MH-Z19B](../sensores/co2/mh-z19b.md) (ABC off)                     | No especificado. Precisión declarada: ±(50 ppm + 3% lectura). [^mhz19b]                                                                    |
| [SCD41](../sensores/co2/scd41.md)                                   | ±(5 ppm + 0.5% lectura) / año — solo a partir del año 5 de operación [^scd41drift]                                                         |
| [BH1750](../sensores/luz/bh1750.md)                                 | ~5% / año *(sin verificar)*                                                                                                                 |
| [AS7341](../sensores/luz/as7341.md)                                 | ~1-2% / año *(sin verificar)*                                                                                                               |
| Capacitivo suelo                                                       | 1-2% [VWC](../sensores/humedad-suelo/vwc.md) / año *(sin verificar)*                                                                       |
| [TEROS 11](../sensores/humedad-suelo/teros-11.md)                   | < 1% / 5 años (factory cal) *(sin verificar)*                                                                                               |
| Atlas [EZO-pH](../sensores/ph-suelo/ezo-ph.md)                      | ~0.1 pH / 4 semanas — valor del electrodo, no del circuito EZO. Ver datasheet del electrodo específico. *(sin verificar)* — recalibrar      |

[^mhz19b]: El datasheet de Winsen (v1.0) no especifica drift temporal. La precisión declarada es ±(50 ppm + 3% del valor leído) y la vida útil > 5 años. El ABC (autocorrección automática) asume 400 ppm como baseline y el fabricante lo declara explícitamente no apto para invernadero/granja (el ABC, no el sensor en si! Ver página 9 del datasheet, sección "8. ZERO point calibration", bajo "ABC logic function"). Ver [mhz19b](../sensores/co2/mh-z19b.md) para ver como desactivar el ABC

[^sht45drift]: Sensirion SHT4x Datasheet v6.4 (Nov 2023), sección 2.2 "Temperature", Table 2, fila "Long-term drift". Disponible en [sensirion.com/resource/datasheet/sht4x](https://sensirion.com/resource/datasheet/sht4x).

[^sht40drift]: Sensirion SHT4x Datasheet v6.4 (Nov 2023), sección 2.1 "Relative Humidity", Table 1, fila "Long-term drift". Mismo documento que [^sht45drift].

[^scd41drift]: Sensirion SCD4x Datasheet v1.7 (Apr 2025), sección 1.1 "CO2 Sensing Performance", Table 1, fila "Additional accuracy drift per year, starting after five years". El drift solo aplica a partir del quinto año de operación continua. Disponible en [sensirion.com/resource/datasheet/scd4x](https://sensirion.com/resource/datasheet/scd4x).
