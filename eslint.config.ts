import { luxass } from "./src";

export default luxass(
  {
    vue: true,
    react: true,
    astro: true,
    typescript: true,
    formatters: true,
    type: "lib",
  },
  {
    ignores: [
      "**/fixtures",
    ],
  },
  {
    files: ["src/**/*.ts"],
    rules: {
      "perfectionist/sort-objects": "error",
    },
  },
);
