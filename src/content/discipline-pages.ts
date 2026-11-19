import { defineDisciplineIntro, defineWorkArea } from "@/domain/content/define";

/**
 * The Backend and Infrastructure pages below their heroes (UX3 7.2, 7.3).
 * PUBLISHED.
 *
 * The wording is the approved V3.1 mockup's (2026-11-18), checked line by line
 * against the experience records and Randi's résumés, with two kinds of
 * change, both recorded here:
 *
 * - **Infrastructure detail (DEC-064).** Tools are named; how the employer's
 *   systems are wired is not. The mockup's infrastructure blocks named the
 *   proxy in front of hosted services and the AWS services of the email-event
 *   chain. They read here as the infrastructure experience record does,
 *   "reverse proxies" and "AWS email-event delivery", and a test holds the
 *   text to an approved list so nothing more specific returns unnoticed.
 * - **Tense.** The infrastructure role is current, so its ongoing work is in
 *   the present tense, as the experience record has it. The mockup had the
 *   past tense throughout.
 *
 * Each work area cites the roles it restates. A cross-record rule checks that
 * they exist and belong to the area's discipline.
 */

export const disciplineIntros = [
  defineDisciplineIntro({
    id: "discipline-intro-backend",
    discipline: "backend",
    // Restates the first line of the backend résumé's full-time role: "data
    // pipelines for ERP and supporting applications used in academic and
    // administrative workflows".
    lead:
      "Node.js and GraphQL services and MongoDB data pipelines for an ERP and the applications " +
      "around it, used in academic and administrative work on higher-education platforms.",
    publicationStatus: "published",
  }),

  defineDisciplineIntro({
    id: "discipline-intro-infrastructure",
    discipline: "infrastructure",
    // The first sentence is from the infrastructure résumé. The second is the
    // bridge between the two résumés that the mockup proposed; Randi approved
    // it on 2026-11-19 (OPEN-009).
    lead:
      "After two years of building backend services, I moved to the infrastructure team in " +
      "August 2026. The backend foundation stayed: most delivery problems I now trace start or " +
      "end in application code.",
    // The approved mockup's Scope fact (UX3 7.3).
    scope: "A delivery and infrastructure role, not an SRE title",
    publicationStatus: "published",
  }),
];

export const workAreas = [
  defineWorkArea({
    id: "work-area-backend-apis",
    discipline: "backend",
    label: "APIs & business workflows",
    title: "Logic that matches the real process",
    body:
      "GraphQL and REST services, business rules and database queries; analyzing requirements " +
      "and existing flows, coordinating changes across repositories and assessing regression " +
      "risk.",
    experienceIds: [
      "experience-zettabyte-backend-developer",
      "experience-zettabyte-backend-developer-contract",
    ],
    publicationStatus: "published",
    sortOrder: 1,
  }),

  defineWorkArea({
    id: "work-area-backend-data",
    discipline: "backend",
    label: "Data within applications",
    // The backend résumé's own project title.
    title: "Configurable Data Tables and Export Workflows",
    body:
      "Contributed to GraphQL queries and reusable MongoDB aggregation pipelines for dynamic " +
      "fields, filtering, sorting, pagination and Excel export, reducing duplicated retrieval " +
      "logic.",
    experienceIds: ["experience-zettabyte-backend-developer"],
    publicationStatus: "published",
    sortOrder: 2,
  }),

  defineWorkArea({
    id: "work-area-backend-integrations",
    discipline: "backend",
    label: "Asynchronous integrations",
    // The backend résumé's own project title.
    title: "Notification and Document Service Integrations",
    body:
      "Contributed to email, notification, Excel export, PDF generation and document-processing " +
      "integrations, with Redis and BullMQ background jobs and cross-service troubleshooting. I " +
      "also built a Node.js audit-log service on Redis and BullMQ that records actors, actions, " +
      "affected entities, request context and failures.",
    experienceIds: ["experience-zettabyte-backend-developer"],
    publicationStatus: "published",
    sortOrder: 3,
  }),

  defineWorkArea({
    id: "work-area-backend-debugging",
    discipline: "backend",
    label: "Debugging & release verification",
    title: "Following failures across environments",
    body:
      "Database connectivity, CORS, query performance, memory, builds, background jobs and " +
      "configuration, across development, staging, pre-production and production. Fixes " +
      "verified across releases.",
    experienceIds: [
      "experience-zettabyte-backend-developer",
      "experience-zettabyte-backend-developer-contract",
    ],
    publicationStatus: "published",
    sortOrder: 4,
  }),

  defineWorkArea({
    id: "work-area-infrastructure-jenkins",
    discipline: "infrastructure",
    label: "Jenkins",
    title: "Build agent modernization",
    body:
      "Migrated Jenkins build execution to an Ubuntu-based AWS EC2 agent, configuring Docker " +
      "Buildx, QEMU, the AWS CLI and headless Chrome, and resolved WebSocket connectivity, Nginx " +
      "reverse-proxy, file-permission and PATH issues.",
    context: "Part of a wider Jenkins modernization I contributed to",
    experienceIds: ["experience-zettabyte-ai-delivery-engineer"],
    publicationStatus: "published",
    sortOrder: 1,
  }),

  defineWorkArea({
    id: "work-area-infrastructure-ci-cd",
    discipline: "infrastructure",
    label: "CI/CD",
    title: "Quality, security and access",
    body:
      "Maintain and standardize Jenkins CI/CD pipelines across multiple repositories, with " +
      "security and quality checks, branch-based deployment workflows, and role-based access " +
      "controls for staging, pre-production and production.",
    experienceIds: ["experience-zettabyte-ai-delivery-engineer"],
    publicationStatus: "published",
    sortOrder: 2,
  }),

  defineWorkArea({
    id: "work-area-infrastructure-containers",
    discipline: "infrastructure",
    label: "Linux & containers",
    title: "Services behind the proxy",
    body:
      "Support Linux-hosted Docker Compose services behind reverse proxies, investigating TLS " +
      "routing, environment variables, duplicate containers, failed deployments and service " +
      "connectivity.",
    experienceIds: ["experience-zettabyte-ai-delivery-engineer"],
    publicationStatus: "published",
    sortOrder: 3,
  }),

  defineWorkArea({
    id: "work-area-infrastructure-aws",
    discipline: "infrastructure",
    label: "AWS",
    title: "Email-event delivery",
    body:
      "Troubleshoot AWS email-event delivery, dead-letter routing, cloud-region mismatches and " +
      "application configuration across environments.",
    experienceIds: ["experience-zettabyte-ai-delivery-engineer"],
    publicationStatus: "published",
    sortOrder: 4,
  }),
];
