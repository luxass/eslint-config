import type { Linter } from "eslint";
import type { RuleOptions } from "./typegen";
import type { Awaitable, ConfigOptions, TypedFlatConfigItem } from "./types";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { isPackageExists } from "local-pkg";

const scopeUrl = fileURLToPath(new URL(".", import.meta.url));
const isCwdInScope = isPackageExists("@luxass/eslint-config");

export const parserPlain = {
  meta: {
    name: "parser-plain",
  },
  parseForESLint: (code: string) => ({
    ast: {
      body: [],
      comments: [],
      loc: { end: code.length, start: 0 },
      range: [0, code.length],
      tokens: [],
      type: "Program",
    },
    scopeManager: null,
    services: { isPlain: true },
    visitorKeys: {
      Program: [],
    },
  }),
};

/**
 * Combine array and non-array configs into a single array.
 */
export async function combine(...configs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]): Promise<TypedFlatConfigItem[]> {
  const resolved = await Promise.all(configs);
  return resolved.flat();
}

/**
 * Rename plugin prefixes in a rule object.
 * Accepts a map of prefixes to rename.
 *
 * @example
 * ```ts
 * import { renameRules } from "@luxass/eslint-config";
 *
 * export default [{
 *   rules: renameRules(
 *     {
 *       "@typescript-eslint/indent": "error"
 *     },
 *     { "@typescript-eslint": "ts" }
 *   )
 * }]
 * ```
 */
export function renameRules(
  rules: Record<string, any>,
  map: Record<string, string>,
): Record<string, any> {
  return Object.fromEntries(
    Object.entries(rules)
      .map(([key, value]) => {
        for (const [from, to] of Object.entries(map)) {
          if (key.startsWith(`${from}/`)) {
            return [to + key.slice(from.length), value];
          }
        }
        return [key, value];
      }),
  );
}

/**
 * Rename plugin names a flat configs array
 *
 * @example
 * ```ts
 * import { renamePluginInConfigs } from "@luxass/eslint-config";
 * import someConfigs from "./some-configs";
 *
 * export default renamePluginInConfigs(someConfigs, {
 *   "@typescript-eslint": "ts",
 *   "import-x": "import",
 * })
 * ```
 */
export function renamePluginInConfigs(
  configs: TypedFlatConfigItem[],
  map: Record<string, string>,
): TypedFlatConfigItem[] {
  return configs.map((i) => {
    const clone = { ...i };
    if (clone.rules) {
      clone.rules = renameRules(clone.rules, map);
    }
    if (clone.plugins) {
      clone.plugins = Object.fromEntries(
        Object.entries(clone.plugins)
          .map(([key, value]) => {
            if (key in map) {
              return [map[key], value];
            }
            return [key, value];
          }),
      );
    }
    return clone;
  });
}

/**
 * Convert a value to an array.
 * If the value is an array, return it as is.
 * Otherwise, return the value as the only element in an array.
 *
 * @param {T | T[]} value - Value to convert to an array.
 * @returns {T[]} - The value as an array.
 *
 * @example
 * ```ts
 * import { toArray } from "@luxass/eslint-config";
 *
 * toArray("foo") // ["foo"]
 * toArray(["foo"]) // ["foo"]
 * ```
 */
export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

/**
 * Import a module and return the default export.
 * If the module does not have a default export, return the module itself.
 *
 * @param {Promise<T>} m - Module to import.
 * @returns {Promise<T extends { default: infer U } ? U : T>} - The default export or the module itself.
 * @template T
 *
 * @example
 * ```ts
 * import { interop } from "@luxass/eslint-config";
 *
 * const module = await interop(import("module"));
 * ```
 */
export async function interop<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m;
  return (resolved as any).default || resolved;
}

/**
 * Ensure that packages are installed.
 * If the packages are not installed, prompt the user to install them.
 *
 * @param {string[]} packages - Packages to ensure are installed.
 * @returns {Promise<void>} - A promise that resolves when the packages are installed.
 *
 * @example
 * ```ts
 * import { ensure } from "@luxass/eslint-config";
 *
 * await ensure(["eslint-plugin-jsdoc"]);
 * ```
 */
export async function ensure(packages: (string | undefined)[]): Promise<void> {
  if (process.env.CI || process.stdout.isTTY === false || isCwdInScope === false) {
    return;
  };

  const nonExistingPackages = packages.filter((i) => i && !isPackageInScope(i)) as string[];
  if (nonExistingPackages.length === 0) {
    return;
  }

  const p = await import("@clack/prompts");
  const result = await p.confirm({
    message: `${nonExistingPackages.length === 1 ? "Package is" : "Packages are"} required for this config: ${nonExistingPackages.join(", ")}. Do you want to install them?`,
  });

  if (result) {
    await import("@antfu/install-pkg").then((i) => i.installPackage(nonExistingPackages, { dev: true }));
  }
}

export type ResolvedOptions<T> = T extends boolean
  ? never
  : NonNullable<T>;

/**
 * Resolve sub-options from a config options object.
 *
 * @param {ConfigOptions} options - The config options object.
 * @template K - The key of the sub-options to resolve.
 * @param {K} key - The key of the sub-options to resolve.
 * @returns {ResolvedOptions<ConfigOptions[K]>} - The resolved sub-options.
 *
 * @example
 * ```ts
 * import { resolveSubOptions } from "@luxass/eslint-config";
 *
 * const options = {
 *   foo: {
 *     bar: true,
 *   },
 * };
 *
 * const subOptions = resolveSubOptions(options, "foo");
 * ```
 */
export function resolveSubOptions<K extends keyof ConfigOptions>(
  options: ConfigOptions,
  key: K,
): ResolvedOptions<ConfigOptions[K]> {
  return typeof options[key] === "boolean"
    ? {} as any
    : options[key] || {};
}

/**
 * Get overrides from a config options object.
 * @param {ConfigOptions} options The config options object.
 * @template K The key of the sub-options to resolve.
 * @param {K} key The key of the sub-options to resolve.
 * @returns {Partial<Linter.RulesRecord & RuleOptions>} The overrides.
 *
 * @example
 * ```ts
 * import { getOverrides } from "@luxass/eslint-config";
 *
 * const options = {
 *   overrides: {
 *     rules: {
 *       "no-console": "off",
 *     },
 *   },
 * };
 *
 * const overrides = getOverrides(options, "overrides");
 * ```
 */
export function getOverrides<K extends keyof ConfigOptions>(
  options: ConfigOptions,
  key: K,
): Partial<Linter.RulesRecord & RuleOptions> {
  const sub = resolveSubOptions(options, key);
  return {
    ..."overrides" in sub
      ? sub.overrides
      : {} as any,
  };
}

export function isPackageInScope(name: string): boolean {
  return isPackageExists(name, { paths: [scopeUrl] });
}

export function isInEditorEnv(): boolean {
  if (process.env.CI) {
    return false;
  }
  if (isInGitHooksOrLintStaged()) {
    return false;
  }
  return !!(false
    || process.env.VSCODE_PID
    || process.env.VSCODE_CWD
    || process.env.JETBRAINS_IDE
    || process.env.VIM
    || process.env.NVIM
  );
}

export function isInGitHooksOrLintStaged(): boolean {
  return !!(false
    || process.env.GIT_PARAMS
    || process.env.VSCODE_GIT_COMMAND
    || process.env.npm_lifecycle_script?.startsWith("lint-staged")
  );
}
