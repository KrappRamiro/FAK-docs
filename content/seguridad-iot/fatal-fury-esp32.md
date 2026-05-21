---
title: "Fatal Fury - Voltage Glitching del ESP32 Clásico"
description: "Análisis del ataque de fault injection que extrae claves criptográficas del ESP32 clásico."
tags:
  - seguridad-iot
  - guia
  - esp32
---

# Fatal Fury - Voltage Glitching del ESP32 Clásico

Vulnerabilidad de fault injection en el **ESP32 clásico (Xtensa LX6)** descubierta por LimitedResults y publicada en dos partes durante 2019. La primera parte ([CVE-2019-15894](https://nvd.nist.gov/vuln/detail/CVE-2019-15894), septiembre) demostró cómo ejecutar firmware sin firma saltando el Secure Boot. La segunda ([CVE-2019-17391](https://nvd.nist.gov/vuln/detail/CVE-2019-17391), noviembre) fue más grave: mostró cómo extraer directamente las claves criptográficas del chip, con implicancias permanentes. A esta segunda parte se la llamó "Fatal Fury".

## Cómo el ESP32 protege sus secretos

El ESP32 almacena sus claves criptográficas en eFuses: memoria one-time programmable que se "quema" físicamente y no puede borrarse. La Flash Encryption Key (FEK) vive en el bloque BLK1 (256 bits) y la Secure Boot Key (SBK) en BLK2 (256 bits). En el bloque BLK0 hay un campo llamado `RD_DIS` que actúa como candado: cuando sus bits correspondientes están quemados, cualquier intento de leer BLK1 o BLK2 por software devuelve ceros. El contenido real nunca sale.

Ese mecanismo de read-protection es lo que Fatal Fury rompe.

## La ventana vulnerable en el boot

Cuando el ESP32 sale de reset, el bootROM (el código hardcodeado en silicon) arranca antes de que aparezca cualquier output por UART. Aproximadamente 500 µs antes del string "ets June 2018" que el chip imprime al iniciar, el controlador de eFuses se inicializa y carga los valores de los bloques, incluidos los bits de `RD_DIS`, a un buffer de memoria interno. Es en ese preciso momento, mientras el hardware está procesando esos valores, donde existe la ventana de ataque.

## El ataque

Voltage glitching es una técnica de fault injection que consiste en interrumpir brevemente la alimentación de un chip para inducir comportamiento inesperado en el silicio. En el caso de Fatal Fury, el atacante aplica un pulso de corte simultáneo en los rieles `VDD3P3_CPU` y `VDD3P3_RTC` aproximadamente 1.19 ms después del punto de trigger (el reset del chip), exactamente durante la ventana en que el controlador de eFuses carga los bits de read-protection al buffer.

El efecto es que los bits de `RD_DIS` quedan corrompidos en el buffer de hardware: el controlador pasa a tratar BLK1 y BLK2 como bloques sin protección de lectura. A partir de ese momento en el ciclo de boot, el software puede leer la FEK y la SBK directamente. LimitedResults logró dumpear ambas claves completas. El advisory de Espressif aclara que las claves a veces resultan parcialmente corrompidas por el propio glitch, pero que repitiendo el ataque y analizando los resultados se puede reconstruir el valor completo.

## El CVE-2019-15894: la vulnerabilidad previa

Aunque es anterior y menos severa en sus consecuencias directas, CVE-2019-15894 ataca una etapa diferente del boot: la verificación de la firma del bootloader. El bootROM tiene una función llamada `ets_secure_boot_check_finish` que en la dirección 0x400075B7 ejecuta un branch condicional que decide si la firma es válida. El glitch corrompe el registro `a10` durante esa instrucción, redirigiendo el flujo de ejecución directamente al entry point del bootloader (0x400807a0) sin pasar la verificación. El resultado es que el chip ejecuta firmware sin firma aunque Secure Boot esté habilitado.

## Chips afectados

Según el registro de NVD, los chips afectados son las variantes ESP32-D0WD, ESP32-D2WD, ESP32-PICO-D4 y ESP32-S0WD en revisiones de silicio anteriores a ECO V3. LimitedResults fue más contundente: "All the ESP32 are vulnerable" —refiriéndose a todos los chips de las revisiones de silicio existentes al momento de la publicación.

## La mitigación en ECO V3

El ESP32-D0WD-V3 (revisión de silicio ECO V3) incorpora chequeos adicionales en el código del bootROM para detectar que los bits de `RD_DIS` no fueron corrompidos durante la inicialización. Espressif no publicó los detalles de implementación de esos chequeos, pero el advisory oficial confirma que el ataque específico de Fatal Fury no es reproducible en V3. Además, ECO V3 introdujo [Secure Boot V2](./secure-boot.md), que opera con firma RSA-3072 y guarda sólo el digest del public key en eFuse: incluso si hubiera una lectura no autorizada de BLK1/BLK2, no habría una clave privada que extraer.

## El problema no desapareció con V3

En 2023, investigadores de Raelize y TII publicaron un bypass de Secure Boot y Flash Encryption en chips ESP32 modernos usando EMFI (electromagnetic fault injection) en lugar de voltage glitching, documentado en el advisory [AR2023-005](https://www.espressif.com/sites/default/files/advisory_downloads/AR2023-005%20Security%20Advisory%20Concerning%20Bypassing%20Secure%20Boot%20and%20Flash%20Encryption%20Using%20EMFI%20EN.pdf). Las contramedidas de ECO V3 hardenizan el ataque por voltaje en reset, pero no incluyen protecciones de hardware contra EMFI. El costo y la complejidad del ataque subieron considerablemente, pero el modelo de amenaza —atacante con acceso físico sostenido— sigue siendo válido y requiere defensa en profundidad.

Para chips de las líneas modernas ([C3](../hardware-esp32/socs/esp32-c3.md), [C6](../hardware-esp32/socs/esp32-c6.md), [H2](../hardware-esp32/socs/esp32-h2.md), [C5](../hardware-esp32/socs/esp32-c5.md), [P4](../hardware-esp32/socs/esp32-p4.md), [S2](../hardware-esp32/socs/esp32-s2.md), [S3](../hardware-esp32/socs/esp32-s3.md)), la cadena específica de Fatal Fury no aplica: usan Secure Boot V2 desde diseño y tienen una arquitectura de eFuses diferente. Pero Espressif no declara inmunidad total a fault injection en ninguno de sus chips.

## Si tenés que usar ESP32 clásico pre-ECO V3

La recomendación principal es no hacerlo para productos nuevos. Si no hay alternativa:

1. Verificar la revisión de silicio con `esptool.py` leyendo el campo `WAFER_VERSION` de los eFuses. Revisión 3 o superior tiene las contramedidas de ROM. Revisiones 0, 1 y 2 son vulnerables.
2. Habilitar Flash Encryption y Secure Boot V1 de todas formas: no eliminan la vulnerabilidad pero elevan el costo y la complejidad del ataque.
3. Considerar medidas físicas: sellado de carcasa, switches anti-apertura, detección de tampering por software.

Ninguna de estas medidas cierra el vector; sólo lo encarecen. La opción real es usar hardware moderno.

## Fuentes

- LimitedResults — [Pwn the ESP32 Secure Boot (Sep 2019, CVE-2019-15894)](https://limitedresults.com/2019/09/pwn-the-esp32-secure-boot/)
- LimitedResults — [Pwn the ESP32 Forever: Flash Encryption and Sec. Boot Keys Extraction (Nov 2019, CVE-2019-17391)](https://limitedresults.com/2019/11/pwn-the-esp32-forever-flash-encryption-and-sec-boot-keys-extraction/)
- Espressif — [Security Advisory: Fault Injection and eFuse Protections (CVE-2019-17391)](https://www.espressif.com/en/news/Security_Advisory_Concerning_Fault_Injection_and_eFuse_Protections)
- Espressif — [Security Advisory: Fault Injection and Secure Boot (CVE-2019-15894)](https://www.espressif.com/en/news/Espressif_Security_Advisory_Concerning_Fault_Injection_and_Secure_Boot)
- Espressif — [ESP32 Fault Injection Vulnerability: Impact Analysis](https://www.espressif.com/en/news/ESP32_FIA_Analysis)
- Espressif — [AR2023-005: Bypassing Secure Boot and Flash Encryption Using EMFI](https://www.espressif.com/sites/default/files/advisory_downloads/AR2023-005%20Security%20Advisory%20Concerning%20Bypassing%20Secure%20Boot%20and%20Flash%20Encryption%20Using%20EMFI%20EN.pdf)
