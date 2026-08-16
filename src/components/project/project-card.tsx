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
  /**
   * Heading level for the card title.
   *
   * The card appears under an h1 on the Projects Index and under an h2 section
   * heading on the homepage, so its own level depends on where it sits. A
   * hardcoded level skips a heading level in one of the two places, which
   * axe's heading-order rule flags and screen-reader users navigate by.
   */
  readonly headingLevel?: 2 | 3;
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
export function ProjectCard({ project, technologyNames, headingLevel = 3 }: ProjectCardProps) {
  const [firstMediaId] = project.mediaAssetIds ?? [];
  const visual = getPublishedMediaAsset(firstMediaId);
  const Heading = `h${headingLevel}` as const;

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
        <span className="text-meta text-text-muted">{PROJECT_TYPE_LABEL[project.projectType]}</span>
        <StatusBadge status={project.deliveryStatus} />
      </div>

      <Heading className="text-card-title font-semibold text-text-primary">
        <Link
          href={ROUTES.projectDetail(project.slug)}
          className="after:absolute after:inset-0 after:content-[''] group-hover:text-accent"
        >
          {project.title}
        </Link>
      </Heading>

      {/*
        Role sits above the summary as of v1.1 (Issue 6).

        In a five-to-ten second scan the summary describes the project and the
        role describes Randi, and the recruiter question — "what did *he* do
        here?" — was the one answered last. Reading order now matches the order
        the questions are asked in.

        "My role" rather than "Role" for the same reason FAC-PROJECT-003 splits
        responsibility on the detail page: the summary can describe work a team
        delivered, and an unqualified "Role:" directly beneath it invites
        reading the whole summary as his. The possessive scopes the claim to
        him without needing a second field.
      */}
      {/*
        text-text-secondary, not text-text-muted. Moving the role up only helps
        a scan if the eye actually stops there, and muted made it the faintest
        text on the card while being the first thing a recruiter should read.

        This is a token swap, not a new treatment — the same colour the summary
        already uses. Size still separates the two: role at 14px reads as
        metadata, summary at 16px as body.
      */}
      <p className="text-meta text-text-secondary">
        <span className="font-medium">My role:</span> {project.role}
      </p>

      <p className="text-text-secondary">{project.summary}</p>

      {technologyNames.length > 0 ? (
        <ul className="mt-auto flex flex-wrap gap-2 pt-2">
          {technologyNames.map((name) => (
            <li key={name}>
              <TechnologyTag name={name} />
            </li>
          ))}
        </ul>
      ) : null}

      <p className="text-meta font-medium text-accent">View case study →</p>
    </article>
  );
}
