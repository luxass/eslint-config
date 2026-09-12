import type { Options as VueBlocksOptions } from "eslint-processor-vue-blocks";
import type {
  TypedFlatConfigItem,
} from "../types";
import type { StylisticConfig } from "./stylistic";
import { mergeProcessors } from "eslint-merge-processors";
import { GLOB_VUE } from "../globs";
import { interop } from "../utils";

export interface VueOptions {
  /**
   * Override rules.
   */
  overrides?: TypedFlatConfigItem["rules"];

  /**
   * Enable stylistic rules.
   *
   * @default true
   */
  stylistic?: boolean | StylisticConfig;

  /**
   * Enable TypeScript support.
   *
   * @default false
   */
  typescript?: boolean;

  /**
   * Create virtual files for Vue SFC blocks to enable linting.
   *
   * @see https://github.com/antfu/eslint-processor-vue-blocks
   * @default true
   */
  sfcBlocks?: boolean | VueBlocksOptions;

  /**
   * Enable accessibility rules.
   *
   * Requires installing:
   * - `eslint-plugin-vuejs-accessibility`
   *
   * @default false
   */
  a11y?: boolean;

  /**
   * Vue version.
   *
   * @default 3
   */
  vueVersion?: 2 | 3;

  /**
   * Glob patterns for Vue files.
   *
   * @default [GLOB_VUE]
   * @see https://github.com/luxass/eslint-config/blob/main/src/globs.ts
   */
  files?: string[];
}

export async function vue(
  options: VueOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    a11y = false,
    files = [GLOB_VUE],
    overrides = {},
    stylistic = true,
    vueVersion = 3,
  } = options;

  const [
    pluginVue,
    parserVue,
    processorVueBlocks,
    pluginVueA11y,
  ] = await Promise.all([
    interop(import("eslint-plugin-vue")),
    interop(import("vue-eslint-parser")),
    interop(import("eslint-processor-vue-blocks")),
    ...a11y ? [interop(import("eslint-plugin-vuejs-accessibility"))] : [],
  ] as const);

  const sfcBlocks = options.sfcBlocks === true
    ? {}
    : options.sfcBlocks ?? {};

  const {
    braceStyle = "stroustrup",
    indent = 2,
  } = typeof stylistic === "boolean" ? {} : stylistic;

  return [
    {
      // This allows Vue plugin to work with auto imports
      // https://github.com/vuejs/eslint-plugin-vue/pull/2422
      languageOptions: {
        globals: {
          computed: "readonly",
          defineEmits: "readonly",
          defineExpose: "readonly",
          defineProps: "readonly",
          onMounted: "readonly",
          onUnmounted: "readonly",
          reactive: "readonly",
          ref: "readonly",
          shallowReactive: "readonly",
          shallowRef: "readonly",
          toRef: "readonly",
          toRefs: "readonly",
          watch: "readonly",
          watchEffect: "readonly",
        },
      },
      name: "luxass/vue/setup",
      plugins: {
        vue: pluginVue,
        ...a11y ? { "vue-a11y": pluginVueA11y } : {},
      },
    },
    {
      files,
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          extraFileExtensions: [".vue"],
          parser: options.typescript
            ? await interop(import("@typescript-eslint/parser")) as any
            : null,
          sourceType: "module",
        },
      },
      name: "luxass/vue/rules",
      processor: sfcBlocks === false
        ? pluginVue.processors[".vue"]
        : mergeProcessors([
            pluginVue.processors[".vue"],
            processorVueBlocks({
              ...sfcBlocks,
              blocks: {
                styles: true,
                ...sfcBlocks.blocks,
              },
            }),
          ]),
      rules: {
        ...(pluginVue.configs.base.rules),

        ...vueVersion === 2
          ? {
              ...pluginVue.configs["vue2-essential"].rules as any,
              ...pluginVue.configs["vue2-strongly-recommended"].rules as any,
              ...pluginVue.configs["vue2-recommended"].rules as any,
            }
          : {
              ...pluginVue.configs["flat/essential"].map((c) => c.rules).reduce((acc, c) => ({ ...acc, ...c }), {}) as any,
              ...pluginVue.configs["flat/strongly-recommended"].map((c) => c.rules).reduce((acc, c) => ({ ...acc, ...c }), {}) as any,
              ...pluginVue.configs["flat/recommended"].map((c) => c.rules).reduce((acc, c) => ({ ...acc, ...c }), {}) as any,
            },

        "antfu/no-top-level-await": "off",
        "node/prefer-global/process": "off",
        "ts/explicit-function-return-type": "off",

        "vue/block-order": [
          "error",
          {
            order: ["script", "template", "style"],
          },
        ],
        "vue/component-name-in-template-casing": ["error", "PascalCase"],
        "vue/component-options-name-casing": ["error", "PascalCase"],
        // this is deprecated
        "vue/component-tags-order": "off",
        "vue/custom-event-name-casing": ["error", "camelCase"],
        "vue/define-macros-order": [
          "error",
          {
            order: [
              "defineOptions",
              "defineProps",
              "defineEmits",
              "defineSlots",
            ],
          },
        ],
        "vue/dot-location": ["error", "property"],
        "vue/dot-notation": ["error", { allowKeywords: true }],
        "vue/eqeqeq": ["error", "smart"],
        "vue/html-indent": ["error", indent],
        "vue/html-quotes": ["error", "double"],
        "vue/max-attributes-per-line": "off",
        "vue/multi-word-component-names": "off",
        "vue/no-dupe-keys": "off",
        "vue/no-empty-pattern": "error",
        "vue/no-irregular-whitespace": "error",
        "vue/no-loss-of-precision": "error",
        "vue/no-restricted-syntax": [
          "error",
          "DebuggerStatement",
          "LabeledStatement",
          "WithStatement",
        ],
        "vue/no-restricted-v-bind": ["error", "/^v-/"],
        "vue/no-setup-props-reactivity-loss": "off",
        "vue/no-sparse-arrays": "error",
        "vue/no-unused-refs": "error",
        "vue/no-useless-v-bind": "error",
        "vue/no-v-html": "off",
        "vue/object-shorthand": [
          "error",
          "always",
          {
            avoidQuotes: true,
            ignoreConstructors: false,
          },
        ],
        "vue/prefer-separate-static-class": "error",
        "vue/prefer-template": "error",
        "vue/prop-name-casing": ["error", "camelCase"],
        "vue/require-default-prop": "off",
        "vue/require-prop-types": "off",
        "vue/space-infix-ops": "error",
        "vue/space-unary-ops": ["error", { nonwords: false, words: true }],

        ...(stylistic
          ? {
              "vue/array-bracket-spacing": ["error", "never"],
              "vue/arrow-spacing": ["error", { after: true, before: true }],
              "vue/block-spacing": ["error", "always"],
              "vue/block-tag-newline": [
                "error",
                {
                  multiline: "always",
                  singleline: "always",
                },
              ],
              "vue/brace-style": [
                "error",
                braceStyle,
                { allowSingleLine: true },
              ],
              "vue/comma-dangle": ["error", "always-multiline"],
              "vue/comma-spacing": ["error", { after: true, before: false }],
              "vue/comma-style": ["error", "last"],
              "vue/html-comment-content-spacing": [
                "error",
                "always",
                {
                  exceptions: ["-"],
                },
              ],
              "vue/key-spacing": [
                "error",
                { afterColon: true, beforeColon: false },
              ],
              "vue/keyword-spacing": ["error", { after: true, before: true }],
              "vue/object-curly-newline": "off",
              "vue/object-curly-spacing": ["error", "always"],
              "vue/object-property-newline": [
                "error",
                { allowAllPropertiesOnSameLine: true },
              ],
              "vue/operator-linebreak": ["error", "before"],
              "vue/padding-line-between-blocks": ["error", "always"],
              "vue/quote-props": ["error", "consistent-as-needed"],
              "vue/space-in-parens": ["error", "never"],
              "vue/template-curly-spacing": "error",
            }
          : {}),

        ...a11y
          ? {
              "vue-a11y/alt-text": "error",
              "vue-a11y/anchor-has-content": "error",
              "vue-a11y/aria-props": "error",
              "vue-a11y/aria-role": "error",
              "vue-a11y/aria-unsupported-elements": "error",
              "vue-a11y/click-events-have-key-events": "error",
              "vue-a11y/form-control-has-label": "error",
              "vue-a11y/heading-has-content": "error",
              "vue-a11y/iframe-has-title": "error",
              "vue-a11y/interactive-supports-focus": "error",
              "vue-a11y/label-has-for": "error",
              "vue-a11y/media-has-caption": "warn",
              "vue-a11y/mouse-events-have-key-events": "error",
              "vue-a11y/no-access-key": "error",
              "vue-a11y/no-aria-hidden-on-focusable": "error",
              "vue-a11y/no-autofocus": "warn",
              "vue-a11y/no-distracting-elements": "error",
              "vue-a11y/no-redundant-roles": "error",
              "vue-a11y/no-role-presentation-on-focusable": "error",
              "vue-a11y/no-static-element-interactions": "error",
              "vue-a11y/role-has-required-aria-props": "error",
              "vue-a11y/tabindex-no-positive": "warn",
            }
          : {},

        ...overrides,
      },
    },
  ];
}
