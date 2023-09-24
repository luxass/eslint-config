import { type FlatESLintConfigItem } from 'eslint-define-config'
import { GLOB_TS, GLOB_TSX } from '../globs'
import { TSPlugin, parserTs, pluginAntfu, pluginImport } from '../plugins'
import { renameRules } from '../utils'

interface TypeScriptOptions {
  extensions?: string[]
}

export function typescript(
  options: TypeScriptOptions = {},
): FlatESLintConfigItem[] {
  return [
    {
      files: [
        GLOB_TS,
        GLOB_TSX,
        ...(options.extensions ?? []).map((ext) => `**/*${ext}`),
      ],
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          sourceType: 'module',
        },
      },
      plugins: {
        antfu: pluginAntfu,
        import: pluginImport,
        ts: TSPlugin,
      },
      rules: {
        ...renameRules(
          TSPlugin.configs['eslint-recommended'].overrides![0].rules!,
          '@typescript-eslint/',
          'ts/',
        ),
        ...renameRules(
          TSPlugin.configs.strict.rules!,
          '@typescript-eslint/',
          'ts/',
        ),

        'antfu/generic-spacing': 'error',
        'antfu/named-tuple-spacing': 'error',
        'antfu/no-cjs-exports': 'error',
        'antfu/no-const-enum': 'error',
        'antfu/no-ts-export-equal': 'error',

        'no-dupe-class-members': 'off',
        'no-extra-parens': 'off',
        'no-invalid-this': 'off',
        'no-loss-of-precision': 'off',
        'no-redeclare': 'off',
        'no-use-before-define': 'off',
        'no-useless-constructor': 'off',
        'ts/ban-ts-comment': [
          'error',
          {
            'ts-ignore': 'allow-with-description',
          },
        ],
        'ts/ban-ts-ignore': 'off',
        'ts/consistent-indexed-object-style': 'off',
        'ts/consistent-type-definitions': ['error', 'interface'],
        'ts/consistent-type-imports': [
          'error',
          {
            disallowTypeAnnotations: false,
            prefer: 'type-imports',
          },
        ],
        'ts/explicit-function-return-type': 'off',
        'ts/explicit-member-accessibility': 'off',
        'ts/explicit-module-boundary-types': 'off',
        'ts/naming-convention': 'off',
        'ts/no-dupe-class-members': 'error',
        'ts/no-dynamic-delete': 'off',
        'ts/no-empty-function': 'off',
        'ts/no-empty-interface': 'off',
        'ts/no-explicit-any': 'off',
        'ts/no-extra-parens': ['error', 'functions'],
        'ts/no-invalid-this': 'error',
        'ts/no-invalid-void-type': 'off',
        'ts/no-loss-of-precision': 'error',
        'ts/no-non-null-assertion': 'off',
        'ts/no-redeclare': 'error',
        'ts/no-require-imports': 'error',
        'ts/no-unused-vars': 'off',
        'ts/no-use-before-define': [
          'error',
          {
            classes: false,
            functions: false,
            variables: true,
          },
        ],
        'ts/parameter-properties': 'off',
        'ts/prefer-ts-expect-error': 'error',
        'ts/triple-slash-reference': 'off',
      },
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        'eslint-comments/no-unlimited-disable': 'off',
        'import/no-duplicates': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
    {
      files: ['**/*.{test,spec}.ts?(x)'],
      rules: {
        'no-unused-expressions': 'off',
      },
    },
    {
      files: ['**/*.js', '**/*.cjs'],
      rules: {
        'ts/no-require-imports': 'off',
        'ts/no-var-requires': 'off',
      },
    },
  ]
}
