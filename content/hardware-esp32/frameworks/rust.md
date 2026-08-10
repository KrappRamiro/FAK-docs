---
title: "Rust en ESP32"
description: "Guía de Rust para ESP32: toolchain Xtensa vs RISC-V, std con esp-idf-svc"
tags:
  - hardware-esp32
  - framework
  - rust
---

# Rust en ESP32

## Toolchain - Xtensa vs RISC-V

| Chip | Toolchain | Por qué |
|---|---|---|
| Xtensa: [ESP32](../socs/index.md) clásico, [S2](../socs/esp32-s2.md), [S3](../socs/esp32-s3.md), [ESP8266](../migracion-esp8266.md) | Rust **fork de Espressif** ([esp-rs/rust](https://github.com/esp-rs/rust)) con LLVM fork para Xtensa | El backend Xtensa no está aún en LLVM upstream; necesita la versión patcheada de Espressif |
| RISC-V: [C2](../socs/esp32-c2.md), [C3](../socs/esp32-c3.md), [C5](../socs/esp32-c5.md), [C6](../socs/esp32-c6.md), [H2](../socs/esp32-h2.md), [P4](../socs/esp32-p4.md) | **Rust upstream estable** | RISC-V32 es un target soportado por Rust |


## Dos caminos principales: std vs no_std

Tenes dos opciones, o usas Rust `std` (con cosas como Vector, Mutex, etc...) que involucra usar FreeRTOS, o usas `no_std`.

### `std` con [esp-idf-svc](https://github.com/esp-rs/esp-idf-svc) (recomendado para empezar)

Rust sobre **ESP-IDF + FreeRTOS**.

- **Stack:** ESP-IDF runtime de fondo + Rust como capa de aplicación
- **Crates clave:** [`esp-idf-svc`](https://github.com/esp-rs/esp-idf-svc) (bindings a APIs ESP-IDF) + [`esp-idf-hal`](https://github.com/esp-rs/esp-idf-hal) (HAL para GPIO/I2C/SPI/etc desde Rust)
- **Ventajas:**
  - Acceso a todo el ecosistema ESP-IDF (WiFi, BLE, MQTT, HTTP, mDNS, NVS, OTA)
  - Funcionalidad familiar de Rust std (`std::thread`, `Mutex`, `String`, etc.) porque corre sobre FreeRTOS
  - Si en la doc de ESP-IDF ves `nvs_flash_init()`, `esp_wifi_init()` o `gpio_set_level()`, en esp-idf-sys existen literalmente con el mismo nombre (ej. `esp_idf_sys::nvs_flash_init()`).
- **Trade-off:** binario más grande (incluye runtime de ESP-IDF), más overhead que no_std

### `no_std` con [esp-hal](https://github.com/esp-rs/esp-hal)

Bare metal Rust, sin FreeRTOS ni ESP-IDF de por medio.

- **Stack:** Rust directo sobre el SoC
- **Crates clave:** [`esp-hal`](https://github.com/esp-rs/esp-hal) (HAL nativo Rust)
- **Ventajas:**
  - Binario chico, menor consumo, control total
  - Idiomático Rust (sin macros de bindgen, sin `unsafe` por todos lados)
  - Mejor experiencia de embedded Rust en general
- **Trade-off:** features avanzadas (MQTT, OTA) requieren más trabajo manual

### Embassy - async runtime para no_std

[Embassy](https://github.com/embassy-rs/embassy) es un framework de Rust async para embedded. Habilita `async`/`await` sobre bare metal sin OS de por medio.

- **Embassy es `no_std`
- usa [`esp-hal`](https://github.com/esp-rs/esp-hal) que está siendo desarrollado dentro del proyecto esp-rs con integración nativa con el runtime async de Embassy
- **Provee:**
  - Async runtime (`embassy-executor`)
  - HALs async (`embassy-time`, `embassy-net`, etc.)
  - Stack de red async, USB, BLE
  - Bootloader

---

## Tooling

| Herramienta | Para qué |
|---|---|
| [`espup`](https://github.com/esp-rs/espup) | Instalar/actualizar toolchain Xtensa, GCC linkers |
| [`espflash`](https://github.com/esp-rs/espflash/blob/main/espflash/README.md) | Interactuar con el chip, funciona como reemplazo de `esptool.py` |
| [`probe-rs`](https://github.com/probe-rs/probe-rs) | Debug JTAG, alternativa más Rust-friendly a OpenOCD |

---

## Project creation

### System requirement (NixOS only)

The Xtensa Rust compiler downloaded by `espup` is a pre-built dynamically linked
binary. On NixOS it requires `nix-ld` to run. Add this to your NixOS
configuration (`/etc/nixos/configuration.nix` or equivalent) and rebuild:

```nix
programs.nix-ld = {
  enable = true;
  libraries = with pkgs; [
    stdenv.cc.cc  # libstdc++, libgcc_s
    zlib
  ];
};
```

### Setup the directory and needed files

```bash
mkdir your_project
cd your_project
```

### Create the devenv setup

Create a `devenv.nix` file with this content

```nix
{
  pkgs,
  inputs,
  ...
}:
let
  # We cant  use pkgs.rust-analyzer !
  # pkgs.rust-analyzer tracks nixpkgs-unstable and updates daily, so it drifts ahead of the esp toolchain's cargo.
  # When they're out of sync, rust-analyzer's `cargo metadata` calls fails , so esp-idf-hal get no completions.
  # We solve that by pinning rust-analyzer to the same nightly date as the esp toolchain's cargo instead
  # (check the date with `cargo --version --verbose`).
  espRustAnalyzer =
    (inputs.fenix.packages.${pkgs.stdenv.hostPlatform.system}.toolchainOf {
      channel = "nightly";
      date = "2026-03-21";
      sha256 = "sha256-rboGKQLH4eDuiY01SINOqmXUFUNr9F4awoFZGzib17o=";
    }).rust-analyzer;
in
{
  packages = [
    pkgs.rustup           # base Rust install required by espup
    pkgs.espup            # installs the Xtensa Rust toolchain on top of rustup
    pkgs.espflash         # flashing over USB serial
    pkgs.ldproxy          # linker proxy required by esp-idf-sys
    pkgs.cargo-generate   # cargo generate esp-rs/esp-idf-template
    pkgs.cargo-espmonitor # serial monitor
    pkgs.python3          # required by ESP-IDF build scripts
    pkgs.cmake
    pkgs.ninja
    pkgs.git
    pkgs.pkg-config
    # esp-idf prerequisites (see esp-rs/esp-idf-template#prerequisites)
    pkgs.flex
    pkgs.bison
    pkgs.gperf
    pkgs.ccache
    pkgs.libffi
    pkgs.openssl
    pkgs.libusb1
    # libstdc++ :
    # the Espressif bundled libclang.so dlopen loads this at build time
    # nix-ld only covers executable loading, not dlopen, so we need it
    # on LD_LIBRARY_PATH explicitly (set in enterShell below).
    pkgs.stdenv.cc.cc.lib
    # the esp toolchain doesn't ship rust-analyzer.
    espRustAnalyzer
  ];

  enterShell = ''
    export RUSTUP_HOME="$HOME/.rustup-esp"
    export CARGO_HOME="$HOME/.cargo-esp"
    export IDF_TOOLS_PATH="$HOME/.espressif"

    if [ -f "$HOME/export-esp.sh" ]; then
      source "$HOME/export-esp.sh"
    else
      echo ""
      echo "  First-time setup:"
      echo "    rustup toolchain install stable  # base toolchain required by espup"
      echo "    espup install                    # generates ~/export-esp.sh and installs the Xtensa toolchain"
      echo ""
    fi

    # Prepend the real rust-analyzer store path (not the rustup shim) so it
    # wins over the pkgs.rustup shim, which loops infinitely on the esp toolchain.
    export PATH="${espRustAnalyzer}/bin:$PATH:$CARGO_HOME/bin"

    # The Espressif bundled libclang.so dynamically links libstdc++.so.6.
    # nix-ld handles executable loading but not dlopen, so we expose libstdc++
    # explicitly for bindgen to find at cargo build time.
    export LD_LIBRARY_PATH="${pkgs.stdenv.cc.cc.lib}/lib:$LD_LIBRARY_PATH"
  '';

  # See full reference at https://devenv.sh/reference/options/
}
```

Then create a `devenv.yaml` file with this content:

```yaml
# yaml-language-server: $schema=https://devenv.sh/devenv.schema.json
inputs:
  nixpkgs:
    url: github:cachix/devenv-nixpkgs/rolling
    # Rust toolchains and rust-analyzer nightly for Nix
  fenix:
    url: github:nix-community/fenix
    inputs:
      nixpkgs:
        follows: nixpkgs
# If you're using non-OSS software, you can set allow_unfree to true.
# allow_unfree: true

# If you're not willing to allow unsupported packages:
# allow_unsupported_system: false

# If you're willing to use a package that's vulnerable
# permitted_insecure_packages:
#  - "openssl-1.1.1w"

# If you have more than one devenv you can merge them
#imports:
# - ./backend

```

Then create a `.envrc` file:

```bash
#!/usr/bin/env bash
# this is the file .envrc , it runs when you enter the folder with cd
eval "$(devenv direnvrc)"
use devenv
```

Then Allow it:

```bash
direnv allow
```

Then add `.devenv` and `.direnv` to `.gitignore`:

```bash
echo ".direnv" >> .gitignore
echo ".devenv" >> .gitignore
```

### Setup the project with espup


`espup` requires a base Rust toolchain before it can layer the Xtensa compiler
on top. It also generates `~/export-esp.sh`, which the devenv shell sources
automatically on every subsequent entry.

```bash
devenv shell
rustup toolchain install stable   # base toolchain required by espup
espup install                     # installs Xtensa toolchain, generates ~/export-esp.sh
```

After this, `devenv shell` will source `~/export-esp.sh` automatically.

### Scaffold the project with cargo generate using the esp-idf-template


```
cargo generate --init esp-rs/esp-idf-template
```

The `--init` flag generates into the current directory instead of creating a new subdirectory. Run this from the repo root alongside `devenv.nix`.

The template will ask several questions. These are the answers used for this project:


| Prompt | Answer |
|--------|--------|
| Which template should be expanded? | `cargo` |
| Project Name | `your_project_name_here` |
| Which MCU to target? | `esp32` |
| Configure advanced template options? | `true` |
| ESP-IDF version | `v5.5.3` |
| Use latest GIT versions of the esp-idf-* crates? | `false` |
| Installation location of managed ESP-IDF | `workspace` |
| Configure project to use Dev Containers? | `false` |
| Configure project to support Wokwi simulation? | `false` |
| Add CI files for GitHub Action? | `true` |

The generated `.cargo/config.toml` sets the Xtensa target, `ldproxy` as linker, and `espflash` as runner. The `rust-toolchain.toml` pins the toolchain to `channel = "esp"` (the Espressif Rust fork).


### Build and flash

```bash
cargo build
espflash flash --monitor target/xtensa-esp32-espidf/debug/<bin>
```

Reemplaza `<bin>` por el valor que tenga `name` en `Cargo.toml`

```toml
[package]
name = "YOUR_BIN_NAME_SHOULD_BE_HERE"
```
---

## Troubleshooting

### `Failed to open serial port /dev/ttyUSB0`

Your user needs to be in the `dialout` group.

To confirm this is the actual cause (vs. the port being busy or missing):

```bash
# Check who owns the device and what groups you have active in this session
stat /dev/ttyUSB0
groups

# Try opening it directly — "EACCES Permission denied" confirms a group issue
python3 -c "
import os, errno
try:
    fd = os.open('/dev/ttyUSB0', os.O_RDWR | os.O_NOCTTY | os.O_NONBLOCK)
    print('opened ok'); os.close(fd)
except OSError as e:
    print('OSError:', errno.errorcode.get(e.errno, e.errno), e.strerror)
"

# Check full group database vs. active session groups
id $USER   # shows groups from the database (what it should be)
groups     # shows groups active in the current session (what it is right now)
```

Add `dialout` to your NixOS config and rebuild:

```nix
users.users.<youruser>.extraGroups = [ "dialout" ];
```


A full graphical session logout is required after rebuilding, opening a new terminal is not enough. To avoid logging out, activate the group in the current terminal with:

```bash
newgrp dialout
```

If the error is unclear, run espflash with verbose logging for more detail:

```bash
RUST_LOG=debug espflash flash --monitor target/xtensa-esp32-espidf/debug/<bin>
```

## Recursos útiles

- [The Embedded Rustacean](https://www.theembeddedrustacean.com/) blog/newsletter especializado en Rust embebido
  - Libros:
    - Simplified Embedded Rust: ESP Standard Library Edition: cubre `std` + [esp-idf-svc](https://github.com/esp-rs/esp-idf-svc) 
    - ESP Core Library Edition: cubre `no_std` + [esp-hal](https://github.com/esp-rs/esp-hal)
- [probe-rs](https://github.com/probe-rs/probe-rs) : embedded debugging and target interaction toolkit

