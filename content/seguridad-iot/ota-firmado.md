# OTA Firmado y Anti-Rollback

> Sin firma, un atacante con acceso al broker [MQTT](../conectividad/mqtt-stack.md) (o a un endpoint HTTP de OTA en LAN) puede subir firmware arbitrario a tus nodos. Eso significa **bypass total** de toda otra defensa.

## Threat model

- Un dispositivo en LAN se compromete (cámara china, foco "smart" sin updates)
- Escanea la red, encuentra tus nodos [ESP32](../hardware/socs/index.md)
- Si exponés HTTP OTA simple: descarga firmware malicioso a cada nodo
- Si no firmás: el [ESP32](../hardware/socs/index.md) acepta cualquier binario válido (válido = pasa CRC), corre con permisos completos

Costo de defensa: **bajo**. [ESP-IDF](../hardware/frameworks/esp-idf.md) tiene soporte nativo. Vale la pena habilitarlo desde el día 0.

---

## Cómo funciona en ESP-IDF

[ESP-IDF](../hardware/frameworks/esp-idf.md) expone **Secure Boot V2** + **Flash Encryption** + **OTA Verification**:

> En el ESP32 clásico (ECO V3) Secure Boot V2 soporta solo **RSA-3072** ([doc oficial](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/security/secure-boot-v2.html)). ECDSA P-256 es opción válida en algunos chips modernos (S2, S3, C-series). Elegir según el target de tu build.

```
1. Vos generás un par RSA-3072 (o ECDSA P-256 en chips modernos)
 - private.pem → queda en tu PC, NUNCA en el firmware
 - public.pem → su SHA-256 digest se quema al eFuse del ESP32 (one-time programmable)

2. Cuando compilás un firmware:
 - El binario se firma con private.pem
 - La firma queda al final del .bin

3. Cuando el ESP32 recibe un OTA update:
 - Calcula el hash del binario
 - Verifica la firma contra la public key del efuse
 - Si la verificación falla → rechaza el update
 - Si pasa → escribe a la partición OTA pasiva, reinicia, valida, hace switch
```

## Setup paso a paso

### 1. Generar las llaves

```bash
# Generar private key
espsecure.py generate_signing_key --version 2 secure_boot_signing_key.pem

# Extraer public key
espsecure.py extract_public_key --keyfile secure_boot_signing_key.pem \
 --version 2 public_key.bin
```

**Guardar `secure_boot_signing_key.pem` en un password manager o hardware key.** Si lo perdés, no podés volver a publicar OTA. Si te lo roban, pueden firmar firmware malicioso $\rightarrow$ revocación es difícil.

### 2. Configurar el firmware

```
idf.py menuconfig
```

Activar:

- `Security features $\rightarrow$ Enable hardware Secure Boot in bootloader`
- `Security features $\rightarrow$ Secure Boot version V2` (esquema RSA-3072 por default en ESP32 clásico ECO V3; en S2/S3/C-series podés elegir RSA-3072 o ECDSA-P256)
- `Security features $\rightarrow$ Sign the binary during build`
- `Partition Table $\rightarrow$ Custom partition table CSV: partitions_two_ota.csv`
- `Bootloader config $\rightarrow$ Enable app rollback support / anti-rollback` (`CONFIG_BOOTLOADER_APP_ANTI_ROLLBACK`)

Particiones (`partitions_two_ota.csv`):

```csv
# Name, Type, SubType, Offset, Size, Flags
nvs, data, nvs, 0x9000, 0x6000,
phy_init, data, phy, 0xf000, 0x1000,
factory, app, factory, 0x10000, 1M,
ota_0, app, ota_0, 1M,
ota_1, app, ota_1, 1M,
otadata, data, ota, 0x2000,
```

### 3. Burnear la public key al efuse

```bash
espefuse.py burn_key BLOCK_KEY0 public_key.bin SECURE_BOOT_DIGEST0
```

> **Esto es one-time.** Una vez burnado, ese [ESP32](../hardware/socs/index.md) sólo acepta firmware firmado con `secure_boot_signing_key.pem`. No hay vuelta atrás. **Probar en un solo chip primero**, no en los 3 S3 a la vez.

### 4. Build y flash

```bash
idf.py build
idf.py flash
```

El bootloader ahora verifica firma en cada boot y en cada OTA.

---

## Servidor de OTA

### Opción A: HTTP simple en LAN

Servir el binario desde un endpoint HTTP en el servidor donde corre [Mosquitto](../conectividad/mqtt-stack.md):

```python
# Flask mínimo
from flask import Flask, send_file
app = Flask(__name__)

@app.route('/firmware/<node_id>/latest.bin')
def firmware(node_id):
 return send_file(f'/var/firmware/{node_id}/latest.bin')
```

El [ESP32](../hardware/socs/index.md) hace:

```c
esp_http_client_config_t config = {
 .url = "https://server.local/firmware/zone-A/latest.bin",
 .cert_pem = ca_cert,
};
esp_https_ota_handle_t handle;
esp_https_ota_begin(&config, &handle);
// ESP-IDF verifica la firma automáticamente antes de hacer commit
```

Aunque el endpoint HTTP esté "abierto" en LAN, la firma RSA del binario garantiza que sólo firmware tuyo se ejecuta.

### Opción B: OTA por MQTT

Publicar a un topic `greenhouse/+/ota/notify` con metadata + URL:

```json
{
 "version": "0.4.0",
 "url": "https://server.local/firmware/zone-A/v0.4.0.bin",
 "sha256": "abc123...",
 "min_required": "0.3.0"
}
```

El nodo verifica:
1. Versión > la actual (anti-rollback básico)
2. `min_required` cumplido
3. Descarga el binario
4. Verifica SHA-256
5. esp_https_ota verifica firma RSA
6. Aplica

---

## Anti-rollback

Activar `CONFIG_BOOTLOADER_APP_ANTI_ROLLBACK` en menuconfig.

Cada firmware tiene una `secure_version` en el header. El bootloader **rechaza versiones más viejas que la última aceptada**, incluso si están bien firmadas.

Esto evita ataques donde:
1. Vos publicás v0.4.0 que arregla una vulnerabilidad
2. Un atacante intercepta y reenvía v0.3.0 (que sigue siendo "firmware tuyo válido")
3. El nodo "downgrade-a", la vulnerabilidad vuelve a ser explotable

Con anti-rollback, v0.3.0 firmado o no, se rechaza.

```c
// En sdkconfig.defaults:
CONFIG_BOOTLOADER_APP_ANTI_ROLLBACK=y
CONFIG_BOOTLOADER_APP_SECURE_VERSION=1

// Subir el número cada release con cambios de seguridad
```

---

## Recomendaciones por fase del proyecto

| Fase | Setup típico |
|---|---|
| Prototipado | OTA HTTPS sin firma, sólo en LAN; broker con TLS+auth ya cubre lo importante |
| Pre-deployment | Generar keypair, burnear public key a 1 chip de prueba, validar el flujo OTA firmado |
| Producción | Activar [Secure Boot V2](ota-firmado.md) + anti-rollback en todos los nodos |
| Si publicás el código (open source) | Documentar el modelo de seguridad y **nunca** compartir las private keys |

---

## Trampas frecuentes

| Problema | Causa | Fix |
|---|---|---|
| Boot loop después de habilitar Secure Boot | Particiones mal alineadas | Usar `partitions_two_ota.csv` recomendado, no inventar |
| OTA falla con "signature verification failed" | Firmware no firmado o firmado con otra key | `idf.py build` debe usar la misma key burnada al efuse |
| esptool.py erase_flash no funciona después de Secure Boot | Boot ROM lo permite, pero el bootloader no | Hay un fuse específico (`DISABLE_DL_ENCRYPT`) para esto, leer doc oficial antes de quemar |
| Anti-rollback bloquea downgrade durante debug | secure_version mal puesta | Setear `secure_version=1` en builds de debug, no incrementar hasta producción |
| Perdés la private key | No tiene fix | **NUNCA llegar a este punto.** Backup en 2 ubicaciones físicas separadas + password manager. |
