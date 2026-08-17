import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ExperienceSection } from "@/components/sections/experience-section";

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

/**
 * The component is imported once, and each test swaps the fixture underneath it.
 *
 * It used to call `vi.resetModules()` and re-`import()` the component inside
 * every test, which meant re-transforming and re-evaluating the whole component
 * subgraph four times. That put ~1100ms of module work inside the *first* test
 * body against vitest's 5000ms default — a margin of about 4.5x, where the
 * other three tests had 150x.
 *
 * Under full-suite parallelism that margin ran out twice on 2026-08-17, and the
 * failure was worse than a slow test: vitest aborts at the await point, but the
 * import keeps resolving and calls `render()` afterwards, so a DOM belonging to
 * no test appeared during the *next* one. It failed with "Found multiple
 * elements", pointing the reader at an assertion that was never wrong.
 *
 * `vi.hoisted` gives the mock factory a mutable fixture it can close over, so
 * the module graph loads once at import time and no test body starts async work
 * that can outlive it. See the 2026-08-17 entry in docs/release-audit.md.
 */
const fixture = vi.hoisted(() => ({ roles: [] as unknown[] }));

vi.mock("@/domain/content/selectors", () => ({
  getPublishedExperience: () => fixture.roles,
  getTechnologyNames: () => [],
}));

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

function renderWith(roles: readonly ReturnType<typeof role>[]) {
  fixture.roles = [...roles];
  return render(<ExperienceSection />).container;
}

describe("roles group under one employer heading", () => {
  it("names the employer once, not once per role", () => {
    renderWith([
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

  it("spans the employer from earliest start to Present while a role is current", () => {
    renderWith([
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
  it("does not merge a returning employer across an intervening one", () => {
    const container = renderWith([
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

  it("marks the current role and no other", () => {
    renderWith([
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
