---
title: "CO2"
description: "Comparativa de sensores NDIR de CO2 y advertencias críticas sobre ABC/ASC en invernaderos cerrados."
tags:
  - sensores
  - indice
  - investigacion
---

# CO2

Sensores NDIR (Non-Dispersive Infrared) para concentración de CO2 atmosférico.

**Conviene el SCD41**

## Comparativa

| Sensor                  | Fabricante | Tecnología | Rango                        | Precisión                                     | Interface |
| ----------------------- | ---------- | ---------- | ---------------------------- | --------------------------------------------- | --------- |
| [MH-Z19B](./mh-z19b.md) | Winsen     | NDIR       | 0-5000 ppm (config)          | $\pm (50\,\text{ppm} + 3\%)$                  | UART      |
| [MH-Z19C](./mh-z19c.md) | Winsen     | NDIR       | 400-2000 ppm (config a 5000) | $\pm (50\,\text{ppm} + 5\%)$                  | UART      |
| [SCD41](./scd41.md)     | Sensirion  | PAS NDIR   | 400-5000 ppm                 | $\pm (50\,\text{ppm} + 2.5\%)$ hasta 1000 ppm | I2C       |

Ver <https://shop.winsen-sensor.com/blogs/news/what-is-the-difference-between-mh-z19b-and-mh-z19c>

> Genernally, MH-Z19C has better consistency and performance than MH-Z19B, and can directly replace MH-Z19B.

Ver <https://www.reddit.com/r/esp32/comments/1798eb2/co2_sensors_for_around_the_house_any_tried_and/>

> note that to get an accurate CO2 reading you also need a barometric pressure sensor so you can give the SCD4x the pressure, which it then uses to compensate it's CO2 reading

Ver <https://en.ovcharov.me/2025/02/19/comparing-mh-z19b-and-scd41-building-a-smarter-co-monitor/>

## Trampa crítica para invernadero: ABC (Automatic Baseline Correction)

El **ABC** asume que el sensor ve aire fresco exterior (400 ppm) al menos una vez cada 24h y recalibra el cero a ese valor.

En un invernadero cerrado con CO2 elevado permanentemente, el ABC **recalibra continuamente con valores erróneos** $\rightarrow$ lecturas derivan en semanas.

- [MH-Z19B](./mh-z19b.md) y [MH-Z19C](./mh-z19c.md): **desactivar ABC** vía UART antes de instalar
- [SCD41](./scd41.md): el ASC (Automatic Self Calibration) tiene la misma trampa - desactivar con comando I2C `0x2416` (set_automatic_self_calibration_enabled = 0) **+** `0x3615` (persist_settings) para que sobreviva el power-cycle, antes de uso continuo

## Por qué la temperatura y humedad afectan la lectura

Los NDIR miden CO2 viendo cuánta luz infrarroja se absorbe a 4.26 µm. El problema: la absorción no depende solo del CO2, también del **estado del gas**:

- **Temperatura**: a mayor T, las moléculas se expanden $\rightarrow$ menos moléculas en el volumen que ve el sensor $\rightarrow$ lectura "más baja" aunque haya el mismo CO2.
- **Humedad**: el vapor de agua también absorbe IR (en bandas que se solapan parcialmente con la del CO2) $\rightarrow$ suma "ruido" al cálculo.
- **Presión**: la densidad del gas depende de la presión (PV = nRT). En altura o con frente de baja presión, hay menos moléculas por volumen $\rightarrow$ lectura baja sin compensar.

Sin compensar, un aire con 1000 ppm reales puede leerse como 950-1050 ppm según T/HR. Para una serie temporal de paper, ese ruido contamina las correlaciones.

### Cómo lo resuelve cada sensor

| Sensor                                           | T + HR                                                                                                                                                                                                                                                                                   | Presión                                                                                                                                                                                              |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [MH-Z19B](./mh-z19b.md), [MH-Z19C](./mh-z19c.md) | **Sin compensación interna.** Hay que leer T+HR aparte (ej. [SHT45](../temperatura-humedad/sht45.md)) y aplicar corrección en firmware si la T del invernadero varía mucho con las estaciones                                                                                            | Sin compensación                                                                                                                                                                                     |
| [SCD41](./scd41.md)                              | **Automática.** Trae un SHT4x integrado en el mismo chip (per [datasheet §Introduction](https://sensirion.com/media/documents/48C4B7FB/67FE0194/CD_DS_SCD4x_Datasheet_D1.pdf): _"on-chip signal compensation is realized with the built-in SHT4x"_) y te devuelve un valor ya compensado | Hay que dárselo con el comando `set_ambient_pressure` (0xE000). Si no, asume 1013 hPa default - error en altura o con baja presión. Conectar un BMP280/BME280 al mismo bus I2C y reportar la presión |

## Recomendaciones por tipo de uso

| Caso de uso                                                               | Sensor típico                     | Razón                                                                                                         |
| ------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Lectura económica con metodología documentada                             | [MH-Z19B](./mh-z19b.md) (ABC off) | Bajo costo, ampliamente usado en literatura agronómica                                                        |
| Integración con [SHT4x](../temperatura-humedad/sht45.md) en mismo bus I2C | [SCD41](./scd41.md)               | I2C @ 0x62, comparte bus                                                                                      |
| Necesidad de compensación automática T+HR                                 | [SCD41](./scd41.md)               | Trae sensor T+HR integrado, no hace falta cablearlo aparte ni compensar en firmware. Drift bajo a largo plazo |

> (T+HR significa Temperatura y Humedad Relativa)
