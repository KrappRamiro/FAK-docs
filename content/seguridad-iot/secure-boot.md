---
title: "Secure Boot V2"
description: "Cadena de verificación criptográfica del ESP32 que impide ejecutar firmware no autorizado."
tags:
  - seguridad-iot
  - guia
  - esp32
---

# Secure Boot V2

Sin ninguna protección, el ESP32 ejecuta cualquier firmware que encuentre en la flash. Un atacante con acceso físico al chip —o con capacidad de escribir en la flash de otra forma— puede reemplazar el firmware por uno malicioso y el chip lo va a correr sin objeción. Secure Boot V2 resuelve esto estableciendo una cadena de verificación criptográfica antes de ejecutar cualquier código.[^1]

Secure Boot V2 está disponible en ESP32 desde la revisión de silicio v3.0 en adelante. Para revisiones anteriores existe Secure Boot V1, pero Espressif recomienda V2 siempre que el chip lo soporte.

## Cómo funciona la cadena de verificación

El proceso ocurre en dos etapas cada vez que el chip arranca.[^1]

La primera etapa la ejecuta el ROM del chip —código hardcodeado en silicio que no puede modificarse. El ROM lee el bootloader desde la flash, verifica su firma RSA-PSS, y solo si la verificación pasa le transfiere el control. Si falla, el boot se aborta.

La segunda etapa la ejecuta el bootloader. Hace exactamente lo mismo con la imagen de la aplicación: verifica la firma RSA-PSS y solo si pasa la ejecuta. Si la imagen activa falla la verificación, el bootloader busca otra imagen en las [particiones OTA](ota.md) disponibles y repite el proceso. Si no encuentra ninguna válida, aborta.

El resultado es que ningún código sin firma válida puede correr en el chip, en ninguna etapa del boot.

## Qué vive en eFuse

Lo que se burna en eFuse no es la clave pública en sí —son 3072 bits y eFuse no tiene tanto espacio. Lo que se guarda es un SHA-256 digest de 32 bytes calculado sobre la clave pública (específicamente sobre el módulo RSA, el exponente, y dos valores precalculados).[^1]

Cuando el ROM o el bootloader verifican una firma, toman la clave pública que viene embebida en el bloque de firma del binario, calculan su SHA-256, y lo comparan contra el digest guardado en eFuse. Si no coincide, rechazan el binario. Esto impide que alguien genere su propio par de claves y firme con él —la clave pública tiene que ser exactamente la que corresponde al digest en eFuse.

La clave privada nunca toca el chip. Vive en la máquina de desarrollo o, para producción, en un servidor de firma dedicado. Si se pierde, no hay forma de firmar nuevo firmware para los chips ya configurados.

En el ESP32 v3.0, el eFuse que almacena este digest es BLK2, y solo puede guardarse un digest (una sola clave pública).

## Cuándo se quema el eFuse

El eFuse de Secure Boot **no se quema al flashear el bootloader**. Se quema en el primer boot exitoso, cuando el bootloader encuentra una partición table válida y una imagen de aplicación válida en la flash.[^1]

Esto es relevante para la recuperación: si algo sale mal en el setup inicial y el chip boot-loopea antes de que el eFuse se haya quemado, esptool.py puede conectarse normalmente y reflashear. El punto de no retorno es el primer boot exitoso con Secure Boot habilitado.

## JTAG y UART download mode

Cuando Secure Boot se activa en el primer boot, el bootloader deshabilita JTAG automáticamente quemando el eFuse correspondiente.[^1] No es una opción —pasa siempre.

UART download mode es distinto. Es el modo por el cual el ROM escucha por serial (con GPIO0 en GND) y permite que esptool.py escriba en la flash directamente, sin pasar por el bootloader. Este modo **no se deshabilita automáticamente** al activar Secure Boot —queda habilitado por default para no bloquearse accidentalmente durante el desarrollo. Deshabilitarlo es un paso explícito en menuconfig.[^1]

La consecuencia práctica: si UART download mode está habilitado y el chip queda en un estado inválido post-activación, esptool.py puede conectarse por serial y flashear una versión corregida (que tiene que estar firmada con la clave correcta para que el bootloader la acepte). Si UART download mode fue deshabilitado —lo que recomienda Espressif para producción— no hay forma de conectarse al chip por ningún método documentado.

## Buenas prácticas según Espressif[^1]

La documentación oficial lista explícitamente:

- Usar Secure Boot junto con Flash Encryption. Sin Flash Encryption, es posible un ataque de time-of-check to time-of-use: reemplazar el contenido de la flash después de que la firma fue verificada pero antes de que el código corra.
- Deshabilitar UART download mode para producción.
- Deshabilitar el intérprete BASIC del ROM.
- Generar la clave de firma en un sistema con una fuente de entropía de calidad.
- Mantener la clave privada privada. Una filtración compromete todo el sistema de Secure Boot.

## Referencias

[^1]: Espressif — [Secure Boot V2 (ESP32)](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/security/secure-boot-v2.html)
