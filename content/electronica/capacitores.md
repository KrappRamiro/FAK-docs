# Capacitores

Almacenan carga eléctrica. Capacidad en Farads (F), típicamente en pF, nF o $\mu\text{F}$.

## Electrolíticos

- **Polarizados** - tienen polo positivo y negativo. **Conectar al revés los destruye** (pueden explotar).
- Valores grandes: $1 - 1000\,\mu\text{F}$
- Para **filtrado de alimentación** y **desacople de baja frecuencia**
- Voltaje de trabajo debe ser mayor al del circuito (margen x1.5 mínimo)
- Ejemplo: $100\,\mu\text{F}$ en paralelo con la fuente para absorber picos

```
 │ ── (+)
 │
 [Electrolítico]
 │
 │ ── (−) ← banda blanca en el cuerpo marca este lado
```

## Cerámicos

- **No polarizados** - cualquier orientación
- Valores pequeños: 1 pF - 100 nF
- Para **desacople de alta frecuencia** cerca de cada chip
- [**Regla estándar: 100nF cerámico entre VCC y GND de cada IC**, lo más cerca posible del pin de alimentación](https://www.reddit.com/r/electronics/comments/q8piq/why_do_many_boards_have_capacitors_tied_between/)
- Ejemplo: 100nF entre 3.3V y GND del [ESP32](../hardware/socs/index.md) para filtrar ruido de RF

## Regla rápida

| Necesidad | Tipo |
|---|---|
| Filtrado de fuente / carga pesada | Electrolítico |
| Desacople de IC / alta frecuencia | Cerámico |
| Aplicaciones críticas | Ambos en paralelo |

## Lectura de valores

### Electrolíticos
Vienen con el valor impreso directamente: $100\,\mu\text{F},\;16\,\text{V}$, $470\,\mu\text{F},\;25\,\text{V}$.

### Cerámicos
Código de 3 dígitos: los primeros 2 son cifras, el tercero es la potencia de 10, resultado en **pF**.

| Código | Valor |
|---|---|
| `104` | $10 \times 10^4 = 100{,}000$ pF $= 100$ nF $= 0.1\,\mu\text{F}$ |
| `103` | $10 \times 10^3 = 10{,}000$ pF $= 10$ nF |
| `102` | $10 \times 10^2 = 1{,}000$ pF $= 1$ nF |
| `220` | $22 \times 10^0 = 22$ pF |

El **104** (100nF) es el más usado en desacople.

## Para el ESP32

### Pin `3V3` del módulo WROOM/MINI

El módulo ya trae internamente los capacitores 100nF cerquita de cada pin VDD del chip ESP32 (parte del PCB del módulo, no tocás nada de eso). En tu PCB externa, sobre el pin `3V3` de entrada del módulo, va el desacople bulk + HF:

| Cap | Valor verificado en el schematic oficial |
|---|---|
| Bulk | **$22\,\mu\text{F}$** electrolítico/cerámico |
| Alta frecuencia | **100nF** cerámico (código 104) |

Ambos en paralelo lo más cerca posible del pin `3V3`. **Fuente**: [schematic oficial ESP32-DevKitC V4](https://dl.espressif.com/dl/schematics/esp32_devkitc_v4-sch.pdf), sección "ESP32 Module", componentes **C21** ($22\,\mu\text{F}/10\text{V}$ 20%) y **C22** ($0.1\,\mu\text{F}$/50V 10%) ambos sobre la red `VDD33` del WROOM-32.

> El bulk de $22\,\mu\text{F}$ absorbe los picos de corriente cuando el radio WiFi/BT transmite (TX bursts pueden ser ~250 mA pico). El 100nF filtra ruido residual de alta frecuencia. Sin esos caps, el ESP32 puede resetearse durante intentos de conexión.

### Otros componentes del circuito (reguladores, sensores, módulos)

**Cada componente activo tiene sus propios capacitores recomendados por el fabricante.** No prescribimos valores acá porque dependen del modelo exacto que uses. La info específica está en cada doc:

- LDO lineal 3.3V (AMS1117, LM1117, LP5907, TLV757, etc.) $\rightarrow$ ver [`potencia/index.md`](potencia/index.md)
- Buck converter LM2596S $\rightarrow$ ver [`potencia/lm2596s.md`](potencia/lm2596s.md)
- Módulo pre-armado MB102 $\rightarrow$ ver [`potencia/mb102.md`](potencia/mb102.md)
- Sensor específico (SHT45, SCD41, AS7341, ...) $\rightarrow$ ver `sensores/<sensor>.md`

### Recordatorio para el armado final

Antes de definir cualquier capacitor en el circuito final, bajar el datasheet del componente exacto que vas a usar y buscar:

| Qué buscar | Dónde | Para qué te sirve |
|---|---|---|
| Sección **"Application Information"** o **"Typical Application Circuit"** | Suele estar entre las páginas 8-15 del datasheet | Tiene el schematic de referencia con valores específicos |
| **Cin** (input capacitor) | Para reguladores | Valor + tipo (cerámico/tantalio/electrolítico) + voltaje rating |
| **Cout** (output capacitor) | Para reguladores | Mismos parámetros que Cin, suelen ser distintos |
| **"ESR"** o **"ESR range"** | Reguladores LDO | Si dice "stable with low-ESR ceramic" $\rightarrow$ cerámico funciona. Si dice "tantalum required" $\rightarrow$ no usar cerámico solo (el lazo de feedback puede oscilar) |
| **"Bypass capacitor"** o **"Decoupling"** | Sensores | La mayoría pide 100nF entre VDD y GND lo más cerca posible del chip; algunos piden también un bulk de $1 - 10\,\mu\text{F}$ |
| **"PCB Layout Considerations"** | Cualquier datasheet decente | Distancia máxima del cap al pin que protege, ground plane debajo, etc. |

> Si el datasheet no menciona caps explícitos, copiar lo que aparezca en el "Typical Application Circuit" es el default más seguro.

