import type { FlatConfigItem, OverrideOptions, StylisticOptions } from "../types";
import { GLOB_YAML } from "../globs";
import { interop } from "../utils";

export async function yaml(
  options: OverrideOptions & StylisticOptions = {},
): Promise<FlatConfigItem[]> {
  const { overrides = {}, stylistic = true } = options;

  const [
    pluginYaml,
    parserYaml,
  ] = await Promise.all([
    interop(import("eslint-plugin-yml")),
    interop(import("yaml-eslint-parser")),
  ] as const);

  return [
    {
      name: "luxass:yaml:setup",
      plugins: {
        yaml: pluginYaml as any,
      },
    },
    {
      files: [GLOB_YAML],
      languageOptions: {
        parser: parserYaml,
      },
      name: "luxass:yaml:rules",
      rules: {
        "style/spaced-comment": "off",

        "yaml/block-mapping": "error",
        "yaml/block-sequence": "error",
        "yaml/no-empty-key": "error",
        "yaml/no-empty-sequence-entry": "error",
        "yaml/no-irregular-whitespace": "error",
        "yaml/plain-scalar": "error",

        "yaml/vue-custom-block/no-parsing-error": "error",

        ...(stylistic
          ? {
              "yaml/block-mapping-question-indicator-newline": "error",
              "yaml/block-sequence-hyphen-indicator-newline": "error",
              "yaml/flow-mapping-curly-newline": "error",
              "yaml/flow-mapping-curly-spacing": "error",
              "yaml/flow-sequence-bracket-newline": "error",
              "yaml/flow-sequence-bracket-spacing": "error",
              "yaml/indent": ["error", 2],
              "yaml/key-spacing": "error",
              "yaml/no-tab-indent": "error",
              "yaml/quotes": [
                "error",
                { avoidEscape: false, prefer: "double" },
              ],
              "yaml/spaced-comment": "error",
            }
          : {}),

        ...overrides,
      },
    },
  ];
}
