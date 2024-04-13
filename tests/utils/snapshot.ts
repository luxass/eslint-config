import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export async function getSnapshotPath(base: string, path: string, snapshotContent?: string): Promise<[path: string, content: string]> {
  if (!existsSync(join(base, '.linted'))) {
    await mkdir(join(base, '.linted'))
  }

  const snapshotPath = join(base, '.linted', path)

  const content = snapshotContent ?? '// unchanged'

  if (!existsSync(snapshotPath)) {
    await writeFile(snapshotPath, snapshotContent ?? '// unchanged')
  }

  return [snapshotPath, content]
}
