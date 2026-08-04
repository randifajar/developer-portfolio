import { aiPractices } from "@/content/ai-practices";
import { contactChannels, externalProfiles } from "@/content/contact";
import { experience } from "@/content/experience";
import { mediaAssets } from "@/content/media";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { resume } from "@/content/resume";
import { skills } from "@/content/skills";
import type {
  AIPractice,
  ContactChannel,
  ExternalProfile,
  MediaAsset,
  ProfessionalProfile,
  ProjectCaseStudy,
  Resume,
  TechnicalSkill,
  WorkExperience,
} from "@/domain/content/schemas";
import type { SkillGroup } from "@/domain/content/types";
import { SKILL_GROUPS, isPubliclyEligible } from "@/domain/content/types";
import { getAdjacentProjects } from "@/domain/projects/project-navigation";

/**
 * Content selectors — the only sanctioned path from raw content to a page.
 *
 * Every function here applies the same eligibility rule: Published, and
 * classified Public or approved Sanitized. Pages and components must not
 * import from `src/content` directly; a lint rule enforces that boundary.
 *
 * This single choke point is what makes the confidentiality guarantee hold. If
 * a page could reach raw content, every filtering rule would become a thing
 * someone has to remember rather than something the architecture enforces
 * (FAC-PUBLISH-001, FAC-PUBLISH-002, NFAC-SEC-006).
 */

/** Ordering for the Projects Index and Selected Projects (FAC-PROJECTS-003). */
function compareProjects(a: ProjectCaseStudy, b: ProjectCaseStudy): number {
  // 1. Featured priority, lowest number first. Unfeatured sorts after.
  const priorityA = a.featured
    ? (a.featuredPriority ?? Number.MAX_SAFE_INTEGER)
    : Number.MAX_SAFE_INTEGER;
  const priorityB = b.featured
    ? (b.featuredPriority ?? Number.MAX_SAFE_INTEGER)
    : Number.MAX_SAFE_INTEGER;

  if (priorityA !== priorityB) {
    return priorityA - priorityB;
  }

  // 2. Recency, most recently updated first.
  if (a.updatedAt !== b.updatedAt) {
    return a.updatedAt < b.updatedAt ? 1 : -1;
  }

  // 3. Title, so ordering is deterministic rather than dependent on
  //    registration order. A stable order matters because it drives static
  //    route generation and the sitemap.
  return a.title.localeCompare(b.title);
}

/** The active public Professional Profile, or null when none is publishable. */
export function getPublishedProfile(): ProfessionalProfile | null {
  return isPubliclyEligible(profile) ? profile : null;
}

/** Published Work Experience, most recent first (UX 7.6). */
export function getPublishedExperience(): readonly WorkExperience[] {
  return experience
    .filter(isPubliclyEligible)
    .slice()
    .sort((a, b) => {
      // A current role always leads.
      if (a.isCurrent !== b.isCurrent) {
        return a.isCurrent ? -1 : 1;
      }
      if (a.startDate !== b.startDate) {
        return a.startDate < b.startDate ? 1 : -1;
      }
      return a.sortOrder - b.sortOrder;
    });
}

/** Every publicly eligible project, in approved order. */
export function getPublishedProjects(): readonly ProjectCaseStudy[] {
  return projects.filter(isPubliclyEligible).slice().sort(compareProjects);
}

/**
 * Featured projects for the homepage.
 *
 * FAC-HOME-004: with two ready projects this returns two, and the caller
 * renders two cards. It never pads the result, so no empty or "Coming Soon"
 * card can appear.
 */
export function getFeaturedProjects(limit?: number): readonly ProjectCaseStudy[] {
  const featured = getPublishedProjects().filter((project) => project.featured);

  return limit === undefined ? featured : featured.slice(0, limit);
}

/**
 * Resolve a project by slug, or null when it is unknown or not publicly
 * eligible.
 *
 * Returning null for both cases is deliberate and is what lets the route call
 * notFound() identically either way, so the response cannot reveal that a
 * Draft, Archived, Private, or Restricted project exists (DEC-047,
 * FAC-NAV-006).
 */
export function getPublishedProjectBySlug(slug: string): ProjectCaseStudy | null {
  return getPublishedProjects().find((project) => project.slug === slug) ?? null;
}

/** Previous and next publicly eligible projects around a slug. */
export function getAdjacentPublishedProjects(slug: string) {
  return getAdjacentProjects(getPublishedProjects(), slug);
}

export interface SkillGroupView {
  readonly group: SkillGroup;
  readonly skills: readonly TechnicalSkill[];
}

/**
 * Published skills grouped by discipline.
 *
 * Empty groups are omitted entirely rather than rendered as empty headings
 * (FAC-HOME-005).
 */
export function getPublishedSkillGroups(): readonly SkillGroupView[] {
  const published = skills.filter(isPubliclyEligible);

  return SKILL_GROUPS.map((group) => ({
    group,
    skills: published
      .filter((skill) => skill.group === group)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder),
  })).filter((view) => view.skills.length > 0);
}

/** Published AI-Assisted Engineering practices, in workflow order. */
export function getPublishedAIPractices(): readonly AIPractice[] {
  return aiPractices
    .filter(isPubliclyEligible)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * The active public Resume, or null when none is available.
 *
 * Null is a supported state, not an error: FAC-RESUME-003 requires the site to
 * present a truthful unavailable state rather than claim a download succeeded.
 */
export function getActiveResume(): Resume | null {
  return resume.isActive && isPubliclyEligible(resume) ? resume : null;
}

/** Published contact channels (FAC-CONTACT-001). */
export function getPublishedContactChannels(): readonly ContactChannel[] {
  return contactChannels.filter(isPubliclyEligible);
}

/** Published external profiles (FAC-CONTACT-003, FAC-CONTACT-004). */
export function getPublishedExternalProfiles(): readonly ExternalProfile[] {
  return externalProfiles.filter(isPubliclyEligible);
}

/**
 * A publicly eligible media asset by id, or null.
 *
 * FAC-PUBLISH-003: a Restricted asset is never returned, so its path is never
 * rendered and never exposed.
 */
export function getPublishedMediaAsset(id: string | undefined): MediaAsset | null {
  if (!id) {
    return null;
  }

  return mediaAssets.filter(isPubliclyEligible).find((asset) => asset.id === id) ?? null;
}
