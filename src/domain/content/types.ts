/**
 * Domain enums.
 *
 * These are the machine-readable values stored in content modules. Human-facing
 * labels live in exactly one mapping module per enum so a component can never
 * invent an alternative wording (Technical Design 9.1).
 *
 * Publication Status, Project Delivery Status, and Confidentiality
 * Classification are three independent axes. A record's Delivery Status
 * describes the real project; its Publication Status describes whether the
 * case study is visible; its Confidentiality Classification describes whether
 * it is safe to publish at all (Product Model 4.2).
 */

/** Whether the website renders a record. Approved values: DEC-044. */
export const PUBLICATION_STATUSES = ["draft", "published", "archived"] as const;
export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number];

/** The real condition of a project. Approved values: DEC-045. */
export const PROJECT_DELIVERY_STATUSES = [
  "personal-project",
  "in-development",
  "completed",
  "internal-release",
  "proof-of-concept",
  "production",
  "archived",
] as const;
export type ProjectDeliveryStatus = (typeof PROJECT_DELIVERY_STATUSES)[number];

/** Whether a record may be published at all. Approved values: DEC-046. */
export const CONFIDENTIALITY_CLASSIFICATIONS = [
  "public",
  "sanitized",
  "private",
  "restricted",
] as const;
export type ConfidentialityClassification = (typeof CONFIDENTIALITY_CLASSIFICATIONS)[number];

/**
 * Evidence-oriented skill confidence. Deliberately not numeric —
 * FAC-SKILL-003 forbids percentages, progress bars, and star ratings.
 */
export const SKILL_CLASSIFICATIONS = [
  "strong-working-skill",
  "professional-experience",
  "currently-learning",
] as const;
export type SkillClassification = (typeof SKILL_CLASSIFICATIONS)[number];

/** Practical skill groupings (PRD 7.4). */
export const SKILL_GROUPS = [
  "languages",
  "backend",
  "frontend",
  "databases",
  "apis-and-integration",
  "infrastructure-and-deployment",
  "testing-and-quality",
  "developer-tools",
  "ai-assisted-engineering",
] as const;
export type SkillGroup = (typeof SKILL_GROUPS)[number];

/** Whether a case study describes personal or professional work. */
export const PROJECT_TYPES = ["personal", "professional"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

/** Approved external platforms (PRD 7.8). */
export const EXTERNAL_PLATFORMS = ["linkedin", "github"] as const;
export type ExternalPlatform = (typeof EXTERNAL_PLATFORMS)[number];

/** Approved media categories (PRD 7.9). */
export const MEDIA_TYPES = [
  "professional-photograph",
  "project-screenshot",
  "architecture-diagram",
  "workflow-diagram",
  "social-sharing-image",
  "resume-pdf",
  "favicon",
] as const;
export type MediaType = (typeof MEDIA_TYPES)[number];

/**
 * The confidentiality classes that may ever appear publicly.
 *
 * PRD 7.10 "Public Publication Rule": a record is publicly eligible only when
 * it is Published AND classified Public or approved Sanitized.
 */
export const PUBLISHABLE_CONFIDENTIALITY: readonly ConfidentialityClassification[] = [
  "public",
  "sanitized",
];

/**
 * Single source of truth for public eligibility.
 *
 * Every selector applies this. Keeping it here rather than repeating the
 * predicate means a future change to the rule cannot be applied inconsistently.
 */
export function isPubliclyEligible(record: {
  publicationStatus: PublicationStatus;
  confidentialityClass?: ConfidentialityClassification;
}): boolean {
  if (record.publicationStatus !== "published") {
    return false;
  }

  // Records without a confidentiality axis (for example a contact channel)
  // are eligible on publication status alone.
  if (record.confidentialityClass === undefined) {
    return true;
  }

  return PUBLISHABLE_CONFIDENTIALITY.includes(record.confidentialityClass);
}
