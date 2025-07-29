import type { TypedFlatConfigItem } from "../types";
import pluginUnicorn from "eslint-plugin-unicorn";

export interface UnicornOptions {
  /**
   * Include all rules recommended by `eslint-plugin-unicorn`, instead of only enabling a subset.
   *
   * @default false
   */
  allRecommended?: boolean;
}

export async function unicorn(options: UnicornOptions = {}): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "luxass/unicorn/rules",
      plugins: {
        unicorn: pluginUnicorn,
      },
      rules: {
        ...(options.allRecommended
          ? pluginUnicorn.configs.recommended.rules as any
          : {
              // Pass error message when throwing errors
              // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/error-message.md
              "unicorn/error-message": "error",

              // Uppercase regex escapes
              // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/escape-case.md
              "unicorn/escape-case": "error",

              // Array.isArray instead of instanceof
              // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-instanceof-builtins.md
              "unicorn/no-instanceof-builtins": "error",

              // Ban `new Array` as `Array` constructor's params are ambiguous
              // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-new-array.md
              "unicorn/no-new-array": "error",

              // Prevent deprecated `new Buffer()`
              // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-new-buffer.md
              "unicorn/no-new-buffer": "error",

              // Lowercase number formatting for octal, hex, binary (0x1'error' instead of 0X1'error')
              // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/number-literal-case.md
              "unicorn/number-literal-case": "error",

              // textContent instead of innerText
              // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-dom-node-text-content.md
              "unicorn/prefer-dom-node-text-content": "error",

              // includes over indexOf when checking for existence
              // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-includes.md
              "unicorn/prefer-includes": "error",

              // Prefer using the node: protocol
              // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-node-protocol.md
              "unicorn/prefer-node-protocol": "error",

              // Prefer using number properties like `Number.isNaN` rather than `isNaN`
              // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-number-properties.md
              "unicorn/prefer-number-properties": "error",

              // String methods startsWith/endsWith instead of more complicated stuff
              // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-string-starts-ends-with.md
              "unicorn/prefer-string-starts-ends-with": "error",

              // Enforce throwing type error when throwing error while checking typeof
              // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-type-error.md
              "unicorn/prefer-type-error": "error",

              // Use new when throwing error
              // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/throw-new-error.md
              "unicorn/throw-new-error": "error",
            }
        ),
      },
    },
  ];
}
