"use client";

import { usePathname } from "next/navigation";
import {
  useRef,
  type ComponentProps,
  type KeyboardEvent,
  type MouseEvent,
  type ToggleEvent,
} from "react";
import { ROUTES } from "@/lib/constants";

/**
 * The Résumé menu (UX3 6.3, DEC-057).
 *
 * Built on the native Popover API, so opening, closing on Escape, closing on an
 * outside click, and returning focus to the button all work without
 * JavaScript. The client part adds three things only:
 *
 * - moving focus into the menu when it opens, to the current page's résumé if
 *   it has one;
 * - arrow keys between the items;
 * - the "this page" marker, which needs the pathname.
 *
 * Only Published résumés are links. A variant without one says so instead of
 * offering a download the site cannot fulfil (FAC-RESUME-003, DEC-059).
 */
export interface ResumeMenuItem {
  readonly variant: "backend" | "infrastructure";
  readonly label: string;
  /** The PDF's public path, or null while the résumé awaits approval. */
  readonly href: string | null;
}

const MENU_ID = "resume-menu";

/**
 * Focusing the button before the popover opens. WebKit does not focus a
 * button on click, so after a mouse open the popover would record the page
 * body as the element to restore, and Escape would leave focus there.
 * Focusing the button first makes it the restore target in every engine; the
 * native behaviour does the rest. Found by the end-to-end suite in WebKit.
 */
function focusInvoker(event: MouseEvent<HTMLButtonElement>) {
  event.currentTarget.focus();
}

/**
 * Another way to open the header's Résumé menu, from elsewhere on a page —
 * "Résumés" in the Overall page's Explore further (UX3 7.1). The menu stays
 * the one in the header; this button only points at it.
 */
export function ResumeMenuTrigger(
  props: Omit<ComponentProps<"button">, "type" | "popoverTarget" | "onClick">,
) {
  return <button {...props} type="button" popoverTarget={MENU_ID} onClick={focusInvoker} />;
}

const VARIANT_FOR_PATH: Record<string, ResumeMenuItem["variant"]> = {
  [ROUTES.backend]: "backend",
  [ROUTES.infrastructure]: "infrastructure",
};

export function ResumeMenu({ items }: { readonly items: readonly ResumeMenuItem[] }) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const pageVariant = VARIANT_FOR_PATH[pathname] ?? null;

  const links = (): HTMLElement[] => [
    ...(menuRef.current?.querySelectorAll<HTMLElement>("a[href]") ?? []),
  ];

  function onToggle(event: ToggleEvent<HTMLDivElement>) {
    if (event.newState !== "open") return;

    const preferred = menuRef.current?.querySelector<HTMLElement>("a[data-this-page]");
    (preferred ?? links()[0])?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

    const all = links();
    if (all.length === 0) return;

    event.preventDefault();
    const index = all.indexOf(document.activeElement as HTMLElement);
    const step = event.key === "ArrowDown" ? 1 : -1;
    all[(index + step + all.length) % all.length]?.focus();
  }

  return (
    <div>
      <button
        type="button"
        popoverTarget={MENU_ID}
        onClick={focusInvoker}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-meta font-semibold text-text-primary hover:border-accent hover:text-accent"
      >
        Résumé
        <span aria-hidden="true">↗</span>
      </button>

      <div
        id={MENU_ID}
        ref={menuRef}
        popover="auto"
        aria-label="Résumés"
        onToggle={onToggle}
        onKeyDown={onKeyDown}
        className="fixed inset-auto top-[calc(var(--spacing-header)+0.5rem)] right-5 m-0 w-72 max-w-[calc(100vw-2.5rem)] rounded-2xl border border-border bg-surface p-3 text-text-primary sm:right-8 lg:right-12"
      >
        <p className="px-2 pb-2 text-meta text-text-muted">Choose a résumé</p>
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const thisPage = item.variant === pageVariant;

            return (
              <li key={item.variant}>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-this-page={thisPage ? "" : undefined}
                    className="flex flex-col rounded-xl px-3 py-2 hover:bg-surface-muted focus-visible:bg-surface-muted"
                  >
                    <span className="text-body font-semibold">
                      {item.label}
                      {thisPage ? <span className="text-accent"> · this page</span> : null}
                    </span>
                    <span className="text-meta text-text-muted">
                      PDF
                      <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                  </a>
                ) : (
                  <p className="flex flex-col px-3 py-2">
                    <span className="text-body font-semibold">
                      {item.label}
                      {thisPage ? <span className="text-accent"> · this page</span> : null}
                    </span>
                    <span className="text-meta text-text-muted">PDF available after approval</span>
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
