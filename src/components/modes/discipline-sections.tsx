import { Section, type SectionSurface } from "@/components/layout/section";
import { ProjectRows } from "@/components/shared/project-rows";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionTitle } from "@/components/ui/section-title";
import {
  getPublishedCaseStudiesFor,
  getPublishedProjectOverviews,
  getPublishedToolkit,
} from "@/domain/content/selectors";
import type { Discipline } from "@/domain/content/types";
import { DISCIPLINE_LABELS, ROUTES } from "@/lib/constants";

/**
 * The two sections the Backend and Infrastructure pages share in shape:
 * selected work and the toolkit (UX3 7.2, 7.3). The words differ per page and
 * are passed in; the content is read per discipline.
 */

interface DisciplineWorkSectionProps {
  readonly discipline: Discipline;
  readonly surface: SectionSurface;
  /** "Backend work." — the approved mockup's heading for each page. */
  readonly heading: string;
}

/**
 * Selected work for one discipline: its case studies, then its published
 * overviews. Omitted entirely while there is none, rather than a heading over
 * nothing: on Infrastructure that is the state until the overviews are
 * published (OPEN-011), since no infrastructure case study exists.
 */
export function DisciplineWorkSection({
  discipline,
  surface,
  heading,
}: DisciplineWorkSectionProps) {
  const caseStudies = getPublishedCaseStudiesFor(discipline);
  const overviews = getPublishedProjectOverviews(discipline);

  if (caseStudies.length + overviews.length === 0) {
    return null;
  }

  const headingId = `${discipline}-selected-work-heading`;

  return (
    <Section surface={surface} labelledBy={headingId}>
      <div className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-5">
            <Eyebrow>Selected work</Eyebrow>
            <h2 id={headingId} className="text-display-section font-semibold text-balance">
              {heading}
            </h2>
          </div>
          <ArrowLink href={ROUTES.projects}>All projects</ArrowLink>
        </div>
        <ProjectRows caseStudies={caseStudies} overviews={overviews} />
      </div>
    </Section>
  );
}

interface ToolkitSectionProps {
  readonly discipline: Discipline;
  readonly eyebrow: string;
  /** "how I use it." on Backend, "how I use them." on Infrastructure. */
  readonly accent: string;
  /** The other mode, linked under the toolkit (UX3 7.3). */
  readonly crossLink?: { readonly text: string; readonly discipline: Discipline };
}

/**
 * The toolkit, grouped by how the tools are used (UX3 7.2, 7.3). A toolkit
 * says what is used together and carries no levels; classification belongs
 * to the skills records.
 */
export function ToolkitSection({ discipline, eyebrow, accent, crossLink }: ToolkitSectionProps) {
  const groups = getPublishedToolkit(discipline);

  if (groups.length === 0) {
    return null;
  }

  const headingId = `${discipline}-toolkit-heading`;

  return (
    <Section surface="navy" labelledBy={headingId}>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-5">
          <Eyebrow>{eyebrow}</Eyebrow>
          <SectionTitle id={headingId} lead="Grouped by " accent={accent} />
        </div>

        <ul className="grid gap-x-10 gap-y-8 min-[520px]:grid-cols-2 min-[900px]:grid-cols-4">
          {groups.map((group) => (
            <li key={group.id} className="flex flex-col gap-3 border-t border-border pt-5">
              <h3 className="text-card-title font-semibold">{group.label}</h3>
              <p className="text-body text-text-secondary">{group.items.join(" · ")}</p>
            </li>
          ))}
        </ul>

        {crossLink ? (
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-8 text-body text-text-secondary">
            {crossLink.text}
            <ArrowLink href={ROUTES[crossLink.discipline]}>
              {DISCIPLINE_LABELS[crossLink.discipline]}
            </ArrowLink>
          </p>
        ) : null}
      </div>
    </Section>
  );
}
