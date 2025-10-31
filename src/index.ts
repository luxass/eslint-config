import type { Awaitable, ConfigNames, TypedFlatConfigItem } from "@antfu/eslint-config";
import type { Linter } from "eslint";
import type { FlatConfigComposer } from "eslint-flat-config-utils";
import type { OptionsConfig } from "./types";
import { antfu } from "@antfu/eslint-config";

export * from "./types";

/**
 * Construct an array of ESLint flat config items. Based on [@antfu/eslint-config](https://github.com/antfu/eslint-config)
 * @param options The options for generating the ESLint configurations.
 * @param userConfigs The user configurations to be merged with the generated configurations.
 * @returns The merged ESLint configurations.
 */
export function luxass(
  options?: OptionsConfig & Omit<TypedFlatConfigItem, "files">,
  ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.Config[]>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  return antfu({
    formatters: true,
    stylistic: {
      overrides: {
        "style/arrow-parens": [
          "error",
          "always",
          {
            requireForBlockBody: true,
          },
        ],
        "style/brace-style": [
          "error",
          "1tbs",
          {
            allowSingleLine: true,
          },
        ],
        ...(options?.stylistic as any)?.overrides,
      },
      quotes: "double",
      semi: true,
      ...(options?.stylistic as any),
    },
    ...options,
  }, ...userConfigs);
}

export default luxass;
