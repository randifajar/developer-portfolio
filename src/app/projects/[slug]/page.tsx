import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProjectNavigation } from "@/components/project/project-navigation";
import { ProjectResponsibility } from "@/components/project/project-responsibility";
import { ProjectSection } from "@/components/project/project-section";
import { ExternalLink } from "@/components/ui/external-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { TechnologyTag } from "@/components/ui/technology-tag";
import {
  getActiveResume,
  getAdjacentPublishedProjects,
  getPublishedContactChannels,
  getPublishedMediaAsset,
  getPublishedProjectBySlug,
  getPublishedProjects,
  getTechnologyNames,
} from "@/domain/content/selectors";
import { buildProjectMetadata } from "@/domain/metadata/build-metadata";
import { ROUTES } from "@/lib/constants";

/**
 * Only slugs returned by generateStaticParams may render. Any other slug
 * produces a 404 without executing this route at all.
 *
 * This is the mechanism behind FAC-NAV-006 and DEC-047: an unpublished project
 * has no route, so an unknown slug and a Draft slug are indistinguishable from
 * outside. Removing this line would let unknown slugs be rendered at request
 * time and reintroduce the leak.
 */
export const dynamicParams = false;

const PROJECT_TYPE_LABEL = {
  personal: "Personal project",
  professional: "Professional work",
} as const;

/** One static route per publicly eligible project — and nothing else. */
export function generateStaticParams() {
  return getPublishedProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getPublishedProjectBySlug(slug);

  if (!project) {
    return {};
  }

  return buildProjectMetadata(project);
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getPublishedProjectBySlug(slug);

  // Unknown, Draft, Archived, Private, and Restricted all arrive here as null
  // and produce the identical public result.
  if (!project) {
    notFound();
  }

  const technologies = getTechnologyNames(project.technologyIds);
  const { previous, next } = getAdjacentPublishedProjects(slug);
  const resume = getActiveResume();
  const [contact] = getPublishedContactChannels();
  const [firstMediaId] = project.mediaAssetIds ?? [];
  const visual = getPublishedMediaAsset(firstMediaId);

  return (
    <article className="mx-auto w-full max-w-(--spacing-content) px-5 py-12 sm:px-8 lg:px-12">
      <div className="flex flex-col gap-10">
        <header className="flex flex-col gap-6">
          <a href={ROUTES.projects} className="text-sm text-accent hover:underline">
            ← Back to Projects
          </a>

          {/* UX 9.2: role and status appear near the top, not buried. */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-text-muted">
              {PROJECT_TYPE_LABEL[project.projectType]}
            </span>
            <StatusBadge status={project.deliveryStatus} />
            {project.period ? (
              <span className="text-sm text-text-muted">{project.period}</span>
            ) : null}
          </div>

          <h1 className="text-4xl font-bold text-balance text-text-primary sm:text-5xl">
            {project.title}
          </h1>

          <p className="max-w-(--spacing-prose) text-lg text-text-secondary">{project.summary}</p>

          <p className="text-text-muted">
            <span className="font-medium text-text-secondary">Role:</span> {project.role}
          </p>

          {project.repositoryUrl ? (
            <ExternalLink
              href={project.repositoryUrl}
              className="w-fit text-sm text-accent hover:underline"
            >
              View repository
            </ExternalLink>
          ) : null}

          {visual ? (
            <Image
              src={visual.filePath}
              alt={visual.altText ?? ""}
              width={visual.width ?? 1200}
              height={visual.height ?? 630}
              priority
              className="w-full rounded-(--radius-card) border border-border object-cover"
            />
          ) : null}
        </header>

        {/* UX 9.5 section order. */}
        <ProjectSection heading="Context" body={project.context} />
        <ProjectSection heading="Problem" body={project.problem} />

        <ProjectSection heading="Responsibility">
          <ProjectResponsibility
            personal={project.personalResponsibilities}
            team={project.teamResponsibilities}
          />
        </ProjectSection>

        <ProjectSection heading="Technical Approach" body={project.technicalApproach} />
        <ProjectSection heading="Architecture and Workflow" body={project.workflowOrArchitecture} />

        <ProjectSection heading="Challenges">
          <div className="flex flex-col gap-4">
            {project.challenges.map((challenge) => (
              <div
                key={challenge.title}
                className="flex flex-col gap-2 rounded-(--radius-card) border border-border bg-surface p-5"
              >
                <h3 className="font-semibold text-text-primary">{challenge.title}</h3>
                <p className="text-text-secondary">{challenge.description}</p>
              </div>
            ))}
          </div>
        </ProjectSection>

        <ProjectSection heading="Decisions and Trade-offs">
          <div className="flex flex-col gap-4">
            {project.decisionsAndTradeoffs.map((entry) => (
              <div
                key={entry.decision}
                className="flex flex-col gap-2 rounded-(--radius-card) border border-border bg-surface p-5"
              >
                <h3 className="font-semibold text-text-primary">{entry.decision}</h3>
                <p className="text-text-secondary">
                  <span className="font-medium">Why: </span>
                  {entry.rationale}
                </p>
                {entry.tradeoff ? (
                  <p className="text-text-muted">
                    <span className="font-medium">Trade-off: </span>
                    {entry.tradeoff}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </ProjectSection>

        <ProjectSection heading="Implementation Summary" body={project.implementationSummary} />
        <ProjectSection heading="Testing and Verification" body={project.testingAndVerification} />
        <ProjectSection heading="Outcome" body={project.outcome} />
        <ProjectSection heading="AI-Assisted Engineering" body={project.aiUsage} />
        <ProjectSection heading="Lessons Learned" body={project.lessonsLearned} />

        {technologies.length > 0 ? (
          <ProjectSection heading="Technology Stack">
            <ul className="flex flex-wrap gap-2">
              {technologies.map((name) => (
                <li key={name}>
                  <TechnologyTag name={name} />
                </li>
              ))}
            </ul>
          </ProjectSection>
        ) : null}

        {project.confidentialityNote ? (
          <section className="rounded-(--radius-card) border border-border bg-surface-muted p-5">
            <h2 className="sr-only">Confidentiality note</h2>
            <p className="text-sm text-text-muted">{project.confidentialityNote}</p>
          </section>
        ) : null}

        <ProjectNavigation
          previous={previous}
          next={next}
          resumeHref={resume?.publicPath ?? null}
          contactHref={contact?.publicLink ?? null}
        />
      </div>
    </article>
  );
}
