import { render, screen } from "@testing-library/react";
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
 * A section with nothing publicly eligible must render nothing at all, rather
 * than a heading with an empty body. FAC-HOME-005 and UX 17 require empty
 * sections to be omitted, not shown hollow — an announced-but-empty section is
 * worse for a screen-reader user than an absent one.
 *
 * These assert the live state and are expected to change as Randi publishes
 * content, so each transition is a reviewed diff.
 */
describe("sections with no eligible content omit themselves entirely", () => {
  const emptySections = [
    ["Hero", HeroSection],
    ["About", AboutSection],
    ["Work Experience", ExperienceSection],
    ["Technical Skills", SkillsSection],
    ["AI-Assisted Engineering", AIWorkflowSection],
  ] as const;

  for (const [name, Section] of emptySections) {
    it(`${name} renders nothing`, () => {
      const { container } = render(<Section />);

      expect(container).toBeEmptyDOMElement();
    });
  }

  it("announces no heading for any omitted section", () => {
    for (const [, Section] of emptySections) {
      const { container, unmount } = render(<Section />);

      expect(container.querySelector("h1, h2, h3, h4")).toBeNull();
      unmount();
    }
  });
});

/**
 * Selected Projects is the one section with eligible content: the Personal
 * Developer Portfolio case study is Published and featured.
 */
describe("Selected Projects renders the one published project", () => {
  it("renders exactly one card", () => {
    render(<ProjectsSection />);

    expect(screen.getAllByRole("article")).toHaveLength(1);
  });

  it("renders the published case study and links to it", () => {
    render(<ProjectsSection />);

    expect(screen.getByRole("link", { name: "Personal Developer Portfolio" })).toHaveAttribute(
      "href",
      "/projects/personal-developer-portfolio",
    );
  });

  it("does not render the Draft professional case study", () => {
    render(<ProjectsSection />);

    expect(screen.queryByText(/Jury Process Management/i)).not.toBeInTheDocument();
  });

  it("pads nothing — one project means one card, no filler (FAC-HOME-004)", () => {
    const { container } = render(<ProjectsSection />);

    expect(container.textContent).not.toMatch(/coming soon/i);
    expect(screen.getAllByRole("article")).toHaveLength(1);
  });
});
