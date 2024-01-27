import type { RuleListener, RuleModule } from "@typescript-eslint/utils/ts-eslint";
import { createRule } from "../utils";

export interface NoOnlyTestsOptions {
  blocks?: string[];
  focus?: string[];
}

export const RULE_NAME = "no-only-tests";
export type MessageIds = "not-permitted";

const DEFAULT_OPTIONS = {
  blocks: ["describe", "it", "test"],
  focus: ["only"],
};

function getPath(node: any, path: any[] = []) {
  if (node) {
    const nodeName = node.name || (node.property && node.property.name);
    if (node.object) {
      return getPath(
        node.object,
        [nodeName, ...path],
      );
    }
    if (node.callee) return getPath(node.callee, path);
    return [nodeName, ...path];
  }
  return path;
}

export const noOnlyTests = createRule<[NoOnlyTestsOptions], MessageIds>({
  name: RULE_NAME,
  create: (context, [options]) => {
    const {
      blocks = DEFAULT_OPTIONS.blocks,
      focus = DEFAULT_OPTIONS.focus,
    } = options;

    return {
      Identifier(node) {
        // @ts-expect-error We do not know what type parent is.
        const parent = node.parent?.object;

        if (!parent) return;
        if (!focus.includes(node.name)) return;

        const callPath = getPath(node.parent).join(".");

        const found = blocks.find((block) => {
          // Allow wildcard tail matching of blocks when ending in a `*`
          if (block.endsWith("*")) {
            return callPath.startsWith(block.replace(/\*$/, ""));
          }
          return callPath.startsWith(`${block}.`);
        });

        if (found) {
          context.report({
            data: { block: callPath.split(".")[0], focus: node.name },
            messageId: "not-permitted",
            node,
          });
        }
      },
    };
  },
  defaultOptions: [
    {
      blocks: ["describe", "it", "test"],
      focus: ["only"],
    },
  ],
  meta: {
    docs: {
      description: "disallow .only blocks in tests",
      recommended: "recommended",
    },
    messages: {
      "not-permitted": "{{ block }}.{{ focus }} not permitted",
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          blocks: {
            items: {
              type: "string",
            },
            type: "array",
            uniqueItems: true,
          },
          focus: {
            items: {
              type: "string",
            },
            type: "array",
            uniqueItems: true,
          },
        },
        type: "object",
      },
    ],
    type: "layout",
  },
}) satisfies RuleModule<MessageIds, [NoOnlyTestsOptions], RuleListener>;
