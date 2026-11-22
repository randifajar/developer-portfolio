import { ProjectRowList, type ProjectRowData } from "@/components/shared/project-row-list";
import type { ProjectCaseStudy, ProjectOverview } from "@/domain/content/schemas";
import { getTechnologyNames } from "@/domain/content/selectors";
import { DISCIPLINE_LABELS, ROUTES } from "@/lib/constants";

/**
 * Project rows from content records, on the server (UX3 7.1–7.4).
 *
 * Case studies first, then overviews. A case study without a discipline, like
 * the portfolio itself, is labelled by its type instead, so its row never
 * reads as unlabelled.
 */
const TECHNOLOGY_LIMIT = 3;

const TYPE_LABEL: Record<ProjectCaseStudy["projectType"], string> = {
  personal: "Personal",
  professional: "Professional",
};

export function toProjectRows(
  caseStudies: readonly ProjectCaseStudy[],
  overviews: readonly ProjectOverview[],
): ProjectRowData[] {
  return [
    ...caseStudies.map((project) => {
      const disciplines = project.disciplines ?? [];

      return {
        id: project.id,
        label:
          disciplines.length > 0
            ? disciplines.map((discipline) => DISCIPLINE_LABELS[discipline]).join(" · ")
            : TYPE_LABEL[project.projectType],
        kind: project.period ? `Case study · ${project.period}` : "Case study",
        title: project.title,
        summary: project.summary,
        technologies: getTechnologyNames(project.technologyIds).slice(0, TECHNOLOGY_LIMIT),
        href: ROUTES.projectDetail(project.slug),
        disciplines,
      };
    }),
    ...overviews.map((overview) => ({
      id: overview.id,
      label: overview.disciplines.map((discipline) => DISCIPLINE_LABELS[discipline]).join(" · "),
      kind: "Overview",
      title: overview.title,
      summary: overview.summary,
      technologies: overview.technologies ?? [],
      disciplines: overview.disciplines,
    })),
  ];
}

interface ProjectRowsProps {
  readonly caseStudies: readonly ProjectCaseStudy[];
  readonly overviews: readonly ProjectOverview[];
}

export function ProjectRows({ caseStudies, overviews }: ProjectRowsProps) {
  return <ProjectRowList rows={toProjectRows(caseStudies, overviews)} />;
}
