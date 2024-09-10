import { ensure, interop } from "../utils";
import type { TypedFlatConfigItem } from "../types";

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
    overrides,
    strict = false,
    configPath,
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
      settings: {
        ...(configPath != null
          ? {
              unocss: {
                configPath,
              },
            }
          : {}),
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
    },
  ];
}
