import { GLOB_ASTRO } from "../globs";
import type { ConfigurationOptions, FlatConfigItem, OverrideOptions, ReactOptions } from "../types";
import { ensure, interop } from "../utils";

export async function astro(options: ConfigurationOptions<"typescript"> & OverrideOptions & ReactOptions): Promise<FlatConfigItem[]> {
  const {
    a11y = false,
    overrides = {},
    typescript = true,
  } = options;

  await ensure([
    "eslint-plugin-astro",
    "astro-eslint-parser",
    ...(options.a11y ? ["eslint-plugin-jsx-a11y"] : []),
  ]);

  const [
    pluginAstro,
    parserAstro,
    pluginA11y,
  ] = await Promise.all([
    interop(import("eslint-plugin-astro")),
    interop(import("astro-eslint-parser")),
    ...(options.a11y ? [interop(import("eslint-plugin-jsx-a11y"))] : []),
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
      files: [GLOB_ASTRO],
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
      name: "luxass:astro:rules",
      // @ts-expect-error hmmm
      rules: {
        "style/jsx-closing-tag-location": "off",
        "style/jsx-indent": "off",
        "style/jsx-one-expression-per-line": "off",
        ...pluginAstro.configs.all.rules,
        ...overrides,
      },
    },
    {
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
      name: "luxass:astro:rules:scripts",
    },
  ];
}
