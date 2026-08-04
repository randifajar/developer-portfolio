/**
 * Structural content validation.
 *
 * Runs on every pull request as part of `npm run check`. Importing the content
 * modules is itself the first half of validation: each record is parsed by Zod
 * at import, so a structurally invalid record throws before this script reaches
 * its own checks. The second half is the cross-record rules, which need the
 * whole set.
 *
 * Exits non-zero on any violation (NFAC-TEST-001).
 */

import { aiPractices } from "@/content/ai-practices";
import { contactChannels, externalProfiles } from "@/content/contact";
import { experience } from "@/content/experience";
import { mediaAssets } from "@/content/media";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { resume } from "@/content/resume";
import { skills } from "@/content/skills";
import { formatValidationIssues, validateContentSet } from "@/domain/content/validation";

function main(): void {
  const issues = validateContentSet({
    profile,
    experience,
    projects,
    skills,
    aiPractices,
    resumes: [resume],
    contactChannels,
    externalProfiles,
    mediaAssets,
  });

  if (issues.length > 0) {
    console.error(formatValidationIssues(issues));
    process.exit(1);
  }

  console.log("Content validation passed.");
  console.log(
    `  ${projects.length} project(s), ${experience.length} experience record(s), ` +
      `${skills.length} skill(s), ${aiPractices.length} AI practice(s).`,
  );
}

main();
