import { type FlatESLintConfigItem } from "eslint-define-config";

interface AstroOptions {
  typescript?: boolean;
}

export function astro(
  options: AstroOptions = {},
): FlatESLintConfigItem[] {
  console.log("astro", options);

  return [
    {

    }
  ];
}
