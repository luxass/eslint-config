import { join } from "node:path";
import { fileURLToPath } from "node:url";
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

      await linter.lintFiles(join(VUE_BASE_URL, "invalid-order.vue"));
      const [fixedResults] = await fixer.lintFiles(join(VUE_BASE_URL, "invalid-order.vue"));

      const [snapshotPath] = await getSnapshotPath(BASE_URL, "vue/invalid-order.linted.vue", fixedResults.output);

      await expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
    });

    it("arbitrary", async () => {
      const [linter, fixer] = await createEslint({
        tailwindcss: {
          configPath: TAILWIND_CONFIG_PATH,
        },
        vue: true,
      });

      await linter.lintFiles(join(VUE_BASE_URL, "arbitrary.vue"));
      const [fixedResults] = await fixer.lintFiles(join(VUE_BASE_URL, "arbitrary.vue"));

      const [snapshotPath, snapshotContent] = await getSnapshotPath(BASE_URL, "vue/arbitrary.linted.vue", fixedResults.output);

      await expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });

    it("enforce shorthands", async () => {
      const [linter, fixer] = await createEslint({
        tailwindcss: {
          configPath: TAILWIND_CONFIG_PATH,
        },
        vue: true,
      });

      await linter.lintFiles(join(VUE_BASE_URL, "enforce-shorthand.vue"));
      const [fixedResults] = await fixer.lintFiles(join(VUE_BASE_URL, "enforce-shorthand.vue"));

      const [snapshotPath, snapshotContent] = await getSnapshotPath(BASE_URL, "vue/enforce-shorthand.linted.vue", fixedResults.output);

      await expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
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
        await linter.lintFiles(join(VUE_BASE_URL, testCase));
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

      await linter.lintFiles(join(ASTRO_BASE_URL, "invalid-order.astro"));
      const [fixedResults] = await fixer.lintFiles(join(ASTRO_BASE_URL, "invalid-order.astro"));

      const [snapshotPath] = await getSnapshotPath(BASE_URL, "astro/invalid-order.linted.astro", fixedResults.output);

      await expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
    });

    it("arbitrary", async () => {
      const [linter, fixer] = await createEslint({
        tailwindcss: {
          configPath: TAILWIND_CONFIG_PATH,
        },
        astro: true,
      });

      await linter.lintFiles(join(ASTRO_BASE_URL, "arbitrary.astro"));
      const [fixedResults] = await fixer.lintFiles(join(ASTRO_BASE_URL, "arbitrary.astro"));

      const [snapshotPath, snapshotContent] = await getSnapshotPath(BASE_URL, "astro/arbitrary.linted.astro", fixedResults.output);

      await expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });

    it("enforce shorthands", async () => {
      const [linter, fixer] = await createEslint({
        tailwindcss: {
          configPath: TAILWIND_CONFIG_PATH,
        },
        astro: true,
      });

      await linter.lintFiles(join(ASTRO_BASE_URL, "enforce-shorthand.astro"));
      const [fixedResults] = await fixer.lintFiles(join(ASTRO_BASE_URL, "enforce-shorthand.astro"));

      const [snapshotPath, snapshotContent] = await getSnapshotPath(BASE_URL, "astro/enforce-shorthand.linted.astro", fixedResults.output);

      await expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
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
        await linter.lintFiles(join(ASTRO_BASE_URL, testCase));
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

      await linter.lintFiles(join(JSX_BASE_URL, "invalid-order.tsx"));
      const [fixedResults] = await fixer.lintFiles(join(JSX_BASE_URL, "invalid-order.tsx"));

      const [snapshotPath] = await getSnapshotPath(BASE_URL, "jsx/invalid-order.linted.tsx", fixedResults.output);

      await expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
    });

    it("arbitrary", async () => {
      const [linter, fixer] = await createEslint({
        tailwindcss: {
          configPath: TAILWIND_CONFIG_PATH,
        },
        jsx: true,
      });

      await linter.lintFiles(join(JSX_BASE_URL, "arbitrary.tsx"));
      const [fixedResults] = await fixer.lintFiles(join(JSX_BASE_URL, "arbitrary.tsx"));

      const [snapshotPath, snapshotContent] = await getSnapshotPath(BASE_URL, "jsx/arbitrary.linted.tsx", fixedResults.output);

      await expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });

    it("enforce shorthands", async () => {
      const [linter, fixer] = await createEslint({
        tailwindcss: {
          configPath: TAILWIND_CONFIG_PATH,
        },
        jsx: true,
      });

      await linter.lintFiles(join(JSX_BASE_URL, "enforce-shorthand.tsx"));
      const [fixedResults] = await fixer.lintFiles(join(JSX_BASE_URL, "enforce-shorthand.tsx"));

      const [snapshotPath, snapshotContent] = await getSnapshotPath(BASE_URL, "jsx/enforce-shorthand.linted.tsx", fixedResults.output);

      await expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
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
        await linter.lintFiles(join(JSX_BASE_URL, testCase));
      }
    });
  });
});
