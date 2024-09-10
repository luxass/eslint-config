import { GLOB_JSX, GLOB_TSX } from "../globs";
import type { TypedFlatConfigItem } from "../types";

export async function jsx(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "luxass/jsx/setup",
      files: [GLOB_JSX, GLOB_TSX],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
    },
  ];
}
