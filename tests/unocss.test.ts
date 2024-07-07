import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createEslint } from "./utils/eslint";
import { getSnapshotPath } from "./utils/snapshot";

describe("unocss config", async () => {
  const baseUrl = fileURLToPath(
    new URL("./fixtures/unocss", import.meta.url),
  );

  const [linter, fixer] = await createEslint({
    unocss: true,
    // vue: true,
  }, {
    settings: {
      unocss: {
        configPath: join(baseUrl, "unocss.config.ts"),
      },
    },
  });

  it.only("should use unocss plugin", async () => {
    const [
      [lintResults],
      [fixedResults],
    ] = await Promise.all([
      linter.lintFiles(join(baseUrl, "invalid-order.vue")),
      fixer.lintFiles(join(baseUrl, "invalid-order.vue")),
    ]);

    console.log(lintResults.messages);

    [
      expect.objectContaining({
        ruleId: "toml/comma-style",
        severity: 2,
        messageId: "expectedCommaLast",
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

    expect(lintResults.messages).toEqual([
      expect.objectContaining({
        fatal: false,
        severity: 1,
      }),
    ]);
  });
});
