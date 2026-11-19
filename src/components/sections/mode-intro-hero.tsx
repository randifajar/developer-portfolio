import { Section } from "@/components/layout/section";
import { getPublishedModeIntro } from "@/domain/content/selectors";
import type { Mode } from "@/domain/content/types";

/**
 * A mode's hero, static (UX3 7).
 *
 * The copy is the mode intro from content. V3 P5 replaces this with the
 * persistent ModeHero that animates between modes; until then each mode route
 * renders its own.
 *
 * The heading's two lines are two sizes (UX3 4). A space separates them in the
 * markup: the lines stack visually, but textContent joins adjacent elements
 * without one, and the heading's accessible name would otherwise run the two
 * lines together — "Behind theApplication.".
 *
 * The intro's action is not rendered yet: it scrolls to the page's work
 * section, which arrives with the full mode pages in P6.
 */
export function ModeIntroHero({ mode }: { readonly mode: Mode }) {
  const intro = getPublishedModeIntro(mode);

  if (!intro) {
    return null;
  }

  const [first, second] = intro.headingLines;

  return (
    <Section surface="dark">
      <div className="flex flex-col gap-6 py-10 sm:py-16">
        <p className="text-kicker font-semibold text-text-secondary uppercase">{intro.eyebrow}</p>
        <h1 className="flex flex-col font-display uppercase">
          <span className="text-display-hero-line-1 font-medium">{first}</span>{" "}
          <span className="text-display-hero-line-2 font-bold text-accent">{second}</span>
        </h1>
        {intro.description ? (
          <p className="max-w-(--spacing-prose) text-lead text-pretty text-text-secondary">
            {intro.description}
          </p>
        ) : null}
      </div>
    </Section>
  );
}
