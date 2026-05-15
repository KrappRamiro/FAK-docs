# Módulos (Box) - Catálogo

El módulo es el chip empaquetado con flash, PSRAM (opcional) y antena (o conector para antena), en un package metálico solderable. Es lo que va adentro del [DevKit](../devkits/index.md).

## Formatos disponibles

| Formato    | Cuándo                                               | Página                   |
| ---------- | ---------------------------------------------------- | ------------------------ |
| **WROOM**  | Formato estándar, más común                          | [wroom.md](./wroom.md)   |
| **MINI**   | Footprint reducido, menos GPIO                       | [mini.md](./mini.md)     |
| **SOLO**   | Solo para [ESP32-S2](../socs/esp32-s2.md)            | [solo.md](./solo.md)     |
| **WROVER** | ESP32 clásico (PSRAM en módulo) + variante S2-WROVER | [wrover.md](./wrover.md) |

## Sufijos de antena (válido para todos los formatos)

| Sufijo         | Antena                                                                                                                                                                           |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sin sufijo `U` | Antena PCB trace integrada                                                                                                                                                       |
| `U` o `IE`     | Conector **U.FL** para antena externa - requerido dentro de gabinetes metálicos o [de fibra de carbono](https://kumair.com/implementations/carbon-fiber-electronics-enclosures/) |

## Decodificando un part number

```
ESP32-S3-WROOM-1-N16R8
│ │ │ │ │ └─ R8 = 8 MB PSRAM
│ │ │ │ └──── N16 = 16 MB Flash (rango temp. normal)
│ │ │ └─────── 1 = revisión de silicio
│ │ └───────────── WROOM = formato de módulo
│ └──────────────── S3 = variante de SoC (Brain)
└─────────────────────── ESP32 = familia de producto
```

| Código                          | Significado                                              |
| ------------------------------- | -------------------------------------------------------- |
| `N4` / `N8` / `N16` / `N32`     | Flash en MB, temperatura normal (-40 a +85 $^\circ$C) |
| `H4` / `H8`                     | Flash en MB, temperatura alta (-40 a +105 $^\circ$C)  |
| `R2` / `R8`                     | PSRAM en MB                                              |
| `U` antes del código de memoria | Conector U.FL para antena externa                        |
| `MINI`                          | Módulo en formato compacto en vez de WROOM               |

## Catálogo completo del fabricante

[Espressif Modules](https://www.espressif.com/en/products/modules)
