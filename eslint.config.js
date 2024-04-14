// @ts-check
import styleMigrate from '@stylistic/eslint-plugin-migrate'
import JITI from 'jiti'

const jiti = JITI(import.meta.url)

/**
 * @type {import('./src').default}
 */
const luxass = jiti('./src').default

export default luxass(
  {
    vue: true,
    react: true,
    solid: true,
    svelte: true,
    astro: true,
    typescript: true,
    formatters: true,
  },
  {
    ignores: [
      '**/fixtures',
    ],
  },
  {
    files: ['src/configs/**/*.ts'],
    plugins: {
      'style-migrate': styleMigrate,
    },
    rules: {
      'style-migrate/migrate': ['error', { namespaceTo: 'style' }],
    },
  },
)
