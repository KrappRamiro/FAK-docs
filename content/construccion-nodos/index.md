# Construcción de Nodos

Recetas típicas por rol. Cada archivo es una "carta de cocina": hardware típico + cableado + estructura del firmware + topics MQTT. No prescribe qué chip/sensor usar - muestra una receta funcional que cada uno puede ajustar al hardware disponible.

## Roles habituales en un invernadero IoT

| Rol | Chip típico | Archivo |
|---|---|---|
| Cámara | [ESP32-S3](../hardware/socs/esp32-s3.md) con PSRAM 8 MB | [`nodo-camara.md`](./nodo-camara.md) |
| Referencia (investigación) | [ESP32-S3](../hardware/socs/esp32-s3.md) (memoria sobrada para 5+ sensores I2C) | [`nodo-referencia.md`](./nodo-referencia.md) |
| Sensor ambiental | [ESP32-C3](../hardware/socs/esp32-c3.md) básico (o S3 si está disponible) | [`nodo-ambiental.md`](./nodo-ambiental.md) |
| Actuador (bomba, válvula) | [ESP32-C3](../hardware/socs/esp32-c3.md) (WiFi + GPIO alcanza) | [`nodo-actuador.md`](./nodo-actuador.md) |
| Análisis de suelo | [ESP32-C3](../hardware/socs/esp32-c3.md) (ADC + I2C) | [`nodo-suelo.md`](./nodo-suelo.md) |

## Pasos previos típicos antes de armar un nodo

1. **Verificar componentes** - DevKit, sensores, cables, relays disponibles.
2. **Calibrar sensores que lo requieran** - [VWC](../sensores/humedad-suelo/vwc.md), pH ([`../sensores/ezo-ph.md`](../sensores/ph-suelo/ezo-ph.md)).
3. **Provisionar secrets** - WiFi + [MQTT](../conectividad/mqtt-stack.md) en [NVS](../seguridad-iot/secrets-en-firmware.md) encriptado, no hardcoded. Ver [`../seguridad-iot/secrets-en-firmware.md`](../seguridad-iot/secrets-en-firmware.md)
4. **Validar en breadboard antes de PCB definitiva** - un nodo enterrado en el invernadero que falla es una expedición a recuperarlo.

## Plantilla común de firmware

Todos los nodos siguen la misma estructura:

```
main/
├── app_main.c ← bootstrap
├── wifi_provisioning.c ← conexión WiFi con credenciales de NVS
├── mqtt_client.c ← cliente MQTT con TLS + auth
├── sensors/ ← drivers de los sensores del rol
│ ├── sht45.c
│ ├── scd41.c
│ └── as7341.c
├── actuators/ ← solo en nodos actuadores
│ └── relay.c
├── secrets_nvs.c ← lectura segura de credenciales
└── telemetry.c ← buffer + publicación + heartbeat

components/
└── (componentes I2C, OTA, etc.)
```

## Heartbeat - convención

Cada nodo publica cada 60 s al topic `greenhouse/<zone>/node/heartbeat`:

```json
{
 "ts": 1715350800,
 "uptime_s": 3600,
 "rssi_dbm": -62,
 "free_heap_b": 145000,
 "fw_version": "0.3.1"
}
```

Si [Grafana](../conectividad/mqtt-stack.md) ve un nodo sin heartbeat durante > 2 min $\rightarrow$ alarma de "nodo caído".
