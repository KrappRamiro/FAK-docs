---
title: "MH-Z19C (Winsen)"
description: "Versión mejorada del MH-Z19B con rango 400–2000 ppm y mejor resolución para concentraciones típicas de invernadero."
tags:
  - sensores
  - componente
  - esp32
  - co2
---

# MH-Z19C (Winsen)

Versión actualizada del [MH-Z19B](mh-z19b.md) con rango más acotado.

Páginas del fabricante: [Winsen MH-Z19C](https://www.winsen-sensor.com/sensors/co2-sensor/mh-z19c.html), [Datasheet MH-Z19C (PDF)](https://www.winsen-sensor.com/d/files/infrared-gas-sensor/mh-z19c-pins-type-co2-manual-ver1_0.pdf)

## Specs

| Spec          | Valor                                                                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tecnología    | NDIR (Non-Dispersive Infrared)                                                                                                                                                 |
| Rango         | **400-2000 ppm** (configurable a 400-5000 ppm per [datasheet line 106-107](https://www.winsen-sensor.com/d/files/infrared-gas-sensor/mh-z19c-pins-type-co2-manual-ver1_0.pdf)) |
| Precisión     | $\pm (50\,\text{ppm} + 5\%$ del valor medido$)$                                                                                                                                |
| Interface     | UART (9600 baud, 8N1) o PWM                                                                                                                                                    |
| Voltaje       | **$5.0 \pm 0.1$ V DC** (datasheet line 102, 271 - es estricto, no usar 4.5V ni 5.5V)                                                                                           |
| Calentamiento | **1 min** después de power-on (datasheet line 110)                                                                                                                             |

## Diferencia con MH-Z19B

Rango más acotado (0-2000 vs 0-5000 ppm) $\rightarrow$ **mejor resolución** dentro de su rango. En invernaderos con CO2 hasta ~1500 ppm, el MH-Z19C tiene más precisión efectiva.

Si vas a fertilizar a >2000 ppm (raro pero existe), usar [MH-Z19B](mh-z19b.md).

## Comandos UART

Mismos comandos que el MH-Z19B - incluyendo el de desactivar ABC. Ver [mh-z19b.md](mh-z19b.md) para detalles de protocolo.
