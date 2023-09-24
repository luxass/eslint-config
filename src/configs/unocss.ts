import { type FlatESLintConfigItem } from "eslint-define-config";
import { pluginUnoCSS } from "../plugins";

export const unocss: FlatESLintConfigItem[] = [
  {
    plugins: {
      "@unocss": pluginUnoCSS,
    },
    // @ts-expect-error aaa
    rules: {
      ...pluginUnoCSS.configs.recommended.rules,
    },
  },
];
