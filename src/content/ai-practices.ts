import { defineAIPractice } from "@/domain/content/define";

/**
 * AI-Assisted Engineering Practices — DRAFT.
 *
 * These describe the four-step workflow the UX Specification section 7.8
 * approves: Analyze, Plan, Implement, Verify. Each records what AI accelerated,
 * what Randi remained responsible for, and how the output was verified.
 *
 * FAC-AI-002 is the governing constraint: AI must never be presented as the
 * owner of final technical decisions. The schema enforces this structurally by
 * making humanResponsibility and verificationMethod required fields.
 *
 * FAC-AI-003: raw Claude, Codex, and ChatGPT exports stay in the private
 * workspace. Only reviewed, sanitized summaries may ever appear here.
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
      "DRAFT PLACEHOLDER: Randi confirms the analysis against the real system and decides " +
      "which findings are accurate and relevant.",
    verificationMethod:
      "DRAFT PLACEHOLDER: findings are checked against the actual source and specifications " +
      "rather than accepted as stated.",
    confidentialityClass: "public",
    publicationStatus: "draft",
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
      "DRAFT PLACEHOLDER: Randi owns the architecture and approves the plan before any " +
      "implementation begins.",
    verificationMethod:
      "DRAFT PLACEHOLDER: the plan is checked against the approved requirements, and conflicts " +
      "are recorded rather than resolved silently.",
    confidentialityClass: "public",
    publicationStatus: "draft",
    sortOrder: 2,
  }),
  defineAIPractice({
    id: "ai-practice-implement",
    toolName: "Claude Code",
    activity: "Scoped implementation",
    purpose: "Write code for one well-defined task at a time, with tests written first.",
    humanResponsibility:
      "DRAFT PLACEHOLDER: Randi reviews every change before it is committed and rejects work " +
      "that does not match the requirement.",
    verificationMethod:
      "DRAFT PLACEHOLDER: lint, type check, unit tests, and a production build must pass before " +
      "a change is proposed for merge.",
    confidentialityClass: "public",
    publicationStatus: "draft",
    sortOrder: 3,
  }),
  defineAIPractice({
    id: "ai-practice-verify",
    toolName: "Claude Code",
    activity: "Verification and debugging",
    purpose: "Reproduce defects, narrow causes, and confirm fixes with regression coverage.",
    humanResponsibility:
      "DRAFT PLACEHOLDER: Randi decides whether a fix is correct and whether the regression " +
      "coverage is sufficient.",
    verificationMethod:
      "DRAFT PLACEHOLDER: end-to-end and accessibility checks run against a production build, " +
      "and production behaviour is confirmed manually after deployment.",
    correctedAssumption:
      "DRAFT PLACEHOLDER: an example where an incorrect AI assumption was identified and " +
      "corrected, pending Product Owner selection.",
    confidentialityClass: "public",
    publicationStatus: "draft",
    sortOrder: 4,
  }),
];
