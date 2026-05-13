# Atlas Scientific EZO-pH

Único sensor de pH académicamente válido en el rango de precio razonable. Está diseñado para uso en líquidos, así que para suelo se usa como pHmetro de mesada con muestras suelo:agua, no enterrado in-situ.

Páginas del fabricante: [Atlas Scientific EZO-pH circuit](https://atlas-scientific.com/embedded-solutions/ezo-ph-circuit/), [Datasheet EZO-pH (PDF)](https://files.atlas-scientific.com/pH_EZO_Datasheet.pdf), [Electrodo pH de laboratorio](https://atlas-scientific.com/probes/lab-grade-ph-probe/)

> **Uso típico en este contexto:** medición **periódica** (semanal / quincenal) de muestras de suelo procesadas con el [protocolo de extracto suelo:agua](./index.md#protocolo-estándar-de-muestreo-astm-d4972--usda-nrcs). **No** para enterrar y leer cada 15 min - ver [README de la carpeta](./index.md) para por qué la medición continua in-situ del pH del suelo es inviable.

## Por qué los sensores de pH "continuos" baratos son humo

Los sensores de pH de AliExpress / Temu - incluidos los de "dos puntas" que se enchufan en la tierra:

- Tienen deriva alta e irreproducible: el cero se mueve cada 24-48h en uso continuo.
- No tienen trazabilidad: no hay forma de documentar contra qué estándar fueron calibrados.
- No tienen certificado: ningún reviewer aceptará lecturas de un sensor sin certificado de calibración.
- **Los de "dos puntas que se clavan en el suelo"** miden conductividad / resistencia del suelo (no pH real) e intentan estimar pH con un modelo invariablemente malo. Discusión: [r/diyelectronics](https://www.reddit.com/r/diyelectronics/comments/hsue3w/anyone_know_what_the_deal_with_soil_ph_sensors_is/).

Útiles para "hobby curiosity", **no para una serie temporal de paper**.

## Specs

| Spec | Valor |
|---|---|
| Interface | I2C @ 0x63 default (configurable) o UART |
| Rango | 0.001-14.000 pH |
| Precisión | $\pm 0.002\,\text{pH}$ |
| Calibración | 1, 2 o 3 puntos (típico: 3 puntos con buffers pH 4.01 / 7.00 / 10.00) |
| Compensación | Temperatura con sonda externa, comando `T,xx.x` |
| Voltaje | 3.3-5V (abs max 5.5V) |
| Tiempo lectura | 800 ms per datasheet; 900 ms usado en código de abajo como margen conservador |

> El **electrodo** (conector BNC + bulbo de vidrio + solución KCl de almacenamiento) es un componente separado del EZO circuit y tiene su propia hoja de datos. Los specs de mantenimiento (storage KCl 3M, recalibración cada 4 semanas) son del electrodo, no del circuito. Para uso académico, comprar el [electrodo de laboratorio Atlas](https://atlas-scientific.com/probes/lab-grade-ph-probe/) (no el "consumer-grade").
## Componentes necesarios

1. **EZO-pH circuit** - el procesador de señal, módulo I2C
2. **Electrodo pH BNC** - el sensor físico, consumible
3. **Soluciones de calibración** (pH 4.01, 7.00, 10.00) set
4. **Solución de almacenamiento KCl** - para guardar el electrodo cuando no está en uso

## Calibración (procedimiento crítico)

1. Enjuagar electrodo con agua destilada
2. Sumergir en buffer pH 7.00, esperar lectura estable (~30 s), enviar comando `Cal,mid,7`
3. Enjuagar, sumergir en buffer pH 4.01, esperar estable, comando `Cal,low,4`
4. Enjuagar, sumergir en buffer pH 10.00, comando `Cal,high,10`
5. Verificar con un cuarto buffer (ej. pH 6.86) para validar

## Mantenimiento

> El electrodo requiere **solución de almacenamiento** y **recalibración periódica** (~cada 4 semanas en uso continuo). Sin esto la precisión se degrada.

| Frecuencia | Acción |
|---|---|
| Cada día | Verificar que el electrodo está húmedo (no se debe secar nunca) |
| Cada 4 semanas | Recalibrar 3 puntos |
| Cada 6-12 meses | Reemplazar electrodo si la pendiente de calibración baja >5% del slope ideal |
| Almacenamiento | Solución KCl 3M, **NO agua destilada** (destruye el bulbo de vidrio) |

## Comandos I2C (algunos)

| Comando | Acción |
|---|---|
| `R` | Read - devuelve pH actual |
| `T,25.0` | Set temperature compensation a $25\,°\text{C}$ |
| `Cal,mid,7` | Calibrate midpoint con pH 7 buffer |
| `Cal,low,4` | Calibrate low con pH 4 buffer |
| `Cal,high,10` | Calibrate high con pH 10 buffer |
| `Slope,?` | Query slope de la calibración actual |
| `Sleep` | Modo bajo consumo |

## Implementación esquemática (ESP-IDF)

```c
#define EZO_PH_ADDR 0x63

esp_err_t ezo_ph_read(float *pH) {
 uint8_t cmd[] = {'R'};
 i2c_master_write_to_device(I2C_NUM_0, EZO_PH_ADDR, cmd, 1, pdMS_TO_TICKS(100));
 vTaskDelay(pdMS_TO_TICKS(900)); // EZO-pH tarda ~900ms en una lectura precisa

 uint8_t buf[16] = {0};
 i2c_master_read_from_device(I2C_NUM_0, EZO_PH_ADDR, buf, sizeof(buf), pdMS_TO_TICKS(100));

 // buf[0] = status byte (1 = success), buf[1..] = ASCII del valor con CR final
 if (buf[0] != 1) return ESP_FAIL;
 *pH = atof((char *)&buf[1]);
 return ESP_OK;
}
```

## Workflow de medición periódica para suelo

El EZO-pH **no se entierra**. Se usa como pHmetro de laboratorio para procesar muestras de suelo. Procedimiento típico:

1. **Recolectar 5-10 g de suelo** de la zona de raíces (varios puntos por zona, mezclar)
2. **Mezclar con agua destilada** en ratio 1:1 o 1:2.5 (peso:volumen), agitar 30-60 min, dejar decantar 30 min
3. **Enjuagar el electrodo** con agua destilada, sumergir en el sobrenadante
4. **Esperar lectura estable** (~30-60 s)
5. **Registrar** valor + temperatura + slope del electrodo
6. **Enjuagar y guardar** electrodo en solución KCl 3M

Frecuencia razonable: **$1\times$ semana o quincenal**. El pH del suelo cambia lento, no tiene sentido medir más seguido.

Protocolo formal: [ASTM D4972](https://www.astm.org/d4972-19.html) o el [USDA NRCS Soil Survey Methods Manual](https://www.nrcs.usda.gov/sites/default/files/2022-09/SSIR_51_Soil_Survey_Field_and_Laboratory_Methods_Manual.pdf) capítulo 4.

## Para automatizar el registro

Aunque la medición es manual, el log puede ser automatizado:

- Conectar el EZO-pH a un ESP32 / Raspberry Pi de mesada (no a un nodo del invernadero)
- Tener el script publicando a MQTT con timestamp del momento de medición + metadata del muestreo (zona, profundidad, ratio agua, slope del electrodo)
- Almacenar en InfluxDB como cualquier otro dato, pero con tags `source=manual` para que las queries lo separen de las series continuas
