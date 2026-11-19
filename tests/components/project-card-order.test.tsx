import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectCard } from "@/components/project/project-card";
import type { ProjectCaseStudy } from "@/domain/content/schemas";

/**
 * The field order is a product decision (SUP-006, v1.1 Issue 6) and nothing
 * asserted it — the same gap the homepage section order had.
 *
 * The existing presence tests assert that each field renders. Every one of them
 * passes with the fields in any sequence, which is exactly the failure mode
 * worth guarding: the decision that a recruiter should read "what did he do"
 * before "what was the project" is invisible to a presence test.
 *
 * So this compares document positions. It is the assertion that fails when
 * someone moves a line, which a presence test never will.
 *
 * v2 had two formats: editorial modules on the homepage and cards on the
 * Projects Index, asserted here from one table. V3 P5 replaced the homepage, and
 * its Selected work lists rows that carry no role (UX3 7.1), so the module went
 * with it. The card stays until the V3 projects index (P7), and the table stays
 * too: a format added later without an entry here is the drift this file
 * exists to prevent.
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

  expect(index, `not found: ${String(text)}`).toBeGreaterThanOrEqual(0);
  return index;
}

/**
 * Every format, one table. A new presentation added later without an entry here
 * would be the drift this file exists to prevent.
 */
const FORMATS = [
  [
    "card (Projects Index)",
    () => render(<ProjectCard project={project} technologyNames={TECHNOLOGIES} />).container,
  ],
] as const;

for (const [format, renderFormat] of FORMATS) {
  describe(`the ${format} answers recruiter questions in order (SUP-006)`, () => {
    it("puts my role above the summary", () => {
      const container = renderFormat();

      expect(positionOf(container, "My role:")).toBeLessThan(
        positionOf(container, "A short summary of the project."),
      );
    });

    it("runs type and status, then title, then role, then summary, then the link", () => {
      const container = renderFormat();

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
     * Randi where the summary above it may describe work a team delivered. A
     * bare "Role:" would satisfy any presence test while losing that.
     */
    it("scopes the role to Randi rather than labelling it generically", () => {
      expect(renderFormat().textContent).toContain("My role:");
    });
  });
}
