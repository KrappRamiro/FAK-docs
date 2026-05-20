# OTA Firmado y Anti-Rollback

> Sin firma, un atacante con acceso al broker MQTT (o a un endpoint HTTP de OTA en LAN) puede subir firmware arbitrario a tus nodos. Eso significa **bypass total** de toda otra defensa.

## Threat model

- Un dispositivo en LAN se compromete (cámara china, foco "smart" sin updates)
- Escanea la red, encuentra tus nodos [ESP32](../hardware-esp32/socs/index.md)
- Si exponés HTTP OTA simple: descarga firmware malicioso a cada nodo
- Si no firmás: el ESP32 acepta cualquier binario válido, corre con permisos completos

Costo de defensa: **bajo**. [ESP-IDF](../hardware-esp32/frameworks/esp-idf.md) tiene soporte nativo. Vale la pena habilitarlo desde el día 0.

## Lo que hay que lograr

### Secure Boot V2 + firma de firmware

El resultado es que el bootloader del ESP32 verifique la firma RSA del binario en cada boot y en cada OTA. Un binario sin firmar — o firmado con otra key — se rechaza y el nodo no bootea.

Requiere:
- Un keypair RSA-3072 (o ECDSA P-256 en chips S2/S3/C-series). **La private key nunca sale de tu máquina — si la perdés, no podés volver a publicar OTA.**
- La public key burnada al eFuse del chip — **operación one-time, sin vuelta atrás**. Probar en un solo chip antes de hacerlo en todos.
- `Secure Boot V2` y `Sign the binary during build` activados en `idf.py menuconfig`
- Tabla de particiones con dos particiones OTA (`ota_0` y `ota_1`) para poder hacer rollback

En ESP32 clásico (ECO V3): solo RSA-3072. En S2, S3, C-series: RSA-3072 o ECDSA P-256.

Documentación: [ESP-IDF Secure Boot V2](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/security/secure-boot-v2.html)

### Anti-rollback

`CONFIG_BOOTLOADER_APP_ANTI_ROLLBACK` en menuconfig. Cada firmware lleva un `secure_version` en el header. El bootloader rechaza versiones más viejas que la última aceptada, aunque estén bien firmadas.

Evita que un atacante que interceptó un binario viejo (con una vulnerabilidad ya corregida) pueda hacer downgrade del nodo.

### Servidor de OTA

Dos opciones:

**HTTP en LAN** — un endpoint HTTP simple en el mismo servidor donde corre Mosquitto sirve el binario. El ESP32 descarga y verifica la firma. Aunque el endpoint esté "abierto" en LAN, la firma RSA garantiza que solo firmware tuyo se ejecuta.

**Por MQTT** — publicar a un topic `greenhouse/+/ota/notify` con metadata (versión, URL, SHA-256). El nodo descarga el binario, verifica SHA-256, y `esp_https_ota` verifica la firma RSA antes de aplicar.

Documentación: [ESP-IDF OTA Updates](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/api-reference/system/ota.html)

## Fase por fase

| Fase | Setup típico |
|---|---|
| Prototipado | OTA HTTPS sin firma, solo en LAN; broker con TLS+auth ya cubre lo importante |
| Pre-deployment | Generar keypair, burnear public key a 1 chip de prueba, validar el flujo OTA firmado |
| Producción | Secure Boot V2 + anti-rollback en todos los nodos |
| Si publicás el código (open source) | Documentar el modelo de seguridad y **nunca** compartir las private keys |

## Trampas frecuentes

| Problema | Causa | Fix |
|---|---|---|
| Boot loop después de habilitar Secure Boot | Particiones mal alineadas | Usar la tabla de particiones con dos OTA que recomienda la doc oficial, no inventar |
| OTA falla con "signature verification failed" | Firmware no firmado o firmado con otra key | El build tiene que usar la misma key burnada al eFuse |
| esptool.py erase_flash no funciona después de Secure Boot | El bootloader lo bloquea | Hay un fuse específico para esto — leer doc oficial antes de quemar |
| Anti-rollback bloquea downgrade durante debug | `secure_version` mal puesta | Setear `secure_version=1` en builds de debug, no incrementar hasta producción |
| Perdés la private key | No tiene fix | **NUNCA llegar a este punto.** Backup en 2 ubicaciones físicas + password manager. |
