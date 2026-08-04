/**
 * Release content validation.
 *
 * The launch gate. Runs before a production release, not on every pull request
 * (ADR-006), and is expected to FAIL for the whole of development — that is the
 * mechanism that keeps Draft placeholders out of production.
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
import { validateRelease } from "@/domain/content/release-validation";
import { formatValidationIssues } from "@/domain/content/validation";

function main(): void {
  const issues = validateRelease(
    {
      profile,
      experience,
      projects,
      skills,
      aiPractices,
      resumes: [resume],
      contactChannels,
      externalProfiles,
      mediaAssets,
    },
    { siteUrl: process.env.SITE_URL },
  );

  if (issues.length > 0) {
    console.error(formatValidationIssues(issues));
    console.error("");
    console.error("The site is NOT ready for release.");
    console.error(
      "Each item above is a launch-blocking condition from the approved acceptance criteria.",
    );
    process.exit(1);
  }

  console.log("Release validation passed. The site is content-ready for launch.");
}

main();
