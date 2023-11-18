import { GLOB_NEXTJS_OG, GLOB_NEXTJS_ROUTES, GLOB_SRC } from "../globs";
import type { FlatConfigItem, NextJSOptions, OverrideOptions } from "../types";
import { interop } from "../utils";

export async function nextjs(
  options: NextJSOptions & OverrideOptions = {},
): Promise<FlatConfigItem[]> {
  const pluginNextjs = await interop(import("@next/eslint-plugin-next"));

  const { overrides, rootDir } = options;

  return [
    {
      name: "luxass:nextjs:setup",
      plugins: {
        "@next/next": pluginNextjs,
      },
    },
    {
      files: [GLOB_SRC],
      name: "luxass:nextjs:rules",
      rules: {
        ...pluginNextjs.configs.recommended.rules,
        ...pluginNextjs.configs["core-web-vitals"].rules,
        "@next/next/google-font-display": ["warn"],
        "@next/next/google-font-preconnect": ["warn"],
        "@next/next/inline-script-id": ["error"],
        "@next/next/next-script-for-ga": ["warn"],
        "@next/next/no-assign-module-variable": ["error"],
        "@next/next/no-before-interactive-script-outside-document": ["warn"],
        "@next/next/no-css-tags": ["warn"],
        "@next/next/no-document-import-in-page": ["error"],
        "@next/next/no-duplicate-head": ["error"],
        "@next/next/no-head-element": ["warn"],
        "@next/next/no-head-import-in-document": ["error"],
        "@next/next/no-html-link-for-pages": ["off"],
        "@next/next/no-img-element": ["warn"],
        "@next/next/no-page-custom-font": ["warn"],
        "@next/next/no-script-component-in-head": ["error"],
        "@next/next/no-styled-jsx-in-document": ["warn"],
        "@next/next/no-sync-scripts": ["warn"],
        "@next/next/no-title-in-document-head": ["warn"],
        "@next/next/no-typos": ["warn"],
        "@next/next/no-unwanted-polyfillio": ["warn"],
        "jsx-a11y/anchor-is-valid": ["off"],

        // This rule creates errors with webpack parsing on edge runtime
        "unicorn/prefer-node-protocol": ["off"],
        ...overrides,
      },
      settings: {
        next: {
          rootDir: rootDir ?? true,
        },
        react: {
          pragma: "React",
          version: "detect",
        },
      },
    },
    {
      files: GLOB_NEXTJS_ROUTES,
      name: "luxass:nextjs:default-export-override",
      rules: {
        "import/prefer-default-export": "error",
      },
    },
    {
      files: GLOB_NEXTJS_OG,
      name: "luxass:nextjs:allow-tw-property",
      rules: {
        "react/no-unknown-property": ["error", {
          ignore: ["tw"],
        }],
      },
    },
  ];
}
