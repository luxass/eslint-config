import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    './src/index.ts',
  ],
  shims: true,
  noExternal: [
    // we want to bundle "eslint-parser-plain" due to us
    // patching it, otherwise the patch doesn't get applied
    'eslint-parser-plain',
  ],
})
