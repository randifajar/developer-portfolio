interface TechnologyTagProps {
  /** The canonical skill name, exactly as authored in the skills content. */
  readonly name: string;
  readonly className?: string;
}

/**
 * A single technology label.
 *
 * Always renders the canonical name as readable text. UX 12.6 forbids
 * replacing a skill name with an unexplained logo, and FAC-SKILL-003 forbids
 * any numeric or graphical proficiency indicator, so this component carries no
 * icon, level, bar, or rating.
 */
export function TechnologyTag({ name, className }: TechnologyTagProps) {
  const classes = [
    "inline-flex items-center rounded-(--radius-badge) border border-border",
    "bg-surface-muted px-3 py-1 text-meta text-text-secondary",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{name}</span>;
}
