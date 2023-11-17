import { GLOB_SRC } from "../globs";
import type { FlatConfigItem } from "../types";
import { interop } from "../utils";

export async function nextjs(): Promise<FlatConfigItem[]> {
  const pluginNextjs = await interop(import("@next/eslint-plugin-next"));

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
      },
      settings: {
        next: {
          rootDir: true,
        },
        react: {
          pragma: "React",
          version: "detect",
        },
      },
    },
    {
      files: [
        "**/app/**/page.{js,jsx,tsx}",
        "**/app/**/layout.{js,jsx,tsx}",
        "**/app/**/error.{js,jsx,tsx}",
        "**/app/**/template.{js,jsx,tsx}",
        "**/app/**/not-found.{js,jsx,tsx}",
        "**/app/**/loading.{js,jsx,tsx}",
        "**/app/**/robots.{js,jsx,ts,tsx}",
        "**/app/**/sitemap.{js,jsx,ts,tsx}",
        "**/pages/**/*.{js,jsx,tsx}",
      ],
      name: "luxass:nextjs:default-export-override",
      rules: {
        "import/no-default-export": "off",
      },
    },
  ];
}
