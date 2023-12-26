import { ESLintUtils } from "@typescript-eslint/utils";

export const createESLintRule = ESLintUtils.RuleCreator((ruleName) => `https://github.com/luxass/eslint-config/blob/main/src/custom-rules/${ruleName}/README.md`);
