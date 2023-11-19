import type { FlatConfigItem, StylisticConfig } from "../types";
import { pluginAntfu } from "../plugins";
import { interop } from "../utils";

export async function stylistic(options: StylisticConfig = {}): Promise<FlatConfigItem[]> {
  const { indent = 2, jsx = true, quotes = "double", semi = true } = options;

  const pluginStylistic = await interop(import("@stylistic/eslint-plugin"));

  const config = pluginStylistic.configs.customize({
    flat: true,
    indent,
    jsx,
    pluginName: "style",
    quotes,
    semi,
  });

  return [
    {
      name: "luxass:stylistic",
      plugins: {
        antfu: pluginAntfu,
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,
        "antfu/consistent-list-newline": "error",
        "antfu/if-newline": "off",
        "antfu/indent-binary-ops": ["error", { indent }],
        "antfu/top-level-function": "error",
        "curly": ["error", "multi-line", "consistent"],
        "style/arrow-parens": ["error", "always", { requireForBlockBody: true }],
        "style/brace-style": ["error", "1tbs", { allowSingleLine: true }],
      },
    },
  ];
}
