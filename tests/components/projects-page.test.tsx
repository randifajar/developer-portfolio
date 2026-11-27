import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProjectsPage from "@/app/projects/page";
import { ProjectsBackLink } from "@/components/project/project-filter";

/**
 * The projects page and its filter (UX3 7.4, 7.5), against the real content.
 *
 * The filter's state is the address, so these drive it through the address
 * as a visitor would: the query string the page loads with, and the buttons.
 */

afterEach(() => {
  window.history.replaceState(null, "", "/projects");
  vi.doUnmock("@/content/project-overviews");
  vi.resetModules();
});

/** The Backend filter's rows: the backend case study, then its overviews in order. */
const BACKEND_ROWS = [
  "Jury Process Management Integration",
  "Notification Hub and AWS Email Events",
  "Configurable Data Tables and Export Workflows",
  "Notification and Document Service Integrations",
  "Evaluation and Certification Platform",
];

const filterButtons = () =>
  within(screen.getByRole("group", { name: "Filter projects" })).getAllByRole("button");

const rowTitles = () =>
  within(screen.getByRole("region", { name: "Project list" }))
    .queryAllByRole("heading", { level: 3 })
    .map((heading) => heading.textContent);

describe("the projects page (UX3 7.4)", () => {
  it("opens with its own h1, the sanitization note, and a way back to the selected work", () => {
    render(<ProjectsPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Projects" })).toBeVisible();
    expect(screen.getByText(/sanitized names, diagrams, and workflow descriptions/)).toBeVisible();
    expect(screen.getByRole("link", { name: /overall/i })).toHaveAttribute("href", "/#work");
  });

  it("lists the published case studies, linked, then the published overviews, and nothing Draft", () => {
    render(<ProjectsPage />);

    expect(rowTitles()).toEqual([
      "Personal Developer Portfolio",
      "Jury Process Management Integration",
      "Jenkins CI/CD Migration and Agent Modernization",
      "Notification Hub and AWS Email Events",
      "Configurable Data Tables and Export Workflows",
      "Notification and Document Service Integrations",
      "Evaluation and Certification Platform",
    ]);
    expect(
      screen.getByRole("link", { name: "Read the case study: Personal Developer Portfolio" }),
    ).toHaveAttribute("href", "/projects/personal-developer-portfolio");
    // Only a case study has a page of its own (DEC-060).
    expect(screen.getAllByRole("link", { name: /^Read the case study/ })).toHaveLength(2);
    // The AI-assisted overview stays Draft by Randi's decision (OPEN-011).
    expect(screen.queryByText("AI-Assisted Development Across Three Applications")).toBeNull();
  });

  it("labels a case study with no discipline by its type", () => {
    render(<ProjectsPage />);

    expect(screen.getByText("Personal")).toBeVisible();
  });
});

describe("the projects filter (UX3 7.4)", () => {
  it("offers All, Backend, and Infrastructure, each with its count, All first", () => {
    render(<ProjectsPage />);

    // An overview tagged with both disciplines counts under each.
    expect(filterButtons().map((button) => button.textContent)).toEqual([
      "All7",
      "Backend5",
      "Infrastructure3",
    ]);
    expect(filterButtons()[0]).toHaveAttribute("aria-pressed", "true");
  });

  it("filters by discipline, keeps the choice in the address, and announces it", async () => {
    const user = userEvent.setup();
    render(<ProjectsPage />);

    await user.click(screen.getByRole("button", { name: /^Backend/ }));

    expect(screen.getByRole("button", { name: /^Backend/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(window.location.search).toBe("?discipline=backend");
    // The portfolio has no discipline, so it appears under All only.
    expect(rowTitles()).toEqual(BACKEND_ROWS);
    expect(screen.getByText("5 projects shown")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^All/ }));

    expect(window.location.search).toBe("");
    expect(rowTitles()).toHaveLength(7);
  });

  it("says so when a filter has nothing published, rather than showing an empty list", async () => {
    // The real content has published work under every filter now, so the
    // empty state is shown with the overviews taken away.
    vi.resetModules();
    vi.doMock("@/content/project-overviews", () => ({ projectOverviews: [] }));
    const { default: Page } = await import("@/app/projects/page");
    const user = userEvent.setup();
    render(<Page />);

    await user.click(screen.getByRole("button", { name: /^Infrastructure/ }));

    expect(rowTitles()).toEqual([]);
    expect(screen.getByText("Nothing is published under Infrastructure yet.")).toBeVisible();
  });

  it("reads the filter from the address it loads with", () => {
    window.history.replaceState(null, "", "/projects?discipline=backend");
    render(<ProjectsPage />);

    expect(rowTitles()).toEqual(BACKEND_ROWS);
  });

  it("treats an unknown value as All", () => {
    window.history.replaceState(null, "", "/projects?discipline=frontend");
    render(<ProjectsPage />);

    expect(filterButtons()[0]).toHaveAttribute("aria-pressed", "true");
    expect(rowTitles()).toHaveLength(7);
  });
});

describe("the case study's back link (UX3 7.5)", () => {
  it("returns to the filtered view the visitor last saw", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<ProjectsPage />);

    await user.click(screen.getByRole("button", { name: /^Backend/ }));
    unmount();
    render(<ProjectsBackLink />);

    expect(screen.getByRole("link", { name: /projects/i })).toHaveAttribute(
      "href",
      "/projects?discipline=backend",
    );
  });
});
