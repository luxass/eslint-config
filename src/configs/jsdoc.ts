import type { TypedFlatConfigItem } from "../types";
import type { StylisticConfig } from "./stylistic";
import { interop } from "../utils";

export interface JSDOCOptions {
  /**
   * Enable stylistic rules.
   *
   * @default true
   */
  stylistic?: boolean | StylisticConfig;

  /**
   * Overrides for the config.
   */
  overrides?: TypedFlatConfigItem["rules"];
}

export async function jsdoc(options: JSDOCOptions = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides,
    stylistic = true,
  } = options;

  return [
    {
      name: "luxass/jsdoc/rules",
      plugins: {
        jsdoc: await interop(import("eslint-plugin-jsdoc")),
      },
      rules: {
        "jsdoc/check-access": "warn",
        "jsdoc/check-param-names": "warn",
        "jsdoc/check-property-names": "warn",
        "jsdoc/check-types": "warn",
        "jsdoc/empty-tags": "warn",
        "jsdoc/implements-on-classes": "warn",
        "jsdoc/no-defaults": "warn",
        "jsdoc/no-multi-asterisks": "warn",
        "jsdoc/require-param-name": "warn",
        "jsdoc/require-property": "warn",
        "jsdoc/require-property-description": "warn",
        "jsdoc/require-property-name": "warn",
        "jsdoc/require-returns-check": "warn",
        "jsdoc/require-returns-description": "warn",
        "jsdoc/require-yields-check": "warn",

        ...(stylistic
          ? {
              "jsdoc/check-alignment": "warn",
              "jsdoc/multiline-blocks": "warn",
            }
          : {}),

        ...overrides,
      },
    },
  ];
}
