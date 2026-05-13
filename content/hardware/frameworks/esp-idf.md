# ESP-IDF

SDK oficial de Espressif para programar ESP32 en C/C++.

Páginas oficiales: [ESP-IDF en Espressif](https://idf.espressif.com/), [Documentación ESP-IDF](https://docs.espressif.com/projects/esp-idf/en/latest/), [Repo en GitHub](https://github.com/espressif/esp-idf)

## Specs

- **Lenguaje:** C / C++
- **Build:** CMake
- **OS:** FreeRTOS nativo
- **Incluye:** HAL completo, heap tracing, [Component Registry](https://components.espressif.com/), JTAG/GDB
- **Logging:** `ESP_LOGI/W/E` - equivalente a cualquier framework de logging
- `vTaskDelay()` cede el scheduler correctamente - no bloquea el stack WiFi

## Para quién

Desarrolladores de sistemas o backend que ya conocen C/C++. Es el SDK oficial de Espressif y el camino más cercano a "hardware" sin dejar de tener tooling cómodo.

## Combinaciones típicas

- **ESP-IDF + [PlatformIO](./platformio.md)** - dependency management + integración VS Code sobre ESP-IDF
- **ESP-IDF + Arduino-as-component** - usar librerías Arduino dentro de un proyecto ESP-IDF (avanzado)
