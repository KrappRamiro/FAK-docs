# ESP32-H2-DevKitM-1

DevKit oficial para [ESP32-H2](../../socs/esp32-h2.md). Sin WiFi - solo BLE 5.0 + 802.15.4.

Docs oficiales: [ESP32-H2-DevKitM-1 user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32h2/esp32-h2-devkitm-1/user_guide.html)

## Specs

| Spec | Valor |
|---|---|
| SoC | [ESP32-H2](../../socs/esp32-h2.md) |
| USB | USB-C x2 (Serial/JTAG nativo + bridge UART) - única vía de acceso, sin WiFi |
| Módulo interno | [MINI-1](../../modulos/mini.md) / MINI-1U |
| Extras | Antena 802.15.4, RGB LED |
## Cuándo elegirlo

- End-nodes Thread / Zigbee a batería con duración de años (~$5\,\mu\text{A}$ deep sleep)
- Sensores remotos sin necesidad de WiFi (radio mesh + relay vía gateway)

## Trampa

Sin WiFi, el firmware se flashea exclusivamente vía USB. Si el USB falla, el chip queda inalcanzable hasta resolver el cableado físico.
