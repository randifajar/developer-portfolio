import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectCard } from "@/components/project/project-card";
import type { ProjectCaseStudy } from "@/domain/content/schemas";

/**
 * The card's field order is a product decision (SUP-006, v1.1 Issue 6) and
 * nothing asserted it — the same gap the homepage section order had.
 *
 * The existing card tests assert that each field renders. Every one of them
 * passes with the fields in any sequence, which is exactly the failure mode
 * worth guarding: the decision that a recruiter should read "what did he do"
 * before "what was the project" is invisible to a presence test.
 *
 * So this compares document positions. It is the assertion that fails when
 * someone moves a line, which a presence test never will.
 */

const project = {
  id: "project-a",
  slug: "alpha-project",
  title: "Alpha Project",
  summary: "A short summary of the project.",
  role: "Backend Developer — integration work",
  projectType: "professional",
  deliveryStatus: "completed",
  publicationStatus: "published",
  confidentialityClass: "sanitized",
} as unknown as ProjectCaseStudy;

const TECHNOLOGIES = ["TypeScript", "MongoDB"];

/**
 * Text nodes are compared through their containing element, since
 * compareDocumentPosition needs nodes rather than strings.
 */
function positionOf(container: HTMLElement, text: string | RegExp): number {
  const elements = Array.from(container.querySelectorAll("*"));

  const index = elements.findIndex((element) => {
    const own = Array.from(element.childNodes)
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent ?? "")
      .join("");

    return typeof text === "string" ? own.includes(text) : text.test(own);
  });

  expect(index, `not found in the card: ${String(text)}`).toBeGreaterThanOrEqual(0);
  return index;
}

describe("the project card answers recruiter questions in order (SUP-006)", () => {
  it("puts my role above the summary", () => {
    const { container } = render(<ProjectCard project={project} technologyNames={TECHNOLOGIES} />);

    expect(positionOf(container, "My role:")).toBeLessThan(
      positionOf(container, "A short summary of the project."),
    );
  });

  it("runs type and status, then title, then role, then summary, then the link", () => {
    const { container } = render(<ProjectCard project={project} technologyNames={TECHNOLOGIES} />);

    const sequence = [
      positionOf(container, "Professional work"),
      positionOf(container, "Alpha Project"),
      positionOf(container, "My role:"),
      positionOf(container, "A short summary of the project."),
      positionOf(container, "View case study"),
    ];

    expect(sequence).toEqual([...sequence].sort((a, b) => a - b));
  });

  /**
   * The possessive is the whole point of the label — it scopes the claim to
   * Randi where the summary above it may describe work a team delivered. A bare
   * "Role:" would satisfy any presence test while losing that.
   */
  it("scopes the role to Randi rather than labelling it generically", () => {
    const { container } = render(<ProjectCard project={project} technologyNames={TECHNOLOGIES} />);

    expect(container.textContent).toContain("My role:");
  });
});
