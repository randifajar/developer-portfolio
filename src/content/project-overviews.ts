import { defineProjectOverview } from "@/domain/content/define";

/**
 * Project overviews — six résumé projects shown briefly, with no case study
 * and no route (DEC-060). DRAFT.
 *
 * Draft because the titles are working titles. Randi, 2026-11-19: "all in here
 * is draft, we can revise it later" (OPEN-011). They become Published only when
 * he confirms or renames them; a test holds them at Draft until then.
 *
 * Sources, line by line:
 *
 * - Each `contribution` is the project line from his résumés. Jenkins, the
 *   evaluation platform, and the three-application work come from the
 *   infrastructure résumé; data tables and the notification/document
 *   integrations from the backend résumé. The résumé titles of three projects
 *   carry internal application names. They never appear here: the general
 *   titles replace them (DEC-060), and "three applications" replaces the
 *   internal list.
 * - The notification hub's contribution is generalized to the detail level of
 *   DEC-064: the AWS email-event delivery is described, its services are not
 *   named.
 * - Each `summary` is the one-line form from the approved V3.1 mockup, under
 *   the same rule.
 * - `technologies` lists only what the project's résumé line names. Two
 *   projects have none: their lines name no technology, and borrowing the
 *   role's stack would be inventing a project-specific claim.
 */
export const projectOverviews = [
  defineProjectOverview({
    id: "overview-jenkins-ci-cd-migration",
    title: "Jenkins CI/CD Migration and Agent Modernization",
    summary:
      "Build execution moved to an Ubuntu-based AWS EC2 agent with multi-architecture Docker " +
      "builds and automated quality and security checks.",
    contribution:
      "Contributed to the modernization of Jenkins infrastructure by migrating build execution " +
      "to an Ubuntu-based AWS EC2 agent, supporting multi-architecture Docker builds, automated " +
      "quality and security checks, and environment-specific deployment workflows.",
    technologies: ["Jenkins", "AWS EC2", "Docker Buildx"],
    disciplines: ["infrastructure"],
    confidentialityClass: "sanitized",
    publicationStatus: "draft",
    sortOrder: 1,
  }),

  defineProjectOverview({
    id: "overview-notification-hub-aws-email-events",
    title: "Notification Hub and AWS Email Events",
    summary: "AWS email-event delivery with dead-letter handling, for notification tracking.",
    contribution:
      "Integrated AWS email-event delivery with dead-letter handling to support notification " +
      "tracking. Investigated cross-environment configuration issues, including AWS region " +
      "mismatches and event-routing failures.",
    technologies: ["AWS"],
    disciplines: ["infrastructure", "backend"],
    confidentialityClass: "sanitized",
    publicationStatus: "draft",
    sortOrder: 2,
  }),

  defineProjectOverview({
    id: "overview-configurable-data-tables",
    title: "Configurable Data Tables and Export Workflows",
    summary:
      "Reusable MongoDB aggregation pipelines for dynamic fields, filtering, sorting, pagination " +
      "and Excel export.",
    contribution:
      "Contributed to GraphQL queries and reusable MongoDB aggregation pipelines for dynamic " +
      "fields, filtering, sorting, pagination, and Excel export while reducing duplicated " +
      "retrieval logic.",
    technologies: ["GraphQL", "MongoDB"],
    disciplines: ["backend"],
    confidentialityClass: "sanitized",
    publicationStatus: "draft",
    sortOrder: 3,
  }),

  defineProjectOverview({
    id: "overview-notification-and-document-integrations",
    title: "Notification and Document Service Integrations",
    summary:
      "Email, notification, Excel, PDF and document-processing integrations with background jobs.",
    contribution:
      "Contributed to email, notification, Excel export, PDF generation, and document-processing " +
      "integrations, including background jobs and cross-service troubleshooting.",
    disciplines: ["backend"],
    confidentialityClass: "sanitized",
    publicationStatus: "draft",
    sortOrder: 4,
  }),

  defineProjectOverview({
    id: "overview-evaluation-and-certification-platform",
    title: "Evaluation and Certification Platform",
    summary:
      "GraphQL and MongoDB-backed evaluation workflows, with deployment verification across " +
      "environments.",
    contribution:
      "Developed and maintained GraphQL and MongoDB-backed evaluation workflows, including " +
      "validation, document generation, and cross-service integrations. Investigated application " +
      "issues and supported deployment verification across environments.",
    technologies: ["GraphQL", "MongoDB"],
    disciplines: ["backend", "infrastructure"],
    confidentialityClass: "sanitized",
    publicationStatus: "draft",
    sortOrder: 5,
  }),

  defineProjectOverview({
    id: "overview-ai-assisted-development",
    title: "AI-Assisted Development Across Three Applications",
    summary:
      "Integrations, validation, filtering and export workflows, with AI tools for debugging, " +
      "testing and reviews.",
    contribution:
      "Developed service integrations, validation, filtering, and export workflows across three " +
      "applications, using AI tools for debugging, testing, and code reviews.",
    disciplines: ["backend", "infrastructure"],
    confidentialityClass: "sanitized",
    publicationStatus: "draft",
    sortOrder: 6,
  }),
];
