// @ts-check

import styleMigrate from "@stylistic/eslint-plugin-migrate";
import JITI from "jiti";

const jiti = JITI(import.meta.url);

/** @type {typeof import('./src/index.ts')} */
const { luxass } = jiti("./src/index.ts");

export default luxass(
  {
    vue: true,
    react: true,
    astro: true,
    typescript: true,
    formatters: true,
    unocss: true,
    type: "lib",
  },
  {
    ignores: [
      "**/fixtures",
    ],
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
