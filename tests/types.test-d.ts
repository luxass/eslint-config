import type { TypedFlatConfigItem } from "../src";
import type { Linter } from "eslint";

// Make sure they are compatible
((): Linter.Config => ({} as TypedFlatConfigItem))();
((): TypedFlatConfigItem => ({} as Linter.Config))();
