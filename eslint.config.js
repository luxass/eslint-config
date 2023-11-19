// @ts-check
import { luxass } from "./dist/index.mjs";

export default luxass(
  {
    vue: true,
    typescript: true,
    astro: true,
    react: {
      a11y: true,
    },
  },
  {
    files: ["src/**/*.ts"],
    rules: {
      "perfectionist/sort-objects": "error",
    },
  },
);
