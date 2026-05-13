# Temperatura + Humedad Ambiental

Familia SHT de Sensirion - sensores digitales I2C para temperatura del aire y humedad relativa.

Página del fabricante: [Sensirion Humidity & Temperature Sensors](https://sensirion.com/products/sensor-portfolio/humidity-and-temperature-sensors)

## Comparativa

| Sensor | Generación | Precisión T | Precisión HR | Voltaje | Heater | Para publicación |
|---|---|---|---|---|---|---|
| [SHT31](./sht31.md) | 3ra | $\pm 0.2\,°\text{C}$ | $\pm 2\%$ | 2.15-5.5V | 1 nivel | Con [calibración cruzada](../../investigacion/calibracion-cruzada.md) |
| [SHT40](./sht40.md) | 4ta | $\pm 0.2\,°\text{C}$ | $\pm 1.8\%$ | 1.08-3.6V | 3 niveles | Con [calibración cruzada](../../investigacion/calibracion-cruzada.md) |
| [SHT41](./sht41.md) | 4ta | $\pm 0.2\,°\text{C}$ | $\pm 1.8\%$ | 1.08-3.6V | 3 niveles | Mismo silicon que SHT40, factory cal más rigurosa |
| [SHT45](./sht45.md) | 4ta | **$\pm 0.1\,°\text{C}$** | **$\pm 1\%$** | 1.08-3.6V | 3 niveles | ✓ directo (variante AD1F-R2 con filtro PTFE) |
| [SHTC3](./shtc3.md) | - | $\pm 0.2\,°\text{C}$ | $\pm 2\%$ | 1.62-3.6V | - | Footprint ultra-compacto ($2 \times 2$$\times 0$.75mm) |

## Notas comunes

- Todos hablan I2C estándar (excepto SHTC3 que está @ 0x70, los demás @ 0x44)
- SHT4x y SHT3x tienen comandos CRC-8 obligatorios para validar lecturas
- Filtro PTFE (sufijo `F` en SHT45-AD1F-R2) es **no-negociable** en ambientes con condensación / nebulización
- Sensirion documenta deriva típica < $0.5\,°\text{C}$ / año en condiciones controladas; en campo, recalibración cruzada cada temporada es la práctica habitual

## Para calibración cruzada en publicación

Ver [`../../investigacion/calibracion-cruzada.md`](../../investigacion/calibracion-cruzada.md). El procedimiento típico:

1. Instalar sensor económico + sensor de referencia ([SHT45](./sht45.md)) en mismo punto durante $\geq 2$ semanas
2. Comparar series temporales sincronizadas
3. Reportar $R^2$ + slope + intercept + RMSE
4. $R^2 > 0.95$ $\rightarrow$ aceptado en práctica como validación
