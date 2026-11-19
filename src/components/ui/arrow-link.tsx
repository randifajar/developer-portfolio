import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The V3 text link with a trailing arrow — "Backend →", "All projects →".
 *
 * The arrow is decoration and hidden from assistive technology. Where the
 * visible label repeats for different destinations, as "Read the case study"
 * does down a list, `context` completes it for a screen reader only:
 * "Read the case study: Jury Process Management Integration" (WCAG 2.4.4).
 */
interface ArrowLinkProps {
  readonly href: string;
  readonly children: ReactNode;
  readonly context?: string;
}

export function ArrowLink({ href, children, context }: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 w-fit items-center gap-2 text-meta font-semibold text-accent hover:text-accent-hover"
    >
      <span>
        {children}
        {context ? <span className="sr-only">: {context}</span> : null}
      </span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}
