import type { ContentSet, ValidationIssue } from "@/domain/content/validation";
import { validateContentSet } from "@/domain/content/validation";
import { isPubliclyEligible } from "@/domain/content/types";

/**
 * Release validation.
 *
 * The second, stricter gate (ADR-006). Structural validation asks "is this
 * content coherent?"; this asks "is this content ready to be seen by a
 * recruiter?".
 *
 * Splitting the two is what makes it safe to develop against Draft
 * placeholders at all: a development build succeeds with them, a release build
 * cannot. That only holds if this gate is genuinely strict, so it errs toward
 * refusing rather than allowing.
 */

/**
 * Markers that must never survive into Published content.
 *
 * NFAC-CONTENT-004 names TODO, TBD, Lorem ipsum, fake metrics, empty headings,
 * and draft notes. The scan is case-insensitive and applied to every string
 * reachable from a Published record, not just top-level fields, because
 * placeholders hide inside nested challenge and decision objects.
 */
const PLACEHOLDER_PATTERNS: readonly { readonly label: string; readonly pattern: RegExp }[] = [
  { label: "DRAFT PLACEHOLDER", pattern: /draft\s+placeholder/i },
  { label: "TODO", pattern: /\bTODO\b/i },
  { label: "TBD", pattern: /\bTBD\b/i },
  { label: "Lorem ipsum", pattern: /lorem\s+ipsum/i },
  { label: "PLACEHOLDER", pattern: /\bplaceholder\b/i },
  { label: "FIXME", pattern: /\bFIXME\b/i },
  { label: "XXX", pattern: /\bXXX\b/i },
  { label: "pending", pattern: /\bpending\s+(product\s+owner|approval|selection|confirmation)\b/i },
];

/** Slugs of the two confirmed launch case studies (Handoff section 4). */
const REQUIRED_LAUNCH_SLUGS = [
  "personal-developer-portfolio",
  "jury-process-management-integration",
] as const;

/**
 * Fields that are never rendered to a visitor.
 *
 * NFAC-CONTENT-004 is about what reaches production *content*, so identifiers,
 * cross-reference keys, and enum-like values are excluded from the scan.
 * Including them produces false positives — an id such as
 * "experience-placeholder-current" is internal bookkeeping, not copy a
 * recruiter will ever read.
 */
const NON_RENDERED_KEYS = new Set([
  "id",
  "slug",
  "ownerId",
  "ownerType",
  "photoAssetId",
  "mediaAssetIds",
  "technologyIds",
  "projectIds",
  "relatedProjectIds",
  "relatedExperienceIds",
  "publicationStatus",
  "confidentialityClass",
  "deliveryStatus",
  "projectType",
  "classification",
  "group",
  "platform",
  "type",
  "fileFormat",
]);

/**
 * Collect every rendered string reachable from a value, for deep placeholder
 * scanning. Nested objects are traversed because placeholders hide inside
 * challenge and decision entries, not just top-level fields.
 */
function collectRenderedStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") {
    out.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) collectRenderedStrings(item, out);
  } else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (NON_RENDERED_KEYS.has(key)) {
        continue;
      }
      collectRenderedStrings(item, out);
    }
  }
  return out;
}

function scanForPlaceholders(
  record: unknown,
  contentType: string,
  recordId: string,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const text of collectRenderedStrings(record)) {
    for (const { label, pattern } of PLACEHOLDER_PATTERNS) {
      if (pattern.test(text)) {
        issues.push({
          rule: "no-published-placeholders",
          contentType,
          recordId,
          message:
            `Published content contains the placeholder marker "${label}". ` +
            `Production content must not ship unresolved placeholders ` +
            `(NFAC-CONTENT-004).`,
        });
        break;
      }
    }
  }

  return issues;
}

export interface ReleaseValidationOptions {
  /** The configured production site URL, if any. */
  readonly siteUrl?: string | undefined;
}

/**
 * Run structural validation plus every launch-readiness rule.
 *
 * An empty array means the site is releasable.
 */
export function validateRelease(
  content: ContentSet,
  options: ReleaseValidationOptions = {},
): ValidationIssue[] {
  // Everything structural must still hold at release.
  const issues: ValidationIssue[] = [...validateContentSet(content)];
  const add = (issue: ValidationIssue) => issues.push(issue);

  const publishedProjects = content.projects.filter(isPubliclyEligible);

  /* At least two Published projects (DEC-030, FAC-HOME-004). --------------- */
  if (publishedProjects.length < 2) {
    add({
      rule: "minimum-published-projects",
      contentType: "Project Case Study",
      message:
        `Only ${publishedProjects.length} project(s) are Published and publishable. ` +
        `Version 1 launches with at least two.`,
    });
  }

  /* Both confirmed launch case studies are Published. ---------------------- */
  for (const slug of REQUIRED_LAUNCH_SLUGS) {
    const project = content.projects.find((candidate) => candidate.slug === slug);

    if (!project) {
      add({
        rule: "required-launch-projects",
        contentType: "Project Case Study",
        recordId: slug,
        message: `Required launch case study "${slug}" is not registered.`,
      });
      continue;
    }

    if (!isPubliclyEligible(project)) {
      add({
        rule: "required-launch-projects",
        contentType: "Project Case Study",
        recordId: project.id,
        message:
          `Required launch case study "${slug}" is not publicly eligible ` +
          `(status "${project.publicationStatus}", classified ` +
          `"${project.confidentialityClass}").`,
      });
    }
  }

  /* Exactly one active Published Resume (FAC-RESUME-001). ------------------ */
  const activeResumes = content.resumes.filter(
    (candidate) => candidate.isActive && candidate.publicationStatus === "published",
  );

  if (activeResumes.length !== 1) {
    add({
      rule: "exactly-one-active-resume",
      contentType: "Resume",
      message:
        `${activeResumes.length} Resume(s) are active and Published. ` +
        `Exactly one is required at launch.`,
    });
  }

  /* A Published Professional Profile (FAC-PROFILE-001). -------------------- */
  if (!isPubliclyEligible(content.profile)) {
    add({
      rule: "published-profile-required",
      contentType: "Professional Profile",
      recordId: content.profile.id,
      message:
        `The Professional Profile is "${content.profile.publicationStatus}". ` +
        `The homepage cannot present a professional identity without it.`,
    });
  }

  /* Published Work Experience (FAC-EXP-001). ------------------------------- */
  if (content.experience.filter(isPubliclyEligible).length === 0) {
    add({
      rule: "published-experience-required",
      contentType: "Work Experience",
      message: "No Work Experience record is Published.",
    });
  }

  /* Published skills and AI practices (FAC-SKILL-001, FAC-AI-001). --------- */
  if (content.skills.filter(isPubliclyEligible).length === 0) {
    add({
      rule: "published-skills-required",
      contentType: "Technical Skill",
      message: "No Technical Skill is Published.",
    });
  }

  if (content.aiPractices.filter(isPubliclyEligible).length === 0) {
    add({
      rule: "published-ai-practices-required",
      contentType: "AI-Assisted Engineering Practice",
      message: "No AI-Assisted Engineering Practice is Published.",
    });
  }

  /* No placeholder text in anything publicly visible (NFAC-CONTENT-004). --- */
  const publiclyVisible: readonly [string, readonly { id: string }[]][] = [
    ["Professional Profile", isPubliclyEligible(content.profile) ? [content.profile] : []],
    ["Work Experience", content.experience.filter(isPubliclyEligible)],
    ["Project Case Study", publishedProjects],
    ["Technical Skill", content.skills.filter(isPubliclyEligible)],
    ["AI-Assisted Engineering Practice", content.aiPractices.filter(isPubliclyEligible)],
    ["Media Asset", content.mediaAssets.filter(isPubliclyEligible)],
    ["Contact Channel", content.contactChannels.filter(isPubliclyEligible)],
    ["External Professional Profile", content.externalProfiles.filter(isPubliclyEligible)],
  ];

  for (const [contentType, records] of publiclyVisible) {
    for (const record of records) {
      issues.push(...scanForPlaceholders(record, contentType, record.id));
    }
  }

  for (const activeResume of activeResumes) {
    issues.push(...scanForPlaceholders(activeResume, "Resume", activeResume.id));
  }

  /* Required production site URL (TD 12.2). -------------------------------- */
  const siteUrl = options.siteUrl?.trim();

  if (!siteUrl) {
    add({
      rule: "site-url-required",
      contentType: "Site Configuration",
      message: "SITE_URL is not set. Canonical links and social metadata require it at release.",
    });
  } else if (!siteUrl.startsWith("https://")) {
    add({
      rule: "site-url-required",
      contentType: "Site Configuration",
      message: `SITE_URL "${siteUrl}" must be an absolute HTTPS URL in production.`,
    });
  }

  /* Required public links (FAC-CONTACT-001, 003, 004). --------------------- */
  if (content.contactChannels.filter(isPubliclyEligible).length === 0) {
    add({
      rule: "required-public-links",
      contentType: "Contact Channel",
      message: "No public email contact channel is Published.",
    });
  }

  for (const platform of ["linkedin", "github"] as const) {
    const hasPlatform = content.externalProfiles
      .filter(isPubliclyEligible)
      .some((candidate) => candidate.platform === platform);

    if (!hasPlatform) {
      add({
        rule: "required-public-links",
        contentType: "External Professional Profile",
        message: `No Published ${platform} profile link.`,
      });
    }
  }

  /* Required social image (NFAC-SEO-004). ---------------------------------- */
  const hasSocialImage = content.mediaAssets
    .filter(isPubliclyEligible)
    .some((asset) => asset.type === "social-sharing-image");

  if (!hasSocialImage) {
    add({
      rule: "required-social-metadata",
      contentType: "Media Asset",
      message: "No Published social-sharing image for link previews.",
    });
  }

  return issues;
}
