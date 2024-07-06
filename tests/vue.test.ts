import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { createEslint } from "./utils/eslint";
import { getSnapshotPath } from "./utils/snapshot";

const [linter, fixer] = await createEslint({
  vue: true,
});

const baseUrl = fileURLToPath(
  new URL("./fixtures/vue", import.meta.url),
);

it("should be able to lint vue when enabled", async () => {
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

  const [snapshotPath] = await getSnapshotPath(baseUrl, "index-ts.linted.vue", fixedResults.output);

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

  const [snapshotPath, snapshotContent] = await getSnapshotPath(baseUrl, "index-disabled.linted.vue", fixedResults.output);
  expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
});
