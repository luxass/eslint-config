import { GLOB_SRC } from "../globs";
import type { TypedFlatConfigItem } from "../types";
import { ensure, interop } from "../utils";

export interface UnoCSSOptions {
  /**
   * Enable strict mode.
   *
   * @default false
   */
  strict?: boolean;

  /**
   * Enable attributify mode.
   *
   * @default true
   */
  attributify?: boolean;

  /**
   * Glob patterns for files that includes unocss classes.
   *
   * @default [GLOB_SRC]
   * @see https://github.com/luxass/eslint-config/blob/main/src/globs.ts
   */
  files?: string[];

  /**
   * Override rules for for files with unocss classes.
   */
  overrides?: TypedFlatConfigItem["rules"];
}

export async function unocss(options: UnoCSSOptions = {}): Promise<TypedFlatConfigItem[]> {
  const {
    attributify = true,
    files = [GLOB_SRC],
    overrides,
    strict = false,
  } = options;

  await ensure([
    "@unocss/eslint-plugin",
  ]);

  const [
    pluginUnoCSS,
  ] = await Promise.all([
    interop(import("@unocss/eslint-plugin")),
  ] as const);

  return [
    {
      name: "luxass/unocss/setup",
      plugins: {
        unocss: pluginUnoCSS,
      },
    },
    {
      name: "luxass/unocss/rules",
      files,
      rules: {
        "unocss/order": "warn",
        ...(attributify
          ? {
              "unocss/order-attributify": "warn",
            }
          : {}),
        ...(strict
          ? {
              "unocss/blocklist": "error",
            }
          : {}),

        ...overrides,
      },
    },
  ];
}
