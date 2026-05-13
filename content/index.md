---
title: Inicio
description: Documentacion para el proyecto FAK
---

# Proyecto Invernadero ESP32 - Base de Conocimiento

Sistema de automatización + investigación agronómica con [ESP32](hardware/socs/index.md). Doble objetivo: control de riego/clima y datos para publicación con peer review.

## Cómo leer este repo

Carpetas numeradas. Si arrancás de cero, leelas en orden. Si buscás algo concreto, andá directo a la carpeta.

| Carpeta | Cuándo abrirla |
|---|---|
| [`empezar-aca/`](./empezar-aca/) | Primera vez con el proyecto. Glosario, inventario, primer blink. |
| [`hardware/`](./hardware/) | "¿Qué chip uso? ¿Qué DevKit compro?" |
| [`electronica/`](./electronica/) | Antes de cablear: resistencias, diodos, transistores, relays. |
| [`sensores/`](./sensores/) | "Quiero medir X - ¿qué sensor compro?" |
| [`conectividad/`](./conectividad/) | WiFi, [LoRa](conectividad/lora.md), [MQTT](conectividad/mqtt-stack.md). |
| [`construccion-nodos/`](./construccion-nodos/) | Recetas armadas por rol de nodo. |
| [`herramientas/`](./herramientas/) | Estación de soldado, multímetro. |
| [`seguridad-iot/`](./seguridad-iot/) | Secrets, [MQTT](conectividad/mqtt-stack.md) TLS, [OTA](seguridad-iot/ota-firmado.md) firmado. Antes de poner esto en producción. |
| [`investigacion/`](./investigacion/) | Metodología, [calibración cruzada](investigacion/calibracion-cruzada.md), qué pide un reviewer. |

## Qué contiene cada carpeta

Este repo es una base de referencia: chips, módulos, componentes, sensores, conectividad y consideraciones de investigación. **No prescribe** qué chip ni qué sensor usar - recopila información, recomendaciones y trade-offs para que vos decidas.

Las decisiones concretas del proyecto (qué stack usás, qué chip va en cada rol, etc.) viven en [`PROMPT-CLAUDE-CODE.md`](./PROMPT-CLAUDE-CODE.md), que es donde el dueño del proyecto las anota.

## Tipos de información acá

| Qué encontrás | Dónde |
|---|---|
| Specs de chips ESP32 y comparativas | [hardware/socs/](hardware/socs/index.md), [hardware/devkits.md](hardware/devkits.md) |
| Catálogo de DevKits por fabricante | [hardware/devkits/](hardware/devkits/index.md) |
| Specs de sensores (T/HR, CO2, PAR, suelo, pH) | [sensores/](sensores/) |
| Specs de componentes pasivos y módulos de potencia | [electronica/](electronica/) |
| Frameworks de firmware (ESP-IDF, Arduino, etc.) | [hardware/frameworks.md](hardware/frameworks/index.md) |
| Protocolos y arquitecturas de red | [conectividad/](conectividad/) |
| Recetas típicas de nodos por rol | [construccion-nodos/](construccion-nodos/) |
| Consideraciones de seguridad IoT | [seguridad-iot/](seguridad-iot/) |
| Metodología para publicación con peer review | [investigacion/](investigacion/) |

## Para arrancar sesión con Claude Code

Usar [`PROMPT-CLAUDE-CODE.md`](./PROMPT-CLAUDE-CODE.md) como primer mensaje. Ese archivo describe el proyecto, lista las decisiones tomadas por el dueño y le indica a Claude que use este repo como base de conocimiento.
