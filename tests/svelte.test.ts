import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { createEslint } from './utils/eslint'
import { getSnapshotPath } from './utils/snapshot'

const [linter, fixer] = await createEslint({
  svelte: true,
})

const baseUrl = fileURLToPath(
  new URL('./fixtures/svelte', import.meta.url),
)

it('should be able to lint svelte when enabled', async () => {
  const [
    [lintResults],
    [fixedResults],
  ] = await Promise.all([
    linter.lintFiles(join(baseUrl, 'index.svelte')),
    fixer.lintFiles(join(baseUrl, 'index.svelte')),
  ]);

  [
    expect.objectContaining({
      ruleId: 'style/quotes',
      severity: 2,
      messageId: 'wrongQuotes',
    }),
    expect.objectContaining({
      ruleId: 'style/semi',
      severity: 2,
      messageId: 'extraSemi',
    }),
  ].forEach((matcher) => {
    expect(lintResults.messages).toEqual(
      expect.arrayContaining([matcher]),
    )
  })

  const [snapshotPath] = await getSnapshotPath(baseUrl, 'index.linted.svelte', fixedResults.output)

  expect(fixedResults.messages).toEqual([])
  expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath)
})

it('ignore svelte files when disabled', async () => {
  const [linter, fixer] = await createEslint({
    svelte: false,
  })

  const [
    [lintResults],
    [fixedResults],
  ] = await Promise.all([
    linter.lintFiles(join(baseUrl, 'index.svelte')),
    fixer.lintFiles(join(baseUrl, 'index.svelte')),
  ])

  expect(lintResults.messages).toEqual([
    expect.objectContaining({
      fatal: false,
      severity: 1,
    }),
  ])

  expect(fixedResults.messages).toEqual([
    expect.objectContaining({
      fatal: false,
      severity: 1,
    }),
  ])

  const [snapshotPath, snapshotContent] = await getSnapshotPath(baseUrl, 'index-disabled.linted.svelte', fixedResults.output)
  expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath)
})

it('should not lint on parser errors', async () => {
  const [lintResults] = await linter.lintFiles(join(baseUrl, 'invalid-svelte.svelte'));

  [
    expect.objectContaining({
      fatal: true,
      severity: 2,
      message: 'Parsing error: Unterminated regular expression',
    }),
  ].forEach((matcher) => {
    expect(lintResults.messages).toEqual(
      expect.arrayContaining([matcher]),
    )
  })
})

it('should not format when stylistic is disabled', async () => {
  const [linter, fixer] = await createEslint({
    svelte: true,
    stylistic: false,
  })

  const [
    _,
    [fixedResults],
  ] = await Promise.all([
    linter.lintFiles(join(baseUrl, 'index.svelte')),
    fixer.lintFiles(join(baseUrl, 'index.svelte')),
  ])

  const [snapshotPath, snapshotContent] = await getSnapshotPath(baseUrl, 'index-no-stylistic.linted.svelte', fixedResults.output)
  expect(fixedResults.messages).toEqual([])
  expect.soft(snapshotContent).toMatchFileSnapshot(snapshotPath)
})
