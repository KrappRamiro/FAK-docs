# Diodos

Componente unidireccional - la corriente pasa en un solo sentido.

```
ánodo ──►├── cátodo ← banda blanca/plateada del cuerpo
```

Cuando hay tensión positiva ánodo $\rightarrow$ cátodo, el diodo conduce con una caída de tensión. La regla "0.7V silicio / 0.3V Schottky" es válida solo a corrientes bajas. **A la corriente nominal del diodo el Vf real es bastante más alto**: ~1 V para un silicio rectificador @ 1 A, ~0.5 V para un Schottky @ corriente nominal. Verificar siempre el datasheet específico cuando el margen de tensión importa.

## Regla de flyback - la más importante

> **Todo componente inductivo (relay, motor DC, solenoide, electroválvula) lleva un [1N4007](./1n4007.md) en antiparalelo con la bobina.**

Cuando cortás la corriente en una bobina, el campo magnético colapsa y genera un pico de tensión inversa que **destruye el transistor o el GPIO del ESP32**.

```
 ─►├─
 ┌─ 1N4007 ─┐ ← cátodo (banda) hacia +V
 (+V) (−)
 │ │
 [bobina del relay]
 │ │
 +12V Transistor / GPIO
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
