# Arduino + arduino-esp32

Capa Arduino para ESP32. Mantenida por Espressif.

Páginas oficiales: [arduino-esp32 en GitHub](https://github.com/espressif/arduino-esp32), [Docs Arduino-ESP32](https://docs.espressif.com/projects/arduino-esp32/en/latest/)

## Specs

- **Lenguaje:** C++ (con `setup()` / `loop()` clásico de Arduino)
- **Abstracción:** alta
- Ecosistema masivo de librerías

## Trampas frecuentes

- `delay()` bloquea el task FreeRTOS - puede starvar el WiFi stack si > ~100ms. Usar `vTaskDelay(pdMS_TO_TICKS(ms))` o `millis()`.
- Librerías Arduino no siempre testeadas en ESP32 - comportamientos distintos a AVR Arduino tradicional.
- Algunas libs asumen 5V (mundo AVR) - el GPIO del ESP32 es 3.3V, hay que adaptar.

## Para quién

Makers que vienen de AVR, prototipado rápido sin curva de aprendizaje.

## Combinaciones típicas

- **Arduino + [PlatformIO](./platformio.md)** - mismo Arduino pero con dependency management y unit testing
- **Arduino IDE 2.x** - IDE oficial moderno, basta para empezar
