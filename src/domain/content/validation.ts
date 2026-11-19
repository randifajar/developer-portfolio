import type {
  CareerChapter,
  Certification,
  ContactChannel,
  Education,
  EngineeringPractice,
  ExternalProfile,
  Language,
  MediaAsset,
  ModeIntro,
  ProfessionalProfile,
  ProjectCaseStudy,
  ProjectOverview,
  Resume,
  TechnicalSkill,
  ToolkitGroup,
  WorkExperience,
} from "@/domain/content/schemas";
import { DISCIPLINES, MODES } from "@/domain/content/types";

/**
 * Cross-record validation.
 *
 * Zod enforces what a single record can check about itself. These are the rules
 * that need to see the whole content set: uniqueness, references between
 * records, and "exactly one of" constraints (Technical Design 9.4).
 *
 * Every violation is collected rather than thrown on first sight. Fixing a
 * content file one error at a time is a guessing game, so the caller gets the
 * complete list.
 */

export interface ValidationIssue {
  /** Which rule failed, for grouping in output. */
  readonly rule: string;
  /** Which content type the offending record belongs to. */
  readonly contentType: string;
  /** The offending record, where one can be identified. */
  readonly recordId?: string;
  /** What is wrong and what to do about it. */
  readonly message: string;
}

export interface ContentSet {
  readonly profile: ProfessionalProfile;
  readonly experience: readonly WorkExperience[];
  readonly projects: readonly ProjectCaseStudy[];
  readonly skills: readonly TechnicalSkill[];
  readonly resumes: readonly Resume[];
  readonly contactChannels: readonly ContactChannel[];
  readonly externalProfiles: readonly ExternalProfile[];
  readonly mediaAssets: readonly MediaAsset[];
  // V3 records (UX/UI specification v3.0).
  readonly modeIntros: readonly ModeIntro[];
  readonly careerChapters: readonly CareerChapter[];
  readonly education: readonly Education[];
  readonly certifications: readonly Certification[];
  readonly languages: readonly Language[];
  readonly engineeringPractices: readonly EngineeringPractice[];
  readonly toolkitGroups: readonly ToolkitGroup[];
  readonly projectOverviews: readonly ProjectOverview[];
}

/** Sections a Published project must not leave empty (PRD 5.3). */
const REQUIRED_PROJECT_SECTIONS = [
  "context",
  "problem",
  "technicalApproach",
  "implementationSummary",
  "testingAndVerification",
  "outcome",
  "lessonsLearned",
] as const satisfies readonly (keyof ProjectCaseStudy)[];

function findDuplicates(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }
    seen.add(value);
  }

  return [...duplicates];
}

/**
 * Run every cross-record rule and return all violations.
 *
 * An empty array means the content set is structurally valid.
 */
export function validateContentSet(content: ContentSet): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const add = (issue: ValidationIssue) => issues.push(issue);

  /* Rule 1 — unique ids within each content type. ------------------------- */
  const idGroups: readonly [string, readonly { id: string }[]][] = [
    ["Work Experience", content.experience],
    ["Project Case Study", content.projects],
    ["Technical Skill", content.skills],
    ["Resume", content.resumes],
    ["Contact Channel", content.contactChannels],
    ["External Professional Profile", content.externalProfiles],
    ["Media Asset", content.mediaAssets],
    ["Mode Intro", content.modeIntros],
    ["Career Chapter", content.careerChapters],
    ["Education", content.education],
    ["Certification", content.certifications],
    ["Language", content.languages],
    ["Engineering Practice", content.engineeringPractices],
    ["Toolkit Group", content.toolkitGroups],
    ["Project Overview", content.projectOverviews],
  ];

  for (const [contentType, records] of idGroups) {
    for (const duplicate of findDuplicates(records.map((record) => record.id))) {
      add({
        rule: "unique-ids",
        contentType,
        recordId: duplicate,
        message: `Duplicate id "${duplicate}". Every record of a type needs a distinct id.`,
      });
    }
  }

  /* Rule 2 — unique project slugs. ---------------------------------------- */
  for (const duplicate of findDuplicates(content.projects.map((project) => project.slug))) {
    add({
      rule: "unique-slugs",
      contentType: "Project Case Study",
      recordId: duplicate,
      message:
        `Duplicate slug "${duplicate}". Slugs generate routes, so two projects ` +
        `sharing one makes route resolution ambiguous.`,
    });
  }

  /* Rule 3 — valid technology references. --------------------------------- */
  const skillIds = new Set(content.skills.map((skill) => skill.id));

  for (const project of content.projects) {
    for (const technologyId of project.technologyIds) {
      if (!skillIds.has(technologyId)) {
        add({
          rule: "valid-technology-references",
          contentType: "Project Case Study",
          recordId: project.id,
          message: `References unknown technology "${technologyId}".`,
        });
      }
    }
  }

  for (const role of content.experience) {
    for (const technologyId of role.technologyIds ?? []) {
      if (!skillIds.has(technologyId)) {
        add({
          rule: "valid-technology-references",
          contentType: "Work Experience",
          recordId: role.id,
          message: `References unknown technology "${technologyId}".`,
        });
      }
    }
  }

  /* Rule 4 — valid media references. -------------------------------------- */
  const mediaIds = new Set(content.mediaAssets.map((asset) => asset.id));

  if (content.profile.photoAssetId && !mediaIds.has(content.profile.photoAssetId)) {
    add({
      rule: "valid-media-references",
      contentType: "Professional Profile",
      recordId: content.profile.id,
      message: `References unknown media asset "${content.profile.photoAssetId}".`,
    });
  }

  for (const project of content.projects) {
    for (const assetId of project.mediaAssetIds ?? []) {
      if (!mediaIds.has(assetId)) {
        add({
          rule: "valid-media-references",
          contentType: "Project Case Study",
          recordId: project.id,
          message: `References unknown media asset "${assetId}".`,
        });
      }
    }
  }

  /* Rule 5 — valid project references. ------------------------------------ */
  const projectIds = new Set(content.projects.map((project) => project.id));

  for (const role of content.experience) {
    for (const projectId of role.projectIds ?? []) {
      if (!projectIds.has(projectId)) {
        add({
          rule: "valid-project-references",
          contentType: "Work Experience",
          recordId: role.id,
          message: `References unknown project "${projectId}".`,
        });
      }
    }
  }

  /* Rule 6 — at most one active Published Resume per variant (FAC-RESUME-004). */
  // Amended for V3 (DEC-059): one backend and one infrastructure résumé may both
  // be active, since the Résumé menu offers one of each. Two of the same variant
  // would still make "the" backend résumé ambiguous.
  for (const variant of DISCIPLINES) {
    const activePublishedResumes = content.resumes.filter(
      (candidate) =>
        candidate.variant === variant &&
        candidate.isActive &&
        candidate.publicationStatus === "published",
    );

    if (activePublishedResumes.length > 1) {
      add({
        rule: "single-active-resume",
        contentType: "Resume",
        message:
          `${activePublishedResumes.length} ${variant} Resumes are both active and Published ` +
          `(${activePublishedResumes.map((r) => r.id).join(", ")}). Exactly one per variant may be.`,
      });
    }
  }

  /* Rule 7 — at most one Published Profile (FAC-PROFILE-004). -------------- */
  // A single profile object is modelled, so this cannot currently exceed one.
  // The rule is stated explicitly so the guarantee survives a future change to
  // a profile array.

  /* Rule 8 — no Restricted content Published (FAC-PUBLISH-002). ------------ */
  /* Rule 9 — no Private content Published (FAC-PUBLISH-002). -------------- */
  const classifiedGroups: readonly [
    string,
    readonly { id: string; publicationStatus: string; confidentialityClass: string }[],
  ][] = [
    ["Work Experience", content.experience],
    ["Project Case Study", content.projects],
    ["Media Asset", content.mediaAssets],
    ["Project Overview", content.projectOverviews],
  ];

  for (const [contentType, records] of classifiedGroups) {
    for (const record of records) {
      if (
        record.publicationStatus === "published" &&
        (record.confidentialityClass === "private" || record.confidentialityClass === "restricted")
      ) {
        add({
          rule: "no-published-private-or-restricted",
          contentType,
          recordId: record.id,
          message:
            `Classified "${record.confidentialityClass}" but marked Published. ` +
            `Only Public or approved Sanitized content may be Published.`,
        });
      }
    }
  }

  /* Rule 10 — Published projects have every required section. -------------- */
  for (const project of content.projects) {
    if (project.publicationStatus !== "published") {
      continue;
    }

    for (const section of REQUIRED_PROJECT_SECTIONS) {
      const value = project[section];
      if (typeof value !== "string" || value.trim().length === 0) {
        add({
          rule: "published-projects-complete",
          contentType: "Project Case Study",
          recordId: project.id,
          message: `Published but missing required section "${section}".`,
        });
      }
    }

    if (project.personalResponsibilities.length === 0) {
      add({
        rule: "published-projects-complete",
        contentType: "Project Case Study",
        recordId: project.id,
        message: "Published but states no personal responsibilities (FAC-PROJECT-003).",
      });
    }
  }

  /* Rule 11 — featured projects are Published (FAC-HOME-003). -------------- */
  for (const project of content.projects) {
    if (project.featured && project.publicationStatus !== "published") {
      add({
        rule: "featured-projects-published",
        contentType: "Project Case Study",
        recordId: project.id,
        message:
          `Marked featured but is "${project.publicationStatus}". ` +
          `A featured project appears on the homepage, so it must be Published.`,
      });
    }
  }

  /* Rule 12 — featured priorities do not collide. -------------------------- */
  const featuredPriorities = content.projects
    .filter((project) => project.featured && project.featuredPriority !== undefined)
    .map((project) => String(project.featuredPriority));

  for (const duplicate of findDuplicates(featuredPriorities)) {
    add({
      rule: "unique-featured-priority",
      contentType: "Project Case Study",
      message:
        `Two featured projects share featuredPriority ${duplicate}, ` +
        `so homepage ordering is not deterministic.`,
    });
  }

  /* Rule 13 — Production requires explicit confirmation (TD 9.5). ---------- */
  // Enforced by the schema, restated here so validation output is complete
  // even if a record is ever constructed without the definition helper.
  for (const project of content.projects) {
    if (
      project.deliveryStatus === "production" &&
      project.productionConfirmation?.verified !== true
    ) {
      add({
        rule: "production-requires-confirmation",
        contentType: "Project Case Study",
        recordId: project.id,
        message:
          "Uses Production status without a verified productionConfirmation. " +
          "Work that did not reach production must not claim it.",
      });
    }
  }

  /* Rule 14 — external URLs use allowed protocols (NFAC-SEC-003). ---------- */
  for (const externalProfile of content.externalProfiles) {
    if (!externalProfile.url.startsWith("https://")) {
      add({
        rule: "safe-external-urls",
        contentType: "External Professional Profile",
        recordId: externalProfile.id,
        message: `URL "${externalProfile.url}" must use https.`,
      });
    }
  }

  for (const project of content.projects) {
    if (project.repositoryUrl && !project.repositoryUrl.startsWith("https://")) {
      add({
        rule: "safe-external-urls",
        contentType: "Project Case Study",
        recordId: project.id,
        message: `Repository URL "${project.repositoryUrl}" must use https.`,
      });
    }
  }

  for (const channel of content.contactChannels) {
    if (!channel.publicLink.startsWith("mailto:")) {
      add({
        rule: "safe-external-urls",
        contentType: "Contact Channel",
        recordId: channel.id,
        message: `Contact link "${channel.publicLink}" must use the mailto: scheme.`,
      });
    }
  }

  /* Rule 15 — Resume path is a PDF, media paths are local and safe. -------- */
  for (const candidate of content.resumes) {
    if (!candidate.publicPath.toLowerCase().endsWith(".pdf")) {
      add({
        rule: "resume-is-pdf",
        contentType: "Resume",
        recordId: candidate.id,
        message: `publicPath "${candidate.publicPath}" must point to a .pdf file.`,
      });
    }
  }

  for (const asset of content.mediaAssets) {
    if (!asset.filePath.startsWith("/")) {
      add({
        rule: "local-media-paths",
        contentType: "Media Asset",
        recordId: asset.id,
        message: `filePath "${asset.filePath}" must be a local path starting with "/".`,
      });
    }
  }

  /* Rule 16 — career chapters cite real roles, inside the chapter's year. -- */
  // A chapter's year is editorial grouping; the roles it cites are the facts.
  // So each cited id must resolve to an experience record, and the chapter's
  // year must fall within that role's span — a current role is open-ended.
  const experienceById = new Map(content.experience.map((role) => [role.id, role]));

  for (const chapter of content.careerChapters) {
    for (const experienceId of chapter.experienceIds) {
      const role = experienceById.get(experienceId);

      if (!role) {
        add({
          rule: "valid-experience-references",
          contentType: "Career Chapter",
          recordId: chapter.id,
          message: `Cites experience "${experienceId}", which does not exist.`,
        });
        continue;
      }

      const startYear = Number(role.startDate.slice(0, 4));
      const endYear = role.isCurrent ? Number.POSITIVE_INFINITY : Number(role.endDate?.slice(0, 4));

      if (chapter.year < startYear || chapter.year > endYear) {
        add({
          rule: "chapter-year-within-roles",
          contentType: "Career Chapter",
          recordId: chapter.id,
          message:
            `Year ${chapter.year} falls outside "${experienceId}" (${role.startDate} – ` +
            `${role.isCurrent ? "present" : role.endDate}). A chapter may only cite roles it spans.`,
        });
      }
    }
  }

  /* Rule 17 — at most one Published intro per mode (UX3 7). --------------- */
  // "At most", like Rule 6: a content set without V3 intros is valid while the
  // v2 site is live. Requiring exactly one belongs to release validation, once
  // the mode pages that render them exist.
  for (const mode of MODES) {
    const published = content.modeIntros.filter(
      (intro) => intro.mode === mode && intro.publicationStatus === "published",
    );

    if (published.length > 1) {
      add({
        rule: "one-intro-per-mode",
        contentType: "Mode Intro",
        message:
          `Mode "${mode}" has ${published.length} Published intros ` +
          `(${published.map((intro) => intro.id).join(", ")}). Its hero needs one heading, not two.`,
      });
    }
  }

  /* Rule 18 — every Published intro names the engineer (V3-CONT-003). ----- */
  // In the eyebrow or across the two heading lines; Overall does the latter.
  for (const intro of content.modeIntros) {
    if (intro.publicationStatus !== "published") continue;

    const text = `${intro.eyebrow} ${intro.headingLines.join(" ")}`;

    if (!text.includes(content.profile.fullName)) {
      add({
        rule: "intro-names-engineer",
        contentType: "Mode Intro",
        recordId: intro.id,
        message:
          `Neither the eyebrow nor the heading names "${content.profile.fullName}". Every ` +
          "mode's hero must identify the engineer (V3-CONT-003).",
      });
    }
  }

  return issues;
}

/** Render issues as a readable report, grouped by rule. */
export function formatValidationIssues(issues: readonly ValidationIssue[]): string {
  if (issues.length === 0) {
    return "Content validation passed.";
  }

  const byRule = new Map<string, ValidationIssue[]>();
  for (const issue of issues) {
    const existing = byRule.get(issue.rule) ?? [];
    existing.push(issue);
    byRule.set(issue.rule, existing);
  }

  const sections = [...byRule.entries()].map(([rule, ruleIssues]) => {
    const lines = ruleIssues.map((issue) => {
      const record = issue.recordId ? ` [${issue.recordId}]` : "";
      return `    - ${issue.contentType}${record}: ${issue.message}`;
    });
    return `  ${rule}\n${lines.join("\n")}`;
  });

  return [`Content validation failed with ${issues.length} issue(s):`, "", ...sections].join("\n");
}
