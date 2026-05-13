# Secrets en el Firmware

> Regla: **cero credenciales en el código fuente que va a git.**

## Lo que NO hacer

```c
// NUNCA HACER ESTO
#define WIFI_SSID "MyHomeWifi"
#define WIFI_PASSWORD "VerySecret123"
#define MQTT_URI "mqtts://192.168.1.10:8883"
#define MQTT_USER "greenhouse_node"
#define MQTT_PASSWORD "another_secret"
```

Problemas:
- Quedan en el `.bin` final $\rightarrow$ cualquiera que extraiga el firmware vía esptool puede leerlos en plano
- Si commiteás a git, quedan en el historial **para siempre**, incluso después de "borrarlos"
- Rotar credenciales requiere reflashear cada nodo individualmente

## Opciones, de menos a más segura

### Opción 1 - Header local fuera de git (mínimo aceptable para hobby)

`secrets.h` (en `.gitignore`):

```c
#pragma once
#define WIFI_SSID "MyHomeWifi"
#define WIFI_PASSWORD "VerySecret123"
#define MQTT_PASSWORD "another_secret"
```

`secrets.h.example` (commiteado):

```c
#pragma once
#define WIFI_SSID "your_ssid_here"
#define WIFI_PASSWORD "your_password_here"
#define MQTT_PASSWORD "your_mqtt_password"
```

`.gitignore`:
```
secrets.h
```

**Cubre:** evitar commit accidental.
**No cubre:** las creds siguen quedando en el `.bin` final extraíble por esptool.

### Opción 2 - NVS (Non-Volatile Storage) en flash

[ESP-IDF](../hardware/frameworks/esp-idf.md) expone NVS - una partición clave-valor en flash, independiente del firmware. Las credenciales viven ahí, **se programan una sola vez por nodo**.

```c
#include "nvs_flash.h"
#include "nvs.h"

esp_err_t load_wifi_creds(char *ssid, size_t ssid_len,
 char *pass, size_t pass_len) {
 nvs_handle_t h;
 esp_err_t err = nvs_open("wifi", NVS_READONLY, &h);
 if (err != ESP_OK) return err;

 err = nvs_get_str(h, "ssid", ssid, &ssid_len);
 if (err == ESP_OK) {
 err = nvs_get_str(h, "pass", pass, &pass_len);
 }
 nvs_close(h);
 return err;
}
```

Programar las creds una vez via `esptool.py write_flash` con un binario NVS pregenerado, o via comando interactivo desde la consola serial al primer boot.

**Cubre:** firmware en git es 100% público-safe. Cada nodo lleva sus propias creds.
**No cubre:** NVS plano se puede extraer con esptool si alguien tiene acceso físico al nodo.

### Opción 3 - NVS Encryption

NVS con encryption activado encripta toda la partición usando una clave **XTS-AES** almacenada en eFuse del chip - eFuse es one-time programmable, no se puede leer desde software después del flash. Ver [doc oficial](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/api-reference/storage/nvs_encryption.html).

ESP-IDF soporta dos esquemas de protección de la clave NVS:

- **Flash-Encryption-based** (esquema original, válido en ESP32 clásico y S2/S3): la clave NVS vive en una partición `nvs_keys` cifrada vía Flash Encryption.
- **HMAC-based** (recomendado a partir de S3): la clave NVS se deriva en runtime de una HMAC key en eFuse y no requiere habilitar Flash Encryption completo.

Setup del esquema clásico (Flash-Encryption-based):

1. Activar NVS encryption en `idf.py menuconfig`:
 ```
 Component config → NVS → Enable NVS encryption support
 Security features → Enable flash encryption on boot
 ```
2. Generar clave de Flash Encryption:
 ```
 espsecure.py generate_flash_encryption_key nvs_key.bin
 ```
3. Quemar al eFuse (purpose `XTS_AES_128_KEY` válido en S2/S3; en el ESP32 clásico la clave se quema en `BLOCK1` con `flash_encryption` como purpose):
 ```
 espefuse.py burn_key BLOCK_KEY0 nvs_key.bin XTS_AES_128_KEY
 ```
4. Flash Encryption se habilita automáticamente en el primer boot vía `FLASH_CRYPT_CNT` (no es necesario quemar el eFuse a mano si configuraste menuconfig correctamente).

Setup del esquema HMAC (solo S3 y posteriores):

```bash
idf.py -p PORT efuse-burn-key BLOCK_KEY0 hmac_key.bin HMAC_UP
```

En menuconfig: `Component config $\rightarrow$ NVS Security Provider $\rightarrow$ NVS Encryption: Using HMAC peripheral`. No requiere habilitar Flash Encryption.

Con cualquiera de los dos, las credenciales en NVS están **cifradas en reposo**. Acceso físico al nodo + extracción de flash $\rightarrow$ solo se obtiene texto cifrado sin la clave (que está en eFuse, no extraíble por software).

**Cubre:** acceso físico al nodo.
**No cubre:** ataques de fault injection sobre eFuse (ver [Fatal Fury](fatal-fury-esp32.md) en ESP32 clásico pre-ECO V3; en chips modernos requiere hardware especializado, ver [AR2023-005](https://www.espressif.com/sites/default/files/advisory_downloads/AR2023-005%20Security%20Advisory%20Concerning%20Bypassing%20Secure%20Boot%20and%20Flash%20Encryption%20Using%20EMFI%20EN.pdf)).

### Opción 4 - WiFi Provisioning + SmartConfig / SoftAP

En vez de "programar las creds antes del deploy", el nodo arranca en modo AP, expone una API HTTP o BLE, y el usuario provisiona desde el celular.

- **[ESP-IDF](../hardware/frameworks/esp-idf.md) Provisioning component** (oficial)
- **ESP BLE Provisioning** - flujo BLE en vez de HTTP
- **SmartConfig** - antiguo, broadcast WiFi en plano (no usar)

```c
wifi_prov_mgr_init(...);
wifi_prov_mgr_start_provisioning(...);
```

Las creds entran encriptadas vía protocomm. Quedan en NVS (idealmente encrypted) después.

**Cubre:** rotación de credenciales sin reflashear.
**No cubre:** el flujo de provisioning en sí, requiere que la red provisional sea segura.

## Recomendaciones por fase del proyecto

| Fase | Opción típica |
|---|---|
| Prototipado (1-3 nodos en escritorio) | Opción 1 (`secrets.h` en `.gitignore`) |
| Deployment inicial | Opción 2 (NVS plano, programado al flashear) |
| Producción seria / paper | **Opción 3 (NVS encrypted)** |
| Nodos entregados a colaboradores que no programan | **Opción 4 (Provisioning)** |

## Rotación de credenciales

Si por alguna razón las creds se filtran (commit accidental, compartiste el `.bin` con alguien, etc.):

1. Cambiar la WiFi password del router $\rightarrow$ todos los nodos se desconectan
2. Reprogramar NVS de cada nodo con las nuevas creds
3. Cambiar la [MQTT](../conectividad/mqtt-stack.md) password de cada nodo en [Mosquitto](../conectividad/mqtt-stack.md) (`mosquitto_passwd`)
4. Si era [OTA](ota-firmado.md) key, reflashear con nueva key + revocar la vieja en la lógica de [OTA](ota-firmado.md)

**Tener un script para reprogramar NVS de cada nodo facilita rotaciones.** Sin script, cada rotación requiere ir físicamente a cada nodo del invernadero - desincentivo brutal.

## Logging - qué no logguear

```c
// MAL
ESP_LOGI(TAG, "Connecting to MQTT with password=%s", mqtt_password);

// BIEN
ESP_LOGI(TAG, "Connecting to MQTT broker: %s", mqtt_uri);
```

Los logs pueden ir a:
- Monitor serial (sólo durante debug local)
- Archivo en LittleFS (rotativo, puede llenarse y filtrarse en un dump)
- Servidor de logs remoto (logging-as-service)

**Nunca incluir credenciales, tokens, ni datos personales en logs.**
