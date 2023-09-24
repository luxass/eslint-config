# @luxass/eslint-config

> If you are looking for the old config, you can find it [here](https://github.com/luxass/eslint-config-legacy)

## ✨ Features

- Designed to work with JavaScript, Typescript, React, Svelte, Astro, Vue out of the box.
- Support for JSON, YAML, Markdown
- Sorted imports for `package.json` and `tsconfig.json`
- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), compose easily!
- Using [ESLint Stylistic](https://eslint.style/guide/why)

## 📦 Install

```bash
pnpm add -D eslint @luxass/eslint-config
```

## 🚀 Usage
```js
// eslint.config.js
import { luxass } from '@luxass/eslint-config'

export default luxass()
```

## Setup for Visual Studio Code

Install [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and add the following to your `.vscode/settings.json`:

```jsonc
// .vscode/settings.json
{
  // will ensure that eslint can use the experimental flat config
  "eslint.experimental.useFlatConfig": true,

  // disable the default formatter
  "prettier.enable": false,
  "editor.formatOnSave": false,

    // auto fix on save
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": false
  },

  // silent the stylistic rules in you IDE, but still auto fix them
  "eslint.rules.customizations": [
    { "rule": "@stylistic/*", "severity": "off" },
    { "rule": "style*", "severity": "off" },
    { "rule": "*-indent", "severity": "off" },
    { "rule": "*-spacing", "severity": "off" },
    { "rule": "*-spaces", "severity": "off" },
    { "rule": "*-order", "severity": "off" },
    { "rule": "*-dangle", "severity": "off" },
    { "rule": "*-newline", "severity": "off" },
    { "rule": "*quotes", "severity": "off" },
    { "rule": "*semi", "severity": "off" }
  ],

    // The following is optional.
  // It's better to put under project setting `.vscode/settings.json`
  // to avoid conflicts with working with different eslint configs
  // that does not support all formats.
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "json",
    "jsonc",
    "yaml"
  ]
}
```

## Customization

Normally you would only need to import the `luxass` preset:

```js
// eslint.config.js
import { luxass } from '@luxass/eslint-config'

export default luxass()
```

you can also configure each `config` individually:

```js
// eslint.config.js
import { luxass } from '@luxass/eslint-config'

export default luxass({
  typescript: true,
  vue: true,
  react: false,
  astro: true,
  svelte: false,
  unocss: true,
  tailwindcss: false,
  stylistic: true
})
```

The `luxass` function accepts an arbitrary number of `flat configs` overrides:

```js
// eslint.config.js
import { luxass } from '@luxass/eslint-config'

export default luxass({},
  {
    rules: {}
  },
  {
    rules: {}
  }
)
```

### Fine Grained Configurations

If you want it more advanced, you can also just import the `config` you need.

```js
// eslint.config.js
import {
  astro,
  comments,
  ignores,
  imports,
  javascript,
  javascriptStylistic,
  jsdoc,
  jsonc,
  markdown,
  node,
  react,
  sort,
  svelte,
  tailwindcss,
  typescript,
  typescriptStylistic,
  unicorn,
  unocss,
  vue,
  yml
} from '@luxass/eslint-config/configs'

export default [
  ...astro,
  ...comments,
  ...ignores,
  ...imports,
  ...javascript,
  ...javascriptStylistic,
  ...jsdoc,
  ...jsonc,
  ...markdown,
  ...node,
  ...react,
  ...sort,
  ...svelte,
  ...tailwindcss,
  ...typescript,
  ...typescriptStylistic,
  ...unicorn,
  ...unocss,
  ...vue,
  ...yml
]
```

> Thanks to [sxzz/eslint-config](https://github.com/sxzz/eslint-config) and [antfu/eslint-config](https://github.com/antfu/eslint-config) for the inspiration and references.

Published under [MIT License](./LICENCE).
