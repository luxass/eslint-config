import { fileURLToPath } from "node:url";
import { join } from "node:path";
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
    const [
      [lintResults],
      [fixedResults],
    ] = await Promise.all([
      linter.lintFiles(join(baseUrl, "config.toml")),
      fixer.lintFiles(join(baseUrl, "config.toml")),
    ]);

    [
      expect.objectContaining({
        ruleId: "toml/comma-style",
        severity: 2,
        messageId: "expectedCommaLast",
      }),
      expect.objectContaining({
        ruleId: "toml/indent",
        severity: 2,
        messageId: "wrongIndentation",
      }),
      expect.objectContaining(
        {
          ruleId: "toml/key-spacing",
          severity: 2,
          messageId: "extraKey",
        },
      ),
      expect.objectContaining({
        ruleId: "toml/inline-table-curly-spacing",
        severity: 2,
        messageId: "requireSpaceAfter",
      }),
      expect.objectContaining({
        ruleId: "style/no-multi-spaces",
        severity: 2,
        messageId: "multipleSpaces",
      }),
      expect.objectContaining({
        ruleId: "toml/padding-line-between-pairs",
        severity: 2,
        messageId: "unexpectedBlankLine",
      }),
      expect.objectContaining({
        ruleId: "toml/quoted-keys",
        severity: 2,
        messageId: "unnecessarilyQuotedKey",
      }),
      expect.objectContaining({
        ruleId: "toml/keys-order",
        severity: 2,
        messageId: "outOfOrder",
      }),
    ].forEach((matcher) => {
      expect(lintResults.messages).toEqual(
        expect.arrayContaining([matcher]),
      );
    });

    const [snapshotPath] = await getSnapshotPath(baseUrl, "config.linted.toml", fixedResults.output);

    expect(fixedResults.messages).toEqual([]);
    expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
  });

  it("should error on parser errors", async () => {
    const [lintResults] = await linter.lintFiles(join(baseUrl, "invalid.toml"));

    [
      expect.objectContaining({
        fatal: true,
        severity: 2,
        message: "Parsing error: Expected equal (=) token",
      }),
    ].forEach((matcher) => {
      expect(lintResults.messages).toEqual(
        expect.arrayContaining([matcher]),
      );
    });
  });

  it("should not lint toml when disabled", async () => {
    const [linter] = await createEslint({
      toml: false,
    });

    const [lintResults] = await linter.lintFiles(join(baseUrl, "config.toml"));

    expect(lintResults.messages).toEqual([
      expect.objectContaining({
        fatal: false,
        severity: 1,
      }),
    ]);
  });

  it("should not format when stylistic is disabled", async () => {
    const [linter, fixer] = await createEslint({
      toml: true,
      stylistic: false,
    });

    const [
      [lintResults],
      [fixedResults],
    ] = await Promise.all([
      linter.lintFiles(join(baseUrl, "config.toml")),
      fixer.lintFiles(join(baseUrl, "config.toml")),
    ]);

    [
      expect.objectContaining({
        ruleId: "toml/comma-style",
        severity: 2,
        messageId: "expectedCommaLast",
      }),
      expect.objectContaining({
        ruleId: "toml/keys-order",
        severity: 2,
        messageId: "outOfOrder",
      }),
    ].forEach((matcher) => {
      expect(lintResults.messages).toEqual(
        expect.arrayContaining([matcher]),
      );
    });

    [
      expect.objectContaining({
        ruleId: "toml/indent",
        severity: 2,
        messageId: "wrongIndentation",
      }),
      expect.objectContaining(
        {
          ruleId: "toml/key-spacing",
          severity: 2,
          messageId: "extraKey",
        },
      ),
      expect.objectContaining({
        ruleId: "toml/inline-table-curly-spacing",
        severity: 2,
        messageId: "requireSpaceAfter",
      }),
      expect.objectContaining({
        ruleId: "style/no-multi-spaces",
        severity: 2,
        messageId: "multipleSpaces",
      }),
      expect.objectContaining({
        ruleId: "toml/padding-line-between-pairs",
        severity: 2,
        messageId: "unexpectedBlankLine",
      }),
      expect.objectContaining({
        ruleId: "toml/quoted-keys",
        severity: 2,
        messageId: "unnecessarilyQuotedKey",
      }),
    ].forEach((matcher) => {
      expect(lintResults.messages).not.toEqual(
        expect.arrayContaining([matcher]),
      );
    });

    const [snapshotPath] = await getSnapshotPath(baseUrl, "config-without-stylistic.linted.toml", fixedResults.output);

    expect(fixedResults.messages).toEqual([]);
    expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
  });
});
