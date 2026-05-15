# Estacion de Soldado - Guia de Compra

Lee: [r/soldering - "Soldering Station Buying Mega Guide" (bigrealaccount, 2024)](https://www.reddit.com/r/soldering/comments/1n1f2hi/soldering_station_buying_mega_guide/)

---

## Conceptos previos

### Tipos de puntas

Las puntas no son intercambiables entre plataformas. Antes de comprar una estacion, definir que puntas vas a usar.

| Plataforma | Precio punta genuina | Calor | Notas |
|------------|---------------------|-------|-------|
| T12 (Hakko) | | Bueno | Mas barato, suficiente para todo uso general |
| JBC C245 | | Mejor | El estandar profesional, 135W pico |
| JBC C210 | | Medio | Solo micro soldadura, max 40W |
| JBC C115 | | Especifico | Componentes microscopicos, la mayoria no lo necesita |

Las puntas clone existen para ambas plataformas y la mayoria funcionan bien, pero se gastan mas rapido que las genuinas.

### T12 vs JBC C245/C210

- Con T12 podes hacer todo lo que harias con JBC - la diferencia es performance, no capacidad
- Si el presupuesto lo permite, apuntar a JBC C245
- C245 es el tamaño estandar - desde puntas cincel de 5mm hasta conicos de 0.4mm
- C210 es exclusivamente para micro soldadura

### Estaciones chinas vs marcas "buenas"

Ambas posiciones tienen razon:
- Las clones pueden tener problemas de calidad, grounding incorrecto, partes internas inferiores
- Las marcas genuinas pueden tener peor performance que clones equivalentes a 1/10 del precio

Para uso ocasional a moderado: estaciones chinas recomendadas en esta guia son suficientes y duran 3+ anos.
Para uso diario de varias horas: considerar marcas genuinas por confiabilidad.

---

## NO COMPRAR

Estos productos tienen problemas documentados de seguridad o calidad:

| Producto | Problema |
|----------|----------|
| **FNIRSI DWS-200** | Hasta 90V de leak en la punta. Versiones nuevas corregidas pero todavia hay stock viejo circulando. Evitar por ahora. |
| **AIFEN A9 / A9E** | 9V+ de leak en la punta. Puede estar corregido en unidades nuevas pero no confirmado. |
| **Aixun T3A / T3AS** | 1-10V de leak, thermal runaway, destruye puntas |
| **Aixun T3B / T3BS** | 1-10V de leak, thermal runaway, destruye puntas |
| **Aixun T320** | 1-10V de leak (thermal runaway corregido vs T3A) |
| **KSGER T12** | Leak y case sin ground incluso en unidades v3.1 nuevas |
| **Quecoo 952/955** | Leak y case sin ground |
| **KSGER C245** | Todas las unidades tienen case sin ground |
| **YIHUA 862BD+ / 902A** | All-in-one con soplador en el mango, puntas de calor pasivo, mango enorme |
| **YIHUA 926 III** | Trampa para principiantes - punta de calor pasivo, accesorios inutiles |
| Cualquier cautin que se enchufa directo a 220V | Sin control de temperatura |
| All-in-one baratos con aire caliente | Mal aire caliente Y mal cautin - mejor comprar dos herramientas separadas |

> Nota sobre AIFEN vs Sugon: son marcas distintas. El **Sugon A9** SI tiene grounding correcto y es seguro. El AIFEN A9/A9E no.

---

## Recomendaciones por presupuesto

### Presupuesto bajo

**Recomendado: OSS-T12-X PLUS**
- Punta grounded
- Soporte con auto-sleep incluido
- Mango fino y comodo
- Include copia de pad Metcal para cambio de puntas
- La opcion T12 mas popular en AliExpress
- AliExpress Item ID: `1005007171047975`

**Alternativa: T12 Mini / T12-942**
- Requiere fuente externa de 24V
- Ventaja: el grounding no depende del fabricante
- Sin accesorios incluidos
- Bueno si tenes una fuente 24V de calidad disponible
- AliExpress Item ID: `4001063621549`

> Advertencia general para T12 baratos: algunos llegan con case sin ground. Al recibirlo, verificar que el case este conectado a tierra. Si no lo esta, hay guias en EEVblog y YouTube para corregirlo con un cable jumper. Si no queres arriesgarte, ir directamente al rango

---

### Presupuesto medio

**Recomendado: GEEBOON TC22**
- Case y punta grounded
- Kit SDC02 incluye soporte, 2 puntas, 240W de potencia
- Compatible con mangos y puntas JBC genuinas
- PID ajustable, buena interfaz
- El mejor valor en este rango segun la guia
- AliExpress Item ID: `1005006397758007`

**Alternativa all-in-one: Sugon A9**
- Punta y case grounded (la version segura del AIFEN)
- Soporte con auto-sleep + esponja/lana integrados en la unidad
- Buena performance
- Ideal si prefieres una unidad compacta todo en uno
- AliExpress Item ID: `1005003762762094`

**Alternativa: Alientek T200**
- Similar al TC22, viene con soporte (peor que el del TC22)
- UI y encoder mas prolijos
- Menos features que el TC22 pero opcion solida
- AliExpress Item ID: `1005008357283567`

**Version con transformador: GEEBOON TA305**
- Igual que el TC22 pero con transformador en lugar de switching
- Mas grande, probablemente mas duracion
- Si no sabes que es un transformador en este contexto, no lo necesitas
- AliExpress Item ID: `1005007051925949`

---

### Presupuesto alto

**Recomendado: ST BST-933B / JABE UD-1200**
- Imitacion fiel de estaciones JBC profesionales
- Transformador lineal, gran performance, buena construccion
- Compatible con mangos y puntas JBC genuinas
- Todas las reviews dicen que es confiable por varios anos
- Puede tener fan ruidoso - reemplazable
- Solo incrementa temperatura en pasos de 1 grado

**Alternativa: Bakon BK-999N**
- 110W, transformador (sin leak en la punta)
- Muestra la resistencia de la punta en el display
- Soporte incluido pero muy malo - restarle puntos por esto
- Construccion en plastico
- Tiene salida DVI para mover el display

**Opcion interesante: Used Metcal MX-500**
- Ya no se fabrica pero tiene misma performance que el MX-5000
- Tecnologia RF - probablemente la respuesta termica mas rapida de cualquier estacion
- Sin control de temperatura ajustable - temperatura fija segun la punta
- Buscar en eBay, a veces "sin probar" a que enciende perfecto

---

### Presupuesto premium

| Nombre | Notas |
| -------- | ------- |
| PACE ADS200 | Metal solido, mango cool-touch, tech AccuDrive (sin calibracion necesaria), puntas mas baratas que JBC. Mejor opcion de marca genuina asequible. |
| Thermaltronics TMT-9000S | Equivalente al Metcal MX-500, hecho por ex-ingenieros de Metcal. Display que muestra carga. |
| JBC CD-2BQF | El gold standard de la industria. Usado en entornos profesionales. Puntas caras. |
| Metcal MX-5000/5200 | Probablemente la entrega de calor mas rapida existente por tecnologia RF. Dos puertos simultaneos. Construido para durar decadas. |

---

## Accesorios

Los accesorios que vienen incluidos con algunas estaciones pueden valer tanto como la estacion misma. Un soporte bueno sale por separado.

Accesorios utiles:
- Soporte con auto-sleep (baja la temperatura cuando apoyas el cautin)
- Lana de bronce (mejor que la esponja humeda para limpiar la punta - no baja la temperatura)
- Esponja humeda (complemento de la lana de bronce)
- Puntas extra (al menos 2-3 formas distintas: cincel, conico, biselado)
- Cable de ground
- Herramienta de cambio de puntas (evita quemarse)
- Estaño 0.8mm con flux incorporado (60/40 o libre de plomo segun preferencia)
- Flux en pasta o liquido
- Bomba desoldadora o mecha desoldadora

Los accesorios genericos (soporte, esponja, lana de bronce, estaño) se pueden comprar en Temu/AliExpress sin problema - la calidad variable no afecta su funcion basica.

---

## Como comprar en AliExpress con los Item IDs

1. Entrar a AliExpress y abrir cualquier producto
2. En la URL, reemplazar el numero de item por el ID indicado
3. Borrar cualquier texto despues de `(item_id).html`
4. No comprar a vendedores con 0 ventas y 0 reviews

---


## Notas finales de la guia original

- Muchas estaciones caras se consiguen mucho mas baratas en eBay (segunda mano)
- "Sin probar" en eBay a veces significa "enciende y claramente funciona" - las personas no saben lo que tienen
- Para marcas genuinas (Metcal, JBC, Thermaltronics): comprar en distribuidores oficiales, no en AliExpress - probable clon o precio inflado
- Estaciones portatiles (TS100, Pinecil): peor valor que estaciones de escritorio cuando se suma el costo del cargador de 130W+ necesario para potencia real
