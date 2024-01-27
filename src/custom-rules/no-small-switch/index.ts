import type { RuleListener, RuleModule } from "@typescript-eslint/utils/ts-eslint";
import { createRule } from "../utils";

export const RULE_NAME = "no-small-switch";
export type MessageIds = "small-switch";

export const noSmallSwitch = createRule<[], MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow small switch statements",
      recommended: "recommended",
    },
    schema: [],
    messages: {
      "small-switch":
        "\"switch\" statements should have at least 3 \"case\" clauses",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      SwitchStatement(node) {
        const hasDefault = node.cases.find((c) => c.test === null);

        if (node.cases.length < 2 || (node.cases.length === 2 && hasDefault)) {
          const firstToken = context.sourceCode.getFirstToken(node);
          if (!firstToken) return;

          context.report({
            node,
            messageId: "small-switch",
            loc: firstToken.loc,
          });
        }
      },
    };
  },
}) satisfies RuleModule<MessageIds, [], RuleListener>;
