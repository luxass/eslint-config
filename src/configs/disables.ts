import type { TypedFlatConfigItem } from "../types";

import { GLOB_SRC, GLOB_SRC_EXT } from "../globs";

export async function disables(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      files: [`scripts/${GLOB_SRC}`],
      name: "luxass/disables/scripts",
      rules: {
        "no-console": "off",
        "ts/explicit-function-return-type": "off",
      },
    },
    {
      files: [`cli/${GLOB_SRC}`, `cli.${GLOB_SRC_EXT}`],
      name: "luxass/disables/cli",
      rules: {
        "no-console": "off",
      },
    },
    {
      files: ["**/bin/**/*", `**/bin.${GLOB_SRC_EXT}`],
      name: "luxass/disables/bin",
      rules: {
        "antfu/no-import-dist": "off",
        "antfu/no-import-node-modules-by-path": "off",
      },
    },
    {
      files: ["**/*.d.?([cm])ts"],
      name: "luxass/disables/dts",
      rules: {
        "eslint-comments/no-unlimited-disable": "off",
        "import/no-duplicates": "off",
        "no-restricted-syntax": "off",
        "unused-imports/no-unused-vars": "off",
      },
    },
    {
      files: ["**/*.{test,spec}.([tj])s?(x)"],
      name: "luxass/disables/test",
      rules: {
        "no-unused-expressions": "off",
      },
    },
    {
      files: ["**/*.js", "**/*.cjs"],
      name: "luxass/disables/cjs",
      rules: {
        "ts/no-require-imports": "off",
      },
    },
  ];
}
