---
title: "METER TEROS 11"
description: "Sensor de referencia académica para VWC y temperatura de suelo con calibración de fábrica e interfaz SDI-12."
tags:
  - sensores
  - componente
  - investigacion
  - humedad-suelo
---

# METER TEROS 11

Sensor de humedad de suelo de referencia para publicación académica.

Páginas del fabricante: [METER TEROS 11](https://www.metergroup.com/en/meter-environment/products/teros-11-soil-moisture-sensor), [User manual (PDF)](https://publications.metergroup.com/Manuals/20587_TEROS11-12_Manual_Web.pdf)

## Specs

Ver <https://metergroup.com/products/teros-11/#specifications>

| Spec                   | Valor                                                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Mide                   | [VWC](vwc.md) + temperatura de suelo (EC sólo en TEROS 12)                                                            |
| Rango VWC              | 0.00-0.70 $\text{m}^3$/$\text{m}^3$ (mineral), 0.0-1.0 $\text{m}^3$/$\text{m}^3$ (sustrato sin tierra)                |
| Precisión VWC          | $\pm 0.03$ $\text{m}^3$/$\text{m}^3$ (calibración genérica, EC <8 dS/m); $\pm 0.01$-0.02 con calibración específica   |
| Rango temperatura      | -40 a +60 $^\circ\text{C}$; precisión $\pm 0.5\,^\circ\text{C}$ (0-60 $^\circ\text{C}$), $\pm 1\,^\circ\text{C}$ (-40 a 0 $^\circ\text{C}$) |
| Frecuencia dieléctrica | 70 MHz                                                                                                                |
| Interface              | DDI serial o SDI-12                                                                                                   |
| Calibración            | Factory-calibrated con ecuaciones por sustrato (mineral / soilless) preloaded                                         |
| Volumen de influencia  | 1010 mL                                                                                                               |
| Voltaje                | 4.0-15V DC                                                                                                            |

## Por qué es la referencia académica

- **Referencia estándar** en journals: _Computers and Electronics in Agriculture_, _Agricultural Water Management_
- Calibrado de fábrica para múltiples sustratos comunes
- Mide temperatura para usar como variable de compensación externa (EC requiere [TEROS 12](https://metergroup.com/products/teros-12/))

## Estrategia típica con TEROS 11

Una sola unidad puede usarse como **referencia móvil** rotando entre nodos:

1. Instalar TEROS 11 + capacitivo v2.0 en el mismo punto
2. Recolectar series temporales paralelas durante 2-4 semanas
3. Comparar: $R^2 > 0.95$ $\rightarrow$ validación aceptada por reviewers (ver [calibracion-cruzada.md](../../investigacion/calibracion-cruzada.md))
4. Mover el TEROS 11 al siguiente nodo, repetir

Un solo TEROS 11 valida múltiples nodos baratos a lo largo del experimento.

## SDI-12 desde ESP32

[SDI-12](https://sdi-12.org/) es un **estándar formal** (spec v1.4) ampliamente usado en sensores ambientales y agronómicos profesionales (METER, Campbell Scientific, Apogee, In-Situ). El problema: **el ESP32 no tiene hardware nativo para SDI-12** (sí lo tiene para I2C/SPI/UART). El protocolo tiene particularidades que lo hacen distinto a una UART común:

- **1 sola línea de datos** half-duplex (3 hilos en total: 12V, GND, DATA)
- **1200 baud, 7E1** (7 data bits + even parity + 1 stop bit) , es una configuración rara
- **Niveles 5V** en la línea de datos (TTL clásico, no LVTTL 3.3V del ESP32)
- **Comandos ASCII** tipo `0M!` (start measure), `0D0!` (read data)
- **Sin clock externo** - timing crítico por software

### Opciones para leer SDI-12 con ESP32

| Opción                                                                       | Cómo funciona                                                                                                                                                                            |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SDI-12 USB adapter** (Liquidwise, Adafruit, ProCheck)                      | Conectar el sensor a una PC para lectura manual o vía script Python. No usás el ESP32                                                                                                    |
| **Módulo SDI-12 to TTL** (SDI12USB de NWTechnology u similar)                | Convierte el bus SDI-12 a UART 3.3V estándar; leés desde el UART del ESP32 con parseo del protocolo en firmware                                                                          |
| **Bit-banging por software**                                                 | Usar una librería tipo [Arduino-SDI-12 (EnviroDIY)](https://github.com/EnviroDIY/Arduino-SDI-12) que implementa el protocolo manualmente. Funciona en ESP32 con limitaciones de timing   |
| **Level shifter 3.3V $\leftrightarrow$ 5V + UART manual**                    | Hardware mínimo (un MOSFET o un 74LVC1G125 como buffer) + parseo full software. Más laborioso pero el camino más barato                                                                  |
| **Hardware dedicado**: [EnviroDIY Mayfly](https://www.envirodiy.org/mayfly/) | Plataforma completa para monitoreo ambiental con SDI-12 nativo. Usa **ATmega1284** (no ESP32) - mencionado como alternativa de hardware completo si no querés pelear con SDI-12 en ESP32 |
