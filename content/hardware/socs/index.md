# SoCs ESP32 - Catálogo de Chips

Cada chip de la línea ESP32 tiene su propia página con specs, casos de uso y links a fabricante.

> Nota: el **ESP32 clásico** (Xtensa LX6, 2016) no se documenta acá porque tiene una vulnerabilidad de voltage glitching ([Fatal Fury / LimitedResults 2019](../../seguridad-iot/fatal-fury-esp32.md)) y porque los chips modernos lo reemplazan en todos los casos de uso.

## Por chip

| Chip | ISA | Cores | Wireless | Página |
|---|---|---|---|---|
| ESP32-S2 | Xtensa LX7 | 1 + ULP | WiFi 4 | [esp32-s2.md](./esp32-s2.md) |
| ESP32-S3 | Xtensa LX7 | 2 + ULP | WiFi 4 + BLE 5.0 | [esp32-s3.md](./esp32-s3.md) |
| ESP32-C2 | RISC-V | 1 | WiFi 4 + BLE 5.0 | [esp32-c2.md](./esp32-c2.md) |
| ESP32-C3 | RISC-V | 1 | WiFi 4 + BLE 5.0 | [esp32-c3.md](./esp32-c3.md) |
| ESP32-C5 | RISC-V | 1 + LP | **WiFi 6 dual-band** + BLE 5.0 + 802.15.4 | [esp32-c5.md](./esp32-c5.md) |
| ESP32-C6 | RISC-V | 1 + LP | WiFi 6 + BLE 5.0 + 802.15.4 | [esp32-c6.md](./esp32-c6.md) |
| ESP32-H2 | RISC-V | 1 | **Sin WiFi**, BLE 5.0 + 802.15.4 | [esp32-h2.md](./esp32-h2.md) |
| ESP32-P4 | RISC-V | 2 + LP | **Sin wireless** | [esp32-p4.md](./esp32-p4.md) |

## Tabla maestra de specs

Valores tomados de los datasheets oficiales de Espressif. Deep-sleep = RTC/LP timer + memoria (sin ULP); en algunos chips se puede bajar más con configs específicas.

| Chip | MHz | SRAM | WiFi | BT | 802.15.4 | USB | GPIO | DAC | Touch | Sleep $\mu\text{A}$ |
|---|---|---|---|---|---|---|---|---|---|---|
| ESP32-S2 | 240 | 320 KB | 4 | - | - | OTG FS (USB 2.0) | 43 | 2ch | 14 | ~20 |
| ESP32-S3 | 240 | 512 KB | 4 | BLE 5.0 | - | OTG FS + Serial/JTAG | 45 | - | 14 | ~7 |
| ESP32-C2 | 120 | 272 KB | 4 | BLE 5.0 | - | - (solo JTAG) | 14 | - | - | ~5 |
| ESP32-C3 | 160 | 400 KB | 4 | BLE 5.0 | - | Serial/JTAG | 22 | - | - | ~5 |
| ESP32-C5 | 240 | 384 KB | **6 dual** | BLE 5.0 | ✓ | Serial/JTAG | 29 | - | - | ~12 |
| ESP32-C6 | 160 | 512 KB | **6** | BLE 5.0 | ✓ | Serial/JTAG | 30 / 22 | - | - | ~7 |
| ESP32-H2 | 96 | 320 KB | - | BLE 5.0 | ✓ | Serial/JTAG | 19 | - | - | ~7 |
| ESP32-P4 | **400** | 768 KB | - | - | - | OTG HS + FS + Serial/JTAG | **55** | - | ✓ | ~12 |

## Observaciones clave

- DAC solo en el S2 dentro de los chips modernos (en el clásico también, pero está deprecated).
- Touch en S2, S3 y P4. No existe en la familia C ni en el H2.
- Solo el P4 tiene **Ethernet MAC** integrado entre los modernos.
- El P4 no tiene wireless por diseño - se combina con un [C6](./esp32-c6.md) en diseños de dos chips.
- Tres chips integran 802.15.4 (Thread/Zigbee): C5, C6 y H2. El C5 además es el único con WiFi 5 GHz.
- Todos los chips RISC-V (C2, C3, C5, C6, H2, P4) tienen interrupciones estándar y debug predecible - ver [arquitecturas-cpu.md](../arquitecturas-cpu.md).
- "ESP32S" sin número es marketing inventado por vendedores chinos, típicamente significa el chip clásico genérico.
