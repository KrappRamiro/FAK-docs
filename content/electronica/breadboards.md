# Breadboards (Protoboards)

Placas perforadas con tiras conductoras internas para prototipar sin soldar.

## Buenas prácticas

1. **Tira de masa común:** conectar ambos rieles − con un jumper en cada extremo, así toda la breadboard tiene la misma referencia de tierra.
3. **Capacitor de desacople** cerca del [ESP32](../hardware/socs/index.md): 100nF cerámico entre 3.3V y GND, en columnas adyacentes a los pines de alimentación del módulo.

## Color Coding
- Rojo = +Vcc
- negro/azul = GND
- otros colores = señales, TODO definir

