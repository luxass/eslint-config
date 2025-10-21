import type { ParserOptions } from "@typescript-eslint/parser";
import type { Linter } from "eslint";
import type {
  ProjectType,
  TypedFlatConfigItem,
} from "../types";
import process from "node:process";
import pluginAntfu from "eslint-plugin-antfu";
import { GLOB_ASTRO_TS, GLOB_MARKDOWN, GLOB_TS, GLOB_TSX } from "../globs";
import { interop, renameRules } from "../utils";

export interface TypeScriptOptions {
  /**
   * Additional extensions for components.
   *
   * @example ["vue"]
   * @default []
   */
  exts?: string[];

  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<ParserOptions>;

  /**
   * When this options is provided, type aware rules will be enabled.
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  tsconfigPath?: string | string[];

  /**
   * Glob patterns for TypeScript files.
   *
   * @default [GLOB_SRC]
   * @see https://github.com/luxass/eslint-config/blob/main/src/globs.ts
   */
  files?: string[];

  /**
   * Glob patterns for files that should be type aware.
   * @default ['**\/*.{ts,tsx}']
   */
  filesTypeAware?: string[];

  /**
   * Glob patterns for files that should not be type aware.
   * @default ['**\/*.md\/**', '**\/*.astro/*.ts']
   */
  ignoresTypeAware?: string[];

  /**
   * Overrides for the config.
   */
  overrides?: TypedFlatConfigItem["rules"];

  /**
   * Override type aware rules.
   */
  overridesTypeAware?: TypedFlatConfigItem["rules"];

  /**
   * Type of the project. `lib` will enable more strict rules for libraries.
   *
   * @default "app"
   */
  type?: ProjectType;

  /**
   * Enable erasable syntax only rules.
   *
   * @see https://github.com/JoshuaKGoldberg/eslint-plugin-erasable-syntax-only
   * @default false
   */
  erasableOnly?: boolean;
}

export async function typescript(
  options: TypeScriptOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    erasableOnly = false,
    exts = [],
    overrides = {},
    overridesTypeAware = {},
    parserOptions = {},
    type = "app",
  } = options ?? {};

  const files = options.files ?? [
    GLOB_TS,
    GLOB_TSX,
    ...exts.map((ext) => `**/*.${ext}`),
  ];

  const filesTypeAware = options.filesTypeAware ?? [GLOB_TS, GLOB_TSX];
  const ignoresTypeAware = options.ignoresTypeAware ?? [
    `${GLOB_MARKDOWN}/**`,
    GLOB_ASTRO_TS,
  ];

  const tsconfigPath = options?.tsconfigPath
    ? options.tsconfigPath
    : undefined;
  const isTypeAware = !!tsconfigPath;

  const typeAwareRules: TypedFlatConfigItem["rules"] = {
    "dot-notation": "off",
    "no-implied-eval": "off",
    "ts/await-thenable": "error",
    "ts/dot-notation": ["error", { allowKeywords: true }],
    "ts/no-floating-promises": "error",
    "ts/no-for-in-array": "error",
    "ts/no-implied-eval": "error",
    "ts/no-misused-promises": "error",
    "ts/no-unnecessary-type-assertion": "error",
    "ts/no-unsafe-argument": "error",
    "ts/no-unsafe-assignment": "error",
    "ts/no-unsafe-call": "error",
    "ts/no-unsafe-member-access": "error",
    "ts/no-unsafe-return": "error",
    "ts/promise-function-async": "error",
    "ts/restrict-plus-operands": "error",
    "ts/restrict-template-expressions": "error",
    "ts/return-await": ["error", "in-try-catch"],
    "ts/strict-boolean-expressions": ["error", { allowNullableBoolean: true, allowNullableObject: true }],
    "ts/switch-exhaustiveness-check": "error",
    "ts/unbound-method": "error",
  };

  const [
    pluginTs,
    parserTs,
  ] = await Promise.all([
    interop(import("@typescript-eslint/eslint-plugin")),
    interop(import("@typescript-eslint/parser")),
  ] as const);

  function makeParser(typeAware: boolean, files: string[], ignores?: string[]): TypedFlatConfigItem {
    return {
      files,
      ...ignores ? { ignores } : {},
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          extraFileExtensions: exts.map((ext) => `.${ext}`),
          sourceType: "module",
          ...typeAware
            ? {
                projectService: {
                  allowDefaultProject: ["./*.js"],
                  defaultProject: tsconfigPath,
                },
                tsconfigRootDir: process.cwd(),
              }
            : {},
          ...parserOptions as any,
        },
      },
      name: `luxass/typescript/${typeAware ? "type-aware-parser" : "parser"}`,
    };
  }

  return [
    {
      // Install the plugins without globs, so they can be configured separately.
      name: "luxass/typescript/setup",
      plugins: {
        antfu: pluginAntfu,
        ts: pluginTs as any,
      },
    },
    ...isTypeAware
      ? [
          makeParser(true, filesTypeAware, ignoresTypeAware),
          makeParser(false, files, filesTypeAware),
        ]
      : [makeParser(false, files)],
    {
      files,
      name: "luxass/typescript/rules",
      rules: {
        ...renameRules(
          pluginTs.configs["eslint-recommended"].overrides![0].rules!,
          {
            "@typescript-eslint": "ts",
          },
        ),
        ...renameRules(
          pluginTs.configs.strict.rules!,
          {
            "@typescript-eslint": "ts",
          },
        ),
        "no-dupe-class-members": "off",
        "no-invalid-this": "off",
        "no-loss-of-precision": "error",
        "no-redeclare": "off",
        "no-use-before-define": "off",
        "no-useless-constructor": "off",
        "ts/ban-ts-comment": [
          "error",
          {
            "ts-expect-error": "allow-with-description",
            "ts-ignore": "allow-with-description",
          },
        ],
        "ts/consistent-type-definitions": ["error", "interface"],
        "ts/consistent-type-imports": [
          "error",
          {
            disallowTypeAnnotations: false,
            fixStyle: "separate-type-imports",
            prefer: "type-imports",
          },
        ],
        "ts/method-signature-style": ["error", "property"], // https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
        "ts/no-dupe-class-members": "error",
        "ts/no-dynamic-delete": "off",
        "ts/no-empty-object-type": "error",
        "ts/no-explicit-any": "off",
        "ts/no-extraneous-class": "off",
        "ts/no-import-type-side-effects": "error",
        "ts/no-invalid-this": "error",
        "ts/no-invalid-void-type": "off",
        "ts/no-non-null-assertion": "off",
        "ts/no-redeclare": ["error", { builtinGlobals: false }],
        "ts/no-require-imports": "error",
        "ts/no-unused-expressions": ["error", {
          allowShortCircuit: true,
          allowTaggedTemplates: true,
          allowTernary: true,
        }],
        "ts/no-unused-vars": "off",
        "ts/no-use-before-define": [
          "error",
          { classes: false, functions: false, variables: true },
        ],
        "ts/no-useless-constructor": "off",
        "ts/no-wrapper-object-types": "error",
        "ts/triple-slash-reference": "off",
        "ts/unified-signatures": "off",

        ...(type === "lib"
          ? {
              "ts/explicit-function-return-type": ["error", {
                allowExpressions: true,
                allowHigherOrderFunctions: true,
                allowIIFEs: true,
              }],
            }
          : {}
        ),

        ...overrides,
      },
    },
    ...(isTypeAware
      ? [{
          files: filesTypeAware,
          ignores: ignoresTypeAware,
          name: "luxass/typescript/rules-type-aware",
          rules: {
            ...typeAwareRules,
            ...overridesTypeAware,
          },
        }]
      : []),
    ...(erasableOnly
      ? [
          {
            name: "luxas/typescript/erasable-syntax-only",
            plugins: {
              "erasable-syntax-only": await interop(import("eslint-plugin-erasable-syntax-only")),
            },
            rules: {
              "erasable-syntax-only/enums": "error",
              "erasable-syntax-only/import-aliases": "error",
              "erasable-syntax-only/namespaces": "error",
              "erasable-syntax-only/parameter-properties": "error",
            } as Record<string, Linter.RuleEntry>,
          },
        ]
      : []),
  ];
}
