import type { FlatConfigItem } from '../types'
import { GLOB_TESTS } from '../globs'
import { interop } from '../utils'

export interface TestOptions {
  /**
   * Disable some rules when eslint is run in an editor.
   *
   * @default false
   */
  editor?: boolean

  /**
   * Glob patterns for test files.
   *
   * @default GLOB_TESTS
   * @see https://github.com/luxass/eslint-config/blob/main/src/globs.ts
   */
  files?: string[]

  /**
   * Override rules for for test files.
   */
  overrides?: FlatConfigItem['rules']
}

export async function test(
  options: TestOptions = {},
): Promise<FlatConfigItem[]> {
  const {
    editor = false,
    files = GLOB_TESTS,
    overrides = {},
  } = options

  const [
    pluginVitest,
  ] = await Promise.all([
    interop(import('eslint-plugin-vitest')),
  ] as const)

  return [
    {
      name: 'luxass:test:setup',
      plugins: {
        test: {
          ...pluginVitest,
          rules: {
            ...pluginVitest.rules,
          },
        },
      },
    },
    {
      name: 'luxass:test:rules',
      files,
      rules: {
        'test/consistent-test-it': [
          'error',
          { fn: 'it', withinDescribe: 'it' },
        ],
        'test/no-identical-title': 'error',
        'test/no-focused-tests': editor ? 'off' : 'error',
        'test/prefer-hooks-in-order': 'error',

        'test/prefer-lowercase-title': 'error',
        ...overrides,
      },
    },
  ]
}
