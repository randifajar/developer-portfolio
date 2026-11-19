/**
 * A V3 section heading (UX3 4, 7): a display-size h2 whose closing phrase is
 * set in the surface's accent — "Two disciplines, *one way of working.*"
 *
 * The split is presentation only. The heading reads as one sentence to a
 * screen reader, because the accent phrase is a span inside it, not a second
 * element.
 */
interface SectionTitleProps {
  readonly id: string;
  /** The opening, in the surface's text colour. Ends with its own space. */
  readonly lead: string;
  /** The closing phrase, in the accent. */
  readonly accent: string;
}

export function SectionTitle({ id, lead, accent }: SectionTitleProps) {
  return (
    <h2 id={id} className="max-w-[26ch] text-display-section font-semibold text-balance">
      {lead}
      <span className="text-accent">{accent}</span>
    </h2>
  );
}
