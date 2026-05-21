---
title: "Arquitecturas de CPU: Xtensa vs RISC-V"
description: "Comparación práctica entre las ISAs Xtensa LX6/LX7 y RISC-V usadas en la línea ESP32, con impacto en toolchain y debug."
tags:
  - hardware-esp32
  - referencia
---

# Arquitecturas de CPU: Xtensa vs RISC-V

Todos los [ESP32](socs/index.md) caen en una de dos ISAs. Como desarrollador de sistemas, esto es lo que cambia:

## Xtensa LX6 / LX7 (ESP32 clásico, S2, S3)

- **ISA propietaria** de Cadence/Tensilica - spec completa requiere NDA
- **Instrucciones de longitud variable**: 16, 24 o 32 bits mezclados - más difícil de leer en disassembly
- **Register windows**: 64 registros físicos, expuestos de a 16 por frame de llamada. En ISRs esto requiere save/restore explícito del estado de ventana - el `IRAM_ATTR` en [ESP-IDF](frameworks/esp-idf.md) existe exactamente por esto.
- **Toolchain**: fork propietario de GCC (`xtensa-esp32-elf-gcc`). No funciona con GCC upstream.
- **Tendencia**: no hay nuevos chips Xtensa anunciados más allá del S3.

## RISC-V (C2, C3, C5, C6, H2, P4)

- **ISA completamente abierta** - spec pública gratuita, sin NDAs
- **Instrucciones de 32 bits fijas** + extensión `C` de 16 bits comprimidos (RV32IMC) - encoding regular y predecible
- **32 registros planos** (x0-x31) - sin register windows, sin sorpresas en GDB
- **Toolchain**: `riscv32-esp-elf-gcc` con soporte upstream de LLVM/Clang
- **Debug**: RISC-V Debug Spec estándar - OpenOCD mainstream funciona sin patches de vendor
- **Tendencia**: todos los chips nuevos de Espressif son RISC-V. El P4 a 400 MHz demostró que escala al tier de alto rendimiento.

## Impacto práctico

| Situación | Recomendación |
|---|---|
| Usando [ESP-IDF](frameworks/esp-idf.md) o Arduino | No notás la diferencia porque el compila en ambos |
| Cámara o frame buffer grande en PSRAM | [ESP32-S3](socs/esp32-s3.md) (LX7) - única con MIPI camera + 8 MB PSRAM en módulo único |
| Budget de energía ajustado | RISC-V siempre - toda la serie H existe por esto |
| Debug a bajo nivel | RISC-V - crash dumps, stack traces y disassembly mucho más legibles |
| Proyecto nuevo sin restricciones | Default a RISC-V |
