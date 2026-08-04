import { aiPractices } from "@/content/ai-practices";
import { contactChannels, externalProfiles } from "@/content/contact";
import { experience } from "@/content/experience";
import { mediaAssets } from "@/content/media";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { resume } from "@/content/resume";
import { siteConfig } from "@/content/site";
import { skills } from "@/content/skills";
import type {
  AIPractice,
  ContactChannel,
  ExternalProfile,
  MediaAsset,
  ProfessionalProfile,
  ProjectCaseStudy,
  Resume,
  SiteConfig,
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

/**
 * Site-wide configuration.
 *
 * Site config has no publication status — it is settings, not publishable
 * content — so this is a pass-through rather than a filter. It lives here
 * anyway so the selector layer remains the single sanctioned reader of
 * src/content, and the lint rule enforcing that boundary needs no exceptions.
 * A rule with carve-outs is a rule people learn to route around.
 */
export function getSiteConfig(): SiteConfig {
  return siteConfig;
}

/** The active public Professional Profile, or null when none is publishable. */
export function getPublishedProfile(): ProfessionalProfile | null {
  return isPubliclyEligible(profile) ? profile : null;
}

/**
 * Whether the site has enough approved content to be worth discovering.
 *
 * Search engines are kept out until this is true. An incomplete portfolio
 * getting indexed and cached actively works against the product goal — a
 * recruiter finding a near-empty page is worse than finding nothing — and
 * NFAC-SEO-002 only asks that pages *intended for discovery* be crawlable.
 *
 * Deliberately derived from content state rather than an environment flag or a
 * hardcoded boolean: it flips itself the moment the launch content is
 * published, so nobody has to remember to turn indexing on, and nobody can
 * turn it on early by accident.
 *
 * The threshold mirrors the launch rule in DEC-030 and FAC-HOME-004: a
 * Published profile and at least two Published projects.
 */
export function isPubliclyLaunchReady(): boolean {
  return getPublishedProfile() !== null && getPublishedProjects().length >= 2;
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
 * Resolve technology ids to their canonical public names.
 *
 * Unknown ids are dropped rather than rendered raw. Cross-record validation
 * already rejects them at build time (rule: valid-technology-references), so
 * reaching this branch means validation was bypassed — and showing a visitor
 * "skill-typescript" would be worse than showing nothing.
 *
 * Draft skills are excluded, so a technology tag cannot leak an unpublished
 * skill onto a card.
 */
export function getTechnologyNames(ids: readonly string[] | undefined): readonly string[] {
  if (!ids || ids.length === 0) {
    return [];
  }

  const published = skills.filter(isPubliclyEligible);

  return ids
    .map((id) => published.find((skill) => skill.id === id)?.name)
    .filter((name): name is string => name !== undefined);
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
