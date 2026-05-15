# Conectores Plug-and-Play (Qwiic, STEMMA QT, Grove, Gravity)

Sistemas para conectar sensores I2C (y otros) sin soldar

## Diferencia entre JST PH and JST SH

Ver <https://ldzy.tw/what-is-the-difference-between-jst-ph-and-sh/> para mas informacion

En resumen

- JST PH --> 2.0mm de pitch (distancia entre pines)
- JST SH --> 1.0mm de pitch (distancia entre pines)

## Quién creó cada uno y cuándo

| Estándar                 | Creador      |
| ------------------------ | ------------ |
| **Qwiic Connect System** | SparkFun     |
| **STEMMA**               | Adafruit     |
| **STEMMA QT** ("cutie")  | Adafruit     |
| **Grove**                | Seeed Studio |
| Gravity                  | DFRobot      |

---

## Qwiic (SparkFun) y STEMMA QT (Adafruit)

**Mismo conector físico, intercambiables.**

Según el artículo:

> _"The pin order for QT is designed to match the pin order for SparkFun's Qwiic enabling the use of Qwiic add-ons with Stemma QT boards and for the reverse to also be true."_

Del articulo tambien saque esta info:

| Spec        | Qwiic                 | STEMMA QT             |
| ----------- | --------------------- | --------------------- |
| Conector    | JST SH 1.0mm, 4 pines | JST SH 1.0mm, 4 pines |
| Pinout      | GND, 3.3V, SDA, SCL   | GND, 3.3V, SDA, SCL   |
| Protocolo   | I2C exclusivamente    | I2C exclusivamente    |
| Voltaje     | 3V DC                 | 3-5V DC               |
| Daisy-chain | Sí - pass-through     | Sí - pass-through     |

Ambos son **seguros para [ESP32](socs/index.md) sin level shifter** (el ESP32 trabaja a 3.3V).

### Boards con Qwiic / STEMMA QT integrado (per el artículo)

- **SparkFun MicroMod ATP** - carrier board con slot M.2 (MicroMod) para módulos intercambiables: ESP32, Artemis, RP2040
- **Adafruit QT Py RP2040** - creado específicamente porque sus boards chicas necesitaban un conector más pequeño que STEMMA original
- **Sensores Adafruit con STEMMA QT** mencionados en el artículo: MPR121 (touch capacitivo), SGP40 (calidad de aire), BME680 (T/H/P), AMG8833 (cámara IR térmica)
- **Adapters Raspberry Pi**: HAT y pHAT con Qwiic
- **Adapters Arduino**: varias variantes

### Trampa de naming: STEMMA vs STEMMA QT

Adafruit tiene **dos estándares con nombres similares**, no intercambiables físicamente:

| Estándar            | Conector     | Pines               | Protocolos                                                                                             |
| ------------------- | ------------ | ------------------- | ------------------------------------------------------------------------------------------------------ |
| **STEMMA QT**       | JST SH 1.0mm | 4                   | I2C                                                                                                    |
| **STEMMA** (sin QT) | JST PH 2.0mm | **3 o 4** según uso | **3 pines:** PWM, Analog, Digital IO (NeoPixels, LEDs, botones, sensores analógicos). **4 pines:** I2C |

STEMMA (sin QT) se usa en boards grandes como el **PyPortal** de Adafruit donde hay espacio para múltiples conectores. STEMMA QT existe para boards chicas donde no entra el JST PH.

---

## Grove (Seeed Studio)

| Spec       | Valor                                                                 |
| ---------- | --------------------------------------------------------------------- |
| Conector   | 4 pines propietarios, 2.0mm pitch (similar pero no idéntico a JST PH) |
| Protocolos | I2C, Digital, Analog, PWM (cables distintos por tipo)                 |
| Voltaje    | 3-5V DC según el módulo                                               |
| Catálogo   | 300+ módulos                                                          |

### Boards con Grove

Seeed colabora con Arduino, asi que varias placas Arduino vienen con conectores Grove integrados. También funciona con Raspberry Pi y Raspberry Pi Pico vía adapters. Per el artículo: el **Grove Beginner Kit** es la entrada típica al ecosistema (incluye OLED, DHT11, mic, sensor de luz + placa Arduino-compatible).

> ⚠️ **Peligro de voltaje:** módulos Grove de 5V emiten 5V en líneas de señal. GPIO del [ESP32](socs/index.md) tolera 3.3V - 5V de entrada **daña el SoC**. Verificar siempre el voltaje de operación del módulo antes de conectar.

> Los cables Grove tienen la misma apariencia física pero pinouts distintos según protocolo (I2C vs Digital vs Analog). Pedir el cable correcto para cada módulo.

### Compatibilidad parcial con STEMMA

Cita del artículo: _"Grove is compatible with Stemma components, but only for I2C devices as analog, PWM and digital IO are not compatible. If you are unsure, just take a look at the component. If it has SDA / SCL pins, then it is an I2C device."_

Regla práctica: si tiene pines SDA/SCL es I2C , por lo que Grove $\leftrightarrow$ STEMMA funcionan con adapter físico. Cualquier otro protocolo (PWM, analog, digital) **no es interoperable**.

---

## Gravity (DFRobot)

- JST PH 2.0mm, 3 o 4 pines según tipo
- Ecosistema cerrado de DFRobot - no compatible con Qwiic/Grove sin adaptador
- 150+ sensores, principalmente ambientales y de movimiento

---

## Tabla resumen (basada en el artículo de Tom's Hardware)

| Device    | Conector                       | Voltage / Logic | Protocolos                                                       |
| --------- | ------------------------------ | --------------- | ---------------------------------------------------------------- |
| STEMMA    | JST PH 3/4 pin, 2.0mm pitch    | 3-5V DC         | 4 pin: I2C, 3 pin: Analog / Digital / PWM                        |
| STEMMA QT | JST SH 4 pin, 1.0mm pitch      | 3-5V DC         | I2C                                                              |
| Qwiic     | JST SH 4 pin, 1.0mm pitch      | 3V DC           | I2C                                                              |
| Grove     | Propietario 4 pin, 2.0mm pitch | 3-5V DC         | I2C / Analog / Digital / PWM (compatible con STEMMA solo en I2C) |

---

## Matriz de compatibilidad

|                     | Qwiic              | STEMMA QT          | STEMMA (grande)                         | Grove              | Gravity |
| ------------------- | ------------------ | ------------------ | --------------------------------------- | ------------------ | ------- |
| **Qwiic**           | Directo            | Directo            | Adapter (mismo pin order, distinto JST) | Adapter (solo I2C) | No      |
| **STEMMA QT**       | Directo            | Directo            | Adapter (mismo pin order, distinto JST) | Adapter (solo I2C) | No      |
| **STEMMA (grande)** | Adapter            | Adapter            | Directo                                 | Adapter (solo I2C) | No      |
| **Grove**           | Adapter (solo I2C) | Adapter (solo I2C) | Adapter (solo I2C)                      | Directo            | No      |
| **Gravity**         | No                 | No                 | No                                      | No                 | Directo |

---

## Fuentes

- [Diferencia entre JST PH y SH](https://ldzy.tw/what-is-the-difference-between-jst-ph-and-sh/)
- Les Pounder, **"Stemma, Qwiic and Grove Connectors: Which is Right for You?"**, [Tom's Hardware, 24-abr-2021](https://www.tomshardware.com/features/stemma-vs-qwiic-vs-grove-connectors) - comparación oficial de los tres ecosistemas con specs originales (la mayoría de los datos de esta página vienen de este artículo)
- [Pioreactor: Using STEMMA QT](https://docs.pioreactor.com/user-guide/using-stemma-qt) - guía práctica de uso
