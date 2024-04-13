import fs from 'node:fs/promises'
import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import { builtinRules } from 'eslint/use-at-your-own-risk'
import {
  astro,
  comments,
  formatters,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  nextjs,
  node,
  react,
  solid,
  sortPackageJson,
  sortTsconfig,
  stylistic,
  svelte,
  tailwindcss,
  test,
  toml,
  typescript,
  unicorn,
  unocss,
  vue,
  yaml,
} from '../src/configs'
import { combine } from '../src/utils'

const configs = await combine(
  {
    plugins: {
      '': {
        rules: Object.fromEntries(builtinRules.entries()),
      },
    },
  },
  astro(),
  comments(),
  formatters(),
  imports(),
  javascript(),
  jsdoc(),
  jsonc(),
  markdown(),
  node(),
  react(),
  sortPackageJson(),
  stylistic(),
  tailwindcss(),
  sortTsconfig(),
  nextjs(),
  solid(),
  ignores(),
  test(),
  toml(),
  typescript(),
  unicorn(),
  unocss(),
  vue(),
  yaml(),
  svelte(),
)

const dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false,
})

await fs.writeFile('src/typegen.d.ts', dts)
