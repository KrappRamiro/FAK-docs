---
title: "MQTT con TLS y Autenticación"
description: "Cómo configurar Mosquitto con TLS y ACLs para proteger el tráfico MQTT en la red local."
tags:
  - seguridad-iot
  - guia
  - mqtt
  - tls
---

# MQTT con TLS y Autenticación

MQTT fue diseñado para redes industriales donde los dispositivos se asumen confiables entre sí. El resultado es que el protocolo en sí no tiene seguridad: cualquier cliente puede conectarse, suscribirse a `#`, y ver todo el tráfico del broker. Agregar seguridad real requiere configurarla explícitamente en Mosquitto.

Hay dos problemas independientes que resolver: **confidencialidad del transporte** (TLS) y **control de acceso** (autenticación + ACLs). Resolver solo uno deja el otro abierto.

## TLS en puerto 8883

Sin TLS, todo el tráfico MQTT viaja en texto plano por la red. Eso incluye las credenciales de login de cada nodo, las lecturas de sensores, y los comandos a los actuadores. Cualquier dispositivo en la misma LAN puede interceptarlo con un simple sniffer.

La solución es que el broker escuche únicamente en el puerto 8883 con TLS, y nunca en el 1883 plano. Para eso se necesita una CA (Certificate Authority), aunque sea autofirmada: el broker tiene un certificado firmado por esa CA, y cada cliente —ESP32, Telegraf, Grafana— lo valida contra la `ca.crt` al conectarse. Esto garantiza que el cliente está hablando con el broker real y no con un interceptor.

La documentación de referencia es [Mosquitto TLS](https://mosquitto.org/man/mosquitto-tls-7.html) y [ESP-IDF MQTT con TLS](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/api-reference/protocols/mqtt.html).

## Autenticación por cliente

`allow_anonymous true` —el default de la mayoría de tutoriales— permite que cualquier dispositivo en la red se conecte sin credenciales. Con eso, un nodo comprometido o un dispositivo desconocido en la LAN tiene acceso total al broker.

Lo correcto es un usuario separado por tipo de cliente: un usuario para los nodos de medición, otro para los actuadores, otro para Telegraf. La razón no es burocrática: si las credenciales de un nodo se filtran, podés revocar solo ese usuario sin interrumpir el resto del sistema. Con un solo usuario compartido, una filtración requiere rotar todo.

## ACLs

La autenticación verifica identidad; las ACLs determinan qué puede hacer cada identidad. El objetivo es que un nodo comprometido tenga el menor radio de daño posible.

Un esquema sensato: los nodos de medición solo pueden publicar a sus propios topics de datos, nunca a topics de comandos. Los actuadores solo se suscriben a sus topics de comandos y publican confirmaciones. Ningún nodo puede publicar a los topics de otro nodo. Así, si un nodo de medición queda bajo control de un atacante, no puede enviar comandos a las bombas o válvulas.

La configuración se hace en Mosquitto via el campo `acl_file` en `mosquitto.conf`. Documentación: [Mosquitto ACL](https://mosquitto.org/man/mosquitto-conf-5.html).

## Verificación post-deploy

Estos checks confirman que la configuración está activa y no solo en los archivos de config:

- [ ] Puerto 1883 no responde (`nmap -p 1883 <ip-broker>`)
- [ ] Puerto 8883 requiere TLS (`openssl s_client -connect <ip-broker>:8883`)
- [ ] `mosquitto_sub` sin credenciales falla con "Connection Refused"
- [ ] Un usuario con ACL restringida no puede publicar/suscribirse fuera de sus topics
- [ ] Los logs muestran rechazos de auth ante intentos sin credenciales
- [ ] Backup de `/etc/mosquitto/passwd`, `/etc/mosquitto/acl`, y los certificados fuera del servidor

## Si las credenciales de un nodo se comprometen

1. Eliminar el usuario del archivo de passwords de Mosquitto y reiniciar el servicio — el nodo queda sin acceso de inmediato
2. Revisar los logs del broker por publicaciones a topics fuera de los ACL del nodo durante la ventana de compromiso
3. Reprogramar el [NVS](secrets-en-firmware.md) del nodo con las nuevas credenciales
4. Recrear el usuario en Mosquitto con la nueva password
