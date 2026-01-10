import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { createEslint } from "./utils/eslint";
import { getSnapshotPath } from "./utils/snapshot";

const BASE_URL = fileURLToPath(new URL("./fixtures/json", import.meta.url));

describe("json config", async () => {
  const [linter, fixer] = await createEslint({
    jsonc: true,
  });

  for (const file of ["config.json", "config.json5", "config.jsonc"]) {
    it(`should work with \"${file}$\"`, async () => {
      const [
        [lintResults],
        [fixedResults],
      ] = await Promise.all([
        linter.lintFiles(join(BASE_URL, file)),
        fixer.lintFiles(join(BASE_URL, file)),
      ]);

      [
        expect.objectContaining({
          ruleId: "jsonc/indent",
          severity: 2,
          messageId: "wrongIndentation",
        }),
        expect.objectContaining(
          {
            ruleId: "jsonc/key-spacing",
            severity: 2,
            messageId: "extraValue",
          },
        ),
      ].forEach((matcher) => {
        expect(lintResults.messages).toEqual(
          expect.arrayContaining([matcher]),
        );
      });

      const fileExt = file.split(".").pop();

      const [snapshotPath] = await getSnapshotPath(BASE_URL, `config.linted.${fileExt}`, fixedResults.output);

      expect(fixedResults.messages).toEqual([]);
      await expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
    });
  }

  it("should error on parser errors", async () => {
    const [lintResults] = await linter.lintFiles(join(BASE_URL, "invalid.json"));

    [
      expect.objectContaining({
        fatal: true,
        severity: 2,
        message: "Parsing error: Unexpected token '\"age\"'.",
      }),
    ].forEach((matcher) => {
      expect(lintResults.messages).toEqual(
        expect.arrayContaining([matcher]),
      );
    });
  });

  it("should not lint json when disabled", async () => {
    const [linter] = await createEslint({
      jsonc: false,
    });

    const [lintResults] = await linter.lintFiles(join(BASE_URL, "config.json"));

    expect(lintResults.messages).toEqual([
      expect.objectContaining({
        fatal: false,
        severity: 1,
      }),
    ]);
  });

  it("should not format when stylistic is disabled", async () => {
    const [linter, fixer] = await createEslint({
      jsonc: true,
      stylistic: false,
    });

    const [
      [lintResults],
      [fixedResults],
    ] = await Promise.all([
      linter.lintFiles(join(BASE_URL, "config.json")),
      fixer.lintFiles(join(BASE_URL, "config.json")),
    ]);

    expect(lintResults.messages).toEqual([]);
    expect(fixedResults.messages).toEqual([]);

    const [snapshotPath, snapshotContent] = await getSnapshotPath(BASE_URL, "config-without-stylistic.linted.json", fixedResults.output);

    await expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
  });

  describe("order rules", () => {
    it("should order keys in package.json", async () => {
      const [
        [lintResults],
        [fixedResults],
      ] = await Promise.all([
        linter.lintFiles(join(BASE_URL, "package.json")),
        fixer.lintFiles(join(BASE_URL, "package.json")),
      ]);

      expect(lintResults.messages).toHaveLength(33);
      expect(lintResults.messages).toMatchSnapshot();

      expect(fixedResults.messages).toHaveLength(19);
      expect(fixedResults.messages.length).toBeLessThan(lintResults.messages.length);
      expect(fixedResults.messages).toMatchSnapshot();

      const [snapshotPath, snapshotContent] = await getSnapshotPath(BASE_URL, "package.linted.json", fixedResults.output);
      await expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });

    it("should order keys in tsconfig.json", async () => {
      const [
        [lintResults],
        [fixedResults],
      ] = await Promise.all([
        linter.lintFiles(join(BASE_URL, "tsconfig.test.json")),
        fixer.lintFiles(join(BASE_URL, "tsconfig.test.json")),
      ]);

      expect(lintResults.messages).toHaveLength(25);
      expect(lintResults.messages).toMatchSnapshot();

      expect(fixedResults.messages).toHaveLength(14);
      expect(fixedResults.messages.length).toBeLessThan(lintResults.messages.length);
      expect(fixedResults.messages).toMatchSnapshot();

      const [snapshotPath, snapshotContent] = await getSnapshotPath(BASE_URL, "tsconfig.test.linted.json", fixedResults.output);

      await expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });
  });
});
