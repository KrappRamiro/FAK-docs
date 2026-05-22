---
title: "ESP32-P4"
description: "Ficha del ESP32-P4: RISC-V dual-core a 400 MHz sin wireless, con MIPI camera/display, H.264 y Ethernet MAC."
tags:
  - hardware-esp32
  - soc
  - esp32-p4
  - risc-v
---

# ESP32-P4

RISC-V, dual-core. **Sin wireless.**

Datasheet oficial: [Espressif ESP32-P4](https://www.espressif.com/en/products/socs/esp32-p4)

## Specs

- Dual-core HP **400 MHz** + LP RISC-V single-core hasta 40 MHz
- **Sin WiFi, sin BT, sin 802.15.4**
- 768 KB HP L2MEM + 32 KB LP SRAM, 55 GPIO (16 LP + 39 HP)
- **H.264 encoder** baseline por hardware (solo encode, no decode)
- MIPI CSI (cámara) + MIPI DSI (display) + USB 2.0 High-Speed OTG + USB 2.0 Full-Speed OTG + USB Serial/JTAG
- Ethernet MAC
- 16 MB o 32 MB PSRAM in-package (variantes ESP32-P4NRW16X / ESP32-P4NRW32X)
- Touch sensor (TOUCH_CHANNEL en GPIO2-GPIO15)
- Deep-sleep ~$12\,\mu\text{A}$ (LP timer + LP memory) - per [datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-p4_datasheet_en.pdf), Tabla 5-8
- ISA: RISC-V (ver [arquitecturas-cpu.md](../arquitecturas-cpu.md))

## Casos de uso típicos

- HMI con display grande, procesamiento de video
- Edge compute pesado
- Cámaras de alta resolución con encoding hardware
- **Diseños de dos chips:** P4 = compute + [C6](esp32-c6.md) = wireless

## Módulos asociados

- Hoy no hay módulo Espressif (WROOM/MINI) para el P4: se distribuye como SoC bare-die. Ver [modulos/README.md](../modulos/index.md).

## DevKits comunes

- [ESP32-P4-DevKitM-2](../devkits/espressif/esp32-p4-devkitm-2.md)
- [ESP32-P4-EYE](../devkits/espressif/esp32-p4-eye.md)
- [M5Stack Tab5](../devkits/m5stack/m5stack-tab5.md) - combina P4 + C6 con pantalla 5"
