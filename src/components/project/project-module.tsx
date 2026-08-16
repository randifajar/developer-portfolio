import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { TechnologyTag } from "@/components/ui/technology-tag";
import type { ProjectCaseStudy } from "@/domain/content/schemas";
import { getPublishedMediaAsset } from "@/domain/content/selectors";
import { ROUTES } from "@/lib/constants";

interface ProjectModuleProps {
  readonly project: ProjectCaseStudy;
  /** Canonical technology names, resolved by the caller. */
  readonly technologyNames: readonly string[];
  /** Alternate the composition so two projects do not read as one template. */
  readonly reversed?: boolean;
}

const PROJECT_TYPE_LABEL: Record<ProjectCaseStudy["projectType"], string> = {
  personal: "Personal project",
  professional: "Professional work",
};

/**
 * A project presented as an editorial module rather than a card (UX2 9.2).
 *
 * The homepage and the Projects Index deliberately present projects
 * differently. PRD 20 asks for fewer cards and warns against "every project
 * presented identically"; the index is a catalogue where uniform cards are
 * right, and the homepage is a feature where they are not.
 *
 * Field order and the literal "My role:" label are unchanged from SUP-006. That
 * decision was made about a *card*, and PRD 32 lists the identical order for
 * tiles, so the order clearly travels — what changes here is the composition
 * around it, not the sequence. `tests/components/project-card-order.test.tsx`
 * asserts the order against both formats so the two cannot drift apart.
 *
 * The metadata sits above the title rather than in a left column. The mockup
 * used a column and it left an obviously sparse gap at desktop, recorded as a
 * known weakness at the design gate — this is the fix.
 */
export function ProjectModule({ project, technologyNames, reversed = false }: ProjectModuleProps) {
  const [firstMediaId] = project.mediaAssetIds ?? [];
  const visual = getPublishedMediaAsset(firstMediaId);

  return (
    <article className="group relative border-t border-border pt-10">
      <div
        className={`flex flex-col gap-8 ${
          visual ? (reversed ? "lg:flex-row-reverse lg:gap-14" : "lg:flex-row lg:gap-14") : ""
        }`}
      >
        <div className={`flex flex-col gap-5 ${visual ? "lg:w-3/5" : "max-w-(--spacing-prose)"}`}>
          {/* Type and status first — the two facts that frame everything below. */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-eyebrow font-medium tracking-wide text-text-muted uppercase">
              {PROJECT_TYPE_LABEL[project.projectType]}
            </span>
            <StatusBadge status={project.deliveryStatus} />
            {project.period ? (
              <span className="text-meta text-text-muted">{project.period}</span>
            ) : null}
          </div>

          {/*
           * The whole module is not one anchor. Wrapping it would fold the
           * status badge's accessible description and every technology tag into
           * the link's accessible name. The title carries the link and a
           * stretched pseudo-element makes the module clickable, which keeps
           * the accessible name to the project title.
           */}
          <h3 className="text-project-title font-semibold text-text-primary">
            <Link
              href={ROUTES.projectDetail(project.slug)}
              className="after:absolute after:inset-0 after:content-[''] group-hover:text-accent"
            >
              {project.title}
            </Link>
          </h3>

          <p className="text-meta text-text-secondary">
            <span className="font-medium">My role:</span> {project.role}
          </p>

          <p className="text-lead text-text-secondary">{project.summary}</p>

          {technologyNames.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {technologyNames.map((name) => (
                <li key={name}>
                  <TechnologyTag name={name} />
                </li>
              ))}
            </ul>
          ) : null}

          <p className="text-meta font-medium text-accent">View case study →</p>
        </div>

        {/* FAC-PROJECT-006: an absent visual is omitted, not placeheld. */}
        {visual ? (
          <div className="lg:w-2/5">
            <Image
              src={visual.filePath}
              alt={visual.altText ?? ""}
              width={visual.width ?? 1200}
              height={visual.height ?? 630}
              className="w-full rounded-(--radius-card) border border-border object-cover"
            />
          </div>
        ) : null}
      </div>
    </article>
  );
}
