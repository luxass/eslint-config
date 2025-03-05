import type { StylisticCustomizeOptions } from "@stylistic/eslint-plugin";
import type { TypedFlatConfigItem } from "../types";
import pluginAntfu from "eslint-plugin-antfu";
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
  stylistic?: boolean | StylisticConfig;

  /**
   * Overrides for the config.
   */
  overrides?: TypedFlatConfigItem["rules"];
}

export async function stylistic(options: StylisticOptions = {}): Promise<TypedFlatConfigItem[]> {
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
      name: "luxass/stylistic",
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

        "style/generator-star-spacing": ["error", { after: true, before: false }],
        "style/yield-star-spacing": ["error", { after: true, before: false }],

        ...overrides,
      },
    },
  ];
}
