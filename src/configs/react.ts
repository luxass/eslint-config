import globals from "globals";
import { GLOB_JSX } from "../globs";
import type { ConfigurationOptions, FlatConfigItem, OverrideOptions, ReactOptions } from "../types";
import { interop } from "../utils";

export async function react(options: ConfigurationOptions<"typescript"> & OverrideOptions & ReactOptions): Promise<FlatConfigItem[]> {
  const [
    pluginReact,
    pluginReactHooks,
    pluginA11y,
  ] = await Promise.all([
    interop(import("eslint-plugin-react")),
    interop(import("eslint-plugin-react-hooks")),
    ...(options.a11y ? [interop(import("eslint-plugin-jsx-a11y"))] : []),
  ] as const);

  const {
    a11y = false,
    overrides = {},
    typescript = true,
  } = options;

  return [
    {
      name: "luxass:react:setup",
      plugins: {
        "react": pluginReact,
        "react-hooks": pluginReactHooks,
        ...(a11y ? { "jsx-a11y": pluginA11y } : {}),
      },
    },
    {
      files: [GLOB_JSX],
      languageOptions: {
        ...pluginReact.configs.recommended.languageOptions,
        globals: {
          ...globals.browser,
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      name: "luxass:react:rules",
      rules: {
        ...pluginReact.configs.recommended.rules,
        ...pluginReactHooks.configs.recommended.rules,

        ...(a11y ? pluginA11y.configs.recommended.rules : {}),
        "react/react-in-jsx-scope": "off",

        ...(typescript
          ? {
              "react/prop-type": "off",
            }
          : {}),
        ...overrides,
      },
      settings: {
        react: {
          version: "detect",
        },
      },
    },
  ];
}
