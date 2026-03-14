import type {
  TypedFlatConfigItem,
} from "../types";
import { mergeProcessors, processorPassThrough } from "eslint-merge-processors";
import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_IN_MARKDOWN } from "../globs";
import { interop } from "../utils";

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

  /**
   * Enable GFM (GitHub Flavored Markdown) support.
   *
   * @default true
   */
  gfm?: boolean;

  /**
   * Override rules for markdown itself.
   */
  overridesMarkdown?: TypedFlatConfigItem["rules"];
}

export async function markdown(
  options: MarkdownOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    exts = [],
    files = [GLOB_MARKDOWN],
    gfm = true,
    overrides = {},
    overridesMarkdown = {},
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
      files,
      ignores: [GLOB_MARKDOWN_IN_MARKDOWN],
      name: "luxass/markdown/processor",
      // `eslint-plugin-markdown` only creates virtual files for code blocks,
      // but not the markdown file itself. We use `eslint-merge-processors` to
      // add a pass-through processor for the markdown file itself.
      processor: mergeProcessors([
        markdown.processors!.markdown,
        processorPassThrough,
      ]),
    },
    {
      files,
      language: gfm ? "markdown/gfm" : "markdown/commonmark",
      name: "luxass/markdown/parser",
    },
    {
      files,
      name: "luxass/markdown/rules",
      rules: {
        ...markdown.configs.recommended.at(0)?.rules,
        "markdown/fenced-code-language": "off",
        // https://github.com/eslint/markdown/issues/294
        "markdown/no-missing-label-refs": "off",
        ...overridesMarkdown,
      },
    },
    {
      files,
      name: "luxass/markdown/disables/markdown",
      rules: {
        // Disable rules do not work with markdown sourcecode.
        "command/command": "off",
        "no-irregular-whitespace": "off",
        "perfectionist/sort-exports": "off",
        "perfectionist/sort-imports": "off",
        "regexp/no-legacy-features": "off",
        "regexp/no-missing-g-flag": "off",
        "regexp/no-useless-dollar-replacements": "off",
        "regexp/no-useless-flag": "off",
        "style/indent": "off",
      },
    },
    {
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
      name: "luxass/markdown/disables/code",
      rules: {
        "antfu/no-top-level-await": "off",

        "e18e/prefer-static-regex": "off",

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
        "style/padding-line-between-statements": "off",

        "ts/consistent-type-imports": "off",
        "ts/explicit-function-return-type": "off",
        "ts/no-namespace": "off",
        "ts/no-redeclare": "off",
        "ts/no-require-imports": "off",
        "ts/no-unused-expressions": "off",
        "ts/no-unused-vars": "off",
        "ts/no-use-before-define": "off",

        "unicode-bom": "off",
        "unused-imports/no-unused-imports": "off",
        "unused-imports/no-unused-vars": "off",

        ...overrides,
      },
    },
  ];
}
