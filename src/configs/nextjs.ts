import { GLOB_NEXTJS_OG, GLOB_NEXTJS_ROUTES, GLOB_SRC } from '../globs'
import type { TypedFlatConfigItem } from '../types'
import { ensure, interop } from '../utils'

export interface NextJSOptions {
  /**
   * Tell the plugin where the root directory is.
   * @see https://nextjs.org/docs/app/building-your-application/configuring/eslint#rootdir
   *
   * @default true
   */
  rootDir?: boolean | string

  /**
   * Override rules.
   */
  overrides?: TypedFlatConfigItem['rules']

  /**
   * Glob patterns for Next.js files.
   *
   * @default [GLOB_SRC]
   * @see https://github.com/luxass/eslint-config/blob/main/src/globs.ts
   */
  files?: string[]
}

export async function nextjs(
  options: NextJSOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_SRC],
    overrides,
    rootDir,
  } = options

  await ensure([
    '@next/eslint-plugin-next',
  ])

  const pluginNextjs = await interop(import('@next/eslint-plugin-next'))

  return [
    {
      name: 'luxass/nextjs/setup',
      plugins: {
        '@next/next': pluginNextjs,
      },
    },
    {
      name: 'luxass/nextjs/rules',
      files,
      rules: {
        ...pluginNextjs.configs.recommended.rules,
        ...pluginNextjs.configs['core-web-vitals'].rules,
        '@next/next/google-font-display': ['error'],
        '@next/next/google-font-preconnect': ['error'],
        '@next/next/inline-script-id': ['error'],
        '@next/next/next-script-for-ga': ['warn'],
        '@next/next/no-assign-module-variable': ['error'],
        '@next/next/no-css-tags': ['warn'],
        '@next/next/no-document-import-in-page': ['error'],
        '@next/next/no-duplicate-head': ['error'],
        '@next/next/no-head-element': ['warn'],
        '@next/next/no-head-import-in-document': ['error'],
        '@next/next/no-html-link-for-pages': ['off'],
        '@next/next/no-img-element': ['warn'],
        '@next/next/no-page-custom-font': ['warn'],
        '@next/next/no-script-component-in-head': ['error'],
        '@next/next/no-styled-jsx-in-document': ['warn'],
        '@next/next/no-sync-scripts': ['warn'],
        '@next/next/no-title-in-document-head': ['warn'],
        '@next/next/no-typos': ['warn'],
        '@next/next/no-unwanted-polyfillio': ['warn'],

        // "jsx-a11y/anchor-is-valid": ["off"],

        // This rule creates errors with webpack parsing on edge runtime
        'unicorn/prefer-node-protocol': ['off'],
        ...overrides,
      },
      settings: {
        next: {
          rootDir: rootDir ?? true,
        },
        react: {
          pragma: 'React',
          version: 'detect',
        },
      },
    },
    {
      name: 'luxass/nextjs/default-export-override',
      files: GLOB_NEXTJS_ROUTES,
      rules: {
        'import/prefer-default-export': 'error',
      },
    },
    {
      name: 'luxass/nextjs/og-override',
      files: GLOB_NEXTJS_OG,
      rules: {
        '@next/next/no-img-element': 'off',
        'react/no-unknown-property': ['error', {
          ignore: ['tw'],
        }],
      },
    },
  ]
}
