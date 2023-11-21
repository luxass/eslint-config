import type { FlatConfigItem } from "./types";

export const VUE_PACKAGES = ["vue", "nuxt", "vitepress", "@slidev/cli"];
export const REACT_PACKAGES = ["react", "next", "react-dom"];
export const UNO_PACKAGES = ["unocss", "@unocss/webpack", "@unocss/nuxt"];

export const REACT_REFRESH_PACKAGES = [
  "vite",
];

export const FLAT_CONFIG_PROPS: (keyof FlatConfigItem)[] = [
  "files",
  "ignores",
  "languageOptions",
  "linterOptions",
  "processor",
  "plugins",
  "rules",
  "settings",
];
