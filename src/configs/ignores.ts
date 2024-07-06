import type { TypedFlatConfigItem } from "../types";
import { GLOB_EXCLUDE } from "../globs";

export function ignores(): TypedFlatConfigItem[] {
  return [
    {
      ignores: GLOB_EXCLUDE,
    },
  ];
}
