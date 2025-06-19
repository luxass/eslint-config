import type { Linter } from "eslint";
import type {
  Awaitable,
  ConfigNames,
  ConfigOptions,
  TypedFlatConfigItem,
} from "./types";
import { FlatConfigComposer } from "eslint-flat-config-utils";
import { isPackageExists } from "local-pkg";
import {
  astro,
  comments,
  disables,
  formatters,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  jsx,
  markdown,
  node,
  perfectionist,
  pnpm,
  react,
  regexp,
  sortPackageJson,
  sortTsconfig,
  stylistic,
  tailwindcss,
  test,
  toml,
  typescript,
  unicorn,
  unocss,
  vue,
  yaml,
} from "./configs";
import { getOverrides, interop, isInEditorEnv, resolveSubOptions } from "./utils";

const FLAT_CONFIG_PROPS = [
  "name",
  "languageOptions",
  "linterOptions",
  "processor",
  "plugins",
  "rules",
  "settings",
] satisfies (keyof TypedFlatConfigItem)[];

const VuePackages = [
  "vue",
  "nuxt",
  "vitepress",
  "@slidev/cli",
];

export const defaultPluginRenaming = {
  "@eslint-react": "react",
  "@eslint-react/dom": "react-dom",
  "@eslint-react/hooks-extra": "react-hooks-extra",
  "@eslint-react/naming-convention": "react-naming-convention",
  "@stylistic": "style",
  "@typescript-eslint": "ts",
  "import-lite": "import",
  "n": "node",
  "vitest": "test",
  "yml": "yaml",
};

/**
 * Construct an array of ESLint flat config items.
 *
 * @param {OptionsConfig & TypedFlatConfigItem} options
 *  The options for generating the ESLint configurations.
 * @param {Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]} userConfigs
 *  The user configurations to be merged with the generated configurations.
 * @returns {Promise<TypedFlatConfigItem[]>}
 *  The merged ESLint configurations.
 */
export function luxass(
  options: ConfigOptions & Omit<TypedFlatConfigItem, "files"> = {},
  ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.Config[]>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const {
    astro: enableAstro = false,
    autoRenamePlugins = true,
    exts = [],
    gitignore: enableGitignore = true,
    imports: enableImports = true,
    jsx: enableJsx = true,
    pnpm: enableCatalogs = false,
    react: enableReact = false,
    regexp: enableRegexp = true,
    tailwindcss: enableTailwindCSS = false,
    type: projectType = "app",
    typescript: enableTypeScript = isPackageExists("typescript"),
    unicorn: enableUnicorn = true,
    unocss: enableUnoCSS = false,
    vue: enableVue = VuePackages.some((i) => isPackageExists(i)),
  } = options;

  let isInEditor = options.isInEditor;
  if (isInEditor == null) {
    isInEditor = isInEditorEnv();
    if (isInEditor) {
      // eslint-disable-next-line no-console
      console.log("[@luxass/eslint-config] Detected running in editor, some rules are disabled.");
    }
  }

  const stylisticOptions
    = options.stylistic === false
      ? false
      : typeof options.stylistic === "object"
        ? options.stylistic
        : {};

  if (stylisticOptions && !("jsx" in stylisticOptions)) {
    stylisticOptions.jsx = enableJsx;
  }

  const configs: Awaitable<TypedFlatConfigItem[]>[] = [];

  if (enableGitignore) {
    if (typeof enableGitignore !== "boolean") {
      configs.push(interop(import("eslint-config-flat-gitignore")).then((r) => [r({
        name: "luxass/gitignore",
        ...enableGitignore,
      })]));
    } else {
      configs.push(interop(import("eslint-config-flat-gitignore")).then((r) => [r({
        name: "luxass/gitignore",
        strict: false,
      })]));
    }
  }

  const typescriptOptions = resolveSubOptions(options, "typescript");
  const tsconfigPath = "tsconfigPath" in typescriptOptions ? typescriptOptions.tsconfigPath : undefined;

  // Base configs
  configs.push(
    ignores(),
    javascript({
      isInEditor,
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

    perfectionist(),
  );

  if (enableImports) {
    configs.push(
      imports(enableImports === true
        ? {
            stylistic: stylisticOptions,
          }
        : {
            stylistic: stylisticOptions,
            ...enableImports,
          }),
    );
  }

  if (enableUnicorn) {
    configs.push(unicorn(enableUnicorn === true ? {} : enableUnicorn));
  }

  if (enableVue) {
    exts.push("vue");
  }

  if (enableJsx) {
    configs.push(jsx());
  }

  if (enableTypeScript) {
    configs.push(typescript({
      ...typescriptOptions,
      exts,
      overrides: getOverrides(options, "typescript"),
      type: projectType,
    }));
  }

  if (stylisticOptions) {
    configs.push(stylistic({
      ...stylisticOptions,
      overrides: getOverrides(options, "stylistic"),
    }));
  }

  if (enableRegexp) {
    configs.push(regexp({
      ...resolveSubOptions(options, "regexp"),
      overrides: getOverrides(options, "regexp"),
    }));
  }

  if (options.test ?? true) {
    configs.push(test({
      isInEditor,
      overrides: getOverrides(options, "test"),
    }));
  }

  if (enableReact) {
    configs.push(react({
      ...resolveSubOptions(options, "react"),
      overrides: getOverrides(options, "react"),
      tsconfigPath,
    }));
  }

  if (enableVue) {
    configs.push(
      vue({
        ...resolveSubOptions(options, "vue"),
        overrides: getOverrides(options, "vue"),
        stylistic: stylisticOptions,
        typescript: !!enableTypeScript,
      }),
    );
  }

  if (enableAstro) {
    configs.push(
      astro({
        ...resolveSubOptions(options, "astro"),
        overrides: getOverrides(options, "astro"),
      }),
    );
  }

  if (enableUnoCSS) {
    configs.push(unocss({
      ...resolveSubOptions(options, "unocss"),
      overrides: getOverrides(options, "unocss"),
    }));
  }

  if (enableTailwindCSS) {
    configs.push(tailwindcss({
      ...resolveSubOptions(options, "tailwindcss"),
      overrides: getOverrides(options, "tailwindcss"),
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

  if (enableCatalogs) {
    configs.push(
      pnpm(),
    );
  }

  if (options.yaml ?? true) {
    configs.push(yaml({
      overrides: getOverrides(options, "yaml"),
      stylistic: stylisticOptions,
    }));
  }

  if (options.toml ?? true) {
    configs.push(toml({
      overrides: getOverrides(options, "toml"),
      stylistic: stylisticOptions,
    }));
  }

  if (options.markdown ?? true) {
    configs.push(
      markdown({
        exts,
        overrides: getOverrides(options, "markdown"),
      }),
    );
  }

  if (options.formatters) {
    configs.push(formatters(
      options.formatters,
      typeof stylisticOptions === "boolean" ? {} : stylisticOptions,
    ));
  }

  configs.push(
    disables(),
  );

  if ("files" in options) {
    throw new Error("[@luxass/eslint-config] The first argument should not contain the \"files\" property as the options are supposed to be global. Place it in the second or later config instead.");
  }

  // User can optionally pass a flat config item to the first argument
  // We pick the known keys as ESLint would do schema validation
  const fusedConfig = FLAT_CONFIG_PROPS.reduce((acc, key) => {
    if (key in options) {
      acc[key] = options[key] as any;
    }
    return acc;
  }, {} as TypedFlatConfigItem);

  if (Object.keys(fusedConfig).length) {
    configs.push([fusedConfig]);
  }

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();

  composer = composer
    .append(
      ...configs,
      ...userConfigs as any,
    );

  if (autoRenamePlugins) {
    composer = composer
      .renamePlugins(defaultPluginRenaming);
  }

  return composer;
}
