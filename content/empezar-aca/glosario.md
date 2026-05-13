# Glosario

## Las 3 capas: Brain, Box, Board

| Capa | Nombre técnico | Qué es | Ejemplo |
|---|---|---|---|
| 1 | **Brain** (SoC) | Chip de silicio fabricado por Espressif | `ESP32-S3` |
| 2 | **Box** (Módulo) | Chip + flash + antena en package metálico solderable | `ESP32-S3-WROOM-1-N16R8` |
| 3 | **Board** (DevKit) | Módulo montado en PCB con USB, pines, regulador | `ESP32-S3-DevKitC-1` |

Cuando alguien dice "estoy usando un [ESP32](../hardware/socs/index.md)" casi siempre se refiere al Board pero nombra el Brain. Esa ambigüedad es la fuente de casi toda la confusión inicial.

**Para el día a día solo importa la capa 3.** Las 1 y 2 explican _por qué_ cada board tiene las features que tiene.

---

## Siglas frecuentes

| Sigla | Significado | Dónde la vas a ver |
|---|---|---|
| SoC | System-on-Chip | Hablando del chip Espressif (la "Brain") |
| ISA | Instruction Set Architecture | Xtensa vs RISC-V |
| GPIO | General Purpose Input/Output | Pines configurables del chip |
| ADC | Analog-to-Digital Converter | Leer sensores analógicos (capacitivo de suelo, LDR) |
| DAC | Digital-to-Analog Converter | Generar audio analógico - solo [ESP32](../hardware/socs/index.md) clásico y S2 lo tienen |
| I2C | Inter-Integrated Circuit | Bus serie de 2 hilos para sensores ([SHT45](../sensores/temperatura-humedad/sht45.md), [SCD41](../sensores/co2/scd41.md), [AS7341](../sensores/luz/as7341.md)) |
| UART | Universal Async Receiver-Transmitter | Bus serie típico ([MH-Z19B](../sensores/co2/mh-z19b.md) usa UART) |
| SPI | Serial Peripheral Interface | Bus serie más rápido que I2C (displays, SD) |
| PWM | Pulse Width Modulation | Controlar intensidad de LED, velocidad de motor, buzzer pasivo |
| PSRAM | Pseudo-Static RAM | RAM externa adicional al SRAM del chip. Sufijo `R8` en módulos. |
| [OTA](../seguridad-iot/ota-firmado.md) | Over-The-Air | Actualización de firmware por WiFi |
| [NVS](../seguridad-iot/secrets-en-firmware.md) | Non-Volatile Storage | Partición clave-valor en flash, sobrevive reboot |
| ULP / LP | Ultra/Low-Power co-processor | Núcleo aux que lee sensores sin despertar el core principal |
| [MQTT](../conectividad/mqtt-stack.md) | Message Queuing Telemetry Transport | Protocolo pub/sub del proyecto |
| [VWC](../sensores/humedad-suelo/vwc.md) | Volumetric Water Content | Humedad de suelo expresada como volumen agua / volumen total |
| [PAR](../sensores/luz/conceptos-par.md) | Photosynthetically Active Radiation | Radiación 400-700nm - la que usan las plantas |
| [PPFD](../sensores/luz/conceptos-par.md) | Photosynthetic Photon Flux Density |$\mu\text{mol}/\text{m}^2/\text{s}$, sinónimo de [PAR](../sensores/luz/conceptos-par.md) en literatura |
| [NDIR](../sensores/co2/mh-z19b.md) | Non-Dispersive Infrared | Tecnología típica de sensores CO2 |
| [NDVI](../sensores/luz/conceptos-par.md) | Normalized Difference Vegetation Index | Índice de salud del canopeo: (NIR-Rojo)/(NIR+Rojo) |
| ABC | Automatic Baseline Correction | Recalibración automática del [MH-Z19B](../sensores/co2/mh-z19b.md) - **desactivar** en invernadero |
| EC | Electrical Conductivity | Conductividad eléctrica del suelo, proxy de salinidad |
| [AWG](../electronica/cables-awg.md) | American Wire Gauge | Escala de grosor de cables. **Más grande = más fino.** |

---

## Arquitecturas de CPU

| ISA | Chips [ESP32](../hardware/socs/index.md) | Notas |
|---|---|---|
| Xtensa LX6 | [ESP32](../hardware/socs/index.md) clásico | ISA propietaria de Cadence/Tensilica |
| Xtensa LX7 | S2, S3 | Igual que LX6 + instrucciones SIMD en S3 |
| RISC-V | C2, C3, C5, C6, H2, P4 | ISA abierta, toolchain limpio, debug predecible |

Detalle completo en [`../hardware/arquitecturas-cpu.md`](../hardware/arquitecturas-cpu.md).

---

## Decodificando un module name

```
ESP32-S3-WROOM-1-N16R8
│ │ │ │ │ └─ R8 = 8 MB PSRAM
│ │ │ │ └──── N16 = 16 MB Flash (rango temp. normal)
│ │ │ └─────── 1 = revisión de silicio
│ │ └───────────── WROOM = formato de módulo
│ └──────────────── S3 = variante de SoC (Brain)
└─────────────────────── ESP32 = familia de producto
```

| Código | Significa |
|---|---|
| N4 / N8 / N16 | Flash en MB, temp. normal (-40 a +$85\,°\text{C}$) |
| H4 / H8 | Flash en MB, temp. alta (-40 a +$105\,°\text{C}$) |
| R2 / R8 | PSRAM en MB |
| `…U-N8` | La `U` antes del código de memoria = conector U.FL para antena externa |
| MINI | Módulo compacto (menos GPIO) en vez de [WROOM](../hardware/modulos/wroom.md) |
| DevKitC | Lleva módulo [WROOM](../hardware/modulos/wroom.md) adentro |
| DevKitM | Lleva módulo MINI adentro |

---

## Tipos de USB en DevKits

| Tipo | Qué hace |
|---|---|
| **Native USB** (OTG / Serial-JTAG) | USB conectado directo al periférico USB del SoC. La placa puede actuar como HID, CDC, OTG. Flasheo + debug sin chip externo. |
| **Bridge USB** (CP2102, CH340, FTDI) | Chip USB-to-UART intermediario. Solo sirve para flashear y monitor serie. No enumerable como dispositivo USB. |
