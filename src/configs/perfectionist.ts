import pluginPerfectionist from "eslint-plugin-perfectionist"
import type { FlatConfigItem } from "../types"

/**
 * Optional perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export async function perfectionist(): Promise<FlatConfigItem[]> {
  return [
    {
      name: "luxass:perfectionist",
      plugins: {
        perfectionist: pluginPerfectionist,
      },
      rules: {},
    },
  ]
}
