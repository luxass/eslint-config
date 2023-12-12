// @ts-check
// @ts-expect-error - no types available
import styleMigrate from "@stylistic/eslint-plugin-migrate";

// @ts-expect-error - no types available
import _luxass from "./dist/index.mjs";

/** @type {typeof import("./src/index.ts")["luxass"]} */
const luxass = _luxass;

export default luxass(
  {
    vue: true,
    typescript: true,
    formatters: true,
  },
  {
    files: ["src/**/*.ts"],
    rules: {
      "perfectionist/sort-objects": "error",
    },
  },
  {
    files: ["src/configs/*.ts"],
    plugins: {
      "style-migrate": styleMigrate,
    },
    rules: {
      "style-migrate/migrate": ["error", { namespaceTo: "style" }],
    },
  },
);
