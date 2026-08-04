import { defineExperience } from "@/domain/content/define";

/**
 * Work Experience — DRAFT.
 *
 * Employer names, exact dates, responsibilities, and contributions are factual
 * claims about real employment. Claude cannot author them; Randi supplies them
 * in P30 from his CV and LinkedIn, and NFAC-CONTENT-005 requires them to stay
 * consistent with both.
 *
 * The single entry below exists so downstream phases have a structurally valid
 * record to render against. It is Draft and clearly marked, and every field
 * that would be a factual claim is a placeholder rather than an invention
 * (Handoff section 11: no fake production results, no invented metrics).
 *
 * confidentialityClass is "sanitized" because professional experience content
 * describes work under an employer and is published only after Randi's
 * confidentiality review (NFAC-PRIV-004).
 */
export const experience = [
  defineExperience({
    id: "experience-placeholder-current",

    // DRAFT placeholder — real employer pending (P30).
    companyName: "DRAFT PLACEHOLDER: employer name pending",
    position: "DRAFT PLACEHOLDER: position title pending",

    // Placeholder dates. Real employment dates are displayed exactly (DEC-020)
    // and validated by FAC-EXP-002.
    startDate: "2024-01-01",
    isCurrent: true,

    locationOrArrangement: "Yogyakarta, Indonesia",

    summary:
      "DRAFT PLACEHOLDER: role overview pending. The published version describes actual " +
      "responsibilities without exposing confidential company information.",

    responsibilities: ["DRAFT PLACEHOLDER: responsibilities pending Product Owner review."],

    confidentialityClass: "sanitized",
    publicationStatus: "draft",
    sortOrder: 1,
  }),
];
