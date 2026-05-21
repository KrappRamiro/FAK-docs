---
title: "Seguridad IoT"
description: "Guía de seguridad para nodos ESP32 en red: credenciales, TLS, OTA firmado y Secure Boot."
tags:
  - seguridad-iot
  - indice
---

# Seguridad IoT

Un sistema de monitoreo y control de invernadero tiene una superficie de ataque más amplia de lo que parece. Los nodos ESP32 están conectados a la LAN, hablan con un broker MQTT, reciben actualizaciones de firmware de forma remota, y controlan actuadores físicos —bombas, válvulas, lámparas— que tienen consecuencias reales si se accionan incorrectamente.

La mayoría de los tutoriales de ESP32 e IoT ignoran esto por completo. El resultado típico es un broker con `allow_anonymous true`, credenciales WiFi y MQTT hardcodeadas en el binario del firmware, y OTA sin ninguna verificación de integridad. Cualquier dispositivo en la misma red —incluyendo una cámara barata o un foco "smart" con firmware desactualizado— puede leer todas las lecturas de sensores, publicar comandos a los actuadores, y potencialmente sobreescribir el firmware de todos los nodos.

## Qué hay que proteger

**Credenciales WiFi y MQTT.** Dan acceso a la red y al broker. Si están hardcodeadas en el firmware, cualquiera que extraiga el binario del chip con `esptool` las tiene en texto plano. Ver [Secrets en el Firmware](secrets-en-firmware.md).

**El canal MQTT.** Sin TLS, todo el tráfico viaja en claro por la LAN. Sin ACLs, un nodo comprometido puede enviar comandos a cualquier actuador. Ver [MQTT con TLS y Autenticación](mqtt-tls.md).

**El firmware.** Sin firma, un atacante con acceso al broker puede flashear firmware arbitrario a todos los nodos. Con acceso, puede hacer rollback a versiones con vulnerabilidades conocidas. Ver [OTA](ota.md) y [Secure Boot V2](secure-boot.md).

**Los inputs que llegan por MQTT a los actuadores.** Que un comando llegue por el broker no garantiza que sea válido. Un nodo comprometido puede publicar valores fuera de rango. Los nodos actuadores tienen que validar rango, formato, y rechazar lo que no pase —y registrar el rechazo.

## El broker no va al WAN

El broker MQTT no debe estar expuesto a internet bajo ninguna circunstancia. Shodan indexa el puerto 1883 en horas. Si necesitás acceso remoto, la única opción razonable es VPN. El broker queda en LAN, el acceso remoto pasa por el túnel.
