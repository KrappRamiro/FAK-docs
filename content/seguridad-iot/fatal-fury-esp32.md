# Fatal Fury - Voltage Glitching del ESP32 Clásico

Vulnerabilidad de fault injection en el **ESP32 clásico (Xtensa LX6)** descubierta por LimitedResults y publicada en 2019. Mitigada en el silicio ECO V3 del propio ESP32, según [advisory oficial de Espressif](https://www.espressif.com/en/news/Security_Advisory_Concerning_Fault_Injection_and_eFuse_Protections).

## Resumen

- **CVE:** [CVE-2019-17391](https://nvd.nist.gov/vuln/detail/CVE-2019-17391) - "Mask ROM Glitch Injection" (CVSS v3.1 4.6 MEDIUM, AV:P). El bug original de bypass de Secure Boot tiene CVE separado: [CVE-2019-15894](https://nvd.nist.gov/vuln/detail/CVE-2019-15894).
- **Vector:** voltage glitching - pulso de corte de voltaje en `VDD_CPU`/`VDD_RTC` poco después del reset, durante la lectura de eFuse por el bootROM. Permite corromper los bits de read-protection y leer las llaves de Flash Encryption y Secure Boot.
- **Costo de ataque:** en hardware de glitching + acceso físico al dispositivo ([fuente: InfoQ, Dic 2019](https://www.infoq.com/news/2019/12/esp32-fatal-fury/)).
- **Tiempo de ataque:** reproducible en menos de un día (misma fuente).
- **Afecta:** ESP32 clásico (Xtensa LX6) - variantes ESP32-D0WD, ESP32-D2WD, ESP32-S0WD, ESP32-PICO-D4 en revisiones de silicio anteriores a ECO V3 (lista en [NVD](https://nvd.nist.gov/vuln/detail/CVE-2019-17391)).
- **Mitigado en:** ESP32-D0WD-V3 (ECO V3) - incluye chequeos anti-glitch en ROM y Secure Boot V2 basado en RSA-3072 con sólo digest del public key en eFuse. Chips posteriores (S2, S3, C-series, H2, P4) tienen una arquitectura de seguridad distinta y Secure Boot V2 desde diseño, pero Espressif no se pronuncia explícitamente sobre inmunidad total a esta clase de ataques en su [Impact Analysis](https://www.espressif.com/en/news/ESP32_FIA_Analysis); ver también [AR2023-005 (EMFI bypass de chips modernos)](https://www.espressif.com/sites/default/files/advisory_downloads/AR2023-005%20Security%20Advisory%20Concerning%20Bypassing%20Secure%20Boot%20and%20Flash%20Encryption%20Using%20EMFI%20EN.pdf).

## Capacidades del atacante (en chips afectados)

- Bypass completo de las protecciones de seguridad
- Implantación de malware persistente vía eFuse (memoria one-time programmable) - **no removible por software updates**
- Extracción de claves criptográficas
- El dispositivo aparenta funcionar normalmente mientras está comprometido

## Lecturas oficiales y de la industria

- LimitedResults - [Pwn the ESP32 Secure Boot (Sep 2019, CVE-2019-15894)](https://limitedresults.com/2019/09/pwn-the-esp32-secure-boot/) y [Pwn the ESP32 Forever: Flash Encryption and Sec. Boot Keys Extraction (Nov 2019, CVE-2019-17391)](https://limitedresults.com/2019/11/pwn-the-esp32-forever-flash-encryption-and-sec-boot-keys-extraction/) - disclosure original.
- InfoQ - [ESP32 "Fatal Fury" article (Dec 2019)](https://www.infoq.com/news/2019/12/esp32-fatal-fury/)
- Espressif Security Advisory - [Concerning Fault Injection and eFuse Protections (CVE-2019-17391)](https://www.espressif.com/en/news/Security_Advisory_Concerning_Fault_Injection_and_eFuse_Protections) y [Concerning Fault Injection and Secure Boot (CVE-2019-15894)](https://www.espressif.com/en/news/Espressif_Security_Advisory_Concerning_Fault_Injection_and_Secure_Boot)
- Espressif Impact Analysis - [ESP32 Fault Injection Vulnerability - Impact Analysis](https://www.espressif.com/en/news/ESP32_FIA_Analysis)

## Implicancias para diseños nuevos

Para chips modernos (la línea RISC-V: [C3](../hardware/socs/esp32-c3.md), [C6](../hardware/socs/esp32-c6.md), [H2](../hardware/socs/esp32-h2.md), [C5](../hardware/socs/esp32-c5.md), [P4](../hardware/socs/esp32-p4.md) y los Xtensa LX7: [S2](../hardware/socs/esp32-s2.md), [S3](../hardware/socs/esp32-s3.md)), la cadena específica de Fatal Fury (eFuse read-protection + bootROM del ESP32 clásico) **no aplica tal cual**. Estos chips:

- Usan [Secure Boot V2](./ota-firmado.md) con firma RSA-3072 desde diseño (algunas líneas también soportan ECDSA P-256)
- Tienen Flash Encryption con XTS-AES-128/256
- Implementan contramedidas anti-glitch en el flujo de boot

Aclaración: que esta clase específica no aplique no significa "inmunidad total". El advisory [AR2023-005](https://www.espressif.com/sites/default/files/advisory_downloads/AR2023-005%20Security%20Advisory%20Concerning%20Bypassing%20Secure%20Boot%20and%20Flash%20Encryption%20Using%20EMFI%20EN.pdf) describe un bypass por EMFI (electromagnetic fault injection) que sí afectó algunas variantes modernas. El umbral de costo/skill subió, pero el modelo de "atacante con acceso físico sostenido" sigue requiriendo defensa en profundidad.

## Razones para no usar ESP32 clásico en diseños nuevos

1. **Fatal Fury** - chips pre-ECO V3 vulnerables a glitching (los chips en stock viejo en AliExpress podrían ser pre-ECO V3).
2. **ADC2 conflicto con WiFi** - limitación funcional histórica que no existe en chips modernos.
3. **Xtensa LX6 con register windows complejas** - debug menos predecible que RISC-V o LX7.
4. **Roadmap** - Espressif ya no agrega features al clásico; toda la inversión va a chips nuevos.

Por estas razones, este repo **no documenta el ESP32 clásico** ni los DevKits basados en él (HUZZAH32, TTGO T-Display original, T-Beam v1.2, Thing Plus ESP32, D1 Mini ESP32, DOIT DevKit V1, AI Thinker ESP-CAM, FireBeetle 2 ESP32-E, ESP32-DevKitC V4, ESP-WROVER-KIT V4).

## Si tenés que usar ESP32 clásico de todos modos

Pasos para mitigar Fatal Fury en chips pre-ECO V3:

1. **Verificar la revisión de silicio**: leer eFuse `WAFER_VERSION` con `esptool.py`. Versión 3 o superior tiene las contramedidas. Versiones 0-2 son vulnerables.
2. **Asumir compromiso físico:** si el dispositivo cae en manos hostiles por > 1 día, considerarlo potencialmente comprometido.
3. **Usar Flash Encryption + Secure Boot V1 al máximo**: no garantiza inmunidad pero eleva el costo del ataque.
4. **Detección de tampering**: tornillos con sello, switches anti-apertura, geolocalización del dispositivo.

Estos pasos son trabajosos comparados con simplemente **usar un chip moderno**, que es la razón por la que este repo no los detalla más.
