import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { expect, it } from "vitest";
import { createEslint } from "./utils/eslint";
import { getSnapshotPath } from "./utils/snapshot";

const BASE_URL = fileURLToPath(new URL("./fixtures/unocss", import.meta.url));
const VUE_BASE_URL = fileURLToPath(new URL("./fixtures/unocss/vue", import.meta.url));
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
            ruleId: "unocss/order",
            severity: 1,
            messageId: "invalid-order",
            message: "UnoCSS utilities are not ordered",
            nodeType: "VLiteral",
          }),
        ]),
      );

      const [snapshotPath] = await getSnapshotPath(BASE_URL, "vue/invalid-order.linted.vue", fixedResults.output);

      expect(fixedResults.messages).toEqual([]);
      expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
    });

    it("strict mode - should use unocss plugin", async () => {
      const [linter, fixer] = await createEslint({
        unocss: {
          configPath: UNOCSS_CONFIG_PATH,
          strict: true,
        },
        vue: true,
      });

      const [
        [lintResults],
        [fixedResults],
      ] = await Promise.all([
        linter.lintFiles(join(VUE_BASE_URL, "blocklist.vue")),
        fixer.lintFiles(join(VUE_BASE_URL, "blocklist.vue")),
      ]);

      const expectedMessages = [
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
      ];

      expectedMessages.forEach((matcher) => {
        expect(lintResults.messages).toEqual(
          expect.arrayContaining([matcher]),
        );
      });

      const [snapshotPath, snapshotContent] = await getSnapshotPath(BASE_URL, "vue/blocklist.linted.vue", fixedResults.output);

      expect(fixedResults.messages).toEqual(expectedMessages);
      expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });

    it("attributify mode - should use unocss plugin", async () => {
      const [linter, fixer] = await createEslint({
        unocss: {
          configPath: UNOCSS_CONFIG_PATH,
          attributify: true,
        },
        vue: true,
      });

      const [
        [lintResults],
        [fixedResults],
      ] = await Promise.all([
        linter.lintFiles(join(VUE_BASE_URL, "attributify.vue")),
        fixer.lintFiles(join(VUE_BASE_URL, "attributify.vue")),
      ]);

      const expectedMessages = [
        expect.objectContaining({
          message: "UnoCSS attributes are not ordered",
          messageId: "invalid-order",
          nodeType: "VStartTag",
          ruleId: "unocss/order-attributify",
          severity: 1,
        }),
      ];

      expectedMessages.forEach((matcher) => {
        expect(lintResults.messages).toEqual(
          expect.arrayContaining([matcher]),
        );
      });

      const [snapshotPath] = await getSnapshotPath(BASE_URL, "vue/attributify.linted.vue", fixedResults.output);

      expect(fixedResults.messages).toEqual([]);
      expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
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
        const [lintResult] = await linter.lintFiles(join(VUE_BASE_URL, testCase));
        expect(lintResult.messages).toEqual([]);
      }
    });
  });
});
