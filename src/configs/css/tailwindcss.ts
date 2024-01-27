import { GLOB_SRC } from "../../globs";
import type { FlatConfigItem } from "../../types";
import { ensure, interop } from "../../utils";

export interface TailwindCSSOptions {
  /**
   * Glob patterns for files that includes tailwind classes.
   *
   * @default [GLOB_SRC]
   * @see https://github.com/luxass/eslint-config/blob/main/src/globs.ts
   */
  files?: string[];

  /**
   * Override rules for for files with tailwind classes.
   */
  overrides?: FlatConfigItem["rules"];
}

export async function tailwindcss(options: TailwindCSSOptions = {}): Promise<FlatConfigItem[]> {
  const {
    files = [GLOB_SRC],
    overrides,
  } = options;

  await ensure([
    "eslint-plugin-tailwindcss",
  ]);

  const [
    pluginTailwindCSS,
  ] = await Promise.all([
    interop(import("eslint-plugin-tailwindcss")),
  ] as const);

  return [
    {
      name: "luxass:tailwindcss:setup",
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      plugins: {
        tailwind: pluginTailwindCSS,
      },
    },
    {
      name: "luxass:tailwindcss:rules",
      files,
      rules: {
        // https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/classnames-order.md
        "tailwind/classnames-order": "warn",

        // https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/enforces-negative-arbitrary-values.md
        "tailwind/enforces-negative-arbitrary-values": "warn",

        // https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/enforces-shorthand.md
        "tailwind/enforces-shorthand": "warn",

        // https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/migration-from-tailwind-2.md
        "tailwind/migration-from-tailwind-2": "warn",

        // https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/no-arbitrary-value.md
        "tailwind/no-arbitrary-value": "off",

        // https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/no-contradicting-classname.md
        "tailwind/no-contradicting-classname": "error",

        // https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/no-custom-classname.md
        "tailwind/no-custom-classname": "warn",

        ...overrides,
      },
    },
  ];
}
