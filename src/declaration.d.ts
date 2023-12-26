declare module "eslint-plugin-jsx-a11y";
declare module "eslint-plugin-markdown";
declare module "eslint-plugin-react";
declare module "eslint-plugin-react-hooks";
declare module "eslint-plugin-jsdoc";
declare module "@next/eslint-plugin-next";
declare module "eslint-plugin-no-only-tests";
declare module "eslint-plugin-vue";
declare module "eslint-plugin-tailwindcss";
declare module "eslint-plugin-react-refresh";
declare module "eslint-plugin-vuejs-accessibility";

declare module "@eslint-community/eslint-plugin-eslint-comments" {
  import type { ESLint, Linter } from "eslint";

  const plugin: ESLint.Plugin & {
    configs: {
      recommended: ESLint.ConfigData & {
        rules: Linter.RulesRecord
      }
    }
  };

  export default plugin;
}
