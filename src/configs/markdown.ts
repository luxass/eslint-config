import { type FlatESLintConfigItem } from 'eslint-define-config'
import { TSPlugin, pluginMarkdown } from '../plugins'
import { GLOB_MARKDOWN, GLOB_SRC, GLOB_VUE } from '../globs'

interface MarkdownOptions {
  extensions?: string[]
}

export function markdown(
  options: MarkdownOptions = {},
): FlatESLintConfigItem[] {
  return [
    {
      files: [GLOB_MARKDOWN],
      plugins: {
        markdown: pluginMarkdown,
      },
      processor: 'markdown/markdown',
    },
    {
      files: [
        `${GLOB_MARKDOWN}/${GLOB_SRC}`,
        `${GLOB_MARKDOWN}/${GLOB_VUE}`,
        ...(options.extensions ?? []).map(
          (ext) => `${GLOB_MARKDOWN}/**/*${ext}`,
        ),
      ],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            impliedStrict: true,
          },
        },
      },
      plugins: {
        ts: TSPlugin as any,
      },
      rules: {
        ...pluginMarkdown.configs.recommended.overrides[1].rules,

        'antfu/no-cjs-expots': 'off',
        'antfu/no-ts-export-equal': 'off',

        'import/no-unresolved': 'off',

        'no-alert': 'off',
        'no-console': 'off',
        'no-restricted-imports': 'off',
        'no-undef': 'off',
        'no-unused-expressions': 'off',
        'no-unused-vars': 'off',

        'node/prefer-global/process': 'off',

        'ts/comma-dangle': 'off',
        'ts/consistent-type-imports': 'off',
        'ts/no-namespace': 'off',
        'ts/no-redeclare': 'off',
        'ts/no-require-imports': 'off',
        'ts/no-unused-vars': 'off',
        'ts/no-use-before-define': 'off',
        'ts/no-var-requires': 'off',

        'unused-imports/no-unused-imports': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
  ]
}
