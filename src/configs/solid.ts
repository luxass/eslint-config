import { GLOB_JSX, GLOB_TSX } from '../globs'
import type { TypedFlatConfigItem } from '../types'
import { ensure, interop, toArray } from '../utils'

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
   * When this options is provided, type aware rules will be enabled.
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  tsconfigPath?: string | string[]

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

  const tsconfigPath = options?.tsconfigPath
    ? toArray(options.tsconfigPath)
    : undefined
  const isTypeAware = !!tsconfigPath

  const [
    pluginSolid,
    parserTs,
  ] = await Promise.all([
    interop(import('eslint-plugin-solid')),
    interop(import('@typescript-eslint/parser')),
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
        parser: parserTs,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          ...(isTypeAware ? { project: tsconfigPath } : {}),
        },
        sourceType: 'module',
      },
      rules: {
        // reactivity
        'solid/components-return-once': 'warn',
        'solid/event-handlers': ['error', {
          // if true, don't warn on ambiguously named event handlers like `onclick` or `onchange`
          ignoreCase: false,
          // if true, warn when spreading event handlers onto JSX. Enable for Solid < v1.6.
          warnOnSpread: false,
        }],

        // these rules are mostly style suggestions
        'solid/imports': 'error',
        // identifier usage is important
        'solid/jsx-no-duplicate-props': 'error',
        'solid/jsx-no-script-url': 'error',
        'solid/jsx-no-undef': 'error',
        'solid/jsx-uses-vars': 'error',
        'solid/no-destructure': 'error',

        // security problems
        'solid/no-innerhtml': ['error', { allowStatic: true }],
        'solid/no-react-deps': 'error',
        'solid/no-react-specific-props': 'error',
        'solid/no-unknown-namespaces': 'error',
        'solid/prefer-for': 'error',
        'solid/reactivity': 'warn',
        'solid/self-closing-comp': 'error',
        'solid/style-prop': ['error', { styleProps: ['style', 'css'] }],

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
