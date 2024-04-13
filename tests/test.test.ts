import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { expect, it } from 'vitest'
import { createEslint } from './utils/eslint'
import { getSnapshotPath } from './utils/snapshot'

const [linter, fixer] = await createEslint({
  test: true,
})

const baseUrl = fileURLToPath(
  new URL('./fixtures/test', import.meta.url),
)

it('should work with test', async () => {
  const [
    [lintResults],
    [fixedResults],
  ] = await Promise.all([
    linter.lintFiles(join(baseUrl, 'index.test.ts')),
    fixer.lintFiles(join(baseUrl, 'index.test.ts')),
  ]);

  [
    expect.objectContaining({
      ruleId: 'test/consistent-test-it',
      severity: 2,
      messageId: 'consistentMethod',
    }),
    expect.objectContaining({
      ruleId: 'style/quotes',
      severity: 2,
      messageId: 'wrongQuotes',
    }),
  ].forEach((matcher) => {
    expect(lintResults.messages).toEqual(
      expect.arrayContaining([matcher]),
    )
  })

  const [snapshotPath] = await getSnapshotPath(baseUrl, 'index-linted.test.ts', fixedResults.output)

  expect(fixedResults.messages).toEqual([])
  expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath)
})

it('should not lint test files when disabled', async () => {
  const [linter] = await createEslint({
    test: false,
  })

  const [lintResults] = await linter.lintFiles(join(baseUrl, 'index.test.ts'))

  expect(lintResults.messages).toEqual([
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
    expect.objectContaining({
      ruleId: 'style/quotes',
      severity: 2,
      messageId: 'wrongQuotes',
    }),
  ])
})

it('should not format when stylistic is disabled', async () => {
  const [linter, fixer] = await createEslint({
    test: true,
    stylistic: false,
  })

  const [
    [lintResults],
    [fixedResults],
  ] = await Promise.all([
    linter.lintFiles(join(baseUrl, 'index.test.ts')),
    fixer.lintFiles(join(baseUrl, 'index.test.ts')),
  ])

  expect(lintResults.messages[0]).toEqual(
    expect.objectContaining({
      ruleId: 'test/consistent-test-it',
      severity: 2,
      messageId: 'consistentMethod',
    }),
  )

  const [snapshotPath] = await getSnapshotPath(baseUrl, 'index-linted-no-stylistic.test.ts', fixedResults.output)

  expect(fixedResults.messages).toEqual([])
  expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath)
})

describe('disallow focused tests', () => {
  it('should allow focused tests when inside editor', async () => {
    const [linter, fixer] = await createEslint({
      test: true,
      editor: true,
    })

    const [
      [lintResults],
      [fixedResults],
    ] = await Promise.all([
      linter.lintFiles(join(baseUrl, 'focused.test.ts')),
      fixer.lintFiles(join(baseUrl, 'focused.test.ts')),
    ]);

    [
      expect.objectContaining({
        ruleId: 'test/consistent-test-it',
        severity: 2,
        messageId: 'consistentMethod',
      }),
    ].forEach((matcher) => {
      expect(lintResults.messages).toEqual(
        expect.arrayContaining([matcher]),
      )
    })

    const [snapshotPath] = await getSnapshotPath(baseUrl, 'focused-editor-linted.test.ts', fixedResults.output)

    expect(fixedResults.messages).toEqual([])
    expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath)
  })

  it('should error on focused tests', async () => {
    const [
      [lintResults],
      [fixedResults],
    ] = await Promise.all([
      linter.lintFiles(join(baseUrl, 'focused.test.ts')),
      fixer.lintFiles(join(baseUrl, 'focused.test.ts')),
    ]);

    [
      expect.objectContaining({
        ruleId: 'test/consistent-test-it',
        severity: 2,
        messageId: 'consistentMethod',
      }),
      expect.objectContaining({
        ruleId: 'test/no-focused-tests',
        severity: 2,
        messageId: 'noFocusedTests',
      }),
    ].forEach((matcher) => {
      expect(lintResults.messages).toEqual(
        expect.arrayContaining([matcher]),
      )
    })

    const [snapshotPath] = await getSnapshotPath(baseUrl, 'focused-ci-linted.test.ts', fixedResults.output)

    // this should be uncommented when this issue is fixed upstream
    // https://github.com/veritem/eslint-plugin-vitest/pull/424
    expect(fixedResults.messages).toEqual([])
    expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath)
  })
})
