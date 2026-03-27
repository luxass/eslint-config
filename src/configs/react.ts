import type { TypedFlatConfigItem } from "../types";
import { isPackageExists } from "local-pkg";
import { GLOB_ASTRO_TS, GLOB_JS, GLOB_JSX, GLOB_MARKDOWN, GLOB_TS, GLOB_TSX } from "../globs";
import { ensure, interop } from "../utils";

export interface ReactOptions {
  /**
   * Override rules.
   */
  overrides?: TypedFlatConfigItem["rules"];

  /**
   * When this options is provided, type aware rules will be enabled.
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  tsconfigPath?: string | string[];

  /**
   * Glob patterns for JSX & TSX files.
   *
   * @default [GLOB_JS,GLOB_JSX,GLOB_TS,GLOB_TSX]
   * @see https://github.com/luxass/eslint-config/blob/main/src/globs.ts
   */
  files?: string[];

  /**
   * Glob patterns for files that should be type aware.
   * @default ['**\/*.{ts,tsx}']
   */
  filesTypeAware?: string[];

  /**
   * Glob patterns for files that should not be type aware.
   * @default ['**\/*.md\/**', '**\/*.astro/*.ts']
   */
  ignoresTypeAware?: string[];
}

// react refresh
const ReactRefreshAllowConstantExportPackages = [
  "vite",
];

const RemixPackages = [
  "@remix-run/node",
  "@remix-run/react",
  "@remix-run/serve",
  "@remix-run/dev",
];

const ReactRouterPackages = [
  "@react-router/node",
  "@react-router/react",
  "@react-router/serve",
  "@react-router/dev",
];

const TanstackRouterPackages = [
  "@tanstack/react-router",
];

const NextJsPackages = [
  "next",
];

export async function react(options: ReactOptions = {}): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_JS, GLOB_JSX, GLOB_TS, GLOB_TSX],
    filesTypeAware = [GLOB_TS, GLOB_TSX],
    ignoresTypeAware = [
      `${GLOB_MARKDOWN}/**`,
      GLOB_ASTRO_TS,
    ],
    overrides = {},
    tsconfigPath,
  } = options;

  await ensure([
    "@eslint-react/eslint-plugin",
    "eslint-plugin-react-refresh",
  ]);

  const isTypeAware = !!tsconfigPath;

  const typeAwareRules: TypedFlatConfigItem["rules"] = {
    "react/no-leaked-conditional-rendering": "error",
  };

  const [
    pluginReact,
    pluginReactRefresh,
  ] = await Promise.all([
    interop(import("@eslint-react/eslint-plugin")),
    interop(import("eslint-plugin-react-refresh")),
  ] as const);

  const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some((i) => isPackageExists(i));
  const isUsingRemix = RemixPackages.some((i) => isPackageExists(i));
  const isUsingReactRouter = ReactRouterPackages.some((i) => isPackageExists(i));
  const isUsingNext = NextJsPackages.some((i) => isPackageExists(i));
  const isUsingTanstackRouter = TanstackRouterPackages.some((i) => isPackageExists(i));

  const plugins = pluginReact.configs.all.plugins!;

  return [
    {
      name: "luxass/react/setup",
      plugins: {
        "react": plugins["@eslint-react"],
        "react-dom": plugins["@eslint-react/dom"],
        "react-naming-convention": plugins["@eslint-react/naming-convention"],
        "react-refresh": pluginReactRefresh,
        "react-rsc": plugins["@eslint-react/rsc"],
        "react-web-api": plugins["@eslint-react/web-api"],
      },
    },
    {
      files,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
        sourceType: "module",
      },
      name: "luxass/react/rules",
      rules: {
        ...pluginReact.configs.recommended.rules,

        'react/prefer-namespace-import': 'error',

        // preconfigured rules from eslint-plugin-react-refresh https://github.com/ArnaudBarre/eslint-plugin-react-refresh/tree/main/src
        'react-refresh/only-export-components': [
          'error',
          {
            allowConstantExport: isAllowConstantExport,
            allowExportNames: [
              ...(isUsingNext
                ? [
                  // https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
                  'dynamic',
                  'dynamicParams',
                  'revalidate',
                  'fetchCache',
                  'runtime',
                  'preferredRegion',
                  'maxDuration',
                  // https://nextjs.org/docs/app/api-reference/functions/generate-static-params
                  'generateStaticParams',
                  // https://nextjs.org/docs/app/api-reference/functions/generate-metadata
                  'metadata',
                  'generateMetadata',
                  // https://nextjs.org/docs/app/api-reference/functions/generate-viewport
                  'viewport',
                  'generateViewport',
                  // https://nextjs.org/docs/app/api-reference/functions/generate-image-metadata
                  'generateImageMetadata',
                  // https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps
                  'generateSitemaps',
                ]
                : []),
              ...(isUsingRemix || isUsingReactRouter
                ? [
                  'meta',
                  'links',
                  'headers',
                  'loader',
                  'action',
                  'clientLoader',
                  'clientAction',
                  'handle',
                  'shouldRevalidate',
                ]
                : []),
            ],
          },
        ],

        // overrides
        ...overrides,
      },
    },
    {
      files: filesTypeAware,
      name: 'luxass/react/typescript',
      rules: {
        // Disables rules that are already handled by TypeScript
        'react-dom/no-string-style-prop': 'off',
        'react-dom/no-unknown-property': 'off',
      },
    },
    ...isTypeAware
      ? [{
        files: filesTypeAware,
        ignores: ignoresTypeAware,
        name: "luxass/react/type-aware-rules",
        rules: {
          ...typeAwareRules,
        },
      }]
      : [],
  ];
}
