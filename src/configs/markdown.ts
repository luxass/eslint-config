import { mergeProcessors, processorPassThrough } from 'eslint-merge-processors'
import type {
  TypedFlatConfigItem,
} from '../types'
import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_IN_MARKDOWN } from '../globs'
import { interop, parserPlain } from '../utils'

export interface MarkdownOptions {
  /**
   * Override rules.
   */
  overrides?: TypedFlatConfigItem['rules']

  /**
   * Additional extensions for components.
   *
   * @example ["vue"]
   * @default []
   */
  exts?: string[]

  /**
   * Glob patterns for Markdown files.
   *
   * @default [GLOB_MARKDOWN]
   * @see https://github.com/luxass/eslint-config/blob/main/src/globs.ts
   */
  files?: string[]
}

export async function markdown(
  options: MarkdownOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    exts = [],
    files = [GLOB_MARKDOWN],
    overrides = {},
  } = options

  const markdown = await interop(import('eslint-plugin-markdown'))

  return [
    {
      name: 'luxass/markdown/setup',
      plugins: {
        markdown,
      },
    },
    {
      name: 'luxass/markdown/processor',
      files,
      ignores: [GLOB_MARKDOWN_IN_MARKDOWN],
      // `eslint-plugin-markdown` only creates virtual files for code blocks,
      // but not the markdown file itself. We use `eslint-merge-processors` to
      // add a pass-through processor for the markdown file itself.
      processor: mergeProcessors([
        markdown.processors.markdown,
        processorPassThrough,
      ]),
    },
    {
      name: 'luxass/markdown/parser',
      files,
      languageOptions: {
        parser: parserPlain,
      },
    },
    {
      name: 'luxass/markdown/disables',
      files: [
        GLOB_MARKDOWN_CODE,
        ...exts.map((ext) => `${GLOB_MARKDOWN}/**/*.${ext}`),
      ],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            impliedStrict: true,
          },
        },
      },
      rules: {
        'import/newline-after-import': 'off',

        'no-alert': 'off',
        'no-console': 'off',
        'no-undef': 'off',
        'no-unused-expressions': 'off',

        'no-unused-vars': 'off',

        'node/prefer-global/process': 'off',
        'style/comma-dangle': 'off',

        'style/eol-last': 'off',
        // Type aware rules
        'ts/await-thenable': 'off',
        'ts/consistent-type-imports': 'off',
        'ts/dot-notation': 'off',
        'ts/no-floating-promises': 'off',
        'ts/no-for-in-array': 'off',
        'ts/no-implied-eval': 'off',
        'ts/no-misused-promises': 'off',

        'ts/no-namespace': 'off',
        'ts/no-redeclare': 'off',
        'ts/no-require-imports': 'off',

        'ts/no-throw-literal': 'off',
        'ts/no-unnecessary-type-assertion': 'off',
        'ts/no-unsafe-argument': 'off',
        'ts/no-unsafe-assignment': 'off',
        'ts/no-unsafe-call': 'off',
        'ts/no-unsafe-member-access': 'off',
        'ts/no-unsafe-return': 'off',
        'ts/no-unused-vars': 'off',
        'ts/no-use-before-define': 'off',
        'ts/no-var-requires': 'off',
        'ts/restrict-plus-operands': 'off',
        'ts/restrict-template-expressions': 'off',
        'ts/unbound-method': 'off',
        'unicode-bom': 'off',
        'unused-imports/no-unused-imports': 'off',
        'unused-imports/no-unused-vars': 'off',

        ...overrides,
      },
    },
  ]
}
