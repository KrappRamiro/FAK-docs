# ESP32-S2-DevKitC-1

DevKit oficial para [ESP32-S2](../../socs/esp32-s2.md).

Docs oficiales: [ESP32-S2-DevKitC-1 user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s2/esp32-s2-devkitc-1/user_guide.html)

## Specs

| Spec | Valor |
|---|---|
| SoC | [ESP32-S2](../../socs/esp32-s2.md) |
| Flash/PSRAM | 4 MB / - |
| USB | Micro-B x2 (OTG nativo + bridge) |
| Módulo interno | **[SOLO](../../modulos/solo.md)** / SOLO-2 / SOLO-U / SOLO-2U (no WROOM - ver [modulos/solo.md](../../modulos/solo.md)) |
## Trampa importante

**Lleva módulos SOLO, no WROOM.** Es la única excepción a la dicotomía DevKitC $\rightarrow$ WROOM en el lineup Espressif. Ver [modulos/solo.md](../../modulos/solo.md).

## Cuándo elegirlo

- Proyectos USB device / host (HID, CDC, MSC) sin necesidad de Bluetooth
- IoT sin BT donde el USB nativo es valor agregado
