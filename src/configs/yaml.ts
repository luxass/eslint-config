import type { TypedFlatConfigItem } from '../types'
import { GLOB_YAML } from '../globs'
import { interop } from '../utils'
import type { StylisticConfig } from './stylistic'

export interface YAMLOptions {
  /**
   * Override rules.
   */
  overrides?: TypedFlatConfigItem['rules']

  /**
   * Enable stylistic rules.
   *
   * @default true
   */
  stylistic?: boolean | StylisticConfig

  /**
   * Glob patterns for YAML files.
   *
   * @default GLOB_YAML
   * @see https://github.com/luxass/eslint-config/blob/main/src/globs.ts
   */
  files?: string[]
}

export async function yaml(
  options: YAMLOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_YAML],
    overrides = {},
    stylistic = true,
  } = options

  const [
    pluginYaml,
    parserYaml,
  ] = await Promise.all([
    interop(import('eslint-plugin-yml')),
    interop(import('yaml-eslint-parser')),
  ] as const)

  const {
    indent = 2,
    quotes = 'single',
  } = typeof stylistic === 'boolean' ? {} : stylistic

  return [
    {
      name: 'luxass/yaml/setup',
      plugins: {
        yaml: pluginYaml,
      },
    },
    {
      name: 'luxass/yaml/rules',
      files,
      languageOptions: {
        parser: parserYaml,
      },
      rules: {
        'style/spaced-comment': 'off',

        'yaml/block-mapping': 'error',
        'yaml/block-sequence': 'error',
        'yaml/no-empty-key': 'error',
        'yaml/no-empty-mapping-value': 'error',
        'yaml/no-empty-sequence-entry': 'error',
        'yaml/no-irregular-whitespace': 'error',
        'yaml/plain-scalar': 'error',

        'yaml/vue-custom-block/no-parsing-error': 'error',

        ...(stylistic
          ? {
              'yaml/block-mapping-question-indicator-newline': 'error',
              'yaml/block-sequence-hyphen-indicator-newline': 'error',
              'yaml/flow-mapping-curly-newline': 'error',
              'yaml/flow-mapping-curly-spacing': 'error',
              'yaml/flow-sequence-bracket-newline': 'error',
              'yaml/flow-sequence-bracket-spacing': 'error',
              'yaml/indent': ['error', indent === 'tab' ? 2 : indent],
              'yaml/key-spacing': 'error',
              'yaml/no-tab-indent': 'error',
              'yaml/quotes': [
                'error',
                { avoidEscape: false, prefer: quotes },
              ],
              'yaml/spaced-comment': 'error',
            }
          : {}),

        ...overrides,
      },
    },
    {
      name: 'luxass/yaml/github-actions',
      files: ['**/.github/workflows/*.{yml,yaml}'],
      rules: {
        // GitHub Actions supports empty values to enable features
        'yaml/no-empty-mapping-value': 'off',
      },
    },
  ]
}
