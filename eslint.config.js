import stylisticMigrate from '@stylistic/eslint-plugin-migrate';
import sortKeys from 'eslint-plugin-sort-keys';

import { all, luxass } from "@luxass/eslint-config";

// export default luxass([
//   {
//     ignores: [
//       'fixtures',
//       '_fixtures',
//     ],
//   },
//   {
//     files: ['src/**/*.ts'],
//     plugins: {
//       '@stylistic/migrate': stylisticMigrate,
//       'sort-keys': sortKeys,
//     },
//     rules: {
//       '@stylistic/migrate/rules': 'error',
//       'sort-keys/sort-keys-fix': 'error',
//     },
//   }
// ]);

export default all;
