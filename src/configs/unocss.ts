import { GLOB_SRC } from "../globs";
import type { FlatConfigItem, OverrideOptions, UnoCSSOptions } from "../types";
import { interop } from "../utils";

export async function unocss(options: UnoCSSOptions & OverrideOptions): Promise<FlatConfigItem[]> {
  const pluginUnoCSS = await interop(import("@unocss/eslint-plugin"));
  const {
    attributify = false,
    overrides = {},
  } = options;

  return [
    {
      files: [
        GLOB_SRC,
      ],
      name: "luxass:unocss",
      plugins: {
        "@unocss": pluginUnoCSS,
      },
      rules: {
        "unocss/order": "error",
        ...attributify && { "unocss/attributify": "error" },
        "unocss/blocklist": "error",

        // overrides
        ...overrides,
      },
    },
  ];
}
