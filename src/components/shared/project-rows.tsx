import { ArrowLink } from "@/components/ui/arrow-link";
import type { ProjectCaseStudy, ProjectOverview } from "@/domain/content/schemas";
import { getTechnologyNames } from "@/domain/content/selectors";
import type { Discipline } from "@/domain/content/types";
import { DISCIPLINE_LABELS, ROUTES } from "@/lib/constants";

/**
 * Project rows, as selected work lists them on the Overall, Backend, and
 * Infrastructure pages (UX3 7.1–7.3).
 *
 * Case studies first, then overviews. Only a case study links: an overview
 * has no page of its own (DEC-060). Each row says what kind of work it is,
 * so an overview is never mistaken for a case study.
 */
const TECHNOLOGY_LIMIT = 3;

interface ProjectRowsProps {
  readonly caseStudies: readonly ProjectCaseStudy[];
  readonly overviews: readonly ProjectOverview[];
}

export function ProjectRows({ caseStudies, overviews }: ProjectRowsProps) {
  return (
    <ol className="flex flex-col border-t border-border">
      {caseStudies.map((project) => (
        <Row
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
        <Row
          key={overview.id}
          disciplines={overview.disciplines}
          kind="Overview"
          title={overview.title}
          summary={overview.summary}
          technologies={overview.technologies ?? []}
        />
      ))}
    </ol>
  );
}

interface RowProps {
  readonly disciplines: readonly Discipline[];
  readonly kind: string;
  readonly title: string;
  readonly summary: string;
  readonly technologies: readonly string[];
  readonly href?: string;
}

function Row({ disciplines, kind, title, summary, technologies, href }: RowProps) {
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
