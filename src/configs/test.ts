import type { TypedFlatConfigItem } from "../types";
import { GLOB_TESTS } from "../globs";
import { interop } from "../utils";

export interface TestOptions {
  /**
   * Disable some rules when eslint is run in an editor.
   *
   * @default false
   */
  isInEditor?: boolean;

  /**
   * Glob patterns for test files.
   *
   * @default [GLOB_TESTS]
   * @see https://github.com/luxass/eslint-config/blob/main/src/globs.ts
   */
  files?: string[];

  /**
   * Override rules for for test files.
   */
  overrides?: TypedFlatConfigItem["rules"];
}

// Hold the reference so we don't redeclare the plugin on each call
let _pluginTest: any;

export async function test(
  options: TestOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = GLOB_TESTS,
    isInEditor = false,
    overrides = {},
  } = options;

  const [
    pluginVitest,
  ] = await Promise.all([
    interop(import("@vitest/eslint-plugin")),
  ] as const);

  _pluginTest = _pluginTest || pluginVitest;

  return [
    {
      name: "luxass/test/setup",
      plugins: {
        test: _pluginTest,
      },
    },
    {
      files,
      name: "luxass/test/rules",
      rules: {

        "test/consistent-test-it": [
          "error",
          { fn: "it", withinDescribe: "it" },
        ],
        "test/no-focused-tests": isInEditor ? "off" : ["error", { fixable: true }],
        "test/no-identical-title": "error",
        "test/no-import-node-test": "error",
        "test/prefer-hooks-in-order": "error",
        "test/prefer-lowercase-title": "error",

        // Disables
        ...{
          "antfu/no-top-level-await": "off",
          "no-unused-expressions": "off",
          "node/prefer-global/process": "off",
          "ts/explicit-function-return-type": "off",
        },

        ...overrides,
      },
    },
  ];
}
