import { expect, it } from "vitest";
import { stylistic } from "../src/configs/stylistic";
import { createEslint } from "./utils/eslint";

it("preserves the default brace style and keeps experimental rules disabled", async () => {
  const [config] = await stylistic();
  expect(config.rules?.["style/brace-style"]).toEqual(["error", "1tbs", { allowSingleLine: true }]);
  expect(config.rules?.["style/exp-list-style"]).toBeUndefined();
  expect(config.rules?.["antfu/consistent-list-newline"]).toBe("error");
});

it("accepts stylistic options in the direct builder", async () => {
  const [config] = await stylistic({ braceStyle: "allman", experimental: true });
  expect(config.rules?.["style/brace-style"]).toEqual(["error", "allman", { allowSingleLine: true }]);
  expect(config.rules?.["style/exp-list-style"]).toBe("error");
});

it("accepts nested options in the direct builder", async () => {
  const [config] = await stylistic({ stylistic: { braceStyle: "allman", experimental: true } });
  expect(config.rules?.["style/brace-style"]).toEqual(["error", "allman", { allowSingleLine: true }]);
  expect(config.rules?.["style/exp-list-style"]).toBe("error");
});

it("applies explicit stylistic options through the factory", async () => {
  const [linter] = await createEslint({
    stylistic: { braceStyle: "allman", experimental: true },
  });
  const config = await linter.calculateConfigForFile("example.js");
  expect(config.rules["style/brace-style"]).toEqual([2, "allman", { allowSingleLine: true }]);
  expect(config.rules["style/exp-list-style"][0]).toBe(2);
  expect(config.rules["antfu/consistent-list-newline"]).toBeUndefined();

  const [result] = await linter.lintText("if (ready) {\n  run();\n}\n", { filePath: "example.js" });
  expect(result.messages).toEqual(expect.arrayContaining([
    expect.objectContaining({ ruleId: "style/brace-style" }),
  ]));
});
