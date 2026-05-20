# Seguridad IoT


## Cosas que hay que proteger


- **Credenciales WiFi** que dan acceso a la LAN
- **Credenciales MQTT** que dan control sobre los actuadores (bombas, válvulas, lámparas)
- **Firmware [OTA](ota-firmado.md)** que, si no está firmado, puede ser sobreescrito por cualquiera en la LAN


## Que hacer para mitigar amenazas

1. **Cero secrets en el código fuente.** WiFi password, MQTT password, [OTA](ota-firmado.md) keys $\rightarrow$ [NVS](secrets-en-firmware.md) 
2. **MQTT con TLS (puerto 8883)** y **autenticación obligatoria**. Nunca puerto 1883 plano. Nunca `allow_anonymous true`.
3. **[OTA](ota-firmado.md) firmado.** Sin firma, cualquier nodo comprometido puede sobreescribir el firmware de los demás.
4. **Validar todo input recibido por MQTT** en los nodos actuadores. Que un comando llegue por el broker no significa que sea seguro ejecutarlo. Cosas a validar pueden ser rango de valores posibles, formato esperado, y rechazar lo que no pase la validacion (y emitir un warning).
5. **No abrir puertos del broker al WAN.** Acceso remoto solo vía VPN.

