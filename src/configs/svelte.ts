import { type FlatESLintConfigItem } from 'eslint-define-config'

interface SvelteOptions {
  typescript?: boolean
}

export function svelte(options: SvelteOptions = {}): FlatESLintConfigItem[] {
  console.log('svelte', options)

  return [{}]
}
