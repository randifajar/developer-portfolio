import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * A section of the Overall page with nothing publicly eligible renders nothing
 * at all, rather than a heading over an empty body (FAC-HOME-005, UX 17). An
 * announced-but-empty section is worse for a screen-reader user than an
 * absent one.
 *
 * Carried over from the v2 homepage's omission suite, with its technique:
 * what is mocked is the content registry — the raw modules under src/content
 * — so the real selectors run against an empty repository and the real
 * components run against the real selectors. Mocking the selectors would
 * assert the mock.
 *
 * Explore further is not here. It is navigation to pages that always exist,
 * so it has nothing to omit.
 */

afterEach(() => {
  vi.resetModules();
});

async function renderWithEmptyContent(moduleName: string, componentName: string) {
  vi.resetModules();

  vi.doMock("@/content/profile", () => ({
    profile: { id: "profile-a", publicationStatus: "draft" },
  }));
  vi.doMock("@/content/experience", () => ({ experience: [] }));
  vi.doMock("@/content/projects", () => ({ projects: [] }));
  vi.doMock("@/content/project-overviews", () => ({ projectOverviews: [] }));
  vi.doMock("@/content/career", () => ({ careerChapters: [] }));
  vi.doMock("@/content/modes", () => ({ modeIntros: [] }));
  vi.doMock("@/content/practices", () => ({ engineeringPractices: [] }));
  vi.doMock("@/content/credentials", () => ({
    education: [],
    certifications: [],
    languages: [],
  }));

  const loaded = (await import(moduleName)) as Record<string, () => React.ReactElement | null>;
  const Section = loaded[componentName]!;

  return render(<Section />).container;
}

const SECTIONS = [
  ["Profile", "@/components/overall/profile-section", "ProfileSection"],
  ["Engineering focus", "@/components/overall/focus-section", "FocusSection"],
  ["Career", "@/components/overall/career-section", "CareerSection"],
  ["Selected work", "@/components/overall/selected-work-section", "SelectedWorkSection"],
  ["Approach", "@/components/overall/approach-section", "ApproachSection"],
  ["Education", "@/components/overall/education-section", "EducationSection"],
] as const;

describe("an Overall section with nothing publicly eligible renders nothing", () => {
  for (const [label, moduleName, componentName] of SECTIONS) {
    it(`${label} omits itself entirely`, async () => {
      const container = await renderWithEmptyContent(moduleName, componentName);

      expect(container, `${label}: rendered something`).toBeEmptyDOMElement();
    });
  }
});
