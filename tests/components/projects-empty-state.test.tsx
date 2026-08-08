import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectsEmptyState } from "@/components/project/projects-empty-state";
import { ROUTES, SECTION_IDS } from "@/lib/constants";

/**
 * The Projects Index empty state (FAC-PROJECTS-004).
 *
 * These exist because publishing the first case study made this state
 * unreachable in the browser, which removed its only end-to-end coverage. The
 * component now takes props instead of reading selectors, so it can be
 * exercised regardless of what is Published — including the states that no
 * longer occur on the live site.
 */
describe("ProjectsEmptyState", () => {
  it("states plainly that case studies are being prepared", () => {
    render(<ProjectsEmptyState />);

    expect(screen.getByRole("heading", { name: /case studies are being prepared/i })).toBeVisible();
  });

  it("offers a route home", () => {
    render(<ProjectsEmptyState />);

    expect(screen.getByRole("link", { name: /return home/i })).toHaveAttribute("href", ROUTES.home);
  });

  it("falls back to the contact section when no channel is Published", () => {
    render(<ProjectsEmptyState />);

    expect(screen.getByRole("link", { name: /^contact$/i })).toHaveAttribute(
      "href",
      `${ROUTES.home}#${SECTION_IDS.contact}`,
    );
  });

  it("uses the Published contact channel when there is one", () => {
    render(
      <ProjectsEmptyState contact={{ label: "Email Randi", href: "mailto:person@example.com" }} />,
    );

    expect(screen.getByRole("link", { name: "Email Randi" })).toHaveAttribute(
      "href",
      "mailto:person@example.com",
    );
  });

  /**
   * FAC-RESUME-003. The site must never advertise a Resume it cannot deliver,
   * and must never imply a download succeeded.
   */
  it("offers no Resume action when no Resume is active", () => {
    render(<ProjectsEmptyState />);

    expect(screen.queryByRole("link", { name: /resume/i })).not.toBeInTheDocument();
  });

  it("offers the Resume when one is active", () => {
    render(<ProjectsEmptyState resumePath="/resume.pdf" />);

    expect(screen.getByRole("link", { name: /view resume/i })).toHaveAttribute(
      "href",
      "/resume.pdf",
    );
  });

  /**
   * FAC-PROJECTS-004 and FAC-HOME-004 forbid inventing work to fill the space.
   * An empty state that apologises or promises is worse than one that simply
   * says what is true.
   */
  it("invents no placeholder project and makes no promise about timing", () => {
    const { container } = render(<ProjectsEmptyState />);

    expect(container.textContent).not.toMatch(/coming soon/i);
    expect(container.textContent).not.toMatch(/lorem ipsum/i);
    expect(container.textContent).not.toMatch(/sorry|apolog/i);
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });

  it("keeps its heading below the page heading so the outline stays valid", () => {
    // The page renders an h1. An empty state that also claimed h1 would give
    // the route two (NFAC-A11Y-003).
    const { container } = render(<ProjectsEmptyState />);

    expect(container.querySelector("h1")).toBeNull();
    expect(container.querySelector("h2")).not.toBeNull();
  });
});
