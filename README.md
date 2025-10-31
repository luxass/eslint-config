# @luxass/eslint-config

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

## ✨ Features

- Based on [antfu's ESLint Config](https://github.com/antfu/eslint-config) with some modifications
- Auto fix for formatting (aimed to be used standalone **without** Prettier)
- Designed to work with TypeScript, JSX, Vue out-of-box
- Lints also for json, yaml, toml, markdown
- Sorted imports, dangling commas
- Reasonable defaults, best practices, only one-line of config
- Opinionated, but [very customizable](#customization)
- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), compose easily!
- Using [ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic)
- Respects `.gitignore` by default
- Optional [React](#react), [UnoCSS](#unocss), [Astro](#astro) support
- Optional [formatters](#formatters) support for CSS, HTML, etc.

## Usage

```bash
npm install -D eslint @luxass/eslint-config
```

And create a `eslint.config.mjs` in your project root:

```js
// eslint.config.mjs
import luxass from "@luxass/eslint-config";

export default luxass();
```

<details>
<summary>
Combined with legacy config:
</summary>

If you still use some configs from the legacy ESLint RC format, you can use the [`@eslint/eslintrc`](https://www.npmjs.com/package/@eslint/eslintrc) package to convert them to the flat config.

```js
// eslint.config.mjs
import { FlatCompat } from "@eslint/eslintrc";
import luxass from "@luxass/eslint-config";

const compat = new FlatCompat();

export default luxass(
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

</details>

### Add script for package.json

For example:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## Setup for Visual Studio Code (with auto-fix)

Install [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and add the following to your `.vscode/settings.json`:

```jsonc
// .vscode/settings.json
{
  // disable the default formatter
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // auto fix on save
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  // silent the stylistic rules in your IDE, but still auto fix them
  "eslint.rules.customizations": [
    { "rule": "style/*", "severity": "off", "fixable": true },
    { "rule": "format/*", "severity": "off", "fixable": true },
    { "rule": "*-indent", "severity": "off", "fixable": true },
    { "rule": "*-spacing", "severity": "off", "fixable": true },
    { "rule": "*-spaces", "severity": "off", "fixable": true },
    { "rule": "*-order", "severity": "off", "fixable": true },
    { "rule": "*-dangle", "severity": "off", "fixable": true },
    { "rule": "*-newline", "severity": "off", "fixable": true },
    { "rule": "*quotes", "severity": "off", "fixable": true },
    { "rule": "*semi", "severity": "off", "fixable": true }
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
    "yaml",
    "toml",
    "gql",
    "graphql",
    "astro",
    "css",
    "less",
    "scss",
    "pcss",
    "postcss"
  ]
}
```

## Customization

Normally you would only need to import the config and export it:

```js
// eslint.config.js
import luxass from "@luxass/eslint-config";

export default luxass();
```

And that's it! Or you can configure each integration individually, for example:

```js
// eslint.config.js
import luxass from "@luxass/eslint-config";

export default luxass({
  // Enable stylistic formatting rules
  // stylistic: true,

  // Or customize the stylistic rules
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: "single", // or 'double'
  },

  // TypeScript and Vue are auto-detected, you can also explicitly enable them:
  typescript: true,
  vue: true,

  // Disable jsonc and yaml support
  jsonc: false,
  yaml: false,

  // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
  ignores: [
    "**/fixtures",
    // ...globs
  ]
});
```

The `luxass` factory function also accepts any number of arbitrary custom config overrides:

```js
// eslint.config.js
import luxass from "@luxass/eslint-config";

export default luxass(
  {
    // Configures for luxass's config
  },

  // From the second arguments they are ESLint Flat Configs
  // you can have multiple configs
  {
    files: ["**/*.ts"],
    rules: {},
  },
  {
    rules: {},
  },
);
```

Going more advanced, you can also import fine-grained configs and compose them as you wish:

<details>
<summary>Advanced Example</summary>

We wouldn't recommend using this style in general unless you know exactly what they are doing, as there are shared options between configs and might need extra care to make them consistent.

```js
// eslint.config.js
import {
  combine,
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
  yaml
} from "@luxass/eslint-config";

export default combine(
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

Since flat config requires us to explicitly provide the plugin names (instead of mandatory convention from NPM package name), we renamed some plugins to make overall scope more consistent and easier to write.

| New Prefix                  | Original Prefix                     | Source Plugin                                                                                                                                    |
| --------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `import/*`                  | `import-lite/*`                     | [eslint-plugin-import-lite](https://github.com/9romise/eslint-plugin-import-lite)                                                                |
| `node/*`                    | `n/*`                               | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)                                                                           |
| `yaml/*`                    | `yml/*`                             | [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml)                                                                              |
| `ts/*`                      | `@typescript-eslint/*`              | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint)                                                       |
| `style/*`                   | `@stylistic/*`                      | [@stylistic/eslint-plugin](https://github.com/eslint-stylistic/eslint-stylistic)                                                                 |
| `test/*`                    | `vitest/*`                          | [@vitest/eslint-plugin](https://github.com/vitest-dev/eslint-plugin-vitest)                                                                      |
| `react/*`                   | `@eslint-react/*`                   | [@eslint-react/eslint-plugin ](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin)                                  |
| `react-dom/*`               | `@eslint-react/dom/*`               | [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom)                             |
| `react-hooks-extra/*`       | `@eslint-react/hooks-extra/*`       | [eslint-plugin-react-hooks-extra](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-hooks-extra)             |
| `react-naming-convention/*` | `@eslint-react/naming-convention/*` | [eslint-plugin-react-naming-convention](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-naming-convention) |

When you want to override rules, or disable them inline, you need to update to the new prefix:

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

> [!NOTE]
> About plugin renaming - it is actually rather a dangerous move that might lead to potential naming collisions, pointed out [here](https://github.com/eslint/eslint/discussions/17766) and [here](https://github.com/prettier/eslint-config-prettier#eslintconfigjs-flat-config-plugin-caveat). As this config also very **personal** and **opinionated**, I ambitiously position this config as the only **"top-level"** config per project, that might pivot the taste of how rules are named.
>
> This config cares more about the user-facings DX, and try to ease out the implementation details. For example, users could keep using the semantic `import/order` without ever knowing the underlying plugin has migrated twice to `eslint-plugin-i` and then to `eslint-plugin-import-x`. User are also not forced to migrate to the implicit `i/order` halfway only because we swapped the implementation to a fork.
>
> That said, it's probably still not a good idea. You might not want to do this if you are maintaining your own ESLint config.
>
> Feel free to open issues if you want to combine this config with some other config presets but faced naming collisions. I am happy to figure out a way to make them work. But at this moment I have no plan to revert the renaming.

Since v4.3.0, this preset will automatically rename the plugins also for your custom configs. You can use the original prefix to override the rules directly.

### Rules Overrides

Certain rules would only be enabled in specific files, for example, `ts/*` rules would only be enabled in `.ts` files and `vue/*` rules would only be enabled in `.vue` files. If you want to override the rules, you need to specify the file extension:

```js
// eslint.config.js
import luxass from "@luxass/eslint-config";

export default luxass(
  {
    vue: true,
    typescript: true
  },
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

We also provided a `overrides` options in each integration to make it easier:

```js
// eslint.config.js
import luxass from "@luxass/eslint-config";

export default luxass({
  vue: {
    overrides: {
      "vue/operator-linebreak": ["error", "before"],
    },
  },
  typescript: {
    overrides: {
      "ts/consistent-type-definitions": ["error", "interface"],
    },
  },
  yaml: {
    overrides: {
      // ...
    },
  },
});
```

### Config Composer

Since v4.3.0, the factory function `luxass()` returns a [`FlatConfigComposer` object from `eslint-flat-config-utils`](https://github.com/antfu/eslint-flat-config-utils#composer) where you can chain the methods to compose the config even more flexibly.

```js
// eslint.config.js
import luxass from "@luxass/eslint-config";

export default luxass()
  .prepend(
    // some configs before the main config
  )
  // overrides any named configs
  .override(
    "luxass/stylistic/rules",
    {
      rules: {
        "style/generator-star-spacing": ["error", { after: true, before: false }],
      }
    }
  )
  // rename plugin prefixes
  .renamePlugins({
    "old-prefix": "new-prefix",
    // ...
  });
// ...
```

### Optional Configs

We provide some optional configs for specific use cases, that we don't include their dependencies by default.

#### Formatters

Use external formatters to format files that ESLint cannot handle yet (`.css`, `.html`, etc.). Powered by [`eslint-plugin-format`](https://github.com/antfu/eslint-plugin-format).

```js
// eslint.config.js
import luxass from "@luxass/eslint-config";

export default luxass({
  formatters: {
    /**
     * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
     * By default uses Prettier
     */
    css: true,
    /**
     * Format HTML files
     * By default uses Prettier
     */
    html: true,
    /**
     * Format Markdown files
     * Supports Prettier and dprint
     * By default uses Prettier
     */
    markdown: "prettier"
  }
});
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D eslint-plugin-format
```

#### React

To enable React support, you need to explicitly turn it on:

```js
// eslint.config.js
import luxass from "@luxass/eslint-config";

export default luxass({
  react: true,
});
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D @eslint-react/eslint-plugin eslint-plugin-react-hooks eslint-plugin-react-refresh
```

#### Astro

To enable Astro support, you need to explicitly turn it on:

```js
// eslint.config.js
import luxass from "@luxass/eslint-config";

export default luxass({
  astro: true,
});
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D eslint-plugin-astro
```

#### UnoCSS

To enable UnoCSS support, you need to explicitly turn it on:

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

### Type Aware Rules

You can optionally enable the [type aware rules](https://typescript-eslint.io/linting/typed-linting/) by passing the options object to the `typescript` config:

```js
// eslint.config.js
import luxass from "@luxass/eslint-config";

export default luxass({
  typescript: {
    tsconfigPath: "tsconfig.json",
  },
});
```

### Editor Specific Disables

Some rules are disabled when inside ESLint IDE integrations, namely [`unused-imports/no-unused-imports`](https://www.npmjs.com/package/eslint-plugin-unused-imports) [`test/no-focused-tests`](https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-focused-tests.md)

This is to prevent unused imports from getting removed by the IDE during refactoring to get a better developer experience. Those rules will be applied when you run ESLint in the terminal or [Lint Staged](#lint-staged). If you don't want this behavior, you can disable them:

```js
// eslint.config.js
import luxass from "@luxass/eslint-config";

export default luxass({
  editor: false
});
```

### Lint Staged

If you want to apply lint and auto-fix before every commit, you can add the following to your `package.json`:

```json
{
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }
}
```

and then

```bash
npm i -D lint-staged simple-git-hooks

// to active the hooks
npx simple-git-hooks
```

## View what rules are enabled

[antfu](https://github.com/antfu) built a visual tool to help you view what rules are enabled in your project and apply them to what files, [@eslint/config-inspector](https://github.com/eslint/config-inspector)

Go to your project root that contains `eslint.config.js` and run:

```bash
npx @eslint/config-inspector
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

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@luxass/eslint-config?style=flat&colorA=18181B&colorB=4169E1
[npm-version-href]: https://npmjs.com/package/@luxass/eslint-config
[npm-downloads-src]: https://img.shields.io/npm/dm/@luxass/eslint-config?style=flat&colorA=18181B&colorB=4169E1
[npm-downloads-href]: https://npmjs.com/package/@luxass/eslint-config
