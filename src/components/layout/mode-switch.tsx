"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ROUTES } from "@/lib/constants";

/**
 * The mode switch — the header's one signature control (UX3 6.2, DEC-057).
 *
 * Each mode is a real link to a real route, so it works without JavaScript and
 * survives a reload, a shared URL, and Back. The client part is the active
 * state: the header is rendered once for every route, and only the pathname
 * says which mode is current.
 *
 * The active mode carries `aria-current="page"` and a filled pill, so it is
 * shown by shape as well as colour. Off the mode routes — the projects pages —
 * no mode is current. Once the page is interactive the pill becomes one shape
 * that moves to the new mode when it changes (V3-NAV-003, added in V3 P10);
 * before that, and wherever it cannot be measured, the active link fills
 * itself. Reduced motion stops the movement through the global guard.
 *
 * Below 640 px the Infrastructure label shortens to "Infra" (UX3 5). The link
 * keeps its full accessible name, so a screen reader never hears the
 * abbreviation.
 *
 * Spacing is the approved mockup's: 0.05em tracking, 16 px of padding, 11 px
 * below 640 px. P4 had the eyebrow's 0.2em, which made the header 23 px too
 * wide for one row at 390 px, where UX3 5 keeps it on one row (V3 P10).
 *
 * It also measures the header it sits in and publishes the height as `--hdr`
 * (UX3 5): on the narrowest phones the header wraps to two rows (one row at
 * 390 px, two at 360 px), and anchored scrolling has to clear both.
 */
const MODE_LINKS = [
  { href: ROUTES.home, label: "Overall", short: null },
  { href: ROUTES.backend, label: "Backend", short: null },
  { href: ROUTES.infrastructure, label: "Infrastructure", short: "Infra" },
] as const;

interface Pill {
  readonly left: number;
  readonly width: number;
}

export function ModeSwitch() {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState<Pill | null>(null);

  // The pill follows the current mode, and its size, as the list reflows.
  useLayoutEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('a[aria-current="page"]');

    if (!list || !active || typeof ResizeObserver === "undefined") {
      setPill(null);
      return;
    }

    const measure = () =>
      setPill(
        active.offsetWidth > 0 ? { left: active.offsetLeft, width: active.offsetWidth } : null,
      );
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [pathname]);

  // The header's height, for anchored scrolling (globals.css reads --hdr).
  useEffect(() => {
    const header = listRef.current?.closest("header");

    if (!header || typeof ResizeObserver === "undefined") {
      return;
    }

    const publish = () =>
      document.documentElement.style.setProperty("--hdr", `${header.offsetHeight}px`);
    publish();

    const observer = new ResizeObserver(publish);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Modes">
      <ul
        ref={listRef}
        className="relative flex items-center gap-1 rounded-full border border-border p-1"
      >
        {pill ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1 bottom-1 left-0 rounded-full bg-accent transition-[transform,width] duration-500 ease-[cubic-bezier(0.2,0.75,0.2,1)]"
            style={{ transform: `translateX(${pill.left}px)`, width: pill.width }}
          />
        ) : null}
        {MODE_LINKS.map((link) => {
          const current = pathname === link.href;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={current ? "page" : undefined}
                aria-label={link.short ? link.label : undefined}
                className={[
                  "relative inline-flex min-h-10 items-center rounded-full px-[11px] text-kicker font-semibold tracking-[0.05em] sm:px-4",
                  current
                    ? pill
                      ? "text-on-accent"
                      : "bg-accent text-on-accent"
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
