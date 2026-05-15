# Luz / PAR / Espectro

Sensores para medir luz visible, radiación PAR (fotosíntesis), y espectro completo.

> Antes de elegir un sensor: leer [conceptos-par.md](./conceptos-par.md) (qué es lux, PAR, PPFD, NDVI, y por qué los luxómetros fallan con LEDs de cultivo).

**Conviene comprar el AS7341, [lo vende Adafruit](https://www.adafruit.com/product/4698)**

## Comparativa

| Sensor                              | Fabricante | Mide                                              | Voltaje                                  | Interface    | Para publicación                                        |
| ----------------------------------- | ---------- | ------------------------------------------------- | ---------------------------------------- | ------------ | ------------------------------------------------------- |
| [BH1750](./bh1750.md)               | Rohm       | Lux                                               | 2.4-3.6V                                 | I2C          | Con limitaciones declaradas                             |
| [TSL2591](./tsl2591.md)             | ams-OSRAM  | Lux dinámico                                      | 2.7-3.6V                                 | I2C          | Idem BH1750, rango mayor                                |
| [AS7341](./as7341.md)               | ams-OSRAM  | Espectro 11 canales (PAR + NIR + Clear + Flicker) | 1.8V (level shifter)                     | I2C          | ✅ con calibración contra Apogee                         |
| [AS7343](./as7343.md) *(discontinuado)* | ams-OSRAM  | Espectro 14 canales (PAR + XYZ + NIR + Clear + Flicker) | 1.8V (level shifter)              | I2C          | ⚠️ sin calibraciones publicadas contra Apogee            |
| [TCS3448](./tcs3448.md)              | ams-OSRAM  | Espectro 14 canales, reemplazo activo del AS7343         | 1.8V (level shifter)              | I2C + I3C    | ⚠️ sin breakout disponible, sin calibraciones publicadas |
| [Apogee SQ-500](./apogee-sq-500.md) | Apogee     | PAR $\mu\text{mol}/\text{m}^2/\text{s}$ directo   | Self-powered (thermopile 0-40 mV output) | Analógico mV | ✅ gold standard, trazable a NIST vía transfer standards |
