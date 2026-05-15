# ESP32-C3-DevKit-RUST-1

DevKit del proyecto Rust on ESP. Aunque está orientado a Rust, el hardware funciona con cualquier framework.

Docs oficiales: [esp-rust-board repo en GitHub](https://github.com/esp-rs/esp-rust-board)

## Specs

| Spec        | Valor                                                                                              |
| ----------- | -------------------------------------------------------------------------------------------------- |
| SoC         | [ESP32-C3](../../socs/esp32-c3.md)                                                                    |
| Flash/PSRAM | 4 MB / -                                                                                           |
| USB         | USB-C Serial/JTAG nativo (sin chip bridge)                                                         |
| Extras      | Sensor [SHTC3](../../../sensores/temperatura-humedad/shtc3.md) + IMU ICM-42670 integrados, RGB LED |

## Cuándo elegirlo

- Debug JTAG sin hardware adicional
- Prototipado con sensores I2C ya soldados onboard
- Desarrollo en Rust (target oficial del esp-rs board), pero también sirve para ESP-IDF / Arduino
