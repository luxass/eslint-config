import eslintCommentsPlugin from "@eslint-community/eslint-plugin-eslint-comments"
import type { FlatConfigItem } from "../types"

export async function comments(): Promise<FlatConfigItem[]> {
  return [
    {
      name: "luxass:eslint-comments",
      plugins: {
        "eslint-comments": eslintCommentsPlugin,
      },
      rules: {
        // https://github.com/eslint-community/eslint-plugin-eslint-comments/blob/main/docs/rules/disable-enable-pair.md
        "eslint-comments/disable-enable-pair": "error",

        // https://github.com/eslint-community/eslint-plugin-eslint-comments/blob/main/docs/rules/no-aggregating-enable.md
        "eslint-comments/no-aggregating-enable": "error",

        // https://github.com/eslint-community/eslint-plugin-eslint-comments/blob/main/docs/rules/no-duplicate-disable.md
        "eslint-comments/no-duplicate-disable": "error",

        // https://github.com/eslint-community/eslint-plugin-eslint-comments/blob/main/docs/rules/no-unlimited-disable.md
        "eslint-comments/no-unlimited-disable": "error",

        // Deprecated in favor of official reportUnusedDisableDirectives
        // https://github.com/eslint-community/eslint-plugin-eslint-comments/issues/133
        "eslint-comments/no-unused-enable": "off",
      },
    },
  ]
}
