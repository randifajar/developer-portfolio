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

  /**
   * Satisfied on 2026-08-08. Still asserted against a forced-Draft copy, for
   * the same reason as the profile rule below: a rule that stops firing
   * because the condition was met is indistinguishable from a rule that
   * stopped firing because it broke.
   *
   * The two-active case is asserted too. FAC-RESUME-004 allows exactly one,
   * and "at least one" is the easy mistake to make when the rule is rewritten.
   */
  it("reports a missing or duplicated active Published Resume (FAC-RESUME-001)", () => {
    const base = draftContent();
    const [activeResume] = base.resumes;

    const withDraftResume = {
      ...base,
      resumes: [{ ...activeResume!, publicationStatus: "draft" as const }],
    };
    const withTwoActive = {
      ...base,
      resumes: [activeResume!, { ...activeResume!, id: "resume-second" }],
    };

    expect(rulesFor(withDraftResume)).toContain("exactly-one-active-resume");
    expect(rulesFor(withTwoActive)).toContain("exactly-one-active-resume");
    expect(rulesFor(base)).not.toContain("exactly-one-active-resume");
  });

  /**
   * The Professional Profile was published on 2026-08-08, so this rule no
   * longer fires against real content. It is still asserted — against a set
   * where the profile is forced back to Draft — because the rule going quiet
   * for the right reason and the rule going quiet because it broke look
   * identical from the outside.
   */
  it("reports an unpublished Professional Profile (FAC-PROFILE-001)", () => {
    const withDraftProfile = {
      ...draftContent(),
      profile: { ...draftContent().profile, publicationStatus: "draft" as const },
    };

    expect(rulesFor(withDraftProfile)).toContain("published-profile-required");
    expect(rulesFor(draftContent())).not.toContain("published-profile-required");
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

/**
 * Prose about placeholders is not a placeholder.
 *
 * The scan originally matched case-insensitively and rejected the Personal
 * Developer Portfolio case study, whose text explains that development ran
 * against placeholder content behind a stricter release gate. That is an
 * accurate description of this project's architecture, and deleting it to
 * satisfy the checker would have been the wrong repair.
 */
describe("placeholder scan distinguishes markers from prose", () => {
  function withOutcome(text: string): ContentSet {
    const content = releaseReadyContent();
    const [first, second] = content.projects;
    return { ...content, projects: [{ ...first!, outcome: text }, second!] };
  }

  const legitimateProse = [
    "Development ran against placeholder content behind a stricter release gate.",
    "A separate validation refuses to launch while any placeholder remains.",
    "The build used structurally valid Draft placeholders throughout.",
    "Each todo was tracked in the plan rather than in the code.",
  ];

  for (const text of legitimateProse) {
    it(`accepts prose: "${text.slice(0, 45)}..."`, () => {
      expect(rulesFor(withOutcome(text))).not.toContain("no-published-placeholders");
    });
  }

  const realMarkers = [
    "DRAFT PLACEHOLDER: outcome pending.",
    "PLACEHOLDER",
    "TODO: write the outcome.",
    "TBD",
    "FIXME before launch.",
    "XXX revisit this.",
    "Lorem ipsum dolor sit amet.",
  ];

  for (const text of realMarkers) {
    it(`rejects marker: "${text.slice(0, 45)}"`, () => {
      expect(rulesFor(withOutcome(text))).toContain("no-published-placeholders");
    });
  }

  it("still rejects lowercase lorem ipsum, which is never legitimate prose", () => {
    expect(rulesFor(withOutcome("lorem ipsum dolor"))).toContain("no-published-placeholders");
  });

  /**
   * Bracketed editorial notes.
   *
   * These escaped every rule above until 2026-08-08. The content brief given
   * to an external assistant asked it to emit "[NEED FROM RANDI: ...]" for any
   * fact it could not verify; thirty came back and none would have been
   * caught. The convention meant to make unverified content visible was itself
   * invisible to the gate.
   */
  const bracketedNotes = [
    "[NEED FROM RANDI: what was the verified outcome?]",
    "[needs from randi: the exact date]",
    "[placeholder]",
    "[to be written]",
    "[to be confirmed with the team]",
    "[pending the final numbers]",
    "[Fill in once QA signs off]",
  ];

  for (const text of bracketedNotes) {
    it(`rejects bracketed note: "${text.slice(0, 45)}"`, () => {
      expect(rulesFor(withOutcome(`The result was good. ${text}`))).toContain(
        "no-published-placeholders",
      );
    });
  }

  /**
   * The false-positive risk. Long-form fields are Markdown and use links, so a
   * rule that matched any square brackets would reject correct content — the
   * failure mode that made the all-caps markers case-sensitive in the first
   * place.
   */
  const legitimateBrackets = [
    "I used [Node.js](https://nodejs.org) and [GraphQL](https://graphql.org) throughout.",
    "See [the release checklist](docs/release-checklist.md) for the full gate.",
    "The pipeline returns an array such as [1, 2, 3] for each grouped result.",
    "Aggregation stages are configured as [match, group, sort] in that order.",
  ];

  for (const text of legitimateBrackets) {
    it(`accepts brackets in prose: "${text.slice(0, 45)}..."`, () => {
      expect(rulesFor(withOutcome(text))).not.toContain("no-published-placeholders");
    });
  }
});
