import { defineAIPractice } from "@/domain/content/define";

/**
 * AI-Assisted Engineering Practices — PUBLISHED.
 *
 * These describe the four-step workflow the UX Specification section 7.8
 * approves: Analyze, Plan, Implement, Verify. Each records what AI accelerated,
 * what Randi remained responsible for, and how the output was verified.
 *
 * Approved by Randi on 2026-08-08. The wording below was already accurate when
 * written and carried DRAFT PLACEHOLDER prefixes only because it had not been
 * confirmed against how he actually worked. He confirmed it, so the markers are
 * gone and the text is otherwise unchanged — this is a review outcome, not new
 * copy.
 *
 * Every practice names Claude Code, and that is deliberate (V2-P0-004).
 *
 * The About summary names Codex, Claude Code and ChatGPT, so a reader comparing
 * the two might expect this section to model all three. Claude Code is the
 * representative tool for the structured workflow; the others are used, and the
 * summary is where that is said. Confirmed by Randi on 2026-08-16.
 *
 * Recorded because the asymmetry looks like an oversight and is not one. PRD
 * section 13 is explicit that the content model must not be remodelled to
 * create visual symmetry — inventing per-tool practices to fill a grid would be
 * describing work that was not done that way.
 *
 * FAC-AI-002 is the governing constraint: AI must never be presented as the
 * owner of final technical decisions. The schema enforces this structurally by
 * making humanResponsibility and verificationMethod required fields.
 *
 * FAC-AI-003: raw Claude, Codex, and ChatGPT exports stay in the private
 * workspace. Only reviewed, sanitized summaries may ever appear here.
 *
 * correctedAssumption is the one field that was genuinely empty. It now records
 * a real, repository-verifiable case: an accessibility threshold that was set
 * wrongly and let two headingless routes reach production. It is deliberately
 * an example where the tooling and the assumption behind it were both wrong,
 * because a workflow description that only reports successes is not evidence of
 * judgement.
 */
export const aiPractices = [
  defineAIPractice({
    id: "ai-practice-analyze",
    toolName: "Claude Code",
    activity: "Repository and requirement analysis",
    purpose:
      "Read an unfamiliar codebase or specification set quickly and surface the constraints " +
      "that matter before any code is written.",
    humanResponsibility:
      "Randi confirms the analysis against the real system and decides which findings are " +
      "accurate and relevant.",
    verificationMethod:
      "Findings are checked against the actual source and specifications rather than accepted " +
      "as stated.",
    confidentialityClass: "public",
    publicationStatus: "published",
    sortOrder: 1,
  }),
  defineAIPractice({
    id: "ai-practice-plan",
    toolName: "Claude Code",
    activity: "Implementation planning",
    purpose:
      "Turn approved requirements into an ordered, dependency-aware sequence of small reviewable " +
      "tasks.",
    humanResponsibility:
      "Randi owns the architecture and approves the plan before any implementation begins.",
    verificationMethod:
      "The plan is checked against the approved requirements, and conflicts are recorded " +
      "rather than resolved silently.",
    confidentialityClass: "public",
    publicationStatus: "published",
    sortOrder: 2,
  }),
  defineAIPractice({
    id: "ai-practice-implement",
    toolName: "Claude Code",
    activity: "Scoped implementation",
    purpose: "Write code for one well-defined task at a time, with tests written first.",
    humanResponsibility:
      "Randi reviews every change before it is committed and rejects work that does not " +
      "match the requirement.",
    verificationMethod:
      "Lint, type check, unit tests, and a production build must pass before a change is " +
      "proposed for merge.",
    confidentialityClass: "public",
    publicationStatus: "published",
    sortOrder: 3,
  }),
  defineAIPractice({
    id: "ai-practice-verify",
    toolName: "Claude Code",
    activity: "Verification and debugging",
    purpose: "Reproduce defects, narrow causes, and confirm fixes with regression coverage.",
    humanResponsibility:
      "Randi decides whether a fix is correct and whether the regression coverage is sufficient.",
    verificationMethod:
      "End-to-end and accessibility checks run against a production build, and production " +
      "behaviour is confirmed manually after deployment.",
    correctedAssumption:
      "The automated accessibility gate was configured to fail only on critical and serious " +
      "findings. Missing page headings are rated moderate, so two routes reached production with " +
      "no primary heading at all. A scanner's severity ranking describes how badly a rule breaks " +
      "a page in general; it does not know which requirements a given project treats as " +
      "launch-blocking. The threshold was corrected and the gap covered by a regression test.",
    confidentialityClass: "public",
    publicationStatus: "published",
    sortOrder: 4,
  }),
];
