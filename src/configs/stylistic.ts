import type { StylisticCustomizeOptions } from "@stylistic/eslint-plugin";
import type { TypedFlatConfigItem } from "../types";
import pluginAntfu from "eslint-plugin-antfu";
import { interop } from "../utils";

export type StylisticConfig = Pick<StylisticCustomizeOptions, "jsx" | "indent" | "quotes" | "semi" | "braceStyle" | "experimental">;

export const StylisticConfigDefaults: StylisticConfig = {
  braceStyle: "1tbs",
  experimental: false,
  indent: 2,
  jsx: true,
  quotes: "double",
  semi: true,
};

export interface StylisticOptions extends StylisticConfig {
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
    braceStyle,
    experimental,
    indent,
    jsx,
    overrides = {},
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...typeof options.stylistic === "object" ? options.stylistic : {},
    ...options,
  };

  const pluginStylistic = await interop(import("@stylistic/eslint-plugin"));

  const config = pluginStylistic.configs.customize({
    braceStyle,
    experimental,
    indent,
    jsx,
    pluginName: "style",
    quotes,
    semi,
  }) as TypedFlatConfigItem;

  return [
    {
      name: "luxass/stylistic",
      plugins: {
        antfu: pluginAntfu,
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,
        ...experimental ? {} : { "antfu/consistent-list-newline": "error" },
        "antfu/if-newline": "off",
        "antfu/top-level-function": "error",

        "curly": ["error", "multi-line", "consistent"],
        "style/arrow-parens": ["error", "always", { requireForBlockBody: true }],
        "style/brace-style": ["error", braceStyle, { allowSingleLine: true }],

        "style/generator-star-spacing": ["error", { after: true, before: false }],
        "style/yield-star-spacing": ["error", { after: true, before: false }],

        ...overrides,
      },
    },
  ];
}
