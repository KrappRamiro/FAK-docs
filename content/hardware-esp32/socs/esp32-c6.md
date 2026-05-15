# ESP32-C6

RISC-V, single-core + LP co-processor.

Datasheet oficial: [Espressif ESP32-C6](https://www.espressif.com/en/products/socs/esp32-c6), [Datasheet PDF](https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf)

## Specs

- Single-core HP 160 MHz + LP RISC-V hasta 20 MHz
- **WiFi 6 (2.4 GHz) + BLE 5.0 + 802.15.4**
- 512 KB HP SRAM + 16 KB LP SRAM, 30 GPIO (QFN40) o 22 GPIO (QFN32)
- USB Serial/JTAG nativo
- LP co-processor puede leer sensores I2C sin despertar el core principal
- Deep-sleep ~$7\,\mu\text{A}$ (RTC timer + LP memory) - per [datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf), Tabla 5-11
- ISA: RISC-V (ver [arquitecturas-cpu.md](../arquitecturas-cpu.md))

## Casos de uso típicos

- Dispositivos Matter / Thread / Zigbee (radio 802.15.4 + WiFi en un solo chip)
- Sensores a batería con consumo ultra-bajo (LP co-processor)
- WiFi 6 si el AP soporta

## Módulos asociados

- **WROOM-1** / **WROOM-1U** - módulos estándar. Ver [modulos/wroom.md](../modulos/wroom.md).

## DevKits comunes

- [ESP32-C6-DevKitC-1](../devkits/espressif/esp32-c6-devkitc-1.md)
- [XIAO ESP32-C6](../devkits/seeed-xiao/xiao-esp32-c6.md)
- [SparkFun Thing Plus ESP32-C6](../devkits/sparkfun/sparkfun-thing-plus-c6.md)
- [SparkFun ESP32-C6 Qwiic Pocket](../devkits/sparkfun/sparkfun-c6-qwiic-pocket.md)
