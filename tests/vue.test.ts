import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createEslint } from "./utils/eslint";
import { getSnapshotPath } from "./utils/snapshot";

describe("vue config", async () => {
  const [linter, fixer] = await createEslint({
    vue: true,
  });

  const baseUrl = fileURLToPath(
    new URL("./fixtures/vue", import.meta.url),
  );

  describe("typescript", async () => {
    it("should work with vue", async () => {
      const [
        [lintResults],
        [fixedResults],
      ] = await Promise.all([
        linter.lintFiles(join(baseUrl, "index-ts.vue")),
        fixer.lintFiles(join(baseUrl, "index-ts.vue")),
      ]);

      [
        expect.objectContaining({
          ruleId: "style/quotes",
          severity: 2,
          messageId: "wrongQuotes",
        }),
      ].forEach((matcher) => {
        expect(lintResults.messages).toEqual(
          expect.arrayContaining([matcher]),
        );
      });

      const [snapshotPath] = await getSnapshotPath(baseUrl, "typescript/index-ts.linted.vue", fixedResults.output);

      expect(fixedResults.messages).toEqual([]);
      expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
    });

    it("ignore vue files when disabled", async () => {
      const [linter, fixer] = await createEslint({
        vue: false,
      });

      const [
        [lintResults],
        [fixedResults],
      ] = await Promise.all([
        linter.lintFiles(join(baseUrl, "index-ts.vue")),
        fixer.lintFiles(join(baseUrl, "index-ts.vue")),
      ]);

      expect(lintResults.messages).toEqual([
        expect.objectContaining({
          fatal: false,
          severity: 1,
        }),
      ]);

      expect(fixedResults.messages).toEqual([
        expect.objectContaining({
          fatal: false,
          severity: 1,
        }),
      ]);

      const [snapshotPath, snapshotContent] = await getSnapshotPath(baseUrl, "typescript/index-ts.disabled.linted.vue", fixedResults.output);
      expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });
  });

  describe("javascript", async () => {
    it("should work with vue", async () => {
      const [
        [lintResults],
        [fixedResults],
      ] = await Promise.all([
        linter.lintFiles(join(baseUrl, "index-js.vue")),
        fixer.lintFiles(join(baseUrl, "index-js.vue")),
      ]);

      [
        expect.objectContaining({
          ruleId: "style/quotes",
          severity: 2,
          messageId: "wrongQuotes",
        }),
      ].forEach((matcher) => {
        expect(lintResults.messages).toEqual(
          expect.arrayContaining([matcher]),
        );
      });

      const [snapshotPath] = await getSnapshotPath(baseUrl, "javascript/index-js.linted.vue", fixedResults.output);

      expect(fixedResults.messages).toEqual([]);
      expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
    });

    it("ignore vue files when disabled", async () => {
      const [linter, fixer] = await createEslint({
        vue: false,
      });

      const [
        [lintResults],
        [fixedResults],
      ] = await Promise.all([
        linter.lintFiles(join(baseUrl, "index-js.vue")),
        fixer.lintFiles(join(baseUrl, "index-js.vue")),
      ]);

      expect(lintResults.messages).toEqual([
        expect.objectContaining({
          fatal: false,
          severity: 1,
        }),
      ]);

      expect(fixedResults.messages).toEqual([
        expect.objectContaining({
          fatal: false,
          severity: 1,
        }),
      ]);

      const [snapshotPath, snapshotContent] = await getSnapshotPath(baseUrl, "javascript/index-js.disabled.linted.vue", fixedResults.output);
      expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });
  });
});
