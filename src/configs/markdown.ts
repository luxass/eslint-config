import { mergeProcessors, processorPassThrough } from "eslint-merge-processors";
import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_IN_MARKDOWN } from "../globs";
import { interop, parserPlain } from "../utils";
import type {
  TypedFlatConfigItem,
} from "../types";

export interface MarkdownOptions {
  /**
   * Override rules.
   */
  overrides?: TypedFlatConfigItem["rules"];

  /**
   * Additional extensions for components.
   *
   * @example ["vue"]
   * @default []
   */
  exts?: string[];

  /**
   * Glob patterns for Markdown files.
   *
   * @default [GLOB_MARKDOWN]
   * @see https://github.com/luxass/eslint-config/blob/main/src/globs.ts
   */
  files?: string[];
}

export async function markdown(
  options: MarkdownOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    exts = [],
    files = [GLOB_MARKDOWN],
    overrides = {},
  } = options;

  const markdown = await interop(import("@eslint/markdown"));

  return [
    {
      name: "luxass/markdown/setup",
      plugins: {
        markdown,
      },
    },
    {
      name: "luxass/markdown/processor",
      files,
      ignores: [GLOB_MARKDOWN_IN_MARKDOWN],
      // `eslint-plugin-markdown` only creates virtual files for code blocks,
      // but not the markdown file itself. We use `eslint-merge-processors` to
      // add a pass-through processor for the markdown file itself.
      processor: mergeProcessors([
        markdown.processors!.markdown,
        processorPassThrough,
      ]),
    },
    {
      name: "luxass/markdown/parser",
      files,
      languageOptions: {
        parser: parserPlain,
      },
    },
    {
      name: "luxass/markdown/disables",
      files: [
        GLOB_MARKDOWN_CODE,
        ...exts.map((ext) => `${GLOB_MARKDOWN}/**/*.${ext}`),
      ],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            impliedStrict: true,
          },
        },
      },
      rules: {
        "import/newline-after-import": "off",

        "no-alert": "off",
        "no-console": "off",
        "no-labels": "off",
        "no-lone-blocks": "off",
        "no-restricted-syntax": "off",
        "no-undef": "off",
        "no-unused-expressions": "off",
        "no-unused-labels": "off",
        "no-unused-vars": "off",

        "node/prefer-global/process": "off",
        "style/comma-dangle": "off",

        "style/eol-last": "off",
        "ts/consistent-type-imports": "off",
        "ts/no-namespace": "off",
        "ts/no-redeclare": "off",
        "ts/no-require-imports": "off",
        "ts/no-unused-expressions": "off",
        "ts/no-unused-vars": "off",
        "ts/no-use-before-define": "off",
        "ts/no-var-requires": "off",

        "unicode-bom": "off",
        "unused-imports/no-unused-imports": "off",
        "unused-imports/no-unused-vars": "off",

        ...overrides,
      },
    },
  ];
}
