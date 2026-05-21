---
title: "LEDs"
description: "Cálculo de resistencia en serie para LEDs indicadores, tabla de valores por color y tensión, e identificación de patas."
tags:
  - electronica
  - componente
---

# LEDs

Diodos emisores de luz. Siempre requieren resistencia en serie, sin excepciones.

## Cálculo de resistencia

$$R = \frac{V_{\text{fuente}} - V_{\text{LED}}}{I_{\text{LED}}}$$

Los dos valores **dependen del LED específico** y siempre conviene chequear el datasheet:

| Parámetro | De dónde sale | Variabilidad típica |
|---|---|---|
| `V_led` (Vf, forward voltage) | Datasheet del LED | \~1.8V rojo, \~2.2V verde clásico, \~3.0V azul/blanco/verde InGaN |
| `I_led` (If, forward current) | Datasheet del LED | Varía mucho según tipo - ver tabla abajo |

### I_led por tipo de LED

| Tipo | I_led típica | Notas |
|---|---|---|
| Low-current (ej. Kingbright L-7104LIT) | 2 mA | Diseñados para drive directo desde lógica CMOS/IO |
| Indicador 5mm bajo consumo | 5 mA | Suficiente para visibilidad en ambiente moderado |
| Indicador 5mm estándar - bias conservador | **10 mA** | Buena visibilidad, vida útil larga, menor estrés térmico |
| Indicador 5mm estándar - rated max | 20 mA | Brillo máximo según datasheet típico |
| Ultra-bright / alta luminosidad | 30 mA | Verificar datasheet, no asumir |
| SMD modernos (0603, 0805, etc.) | 5-20 mA | Muy variable, leer datasheet siempre |
| LEDs de potencia (cultivo, iluminación) | 350 mA - 1 A+ | **No usar resistencia** - requieren driver de corriente constante  |

## Tabla rápida - LEDs indicadores 5mm a I_led = 10 mA

> Valores calculados para un LED 5mm estándar con el bias conservador (10 mA) que da buena visibilidad y vida útil larga. Si tu LED rate a otro corriente (ej. low-current 2 mA, o ultra-bright 30 mA), recalcular con la fórmula de arriba.

| Color | Vf típico | R para 3.3V | R para 5V |
|---|---|---|---|
| Rojo | 2.0V | $130\,\Omega$ $\leftrightarrow$ **$150\,\Omega$** | $300\,\Omega$ $\leftrightarrow$ **$330\,\Omega$** |
| Verde (GaP/AlGaInP clásico) | 2.2V | $110\,\Omega$ $\leftrightarrow$ **$150\,\Omega$** | $280\,\Omega$ $\leftrightarrow$ **$330\,\Omega$** |
| Verde (InGaN moderno) | 3.0-3.2V | $30\,\Omega$ $\leftrightarrow$ **$47\,\Omega$** | $180\,\Omega$ $\leftrightarrow$ **$220\,\Omega$** |
| Amarillo | 2.1V | $120\,\Omega$ $\leftrightarrow$ **$150\,\Omega$** | $290\,\Omega$ $\leftrightarrow$ **$330\,\Omega$** |
| Azul | 3.0V | $30\,\Omega$ $\leftrightarrow$ **$47\,\Omega$** | $200\,\Omega$ $\leftrightarrow$ **$220\,\Omega$** |
| Blanco | 3.0-3.4V | $30\,\Omega$ $\leftrightarrow$ **$47\,\Omega$** | $200\,\Omega$ $\leftrightarrow$ **$220\,\Omega$** |

Cuando dudás del tipo exacto de LED, **$220\,\Omega$ para 3.3V** y **$330\,\Omega$ para 5V** son seguros con la mayoría de los LEDs 5mm estándar (van a quedar tirando entre 5-15 mA según el color, lo cual es perfectamente usable como indicador).

## Identificación de patas

| Lado | Pata |
|---|---|
| Ánodo (+) | Pata **larga** |
| Cátodo (−) | Pata **corta** + lado plano del cuerpo |

```mermaid
graph LR
    V["+Vcc"] --> R["R"] -->|"ánodo (＋)"| LED["─►├─ LED"] -->|"cátodo (－)"| GND["GND"]
```


## LED RGB (en DevKits S3, C3, C6)

Los DevKits-1 modernos traen un **LED WS2812** (NeoPixel) onboard, controlable por GPIO único con protocolo serie. No es un LED RGB de 4 patas - es un LED inteligente con chip integrado.

