import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { createEslint } from "./utils/eslint";
import { getSnapshotPath } from "./utils/snapshot";

const BASE_URL = fileURLToPath(new URL("./fixtures/unocss", import.meta.url));
const VUE_BASE_URL = fileURLToPath(new URL("./fixtures/unocss/vue", import.meta.url));
const JSX_BASE_URL = fileURLToPath(new URL("./fixtures/unocss/jsx", import.meta.url));
const ASTRO_BASE_URL = fileURLToPath(new URL("./fixtures/unocss/astro", import.meta.url));

const UNOCSS_CONFIG_PATH = fileURLToPath(new URL("./fixtures/unocss/unocss.config.ts", import.meta.url));

describe("unocss config", async () => {
  describe("vue", async () => {
    it("ordering - should use unocss plugin", async () => {
      const [linter, fixer] = await createEslint({
        unocss: {
          configPath: UNOCSS_CONFIG_PATH,
        },
        vue: true,
      });

      await linter.lintFiles(join(VUE_BASE_URL, "invalid-order.vue"));
      const [fixedResults] = await fixer.lintFiles(join(VUE_BASE_URL, "invalid-order.vue"));

      const [snapshotPath] = await getSnapshotPath(BASE_URL, "vue/invalid-order.linted.vue", fixedResults.output);

      await expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
    });

    it("strict mode - should use unocss plugin", async () => {
      const [linter, fixer] = await createEslint({
        unocss: {
          configPath: UNOCSS_CONFIG_PATH,
          strict: true,
        },
        vue: true,
      });

      await linter.lintFiles(join(VUE_BASE_URL, "blocklist.vue"));
      const [fixedResults] = await fixer.lintFiles(join(VUE_BASE_URL, "blocklist.vue"));

      const [snapshotPath, snapshotContent] = await getSnapshotPath(BASE_URL, "vue/blocklist.linted.vue", fixedResults.output);

      await expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });

    it("attributify mode - should use unocss plugin", async () => {
      const [linter, fixer] = await createEslint({
        unocss: {
          configPath: UNOCSS_CONFIG_PATH,
          attributify: true,
        },
        vue: true,
      });

      await linter.lintFiles(join(VUE_BASE_URL, "attributify.vue"));
      const [fixedResults] = await fixer.lintFiles(join(VUE_BASE_URL, "attributify.vue"));

      const [snapshotPath] = await getSnapshotPath(BASE_URL, "vue/attributify.linted.vue", fixedResults.output);

      await expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
    });

    it("should not use unocss plugin when disabled", async () => {
      const [linter] = await createEslint({
        vue: true,
        unocss: false,
      });

      const testCases = [
        "invalid-order.vue",
        "blocklist.vue",
        "attributify.vue",
      ];

      for (const testCase of testCases) {
        await linter.lintFiles(join(VUE_BASE_URL, testCase));
      }
    });
  });

  describe("astro", async () => {
    it("ordering - should use unocss plugin", async () => {
      const [linter, fixer] = await createEslint({
        unocss: {
          configPath: UNOCSS_CONFIG_PATH,
        },
        astro: true,
      });

      await linter.lintFiles(join(ASTRO_BASE_URL, "invalid-order.astro"));
      const [fixedResults] = await fixer.lintFiles(join(ASTRO_BASE_URL, "invalid-order.astro"));

      const [snapshotPath] = await getSnapshotPath(BASE_URL, "astro/invalid-order.linted.astro", fixedResults.output);

      await expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
    });

    it("strict mode - should use unocss plugin", async () => {
      const [linter, fixer] = await createEslint({
        unocss: {
          configPath: UNOCSS_CONFIG_PATH,
          strict: true,
        },
        astro: true,
      });

      await linter.lintFiles(join(ASTRO_BASE_URL, "blocklist.astro"));
      const [fixedResults] = await fixer.lintFiles(join(ASTRO_BASE_URL, "blocklist.astro"));

      const [snapshotPath, snapshotContent] = await getSnapshotPath(BASE_URL, "astro/blocklist.linted.astro", fixedResults.output);

      await expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });

    it("attributify mode - should use unocss plugin", async () => {
      const [linter, fixer] = await createEslint({
        unocss: {
          configPath: UNOCSS_CONFIG_PATH,
          attributify: true,
        },
        astro: true,
      });

      await linter.lintFiles(join(ASTRO_BASE_URL, "attributify.astro"));
      const [fixedResults] = await fixer.lintFiles(join(ASTRO_BASE_URL, "attributify.astro"));

      const [snapshotPath, snapshotContent] = await getSnapshotPath(BASE_URL, "astro/attributify.linted.astro", fixedResults.output);

      await expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });

    it("should not use unocss plugin when disabled", async () => {
      const [linter] = await createEslint({
        astro: true,
        unocss: false,
      });

      const testCases = [
        "invalid-order.astro",
        "blocklist.astro",
        "attributify.astro",
      ];

      for (const testCase of testCases) {
        await linter.lintFiles(join(ASTRO_BASE_URL, testCase));
      }
    });
  });

  describe("jsx", async () => {
    it("ordering - should use unocss plugin", async () => {
      const [linter, fixer] = await createEslint({
        unocss: {
          configPath: UNOCSS_CONFIG_PATH,
        },
        jsx: true,
      });

      await linter.lintFiles(join(JSX_BASE_URL, "invalid-order.tsx"));
      const [fixedResults] = await fixer.lintFiles(join(JSX_BASE_URL, "invalid-order.tsx"));

      const [snapshotPath] = await getSnapshotPath(BASE_URL, "jsx/invalid-order.linted.tsx", fixedResults.output);

      await expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
    });

    it("strict mode - should use unocss plugin", async () => {
      const [linter, fixer] = await createEslint({
        unocss: {
          configPath: UNOCSS_CONFIG_PATH,
          strict: true,
        },
        jsx: true,
      });

      await linter.lintFiles(join(JSX_BASE_URL, "blocklist.tsx"));
      const [fixedResults] = await fixer.lintFiles(join(JSX_BASE_URL, "blocklist.tsx"));

      const [snapshotPath, snapshotContent] = await getSnapshotPath(BASE_URL, "jsx/blocklist.linted.tsx", fixedResults.output);

      await expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });

    it("attributify mode - should use unocss plugin", async () => {
      const [linter, fixer] = await createEslint({
        unocss: {
          configPath: UNOCSS_CONFIG_PATH,
          attributify: true,
        },
        jsx: true,
      });

      await linter.lintFiles(join(JSX_BASE_URL, "attributify.tsx"));
      const [fixedResults] = await fixer.lintFiles(join(JSX_BASE_URL, "attributify.tsx"));

      const [snapshotPath, snapshotContent] = await getSnapshotPath(BASE_URL, "jsx/attributify.linted.tsx", fixedResults.output);

      await expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });

    it("should not use unocss plugin when disabled", async () => {
      const [linter] = await createEslint({
        jsx: true,
        unocss: false,
      });

      const testCases = [
        "invalid-order.tsx",
        "blocklist.tsx",
        "attributify.tsx",
      ];

      for (const testCase of testCases) {
        await linter.lintFiles(join(JSX_BASE_URL, testCase));
      }
    });
  });
});
