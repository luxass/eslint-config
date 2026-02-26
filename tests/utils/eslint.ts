import type { Linter } from "eslint";
import type { FlatConfigComposer } from "eslint-flat-config-utils";
import type { Awaitable, ConfigNames, ConfigOptions, TypedFlatConfigItem } from "../../src";
import eslintApi from "eslint";
import luxass from "../../src";

export async function createEslint(
  options: ConfigOptions & TypedFlatConfigItem = {},
  ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, ConfigNames> | Linter.Config[]>[]
): Promise<[normal: eslintApi.ESLint, fixer: eslintApi.ESLint]> {
  // disable editor detection to prevent flaky tests,
  // but only if not explicitly set
  if (options && !("isInEditor" in options)) {
    options.isInEditor = false;
  }

  const config = await luxass(options, ...userConfigs);

  return [
    new eslintApi.ESLint({
      baseConfig: config,
      // Don't look up config file
      overrideConfigFile: true,
    }),
    new eslintApi.ESLint({
      baseConfig: config,
      fix: true,
      // Don't look up config file
      overrideConfigFile: true,
    }),
  ];
}
