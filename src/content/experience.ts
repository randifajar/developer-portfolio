import { defineExperience } from "@/domain/content/define";

/**
 * Work Experience — PUBLISHED.
 *
 * Supplied by Randi on 2026-08-08 from his CV. Employer, titles, dates,
 * responsibilities, and contributions are factual claims about real
 * employment; none of it was written on his behalf. NFAC-CONTENT-005 requires
 * these to stay consistent with the CV and LinkedIn, so any edit here means
 * re-checking all three.
 *
 * Dates are stored at month precision with the day set to the first. That is
 * not an approximation being smuggled in: the section renders "Apr 2025 —
 * Present" and never displays a day, so the stored day is an implementation
 * detail that reaches no reader. Storing a day-level date nobody sees, and
 * that might disagree with the CV, would be the worse option.
 *
 * confidentialityClass is "sanitized" throughout. These describe work under an
 * employer, so they describe roles and capabilities rather than the systems
 * themselves — no internal project codes, partner systems, or customer data
 * (NFAC-SEC-002, NFAC-PRIV-004).
 *
 * Ordering is by sortOrder within the current-role-first rule the selector
 * applies, so the progression reads intern to contract to full-time in
 * reverse.
 */
export const experience = [
  defineExperience({
    id: "experience-zettabyte-backend-developer",

    companyName: "ZettaByte Pte Ltd",
    position: "Backend Developer",

    startDate: "2025-04-01",
    isCurrent: true,

    locationOrArrangement: "Sleman, Yogyakarta, Indonesia",

    summary:
      "I develop and maintain backend services and data-processing flows for academic and " +
      "administrative applications. My work covers API and database design, service " +
      "integrations, background processing, multi-environment troubleshooting, requirement " +
      "analysis, regression assessment, and verification of changes before release.",

    responsibilities: [
      "Develop and maintain Node.js and GraphQL backend services and MongoDB data-processing flows for academic and administrative applications.",
      "Design GraphQL queries and reusable MongoDB aggregation pipelines for configurable data views, filtering, sorting, pagination, processing, and export workflows.",
      "Integrate email, notification, Excel export, PDF generation, and document-processing services, including background jobs.",
      "Diagnose database connectivity, CORS, query-performance, memory, build, background-job, and environment-configuration issues across development, staging, pre-production, and production.",
      "Analyze requirements and existing application flows, coordinate changes across repositories, assess regression risks, collaborate with engineering and product teams, and validate final changes.",
    ],

    contributions: [
      "Built GraphQL queries and reusable MongoDB aggregation pipelines for dynamic fields, filtering, sorting, pagination, and Excel export while reducing duplicated retrieval logic.",
      "Contributed to email, notification, Excel, PDF, and document-processing integrations, including background jobs, delivery-status handling, environment configuration, and cross-service troubleshooting.",
    ],

    technologyIds: [
      "skill-nodejs",
      "skill-graphql",
      "skill-mongodb",
      "skill-rest-apis",
      "skill-docker",
      "skill-git",
      "skill-ai-assisted-engineering",
    ],

    confidentialityClass: "sanitized",
    publicationStatus: "published",
    sortOrder: 1,
  }),

  defineExperience({
    id: "experience-zettabyte-backend-developer-contract",

    companyName: "ZettaByte Pte Ltd",
    position: "Backend Developer, Contract",

    startDate: "2024-11-01",
    endDate: "2025-03-01",
    isCurrent: false,

    locationOrArrangement: "Sleman, Yogyakarta, Indonesia",

    summary:
      "I worked on backend features and bug fixes for academic workflows using Node.js, GraphQL, " +
      "MongoDB, and JavaScript. The role included maintaining APIs, database queries, and " +
      "business logic, investigating application and integration issues, and collaborating with " +
      "frontend and QA before progressing to a full-time Backend Developer role.",

    responsibilities: [
      "Implement backend features and bug fixes for academic workflows.",
      "Maintain APIs, database queries, and backend business logic.",
      "Investigate application and cross-application integration issues.",
      "Collaborate with frontend and QA during implementation and verification.",
    ],

    contributions: [
      "Delivered backend feature and bug-fix work using Node.js, GraphQL, MongoDB, and JavaScript.",
      "Investigated integration issues and supported verification with frontend and QA before progressing to the full-time Backend Developer role.",
    ],

    technologyIds: [
      "skill-nodejs",
      "skill-graphql",
      "skill-mongodb",
      "skill-rest-apis",
      "skill-git",
    ],

    confidentialityClass: "sanitized",
    publicationStatus: "published",
    sortOrder: 2,
  }),

  defineExperience({
    id: "experience-zettabyte-backend-developer-intern",

    companyName: "ZettaByte Pte Ltd",
    position: "Backend Developer Intern",

    startDate: "2024-07-01",
    endDate: "2024-10-01",
    isCurrent: false,

    locationOrArrangement: "Sleman, Yogyakarta, Indonesia",

    summary:
      "I supported backend development for academic applications while building practical " +
      "experience with Node.js, JavaScript, APIs, MongoDB operations, testing, and bug fixing. " +
      "The internship progressed into a contract Backend Developer role.",

    responsibilities: [
      "Support backend feature development using JavaScript and Node.js.",
      "Work with APIs and MongoDB database operations.",
      "Assist with testing and bug fixing.",
      "Learn and follow the existing backend application flows and development practices.",
    ],

    contributions: [
      "Contributed to backend features, API work, database operations, testing, and bug fixes before progressing to a contract Backend Developer role.",
    ],

    technologyIds: ["skill-nodejs", "skill-mongodb", "skill-rest-apis", "skill-git"],

    confidentialityClass: "sanitized",
    publicationStatus: "published",
    sortOrder: 3,
  }),
];
