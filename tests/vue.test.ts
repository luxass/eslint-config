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
      await linter.lintFiles(join(baseUrl, "index-ts.vue"));
      const [fixedResults] = await fixer.lintFiles(join(baseUrl, "index-ts.vue"));

      const [snapshotPath] = await getSnapshotPath(baseUrl, "typescript/index-ts.linted.vue", fixedResults.output);

      await await expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
    });

    it("ignore vue files when disabled", async () => {
      const [linter, fixer] = await createEslint({
        vue: false,
      });

      await linter.lintFiles(join(baseUrl, "index-ts.vue"));
      const [fixedResults] = await fixer.lintFiles(join(baseUrl, "index-ts.vue"));

      const [snapshotPath, snapshotContent] = await getSnapshotPath(baseUrl, "typescript/index-ts.disabled.linted.vue", fixedResults.output);
      await expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });
  });

  describe("javascript", async () => {
    it("should work with vue", async () => {
      await linter.lintFiles(join(baseUrl, "index-js.vue"));
      const [fixedResults] = await fixer.lintFiles(join(baseUrl, "index-js.vue"));

      const [snapshotPath] = await getSnapshotPath(baseUrl, "javascript/index-js.linted.vue", fixedResults.output);

      await expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
    });

    it("ignore vue files when disabled", async () => {
      const [linter, fixer] = await createEslint({
        vue: false,
      });

      await linter.lintFiles(join(baseUrl, "index-js.vue"));
      const [fixedResults] = await fixer.lintFiles(join(baseUrl, "index-js.vue"));

      const [snapshotPath, snapshotContent] = await getSnapshotPath(baseUrl, "javascript/index-js.disabled.linted.vue", fixedResults.output);
      await expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });
  });
});
