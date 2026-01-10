import type { ConfigOptions } from "./types";

// @keep-sorted
export const CONFIG_PRESET_FULL_ON: ConfigOptions = {
  astro: true,
  formatters: true,
  gitignore: true,
  imports: true,
  jsdoc: true,
  jsonc: true,
  jsx: true,
  markdown: true,
  node: true,
  pnpm: true,
  react: {
    reactCompiler: true,
  },
  regexp: true,
  stylistic: true,
  test: true,
  toml: true,
  typescript: {
    erasableOnly: true,
    tsconfigPath: "tsconfig.json",
  },
  unicorn: true,
  unocss: true,
  vue: true,
  yaml: true,
};

export const CONFIG_PRESET_FULL_OFF: ConfigOptions = {
  astro: false,
  formatters: false,
  gitignore: false,
  imports: false,
  jsdoc: false,
  jsonc: false,
  jsx: false,
  markdown: false,
  node: false,
  pnpm: false,
  react: false,
  regexp: false,
  stylistic: false,
  test: false,
  toml: false,
  typescript: false,
  unicorn: false,
  unocss: false,
  vue: false,
  yaml: false,
};
