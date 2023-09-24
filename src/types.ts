export interface Options {
  /**
   * Enable TypeScript support.
   *
   * Passing an object to enable TypeScript Language Server support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: boolean

  /**
   * Enable Vue support.
   *
   * @default auto-detect based on the dependencies
   */
  vue?: boolean

  /**
   * Enable React support.
   *
   * @default auto-detect based on the dependencies
   */
  react?: boolean

  /**
   * Enable Astro support.
   *
   * @default auto-detect based on the dependencies
   */
  astro?: boolean

  /**
   * Enable Astro support.
   *
   * @default auto-detect based on the dependencies
   */
  svelte?: boolean

  /**
   * Enable UnoCSS support.
   *
   * @default auto-detect based on the dependencies
   */
  unocss?: boolean

  /**
   * Enable TailwindCSS support.
   *
   * This is conflicting with UnoCSS preset, so you can only enable one of them.
   * @default auto-detect based on the dependencies
   */
  tailwindcss?: boolean

  /**
   * Enable JSON support.
   *
   * Will also enable JSONC & JSON5 support.
   *
   * @default true
   */
  json?: boolean

  /**
   * Enable YAML support.
   *
   * @default true
   */
  yaml?: boolean

  /**
   * Enable Markdown support.
   *
   * @default true
   */
  markdown?: boolean

  /**
   * Enable stylistic rules.
   *
   * @default true
   */
  stylistic?: boolean

  /**
   * Control to disable some rules in editors.
   * @default auto-detect based on the process.env
   */
  editorEnabled?: boolean
}
