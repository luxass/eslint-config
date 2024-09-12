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
    isInEditor = false,
    files = GLOB_TESTS,
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
      name: "luxass/test/rules",
      files,
      rules: {
        "node/prefer-global/process": "off",

        "test/consistent-test-it": [
          "error",
          { fn: "it", withinDescribe: "it" },
        ],
        "test/no-identical-title": "error",
        "test/no-import-node-test": "error",
        "test/no-focused-tests": isInEditor ? "off" : ["error", { fixable: true }],
        "test/prefer-hooks-in-order": "error",
        "test/prefer-lowercase-title": "error",

        "ts/explicit-function-return-type": "off",

        ...overrides,
      },
    },
  ];
}
