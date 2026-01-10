import type { Awaitable, ConfigNames, ConfigOptions, TypedFlatConfigItem } from "../../src";
import type { Linter } from "eslint";
import type { FlatConfigComposer } from "eslint-flat-config-utils";
import eslintApi from "eslint/use-at-your-own-risk";
import luxass from "../../src";

export async function createEslint(
  options: ConfigOptions & TypedFlatConfigItem = {},
  ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, ConfigNames> | Linter.Config[]>[]
): Promise<[normal: eslintApi.FlatESLint, fixer: eslintApi.FlatESLint]> {
  // disable editor detection to prevent flaky tests,
  // but only if not explicitly set
  if (options && !("isInEditor" in options)) {
    options.isInEditor = false;
  }

  const config = await luxass(options, ...userConfigs);

  return [
    new eslintApi.FlatESLint({
      baseConfig: config,
      // Don't look up config file
      overrideConfigFile: true,
    }),
    new eslintApi.FlatESLint({
      baseConfig: config,
      fix: true,
      // Don't look up config file
      overrideConfigFile: true,
    }),
  ];
}
