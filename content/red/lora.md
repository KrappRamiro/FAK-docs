# LoRa / LoRaWAN

Para distancias > 100 m o múltiples estructuras separadas donde WiFi no alcanza.

## Specs básicas

| Aspecto | Valor |
|---|---|
| Alcance | **1-15 km en campo abierto**, 200-500 m con obstrucciones |
| Velocidad | **~250 bps a 50 kbps** - solo telemetría |
| Cámara o streaming | **No apto** |

### LoRa vs LoRaWAN

- **LoRa** - la modulación de radio.
- **LoRaWAN** - protocolo de red sobre LoRa


---

## Frecuencia a usar

- Band/Channels: 915-928 Mhz (segun la tabla del PDF: _Regulations imply 902-928 MHz, but only 915-928 MHz is available_)
- Channel Plan: AU915-928


Para verificar: [LoRa Alliance Regional Parameters RP002-1.0.4](https://resources.lora-alliance.org/technical-specifications/rp002-1-0-4-regional-parameters), sección 1.2 Country Cross Reference Table.

---

## ESP32 + módulo LoRa

El [ESP32](../hardware-esp32/socs/index.md) no tiene LoRa integrado; se agrega como módulo externo.



---


> ⚠️ **No mandar lecturas en texto claro por LoRa.** Aunque LoRa no sea "internet", el radio se intercepta
> Encriptar el payload! Para producción seria, rotar clave periódicamente vía [OTA](../seguridad-iot/ota-firmado.md).
