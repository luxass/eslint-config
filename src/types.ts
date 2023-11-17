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
      "test/no-only-tests": RuleConfig<[]>
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
   * @example ['vue']
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

export interface OptionsHasTypeScript {
  typescript?: boolean
}

export interface OptionsStylistic {
  stylistic?: StylisticConfig | boolean
}

export interface StylisticConfig
  extends Pick<StylisticCustomizeOptions, "jsx"> { }

export interface OptionsOverrides {
  overrides?: FlatConfigItem["rules"]
}

export interface OptionsIsInEditor {
  isInEditor?: boolean
}

export interface OptionsPerfectionist {
  enableRules?: boolean
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
  isInEditor?: boolean

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
   * @default auto-detect based on the dependencies
   */
  nextjs?: boolean

  /**
   * Enable React support.
   *
   * @default auto-detect based on the dependencies
   */
  react?: boolean

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
    vue?: FlatConfigItem["rules"]
    yaml?: FlatConfigItem["rules"]
    nextjs?: FlatConfigItem["rules"]
    react?: FlatConfigItem["rules"]
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
  unocss?: boolean

  /**
   * Enable Vue support.
   *
   * @default auto-detect based on the dependencies
   */
  vue?: boolean

  /**
   * Enable YAML support.
   *
   * @default true
   */
  yaml?: boolean
}
