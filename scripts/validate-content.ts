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

import { contentSet } from "@/content/content-set";
import { formatValidationIssues, validateContentSet } from "@/domain/content/validation";

function main(): void {
  const issues = validateContentSet(contentSet);

  if (issues.length > 0) {
    console.error(formatValidationIssues(issues));
    process.exit(1);
  }

  console.log("Content validation passed.");
  console.log(
    `  ${contentSet.projects.length} project(s), ${contentSet.experience.length} experience ` +
      `record(s), ${contentSet.skills.length} skill(s), ${contentSet.engineeringPractices.length} ` +
      `engineering practice(s), ${contentSet.careerChapters.length} career chapter(s), ` +
      `${contentSet.modeIntros.length} mode intro(s).`,
  );
}

main();
