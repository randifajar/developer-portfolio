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
  // Technical Skills and AI-Assisted Engineering left this list when Randi
  // confirmed their content on 2026-08-08. They are asserted positively below.
  const emptySections = [
    ["Hero", HeroSection],
    ["About", AboutSection],
    ["Work Experience", ExperienceSection],
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

describe("Technical Skills renders the confirmed classifications", () => {
  it("renders the section with its heading", () => {
    render(<SkillsSection />);

    expect(screen.getByRole("heading", { name: /technical skills/i })).toBeVisible();
  });

  it("renders skills as readable names, grouped", () => {
    render(<SkillsSection />);

    expect(screen.getByText("TypeScript")).toBeVisible();
    expect(screen.getByText("Docker")).toBeVisible();
  });

  /**
   * FAC-SKILL-003. A self-assigned percentage implies a precision nobody can
   * defend in an interview, so the model has no field for one — this asserts
   * none appears by any other route either.
   */
  it("shows no percentage, progress bar, or star rating", () => {
    const { container } = render(<SkillsSection />);

    expect(container.textContent).not.toMatch(/\d+\s*%/);
    expect(container.textContent).not.toMatch(/[★☆]/);
    expect(container.querySelector("progress, meter, [role='progressbar']")).toBeNull();
  });
});

describe("AI-Assisted Engineering renders the four-step workflow", () => {
  it("renders all four steps in the approved order", () => {
    render(<AIWorkflowSection />);

    for (const activity of [
      /repository and requirement analysis/i,
      /implementation planning/i,
      /scoped implementation/i,
      /verification and debugging/i,
    ]) {
      expect(screen.getByText(activity)).toBeVisible();
    }
  });

  /**
   * FAC-AI-002, and the reason this section exists at all. Presenting AI as
   * the owner of final technical decisions is the failure mode; every step must
   * therefore state a human responsibility and a verification method.
   */
  it("states a human responsibility for every step", () => {
    const { container } = render(<AIWorkflowSection />);

    expect(container.textContent).toMatch(/Randi confirms the analysis/);
    expect(container.textContent).toMatch(/Randi owns the architecture/);
    expect(container.textContent).toMatch(/Randi reviews every change/);
    expect(container.textContent).toMatch(/Randi decides whether a fix is correct/);
  });

  it("records a corrected assumption rather than only successes", () => {
    const { container } = render(<AIWorkflowSection />);

    expect(container.textContent).toMatch(/accessibility gate/i);
  });

  it("leaves no draft marker in the published section", () => {
    const { container } = render(<AIWorkflowSection />);

    expect(container.textContent).not.toMatch(/DRAFT\s+PLACEHOLDER/);
  });
});
