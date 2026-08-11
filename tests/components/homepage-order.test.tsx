import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import { NAVIGATION_LINKS } from "@/components/layout/navigation-links";
import { SECTION_IDS } from "@/lib/constants";

/**
 * The homepage section order is an approved product decision (SUP-005, formerly
 * DEC-025). Until this file, nothing asserted it.
 *
 * That is worth stating plainly, because it is the same shape as the other
 * defects this project has found: the order was decided, documented, and
 * implemented, and the only thing holding it in place was that no one had
 * reordered the JSX yet. A section could have been moved — or dropped — in any
 * refactor and every check would still have been green.
 *
 * So this asserts document position rather than mere presence. Presence tests
 * already exist in homepage-sections.test.tsx and would pass under any order.
 */

/** Section ids in their approved order. Hero has no id; it owns the h1. */
const APPROVED_SECTION_ORDER = [
  SECTION_IDS.about,
  SECTION_IDS.experience,
  SECTION_IDS.projects,
  SECTION_IDS.skills,
  SECTION_IDS.aiWorkflow,
  SECTION_IDS.contact,
] as const;

describe("the homepage renders sections in the approved order", () => {
  it("places Work Experience before Selected Projects (SUP-005)", () => {
    const { container } = render(<Home />);

    const experience = container.querySelector(`#${SECTION_IDS.experience}`);
    const projects = container.querySelector(`#${SECTION_IDS.projects}`);

    expect(experience, "Work Experience section missing").not.toBeNull();
    expect(projects, "Selected Projects section missing").not.toBeNull();

    // DOCUMENT_POSITION_FOLLOWING is set when the argument comes after the
    // node. Comparing positions is what makes this fail on a reorder; asserting
    // both exist would not.
    const relation = experience!.compareDocumentPosition(projects!);

    expect(
      relation & Node.DOCUMENT_POSITION_FOLLOWING,
      "Selected Projects renders before Work Experience",
    ).toBeTruthy();
  });

  it("renders every approved section exactly once, in sequence", () => {
    const { container } = render(<Home />);

    const rendered = Array.from(container.querySelectorAll("[id]"))
      .map((element) => element.id)
      .filter((id): id is (typeof APPROVED_SECTION_ORDER)[number] =>
        (APPROVED_SECTION_ORDER as readonly string[]).includes(id),
      );

    expect(rendered).toEqual([...APPROVED_SECTION_ORDER]);
  });
});

/**
 * The header is a table of contents with Projects hoisted to its own route, so
 * the four anchor links must not contradict the page they describe.
 *
 * Only the anchors are compared. Projects targets /projects rather than a
 * section, so its position is a presentation decision rather than a claim about
 * page order — but it must still not sit ahead of Experience, which is the
 * inconsistency this release removed.
 */
describe("the header agrees with the homepage about what comes first", () => {
  it("lists Experience before Projects", () => {
    const labels = NAVIGATION_LINKS.map((link) => link.label);

    expect(labels.indexOf("Experience")).toBeLessThan(labels.indexOf("Projects"));
  });

  it("lists its section anchors in homepage order", () => {
    const anchorOrder = NAVIGATION_LINKS.map((link) => link.href)
      .filter((href) => href.includes("#"))
      .map((href) => href.split("#")[1]);

    const expected = APPROVED_SECTION_ORDER.filter((id) =>
      anchorOrder.includes(id),
    ) as readonly string[];

    expect(anchorOrder).toEqual([...expected]);
  });
});
