import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { createEslint } from "./utils/eslint";
import { getSnapshotPath } from "./utils/snapshot";

describe("test config", async () => {
  const [linter, fixer] = await createEslint({
    test: true,
  });

  const baseUrl = fileURLToPath(
    new URL("./fixtures/test", import.meta.url),
  );

  it("should work with test", async () => {
    await linter.lintFiles(join(baseUrl, "index.test.ts"));
    const [fixedResults] = await fixer.lintFiles(join(baseUrl, "index.test.ts"));

    const [snapshotPath] = await getSnapshotPath(baseUrl, "index-linted.test.ts", fixedResults.output);

    await expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
  });

  it("should not lint test files when disabled", async () => {
    const [linter] = await createEslint({
      test: false,
    });

    await linter.lintFiles(join(baseUrl, "index.test.ts"));
  });

  it("should not format when stylistic is disabled", async () => {
    const [linter, fixer] = await createEslint({
      test: true,
      stylistic: false,
    });

    await linter.lintFiles(join(baseUrl, "index.test.ts"));
    const [fixedResults] = await fixer.lintFiles(join(baseUrl, "index.test.ts"));

    const [snapshotPath] = await getSnapshotPath(baseUrl, "index-linted-no-stylistic.test.ts", fixedResults.output);

    await expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
  });

  describe("disallow focused tests", () => {
    it("should allow focused tests when inside editor", async () => {
      const [linter, fixer] = await createEslint({
        test: true,
        isInEditor: true,
      });

      await linter.lintFiles(join(baseUrl, "focused.test.ts"));
      const [fixedResults] = await fixer.lintFiles(join(baseUrl, "focused.test.ts"));

      const [snapshotPath] = await getSnapshotPath(baseUrl, "focused-editor-linted.test.ts", fixedResults.output);

      await expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
    });

    it("should error on focused tests", async () => {
      await linter.lintFiles(join(baseUrl, "focused.test.ts"));
      const [fixedResults] = await fixer.lintFiles(join(baseUrl, "focused.test.ts"));

      const [snapshotPath] = await getSnapshotPath(baseUrl, "focused-ci-linted.test.ts", fixedResults.output);

      await expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
    });
  });
});
