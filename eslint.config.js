// @ts-check
import styleMigrate from "@stylistic/eslint-plugin-migrate";

// eslint-disable-next-line antfu/no-import-dist
import luxass from "./dist/index.js";

export default luxass(
  {
    vue: true,
    typescript: true,
    formatters: true,
    ignores: [
      "**/fixtures",
    ],
  },
  {
    files: ["src/configs/**/*.ts"],
    plugins: {
      "style-migrate": styleMigrate,
    },
    rules: {
      "style-migrate/migrate": ["error", { namespaceTo: "style" }],
    },
  },
);
