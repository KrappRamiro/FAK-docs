# Nodo Sensor Ambiental

Mide temperatura, humedad, CO2 y [PAR](../sensores/luz/conceptos-par.md) del aire del invernadero. No controla nada, solo reporta.

## Hardware

| Componente | Cantidad | Notas |
|---|---|---|
| [ESP32-C3-DevKitC-02](../hardware/devkits/espressif/esp32-c3-devkitc-02.md) (alternativa: cualquier DevKit S3) | 1 | WiFi + I2C + UART alcanza |
| [SHT40](../sensores/temperatura-humedad/sht40.md) (control) **o** [SHT45-AD1F-R2](../sensores/temperatura-humedad/sht45.md) (referencia) | 1 | I2C @ 0x44, filtro PTFE en F |
| [MH-Z19B](../sensores/co2/mh-z19b.md) (control) **o** [SCD41](../sensores/co2/scd41.md) (referencia) | 1 | UART ([MH-Z19B](../sensores/co2/mh-z19b.md)) o I2C @ 0x62 ([SCD41](../sensores/co2/scd41.md)) |
| [BH1750](../sensores/luz/bh1750.md) (control) **o** [AS7341](../sensores/luz/as7341.md) + level shifter (referencia) | 1 | I2C |
| [LM2596S](../electronica/potencia/lm2596s.md) | 1 | 12V $\rightarrow$ 5V para alimentar el nodo |
| Capacitor cerámico 100nF | 3 | Desacople de cada sensor I2C |
| Capacitor electrolítico $100\,\mu\text{F}$ | 1 | Filtrado de entrada 5V |
| Resistencias pull-up $10\,\text{k}\Omega$ | 2 | SDA + SCL |
| Cable 24 [AWG](../electronica/cables-awg.md) | - | Señales |

> El sensor de temp/humedad debe ir **en cable fuera del gabinete** o con radiation shield. El error real de temperatura del aire viene de la radiación solar sobre la caja y de la falta de ventilación, no del autocalentamiento del chip a 30 cm de distancia.

## Cableado I2C (compartido entre SHT45, SCD41 y AS7341)

```
ESP32-C3 ┐
GPIO5 ───┴─── SDA ────┬───┬───┬─── SHT45 SDA
 │ │ │
 │ │ └─── SCD41 SDA
 │ │
 │ └─────── AS7341 SDA
 │
 [10kΩ] pull-up a 3.3V
 │
 └─── (mismo conductor)

GPIO6 ────── SCL ────┬───┬───┬─── SHT45 SCL (idem)
 │
 [10kΩ] pull-up a 3.3V

3.3V ────── ► VDD de los 3 sensores
GND ────── ► GND de los 3 sensores
```

> Cada sensor I2C debería tener su capacitor 100nF cerámico entre VDD y GND lo más cerca posible del chip.

## Cableado MH-Z19B (si lo usás en vez de SCD41)

```
ESP32-C3 GPIO21 (TX) ──── MH-Z19B RX
ESP32-C3 GPIO20 (RX) ──── MH-Z19B TX
5V desde LM2596S ──── MH-Z19B Vin (NO desde 3.3V del DevKit)
GND ──── MH-Z19B GND
```

> El [MH-Z19B](../sensores/co2/mh-z19b.md) consume hasta 150 mA en pico. Alimentar desde el [LM2596S](../electronica/potencia/lm2596s.md) directamente, **no desde el regulador del DevKit**.

## Firmware - estructura

```c
// app_main.c (esquemático)
void app_main(void) {
 nvs_flash_init();
 secrets_load_from_nvs(); // WiFi + MQTT creds

 wifi_init_sta();
 wait_for_ip();

 mqtt_start(); // TLS + auth

 i2c_master_init();
 sht45_init();
 scd41_init();
 as7341_init();

 while (1) {
 float t, h;
 sht45_read(&t, &h);

 uint16_t co2;
 float t_scd, h_scd;
 scd41_read(&co2, &t_scd, &h_scd);

 as7341_read_channels_t spectrum;
 as7341_read_all(&spectrum);
 float ppfd = compute_ppfd(&spectrum);

 publish_environmental(t, h, co2, ppfd);

 vTaskDelay(pdMS_TO_TICKS(60000)); // 1 lectura/min
 }
}
```

## Topics publicados

| Topic | Frecuencia | Contenido |
|---|---|---|
| `greenhouse/zone-A/sht45/data` | 1/min | `{"ts","temp_c","humidity_pct"}` |
| `greenhouse/zone-A/scd41/data` | 1/min | `{"ts","co2_ppm","temp_c","humidity_pct"}` |
| `greenhouse/zone-A/as7341/data` | 1/min | `{"ts","ppfd","ndvi","F1..F8","NIR","Clear"}` |
| `greenhouse/zone-A/node/heartbeat` | 1/min | `{"ts","uptime_s","rssi_dbm","free_heap_b","fw_version"}` |

## Ubicación física en el invernadero

- A **1.5-2 m del suelo** (zona de copa de planta media)
- **Sensor de temp/HR afuera del gabinete**, con cable de 30 cm+ - el gabinete cerrado se calienta, lecturas reales se hacen al aire ventilado
- **Sombreado** del sol directo (la caja al sol mete +5-$10\,°\text{C}$; usar radiation shield si vas en serio)
- **Lejos de motores, ventiladores y bombas** (ruido eléctrico)
- **Gabinete IP54** mínimo, ventilado pero protegido de salpicaduras
- Cable de alimentación 12V con conduit hasta el gabinete

## Calibración inicial - checklist

- [ ] [SHT45](../sensores/temperatura-humedad/sht45.md): instalar junto a un higrómetro de referencia (psicrómetro o sensor certificado) durante 24h $\rightarrow$ calcular offset si > $\pm 1\%$ RH
- [ ] [MH-Z19B](../sensores/co2/mh-z19b.md): **desactivar ABC** vía UART antes de instalar (ver [`../sensores/mh-z19b.md`](../sensores/co2/mh-z19b.md))
- [ ] [SCD41](../sensores/co2/scd41.md): factory calibration suele ser válida - verificar contra una bocanada de aire exterior (~400 ppm) si tenés acceso al exterior
- [ ] [AS7341](../sensores/luz/as7341.md): calibrar contra [Apogee SQ-500](../sensores/luz/apogee-sq-500.md) si vas a usar el dato para paper. Si es solo monitoreo, usar coeficientes default del datasheet de Hegemann et al. 2022

## Trampas frecuentes

| Problema | Causa | Fix |
|---|---|---|
| Temp lee 5-$10\,°\text{C}$ más alta que la real | Caja al sol, sensor mal posicionado | Radiation shield + sensor en cable fuera del gabinete |
| HR siempre 100% | Condensación sobre el sensor | Usar SHT4x con filtro PTFE ([SHT45-AD1F-R2](../sensores/temperatura-humedad/sht45.md)) |
| CO2 deriva en semanas | ABC del [MH-Z19B](../sensores/co2/mh-z19b.md) activado | Comando UART para desactivar (ver doc CO2) |
| [PAR](../sensores/luz/conceptos-par.md) no correlaciona con luz aparente | Usás [BH1750](../sensores/luz/bh1750.md) con LEDs de cultivo | Migrar a [AS7341](../sensores/luz/as7341.md) (ver doc [PAR](../sensores/luz/conceptos-par.md)) |
| Nodo deja de publicar después de 1h | WiFi reconnect mal manejado | Buffer en RAM + reintento, no `delay()` |
