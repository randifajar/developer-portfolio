import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ModesLayout from "@/app/(modes)/layout";
import OverallPage from "@/app/(modes)/page";
import { describeResumes } from "@/components/overall/explore-section";

/**
 * The Overall page against the real, unmocked content (UX3 7.1).
 *
 * This replaced the v2 homepage suites in V3 P5. What they guarded and still
 * applies is carried over here — one h1, no draft marker, no availability
 * statement, dates at month precision, no internal identifiers — alongside the
 * V3 structure: the section order and each section's surface.
 *
 * The page is rendered inside its layout, as Next.js renders it, because the
 * h1 lives in the layout's hero.
 */

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

function renderOverall() {
  return render(
    <ModesLayout>
      <OverallPage />
    </ModesLayout>,
  );
}

/** The sections in order, each by its accessible name, with its surface. */
const APPROVED_SECTIONS = [
  ["Randi Fajar Wicaksono", "dark"],
  ["Profile", "light"],
  ["Two disciplines, one way of working.", "navy"],
  ["Three chapters, one direction.", "white"],
  ["Backend and infrastructure, side by side.", "light"],
  ["Understand it, change it carefully, prove it works.", "blue"],
  ["Education & credentials", "white"],
  ["Explore further", "dark"],
] as const;

describe("Overall structure (UX3 7.1)", () => {
  it("renders the approved sections in order, each on its approved surface", () => {
    const { container } = renderOverall();

    const rendered = Array.from(container.querySelectorAll("section[data-surface]")).map(
      (section) => {
        const heading = document.getElementById(section.getAttribute("aria-labelledby") ?? "");
        return [heading?.textContent?.trim(), section.getAttribute("data-surface")];
      },
    );

    expect(rendered).toEqual(APPROVED_SECTIONS.map((entry) => [...entry]));
  });

  it("names every section, so each is a landmark a screen reader can reach", () => {
    renderOverall();

    for (const [name] of APPROVED_SECTIONS) {
      expect(screen.getByRole("region", { name })).toBeInTheDocument();
    }
  });

  it("has exactly one h1, the name (NFAC-A11Y-003)", () => {
    renderOverall();

    const [h1, ...others] = screen.getAllByRole("heading", { level: 1 });

    expect(others).toHaveLength(0);
    expect(h1).toHaveAccessibleName("Randi Fajar Wicaksono");
  });

  it("sends the hero action to the profile", () => {
    const { container } = renderOverall();

    expect(screen.getByRole("link", { name: /explore the journey/i })).toHaveAttribute(
      "href",
      "#profile",
    );
    expect(container.querySelector("#profile")).toHaveAttribute("data-surface", "light");
  });
});

describe("Overall content (UX3 7.1)", () => {
  it("states the profile facts from the records", () => {
    renderOverall();
    const facts = within(screen.getByRole("region", { name: "Profile" }));

    expect(facts.getByText("Sleman, Yogyakarta, Indonesia")).toBeVisible();
    // The role ended on 27 November 2026, so it is the most recent, never the
    // current one (DEC-072).
    expect(facts.getByText("Most recent role")).toBeVisible();
    expect(facts.queryByText("Current role")).toBeNull();
    expect(facts.getByText("AI Delivery Engineer, Infrastructure Team")).toBeVisible();
    expect(facts.getByText("Zettabyte Pte Ltd")).toBeVisible();
    expect(facts.getByText(/^\d+\+ years? in software delivery$/)).toBeVisible();
    expect(facts.getByText("Bachelor of Informatics")).toBeVisible();
  });

  it("tells the career in three chapters, each role with its own dates (DEC-020)", () => {
    renderOverall();
    const career = within(screen.getByRole("region", { name: "Three chapters, one direction." }));

    expect(career.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "2024: Learning backend from the inside.",
      "2025: Services, data, and the failures between them.",
      "2026: Beyond the application.",
    ]);

    const roles: readonly (readonly [string, string])[] = [
      ["Backend Developer Intern", "Jul 2024 – Oct 2024"],
      ["Backend Developer, Contract", "Nov 2024 – Mar 2025"],
      ["Backend Developer", "Apr 2025 – Jul 2026"],
      // Ended on 27 November 2026 (DEC-072).
      ["AI Delivery Engineer, Infrastructure Team", "Aug 2026 – Nov 2026"],
    ];

    for (const [position, dates] of roles) {
      const role = career.getByText(position, { selector: "span" }).closest("li");
      expect(role, position).toHaveTextContent(dates);
    }
  });

  it("links each mode page once, from the last chapter that belongs to it", () => {
    renderOverall();
    const chapters = within(
      screen.getByRole("region", { name: "Three chapters, one direction." }),
    ).getAllByRole("article");

    const linksIn = (chapter: HTMLElement) =>
      within(chapter)
        .queryAllByRole("link")
        .map((link) => link.getAttribute("href"));

    expect(chapters.map(linksIn)).toEqual([[], ["/backend"], ["/infrastructure"]]);
  });

  it("shows the case study with a discipline, linked, then the first three overviews", () => {
    renderOverall();
    const work = within(
      screen.getByRole("region", { name: "Backend and infrastructure, side by side." }),
    );

    expect(
      work.getByRole("link", {
        name: "Read the case study: Jury Process Management Integration",
      }),
    ).toHaveAttribute("href", "/projects/jury-process-management-integration");

    // The approved mockup's four rows: the case study, then the first three
    // Published overviews, which have no page of their own and never link
    // (DEC-060). The personal portfolio has no discipline (UX3 7.4).
    expect(work.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "Jury Process Management Integration",
      "Jenkins CI/CD Migration and Agent Modernization",
      "Notification Hub and AWS Email Events",
      "Configurable Data Tables and Export Workflows",
    ]);
    expect(work.getAllByRole("link", { name: /^Read the case study/ })).toHaveLength(1);
    expect(work.queryByText("Personal Developer Portfolio")).toBeNull();
    expect(work.getByRole("link", { name: "All projects" })).toHaveAttribute("href", "/projects");
  });

  it("lists the six practices in order", () => {
    renderOverall();
    const approach = within(
      screen.getByRole("region", {
        name: "Understand it, change it carefully, prove it works.",
      }),
    );

    expect(approach.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "Read the flow first",
      "Change across boundaries",
      "Debug in every environment",
      "Verify the release",
      "Review and document",
      "Own the AI's output",
    ]);
  });

  it("lists education, certifications, and languages as the résumés state them", () => {
    renderOverall();
    const education = within(screen.getByRole("region", { name: "Education & credentials" }));

    expect(education.getByText("Universitas Teknologi Yogyakarta")).toBeVisible();
    expect(
      education.getByText("Bachelor of Informatics · GPA 3.82/4.00 · Sep 2018 – May 2023"),
    ).toBeVisible();
    expect(education.getByText("Microsoft Certified: Azure AI Fundamentals")).toBeVisible();
    expect(education.getByText("Professional working proficiency")).toBeVisible();
  });

  it("offers the onward paths, with the Résumé row opening the header's menu", () => {
    renderOverall();
    const explore = within(screen.getByRole("region", { name: "Explore further" }));

    expect(explore.getByRole("link", { name: "Backend" })).toHaveAttribute("href", "/backend");
    expect(explore.getByRole("link", { name: "Infrastructure" })).toHaveAttribute(
      "href",
      "/infrastructure",
    );
    expect(explore.getByRole("link", { name: "All projects" })).toHaveAccessibleDescription(
      /^\w+ pieces? of work, by discipline\.$/,
    );

    // Only the backend résumé is published, so the row names that one (DEC-074).
    const resumes = explore.getByRole("button", { name: "Résumé" });
    expect(resumes).toHaveAttribute("popovertarget", "resume-menu");
    expect(resumes).toHaveAccessibleDescription("Backend engineering résumé.");
  });
});

describe("the Résumé row's wording comes from the published résumés (DEC-074)", () => {
  it("names the one published résumé", () => {
    expect(describeResumes(["backend"])).toEqual({
      label: "Résumé",
      description: "Backend engineering résumé.",
    });
    expect(describeResumes(["infrastructure"])).toEqual({
      label: "Résumé",
      description: "Infrastructure engineering résumé.",
    });
  });

  it("names both once both are published, with no copy change", () => {
    expect(describeResumes(["backend", "infrastructure"])).toEqual({
      label: "Résumés",
      description: "Backend and infrastructure versions.",
    });
  });

  it("offers no row when no résumé is published, since nothing would open", () => {
    expect(describeResumes([])).toBeNull();
  });
});

describe("Overall carries over the v2 homepage guarantees", () => {
  it("leaks no draft marker", () => {
    const { container } = renderOverall();

    expect(container.textContent).not.toMatch(/DRAFT\s+PLACEHOLDER/);
  });

  /**
   * SUP-011. No leading word boundary: textContent joins adjacent elements
   * without a space, so a restored sentence after a heading would read
   * "…ProfileOpen to…". The v2 version of this check was found passing with
   * the sentence put back because of exactly that.
   */
  it("states no availability", () => {
    const { container } = renderOverall();

    expect(container.textContent).not.toMatch(/open to/i);
  });

  it("shows dates at month precision, never a day (DEC-020)", () => {
    const { container } = renderOverall();
    const text = container.textContent ?? "";

    expect(text).not.toMatch(/\d{4}-\d{2}-\d{2}/);
    expect(text).not.toMatch(/\b\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/);
  });

  it("names no internal code, private address, or SRE title (NFAC-SEC-002, UX3 7.3)", () => {
    const { container } = renderOverall();
    const text = container.textContent ?? "";

    expect(text).not.toMatch(/\b[A-Z]{2,}_\d/);
    expect(text).not.toMatch(/https?:\/\/(localhost|10\.|192\.168\.)/);
    expect(text).not.toMatch(/\bSRE\b|site reliability/i);
  });
});
