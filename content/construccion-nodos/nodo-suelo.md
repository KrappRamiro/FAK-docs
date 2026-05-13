# Nodo Análisis de Suelo

Mide humedad volumétrica ([VWC](../sensores/humedad-suelo/vwc.md)) y temperatura del suelo en cada zona, leyendo sensores capacitivos por canal ADC.

> **Nota sobre pH:** el pH del suelo **no se mide en este nodo**. La medición continua in-situ del pH es inviable (ver [`../sensores/ph-suelo/README.md`](../sensores/ph-suelo/index.md)) - se hace por muestreo periódico ex-situ con [Atlas EZO-pH](../sensores/ph-suelo/ezo-ph.md) de mesada y se registra manualmente. No hay GPIO/I2C de pH cableado a este nodo.

## Hardware

| Componente | Cantidad | Notas |
|---|---|---|
| [ESP32-C3-DevKitC-02](../hardware/devkits/espressif/esp32-c3-devkitc-02.md) | 1 | ADC + I2C, suficiente |
| Sensor capacitivo de suelo v2.0 | 1-4 | Uno por punto de medición. **Calibrado por sustrato.** |
| MOSFET o transistor para power gating | 1 por sensor capacitivo | Apagar sensores entre lecturas reduce corrosión galvánica |
| Resistencias pull-up $10\,\text{k}\Omega$ | 2 | I2C SDA/SCL (reservado para futuras expansiones, ej. sensor de temp de suelo I2C) |
| Capacitor 100nF | 2-3 | Filtrado entrada del ADC |
| Cable 24 [AWG](../electronica/cables-awg.md) | - | Largo según distancia al punto de medición |

## Por qué un C3 alcanza

- Hasta **6 canales ADC** (suficiente para 4 sensores capacitivos + 1 reserva)
- Sin restricción de ADC con WiFi activo (a diferencia del [ESP32](../hardware/socs/index.md) clásico)
- Bajo consumo, ideal para nodo "ambiental low-power"

## Cableado capacitivo

```
ESP32-C3 GPIO4 (ADC1_CH3) ──── AOUT (señal analógica) sensor #1
ESP32-C3 GPIO0 (power gate) ── GATE de MOSFET ── VCC sensor #1
3.3V ──────────────────── VCC todos los sensores (via MOSFET)
GND ──────────────────── GND todos los sensores
```

> **Power gating opcional pero recomendado:** alimentar el sensor capacitivo solo durante la lectura. Reduce corrosión galvánica del electrodo en suelo húmedo (extiende vida útil $\times 3$-5).

```c
gpio_set_level(SOIL_POWER_GPIO, 1);
vTaskDelay(pdMS_TO_TICKS(100)); // estabilizar
int raw;
adc_oneshot_read(adc_handle, ADC_CHANNEL_3, &raw);
gpio_set_level(SOIL_POWER_GPIO, 0);
```

## Firmware - lectura periódica

```c
void soil_node_main(void *arg) {
 // Coeficientes de calibración cargados desde NVS (uno por sensor)
 soil_calibration_t cal[NUM_SOIL_SENSORS];
 load_soil_calibrations_from_nvs(cal);

 while (1) {
 for (int i = 0; i < NUM_SOIL_SENSORS; i++) {
 gpio_set_level(soil_power_gpios[i], 1);
 vTaskDelay(pdMS_TO_TICKS(100));

 int raw_sum = 0;
 for (int s = 0; s < 8; s++) {
 int raw;
 adc_oneshot_read(adc_handle, adc_channels[i], &raw);
 raw_sum += raw;
 }
 int raw_avg = raw_sum / 8;

 gpio_set_level(soil_power_gpios[i], 0);

 float vwc = adc_to_vwc(raw_avg, &cal[i]);
 publish_soil_reading(i, raw_avg, vwc);
 }

 publish_heartbeat();
 vTaskDelay(pdMS_TO_TICKS(15 * 60 * 1000)); // VWC cambia lento, 15 min alcanza
 }
}
```

### Promedio de muestras

Los sensores capacitivos baratos tienen ruido. **Tomar 8-16 muestras y promediar** estabiliza la lectura significativamente sin agregar costo.

### Conversión ADC $\rightarrow$ VWC

```c
typedef struct {
 float a, b, c; // coeficientes polinomio: VWC = a*x² + b*x + c
 char substrate[16]; // ej. "tierra_negra", "perlita", "coco"
} soil_calibration_t;

float adc_to_vwc(int adc_raw, const soil_calibration_t *cal) {
 float vwc = cal->a * adc_raw * adc_raw + cal->b * adc_raw + cal->c;
 if (vwc < 0.0f) vwc = 0.0f;
 if (vwc > 1.0f) vwc = 1.0f;
 return vwc * 100.0f; // %
}
```

Las calibraciones se guardan en [NVS](../seguridad-iot/secrets-en-firmware.md) - al recalibrar (cada temporada o por cambio de sustrato), se actualizan sin reflashear firmware. Ver [`../sensores/vwc.md`](../sensores/humedad-suelo/vwc.md) para el procedimiento.

## Topics

| Topic | Frecuencia | Contenido |
|---|---|---|
| `greenhouse/zone-A/soil-1/data` | 1/15min | `{"ts","adc_raw","vwc_pct","substrate"}` |
| `greenhouse/zone-A/soil-2/data` | 1/15min | idem para sensor 2 |
| `greenhouse/zone-A/node/heartbeat` | 1/min | Heartbeat estándar |

> Topic de pH (`greenhouse/zone-A/soil-ph/sample`) se publica **manualmente desde una herramienta de mesada** después de procesar cada muestra periódica - ver [`../sensores/ph-suelo/ezo-ph.md`](../sensores/ph-suelo/ezo-ph.md). No sale de este nodo.

## Instalación física

- **Insertar el sensor capacitivo en posición vertical**, profundidad raíz (5-15 cm según cultivo)
- **No torcer ni doblar el cuerpo** del sensor - la zona activa es el área cubierta por el barniz protector
- **Sellar la salida del cable con silicona** para que no entre agua por el cable
- **Mismo sustrato, mismo lote** - calibrar con el sustrato que vas a usar realmente

## Calibración previa al deployment

Para cada sensor capacitivo:

1. Secar el sustrato a $105\,°\text{C}$ durante 24h
2. Pesar recipiente vacío, recipiente lleno $\rightarrow$ calcular volumen
3. Insertar sensor en sustrato seco $\rightarrow$ ADC_seco
4. Agregar agua en incrementos de 10 ml, registrar ADC en cada paso
5. Ajustar polinomio cuadrático $\rightarrow$ guardar coeficientes en [NVS](../seguridad-iot/secrets-en-firmware.md)

Procedimiento completo en [`../sensores/vwc.md`](../sensores/humedad-suelo/vwc.md).

## Validación cruzada (paper)

1. Instalar un [METER TEROS 11](../sensores/humedad-suelo/teros-11.md) junto a cada sensor capacitivo durante 2-4 semanas
2. Recolectar series paralelas con timestamps sincronizados
3. Calcular $R^2$ entre el capacitivo (post-calibración) y el [TEROS 11](../sensores/humedad-suelo/teros-11.md)
4. Reportar $R^2 > 0.95$ en metodología $\rightarrow$ validación aceptada por reviewers

## Trampas

| Problema | Causa | Fix |
|---|---|---|
| Lecturas iguales para distintos sensores | Power gating mal cableado, todos comparten VCC | Un MOSFET por sensor, gates separados |
| Sensor se corroe en 2 meses | Es un sensor **resistivo**, no capacitivo | Tirar a la basura, comprar capacitivo v2.0 |
| ADC reporta 4095 o 0 constantemente | Cable desconectado o cortocircuitado | Multímetro, verificar continuidad |
| [VWC](../sensores/humedad-suelo/vwc.md) oscila $\pm 10\%$ entre lecturas | Falta promedio de muestras | Sumar 8-16 lecturas y dividir |
