import process from "node:process";
import { isPackageExists } from "local-pkg";
import type { Awaitable, ConfigOptions, UserConfigItem } from "./types";

/**
 * Combine array and non-array configs into a single array.
 */
export async function combine(...configs: Awaitable<UserConfigItem | UserConfigItem[]>[]): Promise<UserConfigItem[]> {
  const resolved = await Promise.all(configs);
  return resolved.flat();
}

export function renameRules(rules: Record<string, any>, from: string, to: string) {
  return Object.fromEntries(
    Object.entries(rules)
      .map(([key, value]) => {
        if (key.startsWith(from)) {
          return [to + key.slice(from.length), value];
        }
        return [key, value];
      }),
  );
}

export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export async function interop<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m;
  return (resolved as any).default || resolved;
}

export async function ensure(packages: (string | undefined)[]) {
  if (process.env.CI || process.stdout.isTTY === false) {
    return;
  };

  const nonExistingPackages = packages.filter((i) => i && !isPackageExists(i)) as string[];
  if (nonExistingPackages.length === 0) {
    return;
  }

  const { default: prompts } = await import("prompts");
  const { result } = await prompts([
    {
      message: `${nonExistingPackages.length === 1 ? "Package is" : "Packages are"} required for this config: ${nonExistingPackages.join(", ")}. Do you want to install them?`,
      name: "result",
      type: "confirm",
    },
  ]);
  if (result) {
    await import("@antfu/install-pkg").then((i) => i.installPackage(nonExistingPackages, { dev: true }));
  }
}

export type ResolvedOptions<T> = T extends boolean
  ? never
  : NonNullable<T>;

export function resolveSubOptions<K extends keyof ConfigOptions>(
  options: ConfigOptions,
  key: K,
): ResolvedOptions<ConfigOptions[K]> {
  return typeof options[key] === "boolean"
    ? {} as any
    : options[key] || {};
}

export function getOverrides<K extends keyof ConfigOptions>(
  options: ConfigOptions,
  key: K,
) {
  const sub = resolveSubOptions(options, key);
  return {
    ..."overrides" in sub
      ? sub.overrides
      : {} as any,
  };
}
