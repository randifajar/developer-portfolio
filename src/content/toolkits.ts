import { defineToolkitGroup } from "@/domain/content/define";

/**
 * Toolkits — the grouped tool lists on the Backend and Infrastructure pages
 * (UX3 7.2, 7.3). PUBLISHED.
 *
 * Groups and items follow the V3.1 mockup, approved by Randi on 2026-11-18.
 * Every item appears on at least one of his résumés; that was checked item by
 * item against both PDFs on 2026-11-19.
 *
 * Three items from the mockup are deliberately left out: the proxy product in
 * front of hosted services, and two AWS services of the email-event chain.
 * Naming them would describe how the employer's systems are wired, which
 * DEC-064 keeps generic — so this comment does not name them either: a public
 * repository publishes its comments as surely as its pages. A test holds every
 * toolkit to an approved list, so no tool appears without a deliberate change.
 *
 * A toolkit carries no levels: it says what is used together. Classification
 * belongs to the skills records.
 */
export const toolkitGroups = [
  defineToolkitGroup({
    id: "toolkit-backend-runtime-and-apis",
    discipline: "backend",
    label: "Runtime & APIs",
    items: ["Node.js", "JavaScript", "GraphQL", "REST APIs"],
    publicationStatus: "published",
    sortOrder: 1,
  }),
  defineToolkitGroup({
    id: "toolkit-backend-data",
    discipline: "backend",
    label: "Data",
    items: ["MongoDB", "Mongoose", "Aggregation Framework", "Redis"],
    publicationStatus: "published",
    sortOrder: 2,
  }),
  defineToolkitGroup({
    id: "toolkit-backend-background-work",
    discipline: "backend",
    label: "Background work",
    items: ["BullMQ", "background jobs", "service integrations"],
    publicationStatus: "published",
    sortOrder: 3,
  }),
  defineToolkitGroup({
    id: "toolkit-backend-alongside",
    discipline: "backend",
    label: "Alongside",
    items: ["Docker", "Jenkins", "Linux", "PM2", "Nginx", "AWS", "Git", "CI/CD"],
    publicationStatus: "published",
    sortOrder: 4,
  }),

  defineToolkitGroup({
    id: "toolkit-infrastructure-cloud",
    discipline: "infrastructure",
    label: "Cloud",
    items: ["AWS EC2", "S3", "SSM"],
    publicationStatus: "published",
    sortOrder: 1,
  }),
  defineToolkitGroup({
    id: "toolkit-infrastructure-linux-and-containers",
    discipline: "infrastructure",
    label: "Linux & containers",
    items: ["Ubuntu", "Docker", "Docker Compose", "Buildx", "Nginx", "TLS"],
    publicationStatus: "published",
    sortOrder: 2,
  }),
  defineToolkitGroup({
    id: "toolkit-infrastructure-automation",
    discipline: "infrastructure",
    label: "Automation",
    items: ["Jenkins", "GitHub Actions", "Git", "Bash", "release validation", "access control"],
    publicationStatus: "published",
    sortOrder: 3,
  }),
  defineToolkitGroup({
    id: "toolkit-infrastructure-backend-foundation",
    discipline: "infrastructure",
    label: "Backend foundation",
    items: ["Node.js", "GraphQL", "REST", "MongoDB", "Redis", "BullMQ", "PM2"],
    publicationStatus: "published",
    sortOrder: 4,
  }),
];
