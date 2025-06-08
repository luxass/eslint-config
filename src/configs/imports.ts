import type { TypedFlatConfigItem } from "../types";
import type { StylisticConfig } from "./stylistic";
import pluginAntfu from "eslint-plugin-antfu";

export interface ImportsOptions {
  /**
   * Enable stylistic rules.
   *
   * @default true
   */
  stylistic?: boolean | StylisticConfig;
}

export async function imports(_options: ImportsOptions = {}): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "luxass/imports",
      plugins: {
        antfu: pluginAntfu,
      },
      rules: {
        "antfu/import-dedupe": "error",
        "antfu/no-import-dist": "error",
        "antfu/no-import-node-modules-by-path": "error",

      },
    },
  ];
}
