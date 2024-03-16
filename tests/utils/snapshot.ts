import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export async function getSnapshotPath(base: string, path: string, snapshotContent?: string): Promise<string> {
  if (!existsSync(join(base, '.linted'))) {
    await mkdir(join(base, '.linted'))
  }

  const snapshotPath = join(base, '.linted', path)

  if (!existsSync(snapshotPath)) {
    await writeFile(snapshotPath, snapshotContent ?? '// no content')
  }

  return snapshotPath
}
