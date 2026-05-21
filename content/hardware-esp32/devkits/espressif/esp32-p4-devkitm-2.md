---
title: "ESP32-P4-DevKitM-2"
description: "DevKit oficial Espressif para ESP32-P4 con 16 MB flash, 32 MB PSRAM, H.264 hw, MIPI y módulo C6 para wireless."
tags:
  - hardware-esp32
  - devkit
  - espressif
  - esp32-p4
---

# ESP32-P4-DevKitM-2

> **Nota:** el nombre oficial de Espressif es **ESP32-P4-Function-EV-Board** (no hay un producto llamado "DevKitM-2" en el catálogo).

DevKit oficial para [ESP32-P4](../../socs/esp32-p4.md) con módulo [ESP32-C6-MINI-1](../../socs/esp32-c6.md) para wireless.

Docs oficiales: [ESP32-P4-Function-EV-Board user guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/esp32-p4-function-ev-board/user_guide.html)

## Specs

| Spec | Valor |
|---|---|
| SoC | [ESP32-P4](../../socs/esp32-p4.md) + [ESP32-C6](../../socs/esp32-c6.md) (módulo C6-MINI-1) para wireless |
| Flash/PSRAM | 16 MB / 32 MB PSRAM |
| USB | USB-C x3 (Serial/JTAG + Full-speed + OTG High-Speed) + USB-A x1 |
| Extras | MIPI DSI + MIPI CSI, Ethernet 10/100, 40 GPIO header, H.264 hw codec |
## Cuándo elegirlo

- Procesamiento de video con encoding hardware (H.264)
- HMI con display grande
- Cualquier proyecto que combine compute pesado + wireless (P4 + C6)
