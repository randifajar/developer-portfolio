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

  /*
   * The content-flow boundary, enforced rather than remembered.
   *
   * Pages and components must read content through the selector layer, which
   * applies publication and confidentiality filtering in one place. A
   * component importing src/content directly would bypass that filter and
   * could render Draft, Private, or Restricted material
   * (FAC-PUBLISH-001/002, NFAC-SEC-006).
   *
   * Only the domain layer may touch raw content; it is where the filtering
   * lives. Overriding this rule in a component is almost always the wrong fix
   * — the right one is to add or extend a selector.
   */
  {
    files: ["src/app/**/*.{ts,tsx}", "src/components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/content/*", "@/content", "**/content/projects", "../content/*"],
              message:
                "Read content through @/domain/content/selectors. Importing src/content " +
                "directly bypasses publication and confidentiality filtering.",
            },
          ],
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
