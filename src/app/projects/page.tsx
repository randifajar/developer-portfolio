import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { ProjectFilter } from "@/components/project/project-filter";
import { ProjectsEmptyState } from "@/components/project/projects-empty-state";
import { toProjectRows } from "@/components/shared/project-rows";
import {
  getActiveResume,
  getPublishedContactChannels,
  getPublishedProjectOverviews,
  getPublishedProjects,
} from "@/domain/content/selectors";
import { buildProjectsIndexMetadata } from "@/domain/metadata/build-metadata";
import { ROUTES, SECTION_IDS } from "@/lib/constants";

export const metadata: Metadata = buildProjectsIndexMetadata();

/**
 * Projects (UX3 7.4).
 *
 * A dark page hero, then every published case study and overview as rows,
 * with the discipline filter above them. Case studies come first in the
 * approved project order; overviews follow in theirs. Only a case study
 * links (DEC-060).
 *
 * The filter replaces v2's grid of cards. DEC-028 kept filtering out of
 * version 1; V3 adds it by the approved design (UX3 7.4).
 */
export default function ProjectsPage() {
  const projects = getPublishedProjects();
  const overviews = getPublishedProjectOverviews();
  const resume = getActiveResume();
  const [contact] = getPublishedContactChannels();

  return (
    <>
      <Section surface="dark" labelledBy="projects-heading" className="pb-14 sm:pb-20">
        <div className="flex flex-col gap-6">
          <Link
            href={`${ROUTES.home}#${SECTION_IDS.work}`}
            className="w-fit text-meta font-semibold text-text-secondary hover:text-accent"
          >
            <span aria-hidden="true">←</span> Overall
          </Link>
          <h1 id="projects-heading" className="font-display text-display-hero font-bold">
            Projects
          </h1>
          <div className="flex max-w-(--spacing-prose) flex-col gap-3">
            <p className="text-lead text-pretty text-text-secondary">
              Case studies covering the problem, my responsibility, the technical approach, and how
              each result was verified.
              {overviews.length > 0
                ? " Only published case studies open a full page; the rest are short overviews."
                : null}
            </p>
            {/* UX 8.2: sanitized professional work should read as deliberate. */}
            <p className="text-meta text-text-muted">
              Professional case studies may use sanitized names, diagrams, and workflow descriptions
              to protect confidential company information.
            </p>
          </div>
        </div>
      </Section>

      <Section surface="light" labelledBy="projects-list-heading">
        <h2 id="projects-list-heading" className="sr-only">
          Project list
        </h2>
        {projects.length + overviews.length > 0 ? (
          <ProjectFilter rows={toProjectRows(projects, overviews)} />
        ) : (
          // This page decides when the empty state appears; the component
          // owns what it says (FAC-PROJECTS-004).
          <ProjectsEmptyState
            resumePath={resume?.publicPath}
            contact={contact ? { label: contact.label, href: contact.publicLink } : undefined}
          />
        )}
      </Section>
    </>
  );
}
