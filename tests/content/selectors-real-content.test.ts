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
 * These assert what the live site actually exposes. They are written to fail
 * whenever publication state changes, so going from "not public" to "public"
 * is always a reviewed diff rather than something that happens quietly. Every
 * content record has now made that transition, and each one broke these tests
 * on the way through — which was the point.
 *
 * Current state: launch-ready. Both case studies, the profile, all three roles,
 * skills, AI practices, and the resume are Published. isPubliclyLaunchReady()
 * returns true, so indexing is enabled.
 */
describe("both launch case studies are public", () => {
  it("exposes them in the approved order", () => {
    // featuredPriority decides: the portfolio case study is 1, the
    // professional one 2 (FAC-PROJECTS-003).
    expect(getPublishedProjects().map((project) => project.slug)).toEqual([
      "personal-developer-portfolio",
      "jury-process-management-integration",
    ]);
  });

  it("features both, so the homepage renders two balanced cards (FAC-HOME-004)", () => {
    expect(getFeaturedProjects().map((project) => project.slug)).toEqual([
      "personal-developer-portfolio",
      "jury-process-management-integration",
    ]);
  });

  it("resolves both slugs", () => {
    expect(getPublishedProjectBySlug("personal-developer-portfolio")?.title).toBe(
      "Personal Developer Portfolio",
    );
    expect(getPublishedProjectBySlug("jury-process-management-integration")?.title).toBe(
      "Jury Process Management Integration",
    );
  });

  /**
   * Adjacency has a real subject for the first time. Until now one project was
   * public, so both neighbours were null and the code path was never taken.
   */
  it("links each case study to the other, and nowhere else", () => {
    const first = getAdjacentPublishedProjects("personal-developer-portfolio");
    const second = getAdjacentPublishedProjects("jury-process-management-integration");

    expect(first.previous).toBeNull();
    expect(first.next?.slug).toBe("jury-process-management-integration");

    expect(second.previous?.slug).toBe("personal-developer-portfolio");
    expect(second.next).toBeNull();
  });

  it("resolves an unknown slug to null", () => {
    expect(getPublishedProjectBySlug("no-such-project-exists")).toBeNull();
  });
});

/**
 * The professional case study is public now, so the guarantee it needs has
 * changed from "must be invisible" to "must be safe to see".
 *
 * These are the properties that made publishing it acceptable, asserted at the
 * selector layer so a later content edit cannot quietly drop one.
 */
describe("the professional case study is published safely", () => {
  const jury = () => getPublishedProjectBySlug("jury-process-management-integration");

  it("is classified sanitized and carries its confidentiality note", () => {
    expect(jury()?.confidentialityClass).toBe("sanitized");
    expect(jury()?.confidentialityNote).toBeTruthy();
  });

  it("separates team work from Randi's own (FAC-PROJECT-003)", () => {
    expect(jury()?.personalResponsibilities.length).toBeGreaterThan(0);
    expect(jury()?.teamResponsibilities?.length).toBeGreaterThan(0);
  });

  it("does not claim production without verified confirmation (FAC-PROJECT-004)", () => {
    expect(jury()?.deliveryStatus).toBe("completed");
    expect(jury()?.productionConfirmation).toBeUndefined();
  });

  it("names no internal identifier, system, or URL (NFAC-SEC-002)", () => {
    const record = JSON.stringify(jury());

    expect(record).not.toMatch(/\b[A-Z]{2,}_\d/);
    expect(record).not.toMatch(/https?:\/\/(localhost|127\.0\.0\.1|10\.|192\.168\.)/);
    expect(record).not.toMatch(/\.internal\b|\bintranet\b|\bvpn\./i);
  });
});

describe("the professional identity is public", () => {
  it("exposes the profile, so the Hero renders", () => {
    expect(getPublishedProfile()?.fullName).toBe("Randi Fajar Wicaksono");
  });

  it("carries a headline and summary with no draft marker left", () => {
    const published = getPublishedProfile();

    expect(published?.headline).toBeTruthy();
    expect(published?.summary).toBeTruthy();
    expect(`${published?.headline} ${published?.summary}`).not.toMatch(/DRAFT\s+PLACEHOLDER/);
  });

  it("contributes half of the launch rule (DEC-030)", () => {
    // A Published profile is one of the two conditions. The other is two
    // Published projects, asserted in its own block below.
    expect(getPublishedProfile()).not.toBeNull();
  });
});

describe("employment history and resume are public", () => {
  it("exposes all three roles, current first (FAC-EXP-001)", () => {
    const roles = getPublishedExperience();

    expect(roles).toHaveLength(3);
    expect(roles[0]?.isCurrent).toBe(true);
  });

  it("gives every non-current role an end date that does not precede its start", () => {
    for (const role of getPublishedExperience()) {
      if (role.isCurrent) {
        expect(role.endDate, role.id).toBeUndefined();
        continue;
      }

      expect(role.endDate, role.id).toBeDefined();
      expect(role.endDate! >= role.startDate, role.id).toBe(true);
    }
  });

  it("exposes exactly one active resume, at the stable public path", () => {
    // FAC-RESUME-004. Every Resume action across the site points at this one
    // path, so a second active record would make which file loads ambiguous.
    expect(getActiveResume()?.publicPath).toBe("/resume.pdf");
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

describe("the site is launch-ready, so indexing is enabled", () => {
  /**
   * The switch that lifts noindex and lets robots.txt allow crawling. It is
   * derived from content rather than set by hand, so nobody had to remember to
   * enable indexing at launch and nobody could enable it early.
   *
   * Both halves of DEC-030 are asserted, because either one silently breaking
   * would leave the site either invisible or indexed while incomplete.
   */
  it("reports launch-ready with a Published profile and two Published projects", () => {
    expect(getPublishedProfile()).not.toBeNull();
    expect(getPublishedProjects().length).toBeGreaterThanOrEqual(2);
    expect(isPubliclyLaunchReady()).toBe(true);
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
