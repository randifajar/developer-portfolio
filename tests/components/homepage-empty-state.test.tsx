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
  // Skills and AI-Assisted Engineering left this list on 2026-08-08, then Hero
  // and About followed when the Professional Profile was published. Only Work
  // Experience is still Draft. Each is asserted positively below as it lands.
  const emptySections = [["Work Experience", ExperienceSection]] as const;

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

describe("Hero presents the professional identity", () => {
  it("renders the name as the page heading", () => {
    render(<HeroSection />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
      "Randi Fajar Wicaksono",
    );
  });

  it("states the professional title and headline", () => {
    const { container } = render(<HeroSection />);

    expect(container.textContent).toContain("Backend-Focused Full-Stack Developer");
    expect(container.textContent).toMatch(/seeking remote backend/i);
  });

  it("states location and remote availability (FAC-PROFILE-002)", () => {
    const { container } = render(<HeroSection />);

    expect(container.textContent).toContain("Yogyakarta, Indonesia");
    expect(container.textContent).toMatch(/remote/i);
  });

  it("renders the photograph with descriptive alternative text", () => {
    render(<HeroSection />);

    const image = screen.getByRole("img");

    // NFAC-A11Y-004: alt text describes what the image conveys. "photo of
    // Randi" would pass a linter and tell a screen-reader user nothing.
    expect(image.getAttribute("alt")).toMatch(/pale blue sky/i);
    expect(image.getAttribute("alt")).not.toMatch(/^(image|photo|picture)\b/i);
  });

  it("offers the primary action into the work", () => {
    render(<HeroSection />);

    expect(screen.getByRole("link", { name: /view projects/i })).toBeVisible();
  });

  it("leaks no draft marker", () => {
    const { container } = render(<HeroSection />);

    expect(container.textContent).not.toMatch(/DRAFT\s+PLACEHOLDER/);
  });
});

describe("About presents the professional summary", () => {
  it("renders the summary Randi wrote", () => {
    const { container } = render(<AboutSection />);

    expect(container.textContent).toMatch(/more than two years of hands-on experience/i);
  });

  /**
   * FAC-AI-002 and NFAC-CONTENT-002. The summary discloses AI use and states
   * what stays his responsibility. Losing the second half would leave the
   * disclosure reading as though the tools own the outcome.
   */
  it("keeps the AI disclosure paired with the responsibility it retains", () => {
    const { container } = render(<AboutSection />);

    expect(container.textContent).toMatch(/Codex, Claude Code, and ChatGPT/);
    expect(container.textContent).toMatch(/while keeping responsibility for/i);
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
