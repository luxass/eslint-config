import { GLOB_NEXTJS_OG, GLOB_NEXTJS_ROUTES, GLOB_SRC } from '../globs'
import type { TypedFlatConfigItem } from '../types'
import { ensure, interop, renameRules } from '../utils'

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
        nextjs: pluginNextjs,
      },
    },
    {
      name: 'luxass/nextjs/rules',
      files,
      rules: {
        ...renameRules(
          pluginNextjs.configs.recommended.rules,
          '@next/next/',
          'nextjs/',
        ),
        ...renameRules(
          pluginNextjs.configs['core-web-vitals'].rules,
          '@next/next/',
          'nextjs/',
        ),
        'nextjs/google-font-display': ['error'],
        'nextjs/google-font-preconnect': ['error'],
        'nextjs/inline-script-id': ['error'],
        'nextjs/next-script-for-ga': ['warn'],
        'nextjs/no-assign-module-variable': ['error'],
        'nextjs/no-css-tags': ['warn'],
        'nextjs/no-document-import-in-page': ['error'],
        'nextjs/no-duplicate-head': ['error'],
        'nextjs/no-head-element': ['warn'],
        'nextjs/no-head-import-in-document': ['error'],
        'nextjs/no-html-link-for-pages': ['off'],
        'nextjs/no-img-element': ['warn'],
        'nextjs/no-page-custom-font': ['warn'],
        'nextjs/no-script-component-in-head': ['error'],
        'nextjs/no-styled-jsx-in-document': ['warn'],
        'nextjs/no-sync-scripts': ['warn'],
        'nextjs/no-title-in-document-head': ['warn'],
        'nextjs/no-typos': ['warn'],
        'nextjs/no-unwanted-polyfillio': ['warn'],

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
        'nextjs/no-img-element': 'off',
        'react/no-unknown-property': ['error', {
          ignore: ['tw'],
        }],
      },
    },
  ]
}
