import type { ReactNode } from "react";

/**
 * The page's structural unit: one full-bleed band, one contained column.
 *
 * Every homepage section renders through this, which is what makes the surface
 * system work. Before it, four sections put `max-w` on the `<section>` element
 * itself, so a background colour on them would have stopped at the content
 * width instead of spanning the viewport.
 *
 * Splitting the two responsibilities — the band paints, the inner column
 * constrains — is the whole point. It also puts the vertical rhythm in one
 * place rather than repeating `py-16` across seven files.
 */

export type SectionSurface = "light" | "neutral" | "dark";

/**
 * Surface emphasis, most to least (UX2 4.4).
 *
 * Exported because it is a product rule, not a styling detail: the AI Workflow
 * section may never sit above Work Experience or Selected Work. That rule
 * replaces SUP-007's mechanism, which is void now that every section carries a
 * band, and it is asserted in tests/components/section-surface.test.tsx —
 * SUP-007 has never had a test until now.
 */
export const SURFACE_RANK: Record<SectionSurface, number> = {
  dark: 3,
  neutral: 2,
  light: 1,
};

interface SectionProps {
  readonly surface: SectionSurface;
  readonly children: ReactNode;
  /** Anchor target, when the section is linked from the navigation. */
  readonly id?: string;
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
  width = "content",
  className = "",
}: SectionProps) {
  return (
    <section id={id} data-surface={surface} className="bg-background text-text-primary">
      <div
        className={`mx-auto w-full px-5 py-16 sm:px-8 lg:px-12 ${WIDTH_CLASS[width]} ${className}`.trim()}
      >
        {children}
      </div>
    </section>
  );
}
