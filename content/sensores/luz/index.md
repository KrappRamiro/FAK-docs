# Luz / PAR / Espectro

Sensores para medir luz visible, radiación PAR (fotosíntesis), y espectro completo.

> Antes de elegir un sensor: leer [conceptos-par.md](./conceptos-par.md) (qué es lux, PAR, PPFD, NDVI, y por qué los luxómetros fallan con LEDs de cultivo).

## Comparativa

| Sensor                              | Fabricante | Mide                                              | Voltaje                                  | Interface    | Para publicación                                        |
| ----------------------------------- | ---------- | ------------------------------------------------- | ---------------------------------------- | ------------ | ------------------------------------------------------- |
| [BH1750](./bh1750.md)               | Rohm       | Lux                                               | 2.4-3.6V                                 | I2C          | Con limitaciones declaradas                             |
| [TSL2591](./tsl2591.md)             | ams-OSRAM  | Lux dinámico                                      | 2.7-3.6V                                 | I2C          | Idem BH1750, rango mayor                                |
| [AS7341](./as7341.md)               | ams-OSRAM  | Espectro 11 canales (PAR + NIR + Clear + Flicker) | 1.8V (level shifter)                     | I2C          | ✓ con calibración contra Apogee                         |
| [Apogee SQ-500](./apogee-sq-500.md) | Apogee     | PAR $\mu\text{mol}/\text{m}^2/\text{s}$ directo   | Self-powered (thermopile 0-40 mV output) | Analógico mV | ✓ gold standard, trazable a NIST vía transfer standards |

## Estrategia típica para investigación con PAR

1. **Una unidad de [Apogee SQ-500](./apogee-sq-500.md)** como gold standard (costo único, calibra todos los nodos)
2. **Múltiples módulos [AS7341](./as7341.md)** distribuidos por zonas, calibrados contra el Apogee
3. Procedimiento: instalar AS7341 + Apogee en la misma posición durante $\geq 1$ semana en distintas condiciones de luz, ajustar coeficientes a₁-a₈ por regresión multilineal contra el Apogee
4. Para nodos sin requerimiento de publicación, [BH1750](./bh1750.md) alcanza con la limitación documentada (no usar con LED de cultivo sin caracterización espectral)
