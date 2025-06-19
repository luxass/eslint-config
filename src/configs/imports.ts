import type { TypedFlatConfigItem } from "../types";
import type { StylisticConfig } from "./stylistic";
import pluginAntfu from "eslint-plugin-antfu";
import pluginImportLite from "eslint-plugin-import-lite";

export interface ImportsOptions {
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

export async function imports(options: ImportsOptions = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    stylistic = true,
  } = options;
  return [
    {
      name: "luxass/imports",
      plugins: {
        antfu: pluginAntfu,
        import: pluginImportLite,
      },
      rules: {
        "antfu/import-dedupe": "error",
        "antfu/no-import-dist": "error",
        "antfu/no-import-node-modules-by-path": "error",

        "import/consistent-type-specifier-style": ["error", "top-level"],
        "import/first": "error",
        "import/no-duplicates": "error",
        "import/no-mutable-exports": "error",
        "import/no-named-default": "error",

        ...stylistic
          ? {
              "import/newline-after-import": ["error", { count: 1 }],
            }
          : {},

        ...overrides,
      },
    },
  ];
}
