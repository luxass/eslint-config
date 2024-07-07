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
      expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath);
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

    expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
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

      expect(lintResults.messages).toEqual([
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'funding' should be before 'devDependencies'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'bugs' should be before 'peerDependencies'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'displayName' should be before 'bugs'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'version' should be before 'contributes'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'packageManager' should be before 'dependencies'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'main' should be before 'peerDependenciesMeta'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'exports' should be before 'engines'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'categories' should be before 'husky'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'repository' should be before 'categories'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'name' should be before 'scripts'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'description' should be before 'eslintConfig'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'files' should be before 'simple-git-hooks'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'typesVersions' should be before 'overrides'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'private' should be before 'typesVersions'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'type' should be before 'private'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'keywords' should be before 'sideEffects'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'publisher' should be before 'pnpm'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'homepage' should be before 'optionalDependencies'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'author' should be before 'homepage'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'module' should be before 'resolutions'.",
          messageId: "sortKeys",
        }),
      ]);

      expect(fixedResults.messages).toEqual([
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'bin' should be before 'devDependencies'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'bugs' should be before 'peerDependencies'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'engines' should be before 'dependencies'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'exports' should be before 'peerDependenciesMeta'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'categories' should be before 'husky'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'repository' should be before 'categories'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'typesVersions' should be before 'scripts'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'license' should be before 'eslintConfig'.",
          messageId: "sortKeys",
        }),
      ]);

      const [snapshotPath, snapshotContent] = await getSnapshotPath(BASE_URL, "package.linted.json", fixedResults.output);
      expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });

    it("should order keys in tsconfig.json", async () => {
      const [
        [lintResults],
        [fixedResults],
      ] = await Promise.all([
        linter.lintFiles(join(BASE_URL, "tsconfig.test.json")),
        fixer.lintFiles(join(BASE_URL, "tsconfig.test.json")),
      ]);

      expect(lintResults.messages).toEqual([
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'compilerOptions' should be before 'exclude'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'moduleResolution' should be before 'strict'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'target' should be before 'allowJs'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'esModuleInterop' should be before 'isolatedModules'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'module' should be before 'esModuleInterop'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'resolveJsonModule' should be before 'skipLibCheck'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'outDir' should be before 'sourceMap'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'rootDir' should be before 'outDir'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'experimentalDecorators' should be before 'forceConsistentCasingInFileNames'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'emitDecoratorMetadata' should be before 'experimentalDecorators'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'incremental' should be before 'emitDecoratorMetadata'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'alwaysStrict' should be before 'noImplicitThis'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'extends' should be before 'include'.",
          messageId: "sortKeys",
        }),
      ]);

      expect(fixedResults.messages).toEqual([
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'allowJs' should be before 'strict'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'resolveJsonModule' should be before 'allowJs'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'esModuleInterop' should be before 'isolatedModules'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'noUnusedParameters' should be before 'skipLibCheck'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'declaration' should be before 'sourceMap'.",
          messageId: "sortKeys",
        }),
        expect.objectContaining({
          ruleId: "jsonc/sort-keys",
          severity: 2,
          message: "Expected object keys to be in specified order. 'jsx' should be before 'forceConsistentCasingInFileNames'.",
          messageId: "sortKeys",
        }),
      ]);

      const [snapshotPath, snapshotContent] = await getSnapshotPath(BASE_URL, "tsconfig.test.linted.json", fixedResults.output);

      expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath);
    });
  });
});
