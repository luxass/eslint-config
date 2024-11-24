import type { TypedFlatConfigItem } from "../types";
import eslintCommentsPlugin from "@eslint-community/eslint-plugin-eslint-comments";

export async function comments(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "luxass/eslint-comments",
      plugins: {
        "eslint-comments": eslintCommentsPlugin,
      },
      rules: {
        // https://github.com/eslint-community/eslint-plugin-eslint-comments/blob/main/docs/rules/no-aggregating-enable.md
        "eslint-comments/no-aggregating-enable": "error",

        // https://github.com/eslint-community/eslint-plugin-eslint-comments/blob/main/docs/rules/no-duplicate-disable.md
        "eslint-comments/no-duplicate-disable": "error",

        // https://github.com/eslint-community/eslint-plugin-eslint-comments/blob/main/docs/rules/no-unlimited-disable.md
        "eslint-comments/no-unlimited-disable": "error",

        // https://github.com/eslint-community/eslint-plugin-eslint-comments/blob/main/docs/rules/no-unused-enable.md
        "eslint-comments/no-unused-enable": "error",
      },
    },
  ];
}
