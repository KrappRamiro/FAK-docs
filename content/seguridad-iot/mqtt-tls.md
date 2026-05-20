# MQTT con TLS y Autenticación

> El default de la mayoría de tutoriales (`allow_anonymous true`, puerto 1883 sin TLS) deja tu broker **completamente abierto en LAN**. Cualquier dispositivo en la red puede leer todos los topics y mandar comandos a tus actuadores.

## Lo que NO tener

- Puerto 1883 plano sin TLS
- `allow_anonymous true` — cualquier dispositivo en LAN puede subscribirse a `#` y ver todas las lecturas, o publicar a topics de actuadores
- Un solo usuario "admin" para todos los clientes — si se compromete uno, comprometés todo
- Puerto 1883 expuesto al WAN por una mala config del router — Shodan lo indexa en horas

## Lo que tenés que lograr

### TLS en puerto 8883

El broker tiene que escuchar **solo en 8883 con TLS**, nunca en 1883 plano. Requiere:
- Un certificado de CA (autofirmado alcanza para LAN)
- Certificado de servidor firmado por esa CA
- Cada cliente (ESP32, Telegraf, Grafana) valida el certificado del servidor con la `ca.crt`

Documentación: [Mosquitto TLS](https://mosquitto.org/man/mosquitto-tls-7.html), [ESP-IDF MQTT con TLS](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/api-reference/protocols/mqtt.html)

### Un usuario por tipo de cliente

No compartir credenciales entre nodos. La razón: si las creds de un nodo se filtran, podés revocar solo ese usuario sin afectar el resto.


### ACL (Access Control List)

Limitar qué puede hacer cada usuario en qué topics. El objetivo: que un nodo de medición comprometido **no pueda mandar comandos a los actuadores**.

Esquema típico:
- Nodos de medición: solo pueden publicar a sus propios topics de datos
- Actuadores: solo pueden subscribirse a sus propios topics de comandos y publicar confirmaciones
- Ningún nodo puede publicar a topics de otros nodos

Documentación: [Mosquitto ACL](https://mosquitto.org/man/mosquitto-conf-5.html) (sección `acl_file`)

## Verificación post-deploy

- [ ] Puerto 1883 cerrado / no respondiendo (`nmap -p 1883 <ip-broker>`)
- [ ] Puerto 8883 abierto y requiere TLS (`openssl s_client -connect <ip-broker>:8883`)
- [ ] `mosquitto_sub` sin credenciales falla con "Connection Refused"
- [ ] Un usuario con ACL restringida no puede publicar/subscribirse fuera de sus topics
- [ ] Verificar que los logs muestren rechazos de auth luego de hacer un tests de auths fallidas
- [ ] Backup de `/etc/mosquitto/passwd`, `/etc/mosquitto/acl`, y certificados fuera del servidor

## Si las creds de un nodo se comprometen

1. Eliminar el usuario del archivo de passwords de Mosquitto
2. Reiniciar Mosquitto
3. Reprogramar el [NVS](secrets-en-firmware.md) del nodo con nuevas creds
4. Crear el usuario de nuevo con nueva password
5. Revisar logs por publicaciones sospechosas durante la ventana de compromiso
