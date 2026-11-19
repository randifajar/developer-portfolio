import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * The social sharing card derives its text from content, not from literals.
 *
 * This file exists because the card claimed that and did not do it. The comment
 * in src/app/opengraph-image.tsx said it was "generated from the site
 * configuration ... so it cannot drift out of sync with the name and positioning
 * shown on the site itself" — and only the name was actually read. The
 * professional title and the location line were hardcoded strings, so the card
 * kept advertising the v1 positioning after the profile had moved on.
 *
 * Nothing caught it. The card renders to a PNG, so no assertion on page text
 * touches it, and the one string a test could reach — the `alt` export — carried
 * the same stale literal.
 *
 * So this asserts the property that was missing rather than the values that
 * happen to be current: change the profile, and the card changes with it.
 *
 * Only `alt` is imported. Calling the default export would invoke ImageResponse,
 * which needs the edge image runtime; `alt` is built from the same derivation,
 * so it fails whenever the derivation is bypassed.
 */

afterEach(() => {
  vi.resetModules();
});

const baseProfile = {
  id: "profile-a",
  fullName: "Randi Fajar Wicaksono",
  displayName: "Randi Fajar Wicaksono",
  headline: "A headline.",
  summary: "A summary.",
  location: "Yogyakarta, Indonesia",
  publicationStatus: "published",
  updatedAt: "2026-08-11",
};

async function loadAlt(profile: Record<string, unknown>): Promise<string> {
  vi.resetModules();
  vi.doMock("@/content/profile", () => ({ profile }));

  const loaded = (await import("@/app/opengraph-image")) as { alt: string };
  return loaded.alt;
}

describe("the social card text follows the profile", () => {
  it("uses the professional title the profile actually carries", async () => {
    const alt = await loadAlt({
      ...baseProfile,
      professionalTitle: "Distributed Systems Engineer",
    });

    expect(alt).toContain("Distributed Systems Engineer");
  });

  /**
   * The assertion above passes against a hardcoded card only if the literal
   * happens to match. This one cannot: it proves the old value is gone rather
   * than that the new value is present, which is the half that was missing.
   */
  it("does not keep a previous title once the profile changes", async () => {
    const alt = await loadAlt({ ...baseProfile, professionalTitle: "Backend Developer" });

    expect(alt).not.toMatch(/Full-Stack/i);
  });

  /**
   * A social card travels without the site around it, so an unpublished profile
   * means omit the claim — not substitute a fallback that no page is showing.
   */
  it("falls back to the name alone when no profile is publicly eligible", async () => {
    const alt = await loadAlt({
      ...baseProfile,
      professionalTitle: "Backend Developer",
      publicationStatus: "draft",
    });

    expect(alt).toBe("Randi Fajar Wicaksono");
    expect(alt).not.toMatch(/Backend Developer/);
  });
});

/**
 * The card's palette is read from globals.css, not copied into this file.
 *
 * This card has drifted once already: in v1 its title and location were
 * literals, so it kept advertising the old positioning after the profile had
 * changed. v1.1 fixed the text. The colours were the same problem waiting for
 * the same trigger — and v2 was exactly the release that would have pulled it,
 * because the site went dark while the card stayed light.
 *
 * Asserting specific hex values here would recreate the copy this change
 * removes. What is asserted instead is the relationship: whatever the dark
 * surface says, the card uses.
 */
describe("the social card palette follows the stylesheet", () => {
  it("uses the dark surface tokens rather than its own copy of them", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const { parseSurfaceTokens } = await import("@/domain/design/tokens");

    // The renderer moved to the shared card module in V3 P9; the guard moved
    // with it, so it still reads the code that paints the cards.
    const source = readFileSync(
      resolve(process.cwd(), "src/domain/metadata/social-card.tsx"),
      "utf8",
    );
    const { dark } = parseSurfaceTokens(
      readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8"),
    );

    // The renderer body must not contain a six-digit hex at all. Fallbacks in
    // cardPalette are permitted — they sit above the marker and only apply if
    // the token file cannot be parsed.
    const marker = source.indexOf("export function renderSocialCard");
    expect(marker, "the renderer moved; point this guard at it").toBeGreaterThan(0);
    const renderer = source.slice(marker);

    expect(renderer.match(/#[0-9a-fA-F]{6}/g) ?? [], "the renderer hardcodes a colour").toEqual([]);

    // And the values it will resolve to are the real dark surface: the V3
    // near-black since P3 (UX3 2), sky for the accent.
    expect(dark["color-background"]).toBe("#070b12");
    expect(dark["color-accent"]).toBe("#60a5fa");
  });
});

/**
 * The mode routes' cards (V3 P9) say what their page says: the intro's eyebrow
 * and heading. Without a published intro, a route falls back to the site card.
 */
describe("the mode cards follow their intros", () => {
  it("names the Backend page by its hero", async () => {
    vi.resetModules();
    const { alt } = (await import("@/app/(modes)/backend/opengraph-image")) as { alt: string };

    expect(alt).toBe("Randi Fajar Wicaksono · Backend — Behind the Application.");
  });

  it("falls back to the site card when the mode has no published intro", async () => {
    vi.resetModules();
    // doMock outlives resetModules: an earlier test in this file left a draft
    // profile registered. This one needs the real profile.
    vi.doUnmock("@/content/profile");
    vi.doMock("@/content/modes", () => ({ modeIntros: [] }));
    const { alt } = (await import("@/app/(modes)/infrastructure/opengraph-image")) as {
      alt: string;
    };

    expect(alt).toBe("Randi Fajar Wicaksono — Software Engineer · Backend & Infrastructure");
  });
});
