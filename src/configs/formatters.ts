import type { TypedFlatConfigItem } from "../types";
import type { VendoredPrettierOptions, VendoredPrettierRuleOptions } from "../vendor/prettier-types";
import type { StylisticConfig } from "./stylistic";
import {
  GLOB_ASTRO,
  GLOB_ASTRO_TS,
  GLOB_CSS,
  GLOB_GRAPHQL,
  GLOB_HTML,
  GLOB_LESS,
  GLOB_MARKDOWN,
  GLOB_POSTCSS,
  GLOB_SCSS,
  GLOB_SVG,
  GLOB_XML,
} from "../globs";
import { ensure, interop, isPackageInScope, parserPlain } from "../utils";
import { StylisticConfigDefaults } from "./stylistic";

export interface FormattersOptions {
  /**
   * Enable formatting support for CSS, Less, Sass, and SCSS.
   *
   * Currently only support Prettier.
   */
  css?: "prettier" | boolean;

  /**
   * Enable formatting support for HTML.
   *
   * Currently only support Prettier.
   */
  html?: "prettier" | boolean;

  /**
   * Enable formatting support for XML.
   *
   * Currently only support Prettier.
   */
  xml?: "prettier" | boolean;

  /**
   * Enable formatting support for SVG.
   *
   * Currently only support Prettier.
   */
  svg?: "prettier" | boolean;

  /**
   * Enable formatting support for Markdown.
   *
   * Support both Prettier and dprint.
   *
   * When set to `true`, it will use Prettier.
   */
  markdown?: "prettier" | "dprint" | boolean;

  /**
   * Enable formatting support for GraphQL.
   */
  graphql?: "prettier" | boolean;

  /**
   * Custom options for Prettier.
   *
   * By default it's controlled by our own config.
   */
  prettierOptions?: VendoredPrettierOptions;

  /**
   * Custom options for dprint.
   *
   * By default it's controlled by our own config.
   */
  dprintOptions?: boolean;

  /**
   * Enable formatting support for Astro.
   *
   * Currently only support Prettier.
   */
  astro?: "prettier" | boolean;
}

function mergePrettierOptions(
  options: VendoredPrettierOptions,
  overrides: VendoredPrettierRuleOptions,
): VendoredPrettierRuleOptions {
  return {
    ...options,
    ...overrides,
    plugins: [
      ...(overrides.plugins || []),
      ...(options.plugins || []),
    ],
  };
}

function buildCssConfigs(prettierOptions: VendoredPrettierOptions): TypedFlatConfigItem[] {
  return ([
    [[GLOB_CSS, GLOB_POSTCSS], "css", "luxass/formatter/css"],
    [[GLOB_SCSS], "scss", "luxass/formatter/scss"],
    [[GLOB_LESS], "less", "luxass/formatter/less"],
  ] as const).map(([files, parser, name]) => ({
    files: [...files],
    languageOptions: {
      parser: parserPlain,
    },
    name,
    rules: {
      "format/prettier": [
        "error",
        mergePrettierOptions(prettierOptions, { parser }),
      ],
    },
  }));
}

function buildXmlLikeConfig(
  prettierOptions: VendoredPrettierOptions,
  prettierXmlOptions: VendoredPrettierOptions,
  files: string[],
  name: string,
): TypedFlatConfigItem {
  return {
    files,
    languageOptions: {
      parser: parserPlain,
    },
    name,
    rules: {
      "format/prettier": [
        "error",
        mergePrettierOptions({ ...prettierXmlOptions, ...prettierOptions }, {
          parser: "xml",
          plugins: [
            "@prettier/plugin-xml",
          ],
        }),
      ],
    },
  };
}

function buildMarkdownConfigs(
  options: FormattersOptions,
  prettierOptions: VendoredPrettierOptions,
  dprintOptions: Record<string, unknown>,
): TypedFlatConfigItem[] {
  const formatter = options.markdown === true
    ? "prettier"
    : options.markdown;

  const configs: TypedFlatConfigItem[] = [
    {
      files: [GLOB_MARKDOWN],
      languageOptions: {
        parser: parserPlain,
      },
      name: "luxass/formatter/markdown",
      rules: {
        [`format/${formatter}`]: [
          "error",
          formatter === "prettier"
            ? mergePrettierOptions(prettierOptions, {
                embeddedLanguageFormatting: "off",
                parser: "markdown",
              })
            : {
                ...dprintOptions,
                language: "markdown",
              },
        ],
      },
    },
  ];

  return configs;
}

function buildAstroConfigs(prettierOptions: VendoredPrettierOptions): TypedFlatConfigItem[] {
  return [
    {
      files: [GLOB_ASTRO],
      languageOptions: {
        parser: parserPlain,
      },
      name: "luxass/formatter/astro",
      rules: {
        "format/prettier": [
          "error",
          mergePrettierOptions(prettierOptions, {
            parser: "astro",
            plugins: [
              "prettier-plugin-astro",
            ],
          }),
        ],
      },
    },
    {
      files: [GLOB_ASTRO, GLOB_ASTRO_TS],
      name: "luxass/formatter/astro/disables",
      rules: {
        "style/arrow-parens": "off",
        "style/block-spacing": "off",
        "style/comma-dangle": "off",
        "style/indent": "off",
        "style/no-multi-spaces": "off",
        "style/quotes": "off",
        "style/semi": "off",
      },
    },
  ];
}

function resolveFormattersOptions(options: FormattersOptions | true): FormattersOptions {
  if (options !== true) {
    return options;
  }

  const isPrettierPluginXmlInScope = isPackageInScope("@prettier/plugin-xml");
  return {
    astro: isPackageInScope("prettier-plugin-astro"),
    css: true,
    graphql: true,
    html: true,
    markdown: true,
    svg: isPrettierPluginXmlInScope,
    xml: isPrettierPluginXmlInScope,
  };
}

function buildHtmlConfig(prettierOptions: VendoredPrettierOptions): TypedFlatConfigItem {
  return {
    files: [GLOB_HTML],
    languageOptions: {
      parser: parserPlain,
    },
    name: "luxass/formatter/html",
    rules: {
      "format/prettier": [
        "error",
        mergePrettierOptions(prettierOptions, {
          parser: "html",
        }),
      ],
    },
  };
}

function buildGraphqlConfig(prettierOptions: VendoredPrettierOptions): TypedFlatConfigItem {
  return {
    files: [GLOB_GRAPHQL],
    languageOptions: {
      parser: parserPlain,
    },
    name: "luxass/formatter/graphql",
    rules: {
      "format/prettier": [
        "error",
        mergePrettierOptions(prettierOptions, {
          parser: "graphql",
        }),
      ],
    },
  };
}

function getFormattersPackagesToEnsure(options: FormattersOptions): (string | undefined)[] {
  return [
    "eslint-plugin-format",
    options.astro ? "prettier-plugin-astro" : undefined,
    (options.xml || options.svg) ? "@prettier/plugin-xml" : undefined,
  ];
}

export async function formatters(
  rawOptions: FormattersOptions | true = {},
  stylistic: StylisticConfig = {},
): Promise<TypedFlatConfigItem[]> {
  const options = resolveFormattersOptions(rawOptions);

  await ensure(getFormattersPackagesToEnsure(options));

  const {
    indent,
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...stylistic,
  };

  const prettierOptions: VendoredPrettierOptions = Object.assign(
    {
      endOfLine: "auto",
      printWidth: 120,
      semi,
      singleQuote: quotes === "single",
      tabWidth: typeof indent === "number" ? indent : 2,
      trailingComma: "all",
      useTabs: indent === "tab",
    } satisfies VendoredPrettierOptions,
    options.prettierOptions || {},
  );

  const prettierXmlOptions: VendoredPrettierOptions = {
    xmlQuoteAttributes: "double",
    xmlSelfClosingSpace: true,
    xmlSortAttributesByKey: false,
    xmlWhitespaceSensitivity: "ignore",
  };

  const dprintOptions = {
    indentWidth: typeof indent === "number" ? indent : 2,
    quoteStyle: quotes === "single" ? "preferSingle" : "preferDouble",
    useTabs: indent === "tab",
    // TODO: refine the type of `options.dprintOptions` in the future to avoid this ts comment.
    // @ts-expect-error - `options.dprintOptions` is boolean
    ...options.dprintOptions || {},
  };

  const pluginFormat = await interop(import("eslint-plugin-format"));

  const configs: TypedFlatConfigItem[] = [
    {
      name: "luxass/formatter/setup",
      plugins: {
        format: pluginFormat,
      },
    },
  ];

  if (options.css) {
    configs.push(...buildCssConfigs(prettierOptions));
  }

  if (options.html) {
    configs.push(buildHtmlConfig(prettierOptions));
  }

  if (options.xml) {
    configs.push(buildXmlLikeConfig(prettierOptions, prettierXmlOptions, [GLOB_XML], "luxass/formatter/xml"));
  }

  if (options.svg) {
    configs.push(buildXmlLikeConfig(prettierOptions, prettierXmlOptions, [GLOB_SVG], "luxass/formatter/svg"));
  }

  if (options.markdown) {
    configs.push(...buildMarkdownConfigs(options, prettierOptions, dprintOptions));
  }

  if (options.astro) {
    configs.push(...buildAstroConfigs(prettierOptions));
  }

  if (options.graphql) {
    configs.push(buildGraphqlConfig(prettierOptions));
  }

  return configs;
}
