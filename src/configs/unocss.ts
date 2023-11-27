import { GLOB_SRC } from "../globs";
import type { FlatConfigItem, OverrideOptions, UnoCSSOptions } from "../types";
import { ensure, interop } from "../utils";

export async function unocss(options: UnoCSSOptions & OverrideOptions): Promise<FlatConfigItem[]> {
  const {
    attributify = true,
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
      files: [
        GLOB_SRC,
      ],
      name: "luxass:unocss",
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

        // overrides
        ...overrides,
      },
    },
  ];
}
