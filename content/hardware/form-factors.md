# Form Factors (Feather, XIAO, D1 Mini, M5Stack, Arduino)

## Feather + FeatherWings (Adafruit)

- **Tamaño:** $50.8 \times 22.9\,\text{mm}$
- **LiPo charging + JST connector** en todos los boards
- **[STEMMA QT](conectores.md)** en todos los boards modernos
- **FeatherWings disponibles:** motor driver, [LoRa](../conectividad/lora.md), OLED, eInk, relay, GPS, SD, servo, audio, etc.
- Cualquier FeatherWing funciona con cualquier Feather board - completamente cross-compatible

## D1 Mini + Shields (Wemos / LOLIN)

- **Tamaño:** $32 \times 26\,\text{mm}$
- **Shields:** OLED 0.66", relay, motor, DHT, LED matrix, batería, SD, protoboard
- Shields del [ESP8266](migracion-esp8266.md) D1 Mini son compatibles con boards en el mismo footprint (ej. [LOLIN S2 Mini](devkits/wemos-lolin/lolin-s2-mini.md))
- Muchos clones de calidad variable

## XIAO (Seeed Studio)

- **Tamaño:** $21 \times 17.5\,\text{mm}$ - el más pequeño con LiPo charging
- LiPo charging en todos los boards modernos
- Pocos shields oficiales - principalmente para breadboard o PCB embebido
- **[XIAO ESP32-S3 Sense](devkits/seeed-xiao/xiao-esp32-s3-sense.md)** agrega cámara OV2640 + micrófono PDM como módulo snap-on

## M5Stack

- Unidades encapsuladas que se apilan con conectores magnéticos de pogo pins
- No orientado a breadboard - prototipado sin cables
- **Expansión:** Modules (stack interno), Units ([Grove](conectores.md) externo), Hats (para Stick)
- Todos los boards tienen puertos [Grove](conectores.md)

## Arduino Shields

> ⚠️ **Peligro:** shields Arduino asumen lógica de **5V**. [ESP32](socs/index.md) GPIO es **3.3V**. Shields de 5V pueden dañar el [ESP32](socs/index.md). Verificar compatibilidad de voltaje antes de conectar.

---

## Cuándo elegir cada form factor

| Caso | Form factor típico |
|---|---|
| Nodo permanente con cableado fijo, prototipado en breadboard | **DevKitC oficial de Espressif** |
| Footprint chico + LiPo charging integrado (nodos a batería, sensores embebidos) | **[XIAO](#xiao-seeed-studio)** |
| Necesidad de agregar periféricos modulares (display, LoRa, GPS, motor driver) sin soldar | **[Feather](#feather--featherwings-adafruit)** |
| Demo / portable con pantalla integrada | **LilyGo [T-Display S3](devkits/lilygo/lilygo-t-display-s3.md)** o **[M5Stack Core S3](devkits/m5stack/m5stack-core-s3.md)** |
| Migración de proyecto ESP8266 existente con shields D1 Mini | **[D1 Mini](#d1-mini--shields-wemos--lolin)** |
