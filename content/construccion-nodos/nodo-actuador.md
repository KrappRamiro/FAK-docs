# Nodo Actuador

Activa bombas, electroválvulas, ventiladores y luces. Recibe comandos vía [MQTT](../conectividad/mqtt-stack.md), ejecuta acciones físicas, reporta el estado.

## Hardware

| Componente | Cantidad | Notas |
|---|---|---|
| [ESP32-C3-DevKitC-02](../hardware/devkits/espressif/esp32-c3-devkitc-02.md) | 1 | WiFi + GPIO es todo lo que necesitamos |
| Módulo relay 5V optoacoplado | 1-4 | Uno por actuador, 10A 250VAC capacidad |
| Diodo [1N4007](../electronica/diodos/1n4007.md) | 1 por carga inductiva | **Flyback obligatorio** en bobina de bomba/válvula |
| Transistor [2N2222](../electronica/transistores/2n2222.md) + R $1\,\text{k}\Omega$ | 1 por relay (si fuera necesario) | El módulo relay optoacoplado ya viene con el transistor adentro |
| [LM2596S](../electronica/potencia/lm2596s.md) | 1 | 12V $\rightarrow$ 5V para nodo + para módulo relay |
| Capacitor electrolítico $100\,\mu\text{F}$ | 1 | Filtrado entrada 5V |
| LED + R $220\,\Omega$ | 2 | Verde = activo, rojo = falla |

## Diagrama del circuito de potencia

```
Fuente 12V ────┬──────────────────┐
 │ │
 │ │ (+)
 [LM2596S] [Bomba 12V o Electroválvula 12V]
 │ │ (−)
 │ 5V │
 │ │
 ▼ │
 [MB102] │
 │ 5V/3.3V │
 ▼ │
 [ESP32-C3] │
 │ │
 │ GPIO [Relay 5V Opto]
 └─────────► IN COM ───────┐
 VCC NO o NC ──┐
 GND │
 ▼ (+12V switched)
 ──►├─ 1N4007 (flyback)
 │
 (carga)
 │
 (−12V común)
```

## Cableado paso a paso

1. **Línea de tierra común** entre fuente 12V, [LM2596S](../electronica/potencia/lm2596s.md), [MB102](../electronica/potencia/mb102.md) y [ESP32](../hardware/socs/index.md) - todas las GND conectadas
2. **[LM2596S](../electronica/potencia/lm2596s.md) configurado a 5V** (ajustar con potenciómetro multivuelta + multímetro antes de conectar el [ESP32](../hardware/socs/index.md))
3. **[ESP32](../hardware/socs/index.md) alimentado por 5V** del [MB102](../electronica/potencia/mb102.md) (no por USB del DevKit cuando el nodo está en producción)
4. **Módulo relay alimentado** por 5V del [MB102](../electronica/potencia/mb102.md)
5. **Bobina del relay** se activa con GPIO del [ESP32](../hardware/socs/index.md) vía el optoacoplador
6. **Contactos NO/NC del relay** intercambian la línea de 12V hacia la bomba/válvula
7. **Diodo flyback [1N4007](../electronica/diodos/1n4007.md)** en antiparalelo con la bobina de la bomba/válvula (NO del relay - el relay ya lo trae)

## Trigger del relay - verificar HIGH vs LOW

Algunos módulos chinos activan con LOW (lógica inversa). Probar al recibir el módulo:

```c
gpio_set_direction(RELAY_GPIO, GPIO_MODE_OUTPUT);
gpio_set_level(RELAY_GPIO, 0);
vTaskDelay(pdMS_TO_TICKS(2000));
gpio_set_level(RELAY_GPIO, 1);
vTaskDelay(pdMS_TO_TICKS(2000));
```

Si el relay hace clic al pasar de LOW a HIGH, es High Trigger (la mayoría). Si hace clic al revés, es Low Trigger.

## Firmware - control y feedback

```c
// app_main.c
#define RELAY_PUMP_A_GPIO 4

void app_main(void) {
 nvs_flash_init();
 secrets_load_from_nvs();
 wifi_init_sta();
 mqtt_start();

 gpio_set_direction(RELAY_PUMP_A_GPIO, GPIO_MODE_OUTPUT);
 gpio_set_level(RELAY_PUMP_A_GPIO, 0); // start with pump OFF

 mqtt_subscribe("greenhouse/zone-A/actuator/pump-1/cmd",
 on_pump_cmd, NULL);

 // heartbeat + state publish loop
 while (1) {
 publish_pump_state(RELAY_PUMP_A_GPIO);
 publish_heartbeat();
 vTaskDelay(pdMS_TO_TICKS(60000));
 }
}

void on_pump_cmd(const char *payload, size_t len) {
 // payload: {"action":"ON","duration_s":30}
 // o: {"action":"OFF"}
 cJSON *json = cJSON_ParseWithLength(payload, len);
 const char *action = cJSON_GetObjectItem(json, "action")->valuestring;

 if (strcmp(action, "ON") == 0) {
 int duration = cJSON_GetObjectItem(json, "duration_s")->valueint;

 // Validar input - duración 1-600 s
 if (duration < 1 || duration > 600) {
 ESP_LOGW(TAG, "Duration out of range: %d", duration);
 cJSON_Delete(json);
 return;
 }

 gpio_set_level(RELAY_PUMP_A_GPIO, 1);
 publish_pump_state(RELAY_PUMP_A_GPIO);

 // Auto-off con timer
 esp_timer_start_once(pump_off_timer, duration * 1000000ULL);

 } else if (strcmp(action, "OFF") == 0) {
 gpio_set_level(RELAY_PUMP_A_GPIO, 0);
 publish_pump_state(RELAY_PUMP_A_GPIO);
 }

 cJSON_Delete(json);
}
```

### Validación de input - crítico

Los comandos llegan por [MQTT](../conectividad/mqtt-stack.md), lo cual significa que **cualquiera con credenciales al broker puede mandarlos**. Validar siempre:

- `duration_s` está en un rango razonable (1-600 s). Sin validación, un comando con `duration_s: 86400` deja la bomba encendida 24 h y arruina la cosecha.
- `action` es uno de los valores esperados (`ON`, `OFF`).
- Rechazar payloads malformados, no asumir.

Trustear el broker con credenciales fuertes no exime de validar inputs - defense in depth.

## Topics

| Dirección | Topic | Contenido |
|---|---|---|
| Subscribir | `greenhouse/zone-A/actuator/pump-1/cmd` | `{"action":"ON","duration_s":30}` |
| Publicar | `greenhouse/zone-A/actuator/pump-1/state` | `{"ts","state":"ON","duration_s_remaining":15}` |
| Publicar | `greenhouse/zone-A/node/heartbeat` | Heartbeat estándar |

## Auto-off "deadman" - protección crítica

Si el nodo pierde conexión con el broker, **debe apagar la bomba automáticamente** después de un timeout configurable. Sin esto, una bomba encendida con WiFi caído puede inundar el invernadero.

```c
static int64_t last_keepalive_us = 0;

void mqtt_event_handler(...) {
 if (event_id == MQTT_EVENT_DATA || event_id == MQTT_EVENT_CONNECTED) {
 last_keepalive_us = esp_timer_get_time;
 }
}

void deadman_task(void *arg) {
 while (1) {
 int64_t now = esp_timer_get_time;
 if ((now - last_keepalive_us) > 5 * 60 * 1000000LL) {
 // 5 min sin keepalive - apagar todo
 ESP_LOGW(TAG, "Deadman triggered, shutting off actuators");
 gpio_set_level(RELAY_PUMP_A_GPIO, 0);
 }
 vTaskDelay(pdMS_TO_TICKS(10000));
 }
}
```

## Trampas

| Problema | Causa | Fix |
|---|---|---|
| El [ESP32](../hardware/socs/index.md) se reinicia cuando arranca la bomba | Pico de corriente colapsa la fuente | [LM2596S](../electronica/potencia/lm2596s.md) con capacitor $1000\,\mu\text{F}$ en salida; o fuente separada para bomba |
| El relay queda pegado activo | Sin flyback en la carga inductiva | [1N4007](../electronica/diodos/1n4007.md) en antiparalelo (sin esto, los contactos del relay se sueldan por arco eléctrico) |
| La bomba pulsa rápidamente | Lógica de control rebota | Debounce mínimo 1s entre cambios de estado |
| Bomba sigue encendida después de comando OFF | Lógica invertida del relay (Low Trigger) | Cambiar la lógica de GPIO o invertir el cableado del relay |
| Comandos [MQTT](../conectividad/mqtt-stack.md) no llegan | Topic subscrito antes de mqtt_connected | Suscribir dentro del callback `MQTT_EVENT_CONNECTED` |
