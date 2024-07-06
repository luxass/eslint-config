import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { createEslint } from "./utils/eslint";
import { getSnapshotPath } from "./utils/snapshot";

describe("json config", async () => {
  const [linter, fixer] = await createEslint({
    jsonc: true,
  });

  const baseUrl = fileURLToPath(
    new URL("./fixtures/json", import.meta.url),
  );

  for (const file of ["config.json", "config.json5", "config.jsonc"]) {
    it(`should work with \"${file}$\"`, async () => {
      const [
        [lintResults],
        [fixedResults],
      ] = await Promise.all([
        linter.lintFiles(join(baseUrl, file)),
        fixer.lintFiles(join(baseUrl, file)),
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

      const [snapshotPath] = await getSnapshotPath(baseUrl, `config.linted.${fileExt}`, fixedResults.output);

      expect(fixedResults.messages).toEqual([]);
      expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
    });
  }

  it("should error on parser errors", async () => {
    const [lintResults] = await linter.lintFiles(join(baseUrl, "invalid.json"));

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

    const [lintResults] = await linter.lintFiles(join(baseUrl, "config.json"));

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
      linter.lintFiles(join(baseUrl, "config.json")),
      fixer.lintFiles(join(baseUrl, "config.json")),
    ]);

    expect(lintResults.messages).toEqual([]);
    expect(fixedResults.messages).toEqual([]);

    const [snapshotPath, snapshotContent] = await getSnapshotPath(baseUrl, "config-without-stylistic.linted.json", fixedResults.output);

    expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
  });
});
