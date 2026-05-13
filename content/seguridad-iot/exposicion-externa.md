# Exposición Externa - Cuándo y Cómo

> Regla simple: **el broker [MQTT](../conectividad/mqtt-stack.md), [InfluxDB](../conectividad/mqtt-stack.md) y [Grafana](../conectividad/mqtt-stack.md) viven en LAN. Punto.**

Cuando necesites acceso desde afuera (revisar el invernadero desde el celular en vacaciones, integrar con Apple Home, mostrar dashboards a un colaborador), hay maneras seguras y maneras peligrosas. Esta página es para no caer en las peligrosas.

---

## Lo que NO hacer

### ✗ Abrir puerto 8883 al WAN

Aunque el broker tenga TLS + auth, exponerlo al WAN:
- Lo indexa Shodan en ~24h
- Aparece en listas de targets para bruteforce
- Cualquier vulnerabilidad futura de [Mosquitto](../conectividad/mqtt-stack.md) se vuelve explotable de inmediato

### ✗ Reenvío de puerto del router

Mismo problema. El router NAT no es un firewall, es una traducción de direcciones. Una vez abierto el puerto, cualquier IP de internet puede hablar con el servicio.

### ✗ "Free" túneles públicos (ngrok free tier, etc.)

- URLs públicas $\rightarrow$ indexables
- Auth del túnel separada de la auth del broker
- Logs de la sesión visibles para el proveedor
- Sin auditoría de quién accedió

---

## Lo que SÍ hacer

### Opción 1: VPN al LAN (recomendada)

Setup de **WireGuard** o **Tailscale** en el servidor del invernadero:

- WireGuard self-hosted: gratis, fast, requiere setup técnico
- **Tailscale: gratis para uso personal, zero-config, basado en WireGuard, recomendado para hobby**
- Open VPN: legacy, más complicado

Con Tailscale:

1. Instalar `tailscaled` en el servidor:
 ```bash
 curl -fsSL https://tailscale.com/install.sh | sh
 sudo tailscale up
 ```
2. Instalar Tailscale en tu celular y laptop
3. Listo - tu celular tiene IP `100.x.x.x` dentro de la red Tailscale, puede hablar con el broker como si estuvieras en LAN

**Ventajas:**
- Cero puertos abiertos al WAN
- Auth de Tailscale (Google/Apple/Microsoft sign-in)
- Auditable: ves qué dispositivos están conectados
- Si te roban el celular, revocás el peer en 10s

### Opción 2: Bastion / Jump Host (solo para multi-usuario)

Si querés que **otros colaboradores** accedan sin pasarles tu Tailscale:

- VPS chico como bastion
- SSH al bastion con tu clave, túnel SSH al broker LAN
- Otros usuarios reciben su propio acceso al bastion, sin tocar tu LAN directamente

### Opción 3: Cloudflare Tunnel / Inlets / FRP

Túnel reverso desde tu LAN al exterior, sin abrir puertos.

- **Cloudflare Tunnel**: gratis, fácil, pero Cloudflare ve el tráfico (TLS terminated en Cloudflare). No ideal si los datos son sensibles del paper.
- **Inlets** o **FRP**: self-hosted, requieren su propio VPS

---

## Casos típicos del proyecto

### Caso A: "Quiero ver Grafana desde el celular en cualquier lado"

$\rightarrow$ **Tailscale en el server + Tailscale en el celular.** Cero puertos abiertos. [Grafana](../conectividad/mqtt-stack.md) sigue en `localhost:3000` del servidor, accedido por `http://100.x.x.x:3000` vía VPN.

### Caso B: "Quiero integrar con Apple Home / Google Home"

$\rightarrow$ **[Home Assistant](../conectividad/mqtt-stack.md) en el servidor + Nabu Casa.** Nabu Casa maneja el túnel inverso de manera segura. La integración con Apple/Google funciona sin abrir puertos.

Alternativa gratis: HomeKit local sin internet - funciona dentro de la LAN sin abrir nada. Sólo perdés acceso "fuera de casa".

### Caso C: "Quiero mostrar dashboards a alguien que no es técnico"

$\rightarrow$ **[Grafana](../conectividad/mqtt-stack.md) Public Dashboards** con dashboards específicos sin datos sensibles, expuestos vía Cloudflare Tunnel. **Crear un dashboard nuevo, sólo con métricas no críticas, no exponer el dashboard general.**

### Caso D: "Quiero que un colaborador suba código de control al broker"

$\rightarrow$ **Tailscale o VPN** + cuenta [MQTT](../conectividad/mqtt-stack.md) con ACL restringido (sólo puede publicar a topics específicos, no a actuadores críticos).

### Caso E: "Quiero monitorear el invernadero remotamente cuando estoy fuera por meses"

$\rightarrow$ **Tailscale + un script de alerting que mande resumen diario por email/Telegram**, en vez de chequear manualmente. El alerting corre en el server, no requiere conexión saliente de un cliente.

---

## Checklist antes de exponer cualquier cosa

- [ ] ¿Es estrictamente necesario o se puede resolver con VPN?
- [ ] Si es necesario: ¿qué exactamente se expone? (un endpoint específico, no el broker entero)
- [ ] ¿Auth fuerte? (no admin/admin, no API key en URL, no creds compartidas)
- [ ] ¿Logs de acceso habilitados?
- [ ] ¿Rate limiting? (para evitar bruteforce)
- [ ] ¿Backup de [InfluxDB](../conectividad/mqtt-stack.md) en ubicación física distinta? (en caso de comprometido)

---

## Si te tocó instalar y el invernadero está en otro lado

A veces el invernadero está físicamente en otra ubicación y necesitás acceso continuo. Setup recomendado:

1. **Server local en el invernadero** (RPi 4 o mini PC sale) - corre [Mosquitto](../conectividad/mqtt-stack.md) + [InfluxDB](../conectividad/mqtt-stack.md) + [Telegraf](../conectividad/mqtt-stack.md) + [Grafana](../conectividad/mqtt-stack.md)
2. **Tailscale en el server** - conecta el invernadero a tu red personal Tailscale
3. **Acceso desde tu casa** vía la misma Tailscale - todo encriptado, cero puertos abiertos
4. **UPS chico** para el server - evita que un corte de luz de 5 min mate la sesión
5. **4G dongle como backup** para Tailscale (Huawei E3372 + chip M2M/mes) - si se cae el WiFi del lugar, Tailscale sigue por 4G

Costo total fijo +/mes datos. Mucho más barato que cualquier solución "smart farming" comercial.

---

## Si algo se compromete

Plan de respuesta mínimo:

1. **Desconectar el servidor de internet** (físicamente, desenchufar el cable LAN)
2. Tomar dump de logs antes de cualquier limpieza (`journalctl`, logs de [Mosquitto](../conectividad/mqtt-stack.md))
3. Revisar qué se publicó al broker durante la ventana de compromiso
4. **Reinstalar el servidor desde cero**, no intentar limpiar
5. Cambiar todas las credenciales (WiFi del invernadero, todos los usuarios [MQTT](../conectividad/mqtt-stack.md), claves [OTA](ota-firmado.md))
6. Reprogramar todos los nodos con nuevas creds
7. Restaurar [InfluxDB](../conectividad/mqtt-stack.md) desde backup pre-compromiso
8. Activar Tailscale only access desde el principio en la nueva instalación

Tomar nota de qué se pudo haber filtrado - para el paper, importa documentar si hubo ventanas de tiempo con datos no confiables.
