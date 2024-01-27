import { GLOB_ASTRO } from "../../globs";
import type { FlatConfigItem } from "../../types";
import { interop } from "../../utils";

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
        globals: {
          "astro/astro": true,
          "es2020": true,
          "node": true,
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
      rules: {
        // Disallow conflicting set directives and child contents
        // https://ota-meshi.github.io/eslint-plugin-astro/rules/no-conflict-set-directives/
        "astro/no-conflict-set-directives": "error",

        // Disallow using deprecated Astro.canonicalURL
        // https://ota-meshi.github.io/eslint-plugin-astro/rules/no-deprecated-astro-canonicalurl/
        "astro/no-deprecated-astro-canonicalurl": "error",

        // Disallow using deprecated Astro.fetchContent()
        // https://ota-meshi.github.io/eslint-plugin-astro/rules/no-deprecated-astro-fetchcontent/
        "astro/no-deprecated-astro-fetchcontent": "error",

        // Disallow using deprecated Astro.resolve()
        // https://ota-meshi.github.io/eslint-plugin-astro/rules/no-deprecated-astro-resolve/
        "astro/no-deprecated-astro-resolve": "error",

        // Disallow using deprecated getEntryBySlug()
        // https://ota-meshi.github.io/eslint-plugin-astro/rules/no-deprecated-getentrybyslug/
        "astro/no-deprecated-getentrybyslug": "error",

        // Disallow unused define:vars={...} in style tag
        // https://ota-meshi.github.io/eslint-plugin-astro/rules/no-unused-define-vars-in-style/
        "astro/no-unused-define-vars-in-style": "error",

        // Disallow warnings when compiling
        // https://ota-meshi.github.io/eslint-plugin-astro/rules/valid-compile/
        "astro/valid-compile": "error",

        "style/jsx-closing-tag-location": "off",
        "style/jsx-indent": "off",
        "style/jsx-one-expression-per-line": "off",
        "style/multiline-ternary": ["error", "never"],

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
          ? await interop(import("@typescript-eslint/parser")) as any
          : null,
        parserOptions: {
          project: null,
          sourceType: "module",
        },
      },
    },
  ];
}
