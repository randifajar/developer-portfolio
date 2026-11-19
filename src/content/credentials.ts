import { defineCertification, defineEducation, defineLanguage } from "@/domain/content/define";

/**
 * Education, certifications, and languages — the Overall page's Education &
 * credentials section (UX3 7.1). PUBLISHED.
 *
 * Every value is as Randi's two résumés state it; the two agree on all of it.
 * Checked against both PDFs on 2026-11-19. Dates are stored at month
 * precision with the day set to the first, as the experience records are.
 */
export const education = [
  defineEducation({
    id: "education-universitas-teknologi-yogyakarta",
    institution: "Universitas Teknologi Yogyakarta",
    qualification: "Bachelor of Informatics",
    detail: "GPA 3.82/4.00",
    location: "Sleman, Yogyakarta",
    startDate: "2018-09-01",
    endDate: "2023-05-01",
    publicationStatus: "published",
    sortOrder: 1,
  }),

  defineEducation({
    id: "education-pacmann-academy",
    institution: "Pacmann Academy",
    qualification: "AI/ML Engineering Professional Program",
    location: "Remote",
    startDate: "2023-06-01",
    endDate: "2024-07-01",
    publicationStatus: "published",
    sortOrder: 2,
  }),
];

/** In the order the résumés list them. */
export const certifications = [
  defineCertification({
    id: "certification-sql-and-data-wrangling",
    name: "SQL and Data Wrangling",
    issuer: "Pacmann Academy",
    year: 2023,
    publicationStatus: "published",
    sortOrder: 1,
  }),

  defineCertification({
    id: "certification-azure-ai-fundamentals",
    name: "Microsoft Certified: Azure AI Fundamentals",
    issuer: "Microsoft",
    year: 2023,
    publicationStatus: "published",
    sortOrder: 2,
  }),
];

export const languages = [
  defineLanguage({
    id: "language-indonesian",
    name: "Indonesian",
    proficiency: "Native",
    publicationStatus: "published",
    sortOrder: 1,
  }),

  defineLanguage({
    id: "language-english",
    name: "English",
    proficiency: "Professional working proficiency",
    publicationStatus: "published",
    sortOrder: 2,
  }),
];
