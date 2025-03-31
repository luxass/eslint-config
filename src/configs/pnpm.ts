import type { TypedFlatConfigItem } from "../types";
import { interop } from "../utils";

export async function pnpm(): Promise<TypedFlatConfigItem[]> {
  const [
    pluginPnpm,
    yamlParser,
    jsoncParser,
  ] = await Promise.all([
    interop(import("eslint-plugin-pnpm")),
    interop(import("yaml-eslint-parser")),
    interop(import("jsonc-eslint-parser")),
  ]);

  return [
    {
      files: [
        "package.json",
        "**/package.json",
      ],
      languageOptions: {
        parser: jsoncParser,
      },
      name: "luxass/pnpm/package-json",
      plugins: {
        pnpm: pluginPnpm,
      },
      rules: {
        "pnpm/json-enforce-catalog": "error",
        "pnpm/json-prefer-workspace-settings": "error",
        "pnpm/json-valid-catalog": "error",
      },
    },
    {
      files: ["pnpm-workspace.yaml"],
      languageOptions: {
        parser: yamlParser,
      },
      name: "luxass/pnpm/pnpm-workspace-yaml",
      plugins: {
        pnpm: pluginPnpm,
      },
      rules: {
        "pnpm/yaml-no-duplicate-catalog-item": "error",
        "pnpm/yaml-no-unused-catalog-item": "error",
      },
    },
  ];
}
