/**
 * Print the whole contrast matrix.
 *
 * A design instrument, not a gate — the gate is tests/design/contrast.test.ts,
 * which runs in `quality` on every pull request. This exists so that "what
 * happens if I nudge this hex" is a two-second question instead of a CI round
 * trip, which is the difference between measuring a palette and guessing at it.
 *
 * Reads the same shipping stylesheet the test does.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  CONTRAST_FLOOR,
  NON_TEXT_SCOPE,
  check,
  type ContrastCheck,
} from "../src/domain/design/contrast";
import { SURFACE_NAMES, parseSurfaceTokens } from "../src/domain/design/tokens";

const TEXT_TOKENS = [
  "color-text-primary",
  "color-text-secondary",
  "color-text-muted",
  "color-accent",
  "color-accent-hover",
  "color-status-success",
  "color-status-warning",
  "color-status-neutral",
  "color-status-error",
];

const BACKGROUND_TOKENS = ["color-background", "color-surface", "color-surface-muted"];

function main(): void {
  const css = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");
  const tokens = parseSurfaceTokens(css);

  let checked = 0;
  let failed = 0;
  let tightest = { label: "", ratio: Number.POSITIVE_INFINITY };

  for (const surface of SURFACE_NAMES) {
    const t = tokens[surface];
    process.stdout.write(`\n${surface.toUpperCase()}\n`);

    const pairs: ContrastCheck[] = [];

    for (const fg of TEXT_TOKENS) {
      for (const bg of BACKGROUND_TOKENS) {
        pairs.push({
          label: `${fg.replace("color-", "")} on ${bg.replace("color-", "")}`,
          foreground: t[fg]!,
          background: t[bg]!,
          kind: "text",
        });
      }
    }

    pairs.push(
      {
        label: "on-accent on accent",
        foreground: t["color-on-accent"]!,
        background: t["color-accent"]!,
        kind: "text",
      },
      {
        label: "on-accent-subtle on accent-subtle",
        foreground: t["color-on-accent-subtle"]!,
        background: t["color-accent-subtle"]!,
        kind: "text",
      },
      {
        label: "focus ring on background",
        foreground: t["color-focus"]!,
        background: t["color-background"]!,
        kind: "non-text",
      },
      {
        label: "focus ring on surface",
        foreground: t["color-focus"]!,
        background: t["color-surface"]!,
        kind: "non-text",
      },
    );

    for (const result of pairs.map(check)) {
      checked += 1;
      if (!result.passes) failed += 1;

      if (result.kind === "text" && result.ratio < tightest.ratio) {
        tightest = { label: `${surface}: ${result.label}`, ratio: result.ratio };
      }

      const mark = result.passes ? "  " : "!!";
      process.stdout.write(
        `  ${mark} ${result.ratio.toFixed(2).padStart(5)}  ${result.label} (floor ${result.floor})\n`,
      );
    }
  }

  process.stdout.write(
    `\n${checked} pairs checked, ${failed} below floor.\n` +
      `Floors: text ${CONTRAST_FLOOR.text}, non-text ${CONTRAST_FLOOR.nonText} ` +
      `(applied only to ${NON_TEXT_SCOPE.join(" and ")}).\n` +
      `Tightest text pair: ${tightest.label} at ${tightest.ratio.toFixed(2)}.\n`,
  );

  if (failed > 0) process.exitCode = 1;
}

// tsx emits CommonJS, so a top-level await here would not run.
main();
