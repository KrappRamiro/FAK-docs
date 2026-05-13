# Electrónica Básica

Componentes pasivos y módulos de potencia que vas a usar antes de cualquier sensor.

## Por componente

| Archivo | Para qué |
|---|---|
| [`resistencias.md`](./resistencias.md) | Limitar corriente, dividir tensión, pull-up/pull-down |
| [`capacitores.md`](./capacitores.md) | Filtrar fuente, desacoplar ICs, eliminar ruido |
| [`transistores/`](./transistores/index.md) | Manejar cargas > 20mA desde un GPIO (BJT, MOSFET, Darlington) |
| [`diodos/`](./diodos/index.md) | Flyback en relays, protección polaridad, rectificación |
| [`leds.md`](./leds.md) | Indicadores de estado, alarmas visuales |
| [`potencia/`](./potencia/index.md) | Relays opto, [LM2596S](potencia/lm2596s.md), [MB102](potencia/mb102.md), [L298N](potencia/l298n.md) |
| [`cables-awg.md`](./cables-awg.md) | Qué grosor para qué corriente |
| [`breadboards.md`](./breadboards.md) | Tamaños, layout del DevKit |
| [`buzzers.md`](./buzzers.md) | Alarmas sonoras |

## Reglas de oro

1. **GPIO del ESP32 entrega típicamente ~20mA (default drive strength), 40mA absolute max** ([ESP32 datasheet Tabla 5-3](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)). Para cargas mayores: transistor o módulo con optoacoplador. (Ojo: el viejo "12mA" que aparece en muchos tutoriales era del ESP8266, no aplica al ESP32.)
2. **Toda carga inductiva (relay, motor, solenoide, electroválvula) lleva diodo flyback** en antiparalelo con la bobina.
3. **El [ESP32](../hardware/socs/index.md) trabaja a 3.3V.** Señales de 5V que entren a un GPIO dañan el chip. Verificar voltaje antes de conectar shields Arduino y módulos [Grove](../hardware/conectores.md) de 5V.
4. **100nF cerámico** entre VCC y GND de cada IC, lo más cerca posible del pin de alimentación.
5. **Resistor en serie** con todo LED. Sin excepciones.
