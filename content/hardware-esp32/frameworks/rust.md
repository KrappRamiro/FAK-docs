---
title: "Rust en ESP32"
description: "Guía de Rust para ESP32: toolchain Xtensa vs RISC-V, std con esp-idf-svc, no_std con esp-hal y Embassy async."
tags:
  - hardware-esp32
  - framework
  - rust
---

# Rust en ESP32

Catálogo de opciones para programar un ESP32 en Rust. Es una alternativa a [ESP-IDF en C](index.md) con buen tooling oficial de Espressif.

## Fuentes oficiales

- [The Rust on ESP Book (esp-rs)](https://docs.esp-rs.org/book/) : guía de referencia mantenida por la organización esp-rs
- [Espressif - The Rust on ESP Book (mirror oficial)](https://docs.espressif.com/projects/rust/book/) : mismo contenido publicado desde docs.espressif.com
- [esp-rs/rust en GitHub](https://github.com/esp-rs/rust) : fork de Rust para soportar Xtensa
- [esp-rs en GitHub (org completa)](https://github.com/esp-rs) : todos los crates oficiales

## Toolchain - Xtensa vs RISC-V

| Chip | Toolchain | Por qué |
|---|---|---|
| Xtensa: [ESP32](../socs/index.md) clásico, [S2](../socs/esp32-s2.md), [S3](../socs/esp32-s3.md), [ESP8266](../migracion-esp8266.md) | Rust **fork de Espressif** ([esp-rs/rust](https://github.com/esp-rs/rust)) con LLVM fork para Xtensa | El backend Xtensa no está aún en LLVM upstream; necesita la versión patcheada de Espressif |
| RISC-V: [C2](../socs/esp32-c2.md), [C3](../socs/esp32-c3.md), [C5](../socs/esp32-c5.md), [C6](../socs/esp32-c6.md), [H2](../socs/esp32-h2.md), [P4](../socs/esp32-p4.md) | **Rust upstream estable** | RISC-V32 es un target soportado por Rust |

### Instalación con `espup`

[`espup`](https://github.com/esp-rs/espup) es el gestor oficial , instala el toolchain Xtensa, GCC para linking y herramientas auxiliares (`espflash`, `cargo-espflash`):

Después de eso, `cargo build --target xtensa-esp32s3-espidf` funciona normal.

Para chips RISC-V puro (sin Xtensa), no se necesita `espup` - basta con `rustup target add riscv32imac-unknown-none-elf`.

---

## Dos caminos principales: std vs no_std

Esta es la decisión más importante al arrancar.

### `std` con [esp-idf-svc](https://github.com/esp-rs/esp-idf-svc) (recomendado para empezar)

Rust sobre **ESP-IDF + FreeRTOS** mediante bindings.

- **Stack:** ESP-IDF runtime de fondo + Rust como capa de aplicación
- **Crates clave:** [`esp-idf-svc`](https://github.com/esp-rs/esp-idf-svc) (bindings a APIs ESP-IDF) + [`esp-idf-hal`](https://github.com/esp-rs/esp-idf-hal) (HAL para GPIO/I2C/SPI/etc desde Rust)
- **Ventajas:**
  - Acceso a todo el ecosistema ESP-IDF (WiFi, BLE, MQTT, HTTP, mDNS, NVS, OTA)
  - Funcionalidad familiar de Rust std (`std::thread`, `Mutex`, `String`, etc.) - corre sobre FreeRTOS
  - Si querés saber cómo hacer X, buscás en [docs ESP-IDF](https://docs.espressif.com/projects/esp-idf/en/latest/) el nombre de función y lo copiás-pegás en el [searchable crate doc de esp-idf-svc](https://docs.esp-rs.org/esp-idf-svc/esp_idf_svc/) - las signatures coinciden casi 1:1
- **Trade-off:** binario más grande (incluye runtime de ESP-IDF), más overhead que no_std

### `no_std` con [esp-hal](https://github.com/esp-rs/esp-hal)

Bare metal Rust, sin FreeRTOS ni ESP-IDF de por medio.

- **Stack:** Rust directo sobre el SoC
- **Crates clave:** [`esp-hal`](https://github.com/esp-rs/esp-hal) (HAL nativo Rust) + [`esp-wifi`](https://github.com/esp-rs/esp-hal/tree/main/esp-wifi) si necesitás WiFi/BLE
- **Ventajas:**
  - Binario chico, menor consumo, control total
  - Idiomático Rust (sin macros de bindgen, sin `unsafe` por todos lados)
  - Mejor experiencia de embedded Rust en general
- **Trade-off:** menos batería incluida - features avanzadas (MQTT, OTA) requieren más trabajo manual

### Cuándo elegir cada uno

| Necesidad | Elección |
|---|---|
| Conocés Rust pero no embebido y querés algo que ande rápido | **std + esp-idf-svc** |
| Necesitás WiFi + MQTT + OTA y todo el stack IoT estándar | **std + esp-idf-svc** (más fácil) |
| Querés async/await embedded, máximo control, footprint mínimo | **no_std + esp-hal + Embassy** |
| Producto que va a batería con consumo crítico | **no_std + esp-hal + Embassy** |

---

## Embassy - async runtime para no_std

[Embassy](https://github.com/embassy-rs/embassy) es un framework de Rust async para embedded. Habilita `async`/`await` sobre bare metal sin OS de por medio.

- **No es no_std/std agnostic:** Embassy es estrictamente `no_std`
- **HAL para ESP:** Embassy no mantiene HAL propio para Espressif - usa [`esp-hal`](https://github.com/esp-rs/esp-hal) que está siendo desarrollado dentro del proyecto esp-rs con integración nativa con el runtime async de Embassy
- **Provee:**
  - Async runtime (`embassy-executor`)
  - HALs async (`embassy-time`, `embassy-net`, etc.)
  - Stack de red async, USB, BLE
  - Bootloader
- **Status en ESP32:** "Embassy HAL support for Espressif chips, as well as Async Wi-Fi, Bluetooth, and ESP-NOW, is being developed" (cita textual del README de Embassy en 2025)

Caso típico: nodo IoT con WiFi async donde varios tasks (lectura de sensores, publicación MQTT, OTA check) corren concurrentemente sin un OS.

---

## Tooling

| Herramienta | Para qué |
|---|---|
| [`espup`](https://github.com/esp-rs/espup) | Instalar/actualizar toolchain Xtensa, GCC linkers |
| [`espflash`](https://github.com/esp-rs/espflash) | Flashear el chip - reemplazo de `esptool.py` |
| [`cargo-espflash`](https://github.com/esp-rs/espflash#cargo-espflash) | `cargo run` que automáticamente flashea + abre monitor serie |
| [`cargo-generate`](https://github.com/cargo-generate/cargo-generate) + [templates esp-rs](https://github.com/esp-rs/esp-template) | Generar proyecto skeleton (std o no_std) |
| [`probe-rs`](https://github.com/probe-rs/probe-rs) | Debug JTAG, alternativa más Rust-friendly a OpenOCD |

---

## Dev environment

### Setup estándar (cualquier OS)

1. `cargo install espup espflash cargo-espflash cargo-generate`
2. `espup install`
3. `. ~/export-esp.sh`
4. Generar proyecto: `cargo generate esp-rs/esp-template` (interactivo, elegís chip + std/no_std)
5. `cargo run` ya flashea + abre monitor

### Setup con Nix (sandboxed)

[`esp-rust-nix-sandbox`](https://github.com/michalrus/esp-rust-nix-sandbox) - shell Nix que aísla los binarios pre-built (compiladores Rust y GCC de Espressif) en **Bubblewrap sandbox** con acceso restringido al filesystem. Razón: los binarios pre-built de Espressif son untrusted; este setup permite usarlos sin darles permisos sobre todo el sistema.

- Soporta tanto Xtensa como RISC-V
- Mantiene Cargo, rustfmt, espflash construidos desde source (fuera del sandbox)
- Útil si querés un dev environment reproducible (Nix flake) o si te preocupa el supply chain de los blobs pre-built

---

## Notas prácticas (del wisdom acumulado en la comunidad)

> Esta sección agrega consejos de [r/rust sobre ESP32](https://www.reddit.com/r/rust/) - no son spec oficial pero son lecciones que ahorran tiempo.

- **Si ya conocés Rust, arrancá con `std` (esp-idf-svc).** El stack es más pesado pero la barrera de entrada es mínima.
- **No todo está en `esp-idf-svc`.** Para cosas básicas como encender un LED necesitás también `esp-idf-hal` en `Cargo.toml`. Ambos crates conviven en el mismo proyecto sin conflicto.
- **Windows + path largos:** generar templates en `C:\` (no en `C:\Users\<usuario>\Documents\...`). Cargo + Windows tienen el problema histórico de "long file path" que rompe builds.
- **Empezar simple:** los ejemplos del Rust on ESP Book son completos pero a veces over-engineered. Hacer blink $\rightarrow$ leer GPIO $\rightarrow$ leer I2C antes de meterse en WiFi+TLS.
- **Mapping ESP-IDF C $\leftrightarrow$ esp-idf-svc Rust:** las signatures son casi 1:1. Buscá la función que querés en [docs.espressif.com ESP-IDF](https://docs.espressif.com/projects/esp-idf/en/latest/), copiá el nombre, buscá la misma en [docs.esp-rs.org/esp-idf-svc](https://docs.esp-rs.org/esp-idf-svc/esp_idf_svc/).
- **FreeRTOS + Rust:** el runtime FreeRTOS de fondo en el modo `std` hace que `std::thread`, `Mutex`, `Arc` y compañía funcionen igual que en un Linux común. Sorprende lo bien que anda.

---

## Recursos de la comunidad

- [The Embedded Rustacean](https://www.theembeddedrustacean.com/) - blog/newsletter especializado en Rust embebido con foco fuerte en ESP32. Mantenido por Omar Hiari (su contenido es leído por ingenieros de Espressif según la propia página). Útil para complementar las docs oficiales con tutoriales paso a paso.
  - Newsletter bi-mensual con novedades del ecosistema embedded Rust
  - Libros propios: *Simplified Embedded Rust: ESP Standard Library Edition* (cubre `std` + [esp-idf-svc](https://github.com/esp-rs/esp-idf-svc)) y *ESP Core Library Edition* (cubre `no_std` + [esp-hal](https://github.com/esp-rs/esp-hal))
  - Posts cortos comparando patrones de async ([Embassy](https://github.com/embassy-rs/embassy)), drivers de sensores, integración con [probe-rs](https://github.com/probe-rs/probe-rs), etc.

---

## DevKit Rust dedicado

Hay un DevKit específicamente armado para Rust con sensores onboard: [ESP32-C3-DevKit-RUST-1](../devkits/espressif/esp32-c3-devkit-rust-1.md). Incluye [SHTC3](../../sensores/temperatura-humedad/shtc3.md) e IMU integrados - útil para no cablear nada al hacer los primeros experimentos en Rust.

Cualquier otro DevKit ([ESP32-S3-DevKitC-1](../devkits/espressif/esp32-s3-devkitc-1.md), [ESP32-C3-DevKitC-02](../devkits/espressif/esp32-c3-devkitc-02.md), etc.) sirve igual - el "RUST" en el nombre del primero es marketing, no requisito.
