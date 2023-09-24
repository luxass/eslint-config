import { type FlatESLintConfigItem } from "eslint-define-config";
import { parserAstro, parserTs, pluginAstro } from "../plugins";

interface AstroOptions {
  typescript?: boolean;
}

export function astro(options: AstroOptions = {}): FlatESLintConfigItem[] {
  console.log("astro", options);

  return [
    {
      files: ["*.astro"],
      languageOptions: {
        parser: parserAstro,
        parserOptions: {
          parser: options.typescript ? (parserTs as any) : null,
          extraFileExtensions: [".astro"],
        },
      },
      plugins: {
        astro: pluginAstro,
      },
      rules: {
        ...(pluginAstro.configs.recommended.rules as any),
      },
    },
  ];
}
