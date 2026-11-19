import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * A section of the Backend or Infrastructure page with nothing publicly
 * eligible renders nothing at all, never a heading over an empty body
 * (FAC-HOME-005, UX 17).
 *
 * The same technique as overall-omission.test.tsx: the content registry is
 * emptied, and the real selectors and components run against it.
 */

afterEach(() => {
  vi.resetModules();
});

async function renderWithEmptyContent(
  moduleName: string,
  componentName: string,
  props: Record<string, unknown>,
) {
  vi.resetModules();

  vi.doMock("@/content/experience", () => ({ experience: [] }));
  vi.doMock("@/content/projects", () => ({ projects: [] }));
  vi.doMock("@/content/project-overviews", () => ({ projectOverviews: [] }));
  vi.doMock("@/content/toolkits", () => ({ toolkitGroups: [] }));
  vi.doMock("@/content/discipline-pages", () => ({ disciplineIntros: [], workAreas: [] }));

  const loaded = (await import(moduleName)) as Record<
    string,
    (props: Record<string, unknown>) => React.ReactElement | null
  >;
  const Section = loaded[componentName]!;

  return render(<Section {...props} />).container;
}

const SECTIONS = [
  ["Backend work", "@/components/modes/backend-sections", "BackendWorkSection", {}],
  ["Backend experience", "@/components/modes/backend-sections", "BackendExperienceSection", {}],
  ["The transition", "@/components/modes/infrastructure-sections", "TransitionSection", {}],
  [
    "Infrastructure work",
    "@/components/modes/infrastructure-sections",
    "InfrastructureWorkSection",
    {},
  ],
  [
    "Selected work",
    "@/components/modes/discipline-sections",
    "DisciplineWorkSection",
    { discipline: "backend", surface: "white", heading: "Backend work." },
  ],
  [
    "Toolkit",
    "@/components/modes/discipline-sections",
    "ToolkitSection",
    { discipline: "infrastructure", eyebrow: "Tools & practices", accent: "how I use them." },
  ],
] as const;

describe("a Backend or Infrastructure section with nothing publicly eligible renders nothing", () => {
  for (const [label, moduleName, componentName, props] of SECTIONS) {
    it(`${label} omits itself entirely`, async () => {
      const container = await renderWithEmptyContent(moduleName, componentName, props);

      expect(container, `${label}: rendered something`).toBeEmptyDOMElement();
    });
  }
});
