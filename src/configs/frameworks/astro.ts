import { GLOB_ASTRO } from "../../globs";
import type { FlatConfigItem } from "../../types";
import { interop } from "../../utils";
import type { StylisticConfig } from "../stylistic";

export interface AstroOptions {
  /**
   * Override rules.
   */
  overrides?: FlatConfigItem["rules"];

  /**
   * Enable TypeScript support.
   *
   * @default true
   */
  typescript?: boolean;

  /**
   * Enable React A11y support.
   *
   * @default false
   */
  a11y?: boolean;

  /**
   * Glob patterns for Astro files.
   *
   * @default [GLOB_ASTRO]
   * @see https://github.com/luxass/eslint-config/blob/main/src/globs.ts#L27
   */
  files?: string[];

  /**
   * Enable stylistic rules.
   *
   * @default true
   */
  stylistic?: boolean | StylisticConfig;
}

export async function astro(options: AstroOptions): Promise<FlatConfigItem[]> {
  const {
    a11y = false,
    files = [GLOB_ASTRO],
    overrides = {},
    typescript = true,
    stylistic = true,
  } = options;

  const [
    pluginAstro,
    parserAstro,
    parserTs,
    pluginA11y,
  ] = await Promise.all([
    interop(import("eslint-plugin-astro")),
    interop(import("astro-eslint-parser")),
    interop(import("@typescript-eslint/parser")),
    ...(a11y ? [interop(import("eslint-plugin-jsx-a11y"))] : []),
  ] as const);

  return [
    {
      name: "luxass:astro:setup",
      plugins: {
        astro: pluginAstro,
        ...(a11y ? { "jsx-a11y": pluginA11y } : {}),
      },
    },
    {
      name: "luxass:astro:rules",
      files,
      languageOptions: {
        parser: parserAstro,
        parserOptions: {
          extraFileExtensions: [".astro"],
          parser: typescript
            ? parserTs as any
            : null,
          sourceType: "module",
        },
      },
      rules: {
        // Disallow conflicting set directives and child contents
        // https://ota-meshi.github.io/eslint-plugin-astro/rules/no-conflict-set-directives/
        "astro/no-conflict-set-directives": "error",

        // Disallow use of `set:html` directive
        // https://ota-meshi.github.io/eslint-plugin-astro/rules/no-set-html-directive/
        "astro/no-set-html-directive": "off",

        ...(stylistic
          ? {
              "style/indent": "off",
              "style/jsx-indent": "off",
              "style/jsx-closing-tag-location": "off",
              "style/jsx-one-expression-per-line": "off",
              "style/no-multiple-empty-lines": "off",
            }
          : {}),

        ...overrides,
      },
    },
    {
      name: "luxass:astro:scripts-js",
      files: [
        "**/*.astro/*.js",
        "*.astro/*.js",
      ],
      languageOptions: {
        globals: {
          browser: true,
          es2020: true,
        },
        parserOptions: {
          sourceType: "module",
        },
      },
    },
    {
      name: "luxass:astro:scripts-ts",
      files: [
        "**/*.astro/*.ts",
        "*.astro/*.ts",
      ],
      languageOptions: {
        globals: {
          browser: true,
          es2020: true,
        },
        parser: typescript
          ? parserTs as any
          : null,
        parserOptions: {
          project: null,
          sourceType: "module",
        },
      },
    },
  ];
}
