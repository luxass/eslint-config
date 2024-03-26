import { isPackageExists } from 'local-pkg'
import { GLOB_JSX, GLOB_TSX } from '../globs'
import type { FlatConfigItem } from '../types'
import { ensure, interop } from '../utils'

export interface ReactOptions {
  /**
   * Override rules.
   */
  overrides?: FlatConfigItem['rules']

  /**
   * Enable TypeScript support.
   *
   * @default true
   */
  typescript?: boolean

  /**
   * Enable JSX A11y support.
   *
   * @default false
   */
  a11y?: boolean

  /**
   * Glob patterns for JSX & TSX files.
   *
   * @default [GLOB_JSX, GLOB_TSX]
   * @see https://github.com/luxass/eslint-config/blob/main/src/globs.ts
   */
  files?: string[]
}

export async function react(options: ReactOptions = {}): Promise<FlatConfigItem[]> {
  const {
    a11y = false,
    files = [GLOB_JSX, GLOB_TSX],
    overrides = {},
    typescript = true,
  } = options

  await ensure([
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
    'eslint-plugin-react-refresh',
    ...(options.a11y ? ['eslint-plugin-jsx-a11y'] : []),
  ])

  const [
    pluginReact,
    pluginReactHooks,
    pluginReactRefresh,
    pluginA11y,
  ] = await Promise.all([
    interop(import('eslint-plugin-react')),
    interop(import('eslint-plugin-react-hooks')),
    interop(import('eslint-plugin-react-refresh')),
    ...(a11y ? [interop(import('eslint-plugin-jsx-a11y'))] : []),
  ] as const)

  const isAllowConstantExport = isPackageExists('vite')

  return [
    {
      name: 'luxass:react:setup',
      plugins: {
        'react': pluginReact,
        'react-hooks': pluginReactHooks,
        'react-refresh': pluginReactRefresh,
        ...(a11y ? { 'jsx-a11y': pluginA11y } : {}),
      },
    },
    {
      name: 'luxass:react:rules',
      files,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      rules: {
        ...(a11y
          ? {
            // recommended rules for jsx-a11y
              'jsx-a11y/alt-text': 'error',
              'jsx-a11y/anchor-ambiguous-text': 'off',

              'jsx-a11y/anchor-has-content': 'error',

              'jsx-a11y/anchor-is-valid': 'error',
              'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
              'jsx-a11y/aria-props': 'error',
              'jsx-a11y/aria-proptypes': 'error',
              'jsx-a11y/aria-role': 'error',
              'jsx-a11y/aria-unsupported-elements': 'error',
              'jsx-a11y/autocomplete-valid': 'error',
              'jsx-a11y/click-events-have-key-events': 'error',
              'jsx-a11y/control-has-associated-label': [
                'off',
                {
                  ignoreElements: [
                    'audio',
                    'canvas',
                    'embed',
                    'input',
                    'textarea',
                    'tr',
                    'video',
                  ],
                  ignoreRoles: [
                    'grid',
                    'listbox',
                    'menu',
                    'menubar',
                    'radiogroup',
                    'row',
                    'tablist',
                    'toolbar',
                    'tree',
                    'treegrid',
                  ],
                  includeRoles: [
                    'alert',
                    'dialog',
                  ],
                },
              ],
              'jsx-a11y/heading-has-content': 'error',
              'jsx-a11y/html-has-lang': 'error',
              'jsx-a11y/iframe-has-title': 'error',
              'jsx-a11y/img-redundant-alt': 'error',
              'jsx-a11y/interactive-supports-focus': [
                'error',
                {
                  tabbable: [
                    'button',
                    'checkbox',
                    'link',
                    'searchbox',
                    'spinbutton',
                    'switch',
                    'textbox',
                  ],
                },
              ],
              'jsx-a11y/label-has-associated-control': 'error',
              'jsx-a11y/label-has-for': 'off',
              'jsx-a11y/media-has-caption': 'error',
              'jsx-a11y/mouse-events-have-key-events': 'error',
              'jsx-a11y/no-access-key': 'error',
              'jsx-a11y/no-autofocus': 'error',
              'jsx-a11y/no-distracting-elements': 'error',
              'jsx-a11y/no-interactive-element-to-noninteractive-role': [
                'error',
                {
                  canvas: [
                    'img',
                  ],
                  tr: [
                    'none',
                    'presentation',
                  ],
                },
              ],
              'jsx-a11y/no-noninteractive-element-interactions': [
                'error',
                {
                  alert: [
                    'onKeyUp',
                    'onKeyDown',
                    'onKeyPress',
                  ],
                  body: [
                    'onError',
                    'onLoad',
                  ],
                  dialog: [
                    'onKeyUp',
                    'onKeyDown',
                    'onKeyPress',
                  ],
                  handlers: [
                    'onClick',
                    'onError',
                    'onLoad',
                    'onMouseDown',
                    'onMouseUp',
                    'onKeyPress',
                    'onKeyDown',
                    'onKeyUp',
                  ],
                  iframe: [
                    'onError',
                    'onLoad',
                  ],
                  img: [
                    'onError',
                    'onLoad',
                  ],
                },
              ],
              'jsx-a11y/no-noninteractive-element-to-interactive-role': [
                'error',
                {
                  fieldset: [
                    'radiogroup',
                    'presentation',
                  ],
                  li: [
                    'menuitem',
                    'option',
                    'row',
                    'tab',
                    'treeitem',
                  ],
                  ol: [
                    'listbox',
                    'menu',
                    'menubar',
                    'radiogroup',
                    'tablist',
                    'tree',
                    'treegrid',
                  ],
                  table: [
                    'grid',
                  ],
                  td: [
                    'gridcell',
                  ],
                  ul: [
                    'listbox',
                    'menu',
                    'menubar',
                    'radiogroup',
                    'tablist',
                    'tree',
                    'treegrid',
                  ],
                },
              ],
              'jsx-a11y/no-noninteractive-tabindex': [
                'error',
                {
                  allowExpressionValues: true,
                  roles: [
                    'tabpanel',
                  ],
                  tags: [],
                },
              ],
              'jsx-a11y/no-redundant-roles': 'error',
              'jsx-a11y/no-static-element-interactions': [
                'error',
                {
                  allowExpressionValues: true,
                  handlers: [
                    'onClick',
                    'onMouseDown',
                    'onMouseUp',
                    'onKeyPress',
                    'onKeyDown',
                    'onKeyUp',
                  ],
                },
              ],
              'jsx-a11y/role-has-required-aria-props': 'error',
              'jsx-a11y/role-supports-aria-props': 'error',
              'jsx-a11y/scope': 'error',
              'jsx-a11y/tabindex-no-positive': 'error',
            }
          : {}),

        // recommended rules react
        'react/display-name': 'error',
        'react/jsx-key': 'error',

        'react/jsx-no-comment-textnodes': 'error',

        'react/jsx-no-duplicate-props': 'error',
        'react/jsx-no-target-blank': 'error',
        'react/jsx-no-undef': 'error',
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
        'react/no-children-prop': 'error',
        'react/no-danger-with-children': 'error',
        'react/no-deprecated': 'error',
        'react/no-direct-mutation-state': 'error',
        'react/no-find-dom-node': 'error',
        'react/no-is-mounted': 'error',
        'react/no-render-return-value': 'error',
        'react/no-string-refs': 'error',
        'react/no-unescaped-entities': 'error',
        'react/no-unknown-property': 'error',
        'react/no-unsafe': 'off',
        'react/prop-types': 'error',
        'react/react-in-jsx-scope': 'off',
        'react/require-render-return': 'error',

        // recommended rules react-hooks
        'react-hooks/exhaustive-deps': 'warn',
        'react-hooks/rules-of-hooks': 'error',

        // react refresh
        'react-refresh/only-export-components': ['warn', { allowConstantExport: isAllowConstantExport }],

        ...typescript
          ? {
              'react/jsx-no-undef': 'off',
              'react/prop-type': 'off',
            }
          : {},

        // overrides
        ...overrides,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
  ]
}
