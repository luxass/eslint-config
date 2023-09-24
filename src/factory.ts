import process from "node:process";
import { type FlatESLintConfigItem } from "eslint-define-config";
import { isPackageExists } from "local-pkg";
import {
  astro,
  comments,
  ignores,
  imports,
  javascript,
  javascriptStylistic,
  jsdoc,
  json,
  markdown,
  node,
  react,
  sort,
  svelte,
  tailwindcss,
  typescript,
  typescriptStylistic,
  unicorn,
  unocss,
  vue,
  yml,
} from "./configs";
import { type Options } from "./types";
import { combine } from "./utils";

const flatConfigProps: (keyof FlatESLintConfigItem)[] = [
  "files",
  "ignores",
  "languageOptions",
  "linterOptions",
  "processor",
  "plugins",
  "rules",
  "settings",
];

export function luxass(
  options: Options & FlatESLintConfigItem = {},
  ...userConfigs: (FlatESLintConfigItem | FlatESLintConfigItem[])[]
): FlatESLintConfigItem[] {
  const editorEnabled =
    options.editorEnabled ??
    !!(
      (process.env.VSCODE_PID || process.env.JETBRAINS_IDE) &&
      !process.env.CI
    );
  const isVueEnabled =
    options.vue ??
    (isPackageExists("vue") ||
      isPackageExists("nuxt") ||
      isPackageExists("vitepress") ||
      isPackageExists("@slidev/cli"));
  const isReactEnabled =
    options.react ??
    (isPackageExists("react") ||
      isPackageExists("next") ||
      isPackageExists("react-dom"));
  const isAstroEnabled = options.astro ?? isPackageExists("astro");
  const isSvelteEnabled = options.svelte ?? isPackageExists("svelte");
  const isUnoCSSEnabled = options.unocss ?? isPackageExists("unocss");
  const isTailwindCSSEnabled =
    options.tailwindcss ?? isPackageExists("tailwindcss");
  const isTypeScriptEnabled =
    options.typescript ?? isPackageExists("typescript");
  const isStylisticEnabled = options.stylistic ?? true;

  const configs = [
    ignores,
    javascript({
      editorEnabled,
    }),
    comments,
    node,
    jsdoc,
    imports,
    unicorn,
  ];

  const extensions: string[] = [];

  if (isVueEnabled) {
    extensions.push("vue");
  }

  if (isStylisticEnabled) {
    configs.push(javascriptStylistic);
  }

  if (isTypeScriptEnabled) {
    configs.push(
      typescript({
        extensions,
      }),
    );

    if (isStylisticEnabled) {
      configs.push(typescriptStylistic);
    }
  }

  if (isVueEnabled) {
    configs.push(
      vue({
        typescript: isTypeScriptEnabled,
      }),
    );
  }

  if (isUnoCSSEnabled) {
    configs.push(unocss);
  }

  if (isTailwindCSSEnabled && !isUnoCSSEnabled) {
    configs.push(tailwindcss);
  }

  if (isReactEnabled) {
    configs.push(
      react({
        typescript: isTypeScriptEnabled,
      }),
    );
  }

  if (isAstroEnabled) {
    configs.push(
      astro({
        typescript: isTypeScriptEnabled,
      }),
    );
  }

  if (isSvelteEnabled) {
    configs.push(
      svelte({
        typescript: isTypeScriptEnabled,
      }),
    );
  }

  if (options.json ?? true) {
    configs.push(json, sort);
  }

  if (options.yaml ?? true) {
    configs.push(yml);
  }

  if (options.markdown ?? true) {
    configs.push(markdown({ extensions }));
  }

  // User can optionally pass a flat config item to the first argument
  // We pick the known keys as ESLint would do schema validation
  const fusedConfig = flatConfigProps.reduce((acc, key) => {
    if (key in options) acc[key] = options[key];
    return acc;
  }, {} as FlatESLintConfigItem);
  if (Object.keys(fusedConfig).length > 0) configs.push([fusedConfig]);

  return combine(...configs, ...userConfigs);
}
