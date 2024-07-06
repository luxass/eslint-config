import { configs } from "eslint-plugin-regexp";
import type { TypedFlatConfigItem } from "../types";

export interface RegExpOptions {
  /**
   * Override rules.
   */
  overrides?: TypedFlatConfigItem["rules"];

  /**
   * Override rulelevels
   */
  level?: "error" | "warn";
}

export async function regexp(
  options: RegExpOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const config = configs["flat/recommended"] as TypedFlatConfigItem;

  const rules = {
    ...config.rules,
  };

  if (options.level === "warn") {
    for (const key in rules) {
      if (rules[key] === "error") {
        rules[key] = "warn";
      }
    }
  }

  return [
    {
      ...config,
      name: "luxass/regexp/rules",
      rules: {
        ...rules,
        ...options.overrides,
      },
    },
  ];
}
