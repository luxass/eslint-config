// @ts-check
import { luxass } from "./dist/index.mjs";

export default luxass(
  {
    vue: true,
    typescript: true,
    astro: true,
  },
  {
    files: ["src/**/*.ts"],
    rules: {
      "perfectionist/sort-objects": "error",
    },
  },
);
