import { ButtonLink } from "@/components/ui/button-link";
import { ROUTES, SECTION_IDS } from "@/lib/constants";

export interface ProjectsEmptyStateProps {
  /** Path to the active Resume, when one is available. */
  readonly resumePath?: string | undefined;
  /**
   * The primary contact action, when a channel is Published.
   *
   * Label and destination travel together so the component cannot be given one
   * without the other.
   */
  readonly contact?: { readonly label: string; readonly href: string } | undefined;
}

/**
 * The Projects Index empty state (FAC-PROJECTS-004).
 *
 * A truthful statement that case studies are being prepared — not an apology,
 * and not a fabricated placeholder card. This is a valid page state but not a
 * launch-ready product state; release validation is what refuses the launch,
 * never this component.
 *
 * Extracted from the page so it can be tested at all. While it lived inline it
 * was only reachable when nothing was Published, so publishing the first case
 * study made it unrenderable and its end-to-end coverage was removed with
 * nothing to replace it. Taking its data as props rather than reading selectors
 * decouples it from content state, which is the whole reason the coverage was
 * lost.
 *
 * The page still decides *when* this appears. This component owns only *what*
 * it says.
 */
export function ProjectsEmptyState({ resumePath, contact }: ProjectsEmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-6 rounded-(--radius-card) border border-border bg-surface p-8 sm:p-12">
      <div className="flex flex-col gap-3">
        <h2 className="text-project-title font-semibold text-text-primary">
          Case studies are being prepared
        </h2>
        <p className="max-w-(--spacing-prose) text-text-secondary">
          Published project case studies will appear here. In the meantime, my resume and contact
          details are available.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <ButtonLink href={ROUTES.home}>Return home</ButtonLink>

        {/* FAC-RESUME-003: never advertise a Resume the site cannot deliver. */}
        {resumePath ? (
          <ButtonLink href={resumePath} variant="secondary" external>
            View Resume
          </ButtonLink>
        ) : null}

        {contact ? (
          <ButtonLink href={contact.href} variant="secondary">
            {contact.label}
          </ButtonLink>
        ) : (
          <ButtonLink href={`${ROUTES.home}#${SECTION_IDS.contact}`} variant="secondary">
            Contact
          </ButtonLink>
        )}
      </div>
    </div>
  );
}
