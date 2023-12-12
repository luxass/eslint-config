import type { FlatGitignoreOptions } from "eslint-config-flat-gitignore";
import type { ParserOptions } from "@typescript-eslint/parser";
import type { Options as VueBlocksOptions } from "eslint-processor-vue-blocks";
import type {
  EslintCommentsRules,
  EslintRules,
  FlatESLintConfigItem,
  ImportRules,
  JsoncRules,
  MergeIntersection,
  NRules,
  Prefix,
  ReactHooksRules,
  ReactRules,
  RenamePrefix,
  RuleConfig,
  VitestRules,
  VueRules,
  YmlRules,
} from "@antfu/eslint-define-config";
import type { RuleOptions as JSDocRules } from "@eslint-types/jsdoc/types";
import type { RuleOptions as TypeScriptRules } from "@eslint-types/typescript-eslint/types";
import type { RuleOptions as UnicornRules } from "@eslint-types/unicorn/types";
import type { Rules as AntfuRules } from "eslint-plugin-antfu";
import type {
  StylisticCustomizeOptions,
  UnprefixedRuleOptions as StylisticRules,
} from "@stylistic/eslint-plugin";
import type { Linter } from "eslint";
import type { VendoredPrettierOptions } from "./vendor/prettier-types";

export type WrapRuleConfig<T extends { [key: string]: any }> = {
  [K in keyof T]: T[K] extends RuleConfig ? T[K] : RuleConfig<T[K]>;
};

export type Awaitable<T> = T | Promise<T>;

export type Rules = WrapRuleConfig<
  MergeIntersection<
    RenamePrefix<TypeScriptRules, "@typescript-eslint/", "ts/"> &
    RenamePrefix<VitestRules, "vitest/", "test/"> &
    RenamePrefix<YmlRules, "yml/", "yaml/"> &
    RenamePrefix<NRules, "n/", "node/"> &
    Prefix<StylisticRules, "style/"> &
    Prefix<AntfuRules, "antfu/"> &
    ReactHooksRules &
    ReactRules &
    JSDocRules &
    ImportRules &
    EslintRules &
    JsoncRules &
    VueRules &
    UnicornRules &
    EslintCommentsRules & {
      "test/no-only-tests": RuleConfig<any[]>
    }
  >
>;

export type FlatConfigItem = Omit<FlatESLintConfigItem<Rules, false>, "plugins"> & {
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
};

export type UserConfigItem = FlatConfigItem | Linter.FlatConfig;

export interface ComponentExtsOptions {
  /**
   * Additional extensions for components.
   *
   * @example ["vue"]
   * @default []
   */
  componentExts?: string[]
}

export interface VueOptions {
  /**
   * Create virtual files for Vue SFC blocks to enable linting.
   *
   * @see https://github.com/antfu/eslint-processor-vue-blocks
   * @default true
   */
  sfcBlocks?: boolean | VueBlocksOptions

  /**
   * Enable Vue A11y support.
   *
   * @default true
   */
  a11y?: boolean
}

export interface TypeScriptOptions {
  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<ParserOptions>

  /**
   * When this options is provided, type aware rules will be enabled.
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  tsconfigPath?: string | string[]
}

export type ConfigurationOptions<TConfigs extends keyof ConfigOptions> = {
  [K in TConfigs]?: boolean
};

export interface NextJSOptions {
  /**
   * Tell the plugin where the root directory is.
   * @see https://nextjs.org/docs/app/building-your-application/configuring/eslint#rootdir
   *
   * @default true
   */
  rootDir?: boolean | string
}

export interface ReactOptions {
  a11y?: boolean
}

export interface AstroOptions {
  a11y?: boolean
}

export interface UnoCSSOptions {
  /**
   * Enable attributify support.
   * @default true
   */
  attributify?: boolean

  /**
   * Enable strict mode by throwing errors about blocklisted classes.
   * @default false
   */
  strict?: boolean
}

export interface VueOptions {
  /**
   * Enable Vue A11y support.
   *
   * @default true
   */
  a11y?: boolean
}

export type StylisticOptions = Pick<ConfigOptions, "stylistic">;

export type StylisticConfig = Pick<StylisticCustomizeOptions, "jsx" | "indent" | "quotes" | "semi">;

export interface FormattersOptions {
  /**
   * Enable formatting support for CSS, Less, Sass, and SCSS.
   *
   * Currently only support Prettier.
   */
  css?: "prettier" | boolean

  /**
   * Enable formatting support for HTML.
   *
   * Currently only support Prettier.
   */
  html?: "prettier" | boolean

  /**
   * Enable formatting support for TOML.
   *
   * Currently only support dprint.
   */
  toml?: "dprint" | boolean

  /**
   * Enable formatting support for Markdown.
   *
   * Support both Prettier and dprint.
   *
   * When set to `true`, it will use Prettier.
   */
  markdown?: "prettier" | "dprint" | boolean

  /**
   * Enable formatting support for GraphQL.
   */
  graphql?: "prettier" | boolean

  /**
   * Custom options for Prettier.
   *
   * By default it's controlled by our own config.
   */
  prettierOptions?: VendoredPrettierOptions

  /**
   * Custom options for dprint.
   *
   * By default it's controlled by our own config.
   */
  dprintOptions?: boolean
}

export interface OverrideOptions {
  overrides?: FlatConfigItem["rules"]
}

export interface InEditorOptions {
  isEditor?: boolean
}

export interface ConfigOptions extends ComponentExtsOptions {
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
  isEditor?: boolean

  /**
   * Enable JSONC support.
   *
   * @default true
   */
  jsonc?: boolean

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
   * Provide overrides for rules for each integration.
   */
  overrides?: {
    javascript?: FlatConfigItem["rules"]
    jsonc?: FlatConfigItem["rules"]
    markdown?: FlatConfigItem["rules"]
    test?: FlatConfigItem["rules"]
    typescript?: FlatConfigItem["rules"]
    unocss?: FlatConfigItem["rules"]
    tailwindCSS?: FlatConfigItem["rules"]
    vue?: FlatConfigItem["rules"]
    yaml?: FlatConfigItem["rules"]
    nextjs?: FlatConfigItem["rules"]
    react?: FlatConfigItem["rules"]
    astro?: FlatConfigItem["rules"]
  }

  /**
   * Enable stylistic rules.
   *
   * @default true
   */
  stylistic?: StylisticConfig | boolean

  /**
   * Enable test support.
   *
   * @default true
   */
  test?: boolean

  /**
   * Enable TypeScript support.
   *
   * Passing an object to enable TypeScript Language Server support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?:
    | TypeScriptOptions
    | boolean

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
   * Enable Vue support.
   *
   * @default auto-detect based on the dependencies
   */
  vue?: boolean | VueOptions

  /**
   * Enable Astro support.
   *
   * @default auto-detect based on the dependencies
   */
  astro?: boolean | AstroOptions

  /**
   * Enable YAML support.
   *
   * @default true
   */
  yaml?: boolean
}
