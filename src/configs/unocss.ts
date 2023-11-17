import type { FlatConfigItem } from "../types";
import { interop } from "../utils";

export async function unocss(): Promise<FlatConfigItem[]> {
  const pluginUnoCSS = await interop(import("@unocss/eslint-plugin"));
  return [
    {
      name: "luxass:unocss",
      plugins: {
        "@unocss": pluginUnoCSS,
      },
      rules: {
        ...pluginUnoCSS.configs.recommended.rules,
      },
    },
  ];
}
