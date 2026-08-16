import { defineSkill } from "@/domain/content/define";

/**
 * Technical Skills — PUBLISHED.
 *
 * The skill names are drawn from the technology stack the approved documents
 * already reference, so they are structurally real rather than invented. The
 * open question was always the *classification* (OPEN-004) — whether each is a
 * strong working skill, professional experience, or currently learning is
 * Randi's judgement, and FAC-SKILL-002 requires it to be evidence-backed.
 *
 * He confirmed every classification as assigned on 2026-08-08, which resolves
 * OPEN-004. No classification changed; the review is what was missing, not the
 * values.
 *
 * Docker stays "currently-learning" deliberately. Containerisation is a
 * post-launch phase that has not been built yet, so any stronger claim would be
 * one this repository cannot support.
 *
 * There are no percentages, progress bars, or star ratings anywhere in the
 * model (FAC-SKILL-003) — a self-assigned number implies a precision nobody
 * can defend in an interview.
 */
export const skills = [
  defineSkill({
    id: "skill-typescript",
    name: "TypeScript",
    group: "languages",
    classification: "strong-working-skill",
    publicationStatus: "published",
    sortOrder: 1,
  }),
  defineSkill({
    id: "skill-nodejs",
    name: "Node.js",
    group: "backend",
    classification: "strong-working-skill",
    publicationStatus: "published",
    sortOrder: 2,
  }),
  defineSkill({
    id: "skill-react",
    name: "React",
    group: "frontend",
    classification: "professional-experience",
    publicationStatus: "published",
    sortOrder: 3,
  }),
  defineSkill({
    id: "skill-nextjs",
    name: "Next.js",
    group: "frontend",
    classification: "professional-experience",
    publicationStatus: "published",
    sortOrder: 4,
  }),
  defineSkill({
    id: "skill-mongodb",
    name: "MongoDB",
    group: "databases",
    classification: "professional-experience",
    publicationStatus: "published",
    sortOrder: 5,
  }),
  defineSkill({
    id: "skill-graphql",
    name: "GraphQL",
    group: "apis-and-integration",
    classification: "professional-experience",
    publicationStatus: "published",
    sortOrder: 6,
  }),
  defineSkill({
    id: "skill-rest-apis",
    name: "REST APIs",
    group: "apis-and-integration",
    classification: "strong-working-skill",
    publicationStatus: "published",
    sortOrder: 7,
  }),
  /*
   * Docker stays "currently learning", and that is deliberate (V2-P0-003).
   *
   * It also appears in the current role's technology list, which reads like a
   * contradiction and is not one: using a technology on the job does not make
   * it a skill Randi is prepared to claim independently. Confirmed by him on
   * 2026-08-16 when the question was raised rather than assumed.
   *
   * Recorded here because the apparent mismatch is the kind of thing a future
   * reader — or a future assistant — will notice and "fix". Upgrading it would
   * be inventing a claim on his behalf, which is the one thing the content
   * rules forbid absolutely.
   */
  defineSkill({
    id: "skill-docker",
    name: "Docker",
    group: "infrastructure-and-deployment",
    classification: "currently-learning",
    publicationStatus: "published",
    sortOrder: 8,
  }),
  defineSkill({
    id: "skill-vitest",
    name: "Vitest",
    group: "testing-and-quality",
    classification: "professional-experience",
    publicationStatus: "published",
    sortOrder: 9,
  }),
  defineSkill({
    id: "skill-playwright",
    name: "Playwright",
    group: "testing-and-quality",
    classification: "professional-experience",
    publicationStatus: "published",
    sortOrder: 10,
  }),
  defineSkill({
    id: "skill-git",
    name: "Git",
    group: "developer-tools",
    classification: "strong-working-skill",
    publicationStatus: "published",
    sortOrder: 11,
  }),
  defineSkill({
    id: "skill-ai-assisted-engineering",
    name: "AI-Assisted Engineering",
    group: "ai-assisted-engineering",
    classification: "strong-working-skill",
    publicationStatus: "published",
    sortOrder: 12,
  }),
];
