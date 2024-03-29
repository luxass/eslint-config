import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore'
import type { Linter } from 'eslint'
import type { RuleOptions } from './typegen'
import type {
  AstroOptions,
  FormattersOptions,
  JSONOptions,
  JavaScriptOptions,
  NextJSOptions,
  ReactOptions,
  SolidOptions,
  StylisticConfig,
  TOMLOptions,
  TailwindCSSOptions,
  TestOptions,
  TypeScriptOptions,
  UnoCSSOptions,
  VueOptions,
  YAMLOptions,
} from './configs'

export type Awaitable<T> = T | Promise<T>

export type Rules = RuleOptions

export type TypedFlatConfigItem = Omit<Linter.FlatConfig, 'plugins'> & {
  /**
   * Custom name of each config item
   */
  name?: string

  // Relax plugins type limitation, as most of the plugins did not have correct type info yet.
  /**
   * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, any>

  /**
   * An object containing a name-value mapping of rules to use.
   */
  rules?: Linter.RulesRecord & Rules
}

export type UserConfigItem = TypedFlatConfigItem | Linter.FlatConfig

export interface ConfigOptions {
  /**
   * Enable gitignore support.
   *
   * Passing an object to configure the options.
   *
   * @see https://github.com/antfu/eslint-config-flat-gitignore
   * @default true
   */
  gitignore?: FlatGitignoreOptions | boolean

  /**
   * Control to disable some rules in editors.
   * @default auto-detect based on the process.env
   */
  editor?: boolean

  /**
   * JavaScript options
   *
   * NOTE: Can't be disabled.
   */
  javascript?: JavaScriptOptions

  /**
   * Enable JSONC support.
   *
   * @default true
   */
  jsonc?: boolean | JSONOptions

  /**
   * Enable JSX related rules.
   *
   * Currently only stylistic rules are included.
   *
   * @default true
   */
  jsx?: boolean

  /**
   * Enable linting for **code snippets** in Markdown.
   *
   * For formatting Markdown content, enable also `formatters.markdown`.
   *
   * @default true
   */
  markdown?: boolean

  /**
   * Enable NextJS support.
   *
   * Requires installing:
   * - `@next/eslint-plugin-next`
   *
   * @default false
   *
   * Note: By enabling this, the `react` option will be enabled automatically.
   */
  nextjs?: boolean | NextJSOptions

  /**
   * Enable react rules.
   *
   * Requires installing:
   * - `eslint-plugin-react`
   * - `eslint-plugin-react-hooks`
   * - `eslint-plugin-react-refresh`
   *
   * @default false
   */
  react?: boolean | ReactOptions

  /**
   * Use external formatters to format files.
   *
   * Requires installing:
   * - `eslint-plugin-format`
   *
   * When set to `true`, it will enable all formatters.
   *
   * @default false
   */
  formatters?: boolean | FormattersOptions

  /**
   * Enable stylistic rules.
   *
   * @default true
   */
  stylistic?: boolean | StylisticConfig

  /**
   * Enable test support.
   *
   * @default true
   */
  test?: boolean | TestOptions

  /**
   * Enable TypeScript support.
   *
   * Passing an object to enable TypeScript Language Server support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: boolean | TypeScriptOptions

  /**
   * Enable UnoCSS support.
   *
   * Requires installing:
   * - `@unocss/eslint-plugin`
   *
   * @default false
   */
  unocss?: boolean | UnoCSSOptions

  /**
   * Enable TailwindCSS support.
   *
   * Requires installing:
   * - `eslint-plugin-tailwindcss`
   *
   * @default false
   */
  tailwindcss?: boolean | TailwindCSSOptions

  /**
   * Enable Vue support.
   *
   * @default auto-detect based on the dependencies
   */
  vue?: boolean | VueOptions

  /**
   * Enable Astro support.
   *
   * Requires installing:
   * - `eslint-plugin-astro`
   *
   * Requires installing for formatting .astro:
   * - `prettier-plugin-astro`
   *
   * @default false
   */
  astro?: boolean | AstroOptions

  /**
   * Enable YAML support.
   *
   * @default true
   */
  yaml?: boolean | YAMLOptions

  /**
   * Enable TOML support.
   *
   * @default true
   */
  toml?: boolean | TOMLOptions

  /**
   * Additional extensions for components.
   *
   * @example ["vue"]
   * @default []
   */
  exts?: string[]

  /**
   * Enable Solid support.
   *
   * Requires installing:
   * - `eslint-plugin-solid`
   *
   * @default false
   */
  solid?: boolean | SolidOptions

  /**
   * Automatically rename plugins in the config.
   *
   * @default true
   */
  autoRenamePlugins?: boolean
}
