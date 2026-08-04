import { describe, expect, it } from "vitest";
import { aiPractices } from "@/content/ai-practices";
import { contactChannels, externalProfiles } from "@/content/contact";
import { experience } from "@/content/experience";
import { mediaAssets } from "@/content/media";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { resume } from "@/content/resume";
import { skills } from "@/content/skills";
import type { ContentSet } from "@/domain/content/validation";
import { formatValidationIssues, validateContentSet } from "@/domain/content/validation";

/** The real content set, which must always validate cleanly. */
function realContent(): ContentSet {
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

/** Rule names present in the result, for precise assertions. */
function rulesTriggeredBy(content: ContentSet): string[] {
  return [...new Set(validateContentSet(content).map((issue) => issue.rule))];
}

describe("the real content set", () => {
  it("passes structural validation", () => {
    expect(validateContentSet(realContent())).toEqual([]);
  });
});

describe("rule: unique ids", () => {
  it("rejects two records of one type sharing an id", () => {
    const [first] = projects;
    const content = { ...realContent(), projects: [first!, { ...first!, slug: "other-slug" }] };

    expect(rulesTriggeredBy(content)).toContain("unique-ids");
  });
});

describe("rule: unique project slugs", () => {
  it("rejects two projects sharing a slug", () => {
    const [first] = projects;
    const content = { ...realContent(), projects: [first!, { ...first!, id: "project-other" }] };

    expect(rulesTriggeredBy(content)).toContain("unique-slugs");
  });
});

describe("rule: valid technology references", () => {
  it("rejects a project referencing an unknown skill", () => {
    const [first] = projects;
    const content = {
      ...realContent(),
      projects: [{ ...first!, technologyIds: ["skill-does-not-exist"] }],
    };

    expect(rulesTriggeredBy(content)).toContain("valid-technology-references");
  });

  it("rejects an experience record referencing an unknown skill", () => {
    const [first] = experience;
    const content = {
      ...realContent(),
      experience: [{ ...first!, technologyIds: ["skill-does-not-exist"] }],
    };

    expect(rulesTriggeredBy(content)).toContain("valid-technology-references");
  });
});

describe("rule: valid media references", () => {
  it("rejects a profile referencing an unknown media asset", () => {
    const content = { ...realContent(), profile: { ...profile, photoAssetId: "media-missing" } };

    expect(rulesTriggeredBy(content)).toContain("valid-media-references");
  });

  it("rejects a project referencing an unknown media asset", () => {
    const [first] = projects;
    const content = {
      ...realContent(),
      projects: [{ ...first!, mediaAssetIds: ["media-missing"] }],
    };

    expect(rulesTriggeredBy(content)).toContain("valid-media-references");
  });
});

describe("rule: valid project references", () => {
  it("rejects an experience record referencing an unknown project", () => {
    const [first] = experience;
    const content = {
      ...realContent(),
      experience: [{ ...first!, projectIds: ["project-missing"] }],
    };

    expect(rulesTriggeredBy(content)).toContain("valid-project-references");
  });

  it("rejects an AI practice referencing an unknown project", () => {
    const [first] = aiPractices;
    const content = {
      ...realContent(),
      aiPractices: [{ ...first!, relatedProjectIds: ["project-missing"] }],
    };

    expect(rulesTriggeredBy(content)).toContain("valid-project-references");
  });
});

describe("rule: single active resume (FAC-RESUME-004)", () => {
  it("rejects two active Published resumes", () => {
    const active = { ...resume, isActive: true, publicationStatus: "published" as const };
    const content = {
      ...realContent(),
      resumes: [active, { ...active, id: "resume-second" }],
    };

    expect(rulesTriggeredBy(content)).toContain("single-active-resume");
  });

  it("allows one active Published resume alongside inactive ones", () => {
    const content = {
      ...realContent(),
      resumes: [
        { ...resume, isActive: true, publicationStatus: "published" as const },
        { ...resume, id: "resume-old", isActive: false, publicationStatus: "archived" as const },
      ],
    };

    expect(rulesTriggeredBy(content)).not.toContain("single-active-resume");
  });
});

describe("rule: no published private or restricted content (FAC-PUBLISH-002)", () => {
  it("rejects a Published restricted project", () => {
    const [first] = projects;
    const content = {
      ...realContent(),
      projects: [
        {
          ...first!,
          confidentialityClass: "restricted" as const,
          publicationStatus: "published" as const,
        },
      ],
    };

    expect(rulesTriggeredBy(content)).toContain("no-published-private-or-restricted");
  });

  it("rejects a Published private experience record (FAC-EXP-003)", () => {
    const [first] = experience;
    const content = {
      ...realContent(),
      experience: [
        {
          ...first!,
          confidentialityClass: "private" as const,
          publicationStatus: "published" as const,
        },
      ],
    };

    expect(rulesTriggeredBy(content)).toContain("no-published-private-or-restricted");
  });
});

describe("rule: published projects are complete (FAC-PROJECT-005)", () => {
  it("rejects a Published project with an empty required section", () => {
    const [first] = projects;
    const content = {
      ...realContent(),
      projects: [
        { ...first!, publicationStatus: "published" as const, featured: false, outcome: "   " },
      ],
    };

    expect(rulesTriggeredBy(content)).toContain("published-projects-complete");
  });

  it("ignores incomplete Draft projects, which is what makes Draft development possible", () => {
    const [first] = projects;
    const content = {
      ...realContent(),
      projects: [
        { ...first!, publicationStatus: "draft" as const, featured: false, outcome: "  " },
      ],
    };

    expect(rulesTriggeredBy(content)).not.toContain("published-projects-complete");
  });
});

describe("rule: featured projects are published (FAC-HOME-003)", () => {
  it("rejects a featured Draft project", () => {
    const [first] = projects;
    const content = {
      ...realContent(),
      projects: [{ ...first!, featured: true, publicationStatus: "draft" as const }],
    };

    expect(rulesTriggeredBy(content)).toContain("featured-projects-published");
  });
});

describe("rule: unique featured priority", () => {
  it("rejects two featured projects sharing a priority", () => {
    const [first, second] = projects;
    const publish = {
      publicationStatus: "published" as const,
      featured: true,
      featuredPriority: 1,
    };
    const content = {
      ...realContent(),
      projects: [
        { ...first!, ...publish },
        { ...second!, ...publish },
      ],
    };

    expect(rulesTriggeredBy(content)).toContain("unique-featured-priority");
  });
});

describe("rule: production requires confirmation (TD 9.5)", () => {
  it("rejects Production status without a verified confirmation", () => {
    const [first] = projects;
    const content = {
      ...realContent(),
      // Bypasses the schema deliberately: this proves validation catches it
      // even if a record is ever built without the definition helper.
      projects: [{ ...first!, deliveryStatus: "production" as const }],
    };

    expect(rulesTriggeredBy(content)).toContain("production-requires-confirmation");
  });

  it("accepts Production status with a verified confirmation", () => {
    const [first] = projects;
    const content = {
      ...realContent(),
      projects: [
        {
          ...first!,
          deliveryStatus: "production" as const,
          productionConfirmation: { verified: true as const, note: "Verified in production." },
        },
      ],
    };

    expect(rulesTriggeredBy(content)).not.toContain("production-requires-confirmation");
  });
});

describe("rule: safe external urls (NFAC-SEC-003)", () => {
  it("rejects a non-https external profile", () => {
    const [first] = externalProfiles;
    const content = {
      ...realContent(),
      externalProfiles: [{ ...first!, url: "http://github.com/randifajar" }],
    };

    expect(rulesTriggeredBy(content)).toContain("safe-external-urls");
  });

  it("rejects a contact link that is not mailto:", () => {
    const [first] = contactChannels;
    const content = {
      ...realContent(),
      contactChannels: [{ ...first!, publicLink: "https://example.com/contact" }],
    };

    expect(rulesTriggeredBy(content)).toContain("safe-external-urls");
  });
});

describe("rule: resume is a pdf (FAC-RESUME-001)", () => {
  it("rejects a resume path that is not a PDF", () => {
    const content = { ...realContent(), resumes: [{ ...resume, publicPath: "/resume.docx" }] };

    expect(rulesTriggeredBy(content)).toContain("resume-is-pdf");
  });
});

describe("rule: local media paths", () => {
  it("rejects a remote media path", () => {
    const [first] = mediaAssets;
    const content = {
      ...realContent(),
      mediaAssets: [{ ...first!, filePath: "https://cdn.example.com/photo.webp" }],
    };

    expect(rulesTriggeredBy(content)).toContain("local-media-paths");
  });
});

describe("reporting", () => {
  it("reports every violation rather than only the first", () => {
    const [first] = projects;
    const content = {
      ...realContent(),
      projects: [
        {
          ...first!,
          technologyIds: ["skill-missing-one", "skill-missing-two"],
          mediaAssetIds: ["media-missing"],
        },
      ],
    };

    const issues = validateContentSet(content);

    expect(issues.length).toBeGreaterThanOrEqual(3);
  });

  it("groups the report by rule and names each offending record", () => {
    const [first] = projects;
    const content = {
      ...realContent(),
      projects: [{ ...first!, technologyIds: ["skill-missing"] }],
    };

    const report = formatValidationIssues(validateContentSet(content));

    expect(report).toMatch(/valid-technology-references/);
    expect(report).toMatch(new RegExp(first!.id));
    expect(report).toMatch(/skill-missing/);
  });

  it("says so plainly when nothing is wrong", () => {
    expect(formatValidationIssues([])).toBe("Content validation passed.");
  });
});
