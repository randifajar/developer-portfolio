import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      // The domain layer holds the correctness-critical logic: publication
      // filtering, confidentiality filtering, validation, and selectors.
      // Coverage is reported for it specifically so gaps are visible.
      include: ["src/domain/**/*.ts", "src/lib/**/*.ts", "src/components/**/*.tsx"],
    },
  },
});
