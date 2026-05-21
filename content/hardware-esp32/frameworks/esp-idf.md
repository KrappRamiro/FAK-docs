---
title: "ESP-IDF"
description: "Ficha del SDK oficial de Espressif en C/C++ con FreeRTOS, HAL completo, JTAG/GDB y Component Registry."
tags:
  - hardware-esp32
  - framework
  - esp-idf
---

# ESP-IDF

SDK oficial de Espressif para programar ESP32 en C/C++.

Páginas oficiales: [ESP-IDF en Espressif](https://idf.espressif.com/), [Documentación ESP-IDF](https://docs.espressif.com/projects/esp-idf/en/latest/), [Repo en GitHub](https://github.com/espressif/esp-idf)

## Specs

- **Lenguaje:** C / C++
- **OS:** FreeRTOS nativo
- **Incluye:** HAL completo, heap tracing, [Component Registry](https://components.espressif.com/), JTAG/GDB
- **Logging:** `ESP_LOGI/W/E` - equivalente a cualquier framework de logging
- `vTaskDelay()` cede el scheduler correctamente y no bloquea el stack WiFi

