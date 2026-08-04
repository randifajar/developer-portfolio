import type { ReactNode } from "react";

/**
 * Heading levels this component may render.
 *
 * Configurable because NFAC-A11Y-003 requires a logical heading hierarchy with
 * one h1 per page. A section header inside the homepage is an h2; the same
 * component inside a case study subsection is an h3. Choosing a level for
 * visual size instead of structure is exactly what UX 15.2 forbids, so size is
 * controlled separately through className.
 */
export type HeadingLevel = 2 | 3 | 4;

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
  2: "text-3xl sm:text-4xl",
  3: "text-2xl sm:text-3xl",
  4: "text-xl sm:text-2xl",
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
        <p className="text-sm font-medium tracking-wide text-accent uppercase">{eyebrow}</p>
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
        <div className="max-w-(--spacing-prose) text-lg text-text-secondary">{description}</div>
      ) : null}
    </div>
  );
}
