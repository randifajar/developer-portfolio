import type { ReactNode } from "react";

/**
 * The page's structural unit: one full-bleed band, one contained column.
 *
 * Every page section renders through this, which is what makes the surface
 * system work. Before it, four sections put `max-w` on the `<section>` element
 * itself, so a background colour on them would have stopped at the content
 * width instead of spanning the viewport.
 *
 * Splitting the two responsibilities — the band paints, the inner column
 * constrains — is the whole point. It also puts the vertical rhythm in one
 * place rather than repeating `py-16` across seven files.
 */

/**
 * The five V3 surfaces (UX3 3, SUP-016). The tokens each one sets are in
 * globals.css, and the contrast matrix checks every pairing on each.
 *
 * v2 ranked its surfaces so that the AI Workflow section could never outrank
 * Work Experience (SUP-007, `SURFACE_RANK`). V3 has no AI section (SUP-014),
 * so the rank and its test went in V3 P5b; which section sits on which
 * surface is now asserted section by section in
 * tests/components/overall-page.test.tsx.
 */
export type SectionSurface = "light" | "dark" | "navy" | "white" | "blue";

interface SectionProps {
  readonly surface: SectionSurface;
  readonly children: ReactNode;
  /** Anchor target, when the section is linked from the navigation. */
  readonly id?: string;
  /**
   * The id of the section's heading. Naming the section makes it a region
   * landmark, so a screen-reader user can move between sections by name.
   */
  readonly labelledBy?: string;
  /**
   * `prose` narrows the inner column for long-form reading. `content` is the
   * default page width.
   */
  readonly width?: "content" | "prose";
  /** Extra classes for the inner column, not the band. */
  readonly className?: string;
}

const WIDTH_CLASS: Record<NonNullable<SectionProps["width"]>, string> = {
  content: "max-w-(--spacing-content)",
  prose: "max-w-(--spacing-prose)",
};

/**
 * The band carries `data-surface`, which redefines the colour tokens for
 * everything inside it. Components below do not know or care which surface they
 * are on: `bg-surface` and `text-text-primary` resolve through `var()` against
 * whichever scope contains them.
 *
 * `data-surface` is an attribute rather than a class deliberately. A class
 * would have to be built by name, and a dynamically built class is invisible to
 * Tailwind's scanner — which is the same failure that once removed seven of
 * fourteen design tokens.
 *
 * The band also paints its own background rather than relying on `body`,
 * because `body` only ever has one colour and the page now has three.
 */
export function Section({
  surface,
  children,
  id,
  labelledBy,
  width = "content",
  className = "",
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-surface={surface}
      className="bg-background text-text-primary"
    >
      {/* Rises into view as it is scrolled to (UX3 8.5; the rule is in globals.css). */}
      <div
        data-reveal=""
        className={`mx-auto w-full px-5 py-16 sm:px-8 lg:px-12 ${WIDTH_CLASS[width]} ${className}`.trim()}
      >
        {children}
      </div>
    </section>
  );
}
