import type { Metadata } from "next";
import { ProjectCard } from "@/components/project/project-card";
import { ProjectsEmptyState } from "@/components/project/projects-empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import {
  getActiveResume,
  getPublishedContactChannels,
  getPublishedProjects,
  getTechnologyNames,
} from "@/domain/content/selectors";
import { buildProjectsIndexMetadata } from "@/domain/metadata/build-metadata";

export const metadata: Metadata = buildProjectsIndexMetadata();

/**
 * Projects Index (UX 8, PAGE-002).
 *
 * Lists every publicly eligible project in approved order. There are no filter
 * controls — DEC-028 excludes filtering from Version 1.
 */
export default function ProjectsPage() {
  const projects = getPublishedProjects();
  const resume = getActiveResume();
  const [contact] = getPublishedContactChannels();

  return (
    <div className="mx-auto w-full max-w-(--spacing-content) px-5 py-16 sm:px-8 lg:px-12">
      <div className="flex flex-col gap-10">
        <SectionHeader
          heading="Projects"
          // The page's primary heading, so structurally an h1 (NFAC-A11Y-003).
          // This previously rendered as an h2 sized like an h1, which left the
          // route with no h1 at all.
          level={1}
          description={
            <>
              <p>
                Case studies covering the problem, my responsibility, the technical approach, and
                how the result was verified.
              </p>
              {/* UX 8.2 requires this note so sanitized professional work is
                  understood as deliberate rather than vague. */}
              <p className="mt-3 text-body text-text-muted">
                Professional case studies may use sanitized names, diagrams, and workflow
                descriptions to protect confidential company information.
              </p>
            </>
          }
        />

        {projects.length > 0 ? (
          /*
           * Count-aware composition (V2-P0-005).
           *
           * The grid was fixed at three columns on large screens, so two
           * published projects rendered as two cards and an obviously empty
           * third slot — the exact impression FAC-HOME-004 forbids on the
           * homepage, reproduced on the index because only the homepage had
           * been given the adaptive rule.
           *
           * Two projects now fill two columns and stop. Three or more restore
           * the third column. The layout follows the content rather than the
           * content being judged against a fixed frame.
           */
          <ul
            className={`grid grid-cols-1 gap-6 ${
              projects.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {projects.map((project) => (
              <li key={project.id} className="flex">
                <ProjectCard
                  project={project}
                  technologyNames={getTechnologyNames(project.technologyIds)}
                  headingLevel={2}
                />
              </li>
            ))}
          </ul>
        ) : (
          // This page decides when the empty state appears; the component owns
          // what it says (FAC-PROJECTS-004).
          <ProjectsEmptyState
            resumePath={resume?.publicPath}
            contact={contact ? { label: contact.label, href: contact.publicLink } : undefined}
          />
        )}
      </div>
    </div>
  );
}
