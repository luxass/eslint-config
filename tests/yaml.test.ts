import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, it } from 'vitest'
import { createEslint } from './utils/eslint'
import { getSnapshotPath } from './utils/snapshot'

const [linter, fixer] = await createEslint({
  yaml: true,
})

const baseUrl = fileURLToPath(
  new URL('./fixtures/yaml', import.meta.url),
)

it('should work with yaml', async () => {
  const [
    [lintResults],
    [fixedResults],
  ] = await Promise.all([
    linter.lintFiles(join(baseUrl, 'config.yaml')),
    fixer.lintFiles(join(baseUrl, 'config.yaml')),
  ]);

  [
    expect.objectContaining({
      ruleId: 'yaml/plain-scalar',
      severity: 2,
      messageId: 'required',
    }),
    expect.objectContaining({
      ruleId: 'yaml/quotes',
      severity: 2,
      messageId: 'wrongQuotes',
    }),
    expect.objectContaining({
      ruleId: 'yaml/indent',
      severity: 2,
      messageId: 'wrongIndentation',
    }),
  ].forEach((matcher) => {
    expect(lintResults.messages).toEqual(
      expect.arrayContaining([matcher]),
    )
  })

  const [snapshotPath] = await getSnapshotPath(baseUrl, 'config.linted.yaml', fixedResults.output)

  expect(fixedResults.messages).toEqual([])
  expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath)
})

it('should error on parser errors', async () => {
  const [lintResults] = await linter.lintFiles(join(baseUrl, 'invalid.yaml'));

  [
    expect.objectContaining({
      fatal: true,
      severity: 2,
      message: 'Parsing error: Nested mappings are not allowed in compact mappings',
    }),
  ].forEach((matcher) => {
    expect(lintResults.messages).toEqual(
      expect.arrayContaining([matcher]),
    )
  })
})

it('should not lint yaml when disabled', async () => {
  const [linter] = await createEslint({
    yaml: false,
  })

  const [lintResults] = await linter.lintFiles(join(baseUrl, 'config.yaml'))

  expect(lintResults.messages).toEqual([
    expect.objectContaining({
      fatal: false,
      severity: 1,
    }),
  ])
})

it('should not format when stylistic is disabled', async () => {
  const [linter, fixer] = await createEslint({
    yaml: true,
    stylistic: false,
  })

  const [
    [lintResults],
    [fixedResults],
  ] = await Promise.all([
    linter.lintFiles(join(baseUrl, 'config.yaml')),
    fixer.lintFiles(join(baseUrl, 'config.yaml')),
  ]);

  [
    expect.objectContaining({
      ruleId: 'yaml/plain-scalar',
      severity: 2,
      messageId: 'required',
    }),
  ].forEach((matcher) => {
    expect(lintResults.messages).toEqual(
      expect.arrayContaining([matcher]),
    )
  })

  const [snapshotPath] = await getSnapshotPath(baseUrl, 'config-without-stylistic.linted.yaml', fixedResults.output)

  expect(fixedResults.messages).toEqual([])
  expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath)
})
