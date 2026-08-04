import type { Metadata } from "next";
import { ProjectCard } from "@/components/project/project-card";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeader } from "@/components/ui/section-header";
import {
  getActiveResume,
  getPublishedContactChannels,
  getPublishedProjects,
  getTechnologyNames,
} from "@/domain/content/selectors";
import { buildProjectsIndexMetadata } from "@/domain/metadata/build-metadata";
import { ROUTES, SECTION_IDS } from "@/lib/constants";

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
              <p className="mt-3 text-base text-text-muted">
                Professional case studies may use sanitized names, diagrams, and workflow
                descriptions to protect confidential company information.
              </p>
            </>
          }
        />

        {projects.length > 0 ? (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          /*
           * FAC-PROJECTS-004: a truthful empty state, not an apology and not a
           * fabricated placeholder card. This is a valid page state but not a
           * launch-ready product state — release validation is what refuses
           * the launch, not this component.
           */
          <div className="flex flex-col items-start gap-6 rounded-(--radius-card) border border-border bg-surface p-8 sm:p-12">
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold text-text-primary">
                Case studies are being prepared
              </h2>
              <p className="max-w-(--spacing-prose) text-text-secondary">
                Published project case studies will appear here. In the meantime, my resume and
                contact details are available.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <ButtonLink href={ROUTES.home}>Return home</ButtonLink>

              {resume ? (
                <ButtonLink href={resume.publicPath} variant="secondary" external>
                  View Resume
                </ButtonLink>
              ) : null}

              {contact ? (
                <ButtonLink href={contact.publicLink} variant="secondary">
                  {contact.label}
                </ButtonLink>
              ) : (
                <ButtonLink href={`${ROUTES.home}#${SECTION_IDS.contact}`} variant="secondary">
                  Contact
                </ButtonLink>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
