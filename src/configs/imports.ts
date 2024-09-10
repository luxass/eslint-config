import pluginAntfu from "eslint-plugin-antfu";
import pluginImport from "eslint-plugin-import-x";
import type { TypedFlatConfigItem } from "../types";
import type { StylisticConfig } from "./stylistic";

export interface ImportsOptions {
  /**
   * Enable stylistic rules.
   *
   * @default true
   */
  stylistic?: boolean | StylisticConfig;
}

export async function imports(options: ImportsOptions = {}): Promise<TypedFlatConfigItem[]> {
  const {
    stylistic = true,
  } = options;

  return [
    {
      name: "luxass/imports",
      plugins: {
        antfu: pluginAntfu,
        import: pluginImport,
      },
      rules: {
        "antfu/import-dedupe": "error",
        "antfu/no-import-dist": "error",
        "antfu/no-import-node-modules-by-path": "error",

        "import/first": "error",
        "import/no-duplicates": "error",
        "import/no-mutable-exports": "error",
        "import/no-named-default": "error",
        "import/no-self-import": "error",
        "import/no-webpack-loader-syntax": "error",

        ...stylistic
          ? {
              "import/newline-after-import": ["error", { count: 1 }],
            }
          : {},
      },
    },
  ];
}
