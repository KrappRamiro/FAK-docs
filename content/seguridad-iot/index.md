# Seguridad IoT

> Antes de poner cualquier nodo en producción en el invernadero, leer esto.

## Por qué importa, aunque sea hobby

Tu sistema lleva:

- **Credenciales WiFi** que dan acceso a tu LAN doméstica
- **Credenciales [MQTT](../conectividad/mqtt-stack.md)** que dan control sobre los actuadores (bombas, válvulas, lámparas)
- **Firmware [OTA](ota-firmado.md)** que, si no está firmado, puede ser sobreescrito por cualquiera en tu LAN
- **Datos del paper** que valen meses de trabajo

El "modelo de amenaza" no es Mossad. Es:

1. **Vecino curioso o invitado** conectado a tu WiFi de invitados que ve el broker [MQTT](../conectividad/mqtt-stack.md) abierto.
2. **Una falla en tu router** que expone un puerto del broker al WAN (Shodan tiene miles de [Mosquitto](../conectividad/mqtt-stack.md) sin password indexados).
3. **Un compromiso de otra IoT device** (cámara china barata, foco "smart" sin updates) que escanea la LAN y encuentra tu broker.
4. **Vos mismo en 6 meses** te olvidás cómo se conecta cada nodo, copiás credenciales a un repo público "para backup".

Defensa simple, en capas: **secrets fuera del código + TLS + auth + nada expuesto a internet directamente**.

## Por archivo

| Archivo | Tema |
|---|---|
| [`secrets-en-firmware.md`](./secrets-en-firmware.md) | [NVS encrypted](secrets-en-firmware.md), no hardcodear WiFi/[MQTT](../conectividad/mqtt-stack.md) creds, provisioning |
| [`mqtt-tls.md`](./mqtt-tls.md) | TLS + auth en [Mosquitto](../conectividad/mqtt-stack.md). Por qué `allow_anonymous true` no va. |
| [`ota-firmado.md`](./ota-firmado.md) | Signed [OTA](ota-firmado.md) updates, anti-rollback, secure boot |
| [`exposicion-externa.md`](./exposicion-externa.md) | Cuándo y cómo permitir acceso remoto sin abrir puertos al WAN |
| [`fatal-fury-esp32.md`](./fatal-fury-esp32.md) | Voltage glitching del ESP32 clásico (CVE-2019-17391) - por qué no usar pre-ECO V3 en diseños nuevos |

## Las 5 reglas obligatorias

1. **Cero secrets en el código fuente.** WiFi password, [MQTT](../conectividad/mqtt-stack.md) password, [OTA](ota-firmado.md) keys $\rightarrow$ [NVS](secrets-en-firmware.md) encriptado o variables de entorno + Provisioning. Si commiteás creds, asumir comprometidas y rotar.
2. **[MQTT](../conectividad/mqtt-stack.md) con TLS (puerto 8883)** y **autenticación obligatoria**. Nunca puerto 1883 plano. Nunca `allow_anonymous true`.
3. **[OTA](ota-firmado.md) firmado.** Sin firma, cualquier nodo comprometido puede sobreescribir el firmware de los demás.
4. **Validar todo input recibido por [MQTT](../conectividad/mqtt-stack.md)** en los nodos actuadores. Que un comando llegue por el broker no significa que sea seguro ejecutarlo - rango plausible, formato esperado, rechazar el resto.
5. **No abrir puertos del broker al WAN.** Acceso remoto solo vía VPN, [Tailscale](exposicion-externa.md), o [WireGuard](exposicion-externa.md). El broker vive en LAN.

## Lo que NO necesitás

- HSM, hardware security module
- Certificados firmados por CA pública (autofirmados está bien para LAN)
- Compliance formal (a menos que el paper o la institución lo exijan)
- Pentesting profesional

## Lo que SÍ necesitás revisar antes de publicar el paper

Si el experimento depende de datos de los nodos, un atacante con acceso al broker puede:

- Inyectar lecturas falsas en topics que [Telegraf](../conectividad/mqtt-stack.md) consume $\rightarrow$ corrompés la serie temporal del paper
- Apagar bombas en momentos críticos $\rightarrow$ arruinás el cultivo en estudio
- Borrar mensajes "retained" $\rightarrow$ perdés estado

**Mantener un backup de [InfluxDB](../conectividad/mqtt-stack.md) diario** (`influx backup`) en otra ubicación física es la última línea de defensa contra todo lo anterior.
