import { Section } from "@/components/layout/section";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionTitle } from "@/components/ui/section-title";
import {
  getFeaturedProjects,
  getPublishedProjectOverviews,
  getTechnologyNames,
} from "@/domain/content/selectors";
import type { Discipline } from "@/domain/content/types";
import { DISCIPLINE_LABELS, ROUTES, SECTION_IDS } from "@/lib/constants";

/**
 * Selected work — backend and infrastructure, side by side (UX3 7.1).
 *
 * Featured case studies come first, then the first three published project
 * overviews in their own order: the approved mockup's four rows. Two rules
 * from the mockup decide what appears:
 *
 * - A case study needs a discipline. The personal portfolio has none, so it is
 *   listed on the projects page and not here (UX3 7.4).
 * - Only a case study links. An overview has no page of its own, so it is
 *   never a link (DEC-060).
 *
 * The overviews are Draft until Randi confirms their titles (OPEN-011), so for
 * now the section shows the one case study. That is the truthful state, not a
 * gap to pad: nothing is invented to fill the rows (FAC-HOME-004).
 */
const HEADING_ID = "work-heading";
const OVERVIEW_LIMIT = 3;
const TECHNOLOGY_LIMIT = 3;

interface WorkRowProps {
  readonly disciplines: readonly Discipline[];
  readonly kind: string;
  readonly title: string;
  readonly summary: string;
  readonly technologies: readonly string[];
  readonly href?: string;
}

export function SelectedWorkSection() {
  const caseStudies = getFeaturedProjects().filter(
    (project) => (project.disciplines?.length ?? 0) > 0,
  );
  const overviews = getPublishedProjectOverviews().slice(0, OVERVIEW_LIMIT);

  if (caseStudies.length + overviews.length === 0) {
    return null;
  }

  return (
    <Section surface="light" id={SECTION_IDS.work} labelledBy={HEADING_ID}>
      <div className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-5">
            <Eyebrow>Selected work</Eyebrow>
            <SectionTitle
              id={HEADING_ID}
              lead="Backend and infrastructure, "
              accent="side by side."
            />
          </div>
          <ArrowLink href={ROUTES.projects}>All projects</ArrowLink>
        </div>

        <ol className="flex flex-col border-t border-border">
          {caseStudies.map((project) => (
            <WorkRow
              key={project.id}
              disciplines={project.disciplines ?? []}
              kind={project.period ? `Case study · ${project.period}` : "Case study"}
              title={project.title}
              summary={project.summary}
              technologies={getTechnologyNames(project.technologyIds).slice(0, TECHNOLOGY_LIMIT)}
              href={ROUTES.projectDetail(project.slug)}
            />
          ))}
          {overviews.map((overview) => (
            <WorkRow
              key={overview.id}
              disciplines={overview.disciplines}
              kind="Overview"
              title={overview.title}
              summary={overview.summary}
              technologies={overview.technologies ?? []}
            />
          ))}
        </ol>
      </div>
    </Section>
  );
}

function WorkRow({ disciplines, kind, title, summary, technologies, href }: WorkRowProps) {
  return (
    <li className="grid gap-4 border-b border-border py-8 min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)_minmax(0,1.3fr)] min-[900px]:gap-10">
      <p className="flex flex-col gap-1 text-meta">
        <span className="font-semibold text-accent">
          {disciplines.map((discipline) => DISCIPLINE_LABELS[discipline]).join(" · ")}
        </span>
        <span className="text-text-muted">{kind}</span>
      </p>

      <div className="flex flex-col gap-2">
        <h3 className="text-card-title font-semibold text-balance">{title}</h3>
        <p className="text-body text-text-secondary">{summary}</p>
      </div>

      <div className="flex flex-col gap-2 min-[900px]:items-end min-[900px]:text-right">
        {technologies.length > 0 ? (
          <p className="text-meta text-text-muted">{technologies.join(" · ")}</p>
        ) : null}
        {href ? (
          <ArrowLink href={href} context={title}>
            Read the case study
          </ArrowLink>
        ) : null}
      </div>
    </li>
  );
}
