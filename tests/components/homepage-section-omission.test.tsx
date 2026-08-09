import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * FAC-HOME-005 and UX 17: a section with nothing publicly eligible renders
 * nothing at all, rather than a heading with an empty body. An
 * announced-but-empty section is worse for a screen-reader user than an absent
 * one.
 *
 * This behaviour used to be covered against real content, back when every
 * section was Draft. Publishing the launch content removed the subject, and
 * the previous change recorded the gap with the claim that testing it "would
 * only assert the mock". That claim was wrong, and this file exists because of
 * it.
 *
 * What is mocked here is the *content registry* — the raw modules under
 * src/content. The real selectors run against them, and the real components
 * run against the real selectors. Nothing about the omission decision is
 * stubbed; the components are simply given a repository with nothing published
 * in it. That is the same technique used for the launch-indexing and selector
 * ordering branches, and it exercises production code rather than a stand-in.
 *
 * Mocking the *selectors* would have been the version worth refusing.
 */

afterEach(() => {
  vi.resetModules();
});

/** A profile that exists but is not publicly eligible. */
const draftProfile = { id: "profile-a", publicationStatus: "draft" };

/**
 * Empty the content registry, then load a section through the real selector
 * layer.
 */
async function renderWithEmptyContent(
  moduleName: string,
  componentName: string,
): Promise<HTMLElement> {
  vi.resetModules();

  vi.doMock("@/content/profile", () => ({ profile: draftProfile }));
  vi.doMock("@/content/experience", () => ({ experience: [] }));
  vi.doMock("@/content/projects", () => ({ projects: [] }));
  vi.doMock("@/content/skills", () => ({ skills: [] }));
  vi.doMock("@/content/ai-practices", () => ({ aiPractices: [] }));
  vi.doMock("@/content/media", () => ({ mediaAssets: [] }));
  vi.doMock("@/content/resume", () => ({
    resume: { id: "resume-a", isActive: false, publicationStatus: "draft" },
  }));
  vi.doMock("@/content/contact", () => ({ contactChannels: [], externalProfiles: [] }));

  const loaded = (await import(moduleName)) as Record<string, () => React.ReactElement | null>;
  const Section = loaded[componentName]!;

  return render(<Section />).container;
}

const sections = [
  ["Hero", "@/components/sections/hero-section", "HeroSection"],
  ["About", "@/components/sections/about-section", "AboutSection"],
  ["Work Experience", "@/components/sections/experience-section", "ExperienceSection"],
  ["Selected Projects", "@/components/sections/projects-section", "ProjectsSection"],
  ["Technical Skills", "@/components/sections/skills-section", "SkillsSection"],
  ["AI-Assisted Engineering", "@/components/sections/ai-workflow-section", "AIWorkflowSection"],
] as const;

/**
 * One test per section, asserting all three properties from a single render.
 *
 * The shape matters. This started as three tests that each looped over all six
 * sections, which meant two of them performed six full module-graph reloads
 * inside one five-second budget. Each reload resets the module registry and
 * re-imports a component, its selectors, and the content modules beneath them.
 *
 * That passed in isolation and failed intermittently in the full suite — once
 * at 11.3 seconds, while a CodeQL scan competed for CPU. A test that fails only
 * under load is worse than one that fails outright: it trains you to re-run
 * rather than to read.
 *
 * Now no test performs more than one reload, so none is near the timeout, and
 * the file does six reloads in total rather than eighteen. Each assertion
 * carries its own message, so a failure still names which property broke.
 */
describe("a section with nothing publicly eligible renders nothing", () => {
  for (const [label, moduleName, componentName] of sections) {
    it(`${label} omits itself entirely`, async () => {
      const container = await renderWithEmptyContent(moduleName, componentName);

      expect(container, `${label}: rendered something`).toBeEmptyDOMElement();

      // A heading rendered outside the early return would leave "Technical
      // Skills" announced with nothing under it (FAC-HOME-005).
      expect(container.querySelector("h1, h2, h3, h4"), `${label}: kept a heading`).toBeNull();

      // Header links point at section ids. An id surviving an omitted section
      // gives a keyboard user a navigation target that goes nowhere
      // (FAC-NAV-002).
      expect(container.querySelector("[id]"), `${label}: kept an anchor target`).toBeNull();
    });
  }
});
