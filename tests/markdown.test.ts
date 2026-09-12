import { expect, it } from "vitest";
import { createEslint } from "./utils/eslint";

it("lints Markdown and fenced JavaScript with unscoped JavaScript rules", async () => {
  const [linter] = await createEslint({
    gitignore: false,
    typescript: false,
  }, {
    rules: {
      "no-irregular-whitespace": "error",
      "no-debugger": "error",
    },
  });

  const [result] = await linter.lintText("# Heading\n\n```js\ndebugger;\n```\n", {
    filePath: "example.md",
  });

  expect(result.fatalErrorCount).toBe(0);
  expect(result.messages).toEqual(expect.arrayContaining([
    expect.objectContaining({ ruleId: "no-debugger" }),
  ]));

  const [markdownResult] = await linter.lintText("# Heading\n\n# Heading\n", {
    filePath: "example.md",
  });
  expect(markdownResult.messages).toEqual(expect.arrayContaining([
    expect.objectContaining({ ruleId: "markdown/no-multiple-h1" }),
  ]));
});
