import type { ReactNode } from "react";
import { ModeHero, type ModeHeroIntro } from "@/components/layout/mode-hero";
import {
  getPublishedDisciplineIntro,
  getPublishedModeIntro,
  getPublishedProfile,
} from "@/domain/content/selectors";
import { MODES, type Mode } from "@/domain/content/types";

/**
 * The three mode routes — Overall, Backend, Infrastructure — share this layout
 * (DEC-056, V3 plan 3.2).
 *
 * The route group exists for one thing: Next.js keeps a shared layout mounted
 * when navigating between its routes, so the hero persists across a mode
 * change while the address moves to a real URL. The group name never appears
 * in a URL.
 *
 * The intros are read here, on the server, and passed to the hero as plain
 * data, so the client component never reaches into content and receives only
 * the fields it renders.
 */

/*
 * The hero's action scrolls to the first section of the page below it, so it
 * is offered only when that section renders and can never point at nothing.
 * These are the same conditions the sections themselves check: Overall's
 * profile renders with the profile statement, and each discipline page's
 * first section with that discipline's intro. A test renders every mode and
 * checks that an offered action's target exists.
 */
function hasActionTarget(mode: Mode): boolean {
  return mode === "overall"
    ? Boolean(getPublishedProfile()?.statement)
    : getPublishedDisciplineIntro(mode) !== null;
}

export default function ModesLayout({ children }: { readonly children: ReactNode }) {
  const intros = MODES.flatMap((mode): ModeHeroIntro[] => {
    const intro = getPublishedModeIntro(mode);

    if (!intro) {
      return [];
    }

    return [
      {
        mode: intro.mode,
        eyebrow: intro.eyebrow,
        headingLines: intro.headingLines,
        ...(intro.description ? { description: intro.description } : {}),
        action: intro.action,
      },
    ];
  });

  return (
    <ModeHero intros={intros} actionModes={MODES.filter(hasActionTarget)}>
      {children}
    </ModeHero>
  );
}
