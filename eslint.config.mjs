import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // eslint-config-prettier must stay last. It disables every ESLint rule that
  // would fight Prettier over formatting, so anything added above it is
  // correctly overridden rather than producing conflicting fixes.
  prettier,

  {
    rules: {
      // Tests omit a required field by destructuring it into a discarded
      // binding, which is the clearest way to build an "invalid" fixture.
      // Underscore-prefixed names are intentional discards, not oversights.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated and vendored output:
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
