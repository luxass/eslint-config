import type { FlatGitignoreOptions } from "eslint-config-flat-gitignore";
import type { ParserOptions } from "@typescript-eslint/parser";
import type {
  EslintCommentsRules,
  EslintRules,
  FlatESLintConfigItem,
  ImportRules,
  JsoncRules,
  MergeIntersection,
  NRules,
  Prefix,
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

export interface OptionsComponentExts {
  /**
   * Additional extensions for components.
   *
   * @example ["vue"]
   * @default []
   */
  componentExts?: string[]
}

export interface OptionsTypeScriptParserOptions {
  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<ParserOptions>
}

export interface OptionsTypeScriptWithTypes {
  /**
   * When this options is provided, type aware rules will be enabled.
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  tsconfigPath?: string | string[]
}

export type ConfigurationOptions<TConfigs extends keyof OptionsConfig> = {
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

export interface TailwindCSSOptions {
  /**
   * Tell the plugin where the config file is located.
   * If not provided, the plugin will try to find the config file automatically.
   */
  config?: string

  /**
   * Tell the plugin to remove duplicate classes.
   *
   * @default true
   */
  removeDuplicates?: boolean

  /**
   * Tell the plugin which function names to look for.
   * @default ["classnames", "clsx", "cx", "cn"]
   *
   * If NextJS is enabled, the default value will also include `tw`
   * to support NextJS's Image Response.
   */
  callees?: string[]

  /**
   * Tell the plugin which class regex to look for.
   *
   * @default "^class(Name)?$"
   */
  classRegex?: string
}

export interface UnoCSSOptions {
  /**
   * Are you using UnoCSS Attributify mode?
   */
  attributify?: boolean
}

export type StylisticOptions = Pick<OptionsConfig, "stylistic">;

export type StylisticConfig = Pick<StylisticCustomizeOptions, "jsx" | "indent" | "quotes" | "semi">;

export interface OverrideOptions {
  overrides?: FlatConfigItem["rules"]
}

export interface InEditorOptions {
  isEditor?: boolean
}

export interface PerfectionistOptions {
  enableAllRules?: boolean
}

export interface OptionsConfig extends OptionsComponentExts {
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
   * Enable Markdown support.
   *
   * @default true
   */
  markdown?: boolean

  /**
   * Enable Perfectionist rules.
   *
   * @default false
   *
   * NOTE: This plugin has some very opinionated rules, use with caution.
   */
  perfectionist?: boolean

  /**
   * Enable NextJS support.
   *
   * @default false
   */
  nextjs?: boolean | NextJSOptions

  /**
   * Enable React support.
   *
   * @default false
   */
  react?: boolean | ReactOptions

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
    | OptionsTypeScriptParserOptions
    | OptionsTypeScriptWithTypes
    | boolean

  /**
   * Enable UnoCSS support.
   *
   * @default auto-detect based on the dependencies
   */
  unocss?: boolean | UnoCSSOptions

  /**
   * Enable TailwindCSS support.
   *
   * @default false
   */
  tailwindcss?: boolean | TailwindCSSOptions

  /**
   * Enable Vue support.
   *
   * @default auto-detect based on the dependencies
   */
  vue?: boolean

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
