# Capacitivo de Suelo v2.0

Sensor capacitivo genérico para humedad de sustrato.

Sensor sin fabricante único - múltiples vendors chinos en AliExpress/Temu. Variantes etiquetadas "v1.2" y "v2.0" son **ambas capacitivas** (basadas en el chip TLC555 oscilando a ~1.5 MHz, ver [Cave Pearl Project teardown](https://thecavepearlproject.org/2020/10/27/hacking-a-capacitive-soil-moisture-sensor-for-frequency-output/)). El sensor a **evitar** es el modelo viejo **resistivo de dos puntas/horquilla** (sin "v1.x" en el label) que sí se corroe. Verificar que el módulo dice "Capacitive Soil Moisture Sensor" antes de comprar.

## Specs

| Spec | Valor |
|---|---|
| Tecnología | Capacitiva |
| Salida | Analógica (~3100 ADC seco $\rightarrow$ ~1200 ADC saturado en 12-bit) |
| Voltaje | 3.3V o 5V (la mayoría son 3.3-5.5V) |
| Interface | ADC |
| Resistencia a corrosión | ✅ (sin contactos metálicos expuestos) |
> ⚠️ No usar sensores resistivos: se corroen en semanas en suelo húmedo y dan lecturas no reproducibles.

## Sin calibración no da [VWC](vwc.md) absoluto

El mismo valor ADC `1850` puede ser:
- 20% VWC en tierra negra
- 35% VWC en arena gruesa
- 15% VWC en sustrato de coco

Cada sustrato necesita su **curva de calibración** (gravimétrica). Procedimiento completo en [vwc.md](vwc.md).

## Lectura desde ESP32

```c
#include "esp_adc/adc_oneshot.h"

adc_oneshot_unit_handle_t adc_handle;
adc_oneshot_unit_init_cfg_t init_cfg = {.unit_id = ADC_UNIT_1};
adc_oneshot_new_unit(&init_cfg, &adc_handle);

adc_oneshot_chan_cfg_t chan_cfg = {
 .bitwidth = ADC_BITWIDTH_DEFAULT,
 .atten = ADC_ATTEN_DB_12, // 0-3.3V rango completo
};
adc_oneshot_config_channel(adc_handle, ADC_CHANNEL_3, &chan_cfg);

int raw;
adc_oneshot_read(adc_handle, ADC_CHANNEL_3, &raw);
// raw va a estar entre ~1200 (saturado) y ~3100 (seco)
```

## Factores de deriva a declarar en metodología

| Factor | Efecto | Mitigación |
|---|---|---|
| Temperatura del suelo | $\pm 0.1\%$ VWC por $^\circ$C | Compensar con lectura simultánea de temp. suelo |
| Salinidad (EC alto) | Sobreestima VWC | Calibrar con sustrato + fertilizante a EC típico |
| Variabilidad entre unidades | Hasta $\pm 5\%$ entre sensores del mismo lote | Calibrar cada sensor individualmente |
| Deriva temporal | ~1-2% VWC por año | Recalibrar cada temporada |

## Para validación académica

Cross-calibrar contra [TEROS 11](teros-11.md) durante 2-4 semanas, reportar $R^2 > 0.95$. Ver [calibracion-cruzada.md](../../investigacion/calibracion-cruzada.md).
