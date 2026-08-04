import type { ProjectCaseStudy } from "@/domain/content/schemas";
import { juryProcessManagement } from "@/content/projects/jury-process-management";
import { personalDeveloperPortfolio } from "@/content/projects/personal-developer-portfolio";

/**
 * The project registry.
 *
 * Both the selector layer and cross-record validation read this single array,
 * so a project cannot exist for one and not the other. Adding a project means
 * creating its module and registering it here (ADR-004).
 *
 * Order here is registration order, not display order. Public ordering is
 * applied by the selectors: featured priority, then recency, then the rest
 * (FAC-PROJECTS-003).
 */
export const projects: readonly ProjectCaseStudy[] = [
  personalDeveloperPortfolio,
  juryProcessManagement,
];
