# TODO

## Verificar y completar referencias en calibracion-cruzada.md

La sección de referencias de `content/investigacion/calibracion-cruzada.md` fue borrada porque
los papers no fueron verificados contra su contenido real. Algunos tenían autores incorrectos
y descripciones que no coincidían con las conclusiones de los papers.

**Problemas ya confirmados antes de borrar:**

- `doi:10.3390/s24175675` — el primer autor real es **Dubey**, no "Moreno-Rangel".
  El paper además evalúa sensores Senseair/Vaisala, no el MH-Z19B.
- `doi:10.3390/s23052451` — el primer autor real es **Schwamback**, no "Escorihuela".
- `doi:10.5194/amt-17-1317-2024` (Baum 2024) — el paper **rechazó** el MH-Z19 y MH-Z14
  como no aptos para campo. La descripción decía "valida" cuando en realidad los descartó.

---

## Qué hacer

1. Descargar cada PDF de la lista de abajo
2. Pasárselos a Claude junto con el prompt de verificación
3. Con el resultado, reescribir la sección `## Referencias` en `calibracion-cruzada.md`
   usando solo lo que realmente dice cada paper

---

## PDFs a descargar

### Papers académicos (verificar contenido y autores)

| Paper | URL para descargar |
|---|---|
| Spinelle et al. 2015 | https://www.sciencedirect.com/science/article/pii/S092540051500355X |
| Spinelle et al. 2017 | https://www.sciencedirect.com/science/article/pii/S092540051631070X |
| Demanega et al. 2021 | https://www.sciencedirect.com/science/article/pii/S0360132320307836 |
| Baum et al. 2024 | https://amt.copernicus.org/articles/17/1317/2024/ |
| Dubey et al. 2024 *(antes "Moreno-Rangel")* | https://www.mdpi.com/1424-8220/24/17/5675 |
| Bogena et al. 2017 | https://www.mdpi.com/1424-8220/17/1/208 |
| Schwamback et al. 2023 *(antes "Escorihuela")* | https://www.mdpi.com/1424-8220/23/5/2451 |
| Cominelli et al. 2024 | https://acsess.onlinelibrary.wiley.com/doi/10.1002/saj2.20777 |

### Estándares (verificar que el scope coincida con la descripción)

| Documento | URL |
|---|---|
| ISO 5725-1:2023 | https://www.iso.org/standard/69418.html |
| ISO 5725-2:2019 | https://www.iso.org/standard/69419.html |
| WMO-No. 8 (2021) | https://library.wmo.int/records/item/41650 |

### Datasheets de fabricantes (verificar sección y valor exacto)

| Datasheet | URL | Qué verificar |
|---|---|---|
| ~~Sensirion SHT4x~~ | ~~https://sensirion.com/resource/datasheet/sht4x~~ | ~~Drift temp y HR~~ — **HECHO** (v6.4, Table 1 y Table 2) |
| ~~Sensirion SCD4x~~ | ~~https://sensirion.com/resource/datasheet/scd4x~~ | ~~Drift CO2~~ — **HECHO** (v1.7, Table 1, fila "Additional accuracy drift") |
| METER TEROS 11 | https://metergroup.com/support/manuals/ | Buscar manual del TEROS 11 — verificar drift "< 1% / 5 años". Está en la sección de especificaciones del manual, no del producto. |
| Atlas EZO-pH **electrodo** | https://atlas-scientific.com/probes/mini-ph-probe/ | **Ojo:** el drift ~0.1 pH / 4 semanas es del ELECTRODO, no del circuito EZO. El datasheet del circuito no especifica esto. Ir al datasheet del electrodo específico (ENV-40-pH o similar). Buscar sección "Storage and maintenance". |

---

## Verificar drift de sensores sin verificar (tabla en calibracion-cruzada.md)

Los siguientes sensores tienen *(sin verificar)* en la tabla de drift. Hay que abrir el PDF/datasheet
con Claude y preguntar específicamente por el drift a largo plazo.

### BH1750

- **Dónde:** ROHM Semiconductor, página del producto: https://www.rohm.com/products/sensors-mems/light-sensors/bh1750fvi-product
- **Qué buscar:** sección "Electrical Characteristics" o "Reliability" — drift de iluminancia a largo plazo.
- **Advertencia:** es posible que el datasheet de ROHM no especifique drift anual. Si no aparece, el valor `~5% / año` no tiene respaldo y hay que eliminarlo o dejarlo como estimación sin fuente.

### AS7341

- **Dónde:** AMS-OSRAM, página del producto: https://ams-osram.com/products/sensors/color-sensors/ams-as7341-spectral-color-sensor
- **Qué buscar:** sección "Reliability" o "Electro-Optical Characteristics" — degradación del fotodetector o del LED de referencia a largo plazo.
- **Advertencia:** igual que BH1750 — si no está en el datasheet, el valor `~1-2% / año` no tiene respaldo.

### Sensores capacitivos de suelo v2.0

- **Problema:** son sensores genéricos fabricados en China, sin fabricante único ni datasheet oficial. El valor `1-2% VWC / año` es esencialmente inverificable contra una fuente primaria.
- **Qué hacer:** buscar si los papers de Schwamback et al. 2023 o Bogena et al. 2017 (ya en la lista de papers a verificar) reportan degradación a largo plazo de sensores capacitivos genéricos. Si lo hacen, se puede reemplazar el valor con la cita al paper. Si no, eliminar el valor numérico y reemplazar con "no especificado por el fabricante".

### TEROS 11

- **Dónde:** https://metergroup.com/support/manuals/ — buscar "TEROS 11 Manual"
- **Qué buscar:** sección "Specifications" — fila de accuracy o stability a largo plazo.
- **Prompt a usar:**
  ```
  Leé este manual. ¿El TEROS 11 tiene especificado un drift o degradación a largo plazo?
  ¿Dice algo como "< 1% over 5 years" o similar en la sección de especificaciones?
  Citá el texto exacto y la sección donde aparece.
  ```

### Atlas EZO-pH — electrodo

- **Problema:** el circuito EZO-pH tiene su propio datasheet, pero el drift de `~0.1 pH / 4 semanas` es del ELECTRODO, no del circuito. Son productos separados.
- **Dónde:** https://atlas-scientific.com/probes/mini-ph-probe/ — bajar el PDF del electrodo (ENV-40-pH o el que corresponda al que se usa en el proyecto)
- **Qué buscar:** sección "Storage and Maintenance" o "Calibration" — frecuencia de recalibración recomendada y motivo (drift del electrodo).
- **Prompt a usar:**
  ```
  Leé este datasheet. ¿Especifica cada cuánto hay que recalibrar el electrodo de pH?
  ¿Menciona drift o degradación del electrodo? ¿Dice algo como "calibrate every X weeks"?
  Citá el texto exacto y la sección.
  ```

---

## Prompt a usar con Claude

Una vez que tengas los PDFs, abrí una sesión nueva con Claude y pasá cada PDF con este prompt
(reemplazando los campos entre corchetes):

```
Leé este paper completo. Tengo las siguientes afirmaciones sobre él en mi documentación:

1. Autores y año: [AUTORES Y AÑO QUE TENGO]
2. Título: [TÍTULO QUE TENGO]
3. Descripción que escribí: "[DESCRIPCIÓN COMPLETA]"

Para cada punto:
- ¿Los autores y año son correctos?
- ¿El título es correcto?
- ¿La descripción refleja fielmente lo que concluye el paper?
  Si no, explicá qué dice realmente y sugerí una descripción correcta.

Citá párrafos o frases del paper que respalden o contradigan cada afirmación.
```

### Afirmaciones a verificar por paper

**Spinelle et al. 2015** (`doi:10.1016/j.snb.2015.03.031`)
> "Establece el protocolo de co-ubicación de sensor barato junto a sensor de referencia,
> regresión lineal, y reporte de R² y RMSE como criterios de aceptación.
> El paper Part A cubre ozono y NO₂."

**Spinelle et al. 2017** (`doi:10.1016/j.snb.2016.07.036`)
> "Part B: NO, CO and CO₂. Continuación de Part A con la misma metodología."

**Demanega et al. 2021** (`doi:10.1016/j.buildenv.2020.107415`)
> "Valida sensores baratos de temperatura, HR y CO₂ contra instrumentos de referencia
> en condiciones variables. Reporta R², RMSE en unidades físicas, n y período."

**Baum et al. 2024** (`doi:10.5194/amt-17-1317-2024`)
> PROBLEMA CONOCIDO: la descripción original decía que validaba el MH-Z19 y MH-Z14,
> pero el paper los rechazó. Verificar: ¿qué sensores evaluó? ¿cuáles aprobaron?
> ¿dice algo sobre ventana mínima de deployment para CO₂?

**Dubey et al. 2024** (`doi:10.3390/s24175675`) *(autores reales, antes llamado "Moreno-Rangel")*
> PROBLEMA CONOCIDO: autores incorrectos. Verificar autores completos.
> Verificar: ¿evalúa sensores NDIR de bajo costo? ¿reporta drift ~5%/año?
> ¿compara contra referencia con R² y RMSE?

**Bogena et al. 2017** (`doi:10.3390/s17010208`)
> "Calibración de sensores capacitivos de VWC contra sensor de referencia.
> Establece que la calibración de fábrica no es suficiente para sustratos específicos
> y que se necesita calibración site-specific con regresión."
> Nota: el abstract sugiere que usa sensores SMT100, no sensores capacitivos genéricos.
> Verificar si aplica al caso de uso del documento.

**Schwamback et al. 2023** (`doi:10.3390/s23052451`) *(autores reales, antes llamado "Escorihuela")*
> PROBLEMA CONOCIDO: autores incorrectos. Verificar autores completos.
> Verificar: ¿compara sensores capacitivos baratos contra profesionales (TEROS 11)?
> ¿muestra que con calibración individual alcanzan rendimiento comparable?

**Cominelli et al. 2024** (`doi:10.1002/saj2.20777`)
> "Calibración de TEROS 10 y TEROS 12 con ecuaciones site-specific,
> reportando R² y RMSE en unidades de VWC."

**ISO 5725-1:2023**
> "Define formalmente veracidad (systematic offset = slope/intercept) y precisión
> (scatter = RMSE y R²) al comparar un método de medición contra uno de referencia."

**ISO 5725-2:2019**
> "Norma del diseño de experimento: instalar ambos sensores en el mismo punto,
> recolectar N pares de observaciones, calcular estadísticos de comparación."

**WMO-No. 8 (2021)**
> "Cubre distancia de co-ubicación, ventana mínima de intercomparación (2 semanas
> para temp/HR) y criterios de reporte."
