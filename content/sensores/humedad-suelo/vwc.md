# Volumetric Water Content (VWC)

## Qué es

VWC es la forma estándar de expresar humedad de suelo en ciencia agronómica:

$$\text{VWC} = \frac{V_{\text{agua}}}{V_{\text{suelo}}}$$

Ejemplo: 100 $\text{cm}^3$ de suelo con 30 $\text{cm}^3$ de agua $\rightarrow$ $\text{VWC} = 0.30 = 30\%$.

Es la **unidad física real**, comparable entre estudios y citable en literatura. Un "porcentaje de humedad" genérico sin esta definición no es reproducible entre laboratorios.

---

## Por qué los sensores baratos no dan VWC directamente

Un sensor capacitivo de suelo reporta un valor ADC crudo (ej. `1850`). Ese número solo **no significa nada universalmente**:

- El mismo valor `1850` puede ser **20% VWC en tierra negra**
- O **35% VWC en arena gruesa**
- O **15% VWC en sustrato de coco**

La capacitancia depende de la **composición mineral, porosidad y densidad aparente** del sustrato. Para obtener VWC real necesitás una **curva de calibración por sustrato**.

---

## Curva de calibración

### Materiales

- Muestra del sustrato que vas a usar en el invernadero
- Balanza de precisión (0.1 g resolución mínimo)
- Recipiente de volumen conocido (ej. cilindro 1000 $\text{cm}^3$)
- Agua destilada
- Horno o estufa

### Procedimiento

**1. Secado completo**
Secar el sustrato en horno a **105 $^\circ$C por 24h** (per ASTM D2216). Garantiza VWC = 0% como punto de partida.

> ⚠️ **Excepción para sustratos con alto contenido orgánico** (coco coir, peat moss, turba, mezclas con > 30% materia orgánica): [Cobos & Chambers (2010)](https://www.onsetcomp.com/sites/default/files/resources-documents/15922-C%20Calibrating%20ECH2O%20Soil%20Moisture%20Sensors.pdf) recomienda **60-70 $^\circ$C por al menos 48h** en lugar de 105 $^\circ$C, porque a temperaturas altas se pierden compuestos orgánicos volátiles y la masa "seca" queda subestimada (= VWC sobreestimado). Cita textual: *"soils with high organic matter content may lose significant volatile organics if dried at 105 C ... We recommend drying these soils at 60 – 70 C for at least 48 hours."*

**2. Medición en seco**
Insertar el sensor en el sustrato seco, registrar valor ADC. Punto `(ADC_seco, VWC = 0%)`.

**3. Hidratación incremental**
Agregar agua en incrementos conocidos (ej. 10 ml cada vez). En cada paso:
- Mezclar homogéneamente
- Esperar 5 min
- Registrar ADC

**4. VWC real en cada punto**

$$\text{VWC} = \frac{V_{\text{agua acumulada}}\,[\text{mL}]}{V_{\text{recipiente}}\,[\text{cm}^3]}$$

**5. Regresión**
Graficar ADC vs VWC y ajustar. Per Cobos & Chambers (2010), una regresión **lineal** funciona para la mayoría de los sustratos minerales:

$$\text{VWC} = m \cdot \text{ADC} + n$$

Para sensores con respuesta no-lineal (típico en sustratos orgánicos o EC alto) o cuando el R² del ajuste lineal queda bajo, pasar a **polinomio de segundo grado**:

$$\text{VWC} = a \cdot \text{ADC}^2 + b \cdot \text{ADC} + c$$

Un $R^2 > 0.95$-0.98 es esperable con sensores capacitivos de buena calidad post-calibración (Cobos & Chambers no publica un threshold formal; los valores se citan como práctica de la comunidad).

### Ejemplo de tabla

| Agua agregada (ml) | VWC calculado | ADC medido |
|---|---|---|
| 0 | 0% | 3100 |
| 50 | 5% | 2850 |
| 100 | 10% | 2600 |
| 200 | 20% | 2200 |
| 300 | 30% | 1850 |
| 400 | 40% | 1500 |
| 500 (saturación) | 50% | 1200 |

---

## Implementación en firmware (ESP32)

Una vez obtenida la ecuación, hardcodear coeficientes:

Si tenés varios sensores y cada uno requiere su propio set de coeficientes, guardarlos en [NVS](../../seguridad-iot/secrets-en-firmware.md) (Non-Volatile Storage) indexados por ID de sensor - así no tenés que recompilar el firmware al recalibrar.

---

## Consideraciones para publicación académica

### Documentar en metodología

> *"Soil moisture sensors were calibrated against gravimetrically determined VWC for each substrate type. Calibration curves were obtained by fitting a second-order polynomial regression ($R^2 > 0.98$) to paired ADC-VWC observations across the full moisture range (0 - field capacity)."*

### Factores de deriva a declarar

| Factor | Efecto | Mitigación |
|---|---|---|
| Temperatura del suelo | $\pm 0.1\%$ VWC por $^\circ$C | Compensar con lectura simultánea de temp. suelo |
| Salinidad (EC alto) | Sobreestima VWC | Calibrar con sustrato + fertilizante a EC típico |
| Variabilidad entre unidades | Hasta $\pm 5\%$ entre sensores del mismo lote | Calibrar cada sensor individualmente |
| Deriva temporal | ~1-2% VWC por año | Recalibrar cada temporada |

### Validación cruzada con sensor de referencia

Instalar un **[METER TEROS 11](teros-11.md)** en el mismo punto que uno de los sensores baratos durante 2-4 semanas y comparar series temporales:

- Si $R^2 > 0.95$ $\rightarrow$ validación aceptada por reviewers
- El [TEROS 11](teros-11.md) no necesita estar permanente - usarlo como **referencia móvil**
- Un [TEROS 11](teros-11.md) puede validar múltiples nodos en distintos momentos del experimento

---

## Sensores

### Para control / automatización
- **Sensor capacitivo genérico v2.0** (AliExpress/Temu) - el del kit
- Salida analógica $\rightarrow$ ADC del [ESP32](../../hardware-esp32/socs/index.md)
- Requiere calibración por sustrato
- **No usar sensores resistivos** - se corroen en semanas

### Para investigación / publicación
- **[METER TEROS 11](teros-11.md)** - VWC + temperatura de suelo (no mide EC; el TEROS 12 sí)
 - Salida SDI-12
 - Referencia estándar en papers agronómicos
 - No requiere calibración propia - certificado de fábrica

---

## Referencias

- Decagon Devices / METER Group. *[TEROS 11](teros-11.md) Integrator Guide*
- Cobos, D.R. & Chambers, C. (2010). *Calibrating ECH2O Soil Moisture Sensors*. Decagon Application Note
- Metodología de calibración gravimétrica: [**estándar ASTM D2216**](https://store.astm.org/d2216-19.html)
