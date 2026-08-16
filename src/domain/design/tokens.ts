/**
 * Reads the design tokens out of the stylesheet that actually ships.
 *
 * Deliberately parses `src/app/globals.css` rather than duplicating the palette
 * into TypeScript. A duplicated palette drifts, and the failure mode is the bad
 * one: the test keeps passing against the copy while the site ships the other
 * values.
 *
 * Pure — it takes CSS text and returns tokens. The caller does the file read, so
 * this stays testable without touching the filesystem and the domain layer stays
 * free of I/O.
 */

import type { HexColor } from "./contrast";

/**
 * The three surfaces from UX2 4.3.
 *
 * `light` is also the `:root` default, so a component outside any surface scope
 * still resolves sane values.
 */
export const SURFACE_NAMES = ["light", "neutral", "dark"] as const;
export type SurfaceName = (typeof SURFACE_NAMES)[number];

export type TokenMap = Readonly<Record<string, HexColor>>;
export type SurfaceTokens = Readonly<Record<SurfaceName, TokenMap>>;

/** Matches `--color-foo: #aabbcc;`, ignoring anything that is not a hex colour. */
const COLOR_DECLARATION = /--(color-[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/g;

/**
 * Remove `/* … *\/` comments before parsing.
 *
 * Not cosmetic. The first version of this parser matched a mention of
 * `[data-surface="light"]` inside a prose comment, then took the next `{` it
 * found — which was `@layer base {` — and read all three surface blocks as one.
 * Dark declarations came last, so every surface resolved to the dark palette
 * while the parser reported success.
 *
 * The parity test caught it, which is the entire reason that test asserts dark
 * *differs* from light rather than only that both exist.
 */
function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

/**
 * Pull the body of a block whose header matches, balancing braces.
 *
 * A regex cannot do this correctly — `globals.css` nests `@media` inside
 * `@layer`, and a lazy match to the first `}` silently truncates. Counting
 * braces is the boring, correct approach.
 */
function extractBlock(css: string, headerPattern: RegExp): string | null {
  const match = headerPattern.exec(css);
  if (!match) return null;

  const start = css.indexOf("{", match.index);
  if (start === -1) return null;

  let depth = 0;

  for (let i = start; i < css.length; i += 1) {
    if (css[i] === "{") depth += 1;
    else if (css[i] === "}") {
      depth -= 1;
      if (depth === 0) return css.slice(start + 1, i);
    }
  }

  return null;
}

function readColors(block: string): TokenMap {
  const tokens: Record<string, HexColor> = {};

  COLOR_DECLARATION.lastIndex = 0;
  let match = COLOR_DECLARATION.exec(block);

  while (match !== null) {
    // Later declarations win, matching the CSS cascade within one block.
    tokens[match[1]!] = match[2]!.toLowerCase();
    match = COLOR_DECLARATION.exec(block);
  }

  return tokens;
}

/**
 * Parse the stylesheet into one token map per surface.
 *
 * `light` comes from `@theme static` — it is the default, and repeating it in a
 * `[data-surface="light"]` block as well means a nested light-inside-dark region
 * resolves correctly. Both are read and merged, with the explicit block winning.
 */
export function parseSurfaceTokens(source: string): SurfaceTokens {
  const css = stripComments(source);
  const themeBlock = extractBlock(css, /@theme\s+static\s*/g);

  if (themeBlock === null) {
    throw new Error("No `@theme static` block found — the token contract is missing.");
  }

  const base = readColors(themeBlock);

  const surfaceBlock = (name: SurfaceName): TokenMap => {
    const block = extractBlock(css, new RegExp(`\\[data-surface=["']${name}["']\\]\\s*`, "g"));
    return block === null ? {} : readColors(block);
  };

  return {
    light: { ...base, ...surfaceBlock("light") },
    neutral: { ...base, ...surfaceBlock("neutral") },
    dark: { ...base, ...surfaceBlock("dark") },
  };
}

/**
 * Tokens that legitimately do not vary by surface.
 *
 * Everything else must be declared in all three blocks. A token that is missing
 * from one surface silently keeps the light value there — the same shape of
 * failure as the tree-shaking bug that once removed seven of fourteen tokens,
 * and just as invisible.
 */
export const SURFACE_INVARIANT_TOKENS: readonly string[] = [];

/** Token names that must be present in every surface. */
export function requiredTokenNames(tokens: SurfaceTokens): readonly string[] {
  return Object.keys(tokens.light)
    .filter((name) => !SURFACE_INVARIANT_TOKENS.includes(name))
    .sort();
}
