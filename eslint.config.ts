import styleMigrate from '@stylistic/eslint-plugin-migrate'
import { luxass } from './src'

export default luxass(
  {
    vue: true,
    react: true,
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
    files: ['src/configs/*.ts'],
    plugins: {
      'style-migrate': styleMigrate,
    },
    rules: {
      'style-migrate/migrate': ['error', { namespaceTo: 'style' }],
    },
  },
)
