import { describe, expect, it } from "vitest";
import {
  getActiveResume,
  getFeaturedProjects,
  getPublishedAIPractices,
  getPublishedContactChannels,
  getPublishedExperience,
  getPublishedExternalProfiles,
  getPublishedProfile,
  getPublishedProjectBySlug,
  getPublishedProjects,
  getPublishedSkillGroups,
} from "@/domain/content/selectors";

/**
 * Selectors against the real, unmocked content modules.
 *
 * Everything substantive is Draft today, so these assert the current truthful
 * state: the public site would render empty. That is correct until P30 and is
 * exactly what release validation reports as launch-blocking.
 *
 * These will need updating when Randi publishes real content — deliberately.
 * A change from "nothing is public" to "content is public" should be a visible,
 * reviewed diff rather than something that happens silently.
 */
describe("real content is not yet publicly visible", () => {
  it("exposes no projects", () => {
    expect(getPublishedProjects()).toEqual([]);
  });

  it("exposes no featured projects, so the homepage shows no cards", () => {
    expect(getFeaturedProjects()).toEqual([]);
  });

  it("exposes no profile", () => {
    expect(getPublishedProfile()).toBeNull();
  });

  it("exposes no experience", () => {
    expect(getPublishedExperience()).toEqual([]);
  });

  it("exposes no skill groups", () => {
    expect(getPublishedSkillGroups()).toEqual([]);
  });

  it("exposes no AI practices", () => {
    expect(getPublishedAIPractices()).toEqual([]);
  });

  it("exposes no active resume, so Resume actions render their unavailable state", () => {
    expect(getActiveResume()).toBeNull();
  });

  it("resolves both real launch slugs to null while they are Draft", () => {
    expect(getPublishedProjectBySlug("personal-developer-portfolio")).toBeNull();
    expect(getPublishedProjectBySlug("jury-process-management-integration")).toBeNull();
  });
});

describe("confirmed contact decisions are already public", () => {
  // DEC-014, DEC-015, DEC-016 are Confirmed rather than placeholders, so these
  // are the one category legitimately Published before content finalization.
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
