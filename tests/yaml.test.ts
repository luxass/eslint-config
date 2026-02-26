import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createEslint } from "./utils/eslint";
import { getSnapshotPath } from "./utils/snapshot";

describe("yaml config", async () => {
  const [linter, fixer] = await createEslint({
    typescript: true,
    yaml: true,
  });

  const baseUrl = fileURLToPath(
    new URL("./fixtures/yaml", import.meta.url),
  );

  it("should work with yaml", async () => {
    await linter.lintFiles(join(baseUrl, "config.yaml"));
    const [fixedResults] = await fixer.lintFiles(join(baseUrl, "config.yaml"));

    const [snapshotPath] = await getSnapshotPath(baseUrl, "config.linted.yaml", fixedResults.output);

    await expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
  });

  it("should error on parser errors", async () => {
    await linter.lintFiles(join(baseUrl, "invalid.yaml"));
  });

  it("should not lint yaml when disabled", async () => {
    const [linter] = await createEslint({
      yaml: false,
    });

    await linter.lintFiles(join(baseUrl, "config.yaml"));
  });

  it("should not format when stylistic is disabled", async () => {
    const [linter, fixer] = await createEslint({
      yaml: true,
      stylistic: false,
    });

    await linter.lintFiles(join(baseUrl, "config.yaml"));
    const [fixedResults] = await fixer.lintFiles(join(baseUrl, "config.yaml"));

    const [snapshotPath] = await getSnapshotPath(baseUrl, "config-without-stylistic.linted.yaml", fixedResults.output);

    await expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
  });
});
