import { defineConfig } from "vite";

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
