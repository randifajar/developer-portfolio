import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AboutSection } from "@/components/sections/about-section";
import { AIWorkflowSection } from "@/components/sections/ai-workflow-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { getFeaturedProjects } from "@/domain/content/selectors";

/**
 * Homepage sections against the real, unmocked selectors.
 *
 * This file began as the omission suite: every section was Draft, and each
 * asserted it rendered nothing rather than a heading with an empty body
 * (FAC-HOME-005, UX 17 — an announced-but-empty section is worse for a
 * screen-reader user than an absent one).
 *
 * As of 2026-08-08 every homepage section has published content, so that
 * assertion has no subject left. The omission path still exists in each
 * component and is now unreachable against real content — the same situation
 * that led ProjectsEmptyState to be extracted so it could be tested from
 * props. These sections have not been given that treatment, so the omission
 * behaviour is currently uncovered. It is recorded here rather than papered
 * over with a section mocked into emptiness, which would assert the mock.
 *
 * What follows asserts what each section actually renders.
 */
describe("every homepage section has content", () => {
  const sections = [
    ["Hero", HeroSection],
    ["About", AboutSection],
    ["Work Experience", ExperienceSection],
    ["Selected Projects", ProjectsSection],
    ["Technical Skills", SkillsSection],
    ["AI-Assisted Engineering", AIWorkflowSection],
  ] as const;

  for (const [name, Section] of sections) {
    it(`${name} renders`, () => {
      const { container } = render(<Section />);

      expect(container).not.toBeEmptyDOMElement();
    });
  }

  it("leaks no draft marker anywhere on the homepage", () => {
    for (const [name, Section] of sections) {
      const { container, unmount } = render(<Section />);

      expect(container.textContent, name).not.toMatch(/DRAFT\s+PLACEHOLDER/);
      unmount();
    }
  });
});

describe("Work Experience presents the real employment history", () => {
  it("renders all three roles", () => {
    render(<ExperienceSection />);

    expect(screen.getByText("Backend Developer")).toBeVisible();
    expect(screen.getByText("Backend Developer, Contract")).toBeVisible();
    expect(screen.getByText("Backend Developer Intern")).toBeVisible();
  });

  it("puts the current role first and marks it current (FAC-EXP-001)", () => {
    const { container } = render(<ExperienceSection />);
    const text = container.textContent ?? "";

    expect(text.indexOf("Backend Developer Intern")).toBeGreaterThan(
      text.indexOf("Backend Developer,"),
    );
    expect(screen.getByText("Current")).toBeVisible();
  });

  /**
   * DEC-020 and FAC-EXP-002. Dates are stored with a day but the section
   * renders month and year, so this asserts the reader never sees a
   * day-precision date the CV might contradict.
   */
  it("displays dates at month precision, never a day", () => {
    const { container } = render(<ExperienceSection />);
    const text = container.textContent ?? "";

    expect(text).toMatch(/Apr 2025/);
    expect(text).toMatch(/Present/);
    expect(text).not.toMatch(/\d{4}-\d{2}-\d{2}/);
    expect(text).not.toMatch(/\b\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/);
  });

  it("names no internal system, project code, or customer (NFAC-SEC-002)", () => {
    const { container } = render(<ExperienceSection />);
    const text = container.textContent ?? "";

    // Uppercase-letters + underscore + digits is the shape of the internal
    // codes that must never reach content.
    expect(text).not.toMatch(/\b[A-Z]{2,}_\d/);
    expect(text).not.toMatch(/https?:\/\/(localhost|10\.|192\.168\.)/);
  });
});

describe("Selected Projects renders both launch case studies", () => {
  it("renders two cards (FAC-HOME-004)", () => {
    render(<ProjectsSection />);

    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("links each card to its case study", () => {
    render(<ProjectsSection />);

    expect(screen.getByRole("link", { name: "Personal Developer Portfolio" })).toHaveAttribute(
      "href",
      "/projects/personal-developer-portfolio",
    );
    expect(
      screen.getByRole("link", { name: "Jury Process Management Integration" }),
    ).toHaveAttribute("href", "/projects/jury-process-management-integration");
  });

  it("pads nothing — two projects means two cards, no filler (FAC-HOME-004)", () => {
    const { container } = render(<ProjectsSection />);

    expect(container.textContent).not.toMatch(/coming soon/i);
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  /**
   * FAC-PROJECT-004. Each card must show the status its evidence supports. The
   * professional work is "Completed" because no production verification was
   * performed on it; the portfolio itself is "Production" because one was, and
   * is recorded. A card that silently upgraded its label would misrepresent the
   * work on the first screen a recruiter sees.
   *
   * This reads the status attribute on each specific card rather than scanning
   * the section's text. The previous version did the latter and was vacuous:
   * container.textContent concatenates adjacent elements without separators, so
   * the section reads "...Personal projectProduction. Verified...", and
   * /\bProduction\b/ found no word boundary between "project" and "Production".
   * It would have passed even if the professional card had been upgraded, which
   * is the one thing it existed to catch.
   */
  function statusOf(title: string): string | null | undefined {
    const card = screen.getByRole("link", { name: title }).closest("article");

    return card?.querySelector("[data-status]")?.getAttribute("data-status");
  }

  it("shows each card the delivery status its evidence supports", () => {
    render(<ProjectsSection />);

    expect(statusOf("Jury Process Management Integration")).toBe("completed");
    expect(statusOf("Personal Developer Portfolio")).toBe("production");
  });

  it("never shows Production for work without a verified confirmation", () => {
    render(<ProjectsSection />);

    // The rule restated at the rendering layer: only a project carrying a
    // productionConfirmation may display that badge.
    for (const project of getFeaturedProjects()) {
      const status = statusOf(project.title);

      if (status === "production") {
        expect(project.productionConfirmation?.verified, project.slug).toBe(true);
      }
    }
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
