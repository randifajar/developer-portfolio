"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/constants";

/**
 * The mode switch — the header's one signature control (UX3 6.2, DEC-057).
 *
 * Each mode is a real link to a real route, so it works without JavaScript and
 * survives a reload, a shared URL, and Back. The client part is only the
 * active state: the header is rendered once for every route, and only the
 * pathname says which mode is current.
 *
 * The active mode carries `aria-current="page"` and a filled pill, so it is
 * shown by shape as well as colour. Off the mode routes — the projects pages —
 * no mode is current. The pill's movement between modes is motion, and
 * arrives with V3 P8.
 *
 * Below 640 px the Infrastructure label shortens to "Infra" (UX3 5). The link
 * keeps its full accessible name, so a screen reader never hears the
 * abbreviation.
 */
const MODE_LINKS = [
  { href: ROUTES.home, label: "Overall", short: null },
  { href: ROUTES.backend, label: "Backend", short: null },
  { href: ROUTES.infrastructure, label: "Infrastructure", short: "Infra" },
] as const;

export function ModeSwitch() {
  const pathname = usePathname();

  return (
    <nav aria-label="Modes">
      <ul className="flex items-center gap-1 rounded-full border border-border p-1">
        {MODE_LINKS.map((link) => {
          const current = pathname === link.href;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={current ? "page" : undefined}
                aria-label={link.short ? link.label : undefined}
                className={[
                  "inline-flex min-h-10 items-center rounded-full px-3 text-kicker font-semibold sm:px-4",
                  current
                    ? "bg-accent text-on-accent"
                    : "text-text-secondary hover:text-text-primary",
                ].join(" ")}
              >
                {link.short ? (
                  <>
                    <span aria-hidden="true" className="sm:hidden">
                      {link.short}
                    </span>
                    <span aria-hidden="true" className="hidden sm:inline">
                      {link.label}
                    </span>
                  </>
                ) : (
                  link.label
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
