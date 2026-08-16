import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/section";
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
    <article>
      {/*
       * Layer A — the fast scan (UX2 8.2, PRD 34).
       *
       * Everything a reader needs to decide whether to keep reading, before any
       * scrolling: what it was, whether it was professional, when, what Randi
       * did, and what it was built with. The technology stack in particular was
       * previously the thirteenth of fifteen sections, which meant the single
       * most scannable fact on the page was also the least reachable.
       *
       * Dark, matching the homepage hero: this is the page's opening statement.
       *
       * What is deliberately NOT here: the problem and the outcome. PRD 34 asks
       * for both "in one or two sentences", and no such field exists — the
       * authored `problem` runs 288-679 characters and `outcome` 439-992, so
       * either would swamp a scan layer. Truncating them in code would cut a
       * sentence about professional work mid-thought, which is precisely the
       * kind of invented precision the content rules forbid. `summary` is the
       * field actually authored at that length and it does that job here.
       *
       * Closing the gap properly needs a short-form field, which is the
       * "fast-scan summary" candidate PRD 51 already lists. That is a schema
       * decision and Randi's to make.
       */}
      <Section surface="dark" className="pb-12">
        <header className="flex flex-col gap-6">
          <a href={ROUTES.projects} className="text-meta text-accent hover:underline">
            ← Back to Projects
          </a>

          {/* UX 9.2: role and status appear near the top, not buried. */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-eyebrow font-medium tracking-wide text-text-muted uppercase">
              {PROJECT_TYPE_LABEL[project.projectType]}
            </span>
            <StatusBadge status={project.deliveryStatus} />
            {project.period ? (
              <span className="text-meta text-text-muted">{project.period}</span>
            ) : null}
          </div>

          <h1 className="text-display-hero font-bold text-balance text-text-primary">
            {project.title}
          </h1>

          {/*
           * "My role", not "Role" — the same possessive SUP-006 fixed on the
           * card and carried to the module. This page had kept the bare label,
           * so a reader moving from a card to its case study met two different
           * words for the same thing.
           *
           * It sits above the summary here too, for the reason SUP-006 gives:
           * the summary can describe work a team delivered, and the possessive
           * scopes the claim before that sentence is read rather than after.
           */}
          <p className="text-meta text-text-secondary">
            <span className="font-medium">My role:</span> {project.role}
          </p>

          <p className="max-w-(--spacing-prose) text-lead text-text-secondary">{project.summary}</p>

          {technologies.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {technologies.map((name) => (
                <li key={name}>
                  <TechnologyTag name={name} />
                </li>
              ))}
            </ul>
          ) : null}

          {project.repositoryUrl ? (
            <ExternalLink
              href={project.repositoryUrl}
              className="w-fit text-meta text-accent hover:underline"
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
      </Section>

      {/* Layer B — the deep dive. UX 9.5 section order, unchanged. */}
      <Section surface="light">
        <div className="flex flex-col gap-10">
          <ProjectSection heading="Context" body={project.context} />
          <ProjectSection heading="Problem" body={project.problem} />

          <ProjectSection heading="Responsibility">
            <ProjectResponsibility
              personal={project.personalResponsibilities}
              team={project.teamResponsibilities}
            />
          </ProjectSection>

          <ProjectSection heading="Technical Approach" body={project.technicalApproach} />
          <ProjectSection
            heading="Architecture and Workflow"
            body={project.workflowOrArchitecture}
          />

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
          <ProjectSection
            heading="Testing and Verification"
            body={project.testingAndVerification}
          />
          <ProjectSection heading="Outcome" body={project.outcome} />
          <ProjectSection heading="AI-Assisted Engineering" body={project.aiUsage} />
          <ProjectSection heading="Lessons Learned" body={project.lessonsLearned} />

          {project.confidentialityNote ? (
            <section className="rounded-(--radius-card) border border-border bg-surface-muted p-5">
              <h2 className="sr-only">Confidentiality note</h2>
              <p className="text-meta text-text-muted">{project.confidentialityNote}</p>
            </section>
          ) : null}

          <ProjectNavigation
            previous={previous}
            next={next}
            resumeHref={resume?.publicPath ?? null}
            contactHref={contact?.publicLink ?? null}
          />
        </div>
      </Section>
    </article>
  );
}
