import { defineConfig } from "vite";
import fs from "fs";
import path from "path";

export default defineConfig(() => {
  return {
    server: {
      fs: {
        allow: ["../webscape-wanderer", "."],
      },
    },
    optimizeDeps: {
      exclude: ['webscape-wanderer']
    },
  };
});
