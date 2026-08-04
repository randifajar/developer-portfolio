import { describe, expect, it } from "vitest";
import { aiPractices } from "@/content/ai-practices";
import { contactChannels, externalProfiles } from "@/content/contact";
import { experience } from "@/content/experience";
import { mediaAssets } from "@/content/media";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { resume } from "@/content/resume";
import { skills } from "@/content/skills";
import { validateRelease } from "@/domain/content/release-validation";
import type { ContentSet } from "@/domain/content/validation";

const SITE_URL = "https://example.com";

/**
 * A default parameter would treat an explicitly passed `undefined` as "not
 * provided" and silently substitute SITE_URL, which is exactly the case the
 * missing-SITE_URL test needs to exercise. Taking the options object whole
 * keeps "absent" and "explicitly undefined" distinguishable.
 */
function rulesFor(
  content: ContentSet,
  options: { siteUrl?: string | undefined } = { siteUrl: SITE_URL },
): string[] {
  return [...new Set(validateRelease(content, options).map((issue) => issue.rule))];
}

/** The real content set, exactly as it ships today. */
function draftContent(): ContentSet {
  return {
    profile,
    experience,
    projects,
    skills,
    aiPractices,
    resumes: [resume],
    contactChannels,
    externalProfiles,
    mediaAssets,
  };
}

/**
 * A content set representing a completed launch: everything Published, every
 * placeholder replaced. This proves the gate is satisfiable rather than
 * permanently red, which is the only way the failing assertions below mean
 * anything.
 */
function releaseReadyContent(): ContentSet {
  const publish = { publicationStatus: "published" as const };

  const cleanProject = (project: (typeof projects)[number], priority: number) => ({
    ...project,
    ...publish,
    featured: true,
    featuredPriority: priority,
    summary: "A truthful public summary of real delivered work.",
    role: "Backend Developer",
    period: "2025",
    context: "Real system and user context.",
    problem: "The real problem that was solved.",
    personalResponsibilities: ["Implemented the integration layer."],
    teamResponsibilities: ["QA verified the release."],
    technicalApproach: "The real high-level solution.",
    workflowOrArchitecture: "A sanitized description of the workflow.",
    challenges: [{ title: "A real challenge", description: "Why it mattered." }],
    decisionsAndTradeoffs: [
      { decision: "Chose an approach", rationale: "For these reasons", tradeoff: "Gave this up" },
    ],
    implementationSummary: "What was implemented, and what was not.",
    testingAndVerification: "How it was verified before release.",
    outcome: "The verified, observable result.",
    aiUsage: "How AI assisted and how the output was reviewed.",
    lessonsLearned: "What was learned and what would change.",
  });

  return {
    profile: {
      ...profile,
      ...publish,
      headline: "Backend engineering, integrations, and AI-assisted delivery.",
      summary: "A real professional summary describing genuine experience and direction.",
    },
    experience: experience.map((role) => ({
      ...role,
      ...publish,
      companyName: "A Real Employer",
      position: "Backend Developer",
      summary: "A truthful role overview.",
      responsibilities: ["Built and maintained backend services."],
    })),
    projects: [cleanProject(projects[0]!, 1), cleanProject(projects[1]!, 2)],
    skills: skills.map((skill) => ({ ...skill, ...publish })),
    aiPractices: aiPractices.map((practice) => ({
      ...practice,
      ...publish,
      humanResponsibility: "Randi reviews every change and owns the final decision.",
      verificationMethod: "Lint, type check, tests, and a production build must pass.",
      correctedAssumption: undefined,
    })),
    resumes: [{ ...resume, ...publish, isActive: true, version: "2026.08" }],
    contactChannels,
    externalProfiles,
    mediaAssets: mediaAssets.map((asset) => ({
      ...asset,
      ...publish,
      altText: "A real, descriptive alternative text.",
    })),
  };
}

/**
 * The central assertion of this phase.
 *
 * Release validation is the only thing standing between Draft placeholders and
 * a recruiter. If it ever passes on the current content, the safety property
 * that makes Draft-based development acceptable has been lost.
 */
describe("release validation refuses the current Draft content", () => {
  it("fails", () => {
    expect(validateRelease(draftContent(), { siteUrl: SITE_URL }).length).toBeGreaterThan(0);
  });

  it("reports that fewer than two projects are Published (FAC-HOME-004)", () => {
    expect(rulesFor(draftContent())).toContain("minimum-published-projects");
  });

  it("reports both required launch case studies as unpublished", () => {
    expect(rulesFor(draftContent())).toContain("required-launch-projects");
  });

  it("reports no active Published Resume (FAC-RESUME-001)", () => {
    expect(rulesFor(draftContent())).toContain("exactly-one-active-resume");
  });

  it("reports the Professional Profile as unpublished (FAC-PROFILE-001)", () => {
    expect(rulesFor(draftContent())).toContain("published-profile-required");
  });
});

describe("release validation accepts complete content", () => {
  it("passes on a fully published, placeholder-free content set", () => {
    const issues = validateRelease(releaseReadyContent(), { siteUrl: SITE_URL });

    // Surface the actual issues on failure — a bare length check would make a
    // regression here painful to diagnose.
    expect(issues.map((issue) => `${issue.rule}: ${issue.message}`)).toEqual([]);
  });
});

describe("rule: no published placeholders (NFAC-CONTENT-004)", () => {
  const markers = ["TODO", "TBD", "Lorem ipsum", "FIXME", "XXX", "DRAFT PLACEHOLDER"];

  for (const marker of markers) {
    it(`rejects "${marker}" in a Published project`, () => {
      const content = releaseReadyContent();
      const [first, second] = content.projects;
      const poisoned = { ...first!, outcome: `The result was ${marker} good.` };

      expect(rulesFor({ ...content, projects: [poisoned, second!] })).toContain(
        "no-published-placeholders",
      );
    });
  }

  it("finds placeholders nested inside challenge objects, not just top-level fields", () => {
    const content = releaseReadyContent();
    const [first, second] = content.projects;
    const poisoned = {
      ...first!,
      challenges: [{ title: "A challenge", description: "TODO: write this up." }],
    };

    expect(rulesFor({ ...content, projects: [poisoned, second!] })).toContain(
      "no-published-placeholders",
    );
  });

  it("ignores placeholders inside Draft records, which never reach the public site", () => {
    const content = releaseReadyContent();
    const [first, second] = content.projects;
    const draftWithPlaceholder = {
      ...first!,
      publicationStatus: "draft" as const,
      featured: false,
      outcome: "TODO: pending",
    };

    const rules = rulesFor({
      ...content,
      // Keep two Published projects so only the placeholder rule is in question.
      projects: [
        second!,
        { ...second!, id: "project-third", slug: "third", featuredPriority: 3 },
        draftWithPlaceholder,
      ],
    });

    expect(rules).not.toContain("no-published-placeholders");
  });
});

describe("rule: site url (TD 12.2)", () => {
  it("rejects a missing SITE_URL", () => {
    expect(rulesFor(releaseReadyContent(), {})).toContain("site-url-required");
  });

  it("rejects a non-https SITE_URL", () => {
    expect(rulesFor(releaseReadyContent(), { siteUrl: "http://example.com" })).toContain(
      "site-url-required",
    );
  });

  it("rejects a blank SITE_URL", () => {
    expect(rulesFor(releaseReadyContent(), { siteUrl: "   " })).toContain("site-url-required");
  });
});

describe("rule: required public links", () => {
  it("rejects a missing LinkedIn profile (FAC-CONTACT-003)", () => {
    const content = releaseReadyContent();
    const withoutLinkedIn = content.externalProfiles.filter(
      (candidate) => candidate.platform !== "linkedin",
    );

    expect(rulesFor({ ...content, externalProfiles: withoutLinkedIn })).toContain(
      "required-public-links",
    );
  });

  it("rejects a missing GitHub profile (FAC-CONTACT-004)", () => {
    const content = releaseReadyContent();
    const withoutGitHub = content.externalProfiles.filter(
      (candidate) => candidate.platform !== "github",
    );

    expect(rulesFor({ ...content, externalProfiles: withoutGitHub })).toContain(
      "required-public-links",
    );
  });

  it("rejects a missing email channel (FAC-CONTACT-001)", () => {
    expect(rulesFor({ ...releaseReadyContent(), contactChannels: [] })).toContain(
      "required-public-links",
    );
  });
});

describe("rule: required social metadata (NFAC-SEO-004)", () => {
  it("rejects a content set with no Published social sharing image", () => {
    const content = releaseReadyContent();
    const withoutSocial = content.mediaAssets.filter(
      (asset) => asset.type !== "social-sharing-image",
    );

    expect(rulesFor({ ...content, mediaAssets: withoutSocial })).toContain(
      "required-social-metadata",
    );
  });
});

describe("release validation still enforces every structural rule", () => {
  it("reports a duplicate slug at release too", () => {
    const content = releaseReadyContent();
    const [first] = content.projects;

    expect(
      rulesFor({ ...content, projects: [first!, { ...first!, id: "project-other" }] }),
    ).toContain("unique-slugs");
  });
});
