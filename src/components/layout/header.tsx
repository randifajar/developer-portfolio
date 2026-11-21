import { ModeSwitch } from "@/components/layout/mode-switch";
import { ResumeMenu, type ResumeMenuItem } from "@/components/layout/resume-menu";
import { getPublishedResumeFor } from "@/domain/content/selectors";
import { DISCIPLINES } from "@/domain/content/types";

/**
 * The site header (UX3 6.1).
 *
 * It holds exactly two things: the mode switch on the left and the Résumé menu
 * on the right. No identity lockup, no section links, no menu button — the V3
 * departure from the requirements recorded in UX3 12. The name is the Overall
 * hero's heading, and the footer carries it on every page (FAC-NAV-004).
 *
 * A Server Component that composes the two client islands, as Technical Design
 * 13.4 intends: only the parts that need the pathname or the keyboard run in
 * the browser.
 *
 * Permanently dark and opaque. UX3 6.1 describes a translucent header
 * (rgba(7, 11, 18, 0.78) with a backdrop blur); that was not adopted, for the
 * reason v2 recorded here first: text on a translucent surface sits on a colour
 * no contrast gate can measure, the class of pairing that hid one of v1's
 * contrast failures. An opaque near-black has one value, and the gate checks
 * it. Over the dark hero the difference is hard to see.
 */
const RESUME_LABELS: Record<ResumeMenuItem["variant"], string> = {
  backend: "Backend résumé",
  infrastructure: "Infrastructure résumé",
};

/**
 * The Résumé menu's items: one per variant with a Published résumé, and none
 * for a variant without one (D6, 2026-11-21: the v2 PDF is the only résumé, so
 * the menu lists the backend résumé alone).
 *
 * Never empty in a release: release validation requires exactly one active
 * Published résumé (`exactly-one-active-resume`).
 */
function resumeMenuItems(): ResumeMenuItem[] {
  return DISCIPLINES.flatMap((variant) => {
    const href = getPublishedResumeFor(variant)?.publicPath;
    return href ? [{ variant, label: RESUME_LABELS[variant], href }] : [];
  });
}

export function Header() {
  const resumes = resumeMenuItems();

  return (
    <header
      data-surface="dark"
      className="sticky top-0 z-30 border-b border-border bg-background text-text-primary"
    >
      {/*
       * Wraps to two rows below about 375 px instead of overflowing (UX3 5):
       * the mode switch is never hidden behind a menu (V3-NAV-010).
       */}
      <div className="mx-auto flex min-h-(--spacing-header) max-w-(--spacing-content) flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-2 sm:px-8 lg:px-12">
        <ModeSwitch />
        <ResumeMenu items={resumes} />
      </div>
    </header>
  );
}
