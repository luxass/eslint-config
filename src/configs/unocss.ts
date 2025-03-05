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
   * Path to the unocss config file.
   */
  configPath?: string;

  /**
   * Override rules for for files with unocss classes.
   */
  overrides?: TypedFlatConfigItem["rules"];
}

export async function unocss(options: UnoCSSOptions = {}): Promise<TypedFlatConfigItem[]> {
  const {
    attributify = true,
    configPath,
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
      name: "luxass/unocss",
      plugins: {
        unocss: pluginUnoCSS,
      },
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
      settings: {
        ...(configPath != null
          ? {
              unocss: {
                configPath,
              },
            }
          : {}),
      },
    },
  ];
}
