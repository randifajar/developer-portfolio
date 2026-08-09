import { describe, expect, it } from "vitest";
import { aiPractices } from "@/content/ai-practices";
import { contactChannels, externalProfiles } from "@/content/contact";
import { experience } from "@/content/experience";
import { mediaAssets } from "@/content/media";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { resume } from "@/content/resume";
import { siteConfig } from "@/content/site";
import { skills } from "@/content/skills";

/**
 * These modules parse at import, so simply loading this file proves every
 * record is structurally valid. The tests below cover what a schema cannot see
 * on its own — uniqueness, and the confidentiality invariants that make it safe
 * for this content to live in a public repository while still Draft.
 */

describe("content modules load", () => {
  it("imports every content type without throwing", () => {
    expect(siteConfig.name).toBeTruthy();
    expect(profile.id).toBeTruthy();
    expect(experience.length).toBeGreaterThan(0);
    expect(projects.length).toBeGreaterThan(0);
    expect(skills.length).toBeGreaterThan(0);
    expect(aiPractices.length).toBeGreaterThan(0);
    expect(resume.id).toBeTruthy();
    expect(contactChannels.length).toBeGreaterThan(0);
    expect(externalProfiles.length).toBeGreaterThan(0);
    expect(mediaAssets.length).toBeGreaterThan(0);
  });
});

describe("identifier uniqueness", () => {
  function expectUniqueIds(records: readonly { id: string }[], label: string) {
    const ids = records.map((record) => record.id);
    expect(new Set(ids).size, `${label} has duplicate ids`).toBe(ids.length);
  }

  it("has unique ids within each content type", () => {
    expectUniqueIds(experience, "experience");
    expectUniqueIds(projects, "projects");
    expectUniqueIds(skills, "skills");
    expectUniqueIds(aiPractices, "aiPractices");
    expectUniqueIds(contactChannels, "contactChannels");
    expectUniqueIds(externalProfiles, "externalProfiles");
    expectUniqueIds(mediaAssets, "mediaAssets");
  });

  it("has unique project slugs so route generation is unambiguous", () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has unique canonical skill names (FAC-SKILL-004)", () => {
    const names = skills.map((skill) => skill.name.toLowerCase());
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("launch projects are registered", () => {
  it("includes both confirmed launch case studies", () => {
    const slugs = projects.map((project) => project.slug);

    expect(slugs).toContain("personal-developer-portfolio");
    expect(slugs).toContain("jury-process-management-integration");
  });
});

describe("confidentiality invariants for a public repository", () => {
  /** Every string reachable from a record, flattened for scanning. */
  function collectStrings(value: unknown, out: string[] = []): string[] {
    if (typeof value === "string") {
      out.push(value);
    } else if (Array.isArray(value)) {
      for (const item of value) collectStrings(item, out);
    } else if (value && typeof value === "object") {
      for (const item of Object.values(value)) collectStrings(item, out);
    }
    return out;
  }

  const allContent = collectStrings([
    siteConfig,
    profile,
    experience,
    projects,
    skills,
    aiPractices,
    resume,
    contactChannels,
    externalProfiles,
    mediaAssets,
  ]).join("\n");

  it("contains no internal project or ticket identifier patterns", () => {
    // Uppercase-letters + underscore + digits is the shape of the internal
    // codes that had to be removed from the reference documents. Nothing of
    // that form may enter content (NFAC-SEC-002, TD 16.4).
    expect(allContent).not.toMatch(/\b[A-Z]{2,}_\d/);
  });

  it("contains no internal or private-network URLs", () => {
    expect(allContent).not.toMatch(
      /https?:\/\/(localhost|127\.0\.0\.1|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/,
    );
    expect(allContent).not.toMatch(/\.internal\b|\bintranet\b|\bvpn\./i);
  });

  it("uses only https for external destinations (NFAC-SEC-003)", () => {
    for (const externalProfile of externalProfiles) {
      expect(externalProfile.url.startsWith("https://")).toBe(true);
    }
    expect(siteConfig.linkedInUrl.startsWith("https://")).toBe(true);
    expect(siteConfig.gitHubUrl.startsWith("https://")).toBe(true);
  });

  it("never marks private or restricted content as published (FAC-PUBLISH-002)", () => {
    const classified = [...experience, ...projects, ...aiPractices, ...mediaAssets];

    for (const record of classified) {
      if (
        record.confidentialityClass === "private" ||
        record.confidentialityClass === "restricted"
      ) {
        expect(record.publicationStatus).not.toBe("published");
      }
    }
  });
});

describe("content state at launch", () => {
  it("publishes both launch case studies", () => {
    const published = projects.filter((project) => project.publicationStatus === "published");

    expect(published.map((project) => project.slug).sort()).toEqual([
      "jury-process-management-integration",
      "personal-developer-portfolio",
    ]);
  });

  /**
   * The professional case study describes work under an employer, published on
   * a public site with a public repository. These assert the properties that
   * make that safe, rather than assuming the review that approved it will be
   * repeated on every future edit.
   */
  it("keeps the professional case study sanitized and claim-free", () => {
    const jury = projects.find((project) => project.slug === "jury-process-management-integration");

    expect(jury?.confidentialityClass).toBe("sanitized");
    expect(jury?.confidentialityNote).toBeTruthy();

    // FAC-PROJECT-003: team work is stated separately, so nothing shared is
    // read as solely his.
    expect(jury?.teamResponsibilities?.length).toBeGreaterThan(0);

    // FAC-PROJECT-004: "production" would require verified confirmation, and
    // the evidence for this work does not support that claim.
    expect(jury?.deliveryStatus).not.toBe("production");
    expect(jury?.productionConfirmation).toBeUndefined();
  });

  it("claims no invented metric in the professional case study", () => {
    const jury = projects.find((project) => project.slug === "jury-process-management-integration");
    const prose = `${jury?.outcome} ${jury?.implementationSummary} ${jury?.testingAndVerification}`;

    // No percentage, and no "Nx" multiplier. A measured number would be fine;
    // none was measured, so none may appear.
    expect(prose).not.toMatch(/\d+\s*%/);
    expect(prose).not.toMatch(/\b\d+x\b/i);
  });

  it("publishes the profile now that Randi has written the headline and summary", () => {
    expect(profile.publicationStatus).toBe("published");
    expect(profile.headline).not.toMatch(/DRAFT\s+PLACEHOLDER/);
    expect(profile.summary).not.toMatch(/DRAFT\s+PLACEHOLDER/);
  });

  it("publishes only the confirmed contact decisions", () => {
    // DEC-014, DEC-015, DEC-016 are Confirmed, not placeholders, so these are
    // the one category that is legitimately Published before P30.
    for (const channel of contactChannels) {
      expect(channel.publicationStatus).toBe("published");
    }
    for (const externalProfile of externalProfiles) {
      expect(externalProfile.publicationStatus).toBe("published");
    }
  });

  it("satisfies the launch rule of at least two Published projects", () => {
    // This assertion was inverted for the whole of development. It is why
    // release validation failed, and flipping it is what let the site launch.
    const published = projects.filter((project) => project.publicationStatus === "published");

    expect(published.length).toBeGreaterThanOrEqual(2);
  });
});
