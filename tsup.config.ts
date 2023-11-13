import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm", "cjs"],
  clean: true,
  outExtension(ctx) {
    return {
      js: ctx.format === "cjs" ? ".cjs" : ".mjs",
    };
  },
  dts: true,
  skipNodeModulesBundle: true,
});
