import type { ReactNode } from "react";

/**
 * The V3 eyebrow (UX3 4): a small, uppercase, wide-tracked label after a
 * 20 × 2 px accent bar.
 *
 * Most sections pair it with a larger heading and render it as a paragraph.
 * Where the eyebrow is the only title a section shows, it is the heading
 * itself (`as="h2"`), so a screen reader hears the title once, rather than a
 * visible label followed by a hidden heading that says the same thing.
 */
interface EyebrowProps {
  readonly children: ReactNode;
  readonly as?: "p" | "h2";
  readonly id?: string;
}

export function Eyebrow({ children, as: Element = "p", id }: EyebrowProps) {
  return (
    <Element
      id={id}
      className="flex items-center gap-3 text-kicker font-semibold text-text-secondary uppercase"
    >
      <span aria-hidden="true" className="h-0.5 w-5 shrink-0 bg-accent" />
      {children}
    </Element>
  );
}
