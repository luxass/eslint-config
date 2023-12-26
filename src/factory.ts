import process from "node:process";
import { existsSync } from "node:fs";
import { isPackageExists } from "local-pkg";
import type { Awaitable, ConfigOptions, FlatConfigItem, UserConfigItem } from "./types";
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
  test,
  typescript,
  unicorn,
  unocss,
  vue,
  yaml,
} from "./configs";
import { combine, getOverrides, interop, resolveSubOptions } from "./utils";
import { FLAT_CONFIG_PROPS, VUE_PACKAGES } from "./constants";
import { formatters } from "./configs/formatters";

export async function luxass(
  options: ConfigOptions & FlatConfigItem = {},
  ...userConfigs: Awaitable<UserConfigItem | UserConfigItem[]>[]
): Promise<UserConfigItem[]> {
  const {
    astro: enableAstro = isPackageExists("astro"),
    editor = !!(
      (process.env.VSCODE_PID || process.env.JETBRAINS_IDE)
      && !process.env.CI
    ),
    exts = [],
    gitignore: enableGitignore = true,
    nextjs: enableNextJS = false,
    react: enableReact = false,
    typescript: enableTypeScript = isPackageExists("typescript"),
    unocss: enableUnoCSS = false,
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
      editor,
      overrides: getOverrides(options, "javascript"),
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
    perfectionist(),
  );

  if (enableVue) {
    exts.push("vue");
  }

  if (enableTypeScript) {
    configs.push(typescript({
      ...resolveSubOptions(options, "typescript"),
      exts,
    }));
  }

  if (stylisticOptions) {
    configs.push(stylistic({
      ...stylisticOptions,
      overrides: getOverrides(options, "stylistic"),
    }));
  }

  if (options.test ?? true) {
    configs.push(test({
      editor,
      overrides: getOverrides(options, "test"),
    }));
  }

  if (enableReact) {
    configs.push(react({
      overrides: getOverrides(options, "react"),
      typescript: !!enableTypeScript,
    }));
  }

  if (enableNextJS) {
    configs.push(
      nextjs({
        ...resolveSubOptions(options, "nextjs"),
      }),
    );
  }

  if (enableVue) {
    configs.push(
      vue({
        ...resolveSubOptions(options, "vue"),
        stylistic: stylisticOptions,
        typescript: !!enableTypeScript,
      }),
    );
  }

  if (enableAstro) {
    configs.push(
      astro({
        ...resolveSubOptions(options, "astro"),
        typescript: !!enableTypeScript,
      }),
    );
  }

  if (enableUnoCSS) {
    configs.push(unocss({
      ...resolveSubOptions(options, "unocss"),
      overrides: getOverrides(options, "unocss"),
    }));
  }

  if (options.jsonc ?? true) {
    configs.push(
      jsonc({
        overrides: getOverrides(options, "jsonc"),
        stylistic: stylisticOptions,
      }),
      sortPackageJson(),
      sortTsconfig(),
    );
  }

  if (options.yaml ?? true) {
    configs.push(yaml({
      overrides: getOverrides(options, "yaml"),
      stylistic: stylisticOptions,
    }));
  }

  if (options.markdown ?? true) {
    configs.push(
      markdown(
        {
          exts,
          overrides: getOverrides(options, "markdown"),
        },
      ),
    );
  }

  if (options.formatters) {
    configs.push(formatters(
      options.formatters,
      typeof stylisticOptions === "boolean" ? {} : stylisticOptions,
    ));
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
