// @ts-check
import styleMigrate from "@stylistic/eslint-plugin-migrate"
import { luxass } from "./dist/index.js"

export default luxass([
  {
    ignores: [
      "fixtures",
      "_fixtures",
    ],
  },
  {
    files: ["src/**/*.ts"],
    plugins: {
      "style-migrate": styleMigrate,
    },
    rules: {
      "style-migrate/migrate": ["error", { namespaceTo: "style" }],
    },
  },
])
