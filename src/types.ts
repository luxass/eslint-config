import type {
  AstroOptions,
  FormattersOptions,
  ImportsOptions,
  JavaScriptOptions,
  JSONOptions,
  PnpmOptions,
  ReactOptions,
  RegExpOptions,
  StylisticConfig,
  TailwindCSSOptions,
  TestOptions,
  TOMLOptions,
  TypeScriptOptions,
  UnicornOptions,
  UnoCSSOptions,
  VueOptions,
  YAMLOptions,
} from "./configs";
import type { ConfigNames, RuleOptions } from "./typegen";
import type { Linter } from "eslint";
import type { FlatGitignoreOptions } from "eslint-config-flat-gitignore";

export type Awaitable<T> = T | Promise<T>;

export type Rules = Record<string, Linter.RuleEntry<any> | undefined> & RuleOptions;

export type { ConfigNames };

export type TypedFlatConfigItem = Omit<Linter.Config, "plugins" | "rules"> & {
  /**
   * An object containing a name-value mapping of plugin names to plugin objects.
   * When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, any>;

  /**
   * An object containing the configured rules. When `files` or `ignores` are
   * specified, these rule configurations are only available to the matching files.
   */
  rules?: Rules;
};

export type UserConfigItem = TypedFlatConfigItem | Linter.Config;

export type ProjectType = "app" | "lib";

export interface ConfigOptions {
  /**
   * Type of the project. `lib` will enable more strict rules for libraries.
   *
   * @default "app"
   */
  type?: ProjectType;

  /**
   * Enable gitignore support.
   *
   * Passing an object to configure the options.
   *
   * @see https://github.com/antfu/eslint-config-flat-gitignore
   * @default true
   */
  gitignore?: FlatGitignoreOptions | boolean;

  /**
   * Options for eslint-plugin-unicorn.
   *
   * @default true
   */
  unicorn?: boolean | UnicornOptions;

  /**
   * Options for eslint-plugin-import-lite.
   *
   * @default true
   */
  imports?: boolean | ImportsOptions;

  /**
   * Control to disable some rules in editors.
   * @default auto-detect based on the process.env
   */
  isInEditor?: boolean;

  /**
   * JavaScript options
   *
   * NOTE: Can't be disabled.
   */
  javascript?: JavaScriptOptions;

  /**
   * Enable Node.js rules
   *
   * @default true
   */
  node?: boolean;

  /**
   * Enable JSONC support.
   *
   * @default true
   */
  jsonc?: boolean | JSONOptions;

  /**
   * Enable JSX related rules.
   *
   * Currently only stylistic rules are included.
   *
   * @default true
   */
  jsx?: boolean;

  /**
   * Enable linting for **code snippets** in Markdown.
   *
   * For formatting Markdown content, enable also `formatters.markdown`.
   *
   * @default true
   */
  markdown?: boolean;

  /**
   * Enable react rules.
   *
   * Requires installing:
   * - `@eslint-react/eslint-plugin`
   * - `eslint-plugin-react-hooks`
   * - `eslint-plugin-react-refresh`
   *
   * @default false
   */
  react?: boolean | ReactOptions;

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
  formatters?: boolean | FormattersOptions;

  /**
   * Enable stylistic rules.
   *
   * @default true
   */
  stylistic?: boolean | StylisticConfig;

  /**
   * Enable test support.
   *
   * @default true
   */
  test?: boolean | TestOptions;

  /**
   * Enable TypeScript support.
   *
   * Passing an object to enable TypeScript Language Server support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: boolean | TypeScriptOptions;

  /**
   * Enable UnoCSS support.
   *
   * Requires installing:
   * - `@unocss/eslint-plugin`
   *
   * @default false
   */
  unocss?: boolean | UnoCSSOptions;

  /**
   * Enable TailwindCSS support.
   *
   * Requires installing:
   * - `eslint-plugin-tailwindcss`
   *
   * @default false
   */
  tailwindcss?: boolean | TailwindCSSOptions;

  /**
   * Enable Vue support.
   *
   * @default auto-detect based on the dependencies
   */
  vue?: boolean | VueOptions;

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
  astro?: boolean | AstroOptions;

  /**
   * Enable YAML support.
   *
   * @default true
   */
  yaml?: boolean | YAMLOptions;

  /**
   * Enable TOML support.
   *
   * @default true
   */
  toml?: boolean | TOMLOptions;

  /**
   * Additional extensions for components.
   *
   * @example ["vue"]
   * @default []
   */
  exts?: string[];

  /**
   * Automatically rename plugins in the config.
   *
   * @default true
   */
  autoRenamePlugins?: boolean;

  /**
   * Enable regexp rules.
   *
   * @see https://ota-meshi.github.io/eslint-plugin-regexp/
   * @default true
   */
  regexp?: boolean | RegExpOptions;

  /**
   * Enable pnpm (workspace/catalogs) support.
   *
   * Currently it's disabled by default, as it's still experimental.
   * In the future it will be smartly enabled based on the project usage.
   *
   * @see https://github.com/antfu/pnpm-workspace-utils
   * @experimental
   * @default false
   */
  pnpm?: boolean | PnpmOptions;

  /**
   * Enable JSDoc rules
   *
   * @default true
   */
  jsdoc?: boolean;
}
