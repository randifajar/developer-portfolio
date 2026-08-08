import { describe, expect, it } from "vitest";
import {
  getActiveResume,
  getAdjacentPublishedProjects,
  getFeaturedProjects,
  getPublishedAIPractices,
  getPublishedContactChannels,
  getPublishedExperience,
  getPublishedExternalProfiles,
  getPublishedProfile,
  getPublishedProjectBySlug,
  getPublishedProjects,
  getPublishedSkillGroups,
  isPubliclyLaunchReady,
} from "@/domain/content/selectors";

/**
 * Selectors against the real, unmocked content modules.
 *
 * These assert what the live site actually exposes right now. They are meant
 * to fail whenever publication state changes, so that going from "not public"
 * to "public" is always a reviewed diff rather than something that happens
 * quietly.
 *
 * Current state: the Personal Developer Portfolio case study is Published.
 * Everything else remains Draft pending Randi's content.
 */
describe("exactly one project is public", () => {
  it("exposes the Personal Developer Portfolio case study", () => {
    const slugs = getPublishedProjects().map((project) => project.slug);

    expect(slugs).toEqual(["personal-developer-portfolio"]);
  });

  it("features it on the homepage", () => {
    expect(getFeaturedProjects().map((project) => project.slug)).toEqual([
      "personal-developer-portfolio",
    ]);
  });

  it("resolves its slug", () => {
    expect(getPublishedProjectBySlug("personal-developer-portfolio")?.title).toBe(
      "Personal Developer Portfolio",
    );
  });

  it("offers no adjacent neighbours while it is the only public project", () => {
    const { previous, next } = getAdjacentPublishedProjects("personal-developer-portfolio");

    // Critically, `next` must not be the Draft professional case study.
    expect(previous).toBeNull();
    expect(next).toBeNull();
  });
});

/**
 * The confidentiality-critical assertion in this file.
 *
 * The Jury Process Management case study describes professional work and is
 * still Draft placeholder text. It must stay invisible until Randi has written
 * and reviewed it. If this ever passes, unreviewed content about an employer
 * has reached the public site.
 */
describe("the professional case study remains invisible", () => {
  it("does not appear in the published project list", () => {
    const slugs = getPublishedProjects().map((project) => project.slug);

    expect(slugs).not.toContain("jury-process-management-integration");
  });

  it("resolves to null, identically to an unknown slug", () => {
    expect(getPublishedProjectBySlug("jury-process-management-integration")).toBe(
      getPublishedProjectBySlug("no-such-project-exists"),
    );
  });
});

describe("remaining content is still Draft", () => {
  it("exposes no profile, so the Hero does not render", () => {
    expect(getPublishedProfile()).toBeNull();
  });

  it("exposes no experience", () => {
    expect(getPublishedExperience()).toEqual([]);
  });

  it("exposes no active resume, so Resume actions render their unavailable state", () => {
    expect(getActiveResume()).toBeNull();
  });
});

/**
 * Skills and AI practices went public on 2026-08-08, when Randi confirmed the
 * classifications and the workflow wording. Neither required new copy — the
 * review was what was missing, not the content.
 */
describe("skills and AI practices are public", () => {
  it("exposes every skill, grouped", () => {
    const groups = getPublishedSkillGroups();

    expect(groups.length).toBeGreaterThan(0);
    expect(groups.flatMap((group) => group.skills)).toHaveLength(12);
  });

  it("omits no group it returns", () => {
    // FAC-HOME-005: an announced-but-empty group is worse than an absent one.
    for (const group of getPublishedSkillGroups()) {
      expect(group.skills.length).toBeGreaterThan(0);
    }
  });

  it("exposes the four workflow steps in order", () => {
    expect(getPublishedAIPractices().map((practice) => practice.sortOrder)).toEqual([1, 2, 3, 4]);
  });

  /**
   * FAC-AI-002. The schema makes these required, so this guards the stronger
   * claim: that no published practice leaves either one blank or unreviewed.
   */
  it("gives every practice a human responsibility and a verification method", () => {
    for (const practice of getPublishedAIPractices()) {
      expect(practice.humanResponsibility.trim().length, practice.id).toBeGreaterThan(0);
      expect(practice.verificationMethod.trim().length, practice.id).toBeGreaterThan(0);
      expect(practice.humanResponsibility, practice.id).not.toMatch(/DRAFT\s+PLACEHOLDER/);
      expect(practice.verificationMethod, practice.id).not.toMatch(/DRAFT\s+PLACEHOLDER/);
    }
  });
});

describe("the site is not yet launch-ready, so indexing stays disabled", () => {
  it("reports not launch-ready with only one published project", () => {
    // DEC-030 requires a Published profile and at least two Published
    // projects. Until both hold, robots.txt disallows and pages carry noindex.
    expect(isPubliclyLaunchReady()).toBe(false);
  });
});

describe("confirmed contact decisions are already public", () => {
  // DEC-014, DEC-015, DEC-016 are Confirmed rather than placeholders.
  it("exposes the email channel", () => {
    expect(getPublishedContactChannels()).toHaveLength(1);
  });

  it("exposes both external profiles with https urls", () => {
    const profiles = getPublishedExternalProfiles();

    expect(profiles.map((entry) => entry.platform).sort()).toEqual(["github", "linkedin"]);
    for (const entry of profiles) {
      expect(entry.url.startsWith("https://")).toBe(true);
    }
  });
});
