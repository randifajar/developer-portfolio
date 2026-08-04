import type { ReactNode } from "react";

interface ExternalLinkProps {
  readonly href: string;
  readonly children: ReactNode;
  readonly className?: string;
  /**
   * Overrides the accessible name when the visible text alone is ambiguous.
   *
   * NFAC-A11Y-003 requires understandable link labels, and an icon must never
   * be the only signal that a link leaves the site (TD 15.3).
   */
  readonly accessibleLabel?: string;
}

/**
 * A link to an approved external destination.
 *
 * Always opens in a new context with `rel="noopener noreferrer"`. `noopener`
 * prevents the opened page from reaching back through `window.opener`;
 * `noreferrer` withholds the referrer. Both are required by NFAC-SEC-003's
 * "safe new-tab behavior".
 *
 * The "(opens in a new tab)" suffix is visually hidden but announced, so the
 * behaviour is disclosed without cluttering the visible label.
 */
export function ExternalLink({ href, children, className, accessibleLabel }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...(accessibleLabel ? { "aria-label": `${accessibleLabel} (opens in a new tab)` } : {})}
    >
      {children}
      {accessibleLabel ? null : <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
