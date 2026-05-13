# Apogee SQ-500 (Apogee Instruments)

Quantum sensor - gold standard de referencia para PAR.

CARISIMO

Página del fabricante: [Apogee Instruments SQ-500](https://www.apogeeinstruments.com/sq-500-full-spectrum-quantum-sensor/)

## Specs

| Spec | Valor |
|---|---|
| Unidad de salida | $\mu\text{mol}/\text{m}^2/\text{s}$ (calibrado en PAR) |
| Salida | Analógica 0-40 mV (0.01 mV por $\mu\text{mol}/\text{m}^2/\text{s}$) |
| Rango espectral | 389-692 nm (>50% respuesta) |
| Calibración | **Trazable a NIST** vía ISO/IEC 17025 |
| Incertidumbre de calibración | $\pm 5\%$ |
## Casos de uso típicos

- **Calibrar** sensores espectrales económicos como [AS7341](as7341.md)
- Referencia de "verdad" en publicaciones académicas
- Usado en los papers de validación citados en [as7341.md](as7341.md)

## Estrategia típica para investigación con PAR

1. Una sola unidad de Apogee SQ-500 como gold standard (costo único, calibra todos los nodos)
2. Múltiples módulos AS7341 distribuidos por zonas, calibrados contra el Apogee
3. Procedimiento: instalar AS7341 + Apogee en la misma posición durante $\geq 1$ semana en distintas condiciones de luz, ajustar coeficientes a₁-a₈ por regresión multilineal

## Variante SS

[Apogee SQ-500-SS](https://www.apogeeinstruments.com/sq-500-ss-full-spectrum-quantum-sensor/) es la variante con conector stainless-steel (más durable en ambiente exterior). Usada como referencia en el [preprint "Open-Source PAR Sensor for Enhanced Agricultural and Agrivoltaics Monitoring" (Preprints.org 2025)](https://www.preprints.org/manuscript/202504.1750) donde validan un AS7341 + ESP32 contra este sensor.
