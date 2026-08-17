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
    // Chosen rather than inherited. Vitest's default is 5000ms, which was never
    // a decision anyone made about *this* workload.
    //
    // Some tests must load a module by a name computed at runtime, so they call
    // vi.resetModules() and await import() inside the test body. That puts a
    // full re-transform and re-evaluation of a component subgraph on the clock.
    // homepage-section-omission.test.tsx does it six times, worst case 573ms.
    //
    // experience-grouping.test.tsx used to do the same at ~1100ms — a margin of
    // about 4.5x — and on 2026-08-17 that margin ran out twice under full-suite
    // parallelism. It has since been restructured to import once, but the files
    // that genuinely need a computed module name cannot be, so they get real
    // headroom instead.
    //
    // A timeout is not a substitute for a test being fast; it is protection
    // against a machine being slow. The 2026-08-17 entry in
    // docs/release-audit.md records what the failure actually looked like.
    testTimeout: 20_000,
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
