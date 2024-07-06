import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

export async function getSnapshotPath(base: string, path: string, snapshotContent?: string): Promise<[path: string, content: string]> {
  const snapshotPath = join(base, ".linted", path);
  const directoryPath = dirname(snapshotPath);

  if (!existsSync(directoryPath)) {
    await mkdir(directoryPath, { recursive: true });
  }

  const content = snapshotContent ?? "// unchanged";

  if (!existsSync(snapshotPath)) {
    await writeFile(snapshotPath, snapshotContent ?? "// unchanged");
  }

  return [snapshotPath, content];
}
