import { defineCareerChapter } from "@/domain/content/define";

/**
 * Career chapters — the three-part sequence on the Overall page (UX3 7.1,
 * 8.4). PUBLISHED.
 *
 * The requirements proposed the same three chapters (2024 foundation, 2025
 * backend growth, 2026 beyond the application) and asked for the start of the
 * infrastructure chapter to be confirmed: Randi confirmed August 2026 on
 * 2026-11-18. Labels, headlines, and bodies are the V3.1 mockup's, approved
 * the same day.
 *
 * Each body restates the experience records it points at; none adds a claim
 * they do not hold. The audit-log service is from the backend role's
 * contributions, and the 2026 body stays at the detail level of DEC-064.
 *
 * Chapters reference roles by id rather than restating their dates. A
 * cross-record rule checks that every id resolves and that the chapter's year
 * falls within each role it cites.
 */
export const careerChapters = [
  defineCareerChapter({
    id: "career-2024-foundation",
    year: 2024,
    label: "The foundation",
    headline: "Learning backend from the inside.",
    body:
      "I started as a backend intern in July 2024, supporting API development, database " +
      "operations, testing and defect resolution with Node.js and MongoDB. In November I moved " +
      "to a contract role, implementing and debugging GraphQL and MongoDB APIs, business rules " +
      "and application integrations.",
    experienceIds: [
      "experience-zettabyte-backend-developer-intern",
      "experience-zettabyte-backend-developer-contract",
    ],
    publicationStatus: "published",
    sortOrder: 1,
  }),

  defineCareerChapter({
    id: "career-2025-building-systems",
    year: 2025,
    label: "Building systems",
    headline: "Services, data, and the failures between them.",
    body:
      "Full-time from April 2025, I built Node.js GraphQL and REST services and MongoDB-backed " +
      "workflows for higher-education applications, including reusable aggregation pipelines " +
      "and an audit-log service on Redis and BullMQ. Much of the work was tracing asynchronous " +
      "and cross-service failures and verifying fixes across releases.",
    experienceIds: ["experience-zettabyte-backend-developer"],
    publicationStatus: "published",
    sortOrder: 2,
  }),

  defineCareerChapter({
    id: "career-2026-delivering-and-operating",
    year: 2026,
    label: "Delivering & operating",
    headline: "Beyond the application.",
    body:
      // Past tense since the role ended on 27 November 2026 (DEC-072).
      "In August 2026 I joined the infrastructure team. I migrated Jenkins build execution to an " +
      "Ubuntu-based AWS EC2 agent, maintained and standardized CI/CD pipelines with quality and " +
      "security checks, and troubleshot Docker services and AWS email-event delivery across " +
      "environments.",
    experienceIds: ["experience-zettabyte-ai-delivery-engineer"],
    publicationStatus: "published",
    sortOrder: 3,
  }),
];
