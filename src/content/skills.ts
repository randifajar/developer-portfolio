import { defineSkill } from "@/domain/content/define";

/**
 * Technical Skills — DRAFT.
 *
 * The skill names below are drawn from the technology stack the approved
 * documents already reference, so they are structurally real rather than
 * invented. Their *classification* is the open question (OPEN-004): whether
 * each is a strong working skill, professional experience, or currently
 * learning is Randi's judgement to make in P30, and FAC-SKILL-002 requires it
 * to be evidence-backed.
 *
 * Everything is Draft, so nothing renders until that classification is
 * confirmed. There are no percentages, progress bars, or star ratings anywhere
 * in the model (FAC-SKILL-003).
 */
export const skills = [
  defineSkill({
    id: "skill-typescript",
    name: "TypeScript",
    group: "languages",
    classification: "strong-working-skill",
    publicationStatus: "draft",
    sortOrder: 1,
  }),
  defineSkill({
    id: "skill-nodejs",
    name: "Node.js",
    group: "backend",
    classification: "strong-working-skill",
    publicationStatus: "draft",
    sortOrder: 2,
  }),
  defineSkill({
    id: "skill-react",
    name: "React",
    group: "frontend",
    classification: "professional-experience",
    publicationStatus: "draft",
    sortOrder: 3,
  }),
  defineSkill({
    id: "skill-nextjs",
    name: "Next.js",
    group: "frontend",
    classification: "professional-experience",
    publicationStatus: "draft",
    sortOrder: 4,
  }),
  defineSkill({
    id: "skill-mongodb",
    name: "MongoDB",
    group: "databases",
    classification: "professional-experience",
    publicationStatus: "draft",
    sortOrder: 5,
  }),
  defineSkill({
    id: "skill-graphql",
    name: "GraphQL",
    group: "apis-and-integration",
    classification: "professional-experience",
    publicationStatus: "draft",
    sortOrder: 6,
  }),
  defineSkill({
    id: "skill-rest-apis",
    name: "REST APIs",
    group: "apis-and-integration",
    classification: "strong-working-skill",
    publicationStatus: "draft",
    sortOrder: 7,
  }),
  defineSkill({
    id: "skill-docker",
    name: "Docker",
    group: "infrastructure-and-deployment",
    classification: "currently-learning",
    publicationStatus: "draft",
    sortOrder: 8,
  }),
  defineSkill({
    id: "skill-vitest",
    name: "Vitest",
    group: "testing-and-quality",
    classification: "professional-experience",
    publicationStatus: "draft",
    sortOrder: 9,
  }),
  defineSkill({
    id: "skill-playwright",
    name: "Playwright",
    group: "testing-and-quality",
    classification: "professional-experience",
    publicationStatus: "draft",
    sortOrder: 10,
  }),
  defineSkill({
    id: "skill-git",
    name: "Git",
    group: "developer-tools",
    classification: "strong-working-skill",
    publicationStatus: "draft",
    sortOrder: 11,
  }),
  defineSkill({
    id: "skill-ai-assisted-engineering",
    name: "AI-Assisted Engineering",
    group: "ai-assisted-engineering",
    classification: "strong-working-skill",
    publicationStatus: "draft",
    sortOrder: 12,
  }),
];
