import { GLOB_SRC } from '../globs'
import type { FlatConfigItem } from '../types'
import { ensure, interop } from '../utils'

export interface UnoCSSOptions {
  /**
   * Enable strict mode.
   *
   * @default false
   */
  strict?: boolean

  /**
   * Enable attributify mode.
   *
   * @default true
   */
  attributify?: boolean

  /**
   * Glob patterns for files that includes unocss classes.
   *
   * @default GLOB_SRC
   * @see https://github.com/luxass/eslint-config/blob/main/src/globs.ts
   */
  files?: string[]

  /**
   * Override rules for for files with unocss classes.
   */
  overrides?: FlatConfigItem['rules']
}

export async function unocss(options: UnoCSSOptions = {}): Promise<FlatConfigItem[]> {
  const {
    attributify = true,
    files = [GLOB_SRC],
    overrides,
    strict = false,
  } = options

  await ensure([
    '@unocss/eslint-plugin',
  ])

  const [
    pluginUnoCSS,
  ] = await Promise.all([
    interop(import('@unocss/eslint-plugin')),
  ] as const)

  return [
    {
      name: 'luxass:unocss',
      files,
      plugins: {
        unocss: pluginUnoCSS,
      },
      rules: {
        'unocss/order': 'warn',
        ...(attributify
          ? {
              'unocss/order-attributify': 'warn',
            }
          : {}),
        ...(strict
          ? {
              'unocss/blocklist': 'error',
            }
          : {}),

        ...overrides,
      },
    },
  ]
}
