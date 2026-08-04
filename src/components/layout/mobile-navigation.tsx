"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { NavigationLink } from "@/components/layout/navigation-links";

interface MobileNavigationProps {
  readonly links: readonly NavigationLink[];
  /** Rendered at the foot of the open menu, e.g. the Resume action. */
  readonly resumeHref: string | null;
  readonly externalLinks: readonly NavigationLink[];
}

/**
 * The mobile navigation menu.
 *
 * This is the ONLY Client Component in the application (TD 13.4). Everything
 * else renders on the server, so this file is the entire client-side JavaScript
 * surface of the site. Keeping that boundary at one component is what lets the
 * rest of the pages ship no React runtime state.
 *
 * Accessibility requirements from UX 6.2 and TD 15.2, all implemented here:
 * aria-expanded on the trigger, an accessible label on the menu, Escape closes,
 * selecting a link closes, focus is managed, and background scroll is locked
 * while open.
 */
export function MobileNavigation({ links, resumeHref, externalLinks }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    // Return focus to the trigger, otherwise focus falls back to the document
    // body and the keyboard user loses their position entirely.
    triggerRef.current?.focus();
  }, []);

  // Escape closes from anywhere, including when focus sits inside the menu.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  // Lock background scrolling so the page behind the drawer does not move
  // under the visitor's finger.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Move focus into the drawer when it opens.
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls={menuId}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-(--radius-button) border border-border px-3 text-text-primary"
      >
        <span className="sr-only">Open menu</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-40">
          {/* Clicking away closes. Presentational because the button below and
              Escape both provide accessible ways out. */}
          <div
            className="absolute inset-0 bg-text-primary/40"
            onClick={close}
            role="presentation"
          />

          <nav
            id={menuId}
            aria-label="Site navigation"
            className="absolute inset-y-0 right-0 flex w-4/5 max-w-sm flex-col gap-2 overflow-y-auto bg-surface p-6 shadow-lg"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              className="mb-4 inline-flex min-h-11 min-w-11 items-center justify-center self-end rounded-(--radius-button) border border-border px-3 text-text-primary"
            >
              <span className="sr-only">Close menu</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="flex min-h-11 items-center rounded-(--radius-button) px-3 text-lg text-text-primary hover:text-accent"
              >
                {link.label}
              </Link>
            ))}

            {resumeHref ? (
              <a
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="mt-2 flex min-h-11 items-center rounded-(--radius-button) bg-accent px-3 text-lg text-surface"
              >
                View Resume
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : null}

            {externalLinks.length > 0 ? (
              <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                {externalLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={close}
                    className="flex min-h-11 items-center rounded-(--radius-button) px-3 text-text-secondary hover:text-accent"
                  >
                    {link.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ))}
              </div>
            ) : null}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
