import { afterEach, describe, expect, it, vi } from "vitest";
import type { ProjectCaseStudy } from "@/domain/content/schemas";

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

/**
 * The Projects index and each Published case study preview as themselves (V3
 * plan 3.9). V3 shipped without either card, so a shared link to them previewed
 * with no image at all.
 */
describe("the Projects and case study cards", () => {
  // doMock outlives resetModules, and earlier tests in this file mocked content.
  // These read the real records unless a test mocks its own.
  afterEach(() => {
    vi.doUnmock("@/content/projects");
  });

  function useRealContent(): void {
    vi.resetModules();
    vi.doUnmock("@/content/profile");
    vi.doUnmock("@/content/modes");
    vi.doUnmock("@/content/projects");
  }

  it("names the Projects index by its heading", async () => {
    useRealContent();
    const { alt } = (await import("@/app/projects/opengraph-image")) as { alt: string };

    expect(alt).toBe("Randi Fajar Wicaksono — Projects");
  });

  it("shows the words the Projects index's link preview carries", async () => {
    useRealContent();
    const { projectsCardText } = await import("@/domain/metadata/social-card");
    const { buildProjectsIndexMetadata } = await import("@/domain/metadata/build-metadata");
    const metadata = buildProjectsIndexMetadata();
    const card = projectsCardText();

    expect(card.headline).toBe(metadata.title);
    expect(card.detail).toBe(metadata.description);
  });

  /**
   * The rule build-metadata.ts follows for a project's link preview, applied to
   * its image: the title and summary, never a field not meant for a preview.
   * The project passed in carries such fields; exact equality on the card's
   * text is what rules each of them out, in any position.
   */
  it("shows a case study's title and summary and nothing else (NFAC-SEC-006)", async () => {
    useRealContent();
    const { caseStudyCardText } = await import("@/domain/metadata/social-card");
    const project = {
      slug: "alpha-project",
      title: "Alpha Project",
      summary: "A public summary of the work.",
      confidentialityNote: "SENSITIVE NOTE THAT MUST NOT APPEAR ON THE CARD",
      role: "Backend Developer",
      context: "Internal context detail.",
    } as unknown as ProjectCaseStudy;

    expect(caseStudyCardText(project)).toEqual({
      kicker: "Randi Fajar Wicaksono · Case study",
      headline: "Alpha Project",
      detail: "A public summary of the work.",
    });
  });

  /**
   * The card route carries the page's own guard (FAC-NAV-006, DEC-047): a card
   * exists for each publicly eligible case study and for no other slug. The
   * registry is mocked rather than asking a selector which projects are hidden,
   * which would be circular.
   */
  describe("for each Published case study and no other slug (FAC-NAV-006)", () => {
    const base = {
      featured: true,
      updatedAt: "2026-01-01",
      summary: "Summary.",
      technologyIds: [],
    };

    async function loadCardRoute() {
      vi.resetModules();
      vi.doUnmock("@/content/profile");
      vi.doMock("@/content/projects", () => ({
        projects: [
          {
            ...base,
            id: "p-public",
            slug: "public-study",
            title: "Public Study",
            publicationStatus: "published",
            confidentialityClass: "public",
            featuredPriority: 1,
          },
          {
            ...base,
            id: "p-draft",
            slug: "draft-study",
            title: "Draft Study",
            publicationStatus: "draft",
            confidentialityClass: "public",
            featuredPriority: 2,
          },
          {
            ...base,
            id: "p-restricted",
            slug: "restricted-study",
            title: "Restricted Study",
            publicationStatus: "published",
            confidentialityClass: "restricted",
            featuredPriority: 3,
          },
        ],
      }));

      return (await import("@/app/projects/[slug]/opengraph-image")) as {
        dynamicParams: boolean;
        generateStaticParams: () => { slug: string }[];
        default: (props: { params: Promise<{ slug: string }> }) => Promise<Response>;
      };
    }

    it("generates a card only for the publicly eligible case study", async () => {
      const route = await loadCardRoute();

      expect(route.generateStaticParams()).toEqual([{ slug: "public-study" }]);
    });

    it("refuses every slug it did not generate, without rendering it", async () => {
      const route = await loadCardRoute();

      expect(route.dynamicParams).toBe(false);
    });

    // The default export is called only with slugs it must refuse, so it stops
    // before ImageResponse, which the header of this file keeps out of tests.
    it("never renders a hidden or unknown slug, even if asked directly", async () => {
      const route = await loadCardRoute();

      for (const slug of ["draft-study", "restricted-study", "never-registered"]) {
        await expect(route.default({ params: Promise.resolve({ slug }) }), slug).rejects.toThrow(
          "NEXT_HTTP_ERROR_FALLBACK;404",
        );
      }
    });
  });
});

/**
 * DEC-078. No card headline was bold (#123): the renderer's built-in font was
 * Geist Regular alone, registered as bold as well. The cards now bring Geist's
 * real Regular and Bold files. These read the files' own tables rather than
 * trusting their names, so a swapped or mislabelled file fails here.
 */
describe("the social cards draw Geist in its real Regular and Bold faces (DEC-078)", () => {
  /** A TrueType file's family and style names (name IDs 1, 2) and OS/2 weight class. */
  function inspectFont(data: Buffer) {
    const tables = new Map<string, number>();
    for (let index = 0; index < data.readUInt16BE(4); index++) {
      const record = 12 + index * 16;
      tables.set(data.toString("latin1", record, record + 4), data.readUInt32BE(record + 8));
    }

    const os2 = tables.get("OS/2");
    const name = tables.get("name");
    if (os2 === undefined || name === undefined) {
      throw new Error("not a TrueType file with OS/2 and name tables");
    }

    const names = new Map<number, string>();
    const storage = name + data.readUInt16BE(name + 4);
    for (let index = 0; index < data.readUInt16BE(name + 2); index++) {
      const record = name + 6 + index * 12;
      const platform = data.readUInt16BE(record);
      const id = data.readUInt16BE(record + 6);
      if ((id === 1 || id === 2) && platform === 3 && !names.has(id)) {
        const start = storage + data.readUInt16BE(record + 10);
        const bytes = Buffer.from(data.subarray(start, start + data.readUInt16BE(record + 8)));
        names.set(id, bytes.swap16().toString("utf16le"));
      }
    }

    return { family: names.get(1), style: names.get(2), weightClass: data.readUInt16BE(os2 + 4) };
  }

  it("ships each weight it registers, and each file is the weight it claims", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const { SOCIAL_CARD_FONT_DIRECTORY, SOCIAL_CARD_FONT_FILES } =
      await import("@/domain/metadata/social-card");

    expect(SOCIAL_CARD_FONT_FILES.map((font) => font.weight)).toEqual([400, 700]);

    for (const { file, weight } of SOCIAL_CARD_FONT_FILES) {
      const font = inspectFont(
        readFileSync(resolve(process.cwd(), SOCIAL_CARD_FONT_DIRECTORY, file)),
      );

      expect(font.family, file).toBe("Geist");
      expect(font.style, file).toBe(weight === 700 ? "Bold" : "Regular");
      expect(font.weightClass, file).toBe(weight);
    }
  });

  it("keeps the font licence beside the fonts", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const { SOCIAL_CARD_FONT_DIRECTORY } = await import("@/domain/metadata/social-card");

    const licence = readFileSync(
      resolve(process.cwd(), SOCIAL_CARD_FONT_DIRECTORY, "OFL.txt"),
      "utf8",
    );

    expect(licence).toContain("SIL Open Font License, Version 1.1");
    expect(licence).toContain("The Geist Project Authors");
  });

  it("renders with those fonts, not the renderer's default", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");

    const source = readFileSync(
      resolve(process.cwd(), "src/domain/metadata/social-card.tsx"),
      "utf8",
    );
    const marker = source.indexOf("export function renderSocialCard");
    expect(marker, "the renderer moved; point this guard at it").toBeGreaterThan(0);
    const renderer = source.slice(marker);

    expect(renderer).toContain('fontFamily: "Geist"');
    expect(renderer).toContain("fonts: socialCardFonts()");
    expect(renderer).not.toContain('"sans-serif"');
  });
});
