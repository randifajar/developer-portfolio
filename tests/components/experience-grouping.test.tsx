import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * Employer grouping.
 *
 * The section used to repeat the company name once per role, leaving the reader
 * to infer that Internship → Contract → Full-time was a promotion path rather
 * than three unrelated jobs. The employer is now stated once with the roles
 * nested beneath it.
 *
 * Two properties are worth guarding, and only one of them has a subject in the
 * real content:
 *
 *   1. The name appears once per employer, not once per role.
 *   2. Only *consecutive* roles group. Randi has one employer today, so this is
 *      currently indistinguishable from grouping by name globally — and it is
 *      exactly the kind of difference that becomes a truthfulness bug the first
 *      time someone leaves an employer and returns.
 *
 * The second is the reason this file exists. It is tested against a fixture
 * that real content does not yet produce, because waiting for the content to
 * produce it means shipping the bug first.
 */

afterEach(() => {
  vi.resetModules();
});

interface RoleOverrides {
  readonly id: string;
  readonly companyName: string;
  readonly position: string;
  readonly startDate: string;
  readonly endDate?: string;
  readonly isCurrent?: boolean;
}

function role(overrides: RoleOverrides) {
  return {
    summary: "Role overview.",
    responsibilities: ["Did the work."],
    technologyIds: [],
    isCurrent: false,
    ...overrides,
  };
}

async function renderWith(roles: readonly ReturnType<typeof role>[]) {
  vi.resetModules();

  vi.doMock("@/domain/content/selectors", () => ({
    getPublishedExperience: vi.fn(() => roles),
    getTechnologyNames: vi.fn(() => []),
  }));

  const { ExperienceSection } = await import("@/components/sections/experience-section");
  return render(<ExperienceSection />).container;
}

describe("roles group under one employer heading", () => {
  it("names the employer once, not once per role", async () => {
    await renderWith([
      role({
        id: "a",
        companyName: "Acme",
        position: "Senior Engineer",
        startDate: "2025-04-01",
        isCurrent: true,
      }),
      role({
        id: "b",
        companyName: "Acme",
        position: "Engineer",
        startDate: "2024-11-01",
        endDate: "2025-03-01",
      }),
      role({
        id: "c",
        companyName: "Acme",
        position: "Intern",
        startDate: "2024-07-01",
        endDate: "2024-10-01",
      }),
    ]);

    // Three roles, one employer heading. The old markup produced three.
    expect(screen.getAllByRole("heading", { name: "Acme" })).toHaveLength(1);
    expect(screen.getAllByRole("heading", { level: 4 })).toHaveLength(3);
  });

  it("spans the employer from earliest start to Present while a role is current", async () => {
    await renderWith([
      role({
        id: "a",
        companyName: "Acme",
        position: "Engineer",
        startDate: "2025-04-01",
        isCurrent: true,
      }),
      role({
        id: "b",
        companyName: "Acme",
        position: "Intern",
        startDate: "2024-07-01",
        endDate: "2024-10-01",
      }),
    ]);

    expect(screen.getByText("2024 — Present")).toBeInTheDocument();
  });

  /**
   * The property the real content cannot currently exercise.
   *
   * Grouping by name globally would render Acme, Acme, Other — implying an
   * unbroken run at Acme that never happened, and moving Other out of
   * chronological position. Grouping consecutive runs keeps the history true.
   */
  it("does not merge a returning employer across an intervening one", async () => {
    const container = await renderWith([
      role({
        id: "a",
        companyName: "Acme",
        position: "Staff Engineer",
        startDate: "2025-01-01",
        isCurrent: true,
      }),
      role({
        id: "b",
        companyName: "Other Co",
        position: "Engineer",
        startDate: "2023-01-01",
        endDate: "2024-12-01",
      }),
      role({
        id: "c",
        companyName: "Acme",
        position: "Junior Engineer",
        startDate: "2021-01-01",
        endDate: "2022-12-01",
      }),
    ]);

    const employers = screen
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);

    // Three groups, in chronological order, with Acme appearing twice —
    // separately, because the two spells were separate.
    expect(employers).toEqual(["Acme", "Other Co", "Acme"]);

    // And each group keeps its own role, rather than the first Acme absorbing
    // the second.
    const groups = container.querySelectorAll("ol");
    expect(groups).toHaveLength(3);
    expect(within(groups[0] as HTMLElement).getByText("Staff Engineer")).toBeInTheDocument();
    expect(within(groups[2] as HTMLElement).getByText("Junior Engineer")).toBeInTheDocument();
  });

  it("marks the current role and no other", async () => {
    await renderWith([
      role({
        id: "a",
        companyName: "Acme",
        position: "Engineer",
        startDate: "2025-04-01",
        isCurrent: true,
      }),
      role({
        id: "b",
        companyName: "Acme",
        position: "Intern",
        startDate: "2024-07-01",
        endDate: "2024-10-01",
      }),
    ]);

    expect(screen.getAllByText("Current")).toHaveLength(1);
  });
});
