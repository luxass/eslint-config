// matches ts, js, jsx, tsx, cjs, cts, cjsx, ctsx, mjs, mts, mjsx, mtsx
export const GLOB_SRC_EXT = "?([cm])[jt]s?(x)"
export const GLOB_SRC = `**/*.${GLOB_SRC_EXT}`

export const GLOB_JS = "**/*.?([cm])js"
export const GLOB_JSX = "**/*.?([cm])jsx"

export const GLOB_TS = "**/*.?([cm])ts"
export const GLOB_TSX = "**/*.?([cm])tsx"

export const GLOB_STYLE = "**/*.{c,le,sc}ss"
export const GLOB_CSS = "**/*.css"
export const GLOB_POSTCSS = "**/*.{p,post}css"
export const GLOB_LESS = "**/*.less"
export const GLOB_SCSS = "**/*.scss"

export const GLOB_JSON = "**/*.json"
export const GLOB_JSON5 = "**/*.json5"
export const GLOB_JSONC = "**/*.jsonc"

export const GLOB_MARKDOWN = "**/*.md"
export const GLOB_MARKDOWN_IN_MARKDOWN = "**/*.md/*.md"
export const GLOB_VUE = "**/*.vue"
export const GLOB_YAML = "**/*.y?(a)ml"
export const GLOB_TOML = "**/*.toml"
export const GLOB_HTML = "**/*.htm?(l)"
export const GLOB_ASTRO = "**/*.astro"

export const GLOB_MARKDOWN_CODE = `${GLOB_MARKDOWN}/${GLOB_SRC}`

export const GLOB_TESTS = [
  `**/__tests__/**/*.${GLOB_SRC_EXT}`,
  `**/*.spec.${GLOB_SRC_EXT}`,
  `**/*.test.${GLOB_SRC_EXT}`,
  `**/*.bench.${GLOB_SRC_EXT}`,
  `**/*.benchmark.${GLOB_SRC_EXT}`,
]

export const GLOB_NEXTJS_OG = [
  `**/app/**/opengraph-image.[jt]s?(x)`,
  `**/app/**/twitter-image.[jt]s?(x)`,
  `**/app/**/route.[jt]s?(x)`,
]

export const GLOB_NEXTJS_ROUTES = [
  `**/app/**/page.${GLOB_SRC_EXT}`,
  `**/app/**/layout.${GLOB_SRC_EXT}`,
  `**/app/**/error.${GLOB_SRC_EXT}`,
  `**/app/**/template.${GLOB_SRC_EXT}`,
  `**/app/**/not-found.${GLOB_SRC_EXT}`,
  `**/app/**/loading.${GLOB_SRC_EXT}`,
  `**/app/**/robots.${GLOB_SRC_EXT}`,
  `**/app/**/sitemap.${GLOB_SRC_EXT}`,
  `**/pages/**/*.${GLOB_SRC_EXT}`,
]

export const GLOB_EXCLUDE = [
  "**/node_modules",
  "**/dist",
  "**/out",
  "**/build",
  "**/package-lock.json",
  "**/yarn.lock",
  "**/pnpm-lock.yaml",
  "**/bun.lockb",

  "**/output",
  "**/coverage",
  "**/temp",
  "**/.temp",
  "**/tmp",
  "**/.tmp",
  "**/.history",
  "**/.vitepress/cache",
  "**/.nuxt",
  "**/.next",
  "**/.vercel",
  "**/.netlify",
  "**/.changeset",
  "**/.idea",
  "**/.cache",
  "**/.output",
  "**/.vite-inspect",
  "**/.astro",

  "**/CHANGELOG*.md",
  "**/*.min.*",
  "**/LICENSE*",
  "**/__snapshots__",
  "**/auto-import?(s).d.ts",
  "**/components.d.ts",
]
