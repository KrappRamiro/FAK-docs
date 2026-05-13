# Conectividad y Protocolos

## Por tema

| Archivo | Para qué |
|---|---|
| [`arquitectura-de-red.md`](./arquitectura-de-red.md) | Los 3 escenarios (WiFi directo, mesh, [LoRa](lora.md)) y cuándo usar cada uno |
| [`wifi-en-invernadero.md`](./wifi-en-invernadero.md) | Por qué el invernadero es hostil para 2.4 GHz, antenas, alcance real |
| [`lora.md`](./lora.md) | Para distancias > 100m o múltiples invernaderos (expansión futura) |
| [`mqtt-stack.md`](./mqtt-stack.md) | [Mosquitto](mqtt-stack.md) + [InfluxDB](mqtt-stack.md) + [Grafana](mqtt-stack.md) - el stack del proyecto |

## Stack típico para IoT casero / hobby con datos en LAN

Una combinación común y bien documentada para proyectos que no quieren depender de la nube:

| Aspecto | Tecnología típica |
|---|---|
| Protocolo de aplicación | [MQTT](mqtt-stack.md) (pub/sub) |
| Broker | [Mosquitto](mqtt-stack.md) local |
| Transporte | WiFi (mesh si la cobertura lo requiere) |
| Almacenamiento de series temporales | [InfluxDB](mqtt-stack.md) |
| Visualización / dashboards | [Grafana](mqtt-stack.md) |
| Domótica (opcional) | [Home Assistant](mqtt-stack.md) consumiendo el mismo broker |
| Expansión a múltiples ubicaciones físicas | [LoRa](lora.md) |

Alternativa para integración con Apple Home / Google Home / Alexa nativa: **Thread + Matter** (no cubre este stack - el dispositivo se conecta a tu casa smart home en lugar de a tu broker MQTT).
