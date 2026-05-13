import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { FileTrieNode } from "./quartz/util/fileTrie"

// Para cambiar el orden de las carpetas en el sidebar, editá este array.
// Las carpetas que no estén acá aparecen al final, en orden alfabético.
const FOLDER_ORDER = [
  "empezar-aca",
  "hardware",
  "electronica",
  "sensores",
  "conectividad",
  "construccion-nodos",
  "herramientas",
  "seguridad-iot",
  "investigacion",
]

function customExplorerSort(a: FileTrieNode, b: FileTrieNode): number {
  // El array tiene que estar adentro de la función porque Quartz convierte
  // esta función a string y la ejecuta en el browser. Si el array estuviera
  // afuera, el browser no lo vería y el sort no funcionaría.
  const order = [
    "empezar-aca",
    "hardware",
    "electronica",
    "sensores",
    "conectividad",
    "construccion-nodos",
    "herramientas",
    "seguridad-iot",
    "investigacion",
  ]
  const aIdx = order.indexOf(a.slugSegment)
  const bIdx = order.indexOf(b.slugSegment)
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
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
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
