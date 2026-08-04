import Link from "next/link";
import type { ReactNode } from "react";
import { ExternalLink } from "@/components/ui/external-link";

export type ButtonVariant = "primary" | "secondary" | "text";

interface ButtonLinkProps {
  readonly href: string;
  readonly children: ReactNode;
  readonly variant?: ButtonVariant;
  /** Renders as an external link with safe new-tab attributes. */
  readonly external?: boolean;
  /** Overrides the accessible name when the visible label is ambiguous. */
  readonly accessibleLabel?: string;
  readonly className?: string;
}

/**
 * Shared visual treatment for every call to action.
 *
 * Touch targets meet the 44px minimum from NFAC-RESP-004 through padding
 * rather than a fixed height, so the control still grows with its text.
 */
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-accent text-surface hover:bg-accent-hover border border-transparent shadow-sm",
  secondary:
    "bg-surface text-text-primary border border-border hover:border-accent hover:text-accent",
  text: "text-accent underline underline-offset-4 hover:text-accent-hover border border-transparent",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-(--radius-button) " +
  "px-5 py-3 min-h-11 text-base font-medium transition-colors";

/**
 * A link styled as a button.
 *
 * Deliberately a link, never a `<button>`: every use navigates somewhere.
 * NFAC-A11Y-003 requires links to navigate and buttons to perform actions, and
 * conflating them breaks keyboard and screen-reader expectations.
 *
 * Internal destinations use `next/link` for client-side navigation; external
 * ones delegate to ExternalLink so the safe-new-tab attributes are applied in
 * exactly one place.
 */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  external = false,
  accessibleLabel,
  className,
}: ButtonLinkProps) {
  const classes = [BASE_CLASSES, VARIANT_CLASSES[variant], className].filter(Boolean).join(" ");

  if (external) {
    return (
      <ExternalLink
        href={href}
        className={classes}
        {...(accessibleLabel ? { accessibleLabel } : {})}
      >
        {children}
      </ExternalLink>
    );
  }

  return (
    <Link
      href={href}
      className={classes}
      {...(accessibleLabel ? { "aria-label": accessibleLabel } : {})}
    >
      {children}
    </Link>
  );
}
