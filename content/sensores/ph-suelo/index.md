# pH de Suelo

> **Conclusión práctica: la medición continua / in-situ del pH del suelo es inviable.** Para registrar pH del suelo se hacen mediciones **periódicas** (muestreo) con extracto suelo:agua y un pHmetro de laboratorio. No existe un sensor confiable para enterrar y olvidarse.

## Por qué la medición continua no funciona

Resumido de la discusión [r/diyelectronics - soil pH sensors](https://www.reddit.com/r/diyelectronics/comments/hsue3w/anyone_know_what_the_deal_with_soil_ph_sensors_is/) y de literatura agronómica (USDA NRCS, ASTM D4972):

1. **pH se mide en líquidos, no en sólidos.** Para medir pH del suelo hay que convertir parte del suelo en solución (extracto agua / KCl / CaCl₂ en proporciones estándar 1:1 o 1:2.5).
2. **El electrodo de vidrio se ensucia rápido** en suelo húmedo - biofilms, arcilla, raíces obstruyen el bulbo y la junción de referencia.
3. **Deriva continua** - los electrodos requieren **recalibración cada 1-4 semanas** en uso real. Lecturas sin recalibrar derivan $\pm 0.5\,\text{pH}$ o más.
4. **Los "sensores de pH para Arduino" de AliExpress de dos puntas que se clavan en la tierra son humo** - miden resistencia del suelo y "estiman" pH (mal). Comunidad consenso: no funcionan ([discusión Reddit linkeada](https://www.reddit.com/r/diyelectronics/comments/hsue3w/anyone_know_what_the_deal_with_soil_ph_sensors_is/)).

## Métodos válidos

| Método | Tipo | Frecuencia razonable | Costo | Trazabilidad |
|---|---|---|---|---|
| **Tiras pH (papel indicador)** | Spot, colorimétrico | Cuando se necesite | por 100 tiras | Baja - no para paper |
| **pHmetro portátil de bolsillo** (Hanna, Apera) | Spot, electrodo | Semanal / quincenal | | Media - con calibración documentada |
| **[Atlas EZO-pH](./ezo-ph.md) + electrodo de laboratorio** | Spot, electrodo industrial | Semanal / quincenal | | **Alta** - apto para paper con calibración 3-puntos NIST-traceable cada 4 semanas |
| Sensores baratos de dos puntas AliExpress | "Continuous in-situ" | ❌ | | **Ninguna - no usar** |

## Protocolo estándar de muestreo (ASTM D4972 / USDA NRCS)

Para una medición metodológicamente defendible:

1. **Recolectar muestra de suelo** - 5-10 g de la zona de raíces, en varios puntos representativos
2. **Secar al aire** y tamizar por malla de 2 mm (opcional para reproducibilidad estricta)
3. **Mezclar suelo + agua destilada** en proporción **1:1** (peso suelo : volumen agua, per ASTM D4972 método A / USDA NRCS) **o 1:2.5** (convención agronómica europea / ISO 10390 usa 1:5). Anotar cuál se usa - los resultados no son directamente comparables entre ratios.
4. **Agitar 30-60 min** (vórtex o agitador orbital) hasta que las partículas estén bien suspendidas
5. **Dejar decantar 30 min**
6. **Medir el pH del sobrenadante** con electrodo calibrado ([Atlas EZO-pH](./ezo-ph.md) o pHmetro lab)
7. **Registrar:** fecha, hora, ubicación de muestra, ratio usado, temperatura, valor de pH, slope de la calibración del electrodo

Referencia: [ASTM D4972 - Standard Test Method for pH of Soils](https://www.astm.org/d4972-19.html) (paywall, pero el método está descrito en [USDA NRCS - Soil Survey Field and Laboratory Methods Manual](https://www.nrcs.usda.gov/sites/default/files/2022-09/SSIR_51_Soil_Survey_Field_and_Laboratory_Methods_Manual.pdf), capítulo 4).

## Implicancia para el proyecto

- **Sacar pH del bucle de mediciones automatizadas** del nodo de suelo. Las "lecturas cada 15 min" no son metodológicamente válidas para pH.
- **Tratar pH como dato manual periódico:** muestreo semanal o quincenal, medición en mesada con [Atlas EZO-pH](./ezo-ph.md), entrada manual en un log o vía un script que publique a MQTT con timestamp del momento de medición.
- **Si se quiere "pH continuo" para algo más allá de un paper agronómico**, considerar pH del **agua de riego/drenaje** (medible en líquido continuamente con un electrodo en línea), no del suelo en sí.

## Sensor para hacer las mediciones spot

[Atlas EZO-pH](./ezo-ph.md) sigue siendo el sensor recomendado - pero como **instrumento de mesada** para procesar muestras, no como nodo IoT enterrado.
