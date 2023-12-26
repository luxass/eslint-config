import { ESLintUtils } from "@typescript-eslint/utils";

export const createRule = ESLintUtils.RuleCreator((ruleName) => `https://github.com/luxass/eslint-config/blob/main/src/custom-rules/${ruleName}/README.md`);

export type { ESLintUtils };
