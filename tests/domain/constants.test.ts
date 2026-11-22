import { describe, expect, it } from "vitest";
import { getPublishedModeIntro } from "@/domain/content/selectors";
import { MAIN_CONTENT_ID, RESUME_PATH, ROUTES, SECTION_IDS } from "@/lib/constants";

describe("section anchors", () => {
  const ids = Object.values(SECTION_IDS);

  it("are unique", () => {
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("use lowercase kebab-case so they are valid, stable URL fragments", () => {
    for (const id of ids) {
      expect(id).toMatch(/^[a-z]+(-[a-z]+)*$/);
    }
  });

  // FAC-NAV-002's header section links are superseded by the V3 header (UX3
  // 6); what remains are the in-page targets the V3 pages link to.
  it("cover the V3 page targets and the footer (UX3 7.1–7.3, 7.7)", () => {
    expect(ids).toEqual([
      "profile",
      "career",
      "work",
      "education",
      "backend-work",
      "infrastructure-work",
      "contact",
    ]);
  });

  it("keep every hero action's target in step with its content", () => {
    expect(getPublishedModeIntro("overall")?.action.targetId).toBe(SECTION_IDS.profile);
    expect(getPublishedModeIntro("backend")?.action.targetId).toBe(SECTION_IDS.backendWork);
    expect(getPublishedModeIntro("infrastructure")?.action.targetId).toBe(
      SECTION_IDS.infrastructureWork,
    );
  });

  it("does not collide with the skip-to-content target", () => {
    expect(ids).not.toContain(MAIN_CONTENT_ID);
  });
});

describe("resume path", () => {
  it("is a root-relative PDF path", () => {
    expect(RESUME_PATH).toBe("/resume.pdf");
  });

  it("ends in .pdf so FAC-RESUME-001 format validation can rely on it", () => {
    expect(RESUME_PATH.endsWith(".pdf")).toBe(true);
  });
});

describe("routes", () => {
  it("match the approved public route inventory (DEC-024, DEC-056)", () => {
    expect(ROUTES.home).toBe("/");
    expect(ROUTES.backend).toBe("/backend");
    expect(ROUTES.infrastructure).toBe("/infrastructure");
    expect(ROUTES.projects).toBe("/projects");
    expect(ROUTES.projectDetail("example-slug")).toBe("/projects/example-slug");
  });

  it("builds detail routes under the projects index", () => {
    expect(ROUTES.projectDetail("a").startsWith(`${ROUTES.projects}/`)).toBe(true);
  });
});
