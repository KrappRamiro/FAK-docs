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

**$10\times$ buzzers pasivos 12mm** $\rightarrow$ se controlan con PWM desde GPIO del [ESP32](../hardware/socs/index.md).

## Circuito típico (buzzer pasivo)

```
GPIO ──── [+] buzzer [−] ──── GND
```

Un buzzer **piezo pasivo de 12 mm consume típicamente 3-5 mA** ([CUI Devices CPT-1207-3TH](https://www.cuidevices.com/product/audio/buzzers/piezo-and-magnetic-buzzers) y similares), muy por debajo del límite del GPIO del ESP32 (~20 mA default, 40 mA max). Por lo tanto se puede manejar **directo desde un GPIO sin transistor**. Para buzzers **magnéticos/electromagnéticos** (consumo mayor, ~30-50 mA) sí conviene transistor.

## Código ejemplo - ESP-IDF con LEDC

```c
#include "driver/ledc.h"

#define BUZZER_GPIO 25
#define BUZZER_TIMER LEDC_TIMER_0
#define BUZZER_CHAN LEDC_CHANNEL_0

void buzzer_init(void) {
 ledc_timer_config_t timer = {
 .speed_mode = LEDC_LOW_SPEED_MODE,
 .timer_num = BUZZER_TIMER,
 .duty_resolution = LEDC_TIMER_8_BIT,
 .freq_hz = 2000, // 2 kHz, frecuencia central audible
 .clk_cfg = LEDC_AUTO_CLK,
 };
 ledc_timer_config(&timer);

 ledc_channel_config_t chan = {
 .gpio_num = BUZZER_GPIO,
 .speed_mode = LEDC_LOW_SPEED_MODE,
 .channel = BUZZER_CHAN,
 .timer_sel = BUZZER_TIMER,
 .duty = 0, // arranca apagado
 .hpoint = 0,
 };
 ledc_channel_config(&chan);
}

void buzzer_tone(uint32_t freq_hz, uint32_t duration_ms) {
 ledc_set_freq(LEDC_LOW_SPEED_MODE, BUZZER_TIMER, freq_hz);
 ledc_set_duty(LEDC_LOW_SPEED_MODE, BUZZER_CHAN, 128); // 50% duty
 ledc_update_duty(LEDC_LOW_SPEED_MODE, BUZZER_CHAN);
 vTaskDelay(pdMS_TO_TICKS(duration_ms));
 ledc_set_duty(LEDC_LOW_SPEED_MODE, BUZZER_CHAN, 0);
 ledc_update_duty(LEDC_LOW_SPEED_MODE, BUZZER_CHAN);
}
```

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
- Para alarmas remotas, mejor mandar la alerta por [MQTT](../conectividad/mqtt-stack.md) ademas del sonido
- El buzzer es útil para feedback local durante manipulación del nodo (instalación, mantenimiento)
