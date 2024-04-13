import eslintApi from 'eslint/use-at-your-own-risk'
import luxass, { type ConfigOptions } from '../../src'

export async function createEslint(options?: ConfigOptions): Promise<[normal: eslintApi.FlatESLint, fixer: eslintApi.FlatESLint]> {
  // disable editor detection to prevent flaky tests,
  // but only if not explicitly set
  if (options && !('editor' in options)) {
    options.editor = false
  }

  const config = await luxass(options)

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
  ]
}
