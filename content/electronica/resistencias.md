# Resistencias

Limitan corriente en el circuito. Valor en Ohms ($\Omega$).

## Ley de Ohm

$$R = \frac{V}{I}$$

Donde $V$ es tensión en volts, $I$ corriente en amperes y $R$ resistencia en ohms.

## Uso típico: serie con LED

$$R = \frac{V_{\text{fuente}} - V_{\text{LED}}}{I_{\text{LED}}}$$

Ejemplo numérico con LED rojo (Vf = 2.0 V) a 10 mA desde 3.3 V:

$$R = \frac{3.3\,\text{V} - 2.0\,\text{V}}{0.010\,\text{A}} = 130\,\Omega \;\rightarrow\; \text{usar el estándar más cercano: } 150\,\Omega$$

## Valores estándar (serie E12)

`1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2` \* potencias de 10.

Cuando calculás $R = 130\,\Omega$, redondeás al estándar más cercano.

## Código de colores

| Color    | Dígito | Multiplicador | Tolerancia |
| -------- | ------ | ------------- | ---------- |
| Negro    | 0      | x1            | -          |
| Marrón   | 1      | x10           | $\pm 1\%$        |
| Rojo     | 2      | x100          | $\pm 2\%$        |
| Naranja  | 3      | x1k           | -          |
| Amarillo | 4      | x10k          | -          |
| Verde    | 5      | x100k         | $\pm 0.5\%$      |
| Azul     | 6      | x1M           | $\pm 0.25\%$     |
| Violeta  | 7      | x10M          | $\pm 0.1\%$      |
| Gris     | 8      | -             | $\pm 0.01\%$     |
| Blanco   | 9      | -             | -          |
| Dorado   | -      | x0.1          | $\pm 5\%$        |
| Plateado | -      | x0.01         | $\pm 10\%$       |

Una resistencia 4 bandas `marrón-negro-naranja-dorado` = $10 \cdot 1\,\text{k} = 10\,\text{k}\Omega \pm 5\%$.

Para evitar el código de colores: usar **multímetro** o las que tienen el valor impreso (1% metal film).

## Pull-up / pull-down

Cuando un GPIO está como entrada (botón, switch), necesita una resistencia fija a VCC (pull-up) o a GND (pull-down) para no quedar flotante leyendo ruido.


El [ESP32](../hardware-esp32/socs/index.md) tiene pull-up/pull-down internos configurables por firmware (API ESP-IDF: `gpio_pullup_en()` / `gpio_pulldown_en()`).
