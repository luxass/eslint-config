import type { FlatConfigItem } from "../../types";
import { GLOB_TOML } from "../../globs";
import { interop } from "../../utils";
import type { StylisticConfig } from "../stylistic";

export interface TOMLOptions {
  /**
   * Override rules.
   */
  overrides?: FlatConfigItem["rules"];

  /**
   * Enable stylistic rules.
   *
   * @default true
   */
  stylistic?: boolean | StylisticConfig;

  /**
   * Glob patterns for TOML files.
   *
   * @default [GLOB_TOML]
   * @see https://github.com/luxass/eslint-config/blob/main/src/globs.ts
   */
  files?: string[];
}

export async function toml(
  options: TOMLOptions = {},
): Promise<FlatConfigItem[]> {
  const {
    files = [GLOB_TOML],
    overrides = {},
    stylistic = true,
  } = options;

  const {
    indent = 2,
  } = typeof stylistic === "boolean" ? {} : stylistic;

  const [
    pluginToml,
    parserToml,
  ] = await Promise.all([
    interop(import("eslint-plugin-toml")),
    interop(import("toml-eslint-parser")),
  ] as const);

  return [
    {
      name: "luxass:toml:setup",
      plugins: {
        toml: pluginToml,
      },
    },
    {
      name: "luxass:toml:rules",
      files,
      languageOptions: {
        parser: parserToml,
      },
      rules: {
        "style/spaced-comment": "off",

        "toml/comma-style": "error",
        "toml/keys-order": "error",
        "toml/no-space-dots": "error",
        "toml/no-unreadable-number-separator": "error",
        "toml/precision-of-fractional-seconds": "error",
        "toml/precision-of-integer": "error",
        "toml/tables-order": "error",

        "toml/vue-custom-block/no-parsing-error": "error",

        ...(stylistic
          ? {
              "toml/array-bracket-newline": "error",
              "toml/array-bracket-spacing": "error",
              "toml/array-element-newline": "error",
              "toml/indent": ["error", indent === "tab" ? 2 : indent],
              "toml/inline-table-curly-spacing": "error",
              "toml/key-spacing": "error",
              "toml/padding-line-between-pairs": "error",
              "toml/padding-line-between-tables": "error",
              "toml/quoted-keys": "error",
              "toml/spaced-comment": "error",
              "toml/table-bracket-spacing": "error",
            }
          : {}),

        ...overrides,
      },
    },
  ];
}
