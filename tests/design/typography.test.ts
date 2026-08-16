import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Two guards on the type system, both for failures that are invisible without
 * them.
 *
 * 1. A stray raw size utility. Tailwind silently generates nothing for a class
 *    it does not know, so a leftover `text-xl` after the migration produces no
 *    CSS and no error — the element just inherits, and it looks *almost* right.
 *
 * 2. A clamp() without a rem term. A preferred value expressed purely in vw
 *    does not respond to browser zoom, so the text stays put while everything
 *    around it grows. That fails WCAG 1.4.4 at 200%, which PRD 65 requires QA
 *    on, and nothing else in the suite would notice.
 */

const SRC = resolve(process.cwd(), "src");
const CSS = readFileSync(join(SRC, "app/globals.css"), "utf8");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(path) ? [path] : [];
  });
}

/**
 * Tailwind's built-in size scale. These are exactly the names the v2 scale
 * replaces — `text-meta` instead of `text-sm`, and so on.
 *
 * Deliberately not matched with a leading `(sm|lg):` alternative, because a
 * responsive variant of a raw size is just as wrong and the pattern below
 * catches it either way.
 */
const RAW_SIZE_UTILITY = /\btext-(xs|sm|base|lg|xl|[2-9]xl)\b/;

describe("the type scale is the only source of size", () => {
  it("no component uses a raw Tailwind size utility", () => {
    const offenders = sourceFiles(SRC)
      .map((path) => ({ path, lines: readFileSync(path, "utf8").split("\n") }))
      .flatMap(({ path, lines }) =>
        lines
          .map((line, index) => ({ line, number: index + 1 }))
          .filter(({ line }) => RAW_SIZE_UTILITY.test(line))
          .map(({ line, number }) => `${path.replace(SRC, "src")}:${number}  ${line.trim()}`),
      );

    expect(offenders, `\n${offenders.join("\n")}\n`).toEqual([]);
  });

  it("declares every step of the hierarchy", () => {
    // UX2 3.1. A missing step means a call site had nowhere to go and reached
    // for a raw utility instead — which the guard above would then reject,
    // leaving no legal option at all.
    for (const step of [
      "display-hero",
      "display-section",
      "page-title",
      "project-title",
      "card-title",
      "lead",
      "body",
      "meta",
      "eyebrow",
    ]) {
      expect(CSS, `--text-${step} is not declared`).toContain(`--text-${step}:`);
    }
  });
});

describe("responsive type survives browser zoom", () => {
  it("every clamp() preferred value contains a rem term", () => {
    const clamps = [...CSS.matchAll(/--text-[a-z-]+:\s*clamp\(([^)]*)\)/g)];

    // If this drops to zero the assertion below passes vacuously, which is the
    // shape of the two v1 tests that were green while testing nothing.
    expect(clamps.length).toBeGreaterThanOrEqual(6);

    const zoomHostile = clamps
      .map((match) => ({ full: match[0], preferred: match[1]!.split(",")[1]?.trim() ?? "" }))
      .filter(({ preferred }) => !preferred.includes("rem"))
      .map(({ full, preferred }) => `${full.split(":")[0]} — preferred value "${preferred}"`);

    expect(
      zoomHostile,
      `\nA pure-vw preferred value ignores browser zoom (WCAG 1.4.4):\n${zoomHostile.join("\n")}\n`,
    ).toEqual([]);
  });
});

describe("the display face is applied structurally", () => {
  it("declares both font roles", () => {
    expect(CSS).toContain("--font-display:");
    expect(CSS).toContain("--font-sans:");
  });

  it("sets headings in the display face without asking call sites to remember", () => {
    // Applied by element in @layer base. A per-component class would be
    // forgotten exactly once, and the resulting heading would look like a
    // deliberate exception rather than a mistake.
    expect(CSS).toMatch(/h1,\s*h2,\s*h3\s*\{\s*font-family:\s*var\(--font-display\)/);
  });
});
