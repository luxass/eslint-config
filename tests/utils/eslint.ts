import eslintApi from "eslint/use-at-your-own-risk";
import { type ConfigOptions, luxass } from "../../src";

export async function createEslint(options?: ConfigOptions): Promise<[normal: eslintApi.FlatESLint, fixer: eslintApi.FlatESLint]> {
  const config = await luxass(options);
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
