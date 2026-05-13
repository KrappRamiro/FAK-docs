# SHT40 (Sensirion)

Sensor digital de temperatura + humedad relativa, generación 4.

Página del fabricante: [Sensirion SHT40](https://sensirion.com/products/catalog/SHT40-AD1B), [Datasheet SHT4x (PDF)](https://sensirion.com/media/documents/33FD6951/67EB9032/HT_DS_Datasheet_SHT4x_5.pdf)

## Specs

| Spec | Valor |
|---|---|
| Precisión temperatura | $\pm 0.2\,°\text{C}$ |
| Precisión HR | $\pm 1.8\%$ RH |
| Heater | 3 niveles (20 / 110 / 200 mW) |
| Voltaje | 1.08-3.6V |
| Interface | I2C @ 0x44 (variantes con 0x45 / 0x46) |
| Tiempo de respuesta HR (τ63%) | 4 s (T: 2 s) |

## Notas

- Sucesor del SHT31 con menor precio y mayor precisión.
- Heater de 3 niveles maneja condensación más agresiva.
- **No tolera 5V** - máximo 3.6V. Conectar directo a 3.3V del ESP32.
- Para publicación académica requiere [calibración cruzada](../../investigacion/calibracion-cruzada.md) contra un instrumento certificado (típicamente [SHT45](sht45.md)).

## Breakout boards comunes

- [Adafruit SHT40 breakout (#4885)](https://www.adafruit.com/product/4885) con STEMMA QT
- Múltiples vendors en AliExpress con dirección I2C configurable
