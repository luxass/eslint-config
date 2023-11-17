import type { FlatConfigItem, OptionsIsInEditor, OptionsOverrides } from "../types";
import { GLOB_TESTS } from "../globs";
import { interop } from "../utils";

export async function test(
  options: OptionsIsInEditor & OptionsOverrides = {},
): Promise<FlatConfigItem[]> {
  const { isInEditor = false, overrides = {} } = options;

  const [
    pluginVitest,
    pluginNoOnlyTests,
  ] = await Promise.all([
    interop(import("eslint-plugin-vitest")),
    interop(import("eslint-plugin-no-only-tests")),
  ] as const);

  return [
    {
      name: "luxass:test:setup",
      plugins: {
        test: {
          ...pluginVitest,
          rules: {
            ...pluginVitest.rules,
            ...pluginNoOnlyTests.rules,
          },
        },
      },
    },
    {
      files: GLOB_TESTS,
      name: "luxass:test:rules",
      rules: {
        "test/consistent-test-it": [
          "error",
          { fn: "it", withinDescribe: "it" },
        ],
        "test/no-identical-title": "error",
        "test/no-only-tests": isInEditor ? "off" : "error",
        "test/prefer-hooks-in-order": "error",
        "test/prefer-lowercase-title": "error",

        ...overrides,
      },
    },
  ];
}
