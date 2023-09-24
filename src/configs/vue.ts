import { type FlatESLintConfigItem } from 'eslint-define-config'
import { parserTs, parserVue, pluginVue } from '../plugins'
import { GLOB_VUE } from '../globs'

interface VueOptions {
  typescript?: boolean
}

export function vue(options: VueOptions = {}): FlatESLintConfigItem[] {
  return [
    {
      files: [GLOB_VUE],
      languageOptions: {
        globals: {
          $: 'readonly',
          $$: 'readonly',
          $computed: 'readonly',
          $customRef: 'readonly',
          $ref: 'readonly',
          $shallowRef: 'readonly',
          $toRef: 'readonly',
        },
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          extraFileExtensions: ['.vue'],
          parser: options.typescript ? (parserTs as any) : null,
          sourceType: 'module',
        },
      },
      plugins: {
        vue: pluginVue,
      },
      processor: pluginVue.processors['.vue'],
      rules: {
        ...(pluginVue.configs.base.rules as any),
        ...(pluginVue.configs['vue3-essential'].rules as any),
        ...(pluginVue.configs['vue3-strongly-recommended'].rules as any),
        ...(pluginVue.configs['vue3-recommended'].rules as any),

        'node/prefer-global/process': 'off',

        'vue/array-bracket-spacing': ['error', 'never'],
        'vue/arrow-spacing': ['error', { after: true, before: true }],
        'vue/block-order': [
          'error',
          {
            order: ['script', 'template', 'style'],
          },
        ],
        'vue/block-spacing': ['error', 'always'],
        'vue/block-tag-newline': [
          'error',
          {
            multiline: 'always',
            singleline: 'always',
          },
        ],
        'vue/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
        'vue/comma-dangle': ['error', 'always-multiline'],
        'vue/comma-spacing': ['error', { after: true, before: false }],

        'vue/comma-style': ['error', 'last'],
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'vue/component-options-name-casing': ['error', 'PascalCase'],
        'vue/custom-event-name-casing': ['error', 'camelCase'],
        'vue/define-macros-order': [
          'error',
          {
            order: [
              'defineOptions',
              'defineProps',
              'defineEmits',
              'defineSlots',
            ],
          },
        ],
        'vue/dot-location': ['error', 'property'],
        'vue/dot-notation': ['error', { allowKeywords: true }],
        'vue/eqeqeq': ['error', 'smart'],
        'vue/html-comment-content-spacing': [
          'error',
          'always',
          {
            exceptions: ['-'],
          },
        ],
        'vue/key-spacing': ['error', { afterColon: true, beforeColon: false }],
        'vue/keyword-spacing': ['error', { after: true, before: true }],
        'vue/max-attributes-per-line': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/no-dupe-keys': 'off',
        'vue/no-empty-pattern': 'error',
        'vue/no-extra-parens': ['error', 'functions'],
        'vue/no-irregular-whitespace': 'error',
        'vue/no-loss-of-precision': 'error',
        'vue/no-restricted-syntax': [
          'error',
          'DebuggerStatement',
          'LabeledStatement',
          'WithStatement',
        ],
        'vue/no-restricted-v-bind': ['error', '/^v-/'],
        'vue/no-setup-props-reactivity-loss': 'off',
        'vue/no-sparse-arrays': 'error',
        'vue/no-unused-refs': 'error',
        'vue/no-useless-v-bind': 'error',
        'vue/no-v-html': 'off',
        'vue/object-curly-newline': 'off',
        'vue/object-curly-spacing': ['error', 'always'],
        'vue/object-property-newline': [
          'error',
          { allowMultiplePropertiesPerLine: true },
        ],
        'vue/object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false,
          },
        ],
        'vue/operator-linebreak': ['error', 'before'],
        'vue/padding-line-between-blocks': ['error', 'always'],
        'vue/prefer-separate-static-class': 'error',
        'vue/prefer-template': 'error',
        'vue/quote-props': ['error', 'consistent-as-needed'],
        'vue/require-default-prop': 'off',
        'vue/require-prop-types': 'off',
        'vue/space-in-parens': ['error', 'never'],
        'vue/space-infix-ops': 'error',
        'vue/space-unary-ops': ['error', { nonwords: false, words: true }],
        'vue/template-curly-spacing': 'error',
      },
    },
  ]
}
