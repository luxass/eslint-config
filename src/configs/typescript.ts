/* eslint-disable perfectionist/sort-objects */
import process from "node:process";
import type {
  ComponentExtsOptions,
  FlatConfigItem,
  OverrideOptions,
  TypeScriptOptions,
} from "../types";
import { GLOB_SRC } from "../globs";
import { pluginAntfu } from "../plugins";
import { interop, renameRules, toArray } from "../utils";

export async function typescript(
  options?: ComponentExtsOptions & OverrideOptions & TypeScriptOptions,
): Promise<FlatConfigItem[]> {
  const {
    componentExts = [],
    overrides = {},
    parserOptions = {},
  } = options ?? {};

  const typeAwareRules: FlatConfigItem["rules"] = {
    "dot-notation": "off",
    "no-implied-eval": "off",
    "no-throw-literal": "off",
    "ts/await-thenable": "error",
    "ts/dot-notation": ["error", { allowKeywords: true }],
    "ts/no-floating-promises": "error",
    "ts/no-for-in-array": "error",
    "ts/no-implied-eval": "error",
    "ts/no-misused-promises": "error",
    "ts/no-throw-literal": "error",
    "ts/no-unnecessary-type-assertion": "error",
    "ts/no-unsafe-argument": "error",
    "ts/no-unsafe-assignment": "error",
    "ts/no-unsafe-call": "error",
    "ts/no-unsafe-member-access": "error",
    "ts/no-unsafe-return": "error",
    "ts/restrict-plus-operands": "error",
    "ts/restrict-template-expressions": "error",
    "ts/unbound-method": "error",
  };

  const tsconfigPath = options?.tsconfigPath
    ? toArray(options.tsconfigPath)
    : undefined;

  const [
    pluginTs,
    parserTs,
  ] = await Promise.all([
    interop(import("@typescript-eslint/eslint-plugin")),
    interop(import("@typescript-eslint/parser")),
  ] as const);

  return [
    {
      // Install the plugins without globs, so they can be configured separately.
      name: "luxass:typescript:setup",
      plugins: {
        antfu: pluginAntfu,
        ts: pluginTs as any,
      },
    },
    {
      files: [GLOB_SRC, ...componentExts.map((ext) => `**/*.${ext}`)],
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          extraFileExtensions: componentExts.map((ext) => `.${ext}`),
          sourceType: "module",
          ...(tsconfigPath
            ? {
                project: tsconfigPath,
                tsconfigRootDir: process.cwd(),
              }
            : {}),
          ...(parserOptions as any),
        },
      },
      name: "luxass:typescript:rules",
      rules: {
        ...renameRules(
          pluginTs.configs["eslint-recommended"].overrides![0].rules!,
          "@typescript-eslint/",
          "ts/",
        ),
        ...renameRules(
          pluginTs.configs.strict.rules!,
          "@typescript-eslint/",
          "ts/",
        ),

        "no-dupe-class-members": "off",
        "no-invalid-this": "off",
        "no-loss-of-precision": "off",
        "no-redeclare": "off",
        "no-use-before-define": "off",
        "no-useless-constructor": "off",
        "ts/ban-ts-comment": [
          "error",
          { "ts-ignore": "allow-with-description" },
        ],
        "ts/ban-types": ["error", {
          extendDefaults: false,
          types: {
            "BigInt": {
              fixWith: "bigint",
              message: "Use `bigint` instead.",
            },
            "Boolean": {
              fixWith: "boolean",
              message: "Use `boolean` instead.",
            },
            "Function":
              "Use a specific function type instead, like `() => void`.",
            "Number": {
              fixWith: "number",
              message: "Use `number` instead.",
            },
            "Object": {
              fixWith: "Record<string, unknown>",
              message:
                "The `Object` type is mostly the same as `unknown`. You probably want `Record<string, unknown>` instead. See https://github.com/typescript-eslint/typescript-eslint/pull/848",
            },
            "String": {
              fixWith: "string",
              message: "Use `string` instead.",
            },
            "Symbol": {
              fixWith: "symbol",
              message: "Use `symbol` instead.",
            },
            "[]": {
              message: "Don't use the empty array type `[]`. It only allows empty arrays. Use `SomeType[]` instead.",
            },
            "object": {
              fixWith: "Record<string, unknown>",
              message:
                "The `object` type is hard to use. Use `Record<string, unknown>` instead. See: https://github.com/typescript-eslint/typescript-eslint/pull/848",
            },
            "{}": {
              fixWith: "Record<string, unknown>",
              message:
                "The `{}` type is mostly the same as `unknown`. You probably want `Record<string, unknown>` instead.",
            },
          },
        }],
        "ts/consistent-type-definitions": ["error", "interface"],
        "ts/consistent-type-imports": [
          "error",
          { disallowTypeAnnotations: false, prefer: "type-imports" },
        ],
        "ts/no-dupe-class-members": "error",
        "ts/no-dynamic-delete": "off",
        "ts/no-explicit-any": "off",
        "ts/no-extraneous-class": "off",
        "ts/no-import-type-side-effects": "error",
        "ts/no-invalid-this": "error",
        "ts/no-invalid-void-type": "off",
        "ts/no-loss-of-precision": "error",
        "ts/no-non-null-assertion": "off",
        "ts/no-redeclare": "error",
        "ts/no-require-imports": "error",
        "ts/no-unused-vars": "off",
        "ts/no-use-before-define": [
          "error",
          { classes: false, functions: false, variables: true },
        ],
        "ts/no-useless-constructor": "off",
        "ts/prefer-ts-expect-error": "error",
        "ts/triple-slash-reference": "off",
        "ts/unified-signatures": "off",

        ...(tsconfigPath ? typeAwareRules : {}),
        ...overrides,
      },
    },
    {
      files: ["**/*.d.ts"],
      name: "luxass:typescript:dts-overrides",
      rules: {
        "eslint-comments/no-unlimited-disable": "off",
        "import/no-duplicates": "off",
        "no-restricted-syntax": "off",
        "unused-imports/no-unused-vars": "off",
      },
    },
    {
      files: ["**/*.{test,spec}.ts?(x)"],
      name: "luxass:typescript:tests-overrides",
      rules: {
        "no-unused-expressions": "off",
      },
    },
    {
      files: ["**/*.js", "**/*.cjs"],
      name: "luxass:typescript:javascript-overrides",
      rules: {
        "ts/no-require-imports": "off",
        "ts/no-var-requires": "off",
      },
    },

  ];
}
