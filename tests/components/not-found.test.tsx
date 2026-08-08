import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFound from "@/app/not-found";

describe("Not Found (FAC-NAV-005)", () => {
  it("provides both required recovery actions", () => {
    render(<NotFound />);

    expect(screen.getByRole("link", { name: /return home/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /browse projects/i })).toHaveAttribute(
      "href",
      "/projects",
    );
  });

  it("renders exactly one h1", () => {
    render(<NotFound />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });
});

/**
 * The privacy contract (DEC-047, FAC-NAV-006, NFAC-SEC-006).
 *
 * Unknown, Draft, Archived, Private, and Restricted routes must all produce
 * this same page. Any wording that hints a project exists but is unavailable
 * would defeat that, so the copy is asserted against specifically.
 */
describe("Not Found reveals nothing about private content", () => {
  const leakyPhrases = [
    /not yet published/i,
    /draft/i,
    /archived/i,
    /private/i,
    /restricted/i,
    /unavailable/i,
    /coming soon/i,
    /you do not have access/i,
    /permission/i,
  ];

  it("uses no wording that implies hidden content exists", () => {
    const { container } = render(<NotFound />);
    const text = container.textContent ?? "";

    for (const phrase of leakyPhrases) {
      expect(text).not.toMatch(phrase);
    }
  });

  it("explains the outcome generically", () => {
    render(<NotFound />);

    expect(screen.getByText(/this page does not exist/i)).toBeInTheDocument();
  });

  it("offers the Resume action now that one is active (FAC-RESUME-002)", () => {
    render(<NotFound />);

    // The Resume is a legitimate recovery action from a dead end. What must
    // never appear here is anything hinting that hidden content exists — that
    // is asserted separately above.
    expect(screen.getByRole("link", { name: /view resume/i })).toHaveAttribute(
      "href",
      "/resume.pdf",
    );
  });
});
