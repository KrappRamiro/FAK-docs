import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { FileTrieNode } from "./quartz/util/fileTrie"

function customExplorerSort(a: FileTrieNode, b: FileTrieNode): number {
  // Todo lo que esté acá tiene que ser self-contained: Quartz serializa esta
  // función a string y la ejecuta en el browser, sin acceso al scope externo.
  const topOrder = [
    "empezar-aca",
    "hardware-esp32",
    "electronica",
    "sensores",
    "red",
    "herramientas",
    "seguridad-iot",
    "investigacion",
  ]

  const folderOrders: Record<string, string[]> = {
    "hardware-esp32": [
      "socs",
      "modulos",
      "devkits",
      "frameworks",
      "arquitecturas-cpu",
      "form-factors",
      "migracion-esp8266",
    ],
    "hardware-esp32/devkits": [
      "espressif",
      "adafruit",
      "lilygo",
      "m5stack",
      "seeed-xiao",
      "sparkfun",
      "wemos-lolin",
      "otros",
    ],
    electronica: [
      "resistencias",
      "capacitores",
      "leds",
      "cables-awg",
      "breadboards",
      "buzzers",
      "conectores",
      "transistores",
      "diodos",
      "potencia",
    ],
  }

  // Inferir carpeta padre desde el slug (ej. "hardware/socs/index" → "hardware")
  const parent = a.slug.replace("/index", "").split("/").slice(0, -1).join("/")
  const perFolder = folderOrders[parent]
  if (perFolder) {
    const aIdx = perFolder.indexOf(a.slugSegment)
    const bIdx = perFolder.indexOf(b.slugSegment)
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx
    if (aIdx !== -1) return -1
    if (bIdx !== -1) return 1
    return a.displayName.localeCompare(b.displayName)
  }

  const aIdx = topOrder.indexOf(a.slugSegment)
  const bIdx = topOrder.indexOf(b.slugSegment)
  if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx
  if (aIdx !== -1) return -1
  if (bIdx !== -1) return 1
  return a.displayName.localeCompare(b.displayName)
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/KrappRamiro/FAK-docs",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({ sortFn: customExplorerSort }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({ sortFn: customExplorerSort }),
  ],
  right: [],
}
