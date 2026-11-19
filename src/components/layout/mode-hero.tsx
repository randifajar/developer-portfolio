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

  return (
    <section
      aria-labelledby={MODE_HERO_HEADING_ID}
      data-surface="dark"
      className="bg-background text-text-primary"
    >
      <div className="mx-auto flex max-w-(--spacing-content) flex-col gap-10 px-5 py-14 sm:px-8 sm:py-20 md:flex-row md:items-end md:justify-between lg:px-12">
        <div className="flex min-w-0 flex-col gap-6 md:max-w-[60%]">
          <p className="text-kicker font-semibold text-text-secondary uppercase">{intro.eyebrow}</p>
          {/*
           * A space between the lines: they stack visually, but textContent
           * joins adjacent elements without one, and the heading's accessible
           * name would run the lines together — "Randi FajarWicaksono".
           *
           * Focusable from script only, for the mode change above. It is not
           * a control, so it takes no focus ring.
           */}
          <h1
            id={MODE_HERO_HEADING_ID}
            ref={headingRef}
            tabIndex={-1}
            className="flex flex-col font-display uppercase focus:outline-none"
          >
            <span className="text-display-hero-line-1 font-medium">{first}</span>{" "}
            <span className="text-display-hero-line-2 font-bold text-accent">{second}</span>
          </h1>
          {intro.description ? (
            <p className="max-w-(--spacing-prose) text-lead text-pretty text-text-secondary">
              {intro.description}
            </p>
          ) : null}
          {showAction ? (
            <a
              href={`#${intro.action.targetId}`}
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-border px-5 text-meta font-semibold text-text-primary hover:border-accent hover:text-accent"
            >
              {intro.action.label}
              <span aria-hidden="true">↓</span>
            </a>
          ) : null}
        </div>

        {showPhotograph ? <PhotographPlaceholder /> : null}
      </div>
    </section>
  );
}

/**
 * The Overall hero's photograph, until Randi supplies it (UX3 7.6, OPEN-010).
 *
 * Labelled as a placeholder rather than disguised as a photograph, so nobody
 * reviewing staging mistakes it for the finished design. Hidden from
 * assistive technology: it carries no information.
 */
function PhotographPlaceholder() {
  return (
    <div
      aria-hidden="true"
      data-photograph-placeholder=""
      className="flex aspect-[4/5] w-full max-w-xs shrink-0 items-end rounded-2xl border border-dashed border-border bg-surface p-5 md:w-[34%]"
    >
      <p className="text-meta text-text-muted">Photograph · to be supplied</p>
    </div>
  );
}
