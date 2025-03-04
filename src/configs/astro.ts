import type { TypedFlatConfigItem } from "../types";
import type { StylisticConfig } from "./stylistic";
import { GLOB_ASTRO } from "../globs";
import { ensure, interop } from "../utils";

export interface AstroOptions {
  /**
   * Override rules.
   */
  overrides?: TypedFlatConfigItem["rules"];

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

export async function astro(options: AstroOptions = {}): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_ASTRO],
    overrides = {},
    stylistic = true,
  } = options;

  await ensure([
    "eslint-plugin-astro",
    "astro-eslint-parser",
  ]);

  const [
    pluginAstro,
    parserAstro,
    parserTs,
  ] = await Promise.all([
    interop(import("eslint-plugin-astro")),
    interop(import("astro-eslint-parser")),
    interop(import("@typescript-eslint/parser")),
  ] as const);

  return [
    {
      name: "luxass/astro/setup",
      plugins: {
        astro: pluginAstro,
      },
    },
    {
      files,
      languageOptions: {
        globals: pluginAstro.environments.astro.globals,
        parser: parserAstro,
        parserOptions: {
          extraFileExtensions: [".astro"],
          parser: parserTs,
        },
        sourceType: "module",
      },
      name: "luxass/astro/rules",
      processor: "astro/client-side-ts",
      rules: {
        // Astro uses top level await for e.g. data fetching
        // https://docs.astro.build/en/guides/data-fetching/#fetch-in-astro
        "antfu/no-top-level-await": "off",

        // use recommended rules
        "astro/missing-client-only-directive-value": "error",
        "astro/no-conflict-set-directives": "error",
        "astro/no-deprecated-astro-canonicalurl": "error",
        "astro/no-deprecated-astro-fetchcontent": "error",
        "astro/no-deprecated-astro-resolve": "error",
        "astro/no-deprecated-getentrybyslug": "error",
        "astro/no-set-html-directive": "off",
        "astro/no-unused-define-vars-in-style": "error",
        "astro/semi": "off",
        "astro/valid-compile": "error",

        ...stylistic
          ? {
              "style/indent": "off",
              "style/jsx-closing-tag-location": "off",
              "style/jsx-one-expression-per-line": "off",
              "style/no-multiple-empty-lines": "off",
            }
          : {},

        ...overrides,
      },
    },
  ];
}
