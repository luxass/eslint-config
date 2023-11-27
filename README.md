# @luxass/eslint-config

> [!IMPORTANT]
> The configuration is not currently finished.  
> I could change at any moment.

## ✨ Features

- Designed to work with JavaScript, Typescript, React, Svelte, Astro, Vue out of the box.
- Support for JSON, YAML, Markdown
- Sorted imports for `package.json` and `tsconfig.json`
- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), compose easily!
- Using [ESLint Stylistic](https://eslint.style/guide/why)

## 📦 Install

```bash
pnpm install -D eslint @luxass/eslint-config
```

## 🚀 Usage

With [`"type": "module"`](https://nodejs.org/api/packages.html#type) in `package.json` (recommended):

```js
// eslint.config.js
import luxass from "@luxass/eslint-config";

export default await luxass();
```

With CJS:

```js
// eslint.config.js
const luxass = require("@luxass/eslint-config").default;

module.exports = luxass();
```

Combined with legacy config:

```js
// eslint.config.js
const luxass = require("@luxass/eslint-config").default;
const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat();

module.exports = luxass(
  {
    ignores: [],
  },

  // Legacy config
  ...compat.config({
    extends: [
      "eslint:recommended",
      // Other extends...
    ],
  })

  // Other flat configs...
);
```

> Note that `.eslintignore` no longer works in Flat config, see [customization](#customization) for more details.

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
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  // silent the stylistic rules in you IDE, but still auto fix them
  "eslint.rules.customizations": [
    { "rule": "style/*", "severity": "off" },
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
import luxass from "@luxass/eslint-config";

export default await luxass();
```

you can also configure each `config` individually:

```js
// eslint.config.js
import luxass from "@luxass/eslint-config";

export default await luxass({
  stylistic: true,
  typescript: true,
  vue: true,
  react: false,
  astro: true,
  unocss: true,

  // `.eslintignore` is no longer supported in Flat config, use `ignores` instead.
  ignores: [
    "./fixtures"
  ]
});
```

The `luxass` function accepts an arbitrary number of `flat configs` overrides:

```js
// eslint.config.js
import luxass from "@luxass/eslint-config";

export default await luxass({
  // configuration points for my config
}, {
  rules: {}
}, {
  rules: {}
});
```
<details>
<summary>Advanced Example</summary>

We don't recommend using this style in general usages, as there are shared options between configs and might need extra care to make them consistent.

```js
// eslint.config.js
import {
  comments,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  node,
  sortPackageJson,
  sortTsconfig,
  stylistic,
  typescript,
  unicorn,
  vue,
  yaml,
} from "@luxass/eslint-config/configs";

import { combine } from "@luxass/eslint-config";

export default await combine(
  ignores(),
  javascript(/* Options */),
  comments(),
  node(),
  jsdoc(),
  imports(),
  unicorn(),
  typescript(/* Options */),
  stylistic(),
  vue(),
  jsonc(),
  yaml(),
  markdown(),
);
```

</details>

Check out the [configs](https://github.com/luxass/eslint-config/blob/main/src/configs) and [factory](https://github.com/luxass/eslint-config/blob/main/src/factory.ts) for more details.

> Thanks to [sxzz/eslint-config](https://github.com/sxzz/eslint-config) and [antfu/eslint-config](https://github.com/antfu/eslint-config) for the inspiration and references.

### Plugins Renaming

Since flat config requires us to explicitly provide the plugin names (instead of mandatory convention from npm package name), we renamed some plugins to make overall scope more consistent and easier to write.

| New Prefix | Original Prefix | Source Plugin |
| --- | --- | --- |
| `import/*` | `i/*` | [eslint-plugin-i](https://github.com/un-es/eslint-plugin-i) |
| `node/*` | `n/*` | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n) |
| `yaml/*` | `yml/*` | [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml) |
| `ts/*` | `@typescript-eslint/*` | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint) |
| `style/*` | `@stylistic/*` | [@stylistic/eslint-plugin](https://github.com/eslint-stylistic/eslint-stylistic) |
| `test/*` | `vitest/*` | [eslint-plugin-vitest](https://github.com/veritem/eslint-plugin-vitest) |
| `test/*` | `no-only-tests/*` | [eslint-plugin-no-only-tests](https://github.com/levibuzolic/eslint-plugin-no-only-tests) |

When you want to override rules, or disable them inline, you need to update to the new prefix:

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

### Rules Overrides

Certain rules would only be enabled in specific files, for example, `ts/*` rules would only be enabled in `.ts` files and `vue/*` rules would only be enabled in `.vue` files. If you want to override the rules, you need to specify the file extension:

```js
// eslint.config.js
import luxass from "@luxass/eslint-config";

export default await luxass(
  { vue: true, typescript: true },
  {
    // Remember to specify the file glob here, otherwise it might cause the vue plugin to handle non-vue files
    files: ["**/*.vue"],
    rules: {
      "vue/operator-linebreak": ["error", "before"],
    },
  },
  {
    // Without `files`, they are general rules for all files
    rules: {
      "style/semi": ["error", "never"],
    },
  }
);
```

We also provided a `overrides` options to make it easier:

```js
// eslint.config.js
import luxass from "@luxass/eslint-config";

export default luxass({
  overrides: {
    vue: {
      "vue/operator-linebreak": ["error", "before"],
    },
    typescript: {
      "ts/consistent-type-definitions": ["error", "interface"],
    },
    yaml: {},
    // ...
  }
});
```

### Optional Configs

We provide some optional configs for specific use cases, that we don't include their dependencies by default.

#### React

To enable React support, need to explicitly turn it on:

```js
// eslint.config.js
import luxass from "@luxass/eslint-config";

export default luxass({
  react: true,
});
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh
```

#### UnoCSS

To enable UnoCSS support, need to explicitly turn it on:

```js
// eslint.config.js
import luxass from "@luxass/eslint-config";

export default luxass({
  unocss: true,
});
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D @unocss/eslint-plugin
```

#### TailwindCSS

To enable TailwindCSS support, need to explicitly turn it on:

```js
// eslint.config.js
import luxass from "@luxass/eslint-config";

export default luxass({
  tailwindcss: true,
});
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D eslint-plugin-tailwindcss
```

### Optional Rules

This config also provides some optional plugins/rules for extended usages.

#### `perfectionist` (sorting)

This plugin [`eslint-plugin-perfectionist`](https://github.com/azat-io/eslint-plugin-perfectionist) allows you to sorted object keys, imports, etc, with auto-fix.

The plugin is installed but no rules are enabled by default. 

It's recommended to opt-in on each file individually using [configuration comments](https://eslint.org/docs/latest/use/configure/rules#using-configuration-comments-1).

```js
/* eslint perfectionist/sort-objects: "error" */
const objectWantedToSort = {
  a: 2,
  b: 1,
  c: 3,
};
/* eslint perfectionist/sort-objects: "off" */
```


### Type Aware Rules

You can optionally enable the [type aware rules](https://typescript-eslint.io/linting/typed-linting/) by passing the options object to the `typescript` config:

```js
// eslint.config.js
import luxass from "@luxass/eslint-config";

export default await luxass({
  typescript: {
    tsconfigPath: "tsconfig.json",
  },
});
```

## Versioning Policy

This project follows [Semantic Versioning](https://semver.org/) for releases. However, since this is just a config and involves opinions and many moving parts, we don't treat rules changes as breaking changes.

### Changes Considered as Breaking Changes

- Node.js version requirement changes
- Huge refactors that might break the config
- Plugins made major changes that might break the config
- Changes that might affect most of the codebases

### Changes Considered as Non-breaking Changes

- Enable/disable rules and plugins (that might become stricter)
- Rules options changes
- Version bumps of dependencies

## 📄 License

Published under [MIT License](./LICENSE).
