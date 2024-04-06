import { GLOB_SRC } from '../globs'
import type { TypedFlatConfigItem } from '../types'
import { ensure, interop } from '../utils'

export interface TailwindCSSOptions {
  /**
   * Glob patterns for files that includes tailwind classes.
   *
   * @default [GLOB_SRC]
   * @see https://github.com/luxass/eslint-config/blob/main/src/globs.ts
   */
  files?: string[]

  /**
   * Override rules for for files with tailwind classes.
   */
  overrides?: TypedFlatConfigItem['rules']
}

export async function tailwindcss(options: TailwindCSSOptions = {}): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_SRC],
    overrides,
  } = options

  await ensure([
    'eslint-plugin-tailwindcss',
  ])

  const [
    pluginTailwindCSS,
  ] = await Promise.all([
    interop(import('eslint-plugin-tailwindcss')),
  ] as const)

  return [
    {
      name: 'luxass/tailwindcss/setup',
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      plugins: {
        tailwindcss: pluginTailwindCSS,
      },
    },
    {
      name: 'luxass/tailwindcss/rules',
      files,
      rules: {
        // https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/classnames-order.md
        'tailwindcss/classnames-order': 'warn',

        // https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/enforces-negative-arbitrary-values.md
        'tailwindcss/enforces-negative-arbitrary-values': 'warn',

        // https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/enforces-shorthand.md
        'tailwindcss/enforces-shorthand': 'warn',

        // https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/migration-from-tailwind-2.md
        'tailwindcss/migration-from-tailwind-2': 'warn',

        // https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/no-arbitrary-value.md
        'tailwindcss/no-arbitrary-value': 'off',

        // https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/no-contradicting-classname.md
        'tailwindcss/no-contradicting-classname': 'error',

        // https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/no-custom-classname.md
        'tailwindcss/no-custom-classname': 'warn',

        ...overrides,
      },
    },
  ]
}
