// @ts-check
import styleMigrate from "@stylistic/eslint-plugin-migrate";
import luxass from "./dist/index.mjs";

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
    files: ["src/**/*.ts"],
    rules: {
      "perfectionist/sort-objects": [
        "error",
        {
          "type": "natural",
          "custom-groups": {
            top: [
              "name",
            ],
          },
          "groups": [
            "top",
            "files",
            "languageOptions",
            "rules",
            "unknown",
          ],
        },
      ],
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
