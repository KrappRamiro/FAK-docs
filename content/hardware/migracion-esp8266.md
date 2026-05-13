# Migración ESP8266 $\rightarrow$ ESP32

Página oficial del ESP8266 (legacy): [Espressif ESP8266](https://www.espressif.com/en/products/socs/esp8266)

## Perfil del ESP8266 (origen)

- Tensilica L106 single-core 80/160 MHz
- ~80 KB RAM utilizable (de 160 KB, el SO come la mitad)
- WiFi 802.11 b/g/n, sin Bluetooth
- ~11 GPIO usables en práctica (varios reservados para boot/flash)
- 1 canal ADC de 10-bit a 1.0V máximo
- Sin DAC, sin USB nativo
- SDK propietario en modo mantenimiento mínimo desde 2022

## Los tres candidatos para migrar

### ESP32 Clásico
- Xtensa LX6 dual-core 240 MHz, 520 KB SRAM, WiFi 4 + BT Classic 4.2 + BLE 4.2
- 34 GPIO, ADC 18ch 12-bit, DAC 2ch, 10 touch
- USB: sólo bridge CP2102 en DevKit
- Deep sleep ~$10\,\mu\text{A}$
- **Migrar acá si necesitás:** BT Classic, DAC, touch capacitivo, Ethernet MAC

### ESP32-C3 (target habitual)
- RISC-V single-core 160 MHz, 400 KB SRAM, WiFi 4 + BLE 5.0
- 22 GPIO, ADC 6ch 12-bit
- USB Serial/JTAG nativo - sin adaptador externo para flashear
- Deep sleep ~$5\,\mu\text{A}$
- **Sin restricción de ADC con WiFi activo**
- RISC-V estándar - toolchain limpio

### ESP32-C2 (sólo para producción en volumen)
- RISC-V single-core 120 MHz, 272 KB SRAM
- 14 GPIO - **menos que el ESP8266**
- Sin USB nativo
- No recomendado para desarrollo o hobby

---

## Tabla de migración directa

| Feature | ESP8266 | ESP32 Clásico | ESP32-C3 |
|---|---|---|---|
| SRAM | ~80 KB | 520 KB (+550%) | 400 KB (+400%) |
| GPIO | ~11 | 34 | 22 |
| ADC | 1ch 10-bit 1V max | 18ch 12-bit 3.3V | 6ch 12-bit 3.3V |
| ADC con WiFi | Sí (1 canal) | **ADC2 no funciona** | Sí, sin restricción |
| Bluetooth | No | Classic + BLE 4.2 | BLE 5.0 |
| USB para flashear | FTDI externo | CP2102 incluido | USB nativo directo |
| DAC | No | 2ch 8-bit | No |
| Touch | No | 10 canales | No |
| ISA | Tensilica L106 | Xtensa LX6 | **RISC-V estándar** |
| Deep sleep | ~$20\,\mu\text{A}$ | ~$10\,\mu\text{A}$ | ~$5\,\mu\text{A}$ |
| Precio DevKit | | | |

---

## Cambios de pinout

Ningún ESP32 tiene pinout compatible con ESP8266. Lo que se porta sin esfuerzo es la lógica del firmware, porque WiFi API, I2C, SPI y UART son las mismas abstracciones en [ESP-IDF](frameworks/esp-idf.md) y arduino-esp32.

### Pines problemáticos del ESP8266 que desaparecen

| Pin ESP8266 | Problema | En ESP32-C3 |
|---|---|---|
| GPIO0 | Boot mode: HIGH boot, LOW flash | GPIO9 (BOOT button) - misma lógica |
| GPIO2 | HIGH en boot - LED acá rompe el boot | Sin equivalente problemático |
| GPIO15 | LOW en boot - pull-down requerido | No existe el requisito |
| GPIO16 | Sólo wake desde deep sleep, sin PWM/IRQ | Deep sleep wake normal en cualquier RTC GPIO |
| ADC A0 | Sólo 0-1.0V, con divisor para leer 3.3V | ADC 0-3.3V directo, sin divisor |
| TX/RX | Compartidos con UART0 debug | USB CDC nativo - Serial.print por USB |

### GPIO reservados en ESP32-C3

- **GPIO0-4:** conectados internamente a la flash SPI - no disponibles
- **GPIO18/19:** USB Serial/JTAG nativo - no usar como GPIO si usás USB

---

## Cambios mínimos de código

```cpp
// ESP8266 ESP32 (clásico o C3)
#include <ESP8266WiFi.h> → #include <WiFi.h>
#include <ESP8266WebServer.h> → #include <WebServer.h>
#include <ESP8266mDNS.h> → #include <ESPmDNS.h>
ICACHE_RAM_ATTR void isr → IRAM_ATTR void isr
analogRead(A0) // 0-1023 → analogRead(PIN) // 0-4095, pin = GPIO
```

---

## Trampas frecuentes

### 1. ADC2 del ESP32 clásico con WiFi

```cpp
// FALLA SILENCIOSAMENTE con WiFi activo en ESP32 clásico:
int val = analogRead(27); // GPIO27 = ADC2_CH7 → devuelve basura

// CORRECTO: usar sólo pines ADC1 (GPIO32-39)
int val = analogRead(34); // GPIO34 = ADC1_CH6 → funciona siempre
```

En el C3 todos los 6 canales son ADC1 - no existe el problema.

### 2. `delay()` y el stack WiFi

```cpp
// En ESP8266 funcionaba (scheduler cooperativo simple)
// En ESP32 puede starvar el task WiFi y causar desconexiones:
void loop() {
 delay(5000); // bloquea el FreeRTOS scheduler
}

// Correcto en ESP32:
vTaskDelay(pdMS_TO_TICKS(5000)); // cede el scheduler

// O con millis:
unsigned long last = 0;
void loop() {
 if (millis - last >= 5000) {
 last = millis;
 doSomething;
 }
}
```

### 3. SPIFFS deprecated $\rightarrow$ migrar a LittleFS

```cpp
// Viejo:
SPIFFS.begin;
File f = SPIFFS.open("/config.json", "r");

// Correcto en ESP32 moderno:
#include <LittleFS.h>
LittleFS.begin;
File f = LittleFS.open("/config.json", "r"); // misma API
```

### 4. `IRAM_ATTR` obligatorio en ISRs (Xtensa)

En Xtensa (ESP32 clásico y S3), el código en flash se cachea. Una ISR puede ejecutarse cuando la cache no está disponible. Sin `IRAM_ATTR` la ISR crashea de forma no determinística.

```cpp
IRAM_ATTR void miISR {
 // codigo de interrupcion
}
```

En RISC-V (C3, C6) el modelo de memoria es más simple, pero mantenerlo como buena práctica.

---

## Toolchain side-by-side

| Aspecto | ESP8266 | ESP32 Clásico | ESP32-C3 |
|---|---|---|---|
| Compilador | xtensa-lx106-elf-gcc | xtensa-esp32-elf-gcc | riscv32-esp-elf-gcc |
| Board manager (Arduino) | arduino.esp8266.com | espressif.github.io/arduino-esp32 | mismo |
| Selección de board | ESP8266 Boards | ESP32 Dev Module | ESP32C3 Dev Module |
| Baud rate de flash | 115200 | 921600 soportado | 921600 soportado |
| Debugger | Serial.print | JTAG via FTDI externo | **JTAG nativo por USB** |
| esptool.py | v2.x | v4.x (nueva sintaxis) | v4.x |

---

## Cuándo elegir cada candidato

### ESP32-C3 (por defecto para la mayoría)
- Reemplazás WiFi + BLE básico
- Querés toolchain RISC-V limpio
- Querés flashear sin adaptador externo
- Usás ADC con WiFi activo
- No necesitás BT Classic, DAC, ni touch

### ESP32 Clásico
- Necesitás Bluetooth Classic (A2DP audio, SPP)
- Necesitás DAC analógico sin chip externo
- Necesitás touch capacitivo nativo
- Necesitás Ethernet MAC sin chip externo
- Necesitás máximo número de GPIO (34)
- Necesitás dos cores físicos para tasks simultáneas

### No elegir ESP32-C2 para desarrollo
- 14 GPIO < ESP8266
- Sin USB nativo
- DevKits escasos
- Sólo tiene sentido para producción en volumen con firmware ya validado
