import type { FlatConfigItem } from "../types";

export function ignores(): FlatConfigItem[] {
  return [
    {
      ignores: [
        "**/node_modules",
        "**/dist",
        "**/out",
        "**/build",
        "**/package-lock.json",
        "**/yarn.lock",
        "**/pnpm-lock.yaml",
        "**/bun.lockb",

        "**/output",
        "**/coverage",
        "**/temp",
        "**/.temp",
        "**/tmp",
        "**/.tmp",
        "**/.history",
        "**/.vitepress/cache",
        "**/.nuxt",
        "**/.next",
        "**/.vercel",
        "**/.changeset",
        "**/.idea",
        "**/.cache",
        "**/.output",
        "**/.vite-inspect",
        "**/.astro",

        "**/CHANGELOG*.md",
        "**/*.min.*",
        "**/LICENSE*",
        "**/__snapshots__",
        "**/auto-import?(s).d.ts",
        "**/components.d.ts",
      ],
    },
  ];
}
