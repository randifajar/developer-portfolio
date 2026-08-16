import type { ReactNode } from "react";

/**
 * Heading levels this component may render.
 *
 * Configurable because NFAC-A11Y-003 requires a logical heading hierarchy with
 * one h1 per page. A page's primary heading is an h1; a section within it is an
 * h2; a subsection inside a case study is an h3. Choosing a level for visual
 * size instead of structure is exactly what UX 15.2 forbids, so size is
 * controlled separately through className.
 *
 * Level 1 was originally omitted here, which forced the Projects Index to
 * render its primary heading as an h2 styled at h1 size — the same
 * structure-for-appearance mistake, just inverted. The type now permits h1 so
 * a page-level heading can be structurally correct.
 */
export type HeadingLevel = 1 | 2 | 3 | 4;

interface SectionHeaderProps {
  readonly heading: string;
  readonly level?: HeadingLevel;
  /** Small label above the heading, e.g. a section number or category. */
  readonly eyebrow?: string;
  readonly description?: ReactNode;
  /** Anchor target id, when the section is linked from the navigation. */
  readonly id?: string;
  readonly className?: string;
  readonly headingClassName?: string;
}

const DEFAULT_HEADING_SIZE: Record<HeadingLevel, string> = {
  1: "text-display-section",
  2: "text-display-section",
  3: "text-page-title",
  4: "text-project-title",
};

export function SectionHeader({
  heading,
  level = 2,
  eyebrow,
  description,
  id,
  className,
  headingClassName,
}: SectionHeaderProps) {
  const Heading = `h${level}` as const;

  return (
    <div className={["flex flex-col gap-3", className].filter(Boolean).join(" ")}>
      {eyebrow ? (
        <p className="text-meta font-medium tracking-wide text-accent uppercase">{eyebrow}</p>
      ) : null}

      <Heading
        {...(id ? { id } : {})}
        className={[
          "font-bold text-balance text-text-primary",
          DEFAULT_HEADING_SIZE[level],
          headingClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {heading}
      </Heading>

      {description ? (
        <div className="max-w-(--spacing-prose) text-lead text-text-secondary">{description}</div>
      ) : null}
    </div>
  );
}
