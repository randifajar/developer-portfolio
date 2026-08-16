/**
 * Colour contrast, computed rather than eyeballed.
 *
 * This module exists because contrast has failed twice in this project, both
 * times on a same-hue pairing, both times within 4% of passing, and both times
 * caught by the axe scan rather than by review:
 *
 *   --color-text-muted #64748B on #F1F5F9   4.34:1   (fixed to #5B6A7D, 5.04)
 *   accent on a 10% tint of itself          4.31:1   (fixed to accent-hover, 5.59)
 *
 * Those four numbers are the fixtures in tests/design/contrast.test.ts. If a
 * change to this file stops reproducing them, the file is wrong — not the
 * historical record.
 *
 * The axe scan stays. It catches *composed* pairs nobody thought to declare;
 * this catches *declared* pairs before the branch is even pushed. The scan runs
 * late, in e2e, on three engines, and it does not scan hover states at all —
 * which is how accent-on-muted has been sitting at 4.72 in the footer unnoticed.
 *
 * Implements WCAG 2.x relative luminance and contrast ratio exactly as
 * specified. No dependencies: the arithmetic is short and a dependency here
 * would be a supply-chain surface for twelve lines of maths.
 */

/** A colour as a six-digit hex string, with or without the leading `#`. */
export type HexColor = string;

const HEX_PATTERN = /^#?[0-9a-fA-F]{6}$/;

/**
 * Parse `#RRGGBB` into 0–255 channels.
 *
 * Throws rather than returning a fallback: a silently mis-parsed colour would
 * produce a plausible ratio for a colour nobody is actually shipping, which is
 * precisely the class of failure this module exists to prevent.
 */
export function parseHex(color: HexColor): readonly [number, number, number] {
  if (!HEX_PATTERN.test(color)) {
    throw new Error(`Not a six-digit hex colour: ${JSON.stringify(color)}`);
  }

  const hex = color.startsWith("#") ? color.slice(1) : color;

  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ] as const;
}

/** Linearise one 0–255 sRGB channel (WCAG 2.x). */
function linearise(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** Relative luminance, 0 (black) to 1 (white). */
export function relativeLuminance(color: HexColor): number {
  const [r, g, b] = parseHex(color);
  return 0.2126 * linearise(r) + 0.7152 * linearise(g) + 0.0722 * linearise(b);
}

/**
 * Contrast ratio between two colours, 1:1 to 21:1.
 *
 * Order-independent: the specification divides lighter by darker, so callers do
 * not have to know which is which.
 */
export function contrastRatio(a: HexColor, b: HexColor): number {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (lighter! + 0.05) / (darker! + 0.05);
}

/**
 * Composite a translucent foreground over an opaque background.
 *
 * Needed because `bg-accent/10` compiles to `color-mix(… transparent)`, which
 * has no fixed colour of its own — it is whatever is painted behind it. That is
 * exactly why the second historical failure was invisible: there was no pair to
 * measure until the composite was worked out.
 *
 * v2 replaces those modifiers with solid tokens, so this is mainly here to
 * measure the remaining deliberate exceptions, such as a scrim.
 */
export function compositeOver(foreground: HexColor, alpha: number, background: HexColor): HexColor {
  if (alpha < 0 || alpha > 1) {
    throw new Error(`Alpha must be between 0 and 1, received ${alpha}`);
  }

  const fg = parseHex(foreground);
  const bg = parseHex(background);

  const channel = (index: 0 | 1 | 2): string =>
    Math.round(fg[index] * alpha + bg[index] * (1 - alpha))
      .toString(16)
      .padStart(2, "0");

  return `#${channel(0)}${channel(1)}${channel(2)}`;
}

/**
 * Thresholds.
 *
 * `text` is 4.8 rather than WCAG's 4.5. Both historical failures were within 4%
 * of passing, and a value that only just clears 4.5 fails again after any hue
 * nudge. The headroom is the point.
 *
 * `nonText` is WCAG's 3.0 plus the same margin. It applies ONLY to focus
 * indicators and to borders that identify a control — see NON_TEXT_SCOPE.
 */
export const CONTRAST_FLOOR = {
  text: 4.8,
  nonText: 3.3,
} as const;

/**
 * What the non-text floor covers, written down because the obvious reading is
 * wrong and cost an hour to establish.
 *
 * WCAG 1.4.11 covers "visual information required to identify user interface
 * components and states". A decorative card outline and a badge's tint fill are
 * neither: the badge's *label* carries the meaning, and it is measured as text.
 *
 * Applying the floor to every border flagged nine pairs in the v2 palette, all
 * nine false, and satisfying them would have forced visibly heavier borders to
 * meet a rule that does not apply. That is v1's own lesson — a quality
 * threshold encodes a judgement, and the judgement can be wrong — caught this
 * time before it shipped rather than after.
 */
export const NON_TEXT_SCOPE = [
  "focus indicators",
  "borders that identify an interactive control",
] as const;

export interface ContrastCheck {
  readonly label: string;
  readonly foreground: HexColor;
  readonly background: HexColor;
  readonly kind: "text" | "non-text";
}

export interface ContrastResult extends ContrastCheck {
  readonly ratio: number;
  readonly floor: number;
  readonly passes: boolean;
}

/** Measure one pair against the floor for its kind. */
export function check(pair: ContrastCheck): ContrastResult {
  const ratio = contrastRatio(pair.foreground, pair.background);
  const floor = pair.kind === "text" ? CONTRAST_FLOOR.text : CONTRAST_FLOOR.nonText;

  return { ...pair, ratio, floor, passes: ratio >= floor };
}

/** Measure many, preserving input order so output is diffable. */
export function checkAll(pairs: readonly ContrastCheck[]): readonly ContrastResult[] {
  return pairs.map(check);
}
