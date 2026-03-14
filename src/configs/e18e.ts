import type { Linter } from "eslint";
import type { ProjectType, TypedFlatConfigItem } from "../types";
import pluginE18e from "@e18e/eslint-plugin";

export interface E18eOptions {
  /**
   * Include modernization rules
   *
   * @see https://github.com/e18e/eslint-plugin#modernization
   * @default true
   */
  modernization?: boolean;
  /**
   * Include module replacements rules
   *
   * @see https://github.com/e18e/eslint-plugin#module-replacements
   * @default options.isInEditor
   */
  moduleReplacements?: boolean;
  /**
   * Include performance improvements rules
   *
   * @see https://github.com/e18e/eslint-plugin#performance-improvements
   * @default true
   */
  performanceImprovements?: boolean;

  /**
   * Overrides for the config.
   */
  overrides?: TypedFlatConfigItem["rules"];

  /**
   * Whether the config is for an editor.
   * @default false
   */
  isInEditor?: boolean;

  /**
   * Type of the project. `lib` will enable more strict rules for libraries.
   *
   * @default "app"
   */
  type?: ProjectType;
}

export async function e18e(options: E18eOptions = {}): Promise<TypedFlatConfigItem[]> {
  const {
    isInEditor = false,
    modernization = true,
    type = "app",
    moduleReplacements = type === "lib" && isInEditor,
    overrides = {},
    performanceImprovements = true,
  } = options;

  // TODO: better type needed on the e18e side
  const configs = pluginE18e.configs as Record<string, Linter.Config>;

  return [
    {
      name: "luxass/e18e/rules",
      plugins: {
        e18e: pluginE18e,
      },
      rules: {
        ...modernization ? { ...configs.modernization.rules } : {},
        ...moduleReplacements ? { ...configs.moduleReplacements!.rules } : {},
        ...performanceImprovements ? { ...configs.performanceImprovements!.rules } : {},
        ...overrides,
      },
    },
  ];
}
