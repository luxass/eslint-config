declare module 'eslint-plugin-markdown';
declare module 'eslint-plugin-react-hooks';
declare module 'eslint-plugin-jsdoc';
declare module '@next/eslint-plugin-next';
declare module 'eslint-plugin-vue';
declare module 'eslint-plugin-tailwindcss';
declare module 'eslint-plugin-react-refresh';

declare module 'eslint-plugin-n' {
  import type { ESLint } from 'eslint'

  const plugin: ESLint.Plugin

  export default plugin
}

declare module 'eslint-plugin-unicorn' {
  import type { ESLint } from 'eslint'

  const plugin: ESLint.Plugin

  export default plugin
}

declare module 'eslint-plugin-unused-imports' {
  import type { ESLint } from 'eslint'

  const plugin: ESLint.Plugin

  export default plugin
}

declare module '@eslint-community/eslint-plugin-eslint-comments' {
  import type { ESLint, Linter } from 'eslint'

  const plugin: ESLint.Plugin & {
    configs: {
      recommended: ESLint.ConfigData & {
        rules: Linter.RulesRecord
      }
    }
  }

  export default plugin
}

declare module 'eslint-plugin-yml' {
  import type { ESLint, Linter } from 'eslint'

  const plugin: ESLint.Plugin & {
    configs: {
      base: ESLint.ConfigData & {
        rules: Linter.RulesRecord
      }
      standard: ESLint.ConfigData & {
        rules: Linter.RulesRecord
      }
    }
  }

  export default plugin
}

declare module 'yaml-eslint-parser' {
  import type { Linter } from 'eslint'

  const parser: Linter.ParserModule
  export default parser
}

// USED IN TESTS
declare module 'eslint/use-at-your-own-risk' {
  import { ESLint } from 'eslint'
  import type { Linter } from 'eslint'
  import type { UserConfigItem } from './types'

  // Defined here: https://github.com/eslint/eslint/blob/54c3ca6f2dcd2a7afd53f42fc32055a25587259e/lib/eslint/flat-eslint.js#L66-L88
  interface FlatESLintOptions {
    allowInlineConfig?: boolean
    baseConfig?: UserConfigItem[]
    cache?: boolean
    cacheLocation?: string
    cacheStrategy?: 'metadata' | 'content'
    cwd?: string
    errorOnUnmatchedPattern?: boolean
    fix?: boolean | ((filePath: string) => boolean)
    fixTypes?: string[]
    globInputPaths?: boolean
    ignore?: boolean
    ignorePatterns?: string[]
    overrideConfig?: Linter.FlatConfig[]
    overrideConfigFile?: boolean | string
    plugins?: Record<string, Plugin>
    reportUnusedDisableDirectives?: 'error' | 'warn' | 'off'
    warnIgnored?: boolean
  }

  export class FlatESLint extends ESLint {
    constructor(options: FlatESLintOptions)
  }
}
