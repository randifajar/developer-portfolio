import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import { SURFACE_RANK, type SectionSurface } from "@/components/layout/section";
import { SECTION_IDS } from "@/lib/constants";

/**
 * Surface assignment, and the rule that replaces SUP-007's mechanism.
 *
 * v1.1 reduced the AI Workflow section's prominence by removing its emphasis
 * background, leaving Work Experience as the only section with one. That
 * mechanism is void in v2, where every section carries a band — but the
 * decision it encoded is not:
 *
 *     reduce prominence, not honesty
 *
 * Restated for surfaces: AI Workflow may never occupy a tier above Work
 * Experience or Selected Work. That is what this file asserts.
 *
 * Worth stating plainly: SUP-007 has never had a test. It was measured once, in
 * pixels, and then held in place by nothing. A section could have been promoted
 * back to the emphasis treatment in any refactor and the whole suite would have
 * stayed green — which is the failure shape this project keeps finding.
 */

function surfaceOf(container: HTMLElement, id: string): SectionSurface {
  const section = container.querySelector(`#${id}`);

  expect(section, `no section with id "${id}"`).not.toBeNull();

  const surface = section!.getAttribute("data-surface");

  expect(surface, `#${id} carries no data-surface`).not.toBeNull();

  return surface as SectionSurface;
}

/**
 * Sections adopt the primitive one phase at a time, so this file has to
 * distinguish "not migrated yet" from "migrated and wrong".
 *
 * The distinction is the attribute, not the element: an unmigrated section
 * still renders with its id, it simply has no `data-surface`. The first version
 * of this file keyed on the element existing, which meant the guard never fired
 * and the rank comparison ran against `undefined`.
 */
function migratedSections(container: HTMLElement): Map<string, SectionSurface> {
  const migrated = new Map<string, SectionSurface>();

  for (const id of Object.values(SECTION_IDS)) {
    const surface = container.querySelector(`#${id}`)?.getAttribute("data-surface");
    if (surface !== null && surface !== undefined) {
      migrated.set(id, surface as SectionSurface);
    }
  }

  return migrated;
}

describe("sections declare a surface", () => {
  it("declares a valid surface wherever one is declared at all", () => {
    const { container } = render(<Home />);
    const migrated = migratedSections(container);

    // Guards against a vacuous pass: if adoption regressed to zero this file
    // would otherwise assert nothing while staying green.
    expect(migrated.size, "no section has adopted the Section primitive").toBeGreaterThan(0);

    for (const [id, surface] of migrated) {
      expect(Object.keys(SURFACE_RANK), `#${id} has surface "${surface}"`).toContain(surface);
    }
  });

  it("About reads on the light surface", () => {
    const { container } = render(<Home />);

    expect(surfaceOf(container, SECTION_IDS.about)).toBe("light");
  });
});

/**
 * The SUP-007 rule itself.
 *
 * Written against ranks rather than literal surface names so it keeps meaning
 * if the palette is retuned: what matters is the ordering, not that Experience
 * happens to be "dark" today.
 */
describe("AI Workflow never outranks the evidence sections (SUP-007)", () => {
  it("sits no higher than Work Experience or Selected Work", () => {
    const { container } = render(<Home />);
    const migrated = migratedSections(container);

    const workflow = migrated.get(SECTION_IDS.aiWorkflow);
    const experience = migrated.get(SECTION_IDS.experience);
    const projects = migrated.get(SECTION_IDS.projects);

    /*
     * All three must have adopted the primitive before the ranks can be
     * compared. Until then this cannot check anything — and rather than pass
     * quietly, which is exactly how two v1 tests stayed green while testing
     * nothing, it records what is still missing.
     *
     * Experience is Phase 4, Selected Work Phase 5, AI Workflow Phase 7. The
     * rule becomes enforceable when the last of those lands.
     */
    const pending = [
      workflow === undefined ? "AI Workflow (Phase 7)" : null,
      experience === undefined ? "Work Experience (Phase 4)" : null,
      projects === undefined ? "Selected Work (Phase 5)" : null,
    ].filter(Boolean);

    if (pending.length > 0) {
      console.warn(`SUP-007 rank rule not yet enforceable — awaiting: ${pending.join(", ")}`);
      return;
    }

    expect(SURFACE_RANK[workflow!]).toBeLessThanOrEqual(SURFACE_RANK[experience!]);
    expect(SURFACE_RANK[workflow!]).toBeLessThanOrEqual(SURFACE_RANK[projects!]);
  });

  it("ranks the tiers most to least emphatic", () => {
    // The rule above is only meaningful if the ordering is the intended one.
    expect(SURFACE_RANK.dark).toBeGreaterThan(SURFACE_RANK.neutral);
    expect(SURFACE_RANK.neutral).toBeGreaterThan(SURFACE_RANK.light);
  });
});
