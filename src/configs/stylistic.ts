import type { StylisticCustomizeOptions } from "@stylistic/eslint-plugin";
import pluginAntfu from "eslint-plugin-antfu";
import type { FlatConfigItem } from "../types";
import { interop } from "../utils";

export type StylisticConfig = Pick<StylisticCustomizeOptions, "jsx" | "indent" | "quotes" | "semi">;

export const StylisticConfigDefaults: StylisticConfig = {
  indent: 2,
  jsx: true,
  quotes: "double",
  semi: true,
};

export interface StylisticOptions {
  /**
   * Enable stylistic rules.
   *
   * @default true
   */
  stylistic?: boolean | StylisticConfig

  /**
   * Overrides for the config.
   */
  overrides?: FlatConfigItem["rules"]
}

export async function stylistic(options: StylisticOptions = {}): Promise<FlatConfigItem[]> {
  const {
    indent,
    jsx,
    overrides = {},
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

        ...overrides,
      },
    },
  ];
}
