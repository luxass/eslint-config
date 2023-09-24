import { type FlatESLintConfigItem } from 'eslint-define-config'
import { pluginReact } from '..'

interface ReactOptions {
  typescript?: boolean
}

export function react(options: ReactOptions = {}): FlatESLintConfigItem[] {
  console.log('react', options)
  console.log('pluginReact', pluginReact)

  return [
    {
      files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
      plugins: {
        react,
      },

      settings: {
        react: {
          version: '17.0',
        },
      },
      rules: {
        'jsx-quotes': ['error', 'prefer-double'],
        'react/react-in-jsx-scope': 'off',
      },
    },
  ]
}

// module.exports = {
//   extends: [
//     "plugin:react/recommended",
//     "plugin:react-hooks/recommended",
//     TS
//       ? "@luxass/eslint-config-ts"
//       : "@luxass/eslint-config-js",
//   ],
//   settings: {
//     react: {
//       version: "17.0",
//     },
//   },
//   rules: {
//     "jsx-quotes": ["error", "prefer-double"],
//     "react/react-in-jsx-scope": "off",
//   },
// };
