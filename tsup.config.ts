import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "./src/index.ts",
    "./src/globs.ts",
    "./src/configs/**/*.ts",
  ],
  format: ["esm", "cjs"],
  clean: true,
  outExtension(ctx) {
    return {
      js: ctx.format === "cjs" ? ".cjs" : ".mjs",
    };
  },
  dts: true,
  skipNodeModulesBundle: true,
  bundle: true,
  // treeshake: true,
});
