import { GLOB_JSON, GLOB_JSON5, GLOB_JSONC } from "../globs";
import { interop } from "../utils";
import type { TypedFlatConfigItem } from "../types";
import type { StylisticConfig } from "./stylistic";

export interface JSONOptions {
  /**
   * Override rules.
   */
  overrides?: TypedFlatConfigItem["rules"];

  /**
   * Enable stylistic rules.
   *
   * @default true
   */
  stylistic?: boolean | StylisticConfig;

  /**
   * Glob patterns for JSON files.
   *
   * @default [GLOB_JSON,GLOB_JSON5,GLOB_JSONC]
   * @see https://github.com/luxass/eslint-config/blob/main/src/globs.ts
   */
  files?: string[];
}

export async function jsonc(
  options: JSONOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_JSON, GLOB_JSON5, GLOB_JSONC],
    overrides = {},
    stylistic = true,
  } = options;

  const {
    indent = 2,
  } = typeof stylistic === "boolean" ? {} : stylistic;

  const [
    pluginJsonc,
    parserJsonc,
  ] = await Promise.all([
    interop(import("eslint-plugin-jsonc")),
    interop(import("jsonc-eslint-parser")),
  ] as const);

  return [
    {
      name: "luxass/jsonc/setup",
      plugins: {
        jsonc: pluginJsonc as any,
      },
    },
    {
      name: "luxass/jsonc/rules",
      files,
      languageOptions: {
        parser: parserJsonc,
      },
      rules: {
        "jsonc/no-bigint-literals": "error",
        "jsonc/no-binary-expression": "error",
        "jsonc/no-binary-numeric-literals": "error",
        "jsonc/no-dupe-keys": "error",
        "jsonc/no-escape-sequence-in-identifier": "error",
        "jsonc/no-floating-decimal": "error",
        "jsonc/no-hexadecimal-numeric-literals": "error",
        "jsonc/no-infinity": "error",
        "jsonc/no-multi-str": "error",
        "jsonc/no-nan": "error",
        "jsonc/no-number-props": "error",
        "jsonc/no-numeric-separators": "error",
        "jsonc/no-octal": "error",
        "jsonc/no-octal-escape": "error",
        "jsonc/no-octal-numeric-literals": "error",
        "jsonc/no-parenthesized": "error",
        "jsonc/no-plus-sign": "error",
        "jsonc/no-regexp-literals": "error",
        "jsonc/no-sparse-arrays": "error",
        "jsonc/no-template-literals": "error",
        "jsonc/no-undefined-value": "error",
        "jsonc/no-unicode-codepoint-escapes": "error",
        "jsonc/no-useless-escape": "error",
        "jsonc/space-unary-ops": "error",
        "jsonc/valid-json-number": "error",
        "jsonc/vue-custom-block/no-parsing-error": "error",

        ...(stylistic
          ? {
              "jsonc/array-bracket-spacing": ["error", "never"],
              "jsonc/comma-dangle": ["error", "never"],
              "jsonc/comma-style": ["error", "last"],
              "jsonc/indent": ["error", indent],
              "jsonc/key-spacing": [
                "error",
                { afterColon: true, beforeColon: false },
              ],
              "jsonc/object-curly-newline": [
                "error",
                { consistent: true, multiline: true },
              ],
              "jsonc/object-curly-spacing": ["error", "always"],
              "jsonc/object-property-newline": [
                "error",
                { allowMultiplePropertiesPerLine: true },
              ],
              "jsonc/quote-props": "error",
              "jsonc/quotes": "error",
            }
          : {}),

        ...overrides,
      },
    },
  ];
}
