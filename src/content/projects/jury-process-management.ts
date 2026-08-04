import { defineProject } from "@/domain/content/define";

/**
 * Jury Process Management Integration — DRAFT.
 *
 * A confirmed launch case study (Handoff section 4) describing professional
 * work performed under an employer.
 *
 * CONFIDENTIALITY — this is the strictest file in the repository.
 *
 * The repository is public. Draft status hides content from the website but
 * does NOT make it private on GitHub, so everything written here must already
 * be safe to read directly (ADR-011, Handoff section 7.6).
 *
 * The following must never appear in this file:
 *   - internal project, module, or ticket identifiers
 *   - internal or partner system names
 *   - internal URLs or private repository links
 *   - customer or student data
 *   - confidential architecture detail or proprietary source
 *   - screenshots that were not sanitized and approved
 *
 * confidentialityClass is "sanitized": publishable only after Randi's
 * documented confidentiality review (NFAC-PRIV-004, NFAC-SEC-002).
 *
 * Every substantive section is a DRAFT PLACEHOLDER. Claude cannot author these
 * — they are factual claims about real professional work, and Handoff section 2
 * forbids inventing professional achievements. Randi writes them in P30.
 */
export const juryProcessManagement = defineProject({
  id: "project-jury-process-management",
  slug: "jury-process-management-integration",
  title: "Jury Process Management Integration",
  summary:
    "DRAFT PLACEHOLDER: sanitized summary of a cross-application integration connecting a jury " +
    "process management workflow with a separate internal application. Final wording pending " +
    "Product Owner review.",

  projectType: "professional",
  role: "DRAFT PLACEHOLDER: exact role pending Product Owner confirmation",

  // Not "production" — FAC-PROJECT-004 and FAC-PUBLISH-004 forbid claiming
  // production without verified deployment, and TD 9.5 would additionally
  // require an explicit productionConfirmation. Randi sets the truthful status
  // in P30.
  deliveryStatus: "completed",
  period: "DRAFT PLACEHOLDER: period pending",

  context:
    "DRAFT PLACEHOLDER: sanitized description of the system, its intended users, and the broader " +
    "business context, with no internal identifiers or partner system names.",

  problem:
    "DRAFT PLACEHOLDER: the specific problem being solved and why it mattered, described without " +
    "confidential detail.",

  personalResponsibilities: [
    "DRAFT PLACEHOLDER: what Randi personally implemented, pending Product Owner confirmation.",
  ],

  teamResponsibilities: [
    "DRAFT PLACEHOLDER: what belonged to teammates, other services, or other teams. Required so " +
      "team outcomes are never presented as individual work (FAC-PROJECT-003, NFAC-CONTENT-002).",
  ],

  technicalApproach:
    "DRAFT PLACEHOLDER: high-level solution and main component boundaries, generalized so no " +
    "proprietary architecture is disclosed.",

  workflowOrArchitecture:
    "DRAFT PLACEHOLDER: public-safe workflow description. Any accompanying diagram must be " +
    "sanitized, carry alternative text, remain readable on mobile, and expose no internal " +
    "identifiers or URLs (TD 16.4).",

  challenges: [
    {
      title: "DRAFT PLACEHOLDER: challenge title pending",
      description:
        "DRAFT PLACEHOLDER: a meaningful technical or delivery problem and why it mattered.",
    },
  ],

  decisionsAndTradeoffs: [
    {
      decision: "DRAFT PLACEHOLDER: decision pending",
      rationale: "DRAFT PLACEHOLDER: why this approach was chosen over the alternatives.",
      tradeoff: "DRAFT PLACEHOLDER: what was given up.",
    },
  ],

  implementationSummary:
    "DRAFT PLACEHOLDER: what was implemented, and explicitly what was not implemented by Randi.",

  testingAndVerification:
    "DRAFT PLACEHOLDER: automated tests where relevant, manual verification, regression checks, " +
    "QA involvement, and deployment verification.",

  outcome:
    "DRAFT PLACEHOLDER: the verified, observable result. No invented metrics — where exact " +
    "numbers are unavailable, truthful outcomes are used instead (FAC-PUBLISH-005).",

  aiUsage:
    "DRAFT PLACEHOLDER: how AI assisted, what Randi decided, and how the output was reviewed and " +
    "validated. Raw AI session exports are never published (FAC-AI-003).",

  lessonsLearned:
    "DRAFT PLACEHOLDER: technical and process learning, limitations, and what would be done differently.",

  technologyIds: ["skill-typescript", "skill-nodejs", "skill-mongodb", "skill-graphql"],

  confidentialityNote:
    "This case study uses a sanitized project name and generalized workflow descriptions. " +
    "Private source code, internal URLs, internal identifiers, and company-sensitive information " +
    "are intentionally excluded.",

  confidentialityClass: "sanitized",
  featured: true,
  featuredPriority: 2,
  publicationStatus: "draft",
  updatedAt: "2026-08-04",
});
