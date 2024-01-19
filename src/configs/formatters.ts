import * as parserPlain from "eslint-parser-plain"
import { GLOB_CSS, GLOB_LESS, GLOB_MARKDOWN, GLOB_POSTCSS, GLOB_SCSS } from "../globs"
import type { VendoredPrettierOptions } from "../vendor/prettier-types"
import { ensure, interop } from "../utils"
import type { FlatConfigItem } from "../types"
import type { StylisticConfig } from "./stylistic"
import { StylisticConfigDefaults } from "./stylistic"

export interface FormattersOptions {
  /**
   * Enable formatting support for CSS, Less, Sass, and SCSS.
   *
   * Currently only support Prettier.
   */
  css?: "prettier" | boolean

  /**
   * Enable formatting support for HTML.
   *
   * Currently only support Prettier.
   */
  html?: "prettier" | boolean

  /**
   * Enable formatting support for Markdown.
   *
   * Support both Prettier and dprint.
   *
   * When set to `true`, it will use Prettier.
   */
  markdown?: "prettier" | "dprint" | boolean

  /**
   * Enable formatting support for GraphQL.
   */
  graphql?: "prettier" | boolean

  /**
   * Custom options for Prettier.
   *
   * By default it's controlled by our own config.
   */
  prettierOptions?: VendoredPrettierOptions

  /**
   * Custom options for dprint.
   *
   * By default it's controlled by our own config.
   */
  dprintOptions?: boolean
}

export async function formatters(
  options: FormattersOptions | true = {},
  stylistic: StylisticConfig = {},
): Promise<FlatConfigItem[]> {
  await ensure([
    "eslint-plugin-format",
  ])

  if (options === true) {
    options = {
      css: true,
      graphql: true,
      html: true,
      markdown: true,
    }
  }

  const {
    indent,
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...stylistic,
  }

  const prettierOptions: VendoredPrettierOptions = Object.assign(
    {
      endOfLine: "auto",
      semi,
      singleQuote: quotes === "single",
      tabWidth: typeof indent === "number" ? indent : 2,
      trailingComma: "all",
      useTabs: indent === "tab",
    } satisfies VendoredPrettierOptions,
    options.prettierOptions || {},
  )

  const dprintOptions = Object.assign(
    {
      indentWidth: typeof indent === "number" ? indent : 2,
      quoteStyle: quotes === "single" ? "preferSingle" : "preferDouble",
      useTabs: indent === "tab",
    },
    options.dprintOptions || {},
  )

  const pluginFormat = await interop(import("eslint-plugin-format"))

  const configs: FlatConfigItem[] = [
    {
      name: "luxass:formatters:setup",
      plugins: {
        format: pluginFormat,
      },
    },
  ]

  if (options.css) {
    configs.push(
      {
        name: "luxass:formatter:css",
        files: [GLOB_CSS, GLOB_POSTCSS],
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          "format/prettier": [
            "error",
            {
              ...prettierOptions,
              parser: "css",
            },
          ],
        },
      },
      {
        name: "luxass:formatter:scss",
        files: [GLOB_SCSS],
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          "format/prettier": [
            "error",
            {
              ...prettierOptions,
              parser: "scss",
            },
          ],
        },
      },
      {
        name: "luxass:formatter:less",
        files: [GLOB_LESS],
        languageOptions: {
          parser: parserPlain,
        },
        rules: {
          "format/prettier": [
            "error",
            {
              ...prettierOptions,
              parser: "less",
            },
          ],
        },
      },
    )
  }

  if (options.html) {
    configs.push({
      name: "luxass:formatter:html",
      files: ["**/*.html"],
      languageOptions: {
        parser: parserPlain,
      },
      rules: {
        "format/prettier": [
          "error",
          {
            ...prettierOptions,
            parser: "html",
          },
        ],
      },
    })
  }

  if (options.markdown) {
    const formater = options.markdown === true
      ? "prettier"
      : options.markdown

    configs.push({
      name: "luxass:formatter:markdown",
      files: [GLOB_MARKDOWN],
      languageOptions: {
        parser: parserPlain,
      },
      rules: {
        [`format/${formater}`]: [
          "error",
          formater === "prettier"
            ? {
                printWidth: 120,
                ...prettierOptions,
                embeddedLanguageFormatting: "off",
                parser: "markdown",
              }
            : {
                ...dprintOptions,
                language: "markdown",
              },
        ],
      },
    })
  }

  if (options.graphql) {
    configs.push({
      name: "luxass:formatter:graphql",
      files: ["**/*.graphql"],
      languageOptions: {
        parser: parserPlain,
      },
      rules: {
        "format/prettier": [
          "error",
          {
            ...prettierOptions,
            parser: "graphql",
          },
        ],
      },
    })
  }

  return configs
}
