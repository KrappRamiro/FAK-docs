# SHT41 (Sensirion)

Sensor digital de temperatura + humedad relativa, generación 4. **Mismo chip base que [SHT40](sht40.md) pero con calibración de fábrica más rigurosa.**

Página del fabricante: [Sensirion SHT41](https://sensirion.com/products/catalog/SHT41-AD1B), [Datasheet SHT4x (PDF)](https://sensirion.com/media/documents/33FD6951/67EB9032/HT_DS_Datasheet_SHT4x_5.pdf)

## Specs

| Spec | Valor |
|---|---|
| Precisión temperatura | $\pm 0.2\,°\text{C}$ |
| Precisión HR | $\pm 1.8\%$ RH |
| Heater | 3 niveles (20 / 110 / 200 mW) |
| Voltaje | 1.08-3.6V |
| Interface | I2C @ 0x44 |
| Tiempo de respuesta HR (τ63%) | 4 s (T: 2 s) |

## Diferencia con SHT40

Mismo silicio, mismo footprint, mismas specs nominales - pero Sensirion documenta un proceso de calibración de fábrica más estricto en el 41. En la práctica la diferencia es mínima salvo casos extremos.

Si vas a hacer [calibración cruzada](../../investigacion/calibracion-cruzada.md) de todos modos, conviene el [SHT40](sht40.md). Si querés saltarte la calibración de un sensor de control y aceptar la del fabricante, el SHT41 da una garantía un poco mejor.
