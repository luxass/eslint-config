import type { FlatConfigItem, StylisticConfig } from "../types";
import { pluginAntfu } from "../plugins";
import { interop } from "../utils";

export const StylisticConfigDefaults: StylisticConfig = {
  indent: 2,
  jsx: true,
  quotes: "double",
  semi: true,
};

export async function stylistic(options: StylisticConfig = {}): Promise<FlatConfigItem[]> {
  const {
    indent,
    jsx,
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...options,
  };

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
        "antfu/top-level-function": "error",

        "curly": ["error", "multi-line", "consistent"],
        "style/arrow-parens": ["error", "always", { requireForBlockBody: true }],
        "style/brace-style": ["error", "1tbs", { allowSingleLine: true }],
      },
    },
  ];
}
