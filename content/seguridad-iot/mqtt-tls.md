# MQTT con TLS y Autenticación

> El default de la mayoría de tutoriales (`allow_anonymous true`, puerto 1883 sin TLS) deja tu broker **completamente abierto en LAN**. Cualquier dispositivo en la red puede leer todos los topics y mandar comandos a tus actuadores.

## Lo que NO hacer

`mosquitto.conf` típico de tutorial:

```conf
listener 1883
allow_anonymous true
```

Esto significa:
- Cualquier dispositivo en LAN puede subscribirse a `#` y ver todas las lecturas
- Cualquier dispositivo en LAN puede publicar a `greenhouse/zone-A/actuator/pump-1/cmd` y activar la bomba
- Si el puerto 1883 queda expuesto al WAN por una mala config del router, Shodan lo indexa en horas

## Setup correcto

### 1. Generar certificados (autofirmados, alcanza para LAN)

```bash
mkdir -p /etc/mosquitto/ca_certificates /etc/mosquitto/certs

# CA (Certificate Authority - quien firma)
openssl req -new -x509 -days 3650 -extensions v3_ca \
 -keyout /etc/mosquitto/ca_certificates/ca.key \
 -out /etc/mosquitto/ca_certificates/ca.crt \
 -subj "/CN=greenhouse-ca"

# Cert del server
openssl genrsa -out /etc/mosquitto/certs/server.key 2048
openssl req -new -key /etc/mosquitto/certs/server.key \
 -out /etc/mosquitto/certs/server.csr \
 -subj "/CN=mqtt.greenhouse.local"
openssl x509 -req -in /etc/mosquitto/certs/server.csr \
 -CA /etc/mosquitto/ca_certificates/ca.crt \
 -CAkey /etc/mosquitto/ca_certificates/ca.key \
 -CAcreateserial -out /etc/mosquitto/certs/server.crt \
 -days 3650

# Permisos
sudo chown -R mosquitto:mosquitto /etc/mosquitto/ca_certificates /etc/mosquitto/certs
sudo chmod 600 /etc/mosquitto/certs/server.key
sudo chmod 600 /etc/mosquitto/ca_certificates/ca.key
```

> La `ca.crt` la copiás al firmware de cada nodo (no es secreto) - es lo que valida que el server es legítimo. La `ca.key` queda en el servidor (es secreto).

### 2. Crear usuarios

```bash
# Crear archivo de passwords
sudo mosquitto_passwd -c /etc/mosquitto/passwd greenhouse_node
# pide password - usar uno generado: `openssl rand -base64 24`

# Agregar más usuarios
sudo mosquitto_passwd /etc/mosquitto/passwd telegraf
sudo mosquitto_passwd /etc/mosquitto/passwd home_assistant
```

> **Un usuario por tipo de cliente.** No usar el mismo "admin" para todo. Si un nodo se compromete, podés revocar solo ese usuario.

### 3. ACL - control de acceso fino

`/etc/mosquitto/acl`:

```
# greenhouse_node: solo puede publicar a sus propios topics
user greenhouse_node
topic write greenhouse/+/+/data
topic write greenhouse/+/node/+

# telegraf: solo lee, para volcar a InfluxDB
user telegraf
topic read greenhouse/#

# home_assistant: lee todo + publica solo comandos a actuadores
user home_assistant
topic read greenhouse/#
topic write greenhouse/+/actuator/+/cmd
```

Esto limita el daño en profundidad: incluso si las creds de `greenhouse_node` se filtran, esa cuenta no puede mandar comandos a los actuadores.

### 4. `mosquitto.conf` completo

```conf
# Listener TLS exclusivo, sin puerto plano
listener 8883
cafile /etc/mosquitto/ca_certificates/ca.crt
certfile /etc/mosquitto/certs/server.crt
keyfile /etc/mosquitto/certs/server.key
tls_version tlsv1.2

# Autenticación obligatoria
allow_anonymous false
password_file /etc/mosquitto/passwd
acl_file /etc/mosquitto/acl

# Persistencia (importante: si se reinicia el broker, no perder mensajes retained)
persistence true
persistence_location /var/lib/mosquitto/

# Logs
log_dest file /var/log/mosquitto/mosquitto.log
log_type error
log_type warning
log_type notice
log_type information
log_timestamp true

# Binding sólo a IP local (no a 0.0.0.0)
bind_address 192.168.1.10
```

> `bind_address` evita que el broker escuche en interfaces externas. Si tu servidor tiene IP pública o segunda interfaz, esto previene exposición accidental.

### 5. Restart y verificar

```bash
sudo systemctl restart mosquitto
sudo systemctl status mosquitto

# Test desde otro host de la LAN:
mosquitto_pub -h 192.168.1.10 -p 8883 \
 --cafile ca.crt \
 -u greenhouse_node -P 'pass_aqui' \
 -t 'greenhouse/zone-A/test/data' \
 -m '{"ts":1234567890,"value":42}'
```

Si el `mosquitto_pub` funciona pero `mosquitto_pub` sin `--cafile` o sin `-u/-P` falla $\rightarrow$ la config está bien.

## ESP-IDF cliente con TLS

```c
extern const char ca_cert_pem_start[] asm("_binary_ca_crt_start");
extern const char ca_cert_pem_end[] asm("_binary_ca_crt_end");

esp_mqtt_client_config_t mqtt_cfg = {
 .broker.address.uri = "mqtts://mqtt.greenhouse.local:8883",
 .broker.verification.certificate = ca_cert_pem_start,
 .credentials.username = nvs_get_mqtt_user,
 .credentials.authentication.password = nvs_get_mqtt_pass,
 .session.keepalive = 60,
 .network.reconnect_timeout_ms = 5000,
};
```

`CMakeLists.txt` para embedir el cert:

```cmake
idf_component_register(
 SRCS "mqtt_client.c"
 EMBED_TXTFILES "ca.crt"
 REQUIRES mqtt esp-tls
)
```

## Verificación post-deploy

Cosas para validar después de poner el broker en producción:

- [ ] Puerto 1883 cerrado / no respondiendo (`nmap -p 1883 192.168.1.10`)
- [ ] Puerto 8883 abierto y requiere TLS (`openssl s_client -connect 192.168.1.10:8883`)
- [ ] `mosquitto_sub` sin credenciales falla
- [ ] `mosquitto_sub` con credenciales mal acl falla en publish/subscribe que no le corresponde
- [ ] Logs muestran rechazos de auth $\rightarrow$ registro auditable de intentos
- [ ] Backup de `/etc/mosquitto/passwd`, `/etc/mosquitto/acl`, y `/etc/mosquitto/ca_certificates/` fuera del servidor

## Cuando un cliente se compromete

Si sospechás que las creds de un nodo se filtraron:

1. `sudo mosquitto_passwd -D /etc/mosquitto/passwd greenhouse_node_zone_X` (delete user)
2. Reiniciar [Mosquitto](../conectividad/mqtt-stack.md)
3. Reprogramar el [NVS](secrets-en-firmware.md) del nodo con nuevas creds
4. Crear el usuario de nuevo con la nueva password
5. Revisar logs por publicaciones sospechosas durante la ventana de compromiso
