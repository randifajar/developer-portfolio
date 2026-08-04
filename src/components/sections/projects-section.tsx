import { ProjectCard } from "@/components/project/project-card";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeader } from "@/components/ui/section-header";
import { getFeaturedProjects, getTechnologyNames } from "@/domain/content/selectors";
import { ROUTES, SECTION_IDS } from "@/lib/constants";

/**
 * Selected Projects (UX 7.5).
 *
 * Renders exactly the featured projects the selector returns — nothing is
 * padded. FAC-HOME-004 is explicit: with two ready projects the section shows
 * two balanced cards, never an empty third slot and never a fake "Coming Soon"
 * card. The grid column count adapts to the real count for that reason.
 */
export function ProjectsSection() {
  const projects = getFeaturedProjects();

  if (projects.length === 0) {
    return null;
  }

  // Two projects get two columns, three or more get three. This is what keeps
  // a two-project launch looking deliberate rather than short.
  const gridColumns = projects.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      id={SECTION_IDS.projects}
      className="mx-auto w-full max-w-(--spacing-content) px-5 py-16 sm:px-8 lg:px-12"
    >
      <div className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            eyebrow="Selected work"
            heading="Projects"
            description="Case studies covering the problem, my responsibility, the technical approach, and how the result was verified."
          />
          <ButtonLink href={ROUTES.projects} variant="secondary">
            View All Projects
          </ButtonLink>
        </div>

        <ul className={`grid grid-cols-1 gap-6 ${gridColumns}`}>
          {projects.map((project) => (
            <li key={project.id} className="flex">
              <ProjectCard
                project={project}
                technologyNames={getTechnologyNames(project.technologyIds)}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
