# Secrets en el Firmware

## Lo que NO hacer

- Hardcodear WiFi password, MQTT password, u OTA keys en el código
- Las creds hardcodeadas quedan en el `.bin` final, cualquiera que extraiga el firmware vía `esptool` puede leerlos en plano
- Rotar credenciales con creds hardcodeadas requiere reflashear cada nodo individualmente

## Opciones, de menos a más segura

### Opción 1 - Header local fuera de git (mínimo aceptable para prototipado)

`secrets.h` en `.gitignore` + `secrets.h.example` commiteado como plantilla.

**Cubre:** evitar commit accidental.
**No cubre:** las creds siguen quedando en el `.bin` final extraíble por esptool.

### Opción 2 - NVS (Non-Volatile Storage) en flash

[ESP-IDF](../hardware-esp32/frameworks/esp-idf.md) expone NVS — una partición clave-valor en flash, independiente del firmware. Las credenciales viven ahí, se programan una sola vez por nodo vía `esptool.py` o por consola serial al primer boot.

**Cubre:** firmware en git es 100% público-safe. Cada nodo lleva sus propias creds.
**No cubre:** NVS plano se puede extraer con esptool si alguien tiene acceso físico al nodo.

Documentación oficial: [ESP-IDF NVS](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/api-reference/storage/nvs_flash.html)

### Opción 3 - NVS Encryption

NVS con encryption encripta toda la partición usando una clave **XTS-AES** almacenada en eFuse del chip — eFuse es one-time programmable, no se puede leer desde software después del flash.

ESP-IDF soporta dos esquemas:

- **Flash-Encryption-based** (válido en ESP32 clásico y S2/S3): la clave NVS vive en una partición `nvs_keys` cifrada vía Flash Encryption.
- **HMAC-based** (recomendado desde S3 en adelante): la clave NVS se deriva en runtime de una HMAC key en eFuse y no requiere habilitar Flash Encryption completo.

El resultado final en ambos casos: credenciales cifradas en reposo. Acceso físico al nodo + extracción de flash → solo texto cifrado sin la clave (que está en eFuse, no extraíble por software).

**Cubre:** acceso físico al nodo.
**No cubre:** ataques de fault injection sobre eFuse (ver [Fatal Fury](fatal-fury-esp32.md) en ESP32 clásico pre-ECO V3).

Documentación oficial: [ESP-IDF NVS Encryption](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/api-reference/storage/nvs_encryption.html)

### Opción 4 - WiFi Provisioning + SoftAP / BLE

El nodo arranca en modo AP, expone una API, y el usuario provisiona credenciales desde el celular — las creds nunca están en el firmware.

- **[ESP-IDF Provisioning component](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/api-reference/provisioning/wifi_provisioning.html)** (oficial) — vía HTTP o BLE, protocomm encriptado
- **SmartConfig** — antiguo, broadcast WiFi en plano. **No usar.**

Las creds entran encriptadas vía protocomm. Quedan en NVS (idealmente encrypted) después.

**Cubre:** rotación de credenciales sin reflashear.

## Opciones por fase

| Fase | Opción típica |
|---|---|
| Prototipado (1-3 nodos en escritorio) | Opción 1 (`secrets.h` en `.gitignore`) |
| Deployment inicial | Opción 2 (NVS plano, programado al flashear) |
| Producción seria / paper | **Opción 3 (NVS encrypted)** |
| Nodos entregados a colaboradores que no programan | **Opción 4 (Provisioning)** |

## Rotación de credenciales

Si las creds se filtran (commit accidental, `.bin` compartido, etc.):

1. Cambiar la WiFi password del router → todos los nodos se desconectan
2. Reprogramar NVS de cada nodo con las nuevas creds
3. Cambiar la MQTT password de cada nodo en Mosquitto
4. Si era OTA key, reflashear con nueva key + revocar la vieja en la lógica de OTA

Tener un script para reprogramar NVS de cada nodo facilita rotaciones — sin script, cada rotación requiere ir físicamente a cada nodo del invernadero.

