import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createEslint } from "./utils/eslint";
import { getSnapshotPath } from "./utils/snapshot";

describe("toml config", async () => {
  const [linter, fixer] = await createEslint({
    toml: true,
  });

  const baseUrl = fileURLToPath(
    new URL("./fixtures/toml", import.meta.url),
  );

  it("should work with toml", async () => {
    await linter.lintFiles(join(baseUrl, "config.toml"));
    const [fixedResults] = await fixer.lintFiles(join(baseUrl, "config.toml"));

    const [snapshotPath] = await getSnapshotPath(baseUrl, "config.linted.toml", fixedResults.output);

    await expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
  });

  it("should error on parser errors", async () => {
    await linter.lintFiles(join(baseUrl, "invalid.toml"));
  });

  it("should not lint toml when disabled", async () => {
    const [linter] = await createEslint({
      toml: false,
    });

    await linter.lintFiles(join(baseUrl, "config.toml"));
  });

  it("should not format when stylistic is disabled", async () => {
    const [linter, fixer] = await createEslint({
      toml: true,
      stylistic: false,
    });

    await linter.lintFiles(join(baseUrl, "config.toml"));
    const [fixedResults] = await fixer.lintFiles(join(baseUrl, "config.toml"));

    const [snapshotPath] = await getSnapshotPath(baseUrl, "config-without-stylistic.linted.toml", fixedResults.output);

    await expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
  });
});
