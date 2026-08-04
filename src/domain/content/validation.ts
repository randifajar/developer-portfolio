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
  readonly aiPractices: readonly AIPractice[];
  readonly resumes: readonly Resume[];
  readonly contactChannels: readonly ContactChannel[];
  readonly externalProfiles: readonly ExternalProfile[];
  readonly mediaAssets: readonly MediaAsset[];
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
    ["AI-Assisted Engineering Practice", content.aiPractices],
    ["Resume", content.resumes],
    ["Contact Channel", content.contactChannels],
    ["External Professional Profile", content.externalProfiles],
    ["Media Asset", content.mediaAssets],
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

  for (const practice of content.aiPractices) {
    for (const projectId of practice.relatedProjectIds ?? []) {
      if (!projectIds.has(projectId)) {
        add({
          rule: "valid-project-references",
          contentType: "AI-Assisted Engineering Practice",
          recordId: practice.id,
          message: `References unknown project "${projectId}".`,
        });
      }
    }
  }

  /* Rule 6 — at most one active Published Resume (FAC-RESUME-004). --------- */
  const activePublishedResumes = content.resumes.filter(
    (candidate) => candidate.isActive && candidate.publicationStatus === "published",
  );

  if (activePublishedResumes.length > 1) {
    add({
      rule: "single-active-resume",
      contentType: "Resume",
      message:
        `${activePublishedResumes.length} Resumes are both active and Published ` +
        `(${activePublishedResumes.map((r) => r.id).join(", ")}). Exactly one may be.`,
    });
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
    ["AI-Assisted Engineering Practice", content.aiPractices],
    ["Media Asset", content.mediaAssets],
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
