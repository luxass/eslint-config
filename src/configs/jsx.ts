import type { TypedFlatConfigItem } from "../types";
import { GLOB_JSX, GLOB_TSX } from "../globs";
import { ensure, interop } from "../utils";

export interface JsxA11yOptions {
  /**
   * Overrides for the config.
   */
  overrides?: TypedFlatConfigItem["rules"];
}

export interface JsxOptions {
  /**
   * Enable JSX accessibility rules.
   *
   * Requires installing:
   * - `eslint-plugin-jsx-a11y`
   *
   * Can be a boolean or an object for custom options and overrides.
   * @default false
   */
  a11y?: boolean | JsxA11yOptions;
}

export async function jsx(options: JsxOptions = {}): Promise<TypedFlatConfigItem[]> {
  const { a11y } = options;

  // Base JSX configuration without a11y
  const baseConfig: TypedFlatConfigItem = {
    files: [GLOB_JSX, GLOB_TSX],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    name: "luxass/jsx/setup",
    plugins: {},
    rules: {},
  };

  // Return early if no a11y configuration is needed
  if (!a11y) {
    return [baseConfig];
  }

  await ensure(["eslint-plugin-jsx-a11y"]);
  const jsxA11yPlugin = await interop(import("eslint-plugin-jsx-a11y"));
  const a11yConfig = jsxA11yPlugin.flatConfigs.recommended;

  const a11yRules = {
    ...(a11yConfig.rules || {}),
    ...(typeof a11y === "object" && a11y.overrides ? a11y.overrides : {}),
  };

  // Merge base config with a11y configuration
  return [
    {
      ...baseConfig,
      ...a11yConfig,
      files: baseConfig.files,
      languageOptions: {
        ...baseConfig.languageOptions,
        ...a11yConfig.languageOptions,
      },
      name: baseConfig.name,
      plugins: {
        ...baseConfig.plugins,
        "jsx-a11y": jsxA11yPlugin,
      },
      rules: {
        ...baseConfig.rules,
        ...a11yRules,
      },
    },
  ];
}
