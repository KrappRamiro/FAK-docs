---
title: "Arduino + arduino-esp32"
description: "Ficha del framework Arduino para ESP32: capa C++ mantenida por Espressif sobre ESP-IDF con ecosistema masivo de librerías."
tags:
  - hardware-esp32
  - framework
  - arduino
---

# Arduino + arduino-esp32

Capa Arduino para ESP32. Mantenida por Espressif.

Páginas oficiales: [arduino-esp32 en GitHub](https://github.com/espressif/arduino-esp32), [Docs Arduino-ESP32](https://docs.espressif.com/projects/arduino-esp32/en/latest/)

## Specs

- **Lenguaje:** C++ (con `setup()` / `loop()` clásico de Arduino)
- Ecosistema masivo de librerías

## Errores tipicos a evitar.

- `delay()` bloquea el task FreeRTOS, puede blockear el stack de WiFi si > ~100ms. Usar `vTaskDelay(pdMS_TO_TICKS(ms))` o `millis()`.
- Algunas libs asumen 5V (mundo AVR) , pero el GPIO del ESP32 es 3.3V, hay que adaptar.

