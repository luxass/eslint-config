import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { expect, it } from "vitest";
import { createEslint } from "./utils/eslint";
import { getSnapshotPath } from "./utils/snapshot";

const BASE_URL = fileURLToPath(new URL("./fixtures/tailwindcss", import.meta.url));
const VUE_BASE_URL = fileURLToPath(new URL("./fixtures/tailwindcss/vue", import.meta.url));
const JSX_BASE_URL = fileURLToPath(new URL("./fixtures/tailwindcss/jsx", import.meta.url));
const ASTRO_BASE_URL = fileURLToPath(new URL("./fixtures/tailwindcss/astro", import.meta.url));

const TAILWIND_CONFIG_PATH = fileURLToPath(new URL("./fixtures/tailwindcss/tailwind.config.ts", import.meta.url));

describe("tailwindcss config", async () => {
  describe("vue", async () => {
    it("ordering - should use tailwindcss plugin", async () => {
      const [linter, fixer] = await createEslint({
        tailwindcss: {
          configPath: TAILWIND_CONFIG_PATH,
        },
        vue: true,
      });

      const [
        [lintResults],
        [fixedResults],
      ] = await Promise.all([
        linter.lintFiles(join(VUE_BASE_URL, "invalid-order.vue")),
        fixer.lintFiles(join(VUE_BASE_URL, "invalid-order.vue")),
      ]);

      expect(lintResults.messages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: "Invalid Tailwind CSS classnames order",
            messageId: "invalidOrder",
            nodeType: "VAttribute",
            ruleId: "tailwindcss/classnames-order",
          }),
        ]),
      );

      const [snapshotPath] = await getSnapshotPath(BASE_URL, "vue/invalid-order.linted.vue", fixedResults.output);

      expect(fixedResults.messages).toEqual([]);
      expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
    });

    it("arbitrary", async () => {
      const [linter, fixer] = await createEslint({
        tailwindcss: {
          configPath: TAILWIND_CONFIG_PATH,
        },
        vue: true,
      });

      const [
        [lintResults],
        [fixedResults],
      ] = await Promise.all([
        linter.lintFiles(join(VUE_BASE_URL, "arbitrary.vue")),
        fixer.lintFiles(join(VUE_BASE_URL, "arbitrary.vue")),
      ]);

      const expectedMessages = [
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-top-[-10px]' should not start with a dash (-)",
          nodeType: "VAttribute",
          messageId: "negativeArbitraryValue",
        }),
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-right-[var(--my-var)]' should not start with a dash (-)",
          nodeType: "VAttribute",
          messageId: "negativeArbitraryValue",
        }),
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-left-[5px]' should not start with a dash (-)",
          nodeType: "VAttribute",
          messageId: "negativeArbitraryValue",
        }),
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-right-[var(--my-var)*-1]' should not start with a dash (-)",
          nodeType: "VAttribute",
          messageId: "negativeArbitraryValue",
        }),
      ];

      expectedMessages.forEach((matcher) => {
        expect(lintResults.messages).toEqual(
          expect.arrayContaining([matcher]),
        );
      });

      const [snapshotPath, snapshotContent] = await getSnapshotPath(BASE_URL, "vue/arbitrary.linted.vue", fixedResults.output);

      expect(fixedResults.messages).toEqual([
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-left-[5px]' should not start with a dash (-)",
          nodeType: "VAttribute",
          messageId: "negativeArbitraryValue",
        }),
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-right-[var(--my-var)*-1]' should not start with a dash (-)",
          nodeType: "VAttribute",
          messageId: "negativeArbitraryValue",
        }),
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-right-[var(--my-var)]' should not start with a dash (-)",
          nodeType: "VAttribute",
          messageId: "negativeArbitraryValue",
        }),
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-top-[-10px]' should not start with a dash (-)",
          nodeType: "VAttribute",
          messageId: "negativeArbitraryValue",
        }),
        expect.objectContaining({
          ruleId: "tailwindcss/no-contradicting-classname",
          severity: 2,
          message: "Classnames -right-[var(--my-var)*-1], -right-[var(--my-var)] are conflicting!",
          nodeType: "VAttribute",
          messageId: "conflictingClassnames",
        }),
      ]);

      expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });

    it("enforce shorthands", async () => {
      const [linter, fixer] = await createEslint({
        tailwindcss: {
          configPath: TAILWIND_CONFIG_PATH,
        },
        vue: true,
      });

      const [
        [lintResults],
        [fixedResults],
      ] = await Promise.all([
        linter.lintFiles(join(VUE_BASE_URL, "enforce-shorthand.vue")),
        fixer.lintFiles(join(VUE_BASE_URL, "enforce-shorthand.vue")),
      ]);

      const expectedMessages = [
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-shorthand",
          severity: 1,
          message: "Classnames 'border-t-4, border-r-4, border-b-4, border-l-4' could be replaced by the 'border-4' shorthand!",
          nodeType: "VAttribute",
          messageId: "shorthandCandidateDetected",
        }),
      ];

      expectedMessages.forEach((matcher) => {
        expect(lintResults.messages).toEqual(
          expect.arrayContaining([matcher]),
        );
      });

      const [snapshotPath, snapshotContent] = await getSnapshotPath(BASE_URL, "vue/enforce-shorthand.linted.vue", fixedResults.output);

      expect(fixedResults.messages).toEqual([]);
      expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });

    it("should not use tailwindcss plugin when disabled", async () => {
      const [linter] = await createEslint({
        vue: true,
        tailwindcss: false,
      });

      const testCases = [
        "invalid-order.vue",
        "arbitrary.vue",
        "enforce-shorthand.vue",
      ];

      for (const testCase of testCases) {
        const [lintResult] = await linter.lintFiles(join(VUE_BASE_URL, testCase));
        expect(lintResult.messages).toEqual([]);
      }
    });
  });

  describe("astro", async () => {
    it("ordering - should use tailwindcss plugin", async () => {
      const [linter, fixer] = await createEslint({
        tailwindcss: {
          configPath: TAILWIND_CONFIG_PATH,
        },
        astro: true,
      });

      const [
        [lintResults],
        [fixedResults],
      ] = await Promise.all([
        linter.lintFiles(join(ASTRO_BASE_URL, "invalid-order.astro")),
        fixer.lintFiles(join(ASTRO_BASE_URL, "invalid-order.astro")),
      ]);

      expect(lintResults.messages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: "Invalid Tailwind CSS classnames order",
            messageId: "invalidOrder",
            nodeType: "JSXAttribute",
            ruleId: "tailwindcss/classnames-order",
          }),
        ]),
      );

      const [snapshotPath] = await getSnapshotPath(BASE_URL, "astro/invalid-order.linted.astro", fixedResults.output);

      expect(fixedResults.messages).toEqual([]);
      expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
    });

    it("arbitrary", async () => {
      const [linter, fixer] = await createEslint({
        tailwindcss: {
          configPath: TAILWIND_CONFIG_PATH,
        },
        astro: true,
      });

      const [
        [lintResults],
        [fixedResults],
      ] = await Promise.all([
        linter.lintFiles(join(ASTRO_BASE_URL, "arbitrary.astro")),
        fixer.lintFiles(join(ASTRO_BASE_URL, "arbitrary.astro")),
      ]);

      const expectedMessages = [
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-top-[-10px]' should not start with a dash (-)",
          nodeType: "JSXAttribute",
          messageId: "negativeArbitraryValue",
        }),
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-right-[var(--my-var)]' should not start with a dash (-)",
          nodeType: "JSXAttribute",
          messageId: "negativeArbitraryValue",
        }),
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-left-[5px]' should not start with a dash (-)",
          nodeType: "JSXAttribute",
          messageId: "negativeArbitraryValue",
        }),
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-right-[var(--my-var)*-1]' should not start with a dash (-)",
          nodeType: "JSXAttribute",
          messageId: "negativeArbitraryValue",
        }),
      ];

      expectedMessages.forEach((matcher) => {
        expect(lintResults.messages).toEqual(
          expect.arrayContaining([matcher]),
        );
      });

      const [snapshotPath, snapshotContent] = await getSnapshotPath(BASE_URL, "astro/arbitrary.linted.astro", fixedResults.output);

      expect(fixedResults.messages).toEqual([
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-left-[5px]' should not start with a dash (-)",
          nodeType: "JSXAttribute",
          messageId: "negativeArbitraryValue",
        }),
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-right-[var(--my-var)*-1]' should not start with a dash (-)",
          nodeType: "JSXAttribute",
          messageId: "negativeArbitraryValue",
        }),
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-right-[var(--my-var)]' should not start with a dash (-)",
          nodeType: "JSXAttribute",
          messageId: "negativeArbitraryValue",
        }),
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-top-[-10px]' should not start with a dash (-)",
          nodeType: "JSXAttribute",
          messageId: "negativeArbitraryValue",
        }),
        expect.objectContaining({
          ruleId: "tailwindcss/no-contradicting-classname",
          severity: 2,
          message: "Classnames -right-[var(--my-var)*-1], -right-[var(--my-var)] are conflicting!",
          nodeType: "JSXAttribute",
          messageId: "conflictingClassnames",
        }),
      ]);

      expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });

    it("enforce shorthands", async () => {
      const [linter, fixer] = await createEslint({
        tailwindcss: {
          configPath: TAILWIND_CONFIG_PATH,
        },
        astro: true,
      });

      const [
        [lintResults],
        [fixedResults],
      ] = await Promise.all([
        linter.lintFiles(join(ASTRO_BASE_URL, "enforce-shorthand.astro")),
        fixer.lintFiles(join(ASTRO_BASE_URL, "enforce-shorthand.astro")),
      ]);

      const expectedMessages = [
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-shorthand",
          severity: 1,
          message: "Classnames 'border-t-4, border-r-4, border-b-4, border-l-4' could be replaced by the 'border-4' shorthand!",
          nodeType: "JSXAttribute",
          messageId: "shorthandCandidateDetected",
        }),
      ];

      expectedMessages.forEach((matcher) => {
        expect(lintResults.messages).toEqual(
          expect.arrayContaining([matcher]),
        );
      });

      const [snapshotPath, snapshotContent] = await getSnapshotPath(BASE_URL, "astro/enforce-shorthand.linted.astro", fixedResults.output);

      expect(fixedResults.messages).toEqual([]);
      expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });

    it("should not use tailwindcss plugin when disabled", async () => {
      const [linter] = await createEslint({
        astro: true,
        tailwindcss: false,
      });

      const testCases = [
        "invalid-order.astro",
        "arbitrary.astro",
        "enforce-shorthand.astro",
      ];

      for (const testCase of testCases) {
        const [lintResult] = await linter.lintFiles(join(ASTRO_BASE_URL, testCase));
        expect(lintResult.messages).toEqual([]);
      }
    });
  });

  describe("jsx", async () => {
    it("ordering - should use tailwindcss plugin", async () => {
      const [linter, fixer] = await createEslint({
        tailwindcss: {
          configPath: TAILWIND_CONFIG_PATH,
        },
        jsx: true,
      });

      const [
        [lintResults],
        [fixedResults],
      ] = await Promise.all([
        linter.lintFiles(join(JSX_BASE_URL, "invalid-order.tsx")),
        fixer.lintFiles(join(JSX_BASE_URL, "invalid-order.tsx")),
      ]);

      expect(lintResults.messages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: "Invalid Tailwind CSS classnames order",
            messageId: "invalidOrder",
            nodeType: "JSXAttribute",
            ruleId: "tailwindcss/classnames-order",
          }),
        ]),
      );

      const [snapshotPath] = await getSnapshotPath(BASE_URL, "jsx/invalid-order.linted.tsx", fixedResults.output);

      expect(fixedResults.messages).toEqual([]);
      expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
    });

    it("arbitrary", async () => {
      const [linter, fixer] = await createEslint({
        tailwindcss: {
          configPath: TAILWIND_CONFIG_PATH,
        },
        jsx: true,
      });

      const [
        [lintResults],
        [fixedResults],
      ] = await Promise.all([
        linter.lintFiles(join(JSX_BASE_URL, "arbitrary.tsx")),
        fixer.lintFiles(join(JSX_BASE_URL, "arbitrary.tsx")),
      ]);

      const expectedMessages = [
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-top-[-10px]' should not start with a dash (-)",
          nodeType: "JSXAttribute",
          messageId: "negativeArbitraryValue",
        }),
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-right-[var(--my-var)]' should not start with a dash (-)",
          nodeType: "JSXAttribute",
          messageId: "negativeArbitraryValue",
        }),
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-left-[5px]' should not start with a dash (-)",
          nodeType: "JSXAttribute",
          messageId: "negativeArbitraryValue",
        }),
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-right-[var(--my-var)*-1]' should not start with a dash (-)",
          nodeType: "JSXAttribute",
          messageId: "negativeArbitraryValue",
        }),
      ];

      expectedMessages.forEach((matcher) => {
        expect(lintResults.messages).toEqual(
          expect.arrayContaining([matcher]),
        );
      });

      const [snapshotPath, snapshotContent] = await getSnapshotPath(BASE_URL, "jsx/arbitrary.linted.tsx", fixedResults.output);

      expect(fixedResults.messages).toEqual([
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-left-[5px]' should not start with a dash (-)",
          nodeType: "JSXAttribute",
          messageId: "negativeArbitraryValue",
        }),
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-right-[var(--my-var)*-1]' should not start with a dash (-)",
          nodeType: "JSXAttribute",
          messageId: "negativeArbitraryValue",
        }),
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-right-[var(--my-var)]' should not start with a dash (-)",
          nodeType: "JSXAttribute",
          messageId: "negativeArbitraryValue",
        }),
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-negative-arbitrary-values",
          severity: 1,
          message: "Arbitrary value classname '-top-[-10px]' should not start with a dash (-)",
          nodeType: "JSXAttribute",
          messageId: "negativeArbitraryValue",
        }),
        expect.objectContaining({
          ruleId: "tailwindcss/no-contradicting-classname",
          severity: 2,
          message: "Classnames -right-[var(--my-var)*-1], -right-[var(--my-var)] are conflicting!",
          nodeType: "JSXAttribute",
          messageId: "conflictingClassnames",
        }),
      ]);

      expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });

    it("enforce shorthands", async () => {
      const [linter, fixer] = await createEslint({
        tailwindcss: {
          configPath: TAILWIND_CONFIG_PATH,
        },
        jsx: true,
      });

      const [
        [lintResults],
        [fixedResults],
      ] = await Promise.all([
        linter.lintFiles(join(JSX_BASE_URL, "enforce-shorthand.tsx")),
        fixer.lintFiles(join(JSX_BASE_URL, "enforce-shorthand.tsx")),
      ]);

      const expectedMessages = [
        expect.objectContaining({
          ruleId: "tailwindcss/enforces-shorthand",
          severity: 1,
          message: "Classnames 'border-t-4, border-r-4, border-b-4, border-l-4' could be replaced by the 'border-4' shorthand!",
          nodeType: "JSXAttribute",
          messageId: "shorthandCandidateDetected",
        }),
      ];

      expectedMessages.forEach((matcher) => {
        expect(lintResults.messages).toEqual(
          expect.arrayContaining([matcher]),
        );
      });

      const [snapshotPath, snapshotContent] = await getSnapshotPath(BASE_URL, "jsx/enforce-shorthand.linted.tsx", fixedResults.output);

      expect(fixedResults.messages).toEqual([]);
      expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });

    it("should not use tailwindcss plugin when disabled", async () => {
      const [linter] = await createEslint({
        jsx: true,
        tailwindcss: false,
      });

      const testCases = [
        "invalid-order.tsx",
        "arbitrary.tsx",
        "enforce-shorthand.tsx",
      ];

      for (const testCase of testCases) {
        const [lintResult] = await linter.lintFiles(join(JSX_BASE_URL, testCase));
        expect(lintResult.messages).toEqual([]);
      }
    });
  });
});
