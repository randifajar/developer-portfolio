import { describe, expect, it } from "vitest";
import { defineExperience, defineProject, defineResume } from "@/domain/content/define";

function validProject() {
  return {
    id: "project-example",
    slug: "example-project",
    title: "Example Project",
    summary: "A short public summary.",
    projectType: "personal" as const,
    role: "Backend Developer",
    deliveryStatus: "completed" as const,
    context: "Context.",
    problem: "Problem.",
    personalResponsibilities: ["Implemented the data layer."],
    technicalApproach: "Approach.",
    challenges: [{ title: "Challenge", description: "Why it mattered." }],
    decisionsAndTradeoffs: [{ decision: "Chose X", rationale: "Because Y" }],
    implementationSummary: "Implementation.",
    testingAndVerification: "Verification.",
    outcome: "Outcome.",
    lessonsLearned: "Lessons.",
    technologyIds: ["skill-typescript"],
    confidentialityClass: "public" as const,
    featured: false,
    publicationStatus: "draft" as const,
    updatedAt: "2026-08-04",
  };
}

describe("defineProject", () => {
  it("returns typed validated data for a valid project", () => {
    const project = defineProject(validProject());

    expect(project.slug).toBe("example-project");
    expect(project.deliveryStatus).toBe("completed");
  });

  it("throws immediately when a required field is missing (ADR-005)", () => {
    const { outcome: _outcome, ...invalid } = validProject();

    expect(() => defineProject(invalid as never)).toThrow();
  });

  it("names the content type in the error so the failing module is obvious", () => {
    const { outcome: _outcome, ...invalid } = validProject();

    expect(() => defineProject(invalid as never)).toThrow(/Project Case Study/i);
  });

  it("names the record identifier in the error (TD 17.5)", () => {
    const { outcome: _outcome, ...invalid } = validProject();

    expect(() => defineProject(invalid as never)).toThrow(/project-example/);
  });

  it("names the field path in the error (TD 17.5)", () => {
    const { outcome: _outcome, ...invalid } = validProject();

    expect(() => defineProject(invalid as never)).toThrow(/outcome/);
  });

  it("reports every problem at once rather than only the first", () => {
    const { outcome: _outcome, problem: _problem, ...invalid } = validProject();

    let message = "";
    try {
      defineProject(invalid as never);
    } catch (error) {
      message = error instanceof Error ? error.message : String(error);
    }

    expect(message).toMatch(/outcome/);
    expect(message).toMatch(/problem/);
  });

  it("still identifies the record when the id itself is missing", () => {
    const { id: _id, outcome: _outcome, ...invalid } = validProject();

    // Falls back to the slug so the message is never "unknown record".
    expect(() => defineProject(invalid as never)).toThrow(/example-project/);
  });

  it("rejects a project that claims production without confirmation", () => {
    expect(() =>
      defineProject({ ...validProject(), deliveryStatus: "production" } as never),
    ).toThrow(/productionConfirmation/i);
  });
});

describe("defineExperience", () => {
  it("throws when a non-current role has no end date", () => {
    expect(() =>
      defineExperience({
        id: "experience-example",
        companyName: "Example Company",
        position: "Backend Developer",
        startDate: "2023-01-01",
        isCurrent: false,
        summary: "Overview.",
        responsibilities: ["Built services."],
        confidentialityClass: "sanitized",
        publicationStatus: "published",
        sortOrder: 1,
      } as never),
    ).toThrow(/Work Experience/i);
  });
});

describe("defineResume", () => {
  it("throws when the public path is not a PDF", () => {
    expect(() =>
      defineResume({
        id: "resume-current",
        fileName: "resume.docx",
        fileFormat: "pdf",
        version: "2026.08",
        publicationDate: "2026-08-04",
        publicPath: "/resume.docx",
        isActive: true,
        confidentialityClass: "public",
        publicationStatus: "published",
      } as never),
    ).toThrow(/Resume/i);
  });
});
