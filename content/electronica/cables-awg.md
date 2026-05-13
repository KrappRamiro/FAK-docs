# Cables - AWG

AWG = American Wire Gauge. **Escala inversa: número más alto = cable más fino.**

| AWG | Diámetro | Corriente max\* (chassis, aire abierto) | Uso en invernadero                                            |
| --- | -------- | --------------- | ------------------------------------------------------------- |
| 18  | 1.02 mm  | ~16 A           | Línea principal 12V                                           |
| 20  | 0.81 mm  | ~11 A           | Bombas medianas                                               |
| 22  | 0.64 mm  | ~7 A            | Relays, solenoides, ventiladores                              |
| 24  | 0.51 mm  | ~3.5 A          | Alimentación [ESP32](../hardware/socs/index.md), líneas 5V |
| 26  | 0.41 mm  | ~2.2 A          | Señales con algo de corriente                                 |
| 28  | 0.32 mm  | ~1.4 A          | Jumpers, GPIO, I2C, UART                                      |
| 30  | 0.25 mm  | ~0.86 A         | Señales puras                                                 |

> \*Corriente máxima en ambiente abierto. **En invernadero con calor o cables agrupados, bajar un escalón de seguridad.**

## Cables del proyecto

| Color/AWG                          | Para                                                    |
| ---------------------------------- | ------------------------------------------------------- |
| 24 AWG stranded multicolor         | Señales, sensores, I2C, GPIO, jumpers entre breadboards |
| 18-22 AWG rojo/negro tinned copper | Alimentación 12V, bombas, relays                        |

## Tinned copper (cobre estañado)

Cada hilo del cable lleva una capa fina de estaño que previene la oxidación. En un invernadero esto importa especialmente, porque la humedad alta oxida el cobre desnudo y degrada la conductividad con el tiempo.

Mirar al final de un cable cortado:

- Cobre brillante color rojizo $\rightarrow$ cobre desnudo
- Color blanco-plateado uniforme $\rightarrow$ tinned copper

## Stranded vs Solid core

|                        | Stranded (trenzado)          | Solid (rígido)                          |
| ---------------------- | ---------------------------- | --------------------------------------- |
| Flexibilidad           | Alta                         | Baja                                    |
| Vibración / movimiento | Sobrevive                    | Se fractura                             |
| Breadboard             | Mal - se desarma al insertar | Excelente - entra firme                 |
| Soldadura              | Sí                           | Sí                                      |
| Crimpado               | Sí                           | Mal - los pines se aflojan              |
| Uso típico             | Cableado interior, robótica  | Jumpers fijos de breadboard, prototipos |

Es mejor usar cable trenzado

## Conexión y terminación

| Método                                     | Cuándo                                          |
| ------------------------------------------ | ----------------------------------------------- |
| Headers Dupont (machos/hembras crimpados)  | Prototipado, conexión rápida a DevKit           |
| Bornera atornillable                       | Conexión a fuentes 12V, bombas, electroválvulas |
| Soldadura directa del cable hacia la placa | Evitar a ser posible                            |

## Calibre típico por destino

| Destino                                                        | AWG                                             |
| -------------------------------------------------------------- | ----------------------------------------------- |
| Línea de 220V de fuente principal                              | **2.5 mm² (≈ AWG 13)** - mínimo legal AR per AEA 90364-7-771. AWG 14 = 2.08 mm² queda **debajo** |
| 12V de salida de fuente al gabinete                            | 18                                              |
| 12V de gabinete a electroválvula                               | 20-22                                           |
| 5V de fuente del [ESP32](../hardware/socs/index.md)         | 22-24                                           |
| Señales digitales entre placas                                 | 24-26                                           |
| I2C / SPI entre sensor y [ESP32](../hardware/socs/index.md) | 26-28                                           |
| Tierra entre gabinete y barra de tierra                        | 16 (lo más grueso del sistema, para protección) |
