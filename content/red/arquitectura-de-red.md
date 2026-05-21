---
title: "Arquitectura de Red del Invernadero"
description: "Descripción de la topología de red y los desafíos de RF en el entorno del invernadero."
tags:
  - red
  - referencia
  - wifi
---

# Arquitectura de Red del Invernadero

## Por qué el invernadero es hostil para WiFi

- **Estructura metálica** (caños, perfiles, malla anti-granizo) atenúan la señal 2.4 GHz agresivamente
- **Humedad alta y constante** - el agua absorbe RF, especialmente en 2.4 GHz
- **Plantas densas** - absorción adicional, varía con el crecimiento
- **Motores y bombas** - ruido eléctrico que puede interferir con el radio

Un [ESP32](../hardware-esp32/socs/index.md) con antena PCB en estas condiciones puede tener alcance efectivo de **5-10 m** en vez de los 50 m teóricos al aire libre. Detalle en [`wifi-en-invernadero.md`](./wifi-en-invernadero.md).

---

## Escenario A - WiFi directo con antena externa

Válido hasta ~**60-70 m** con estructura metálica.

- Mismo router WiFi existente
- DevKits con módulo variante `U` (conector U.FL) + antena externa

**Ventajas:** sin infraestructura extra, setup simple.
**Desventajas:** Hay que adaptar los PCBs para que usen antenas externas

---

## Escenario B - WiFi mesh

**2-3 APs mesh distribuidos** en el invernadero alimentados con 220V.

- Los nodos [ESP32](../hardware-esp32/socs/index.md) se conectan al AP más cercano y el mesh se encarga del handoff
- Los [ESP32](../hardware-esp32/socs/index.md) **no necesitan nada especial:** para ellos es un WiFi normal
- Permite usar antena PCB estándar en los DevKits (AP cercano a pocos metros)

**Ventajas:** Simplifica el setup a nivel ESP32, y es un poco mas robusto
**Desventajas:** Es caro, y tenes el overhead de tener que armar una red WiFi Mesh lo cual le agrega complejidad

---

## Escenario C - LoRa para distancias > 100 m o múltiples invernaderos

Para distancias > 100 m o estructuras separadas donde WiFi no alcanza.

- [ESP32](../hardware-esp32/socs/index.md) + setup con [LoRa](lora.md)

> [LoRa](lora.md) tiene muy bajo ancho de banda (~50 kbps max), por lo que solo sirve para telemetría.
> No es apto para cámara o streaming. Para cámara en este escenario hay que usar WiFi local separado.

Detalle en [LoRa](./lora.md).

---


## Consideraciones de ambiente hostil

| Problema | Mitigación |
|---|---|
| Humedad sobre PCB | Gabinete IP54+, conformal coating en zonas críticas |
| Temperatura > 50 $^\circ\text{C}$ en techo | Ubicar nodos a 1-1.5 m del suelo, no en el techo |
| Electrólisis por humedad + corriente DC en suelo | Sensores capacitivos (no resistivos), y considerar aislamiento galvánico para la electrónica de potencia |
| Roedores comiendo cables | Conduit metálico para las líneas principales |
