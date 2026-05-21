---
title: "Diodos"
description: "Índice de diodos disponibles en el kit: rectificadores, Schottky, señal y fast recovery, con tabla de uso por corriente."
tags:
  - electronica
  - indice
---

# Diodos

Componente unidireccional - la corriente pasa en un solo sentido.

```mermaid
graph LR
    A["ánodo"] -->|"──►├──"| C["cátodo\nbanda blanca / plateada"]
mermaid
graph TD
    V["+12V"] -->|corriente normal| L["bobina del relay"]
    V -.-|"cátodo (banda) ↑"| D["1N4007"]
    L --> T["Transistor / GPIO"]
    D -.-|"ánodo — pico inverso"| T
```

El diodo deja pasar el pico inverso de vuelta a la bobina, disipándolo internamente. Sin esto, el circuito muere a las pocas conmutaciones.

## Catálogo por tipo

### Rectificadores

| Modelo | $I_F$ | $V_F$ max @ $I_F$ nom | Uso |
|---|---|---|---|
| [1N4007](./1n4007.md) | 1 A | **1.1 V** @ 1 A | **Flyback** en relays/solenoides, protección polaridad |
| [1N5399](./1n5399.md) | 1.5 A | **1.4 V** @ 1.5 A | Flyback en cargas mayores |
| [1N5408](./1n5408.md) | 3 A | **1.0 V** @ 3 A | Líneas de alimentación con más corriente |

### Schottky (Vf bajo, switching rápido)

| Modelo | $I_F$ | $V_F$ max @ $I_F$ nom | Uso |
|---|---|---|---|
| [1N5819](./1n5819.md) | 1 A | **0.6 V** (~0.45 V típ) @ 1 A | Protección eficiente en alimentación |
| [1N5822](./1n5822.md) | 3 A | **0.525 V** @ 3 A | Protección de fuentes - el mejor del kit |

### Señal

| Modelo | $I_F$ | $V_F$ max | Uso |
|---|---|---|---|
| [1N4148](./1n4148.md) | 300 mA cont. (150 mA promedio) | **1 V** max @ 10 mA | Clamp de GPIO, lógica, protección de entradas |

### Fast recovery (alta velocidad)

| Modelo | $I_F$ | $V_F$ max @ $I_F$ nom | $t_{rr}$ max | Uso |
|---|---|---|---|---|
| [FR107](./fr107.md) | 1 A | **1.3 V** @ 1 A | 500 ns | Flyback en conmutación de alta frecuencia (PWM > 1 kHz) |
| [FR207](./fr207.md) | 2 A | **1.3 V** @ 2 A | 500 ns | Motores más grandes con PWM |

> Nota sobre "fast recovery": $t_{rr} = 500$ ns es la spec de la familia FR1xx/FR2xx. Para PWM más rápido (decenas de kHz), considerar **ultrafast** (UF400x con $t_{rr}$ ~75 ns) o Schottky (sub-ns).

## Identificación visual

| Lado | Indicador |
|---|---|
| Cátodo | Banda blanca/plateada en el cuerpo |
| Ánodo | El otro extremo |

LEDs: el cátodo es la **pata corta** y el lado plano del cuerpo. Ánodo es la pata larga.
