"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

/**
 * The career sequence (UX3 8.4, DEC-057, DEC-062): the sixth V3 client island.
 *
 * The chapters arrive stacked, rendered on the server, and stacked is how
 * they stay without JavaScript, below 900 px, and under reduced motion. On a
 * wide screen with motion allowed, once hydrated, this pins them: a sticky
 * stage on a track about 210 svh long, where the scroll position chooses the
 * chapter and arrows step between them.
 *
 * Native scrolling drives everything, with no scroll hijacking (V3-MOT-007),
 * so scrolling back reverses the sequence (V3-MOT-003). No content exists only
 * in the pinned view: every chapter stays in the document, the inactive ones
 * transparent but still read by assistive technology, and focus reaching one
 * scrolls to it, so focus is never on something invisible.
 */

const PIN_QUERY = "(min-width: 900px)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function pinnable(): boolean {
  if (typeof window.matchMedia !== "function") return false;
  return window.matchMedia(PIN_QUERY).matches && !window.matchMedia(REDUCED_QUERY).matches;
}

function subscribeToMedia(onChange: () => void) {
  if (typeof window.matchMedia !== "function") return () => {};

  const queries = [window.matchMedia(PIN_QUERY), window.matchMedia(REDUCED_QUERY)];
  for (const query of queries) query.addEventListener("change", onChange);
  return () => {
    for (const query of queries) query.removeEventListener("change", onChange);
  };
}

/** The height of the sticky header, which the pinned stage sits below. */
function headerHeight(): number {
  return document.querySelector("body > header")?.getBoundingClientRect().height ?? 0;
}

interface CareerJourneyProps {
  /** One year per chapter, in order: the counter and the arrows read them. */
  readonly years: readonly number[];
  /** The stacked chapters, each marked `data-chapter`. */
  readonly children: ReactNode;
}

export function CareerJourney({ years, children }: CareerJourneyProps) {
  // False on the server and while hydrating, so the stacked layout is what
  // ships; true only afterwards, and only where pinning belongs.
  const pinned = useSyncExternalStore(subscribeToMedia, pinnable, () => false);
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // The scroll position chooses the chapter.
  useEffect(() => {
    const track = trackRef.current;
    if (!pinned || !track) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const box = track.getBoundingClientRect();
      const top = headerHeight();
      const travel = box.height - (window.innerHeight - top);
      const progress = travel > 0 ? Math.min(Math.max((top - box.top) / travel, 0), 0.9999) : 0;
      setActive(Math.floor(progress * years.length));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pinned, years.length]);

  // Mark the active chapter, which the pinned styles show and the rest hide.
  useEffect(() => {
    const chapters = trackRef.current?.querySelectorAll<HTMLElement>("[data-chapter]") ?? [];
    chapters.forEach((chapter, index) => {
      chapter.toggleAttribute("data-active", pinned && index === active);
    });
  }, [pinned, active]);

  /** Scrolls the page to where chapter `index` is the active one. */
  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;

      const top = headerHeight();
      const travel = track.offsetHeight - (window.innerHeight - top);
      const trackTop = track.getBoundingClientRect().top + window.scrollY - top;
      const target = trackTop + ((index + 0.5) / years.length) * travel;

      window.scrollTo({ top: target, behavior: "smooth" });
    },
    [years.length],
  );

  // Focus reaching a hidden chapter, by Tab, brings that chapter into view.
  useEffect(() => {
    const track = trackRef.current;
    if (!pinned || !track) return;

    const onFocus = (event: FocusEvent) => {
      const chapter = (event.target as Element).closest<HTMLElement>("[data-chapter]");
      const index = chapter ? Number(chapter.dataset.chapter) : -1;
      if (index >= 0 && !chapter?.hasAttribute("data-active")) goTo(index);
    };

    track.addEventListener("focusin", onFocus);
    return () => track.removeEventListener("focusin", onFocus);
  }, [pinned, goTo]);

  return (
    <div
      ref={trackRef}
      data-career-journey=""
      data-pinned={pinned ? "" : undefined}
      style={pinned ? { height: `${years.length * 70}svh` } : undefined}
      className="relative"
    >
      <div
        className={
          pinned
            ? "sticky top-(--spacing-header) flex h-[calc(100svh-var(--spacing-header))] flex-col justify-center gap-8"
            : undefined
        }
      >
        {children}

        {pinned ? (
          <div className="flex items-center justify-between border-t border-border pt-6">
            <p className="text-meta text-text-muted tabular-nums" aria-live="polite">
              <span className="sr-only">Chapter </span>
              {String(active + 1).padStart(2, "0")} / {String(years.length).padStart(2, "0")}
              <span className="sr-only">, {years[active]}</span>
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous chapter"
                disabled={active === 0}
                onClick={() => goTo(active - 1)}
                className="inline-flex size-11 items-center justify-center rounded-full border border-border text-text-primary hover:border-accent hover:text-accent disabled:opacity-40"
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                aria-label="Next chapter"
                disabled={active === years.length - 1}
                onClick={() => goTo(active + 1)}
                className="inline-flex size-11 items-center justify-center rounded-full border border-border text-text-primary hover:border-accent hover:text-accent disabled:opacity-40"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
