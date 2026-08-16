import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  CONTRAST_FLOOR,
  check,
  compositeOver,
  contrastRatio,
  parseHex,
  relativeLuminance,
  type ContrastCheck,
} from "@/domain/design/contrast";
import { SURFACE_NAMES, parseSurfaceTokens, requiredTokenNames } from "@/domain/design/tokens";

/**
 * The contrast gate.
 *
 * This runs in `quality`, on every pull request, against the stylesheet that
 * actually ships. The axe scan is not replaced by it — axe catches *composed*
 * pairs nobody declared, this catches *declared* pairs before the branch is
 * pushed. Both, deliberately.
 *
 * Three reasons this exists rather than trusting axe alone:
 *
 *   1. axe runs late, in e2e, on three engines. A colour mistake costs a full
 *      cycle to discover.
 *   2. axe does not scan hover states. accent-on-muted has been sitting at
 *      4.72:1 in the footer, unseen, since v1.
 *   3. axe only sees pages it is pointed at, and the project detail route was
 *      not one of them.
 */

const CSS = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");
const TOKENS = parseSurfaceTokens(CSS);

/**
 * The historical failures, as fixtures.
 *
 * These four numbers are recorded in globals.css and in the v1 history. If a
 * change to the contrast module stops reproducing them, the module is wrong —
 * not the record. This is "break what it guards" applied to the tool that does
 * the guarding.
 */
describe("the calculator reproduces v1's recorded contrast failures", () => {
  it("reproduces the text-muted failure and its fix", () => {
    expect(contrastRatio("#64748B", "#F1F5F9")).toBeCloseTo(4.34, 2);
    expect(contrastRatio("#5B6A7D", "#F1F5F9")).toBeCloseTo(5.04, 2);
  });

  it("reproduces the accent-on-its-own-tint failure and its fix", () => {
    /*
     * bg-accent/10 composited over the page background — which is where the
     * "Current" badge actually sits. Over the muted band the same pair measures
     * 4.12, so getting the base wrong changes the answer: the composite is a
     * property of what is painted behind it, not of the token.
     */
    const tint = compositeOver("#2563EB", 0.1, "#F8FAFC");

    expect(tint).toBe("#e3ebfa");
    expect(contrastRatio("#2563EB", tint)).toBeCloseTo(4.31, 2);
    expect(contrastRatio("#1D4ED8", tint)).toBeCloseTo(5.59, 2);
  });

  it("rejects a colour it cannot parse rather than guessing", () => {
    expect(() => parseHex("#GGGGGG")).toThrow(/six-digit hex/);
    expect(() => parseHex("blue")).toThrow(/six-digit hex/);
    // A silent fallback here would measure a colour nobody is shipping.
  });

  it("computes the anchor luminances", () => {
    expect(relativeLuminance("#FFFFFF")).toBeCloseTo(1, 5);
    expect(relativeLuminance("#000000")).toBeCloseTo(0, 5);
    expect(contrastRatio("#FFFFFF", "#000000")).toBeCloseTo(21, 2);
  });
});

/**
 * The pairs that actually occur in the UI, per surface.
 *
 * Backgrounds a text token can land on, and the fills whose labels must remain
 * readable. Focus is the only non-text entry — see NON_TEXT_SCOPE in the
 * contrast module for why decorative borders are deliberately excluded.
 */
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
] as const;

const BACKGROUND_TOKENS = ["color-background", "color-surface", "color-surface-muted"] as const;

function pairsFor(surface: (typeof SURFACE_NAMES)[number]): ContrastCheck[] {
  const t = TOKENS[surface];
  const pairs: ContrastCheck[] = [];

  for (const fg of TEXT_TOKENS) {
    for (const bg of BACKGROUND_TOKENS) {
      pairs.push({
        label: `${surface}: ${fg} on ${bg}`,
        foreground: t[fg]!,
        background: t[bg]!,
        kind: "text",
      });
    }
  }

  pairs.push(
    {
      label: `${surface}: on-accent on accent`,
      foreground: t["color-on-accent"]!,
      background: t["color-accent"]!,
      kind: "text",
    },
    {
      label: `${surface}: on-accent-subtle on accent-subtle`,
      foreground: t["color-on-accent-subtle"]!,
      background: t["color-accent-subtle"]!,
      kind: "text",
    },
    {
      label: `${surface}: focus ring on background`,
      foreground: t["color-focus"]!,
      background: t["color-background"]!,
      kind: "non-text",
    },
    {
      label: `${surface}: focus ring on surface`,
      foreground: t["color-focus"]!,
      background: t["color-surface"]!,
      kind: "non-text",
    },
  );

  return pairs;
}

describe("every declared colour pair clears its floor", () => {
  for (const surface of SURFACE_NAMES) {
    it(`${surface} surface`, () => {
      const failures = pairsFor(surface)
        .map(check)
        .filter((result) => !result.passes)
        .map((r) => `${r.label} — ${r.ratio.toFixed(2)} (floor ${r.floor})`);

      // Report every failure at once. Fixing a palette one CI run at a time is
      // how a colour decision turns into an afternoon.
      expect(failures, `\n${failures.join("\n")}\n`).toEqual([]);
    });
  }
});

/**
 * Parity.
 *
 * A token missing from one surface silently keeps the light value there. That
 * is the same shape of failure as the tree-shaking bug that once removed seven
 * of fourteen tokens: nothing errors, the colour is simply wrong in one place.
 */
describe("the surfaces declare the same tokens", () => {
  it("every token is present in all three surfaces", () => {
    const required = requiredTokenNames(TOKENS);

    expect(required.length).toBeGreaterThan(10);

    for (const surface of SURFACE_NAMES) {
      const missing = required.filter((name) => TOKENS[surface][name] === undefined);
      expect(missing, `${surface} is missing: ${missing.join(", ")}`).toEqual([]);
    }
  });

  it("dark actually differs from light, rather than silently inheriting it", () => {
    // If the [data-surface="dark"] block failed to parse, every token would
    // fall back to the @theme value and this suite would pass while testing
    // nothing — the exact failure this project has hit twice.
    expect(TOKENS.dark["color-background"]).not.toBe(TOKENS.light["color-background"]);
    expect(TOKENS.dark["color-text-primary"]).not.toBe(TOKENS.light["color-text-primary"]);
    expect(TOKENS.dark["color-accent"]).not.toBe(TOKENS.light["color-accent"]);
  });
});

/**
 * The floor is stricter than WCAG on purpose, and that is worth asserting so it
 * cannot be quietly relaxed to make a future colour pass.
 */
describe("the floors are the intended ones", () => {
  it("keeps headroom above WCAG AA", () => {
    expect(CONTRAST_FLOOR.text).toBeGreaterThan(4.5);
    expect(CONTRAST_FLOOR.nonText).toBeGreaterThan(3.0);
  });

  it("would have caught the live footer pairing that WCAG allows", () => {
    // accent on the OLD muted surface: 4.72 — passes WCAG, fails this gate.
    const ratio = contrastRatio("#2563EB", "#F1F5F9");

    expect(ratio).toBeGreaterThan(4.5);
    expect(ratio).toBeLessThan(CONTRAST_FLOOR.text);
  });
});
