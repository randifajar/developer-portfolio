import Link from "next/link";
import { ResumeMenuTrigger } from "@/components/layout/resume-menu";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getPublishedProjectOverviews, getPublishedProjects } from "@/domain/content/selectors";
import { ROUTES } from "@/lib/constants";
import { countedNoun } from "@/lib/numbers";

/**
 * Explore further — the paths onward from the Overall page (UX3 7.1):
 * Backend, Infrastructure, All projects, Résumés. Contact follows in the
 * footer, as on every page.
 *
 * Each entry is named by its label alone, and its line of description is the
 * accessible description, so a screen reader announces "Backend, link" and
 * then the detail, rather than one long run-on name.
 *
 * The descriptions are the approved mockup's, with one change: its "Seven
 * pieces of work, by discipline" is a count, so it is counted here from what
 * is published.
 *
 * Résumés opens the header's menu rather than repeating it, so the two can
 * never list different résumés.
 */
const HEADING_ID = "explore-heading";

const ROW_CLASS =
  "flex w-full items-center justify-between gap-6 border-t border-border py-6 text-left hover:text-accent";

interface Destination {
  readonly id: string;
  readonly href: string;
  readonly label: string;
  readonly description: string;
}

export function ExploreSection() {
  const workCount = getPublishedProjects().length + getPublishedProjectOverviews().length;

  const destinations: readonly Destination[] = [
    {
      id: "backend",
      href: ROUTES.backend,
      label: "Backend",
      description: "Services, data, integrations and debugging.",
    },
    {
      id: "infrastructure",
      href: ROUTES.infrastructure,
      label: "Infrastructure",
      description: "Jenkins, Linux and Docker, AWS, and the troubleshooting between them.",
    },
    {
      id: "projects",
      href: ROUTES.projects,
      label: "All projects",
      description: `${countedNoun(workCount, "piece")} of work, by discipline.`,
    },
  ];

  return (
    <Section surface="dark" labelledBy={HEADING_ID}>
      <div className="flex flex-col gap-8">
        <Eyebrow as="h2" id={HEADING_ID}>
          Explore further
        </Eyebrow>

        <ul className="flex flex-col border-b border-border">
          {destinations.map((destination) => (
            <li key={destination.id}>
              <Link
                href={destination.href}
                aria-labelledby={`explore-${destination.id}`}
                aria-describedby={`explore-${destination.id}-description`}
                className={ROW_CLASS}
              >
                <RowText
                  id={`explore-${destination.id}`}
                  label={destination.label}
                  description={destination.description}
                />
                <span aria-hidden="true" className="text-page-title text-accent">
                  →
                </span>
              </Link>
            </li>
          ))}
          <li>
            <ResumeMenuTrigger
              aria-labelledby="explore-resumes"
              aria-describedby="explore-resumes-description"
              className={ROW_CLASS}
            >
              <RowText
                id="explore-resumes"
                label="Résumés"
                description="Backend and infrastructure versions."
              />
              <span aria-hidden="true" className="text-page-title text-accent">
                ↗
              </span>
            </ResumeMenuTrigger>
          </li>
        </ul>
      </div>
    </Section>
  );
}

function RowText({
  id,
  label,
  description,
}: {
  readonly id: string;
  readonly label: string;
  readonly description: string;
}) {
  return (
    <span className="flex flex-col gap-1">
      <span id={id} className="text-page-title font-semibold">
        {label}
      </span>
      <span id={`${id}-description`} className="text-body text-text-secondary">
        {description}
      </span>
    </span>
  );
}
