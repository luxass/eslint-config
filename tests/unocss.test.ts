import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createEslint } from "./utils/eslint";
import { getSnapshotPath } from "./utils/snapshot";

describe("unocss config", async () => {
  const baseUrl = fileURLToPath(
    new URL("./fixtures/unocss", import.meta.url),
  );

  describe("ordering", async () => {
    const [linter, fixer] = await createEslint({
      unocss: {
        configPath: join(baseUrl, "unocss.config.ts"),
      },
      vue: true,
    });

    it("should use unocss plugin", async () => {
      const [
        [lintResults],
        [fixedResults],
      ] = await Promise.all([
        linter.lintFiles(join(baseUrl, "invalid-order.vue")),
        fixer.lintFiles(join(baseUrl, "invalid-order.vue")),
      ]);

      [
        expect.objectContaining({
          ruleId: "unocss/order",
          severity: 1,
          messageId: "invalid-order",
          message: "UnoCSS utilities are not ordered",
          nodeType: "VLiteral",
        }),
      ].forEach((matcher) => {
        expect(lintResults.messages).toEqual(
          expect.arrayContaining([matcher]),
        );
      });

      const [snapshotPath] = await getSnapshotPath(baseUrl, "invalid-order.linted.vue", fixedResults.output);

      expect(fixedResults.messages).toEqual([]);
      expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
    });

    it("should not use unocss plugin when disabled", async () => {
      const [linter] = await createEslint({
        vue: true,
        unocss: false,
      });

      const [lintResults] = await linter.lintFiles(join(baseUrl, "invalid-order.vue"));
      expect(lintResults.messages).toEqual([]);
    });
  });

  describe("strict mode", async () => {
    const [linter, fixer] = await createEslint({
      unocss: {
        configPath: join(baseUrl, "unocss.config.ts"),
        strict: true,
      },
      vue: true,
    });

    it("should use unocss plugin", async () => {
      const [
        [lintResults],
        [fixedResults],
      ] = await Promise.all([
        linter.lintFiles(join(baseUrl, "blocklist.vue")),
        fixer.lintFiles(join(baseUrl, "blocklist.vue")),
      ]);

      [
        expect.objectContaining({
          ruleId: "unocss/blocklist",
          severity: 2,
          message: "\"border\" is in blocklist",
          nodeType: "VLiteral",
          messageId: "in-blocklist",
        }),
        expect.objectContaining({
          ruleId: "unocss/blocklist",
          severity: 2,
          message: "\"bg-red-500\" is in blocklist: Use bg-red-600 instead",
          nodeType: "VLiteral",
          messageId: "in-blocklist",
        }),
      ].forEach((matcher) => {
        expect(lintResults.messages).toEqual(
          expect.arrayContaining([matcher]),
        );
      });

      const [snapshotPath, snapshotContent] = await getSnapshotPath(baseUrl, "blocklist.linted.vue", fixedResults.output);

      expect(fixedResults.messages).toEqual([
        expect.objectContaining({
          ruleId: "unocss/blocklist",
          severity: 2,
          message: "\"border\" is in blocklist",
          nodeType: "VLiteral",
          messageId: "in-blocklist",
        }),
        expect.objectContaining({
          ruleId: "unocss/blocklist",
          severity: 2,
          message: "\"bg-red-500\" is in blocklist: Use bg-red-600 instead",
          nodeType: "VLiteral",
          messageId: "in-blocklist",
        }),
      ]);
      expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });

    it("should not use unocss plugin when disabled", async () => {
      const [linter] = await createEslint({
        vue: true,
        unocss: false,
      });

      const [lintResults] = await linter.lintFiles(join(baseUrl, "blocklist.vue"));
      expect(lintResults.messages).toEqual([]);
    });
  });
});
