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
  const opts = merge({
    formatters: true,
    rules: {
      "n/prefer-global/process": "off",

      "no-console": "warn",
      "no-debugger": "warn",
    },
    stylistic: {
      arrowParens: true,
      braceStyle: "1tbs",
      quotes: "double",
      semi: true,
    },
  } as Omit<TypedFlatConfigItem, "files">, options);

  return antfu(opts, ...userConfigs);
}

export default luxass;

function merge(defaults: any, overrides: any): any {
  const result = { ...defaults };
  for (const key in overrides) {
    if (Object.prototype.hasOwnProperty.call(overrides, key)) {
      const overrideValue = overrides[key];
      const defaultValue = result[key];
      if (typeof overrideValue === "object" && overrideValue !== null && typeof defaultValue === "object" && defaultValue !== null) {
        result[key] = merge(defaultValue, overrideValue);
      }
      else {
        result[key] = overrideValue;
      }
    }
  }
  return result;
}
