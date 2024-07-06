// @ts-check
import { tsImport } from "tsx/esm/api";

import styleMigrate from "@stylistic/eslint-plugin-migrate";

/** @type {typeof import('./src/index.ts')} */
const { luxass } = await tsImport("./src/index.ts", import.meta.url);

export default luxass(
  {
    vue: true,
    react: true,
    astro: true,
    typescript: true,
    formatters: true,
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
