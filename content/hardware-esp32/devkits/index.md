---
title: "Catálogo de DevKits"
description: "Índice de todas las placas de desarrollo ESP32 documentadas, organizadas por fabricante y chip."
tags:
  - hardware-esp32
  - indice
---

# Catálogo de DevKits

Cada DevKit tiene su propia página con specs, link a doc oficial y casos de uso.

> Nota: los DevKits basados en el **ESP32 clásico**:
>
> - HUZZAH32,
> - TTGO T-Display original,
> - T-Beam v1.2,
> - Thing Plus ESP32,
> - D1 Mini ESP32, DOIT DevKit V1,
> - AI Thinker ESP-CAM,
> - FireBeetle 2 ESP32-E,
> - ESP32-DevKitC V4,
> - ESP-WROVER-KIT V4
>
> **No están documentados acá**, el ESP32 clásico tiene una vulnerabilidad de voltage glitching ([Fatal Fury / LimitedResults 2019](../../seguridad-iot/fatal-fury-esp32.md)) y los chips modernos lo reemplazan en todos los casos de uso.
>
> Si tenés que documentar uno, agregalo, pero no se recomienda.

## Espressif - oficiales

### Basados en S3

- [ESP32-S3-DevKitC-1](./espressif/esp32-s3-devkitc-1.md) - referencia oficial
- [ESP32-S3-DevKitM-1](./espressif/esp32-s3-devkitm-1.md) - formato MINI
- [ESP32-S3-BOX-3](./espressif/esp32-s3-box-3.md) - smart speaker / display
- [ESP32-S3-Korvo-2](./espressif/esp32-s3-korvo-2.md) - voice assistant

### Basados en C3

- [ESP32-C3-DevKitC-02](./espressif/esp32-c3-devkitc-02.md) - referencia oficial
- [ESP32-C3-DevKit-RUST-1](./espressif/esp32-c3-devkit-rust-1.md) - con SHTC3 + IMU integrados

### Basados en C5 / C6 / H2

- [ESP32-C5-DevKitC-1](./espressif/esp32-c5-devkitc-1.md) - WiFi 6 dual-band
- [ESP32-C6-DevKitC-1](./espressif/esp32-c6-devkitc-1.md) - WiFi 6 + 802.15.4
- [ESP32-H2-DevKitM-1](./espressif/esp32-h2-devkitm-1.md) - solo 802.15.4 (sin WiFi)

### Basados en S2 / P4

- [ESP32-S2-DevKitC-1](./espressif/esp32-s2-devkitc-1.md) - USB OTG sin BT
- [ESP32-S2-Kaluga-1](./espressif/esp32-s2-kaluga-1.md) - audio + cámara + display
- [ESP32-P4-DevKitM-2](./espressif/esp32-p4-devkitm-2.md) - compute + video
- [ESP32-P4-EYE](./espressif/esp32-p4-eye.md) - cámara AI todo-en-uno

## Adafruit - ecosistema Feather

- [Adafruit ESP32-S2 Feather](./adafruit/adafruit-feather-s2.md)
- [Adafruit ESP32-S2 TFT Feather](./adafruit/adafruit-feather-s2-tft.md)
- [Adafruit ESP32-S3 Feather (8 MB)](./adafruit/adafruit-feather-s3-8mb.md)
- [Adafruit ESP32-S3 Feather (PSRAM)](./adafruit/adafruit-feather-s3-psram.md)
- [Adafruit ESP32-S3 TFT Feather](./adafruit/adafruit-feather-s3-tft.md)
- [Adafruit ESP32-S3 Reverse TFT](./adafruit/adafruit-feather-s3-reverse-tft.md)
- [Adafruit QT Py ESP32-C3](./adafruit/adafruit-qt-py-c3.md)
- [Adafruit QT Py ESP32-S3](./adafruit/adafruit-qt-py-s3.md)

## Seeed Studio - XIAO (21x17.5 mm)

- [XIAO ESP32-C3](./seeed-xiao/xiao-esp32-c3.md)
- [XIAO ESP32-S3](./seeed-xiao/xiao-esp32-s3.md)
- [XIAO ESP32-S3 Sense](./seeed-xiao/xiao-esp32-s3-sense.md) (con cámara)
- [XIAO ESP32-C6](./seeed-xiao/xiao-esp32-c6.md)
- [XIAO ESP32-C5](./seeed-xiao/xiao-esp32-c5.md)

## LilyGo - placas con display y módulos integrados

- [T-Display S3](./lilygo/lilygo-t-display-s3.md) - IPS 1.9"
- [T-Display S3 AMOLED](./lilygo/lilygo-t-display-s3-amoled.md) - AMOLED 1.91"
- [T-Deck](./lilygo/lilygo-t-deck.md) - portátil con QWERTY + trackball

## SparkFun - ecosistema Qwiic

- [SparkFun Thing Plus ESP32-S3](./sparkfun/sparkfun-thing-plus-s3.md)
- [SparkFun Thing Plus ESP32-C6](./sparkfun/sparkfun-thing-plus-c6.md)
- [SparkFun ESP32-C6 Qwiic Pocket](./sparkfun/sparkfun-c6-qwiic-pocket.md)

## Arduino

- [Arduino Nano ESP32](./otros/arduino-nano-esp32.md) - pinout Nano clásico con S3

## Wemos / LOLIN

- [LOLIN S2 Mini](./wemos-lolin/lolin-s2-mini.md) - pinout D1 Mini con S2
- [LOLIN S3](./wemos-lolin/lolin-s3.md) - el mejor ratio specs/precio

## M5Stack

- [M5Stack Core S3](./m5stack/m5stack-core-s3.md) - display touch + cámara
- [M5StickS3](./m5stack/m5stick-s3.md) - wearable stick
- [M5Stack Tab5](./m5stack/m5stack-tab5.md) - tablet 5" con P4+C6

## Otros notables

- [DFRobot FireBeetle 2 ESP32-S3](./otros/dfrobot-firebeetle-2-esp32-s3.md)
- [Waveshare ESP32-S3-Zero](./otros/waveshare-esp32-s3-zero.md) - la más pequeña con S3
