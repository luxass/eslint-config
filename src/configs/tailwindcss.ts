import { GLOB_HTML, GLOB_SRC } from "../globs";
import type { ConfigurationOptions, FlatConfigItem, OverrideOptions, TailwindCSSOptions } from "../types";
import { ensure, interop } from "../utils";

const DEFAULT_TAILWIND_CALLEES = ["classnames", "clsx", "cx", "cn"];
const DEFAULT_CLASS_REGEX = "^class(Name)?$";

export async function tailwindcss(
  options: TailwindCSSOptions & ConfigurationOptions<"nextjs"> & OverrideOptions = {},
): Promise<FlatConfigItem[]> {
  const {
    callees = DEFAULT_TAILWIND_CALLEES,
    classRegex = DEFAULT_CLASS_REGEX,
    config = undefined,
    nextjs,
    overrides,
    removeDuplicates = true,
  } = options;

  await ensure([
    "eslint-plugin-tailwindcss",
  ]);

  const pluginTailwindCSS = await interop(import("eslint-plugin-tailwindcss"));

  const tailwindCSSCallee = callees ?? DEFAULT_TAILWIND_CALLEES;

  return [
    {
      name: "luxass:tailwindcss",
      plugins: {
        tailwindcss: pluginTailwindCSS,
      },
    },
    {
      files: [GLOB_SRC, GLOB_HTML],
      name: "luxass:tailwindcss:rules",
      rules: {
        "tailwindcss/classnames-order": ["error"],
        "tailwindcss/enforces-negative-arbitrary-values": ["warn"],
        "tailwindcss/enforces-shorthand": ["warn"],
        "tailwindcss/migration-from-tailwind-2": ["warn"],
        "tailwindcss/no-arbitrary-value": ["off"],
        "tailwindcss/no-contradicting-classname": ["error"],
        "tailwindcss/no-custom-classname": ["warn"],

        // overrides
        ...overrides,
      },
      settings: {
        tailwindcss: {
          callees: tailwindCSSCallee,
          classRegex: nextjs ? "^(class(Name)?|tw)$" : classRegex,
          config,
          removeDuplicates,
        },
      },
    },
    {
      files: ["**/tailwind.config.?([cm])[jt]s"],
      name: "luxass:tailwindcss:sort-keys-override",
      rules: {
        "sort-keys": "off",
        "sort-keys/sort-keys-fix": "off",
      },
    },
  ];
}
