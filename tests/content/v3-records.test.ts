import { describe, expect, it } from "vitest";
import { careerChapters } from "@/content/career";
import { contentSet } from "@/content/content-set";
import { modeIntros } from "@/content/modes";
import { toolkitGroups } from "@/content/toolkits";
import {
  careerChapterSchema,
  educationSchema,
  modeIntroSchema,
  toolkitGroupSchema,
  workExperienceSchema,
} from "@/domain/content/schemas";
import {
  getPublishedCareerChapters,
  getPublishedCertifications,
  getPublishedEducation,
  getPublishedEngineeringPractices,
  getPublishedExperienceFor,
  getPublishedLanguages,
  getPublishedModeIntro,
  getPublishedProfile,
  getPublishedToolkit,
} from "@/domain/content/selectors";
import { MODES } from "@/domain/content/types";
import type { ContentSet } from "@/domain/content/validation";
import { validateContentSet } from "@/domain/content/validation";

/**
 * The V3 records (UX/UI specification v3.0): their schemas, the cross-record
 * rules that tie them to the experience records, and what the real content
 * exposes. Each rule is asserted in both directions — it fires on a content set
 * that breaks it, and stays silent on the real one — because a rule that never
 * fires and a rule that is broken look identical from the outside.
 */

function rulesTriggeredBy(content: ContentSet): string[] {
  return [...new Set(validateContentSet(content).map((issue) => issue.rule))];
}

describe("V3 record schemas", () => {
  it("rejects a mode intro with one heading line instead of two", () => {
    const [intro] = modeIntros;

    expect(() => modeIntroSchema.parse({ ...intro, headingLines: ["Only one"] })).toThrow();
  });

  it("rejects a chapter that cites no role", () => {
    const [chapter] = careerChapters;

    expect(() => careerChapterSchema.parse({ ...chapter, experienceIds: [] })).toThrow();
  });

  it("rejects education that ends before it starts", () => {
    expect(() =>
      educationSchema.parse({
        id: "education-example",
        institution: "Example University",
        qualification: "Bachelor of Examples",
        startDate: "2020-09-01",
        endDate: "2019-05-01",
        publicationStatus: "published",
        sortOrder: 1,
      }),
    ).toThrow(/endDate/);
  });

  it("rejects a toolkit group with no tools", () => {
    const [group] = toolkitGroups;

    expect(() => toolkitGroupSchema.parse({ ...group, items: [] })).toThrow();
  });

  it("rejects a role tagged with no discipline", () => {
    const [role] = contentSet.experience;

    expect(() => workExperienceSchema.parse({ ...role, disciplines: [] })).toThrow();
  });
});

describe("V3 cross-record rules", () => {
  it("are silent on the real content", () => {
    expect(validateContentSet({ ...contentSet })).toEqual([]);
  });

  it("reject a chapter citing a role that does not exist", () => {
    const chapters = careerChapters.map((chapter, index) =>
      index === 0 ? { ...chapter, experienceIds: ["experience-that-does-not-exist"] } : chapter,
    );

    expect(rulesTriggeredBy({ ...contentSet, careerChapters: chapters })).toContain(
      "valid-experience-references",
    );
  });

  it("reject a chapter whose year falls outside a role it cites", () => {
    // The 2026 chapter citing the internship, which ended in October 2024.
    const chapters = careerChapters.map((chapter) =>
      chapter.year === 2026
        ? { ...chapter, experienceIds: ["experience-zettabyte-backend-developer-intern"] }
        : chapter,
    );

    expect(rulesTriggeredBy({ ...contentSet, careerChapters: chapters })).toContain(
      "chapter-year-within-roles",
    );
  });

  it("accept a current role for any later year", () => {
    // A current role is open-ended, so a 2027 chapter may cite it. No real role
    // has been current since 27 November 2026 (DEC-072), so this makes the
    // infrastructure role current for the test.
    const experience = contentSet.experience.map((role) => {
      if (role.id !== "experience-zettabyte-ai-delivery-engineer") {
        return role;
      }
      const { endDate: _ended, ...open } = role;
      return { ...open, isCurrent: true };
    });
    const chapters = careerChapters.map((chapter) =>
      chapter.year === 2026 ? { ...chapter, year: 2027 } : chapter,
    );

    expect(rulesTriggeredBy({ ...contentSet, experience, careerChapters: chapters })).not.toContain(
      "chapter-year-within-roles",
    );
  });

  it("reject a later year for a role that has ended", () => {
    // The infrastructure role ended in November 2026 (DEC-072), so a 2027
    // chapter may not cite it.
    const chapters = careerChapters.map((chapter) =>
      chapter.year === 2026 ? { ...chapter, year: 2027 } : chapter,
    );

    expect(rulesTriggeredBy({ ...contentSet, careerChapters: chapters })).toContain(
      "chapter-year-within-roles",
    );
  });

  it("reject two Published intros for one mode", () => {
    const [overall] = modeIntros;
    const intros = [...modeIntros, { ...overall!, id: "mode-intro-overall-duplicate" }];

    expect(rulesTriggeredBy({ ...contentSet, modeIntros: intros })).toContain("one-intro-per-mode");
  });

  it("reject a Published intro that does not name the engineer", () => {
    const intros = modeIntros.map((intro) =>
      intro.mode === "backend" ? { ...intro, eyebrow: "Backend" } : intro,
    );

    expect(rulesTriggeredBy({ ...contentSet, modeIntros: intros })).toContain(
      "intro-names-engineer",
    );
  });

  it("ignore a Draft intro that does not name the engineer", () => {
    const intros = modeIntros.map((intro) =>
      intro.mode === "backend"
        ? { ...intro, eyebrow: "Backend", publicationStatus: "draft" as const }
        : intro,
    );

    expect(rulesTriggeredBy({ ...contentSet, modeIntros: intros })).not.toContain(
      "intro-names-engineer",
    );
  });
});

describe("the real V3 content", () => {
  it("has one Published intro per mode, each naming the engineer (V3-CONT-003)", () => {
    const name = getPublishedProfile()!.fullName;

    for (const mode of MODES) {
      const intro = getPublishedModeIntro(mode);

      expect(intro, mode).not.toBeNull();
      expect(`${intro!.eyebrow} ${intro!.headingLines.join(" ")}`, mode).toContain(name);
    }
  });

  it("never calls the infrastructure role SRE or reliability engineering (UX3 7.3)", () => {
    const intro = getPublishedModeIntro("infrastructure")!;
    const text = `${intro.eyebrow} ${intro.headingLines.join(" ")} ${intro.description ?? ""}`;

    expect(text).not.toMatch(/\bSRE\b|reliability/i);
  });

  it("tells the career in three chapters, each resolving to its real roles", () => {
    const chapters = getPublishedCareerChapters();

    expect(chapters.map((chapter) => chapter.year)).toEqual([2024, 2025, 2026]);
    // In the order the chapter cites them: internship, then contract.
    expect(chapters[0]!.roles.map((role) => role.id)).toEqual([
      "experience-zettabyte-backend-developer-intern",
      "experience-zettabyte-backend-developer-contract",
    ]);
    expect(chapters[2]!.roles.map((role) => role.id)).toEqual([
      "experience-zettabyte-ai-delivery-engineer",
    ]);
  });

  it("splits experience by discipline", () => {
    expect(getPublishedExperienceFor("infrastructure").map((role) => role.id)).toEqual([
      "experience-zettabyte-ai-delivery-engineer",
    ]);
    expect(getPublishedExperienceFor("backend")).toHaveLength(3);
  });

  it("exposes the credentials both résumés list", () => {
    expect(getPublishedEducation().map((entry) => entry.institution)).toEqual([
      "Universitas Teknologi Yogyakarta",
      "Pacmann Academy",
    ]);
    expect(getPublishedCertifications()).toHaveLength(2);
    expect(getPublishedLanguages().map((language) => language.name)).toEqual([
      "Indonesian",
      "English",
    ]);
  });

  it("exposes six engineering practices", () => {
    expect(getPublishedEngineeringPractices()).toHaveLength(6);
  });

  it("gives each mode page a four-group toolkit", () => {
    expect(getPublishedToolkit("backend")).toHaveLength(4);
    expect(getPublishedToolkit("infrastructure")).toHaveLength(4);
  });

  it("carries the approved profile statement (OPEN-009)", () => {
    expect(getPublishedProfile()?.statement).toMatch(/^I began my engineering career/);
  });

  /**
   * DEC-064: tools are named; how the employer's systems are wired is not. The
   * mockup's toolkit named three things that describe that wiring, and they
   * were left out of the content.
   *
   * An allowlist rather than a denylist, deliberately. A denylist would have to
   * spell those three names out, publishing in a public repository exactly what
   * the decision keeps off the site. This holds every toolkit to the list Randi
   * approved instead: a tool not on it fails here, so adding one is a
   * deliberate change to this list, reviewed against DEC-064 in its pull
   * request. It also catches any other addition, not only those three.
   */
  it("lists only tools from the approved toolkit list (DEC-064)", () => {
    const approved = new Set([
      // Backend toolkit
      "Node.js",
      "JavaScript",
      "GraphQL",
      "REST APIs",
      "MongoDB",
      "Mongoose",
      "Aggregation Framework",
      "Redis",
      "BullMQ",
      "background jobs",
      "service integrations",
      "Docker",
      "Jenkins",
      "Linux",
      "PM2",
      "Nginx",
      "AWS",
      "Git",
      "CI/CD",
      // Infrastructure toolkit, beyond the names above
      "AWS EC2",
      "S3",
      "SSM",
      "Ubuntu",
      "Docker Compose",
      "Buildx",
      "TLS",
      "GitHub Actions",
      "Bash",
      "release validation",
      "access control",
      "REST",
    ]);

    for (const group of contentSet.toolkitGroups) {
      for (const item of group.items) {
        expect(approved.has(item), `${group.id}: "${item}" is not an approved tool`).toBe(true);
      }
    }
  });
});
