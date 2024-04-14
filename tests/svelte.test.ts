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
  ])

  // eslint-disable-next-line no-console
  console.log(lintResults.messages)

  // eslint-disable-next-line no-console
  console.log(fixedResults.messages)

  const [snapshotPath] = await getSnapshotPath(baseUrl, 'index.linted.svelte', fixedResults.output)

  expect(fixedResults.messages).toEqual([])
  expect.soft(fixedResults.output).toMatchFileSnapshot(snapshotPath)
})
