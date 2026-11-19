import { defineEngineeringPractice } from "@/domain/content/define";

/**
 * Engineering practices — "How I approach engineering" on the Overall page
 * (UX3 7.1). PUBLISHED.
 *
 * Six items from the V3.1 mockup, approved by Randi on 2026-11-18. The section
 * headline, "Understand it, change it carefully, prove it works.", was proposed
 * wording and he approved it on 2026-11-19 (OPEN-009); it belongs to the
 * section component, not to these records.
 *
 * Each item restates résumé lines rather than adding a claim:
 *
 * - read the flow first: requirements analysis and existing flows (backend)
 * - change across boundaries: cross-repository coordination, regression risk
 *   (backend)
 * - debug in every environment: troubleshooting across development, staging,
 *   pre-production, and production (both)
 * - verify the release: validating final changes (backend), verified fixes
 *   across releases (infrastructure)
 * - review and document: code review, technical documentation (backend)
 * - own the AI's output: AI-assisted development with human responsibility
 *   for decisions and checks (both)
 */
export const engineeringPractices = [
  defineEngineeringPractice({
    id: "practice-read-the-flow-first",
    title: "Read the flow first",
    description: "Analyze requirements and the existing application flow before changing it.",
    publicationStatus: "published",
    sortOrder: 1,
  }),
  defineEngineeringPractice({
    id: "practice-change-across-boundaries",
    title: "Change across boundaries",
    description: "Coordinate changes across repositories and assess regression risk.",
    publicationStatus: "published",
    sortOrder: 2,
  }),
  defineEngineeringPractice({
    id: "practice-debug-in-every-environment",
    title: "Debug in every environment",
    description: "Trace issues through development, staging, pre-production and production.",
    publicationStatus: "published",
    sortOrder: 3,
  }),
  defineEngineeringPractice({
    id: "practice-verify-the-release",
    title: "Verify the release",
    description: "Validate final changes, and confirm fixes across releases.",
    publicationStatus: "published",
    sortOrder: 4,
  }),
  defineEngineeringPractice({
    id: "practice-review-and-document",
    title: "Review and document",
    description: "Code review and technical documentation as part of the work.",
    publicationStatus: "published",
    sortOrder: 5,
  }),
  defineEngineeringPractice({
    id: "practice-own-the-ai-output",
    title: "Own the AI's output",
    description: "AI tools speed up analysis and testing; the decisions and checks stay mine.",
    publicationStatus: "published",
    sortOrder: 6,
  }),
];
