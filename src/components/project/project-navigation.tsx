import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import type { ProjectCaseStudy } from "@/domain/content/schemas";
import { ROUTES, SECTION_IDS } from "@/lib/constants";

interface ProjectNavigationProps {
  readonly previous: ProjectCaseStudy | null;
  readonly next: ProjectCaseStudy | null;
  readonly resumeHref: string | null;
  readonly contactHref: string | null;
}

/**
 * Related navigation at the foot of a case study (UX 9.12, FAC-PROJECT-008).
 *
 * Previous and next appear only when they exist. The selector supplies them
 * from the already-filtered public list, so an unpublished neighbour can never
 * surface here.
 */
export function ProjectNavigation({
  previous,
  next,
  resumeHref,
  contactHref,
}: ProjectNavigationProps) {
  return (
    <nav
      aria-label="Related project navigation"
      className="flex flex-col gap-8 border-t border-border pt-8"
    >
      {previous || next ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {previous ? (
            <Link
              href={ROUTES.projectDetail(previous.slug)}
              className="flex flex-col gap-1 rounded-(--radius-card) border border-border p-5 hover:border-accent"
            >
              <span className="text-sm text-text-muted">← Previous project</span>
              <span className="font-medium text-text-primary">{previous.title}</span>
            </Link>
          ) : (
            <div aria-hidden="true" />
          )}

          {next ? (
            <Link
              href={ROUTES.projectDetail(next.slug)}
              className="flex flex-col gap-1 rounded-(--radius-card) border border-border p-5 text-right hover:border-accent sm:items-end"
            >
              <span className="text-sm text-text-muted">Next project →</span>
              <span className="font-medium text-text-primary">{next.title}</span>
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <ButtonLink href={ROUTES.projects} variant="secondary">
          Back to Projects
        </ButtonLink>

        {resumeHref ? (
          <ButtonLink href={resumeHref} variant="secondary" external>
            View Resume
          </ButtonLink>
        ) : null}

        <ButtonLink
          href={contactHref ?? `${ROUTES.home}#${SECTION_IDS.contact}`}
          variant="secondary"
        >
          Contact
        </ButtonLink>
      </div>
    </nav>
  );
}
