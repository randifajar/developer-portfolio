import Link from "next/link";

/**
 * The V3 text link with a trailing arrow — "Backend →", "All projects →".
 *
 * The arrow is decoration and hidden from assistive technology. Where the
 * visible label repeats for different destinations, as "Read the case study"
 * does down a list, `context` completes the accessible name: "Read the case
 * study: Jury Process Management Integration" (WCAG 2.4.4). The name still
 * begins with the visible label, so speech input can use it (WCAG 2.5.3).
 *
 * The context is an `aria-label`, not visually hidden text inside the link.
 * Browsers treat a visually hidden span as a block and put a space before it,
 * so the name came out as "Read the case study : Jury…" — which jsdom, having
 * no layout, did not reproduce. The end-to-end suite found it.
 */
interface ArrowLinkProps {
  readonly href: string;
  readonly children: string;
  readonly context?: string;
}

export function ArrowLink({ href, children, context }: ArrowLinkProps) {
  return (
    <Link
      href={href}
      aria-label={context ? `${children}: ${context}` : undefined}
      className="inline-flex min-h-11 w-fit items-center gap-2 text-meta font-semibold text-accent hover:text-accent-hover"
    >
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
