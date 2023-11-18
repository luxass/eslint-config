import type { FlatConfigItem, PerfectionistOptions } from "../types";
import { pluginPerfectionist } from "../plugins";

/**
 * Optional perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export async function perfectionist(
  options: PerfectionistOptions = {},
): Promise<FlatConfigItem[]> {
  const { enableAllRules = false } = options;

  return [
    {
      name: "luxass:perfectionist",
      plugins: {
        perfectionist: pluginPerfectionist,
      },
      rules: {
        ...(enableAllRules
          ? {
              ...pluginPerfectionist.configs["recommended-natural"].rules,
              "perfectionist/sort-imports": "off", // TODO: This rule should probably be enabled in favor of import/order?
              "perfectionist/sort-vue-attributes": "off",
            }
          : {}),
      },
    },
  ];
}
