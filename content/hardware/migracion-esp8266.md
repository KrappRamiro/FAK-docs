# Migración ESP8266 → ESP32

Página oficial del ESP8266 (legacy): [Espressif ESP8266](https://www.espressif.com/en/products/socs/esp8266)

El SDK del ESP8266 está básicamente abandonado desde 2022. Si todo funciona y no tocás el proyecto, no es urgente. Pero si estás arrancando algo nuevo con experiencia en el 8266, o querés darle mantenimiento a un proyecto existente, conviene pasarse. La buena noticia es que la migración es bastante mecánica: WiFi, I2C, UART y SPI tienen APIs prácticamente idénticas del lado ESP32. Los problemas reales son unos pocos gotchas de hardware y algunos includes que cambian.

## Qué chip elegir

No hay una respuesta única, pero el punto de partida para la mayoría de los proyectos ESP8266 es el **ESP32-C3**:

- Perfil similar al 8266: single-core, bajo consumo, WiFi 4
- 400 KB SRAM vs ~80 KB útiles del 8266
- ADC que funciona con WiFi activo (el problema clásico del 8266 no existe acá)
- USB Serial/JTAG nativo — no necesitás adaptador FTDI para flashear
- Arquitectura RISC-V, toolchain estándar y limpio

Si el C3 se queda corto, los siguientes candidatos son:

- **ESP32-C6**: mismo presupuesto, agrega WiFi 6 y 802.15.4 (Thread/Zigbee). Vale la pena si la infraestructura de red lo justifica.
- **ESP32-S3**: dual-core 240 MHz, 512 KB SRAM, hasta 45 GPIO, USB OTG. Para proyectos que estaban sufriendo los límites del 8266 en serio.

El resto de la línea moderna está en [SoCs ESP32 - Catálogo](./socs/index.md).

## Tabla comparativa rápida

| Feature             | ESP8266            | ESP32-C3          | ESP32-C6          | ESP32-S3          |
| ------------------- | ------------------ | ----------------- | ----------------- | ----------------- |
| Cores / MHz         | 1 / 80-160         | 1 / 160           | 1 / 160           | 2 / 240           |
| SRAM útil           | ~80 KB             | 400 KB            | 512 KB            | 512 KB            |
| GPIO                | ~11                | 22                | 30                | 45                |
| ADC                 | 1ch 10-bit 1V max  | 6ch 12-bit 3.3V   | 7ch 12-bit 3.3V   | 20ch 12-bit 3.3V  |
| ADC con WiFi activo | ❌                 | ✅                | ✅                | ✅                |
| BLE                 | ❌                 | BLE 5.0           | BLE 5.0           | BLE 5.0           |
| 802.15.4            | ❌                 | ❌                | ✅                | ❌                |
| USB para flashear   | FTDI externo       | USB nativo        | USB nativo        | USB nativo        |
| Deep sleep          | ~$20\,\mu\text{A}$ | ~$5\,\mu\text{A}$ | ~$7\,\mu\text{A}$ | ~$7\,\mu\text{A}$ |

## Frameworks disponibles

Ninguno de los chips nuevos obliga a cambiar de framework. Podés seguir con lo que ya usabas o aprovechar el cambio para migrar:

- **[Arduino](./frameworks/arduino.md)**: el port arduino-esp32 mantiene Espressif, tiene soporte completo para toda la línea nueva. El cambio desde arduino-esp8266 es mínimo.
- **[ESP-IDF](./frameworks/esp-idf.md)**: el SDK oficial en C. Más control, mejor para producción. No hay equivalente para el 8266, así que acá sí hay curva de aprendizaje si venías de Arduino.
- **[PlatformIO](./frameworks/platformio.md)**: soporta tanto arduino-esp32 como ESP-IDF como backend. Si ya usabas PlatformIO con el 8266, el salto es cambiar el `board` en `platformio.ini`.
- **[Rust](./frameworks/rust.md)**: si querés aprovechar el cambio para saltar a Rust, el ESP32-C3 es el mejor punto de entrada por su arquitectura RISC-V.

## Pinout

Ningún ESP32 tiene pinout compatible con el ESP8266, así que si tenés PCBs hechas para el 8266 hay que rediseñar. Lo que sí se porta sin esfuerzo es la lógica del firmware, porque las abstracciones de periféricos son equivalentes.

### Pines del ESP8266 que tienen comportamiento distinto

| Pin ESP8266 | Comportamiento                                        | Equivalente en ESP32                       |
| ----------- | ----------------------------------------------------- | ------------------------------------------ |
| GPIO0       | HIGH = boot normal, LOW = modo flash                  | GPIO9 en C3 (botón BOOT) — misma lógica    |
| GPIO2       | Tiene que estar HIGH en boot                          | No hay restricción equivalente en C3       |
| GPIO15      | Tiene que estar LOW en boot — pull-down requerido     | No existe el requisito                     |
| GPIO16      | Solo para wake de deep sleep, sin PWM ni IRQ          | Cualquier RTC GPIO sirve para wake         |
| ADC A0      | 0-1.0V máximo, con divisor externo para llegar a 3.3V | ADC directo 0-3.3V, sin divisor            |
| TX/RX       | Compartidos con UART0 debug                           | USB CDC nativo — `Serial.print` va por USB |

### GPIO reservados en ESP32-C3

- **GPIO0-4**: conectados internamente a la flash SPI — no disponibles como GPIO de usuario
- **GPIO18/19**: USB Serial/JTAG — no usar como GPIO si usás el USB

## Cambios de código

La mayoría son búsqueda y reemplazo de includes. Las APIs de WiFi, servidor web, mDNS y filesystem son idénticas en funcionalidad.

```cpp
// Antes (ESP8266)             -->   Ahora (ESP32)
#include <ESP8266WiFi.h>       -->   #include <WiFi.h>
#include <ESP8266WebServer.h>  -->   #include <WebServer.h>
#include <ESP8266mDNS.h>       -->   #include <ESPmDNS.h>
ICACHE_RAM_ATTR void isr()     -->   IRAM_ATTR void isr()
analogRead(A0)  // 0-1023      -->   analogRead(PIN)  // 0-4095, PIN = número GPIO
```

## Pitfalls comunes

### `delay()` y el scheduler WiFi

En el 8266 funcionaba porque el scheduler era cooperativo y simple. En ESP32 (que corre FreeRTOS) un `delay()` largo puede starvar el task de WiFi y generar desconexiones:

```cpp
// Puede causar desconexiones en ESP32:
void loop() {
    delay(5000);
}

// Correcto con FreeRTOS:
vTaskDelay(pdMS_TO_TICKS(5000));

// O con millis() si seguís en loop():
unsigned long last = 0;
void loop() {
    if (millis() - last >= 5000) {
        last = millis();
        doSomething();
    }
}
```

### SPIFFS está deprecado — migrar a LittleFS

```cpp
// Viejo:
SPIFFS.begin();
File f = SPIFFS.open("/config.json", "r");

// Correcto:
#include <LittleFS.h>
LittleFS.begin();
File f = LittleFS.open("/config.json", "r"); // misma API, distinto include
```

### `IRAM_ATTR` en ISRs (chips Xtensa)

En chips con arquitectura Xtensa (S3), el código en flash se cachea. Una ISR puede ejecutarse cuando la caché no está disponible, y sin `IRAM_ATTR` crashea de forma no determinística.

```cpp
IRAM_ATTR void miISR() {
    // código de interrupción
}
```

En chips RISC-V (C3, C6) el modelo de memoria es más simple y no tiene este problema, pero mantenerlo como hábito no hace daño.

### El ADC mejoró

El 8266 tenía un solo canal ADC de 10-bit que llegaba hasta 1.0V y dejaba de funcionar correctamente bajo carga WiFi.

En los ESP32 modernos los canales ADC son todos 12-bit, llegan a 3.3V, y funcionan con WiFi activo sin restricciones.

**El único cambio necesario es leer con el número de GPIO en vez del pin `A0`.**

---

## Por qué dejar el ESP8266

**El SDK no recibe features desde 2019.** El Non-OS SDK cerró el desarrollo de nuevas funcionalidades en diciembre de 2019. El RTOS SDK tiene actividad esporádica pero no hay desarrollo activo. Seguir en ESP8266 es apostar a que las librerías de la comunidad (arduino-esp8266) aguanten indefinidamente sin soporte oficial de Espressif.

**No tiene Bluetooth.** Sin BLE no podés hacer commissioning por app, no podés hacer Bluetooth Mesh, no podés hacer nada que involucre un teléfono cerca del dispositivo sin WiFi de por medio.

**Sin WPA3.** La mayoría de los routers modernos pueden configurarse con WPA3 o WPA2/WPA3 mixto. El ESP8266 en la práctica no lo soporta, y la implementación existe solamente en la version con FreeRTOS.

**Sin hardware de aceleración criptográfica para TLS.** El ESP8266 puede hacer TLS 1.2 pero lo corre todo en software, y se nota: handshakes lentos y mucha más presión sobre los ~80 KB de RAM útil. Los ESP32 modernos tienen hardware AES, SHA y RSA integrado.

**Sin cifrado de flash.** Firma de firmware: sí, existe. Pero cifrado de flash, que nadie pueda leer los secrets del dispositivo extrayendo la flash, no está disponible. En un ESP32 moderno ambas cosas están integradas.

**Es hardware viejo,** tiene solo UN canal ADC de 10-bit a 1V, ~80 KB de RAM útil y sin USB nativo.
