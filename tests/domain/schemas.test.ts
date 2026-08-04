import { describe, expect, it } from "vitest";
import {
  externalProfileSchema,
  projectCaseStudySchema,
  resumeSchema,
  workExperienceSchema,
} from "@/domain/content/schemas";

/**
 * A minimal valid Project Case Study. Each test clones this and breaks exactly
 * one thing, so a failure names the rule that broke rather than a pile of
 * unrelated validation noise.
 */
function validProject() {
  return {
    id: "project-example",
    slug: "example-project",
    title: "Example Project",
    summary: "A short public summary of the project.",
    projectType: "personal" as const,
    role: "Backend Developer",
    deliveryStatus: "completed" as const,
    context: "System and user context.",
    problem: "The problem being solved.",
    personalResponsibilities: ["Implemented the data layer."],
    technicalApproach: "High-level solution.",
    challenges: [{ title: "A challenge", description: "Why it mattered." }],
    decisionsAndTradeoffs: [{ decision: "Chose X", rationale: "Because Y" }],
    implementationSummary: "What was implemented.",
    testingAndVerification: "How it was verified.",
    outcome: "The verified result.",
    lessonsLearned: "What was learned.",
    technologyIds: ["skill-typescript"],
    confidentialityClass: "public" as const,
    featured: true,
    publicationStatus: "published" as const,
    updatedAt: "2026-08-04",
  };
}

describe("project case study schema", () => {
  it("accepts a complete valid project", () => {
    expect(() => projectCaseStudySchema.parse(validProject())).not.toThrow();
  });

  it("rejects a project missing a required section", () => {
    const { outcome: _outcome, ...withoutOutcome } = validProject();

    expect(() => projectCaseStudySchema.parse(withoutOutcome)).toThrow();
  });

  it("rejects an invalid delivery status", () => {
    expect(() =>
      projectCaseStudySchema.parse({ ...validProject(), deliveryStatus: "shipped" }),
    ).toThrow();
  });

  it("rejects production status without explicit confirmation (TD 9.5)", () => {
    expect(() =>
      projectCaseStudySchema.parse({ ...validProject(), deliveryStatus: "production" }),
    ).toThrow(/productionConfirmation/i);
  });

  it("accepts production status when confirmation is verified", () => {
    expect(() =>
      projectCaseStudySchema.parse({
        ...validProject(),
        deliveryStatus: "production",
        productionConfirmation: { verified: true, note: "Deployed and verified in production." },
      }),
    ).not.toThrow();
  });

  it("rejects an empty personal responsibilities list (FAC-PROJECT-003)", () => {
    expect(() =>
      projectCaseStudySchema.parse({ ...validProject(), personalResponsibilities: [] }),
    ).toThrow();
  });

  it("rejects a slug that is not lowercase kebab-case", () => {
    expect(() =>
      projectCaseStudySchema.parse({ ...validProject(), slug: "Example Project" }),
    ).toThrow();
  });

  it("rejects a non-https repository url (NFAC-SEC-003)", () => {
    expect(() =>
      projectCaseStudySchema.parse({
        ...validProject(),
        repositoryUrl: "http://github.com/randifajar/example",
      }),
    ).toThrow();
  });
});

describe("work experience schema", () => {
  function validExperience() {
    return {
      id: "experience-example",
      companyName: "Example Company",
      position: "Backend Developer",
      startDate: "2023-01-01",
      endDate: "2025-06-30",
      isCurrent: false,
      summary: "Role overview.",
      responsibilities: ["Built and maintained backend services."],
      confidentialityClass: "sanitized" as const,
      publicationStatus: "published" as const,
      sortOrder: 1,
    };
  }

  it("accepts a valid past role", () => {
    expect(() => workExperienceSchema.parse(validExperience())).not.toThrow();
  });

  it("rejects a non-current role with no end date (FAC-EXP-002)", () => {
    const { endDate: _endDate, ...withoutEnd } = validExperience();

    expect(() => workExperienceSchema.parse(withoutEnd)).toThrow(/endDate/i);
  });

  it("rejects an end date before the start date (FAC-EXP-002)", () => {
    expect(() =>
      workExperienceSchema.parse({
        ...validExperience(),
        startDate: "2025-01-01",
        endDate: "2023-01-01",
      }),
    ).toThrow(/endDate/i);
  });

  it("accepts a current role with no end date", () => {
    const { endDate: _endDate, ...current } = validExperience();

    expect(() => workExperienceSchema.parse({ ...current, isCurrent: true })).not.toThrow();
  });

  it("rejects a current role that also has an end date", () => {
    expect(() => workExperienceSchema.parse({ ...validExperience(), isCurrent: true })).toThrow(
      /endDate/i,
    );
  });
});

describe("resume schema", () => {
  function validResume() {
    return {
      id: "resume-current",
      fileName: "randi-fajar-wicaksono-resume.pdf",
      fileFormat: "pdf" as const,
      version: "2026.08",
      publicationDate: "2026-08-04",
      publicPath: "/resume.pdf",
      isActive: true,
      confidentialityClass: "public" as const,
      publicationStatus: "published" as const,
    };
  }

  it("accepts a valid active resume", () => {
    expect(() => resumeSchema.parse(validResume())).not.toThrow();
  });

  it("rejects a public path that is not a PDF (FAC-RESUME-001)", () => {
    expect(() => resumeSchema.parse({ ...validResume(), publicPath: "/resume.docx" })).toThrow(
      /\.pdf/i,
    );
  });

  it("rejects a resume that is not classified public", () => {
    expect(() =>
      resumeSchema.parse({ ...validResume(), confidentialityClass: "sanitized" }),
    ).toThrow();
  });
});

describe("external profile schema", () => {
  it("accepts approved https profile urls", () => {
    expect(() =>
      externalProfileSchema.parse({
        id: "profile-github",
        platform: "github",
        label: "GitHub",
        url: "https://github.com/randifajar",
        publicationStatus: "published",
      }),
    ).not.toThrow();
  });

  it("rejects a non-https profile url (NFAC-SEC-003)", () => {
    expect(() =>
      externalProfileSchema.parse({
        id: "profile-github",
        platform: "github",
        label: "GitHub",
        url: "http://github.com/randifajar",
        publicationStatus: "published",
      }),
    ).toThrow();
  });
});
