// This file is for testing

import { defineConfig, presetUno, presetAttributify } from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify()
  ],
  blocklist: [
    "border",
    ["bg-red-500", { message: "Use bg-red-600 instead" }],
    [(i) => i.startsWith("text-"), { message: "Use color-* instead" }],
    [(i) => i.endsWith("-auto"), { message: (s) => `Use ${s.replace(/-auto$/, "-a")} instead` }],
  ],
});
