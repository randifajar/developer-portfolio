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
 * Docker was "currently-learning" from launch until 2026-11-19, deliberately.
 * On that date Randi classified Docker, Linux, Jenkins, and AWS as professional
 * experience (SUP-018), because his infrastructure role now centres on them.
 * See the note on the Docker record.
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
   * Docker: professional experience since 2026-11-19 (SUP-018).
   *
   * From launch it was "currently learning", deliberately (V2-P0-003, confirmed
   * by Randi on 2026-08-16): using a technology on the job did not yet make it a
   * skill he was prepared to claim independently.
   *
   * The change is his, not an assistant's tidy-up. Asked directly on
   * 2026-11-19, with the August reasoning in front of him, he classified Docker,
   * Linux, Jenkins, and AWS as professional experience, because his
   * infrastructure role now centres on them. The note stays so that the history
   * explains the change, not only the present value.
   */
  defineSkill({
    id: "skill-docker",
    name: "Docker",
    group: "infrastructure-and-deployment",
    classification: "professional-experience",
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

  /*
   * Added 2026-11-19 with Randi's classification (SUP-018). All three appear on
   * both of his résumés and are the substance of his infrastructure role. They
   * sort after Docker within their group.
   */
  defineSkill({
    id: "skill-jenkins",
    name: "Jenkins",
    group: "infrastructure-and-deployment",
    classification: "professional-experience",
    publicationStatus: "published",
    sortOrder: 13,
  }),
  defineSkill({
    id: "skill-linux",
    name: "Linux",
    group: "infrastructure-and-deployment",
    classification: "professional-experience",
    publicationStatus: "published",
    sortOrder: 14,
  }),
  defineSkill({
    id: "skill-aws",
    name: "AWS",
    group: "infrastructure-and-deployment",
    classification: "professional-experience",
    publicationStatus: "published",
    sortOrder: 15,
  }),
];
