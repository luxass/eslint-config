import type { TypedFlatConfigItem } from "../types";
import pluginNode from "eslint-plugin-n";
import { GLOB_SRC } from "../globs";

export function node(): TypedFlatConfigItem[] {
  return [
    {
      name: "luxass/node/setup",
      plugins: {
        node: pluginNode,
      },
    },
    {
      files: [GLOB_SRC],
      name: "luxass/node/rules",
      rules: {
        "node/handle-callback-err": ["error", "^(err|error)$"],
        "node/no-deprecated-api": "error",
        "node/no-exports-assign": "error",
        "node/no-new-require": "error",
        "node/no-path-concat": "error",
        "node/prefer-global/buffer": ["error", "never"],
        "node/prefer-global/process": ["error", "never"],
        "node/process-exit-as-throw": "error",
      },
    },
  ];
}
