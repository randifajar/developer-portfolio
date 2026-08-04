import { describe, expect, it } from "vitest";
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

  it("cover every anchor-navigable homepage section required by FAC-NAV-002", () => {
    expect(ids).toEqual(
      expect.arrayContaining([
        SECTION_IDS.experience,
        SECTION_IDS.skills,
        SECTION_IDS.aiWorkflow,
        SECTION_IDS.contact,
      ]),
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
  it("match the approved public route inventory (DEC-024)", () => {
    expect(ROUTES.home).toBe("/");
    expect(ROUTES.projects).toBe("/projects");
    expect(ROUTES.projectDetail("example-slug")).toBe("/projects/example-slug");
  });

  it("builds detail routes under the projects index", () => {
    expect(ROUTES.projectDetail("a").startsWith(`${ROUTES.projects}/`)).toBe(true);
  });
});
