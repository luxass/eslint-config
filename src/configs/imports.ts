import { type FlatESLintConfigItem } from "eslint-define-config";
import { pluginAntfu, pluginImport } from "../plugins";
import { GLOB_MARKDOWN, GLOB_SRC, GLOB_SRC_EXT } from "../globs";

export const imports: FlatESLintConfigItem[] = [
  {
    plugins: {
      antfu: pluginAntfu,
      import: pluginImport,
    },
    rules: {
      "antfu/import-dedupe": "error",
      "antfu/prefer-inline-type-import": "error",
      "import/export": "error",
      "import/first": "error",
      "import/newline-after-import": [
        "error",
        { considerComments: true, count: 1 },
      ],
      "import/no-default-export": "error",
      "import/no-duplicates": "error",
      "import/no-mutable-exports": "error",
      "import/no-named-default": "error",
      "import/no-self-import": "error",
      "import/no-webpack-loader-syntax": "error",
      "import/order": "error",
    },
  },
  {
    files: [
      `**/*config*.${GLOB_SRC_EXT}`,
      `**/views/${GLOB_SRC}`,
      `**/pages/${GLOB_SRC}`,
      `**/{index,vite,esbuild,rollup,webpack,rspack}.ts`,
      "**/*.d.ts",
      `${GLOB_MARKDOWN}/**`,
    ],
    plugins: {
      import: pluginImport,
    },
    rules: {
      "import/no-default-export": "off",
    },
  },
];
