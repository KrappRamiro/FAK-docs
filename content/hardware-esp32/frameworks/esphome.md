---
title: "ESPHome"
description: "Ficha de ESPHome: framework declarativo en YAML para ESP32 con integración nativa a Home Assistant y OTA incluido."
tags:
  - hardware-esp32
  - framework
  - esphome
---

# ESPHome

Framework declarativo en YAML para crear dispositivos IoT compatibles con Home Assistant.

Página oficial: [ESPHome](https://esphome.io/)

## Specs

- **Lenguaje:** YAML declarativo
- Zero código, configuración de sensores y actuadores por archivo
- OTA updates integrado
- Integración nativa con Home Assistant (auto-discovery via API)
- Builder oficial: [ESPHome Builder](https://esphome.io/guides/getting_started_command_line) o el add-on de Home Assistant

## Cómo funciona

1. Escribís un YAML describiendo el dispositivo (chip + sensores + actuadores + topics)
2. ESPHome genera código C++ para [ESP-IDF](./esp-idf.md) o [Arduino](./arduino.md) bajo el capó
3. Compila y flashea
4. El device se conecta a Home Assistant automáticamente

## Limitación

Sólo útil dentro del ecosistema Home Assistant. No para uso general, no es para construir un sistema IoT independiente con tu propio broker MQTT custom (aunque podés exponer MQTT, perdés gran parte del valor de ESPHome).

