import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { TechnologyTag } from "@/components/ui/technology-tag";
import type { ProjectCaseStudy } from "@/domain/content/schemas";
import { getPublishedMediaAsset } from "@/domain/content/selectors";
import { ROUTES } from "@/lib/constants";

interface ProjectCardProps {
  readonly project: ProjectCaseStudy;
  /** Canonical technology names, resolved by the caller. */
  readonly technologyNames: readonly string[];
}

const PROJECT_TYPE_LABEL: Record<ProjectCaseStudy["projectType"], string> = {
  personal: "Personal project",
  professional: "Professional work",
};

/**
 * A project card, used on both the homepage and the Projects Index (UX 7.5).
 *
 * The whole card is not a single anchor. Wrapping everything in one link would
 * force the status badge's accessible description and every technology tag
 * into the link's accessible name, producing an unusable announcement. Instead
 * the title carries the link and a stretched pseudo-element makes the full
 * card clickable, which keeps the accessible name to the project title while
 * preserving the large click target.
 */
export function ProjectCard({ project, technologyNames }: ProjectCardProps) {
  const [firstMediaId] = project.mediaAssetIds ?? [];
  const visual = getPublishedMediaAsset(firstMediaId);

  return (
    <article className="group relative flex flex-col gap-4 rounded-(--radius-card) border border-border bg-surface p-6 transition-colors hover:border-accent">
      {/* FAC-PROJECT-006: an absent visual is simply omitted. */}
      {visual ? (
        <Image
          src={visual.filePath}
          alt={visual.altText ?? ""}
          width={visual.width ?? 1200}
          height={visual.height ?? 630}
          className="w-full rounded-(--radius-button) border border-border object-cover"
        />
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-text-muted">{PROJECT_TYPE_LABEL[project.projectType]}</span>
        <StatusBadge status={project.deliveryStatus} />
      </div>

      <h3 className="text-xl font-semibold text-text-primary">
        <Link
          href={ROUTES.projectDetail(project.slug)}
          className="after:absolute after:inset-0 after:content-[''] group-hover:text-accent"
        >
          {project.title}
        </Link>
      </h3>

      <p className="text-text-secondary">{project.summary}</p>

      <p className="text-sm text-text-muted">
        <span className="font-medium text-text-secondary">Role:</span> {project.role}
      </p>

      {technologyNames.length > 0 ? (
        <ul className="mt-auto flex flex-wrap gap-2 pt-2">
          {technologyNames.map((name) => (
            <li key={name}>
              <TechnologyTag name={name} />
            </li>
          ))}
        </ul>
      ) : null}

      <p className="text-sm font-medium text-accent">View case study →</p>
    </article>
  );
}
