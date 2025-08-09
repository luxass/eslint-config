import type { TypedFlatConfigItem } from "../types";

import createCommand from "eslint-plugin-command/config";

export async function command(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "luxass/command/rules",
      ...createCommand() as any,
    },
  ];
}
