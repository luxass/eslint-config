import { GLOB_JSX, GLOB_TSX } from '../globs'
import type { TypedFlatConfigItem } from '../types'
import { ensure, interop } from '../utils'

export interface SolidOptions {
  /**
   * Override rules.
   */
  overrides?: TypedFlatConfigItem['rules']

  /**
   * Enable TypeScript support.
   *
   * @default true
   */
  typescript?: boolean

  /**
   * Glob patterns for JSX & TSX files.
   *
   * @default [GLOB_JSX, GLOB_TSX]
   * @see https://github.com/luxass/eslint-config/blob/main/src/globs.ts
   */
  files?: string[]
}

export async function solid(options: SolidOptions = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    typescript = true,
    files = [GLOB_JSX, GLOB_TSX],
  } = options

  await ensure([
    'eslint-plugin-solid',
  ])

  const [
    pluginSolid,
  ] = await Promise.all([
    interop(import('eslint-plugin-solid')),
  ] as const)

  return [
    {
      name: 'luxass/solid/setup',
      plugins: {
        solid: pluginSolid,
      },
    },
    {
      name: 'luxass/solid/rules',
      files,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
        sourceType: 'module',
      },
      rules: {
        // solid recommended rules
        // reactivity
        'solid/components-return-once': 'warn',
        'solid/event-handlers': 'warn',
        // these rules are mostly style suggestions
        'solid/imports': 'warn',
        // identifier usage is important
        'solid/jsx-no-duplicate-props': 'error',
        'solid/jsx-no-script-url': 'error',
        'solid/jsx-no-undef': 'error',
        'solid/jsx-uses-vars': 'error',
        'solid/no-array-handlers': 'off',
        'solid/no-destructure': 'error',
        // security problems
        'solid/no-innerhtml': 'error',
        // only necessary for resource-constrained environments
        'solid/no-proxy-apis': 'off',
        'solid/no-react-deps': 'warn',
        'solid/no-react-specific-props': 'warn',
        'solid/no-unknown-namespaces': 'error',
        // deprecated
        'solid/prefer-classlist': 'off',
        'solid/prefer-for': 'error',
        // handled by Solid compiler, opt-in style suggestion
        'solid/prefer-show': 'off',
        'solid/reactivity': 'warn',
        'solid/self-closing-comp': 'warn',
        'solid/style-prop': 'warn',

        ...typescript
          ? {
              'solid/jsx-no-undef': ['error', { typescriptEnabled: true }],
              // namespaces taken care of by TS
              'solid/no-unknown-namespaces': 'off',
            }
          : {},

        // overrides
        ...overrides,
      },
    },
  ]
}
