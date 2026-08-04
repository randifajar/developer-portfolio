import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AboutSection } from "@/components/sections/about-section";
import { AIWorkflowSection } from "@/components/sections/ai-workflow-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SkillsSection } from "@/components/sections/skills-section";

/**
 * Sections against the real, unmocked selectors.
 *
 * All substantive content is Draft, so every section must render nothing at
 * all rather than an empty shell with a heading and no body. FAC-HOME-005 and
 * UX 17 require empty sections to be omitted, not shown hollow.
 *
 * These will change when Randi publishes content in P30 — deliberately, as a
 * visible diff.
 */
describe("sections omit themselves entirely while content is Draft", () => {
  const cases = [
    ["Hero", HeroSection],
    ["About", AboutSection],
    ["Selected Projects", ProjectsSection],
    ["Work Experience", ExperienceSection],
    ["Technical Skills", SkillsSection],
    ["AI-Assisted Engineering", AIWorkflowSection],
  ] as const;

  for (const [name, Section] of cases) {
    it(`${name} renders nothing`, () => {
      const { container } = render(<Section />);

      expect(container).toBeEmptyDOMElement();
    });
  }

  it("renders no headings at all, so no hollow section is announced", () => {
    for (const [, Section] of cases) {
      const { container, unmount } = render(<Section />);

      expect(container.querySelector("h1, h2, h3, h4")).toBeNull();
      unmount();
    }
  });
});
