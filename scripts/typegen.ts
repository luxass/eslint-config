import fs from "node:fs/promises";
import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import { builtinRules } from "eslint/use-at-your-own-risk";
import * as configs from "../src/configs";
import { combine } from "../src/utils";

const combinedConfigs = await combine(
  {
    plugins: {
      "": {
        rules: Object.fromEntries(builtinRules.entries()),
      },
    },
  },
  ...Object.values(configs).map((i) => i()),
);

const configNames = combinedConfigs.map((i) => i.name).filter(Boolean) as string[];

let dts = await flatConfigsToRulesDTS(combinedConfigs, {
  includeAugmentation: false,
});

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map((i) => `'${i}'`).join(" | ")}
`;

await fs.writeFile("src/typegen.d.ts", dts);
