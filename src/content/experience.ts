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
 * applies, so the progression reads intern to contract to full-time to the
 * infrastructure team in reverse.
 *
 * 2026-11-18 (V3 plan, P0). Randi confirmed that day that he has been an AI
 * Delivery Engineer on the infrastructure team since August 2026, and that the
 * Backend Developer role ran from April 2025 to July 2026. The new role's
 * responsibilities and contribution are his infrastructure resume's bullets.
 * Two pieces of system architecture are generalized ("reverse proxies" for the
 * named proxies, "AWS email-event delivery" for the named AWS services), in
 * keeping with the sanitized class below. On 2026-11-19 Randi set that as the
 * level for the whole site (DEC-064): tools are named, and how the employer's
 * systems are wired is not. The new role's summary is the infrastructure
 * description from the V3.1 mockup he approved.
 *
 * 2026-11-19 (V3 plan, P2). The company is spelled "Zettabyte Pte Ltd", Randi's
 * choice and the spelling of his infrastructure résumé (DEC-063); the site said
 * "ZettaByte", and his backend résumé mixes the two. The backend role gained the
 * audit-log contribution, verbatim from his infrastructure résumé, so the site
 * and the résumé list the same work (NFAC-CONTENT-005).
 */
export const experience = [
  defineExperience({
    id: "experience-zettabyte-ai-delivery-engineer",

    companyName: "Zettabyte Pte Ltd",
    position: "AI Delivery Engineer, Infrastructure Team",

    startDate: "2026-08-01",
    isCurrent: true,

    locationOrArrangement: "Sleman, Yogyakarta, Indonesia",

    summary:
      "I work on Jenkins delivery pipelines, Linux and Docker environments on AWS, and the " +
      "troubleshooting behind reliable releases.",

    responsibilities: [
      "Maintain and standardize Jenkins CI/CD pipelines across multiple repositories, incorporating security and quality checks, branch-based deployment workflows, and role-based access controls for staging, pre-production, and production environments.",
      "Support Linux-hosted Docker Compose services behind reverse proxies, investigating TLS routing, environment variables, duplicate containers, failed deployments, and service connectivity.",
      "Troubleshoot AWS email-event delivery, dead-letter routing, cloud-region mismatches, and application configuration issues across environments.",
    ],

    contributions: [
      "Migrated Jenkins build execution to an Ubuntu-based AWS EC2 agent, configuring Docker Buildx, QEMU, AWS CLI, and headless Chrome. Resolved WebSocket connectivity, Nginx reverse-proxy, file-permission, and environment PATH issues.",
    ],

    // Jenkins, Linux, and AWS gained skill records on 2026-11-19, when Randi
    // classified them, with Docker, as professional experience (SUP-018). Git is
    // evidenced by the branch-based deployment workflows.
    technologyIds: ["skill-jenkins", "skill-docker", "skill-linux", "skill-aws", "skill-git"],

    disciplines: ["infrastructure"],

    confidentialityClass: "sanitized",
    publicationStatus: "published",
    sortOrder: 1,
  }),

  defineExperience({
    id: "experience-zettabyte-backend-developer",

    companyName: "Zettabyte Pte Ltd",
    position: "Backend Developer",

    startDate: "2025-04-01",
    endDate: "2026-07-01",
    isCurrent: false,

    locationOrArrangement: "Sleman, Yogyakarta, Indonesia",

    // Past tense since 2026-11-18; the final sentence states the move, in the
    // same form the two earlier roles use for their progression.
    summary:
      "I developed and maintained backend services and data-processing flows for academic and " +
      "administrative applications. My work covered API and database design, service " +
      "integrations, background processing, multi-environment troubleshooting, requirement " +
      "analysis, regression assessment, and verification of changes before release. In " +
      "August 2026 I moved to the infrastructure team as an AI Delivery Engineer.",

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
      "Built a Node.js audit-log service using Redis and BullMQ to record actors, business actions, affected entities, request context, and failures for traceability.",
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

    disciplines: ["backend"],

    confidentialityClass: "sanitized",
    publicationStatus: "published",
    sortOrder: 2,
  }),

  defineExperience({
    id: "experience-zettabyte-backend-developer-contract",

    companyName: "Zettabyte Pte Ltd",
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

    disciplines: ["backend"],

    confidentialityClass: "sanitized",
    publicationStatus: "published",
    sortOrder: 3,
  }),

  defineExperience({
    id: "experience-zettabyte-backend-developer-intern",

    companyName: "Zettabyte Pte Ltd",
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

    disciplines: ["backend"],

    confidentialityClass: "sanitized",
    publicationStatus: "published",
    sortOrder: 4,
  }),
];
