import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts", "./src/configs/index.ts"],
  format: ["esm"],
  clean: true,
  dts: true,
  outExtension(ctx) {
    return {
      js: ctx.format === "cjs" ? ".cjs" : ".mjs",
    }
  },
});
