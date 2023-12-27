import { GLOB_ASTRO } from "../globs";
import type { FlatConfigItem } from "../types";
import { interop } from "../utils";

export interface AstroOptions {
  /**
   * Override rules.
   */
  overrides?: FlatConfigItem["rules"]

  /**
   * Enable TypeScript support.
   *
   * @default true
   */
  typescript?: boolean

  /**
   * Enable React A11y support.
   *
   * @default false
   */
  a11y?: boolean

  /**
   * Glob patterns for Astro files.
   *
   * @default [GLOB_ASTRO]
   * @see https://github.com/luxass/eslint-config/blob/main/src/globs.ts#L27
   */
  files?: string[]
}

export async function astro(options: AstroOptions): Promise<FlatConfigItem[]> {
  const {
    a11y = false,
    files = [GLOB_ASTRO],
    overrides = {},
    typescript = true,
  } = options;

  const [
    pluginAstro,
    parserAstro,
    pluginA11y,
  ] = await Promise.all([
    interop(import("eslint-plugin-astro")),
    interop(import("astro-eslint-parser")),
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
        // @ts-expect-error hmmm
        globals: {
          ...pluginAstro.configs.base.overrides[0].env,
        },
        parser: parserAstro,
        parserOptions: {
          extraFileExtensions: [".astro"],
          parser: typescript
            ? await interop(import("@typescript-eslint/parser")) as any
            : null,
          sourceType: "module",
        },
      },
      // @ts-expect-error hmmm
      rules: {
        "style/jsx-closing-tag-location": "off",
        "style/jsx-indent": "off",
        "style/jsx-one-expression-per-line": "off",
        ...pluginAstro.configs.all.rules,

        "style/multiline-ternary": ["error", "never"],
        ...overrides,
      },
    },
    {
      name: "luxass:astro:rules:scripts",
      files: [
        "**/*.astro/*.js",
        "*.astro/*.js",
      ],
      languageOptions: {
        // @ts-expect-error hmmm
        globals: {
          ...pluginAstro.configs.base.overrides[1].env,
        },
        parserOptions: {
          sourceType: "module",
        },
      },
    },
  ];
}
