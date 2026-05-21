---
title: "PlatformIO"
description: "Ficha de PlatformIO: capa de tooling sobre Arduino o ESP-IDF con dependency management, unit testing y soporte multi-board."
tags:
  - hardware-esp32
  - framework
  - platformio
---

# PlatformIO

Capa de tooling sobre [Arduino](./arduino.md) o [ESP-IDF](./esp-idf.md). No es un framework en sí mismo.

Páginas oficiales: [PlatformIO](https://platformio.org/), [Plugin VS Code](https://platformio.org/install/ide?install=vscode)

## Qué provee

- Dependency management real (lockfile + versionado de libs)
- Unit testing
- Multi-board targets en un mismo proyecto
- Integración VS Code (extensión oficial)
- Debugging real con JTAG

## Cómo se relaciona con Arduino / ESP-IDF

PlatformIO no compila código por sí mismo; delega en [Arduino](./arduino.md) o [ESP-IDF](./esp-idf.md). Lo que hace es:

1. Bajar el framework solicitado
2. Resolver dependencias
3. Llamar al toolchain correcto
4. Manejar el binario final + flasheo


## Integraciones

- VS Code (extensión oficial)
- Neovim: [nvim-pio](https://github.com/ironlungx/nvim-pio/)
- CLI: `pio run`, `pio test`, `pio device monitor`
