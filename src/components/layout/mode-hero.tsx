"use client";

import { usePathname } from "next/navigation";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
  type Ref,
} from "react";
import type { Mode } from "@/domain/content/types";
import { ROUTES } from "@/lib/constants";

/**
 * The persistent hero of the three mode routes (UX3 7, DEC-057).
 *
 * It lives in the `(modes)` route group's layout, so Next.js keeps it mounted
 * when the visitor switches between Overall, Backend, and Infrastructure: only
 * the page below it is replaced. That is what lets V3 P8 animate the heading
 * from one mode to the next. Until then the copy swaps instantly.
 *
 * It also owns scroll and focus when the mode changes (UX3 6.5). The installed
 * Next.js (16.4.6) handles neither the way this layout needs. After a
 * navigation its layout router scrolls the changed segment into view when that
 * segment starts off screen — here the changed segment is the page below this
 * hero, so on a phone, where the hero is taller than the viewport, it jumps
 * straight past the hero — and it leaves focus on the link that was pressed.
 * So the hero puts the scroll back at the top and moves focus to the new
 * heading.
 *
 * The page is passed in as `children` for one reason: ordering. React runs
 * layout effects children first, so the router's scroll handler for the page
 * runs before this component's effect, and the reset here is the last word,
 * before the browser paints. Rendered as a sibling before the page instead, the
 * hero's reset would run first and the router would scroll past it again. That
 * ordering is why no link into a mode route needs `scroll={false}`.
 *
 * What does not move the scroll or focus:
 *
 * - a page load or reload, so the browser keeps its position and nothing is
 *   focused that the visitor did not ask for;
 * - Back and Forward, so the browser's scroll restoration stands.
 */
export interface ModeHeroIntro {
  readonly mode: Mode;
  readonly eyebrow: string;
  readonly headingLines: readonly [string, string];
  readonly description?: string;
  readonly action: { readonly label: string; readonly targetId: string };
}

const MODE_FOR_PATH: Record<string, Mode> = {
  [ROUTES.home]: "overall",
  [ROUTES.backend]: "backend",
  [ROUTES.infrastructure]: "infrastructure",
};

export const MODE_HERO_HEADING_ID = "mode-hero-heading";

/*
 * Whether the navigation now rendering came from Back or Forward.
 *
 * Module state rather than component state, because the hero is not mounted
 * when Back returns to a mode route from the projects pages. The listeners are
 * installed by the first hero to mount; any later traversal to a mode route
 * can only reach an entry this document created, which means a hero has
 * mounted before it.
 *
 * Every other way into a mode route begins with a click on a link (Enter on a
 * focused link fires one too). The click clears the flag, so a traversal that
 * never reached a hero, such as Back to an in-page anchor, cannot leave it set
 * for a later click.
 */
let historyTraversal = false;
let trackingInstalled = false;

function installTraversalTracking() {
  if (trackingInstalled) return;
  trackingInstalled = true;

  window.addEventListener("popstate", () => {
    historyTraversal = true;
  });
  document.addEventListener(
    "click",
    () => {
      historyTraversal = false;
    },
    { capture: true },
  );
}

function consumeHistoryTraversal(): boolean {
  const traversal = historyTraversal;
  historyTraversal = false;
  return traversal;
}

const subscribeToNothing = () => () => {};

interface ModeHeroProps {
  readonly intros: readonly ModeHeroIntro[];
  /**
   * Modes whose page already contains the action's target. The others hide
   * the action rather than offer a link that scrolls nowhere; the Backend and
   * Infrastructure work sections arrive in V3 P6.
   */
  readonly actionModes: readonly Mode[];
  /** The page below the hero. */
  readonly children: ReactNode;
}

export function ModeHero({ intros, actionModes, children }: ModeHeroProps) {
  const pathname = usePathname();
  const mode = MODE_FOR_PATH[pathname] ?? "overall";
  const intro = intros.find((candidate) => candidate.mode === mode);
  const headingRef = useRef<HTMLHeadingElement>(null);

  /*
   * True on the first render when React is hydrating server HTML — a page
   * load or a reload — and false when a client navigation created the hero,
   * arriving from the projects pages. Only the first render's value is kept.
   */
  const hydrating = useSyncExternalStore(
    subscribeToNothing,
    () => false,
    () => true,
  );
  const createdByNavigation = useRef(!hydrating);
  const renderedPath = useRef<string | null>(null);

  useEffect(installTraversalTracking, []);

  useLayoutEffect(() => {
    const firstRun = renderedPath.current === null;
    const pathChanged = renderedPath.current !== pathname;
    renderedPath.current = pathname;

    if (firstRun ? !createdByNavigation.current : !pathChanged) return;
    if (consumeHistoryTraversal()) return;

    window.scrollTo({ top: 0, behavior: "instant" });
    headingRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      {intro ? (
        <HeroBand
          intro={intro}
          showAction={actionModes.includes(mode)}
          showPhotograph={mode === "overall"}
          headingRef={headingRef}
        />
      ) : null}
      {children}
    </>
  );
}

interface HeroBandProps {
  readonly intro: ModeHeroIntro;
  readonly showAction: boolean;
  readonly showPhotograph: boolean;
  readonly headingRef: Ref<HTMLHeadingElement>;
}

function HeroBand({ intro, showAction, showPhotograph, headingRef }: HeroBandProps) {
  const [first, second] = intro.headingLines;

  /*
   * The composition is the approved mockup's (UX3 7.6). The photograph is a
   * layer behind the text, not a column beside it: on wide screens it fills
   * the right 46% of the hero with its left edge masked into the dark, and the
   * heading runs across that edge. A side-by-side column was tried first and
   * left the name too little width — "WICAKSONO" broke at 1440 px.
   *
   * The hero fills the first screen below the header, with the text at the
   * bottom, on all three modes.
   */
  return (
    <section
      aria-labelledby={MODE_HERO_HEADING_ID}
      data-surface="dark"
      className="relative isolate flex min-h-[calc(100svh-var(--spacing-header))] items-end overflow-hidden bg-background text-text-primary"
    >
      {showPhotograph ? <PhotographPlaceholder /> : null}

      <div className="relative mx-auto w-full max-w-(--spacing-content) px-5 pt-10 pb-[clamp(2.5rem,8vh,5.25rem)] sm:px-8 lg:px-12">
        <div className="flex flex-col gap-5">
          <p className="text-kicker font-semibold text-text-secondary uppercase">{intro.eyebrow}</p>
          {/*
           * A space between the lines: they stack visually, but textContent
           * joins adjacent elements without one, and the heading's accessible
           * name would run the lines together — "Randi FajarWicaksono".
           *
           * Focusable from script only, for the mode change above. It is not
           * a control, so it takes no focus ring.
           *
           * The second line is one long word at display size — "APPLICATION.",
           * "DEPLOYMENT." `wrap-anywhere` lets it break inside the word, and
           * only when the word cannot fit on a line by itself; without it, 200%
           * zoom pushed the word past the edge of the page (WCAG 1.4.4).
           */}
          <h1
            id={MODE_HERO_HEADING_ID}
            ref={headingRef}
            tabIndex={-1}
            className="flex flex-col font-display uppercase wrap-anywhere focus:outline-none"
          >
            <span className="text-display-hero-line-1 font-medium">{first}</span>{" "}
            <span className="text-display-hero-line-2 font-bold text-accent">{second}</span>
          </h1>
          {intro.description ? (
            <p className="max-w-[44ch] text-lead text-pretty text-text-secondary">
              {intro.description}
            </p>
          ) : null}
          {showAction ? (
            <a
              href={`#${intro.action.targetId}`}
              className="group mt-2 inline-flex min-h-11 w-fit items-center gap-3.5 text-kicker font-semibold text-text-primary uppercase hover:text-accent"
            >
              <span
                aria-hidden="true"
                className="h-px w-11 bg-border transition-colors group-hover:bg-accent"
              />
              {intro.action.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/**
 * The Overall hero's photograph, until Randi supplies it (UX3 7.6, OPEN-010).
 *
 * Laid out as the photograph will be, and labelled as a placeholder rather
 * than disguised as one, so nobody reviewing staging mistakes it for the
 * finished design. Hidden from assistive technology: it carries no
 * information. On phones it fills the top of the hero and fades downward; from
 * 860 px it fills the right 46% and fades leftward. The label sits where the
 * mask is fully opaque, so it is never faded.
 */
function PhotographPlaceholder() {
  return (
    <div
      aria-hidden="true"
      data-photograph-placeholder=""
      className="absolute inset-x-0 top-0 bottom-[40%] -z-10 mask-b-from-70% min-[860px]:inset-y-0 min-[860px]:right-0 min-[860px]:left-auto min-[860px]:w-[46%] min-[860px]:mask-b-from-100% min-[860px]:mask-l-from-78%"
    >
      <div className="flex h-full items-start bg-linear-to-b from-surface-muted to-surface px-6 pt-6 min-[860px]:items-end min-[860px]:pb-7 min-[860px]:pl-[30%]">
        <p className="text-kicker font-semibold text-text-secondary uppercase">
          Photograph · to be supplied
        </p>
      </div>
    </div>
  );
}
