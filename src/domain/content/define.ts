import type { z } from "zod";
import {
  aiPracticeSchema,
  contactChannelSchema,
  externalProfileSchema,
  mediaAssetSchema,
  professionalProfileSchema,
  projectCaseStudySchema,
  resumeSchema,
  siteConfigSchema,
  technicalSkillSchema,
  workExperienceSchema,
} from "@/domain/content/schemas";

/**
 * Content definition helpers.
 *
 * Every content module is authored through one of these. They parse at module
 * load, so a structurally invalid record fails the build immediately rather
 * than reaching a rendered page (ADR-005).
 *
 * The consequence is deliberate: one malformed record fails the whole build.
 * A static site cannot rely on runtime validation after incorrect content has
 * already shipped, and silently omitting an invalid record would hide the
 * problem instead of surfacing it (TD 17.5).
 */

/**
 * Best-effort identification of the record being validated.
 *
 * Errors must name the record even when the invalid part is the identifier
 * itself, otherwise the author is left hunting through a whole content file.
 */
function describeRecord(value: unknown): string {
  if (typeof value !== "object" || value === null) {
    return "unknown record";
  }

  const record = value as Record<string, unknown>;

  for (const key of ["id", "slug", "name", "fileName", "companyName", "title"]) {
    const candidate = record[key];
    if (typeof candidate === "string" && candidate.length > 0) {
      return candidate;
    }
  }

  return "unknown record";
}

/**
 * Build the failure message: content type, record identifier, and every
 * offending field path with its reason.
 *
 * All issues are reported at once. Surfacing one at a time turns fixing a
 * content file into a guessing game.
 */
function formatIssues(contentType: string, value: unknown, error: z.ZodError): string {
  const issues = error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "(root)";
      return `  - ${path}: ${issue.message}`;
    })
    .join("\n");

  return [
    `Invalid ${contentType} content: "${describeRecord(value)}".`,
    issues,
    "",
    "Content is validated at build time. Fix the fields above in the content module.",
  ].join("\n");
}

/**
 * Wrap a schema into a definition helper that throws a readable, actionable
 * error instead of Zod's default output.
 */
function createDefiner<Schema extends z.ZodType>(contentType: string, schema: Schema) {
  return (input: z.input<Schema>): z.output<Schema> => {
    const result = schema.safeParse(input);

    if (!result.success) {
      throw new Error(formatIssues(contentType, input, result.error));
    }

    return result.data;
  };
}

export const defineProfile = createDefiner("Professional Profile", professionalProfileSchema);
export const defineExperience = createDefiner("Work Experience", workExperienceSchema);
export const defineProject = createDefiner("Project Case Study", projectCaseStudySchema);
export const defineSkill = createDefiner("Technical Skill", technicalSkillSchema);
export const defineAIPractice = createDefiner("AI-Assisted Engineering Practice", aiPracticeSchema);
export const defineResume = createDefiner("Resume", resumeSchema);
export const defineContactChannel = createDefiner("Contact Channel", contactChannelSchema);
export const defineExternalProfile = createDefiner(
  "External Professional Profile",
  externalProfileSchema,
);
export const defineMediaAsset = createDefiner("Media Asset", mediaAssetSchema);
export const defineSiteConfig = createDefiner("Site Configuration", siteConfigSchema);
