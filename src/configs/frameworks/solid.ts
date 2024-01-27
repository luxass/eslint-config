import { GLOB_JSX, GLOB_TSX } from "../../globs";
import type { FlatConfigItem } from "../../types";
import { ensure, interop } from "../../utils";

export interface SolidOptions {
  /**
   * Override rules.
   */
  overrides?: FlatConfigItem["rules"];

  /**
   * Enable TypeScript support.
   *
   * @default true
   */
  typescript?: boolean;

  /**
   * Enable JSX A11y support.
   *
   * @default false
   */
  a11y?: boolean;

  /**
   * Glob patterns for JSX & TSX files.
   *
   * @default [GLOB_JSX, GLOB_TSX]
   * @see https://github.com/luxass/eslint-config/blob/main/src/globs.ts
   */
  files?: string[];
}

export async function solid(options: SolidOptions = {}): Promise<FlatConfigItem[]> {
  const {
    a11y = false,
    files = [GLOB_JSX, GLOB_TSX],
    overrides = {},
    typescript = true,
  } = options;

  await ensure([
    "eslint-plugin-solid",
  ]);

  const [
    pluginSolid,
  ] = await Promise.all([
    interop(import("eslint-plugin-solid")),
  ] as const);

  return [
    {
      name: "luxass:solid:setup",
      plugins: {
        solid: pluginSolid,
      },
    },
    {
      name: "luxass:solid:rules",
      files,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
        sourceType: "module",
      },
      rules: {
        ...(a11y
          ? {
            // recommended rules for jsx-a11y
              "jsx-a11y/alt-text": "error",
              "jsx-a11y/anchor-ambiguous-text": "off",

              "jsx-a11y/anchor-has-content": "error",

              "jsx-a11y/anchor-is-valid": "error",
              "jsx-a11y/aria-activedescendant-has-tabindex": "error",
              "jsx-a11y/aria-props": "error",
              "jsx-a11y/aria-proptypes": "error",
              "jsx-a11y/aria-role": "error",
              "jsx-a11y/aria-unsupported-elements": "error",
              "jsx-a11y/autocomplete-valid": "error",
              "jsx-a11y/click-events-have-key-events": "error",
              "jsx-a11y/control-has-associated-label": [
                "off",
                {
                  ignoreElements: [
                    "audio",
                    "canvas",
                    "embed",
                    "input",
                    "textarea",
                    "tr",
                    "video",
                  ],
                  ignoreRoles: [
                    "grid",
                    "listbox",
                    "menu",
                    "menubar",
                    "radiogroup",
                    "row",
                    "tablist",
                    "toolbar",
                    "tree",
                    "treegrid",
                  ],
                  includeRoles: [
                    "alert",
                    "dialog",
                  ],
                },
              ],
              "jsx-a11y/heading-has-content": "error",
              "jsx-a11y/html-has-lang": "error",
              "jsx-a11y/iframe-has-title": "error",
              "jsx-a11y/img-redundant-alt": "error",
              "jsx-a11y/interactive-supports-focus": [
                "error",
                {
                  tabbable: [
                    "button",
                    "checkbox",
                    "link",
                    "searchbox",
                    "spinbutton",
                    "switch",
                    "textbox",
                  ],
                },
              ],
              "jsx-a11y/label-has-associated-control": "error",
              "jsx-a11y/label-has-for": "off",
              "jsx-a11y/media-has-caption": "error",
              "jsx-a11y/mouse-events-have-key-events": "error",
              "jsx-a11y/no-access-key": "error",
              "jsx-a11y/no-autofocus": "error",
              "jsx-a11y/no-distracting-elements": "error",
              "jsx-a11y/no-interactive-element-to-noninteractive-role": [
                "error",
                {
                  canvas: [
                    "img",
                  ],
                  tr: [
                    "none",
                    "presentation",
                  ],
                },
              ],
              "jsx-a11y/no-noninteractive-element-interactions": [
                "error",
                {
                  alert: [
                    "onKeyUp",
                    "onKeyDown",
                    "onKeyPress",
                  ],
                  body: [
                    "onError",
                    "onLoad",
                  ],
                  dialog: [
                    "onKeyUp",
                    "onKeyDown",
                    "onKeyPress",
                  ],
                  handlers: [
                    "onClick",
                    "onError",
                    "onLoad",
                    "onMouseDown",
                    "onMouseUp",
                    "onKeyPress",
                    "onKeyDown",
                    "onKeyUp",
                  ],
                  iframe: [
                    "onError",
                    "onLoad",
                  ],
                  img: [
                    "onError",
                    "onLoad",
                  ],
                },
              ],
              "jsx-a11y/no-noninteractive-element-to-interactive-role": [
                "error",
                {
                  fieldset: [
                    "radiogroup",
                    "presentation",
                  ],
                  li: [
                    "menuitem",
                    "option",
                    "row",
                    "tab",
                    "treeitem",
                  ],
                  ol: [
                    "listbox",
                    "menu",
                    "menubar",
                    "radiogroup",
                    "tablist",
                    "tree",
                    "treegrid",
                  ],
                  table: [
                    "grid",
                  ],
                  td: [
                    "gridcell",
                  ],
                  ul: [
                    "listbox",
                    "menu",
                    "menubar",
                    "radiogroup",
                    "tablist",
                    "tree",
                    "treegrid",
                  ],
                },
              ],
              "jsx-a11y/no-noninteractive-tabindex": [
                "error",
                {
                  allowExpressionValues: true,
                  roles: [
                    "tabpanel",
                  ],
                  tags: [],
                },
              ],
              "jsx-a11y/no-redundant-roles": "error",
              "jsx-a11y/no-static-element-interactions": [
                "error",
                {
                  allowExpressionValues: true,
                  handlers: [
                    "onClick",
                    "onMouseDown",
                    "onMouseUp",
                    "onKeyPress",
                    "onKeyDown",
                    "onKeyUp",
                  ],
                },
              ],
              "jsx-a11y/role-has-required-aria-props": "error",
              "jsx-a11y/role-supports-aria-props": "error",
              "jsx-a11y/scope": "error",
              "jsx-a11y/tabindex-no-positive": "error",
            }
          : {}),

        // solid recommended rules
        // reactivity
        "solid/components-return-once": 1,
        "solid/event-handlers": 1,
        // these rules are mostly style suggestions
        "solid/imports": 1,
        // identifier usage is important
        "solid/jsx-no-duplicate-props": 2,
        "solid/jsx-no-script-url": 2,
        "solid/jsx-no-undef": 2,
        "solid/jsx-uses-vars": 2,
        "solid/no-array-handlers": 0,
        "solid/no-destructure": 2,
        // security problems
        "solid/no-innerhtml": 2,
        // only necessary for resource-constrained environments
        "solid/no-proxy-apis": 0,
        "solid/no-react-deps": 1,
        "solid/no-react-specific-props": 1,
        "solid/no-unknown-namespaces": 2,
        // deprecated
        "solid/prefer-classlist": 0,
        "solid/prefer-for": 2,
        // handled by Solid compiler, opt-in style suggestion
        "solid/prefer-show": 0,
        "solid/reactivity": 1,
        "solid/self-closing-comp": 1,
        "solid/style-prop": 1,

        ...typescript
          ? {
              "solid/jsx-no-undef": [2, { typescriptEnabled: true }],
              // namespaces taken care of by TS
              "solid/no-unknown-namespaces": 0,
            }
          : {},

        // overrides
        ...overrides,
      },
    },
  ];
}
