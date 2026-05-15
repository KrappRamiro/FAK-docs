# Prompt para Claude Code - Proyecto Invernadero ESP32

Pegar al inicio de la sesión en Claude Code.

---

## Contexto del proyecto

Soy un desarrollador de sistemas y backend (Python/FastAPI, Node.js) trabajando en un sistema de automatización e investigación agronómica para invernadero. Objetivo dual: control automatizado de riego/clima + recolección de datos para publicación académica con peer review.

## Base de conocimiento

La base de conocimiento está en este repo, organizada en carpetas numeradas. Leer antes de responder cualquier pregunta de hardware, sensores, conectividad o metodología:

```
ash/
├── README.md ← índice general, leer primero
├── empezar-aca/ ← onboarding: glosario, inventario
├── hardware/ ← SoCs, DevKits, conectores, form-factors, frameworks
├── electronica/ ← resistencias, capacitores, transistores, diodos, relays, cables
├── sensores/ ← T/HR, CO2, PAR, humedad suelo, pH, VWC
├── conectividad/ ← WiFi, LoRa, arquitectura, MQTT
├── construccion-nodos/ ← recetas por rol: ambiental, actuador, cámara, suelo, referencia
├── herramientas/ ← estación de soldado
├── seguridad-iot/ ← secrets, MQTT TLS, OTA firmado, exposición externa
└── investigacion/ ← metodología, calibración cruzada, trazabilidad
```

Cada carpeta tiene su propio `README.md` con índice + árbol de decisión.

## Hardware disponible (resumen)

### Boards
- 3x [ESP32-S3-DevKitC-1 N16R8](hardware/devkits/espressif/esp32-s3-devkitc-1.md) (16 MB flash, 8 MB PSRAM)
- 2x [ESP32-C3-DevKitC-02](hardware/devkits/espressif/esp32-c3-devkitc-02.md)

### Componentes
- Kits completos de resistencias, capacitores cerámicos + electrolíticos, transistores TO-92, diodos
- 10x relay 5V optoacoplado, 5x [LM2596S](electronica/potencia/lm2596s.md) step-down, 5x [MB102](electronica/potencia/mb102.md) power supply
- 10x sensor capacitivo de suelo v2.0 (para prototipado y nodos de control)
- Breadboards 830 + 400, cable 24 [AWG](electronica/cables-awg.md) señal + 18-22 [AWG](electronica/cables-awg.md) potencia

## Decisiones de diseño ya tomadas

- **Protocolo de datos**: [MQTT](conectividad/mqtt-stack.md) a broker [Mosquitto](conectividad/mqtt-stack.md) local **con TLS + autenticación** (ver `seguridad-iot/mqtt-tls.md`)
- **Storage**: [InfluxDB](conectividad/mqtt-stack.md)
- **Visualización**: [Grafana](conectividad/mqtt-stack.md)
- **Red**: WiFi mesh (escenario B, APs cercanos). [LoRa](conectividad/lora.md) para expansión futura.

## Lo que NO necesito que me expliques

- Qué es el [ESP32](hardware/socs/index.md) en general - tengo `hardware/`
- Diferencias entre chips [ESP32](hardware/socs/index.md) - tengo `hardware/socs/`
- Qué es [VWC](sensores/humedad-suelo/vwc.md) - tengo `sensores/vwc.md`
- Por qué importa la seguridad IoT - tengo `seguridad-iot/`

## Lo que NO entra en scope (no proponer)

- Thread / Zigbee / Matter / 802.15.4 - uso WiFi + [MQTT](conectividad/mqtt-stack.md) propio, no quiero ese stack
- Inferencia ML / TFLite Micro / aceleración SIMD - no voy a entrenar ni correr modelos en el chip
- Escribir drivers o código de bajo nivel desde cero - uso las librerías existentes de [ESP-IDF](hardware/frameworks/esp-idf.md) y componentes del registry

## Cómo quiero que trabajes

1. Cuando haga preguntas de hardware/sensores/red/metodología, **consultar los MD relevantes primero** antes de responder.
2. Cuando escribas código para [ESP-IDF](hardware/frameworks/esp-idf.md), asumir experiencia en C y sistemas - no simplificar de más.
3. Cuando haya consideraciones para publicación académica, indicarlo explícitamente.
4. Cuando haya implicancias de seguridad IoT (secrets, network exposure, [OTA](seguridad-iot/ota-firmado.md)), señalarlas y referenciar `seguridad-iot/`.
5. Si algo que pregunto contradice una decisión ya tomada, señalarlo directamente.
6. **Idioma: español.**

