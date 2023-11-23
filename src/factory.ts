import process from "node:process";
import { existsSync } from "node:fs";
import { isPackageExists } from "local-pkg";
import type { Awaitable, FlatConfigItem, OptionsConfig, UserConfigItem } from "./types";
import {
  astro,
  comments,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  nextjs,
  node,
  perfectionist,
  react,
  sortPackageJson,
  sortTsconfig,
  stylistic,
  tailwindcss,
  test,
  typescript,
  unicorn,
  unocss,
  vue,
  yaml,
} from "./configs";
import { combine, interop } from "./utils";
import { FLAT_CONFIG_PROPS, UNO_PACKAGES, VUE_PACKAGES } from "./constants";

export async function luxass(
  options: OptionsConfig & FlatConfigItem = {},
  ...userConfigs: Awaitable<UserConfigItem | UserConfigItem[]>[]
): Promise<UserConfigItem[]> {
  const {
    astro: enableAstro = isPackageExists("astro"),
    componentExts = [],
    gitignore: enableGitignore = true,
    isEditor = !!(
      (process.env.VSCODE_PID || process.env.JETBRAINS_IDE)
      && !process.env.CI
    ),
    nextjs: enableNextJS = false,
    overrides = {},
    perfectionist: enablePerfectionistRules = false,
    react: enableReact = false,
    tailwindcss: enableTailwindCSS = false,
    typescript: enableTypeScript = isPackageExists("typescript"),
    unocss: enableUnoCSS = UNO_PACKAGES.some((i) => isPackageExists(i)),
    vue: enableVue = VUE_PACKAGES.some((i) => isPackageExists(i)),
  } = options;

  const stylisticOptions
    = options.stylistic === false
      ? false
      : typeof options.stylistic === "object"
        ? options.stylistic
        : {};
  if (stylisticOptions && !("jsx" in stylisticOptions)) {
    stylisticOptions.jsx = options.jsx ?? true;
  }

  const configs: Awaitable<FlatConfigItem[]>[] = [];

  if (enableGitignore) {
    if (typeof enableGitignore !== "boolean") {
      configs.push(interop(import("eslint-config-flat-gitignore")).then((plugin) => [plugin(enableGitignore)]));
    } else {
      if (existsSync(".gitignore")) {
        configs.push(interop(import("eslint-config-flat-gitignore")).then((plugin) => [plugin()]));
      }
    }
  }

  // Base configs
  configs.push(
    ignores(),
    javascript({
      isEditor,
      overrides: overrides.javascript,
    }),
    comments(),
    node(),
    jsdoc({
      stylistic: stylisticOptions,
    }),
    imports({
      stylistic: stylisticOptions,
    }),
    unicorn(),
    perfectionist({
      enableAllRules: enablePerfectionistRules,
    }),
  );

  if (enableVue) {
    componentExts.push("vue");
  }

  if (enableTypeScript) {
    configs.push(
      typescript({
        ...(typeof enableTypeScript !== "boolean" ? enableTypeScript : {}),
        componentExts,
        overrides: overrides.typescript,
      }),
    );
  }

  if (stylisticOptions) {
    configs.push(stylistic(stylisticOptions));
  }

  if (options.test ?? true) {
    configs.push(
      test({
        isEditor,
        overrides: overrides.test,
      }),
    );
  }

  if (enableReact) {
    configs.push(
      react({
        ...(typeof enableReact !== "boolean" ? enableReact : {}),
        overrides: overrides.react,
        typescript: !!enableTypeScript,
      }),
    );
  }

  if (enableNextJS) {
    configs.push(
      nextjs({
        ...(typeof enableNextJS !== "boolean" ? enableNextJS : {}),
        overrides: overrides.nextjs,
      }),
    );
  }

  if (enableVue) {
    configs.push(
      vue({
        overrides: overrides.vue,
        stylistic: stylisticOptions,
        typescript: !!enableTypeScript,
      }),
    );
  }

  if (enableAstro) {
    configs.push(
      astro({
        ...(typeof enableAstro !== "boolean" ? enableAstro : {}),
        overrides: overrides.astro,
        typescript: !!enableTypeScript,
      }),
    );
  }

  if (enableUnoCSS) {
    configs.push(unocss());
  }

  if (enableTailwindCSS) {
    configs.push(tailwindcss({
      callees: typeof enableTailwindCSS === "object" ? enableTailwindCSS.callees : ["classnames", "clsx", "cx", "cn"],
      classRegex: typeof enableTailwindCSS === "object" ? enableTailwindCSS.classRegex : "^class(Name)?$",
      config: typeof enableTailwindCSS === "object" ? enableTailwindCSS.config : undefined,
      nextjs: typeof enableNextJS === "object" ? true : enableNextJS,
      removeDuplicates: typeof enableTailwindCSS === "object" ? enableTailwindCSS.removeDuplicates : true,
    }));
  }

  if (options.jsonc ?? true) {
    configs.push(
      jsonc({
        overrides: overrides.jsonc,
        stylistic: stylisticOptions,
      }),
      sortPackageJson(),
      sortTsconfig(),
    );
  }

  if (options.yaml ?? true) {
    configs.push(
      yaml({
        overrides: overrides.yaml,
        stylistic: stylisticOptions,
      }),
    );
  }

  if (options.markdown ?? true) {
    configs.push(
      markdown({
        componentExts,
        overrides: overrides.markdown,
      }),
    );
  }

  // User can optionally pass a flat config item to the first argument
  // We pick the known keys as ESLint would do schema validation
  const fusedConfig = FLAT_CONFIG_PROPS.reduce((acc, key) => {
    if (key in options) {
      acc[key] = options[key] as any;
    }
    return acc;
  }, {} as FlatConfigItem);

  if (Object.keys(fusedConfig).length) {
    configs.push([fusedConfig]);
  }

  const merged = combine(...configs, ...userConfigs);

  return merged;
}
