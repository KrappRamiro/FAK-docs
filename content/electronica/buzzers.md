---
title: "Buzzers"
description: "Comparativa entre buzzers activos y pasivos, circuito típico de control con GPIO del ESP32 y patrones de alarma por contexto."
tags:
  - electronica
  - componente
  - esp32
---

# Buzzers

Generadores de sonido. Útiles para alarmas locales en el nodo.

## Pasivo vs Activo

|                    | Pasivo                                       | Activo                      |
| ------------------ | -------------------------------------------- | --------------------------- |
| Control            | Necesita señal PWM de frecuencia variable    | Solo 3.3V/5V - suena solo   |
| Tono               | Configurable por firmware                    | Fijo                        |
| Flexibilidad       | Alta - melodías y alertas diferenciadas      | Baja                        |
| Uso en invernadero | Alertas con tono distinto por tipo de alarma | Beep simple de confirmación |

## Kit del proyecto

**10x buzzers pasivos 12mm** $\rightarrow$ se controlan con PWM desde GPIO del [ESP32](../hardware-esp32/socs/index.md).

## Circuito típico (buzzer pasivo)

```mermaid
graph LR
    GPIO["GPIO"] -->|"(＋)"| BUZ["buzzer"]
    BUZ -->|"(－)"| GND["GND"]
```

Un buzzer **piezo pasivo de 12 mm consume típicamente 3-5 mA** ([CUI Devices CPT-1207-3TH](https://www.cuidevices.com/product/audio/buzzers/piezo-and-magnetic-buzzers) y similares), muy por debajo del límite del GPIO del ESP32 (~20 mA default, 40 mA max).

Por lo tanto se puede manejar **directo desde un GPIO sin transistor**, pero por las dudas igual conviene usar un transistor.

Para buzzers **magnéticos/electromagnéticos** (consumo mayor, ~30-50 mA) sí conviene transistor.

## Código ejemplo - ESP-IDF con LEDC

## Frecuencias útiles

| Hz   | Sensación                          |
| ---- | ---------------------------------- |
| 500  | Grave, atención sin urgencia       |
| 1000 | Beep estándar                      |
| 2000 | Mejor sensibilidad del oído humano |
| 4000 | Alarma - pico de molestia          |

Los buzzers pasivos chinos tienen una resonancia natural típicamente entre **2-4 kHz**. Fuera de ese rango el volumen baja drásticamente. Si querés melodías, el rango más audible es **400 Hz - 5 kHz**.

## Tipos de alarma por contexto

> Estos son ejemplos que tire por tirar

| Evento              | Patrón sugerido                          |
| ------------------- | ---------------------------------------- |
| WiFi conectado      | 1 beep corto, 1 kHz                      |
| Riego iniciado      | 2 beeps cortos, 2 kHz                    |
| Sensor desconectado | 3 beeps largos, 1 kHz                    |
| Falla crítica       | Beep continuo a 4 kHz hasta intervención |

## Limitaciones

- Lugar de instalación grande = un buzzer chico no se escucha desde lejos
- Para alarmas remotas, mejor mandar la alerta por MQTT ademas del sonido
- El buzzer es útil para feedback local durante manipulación del nodo (instalación, mantenimiento)
