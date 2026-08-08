import { defineProfile } from "@/domain/content/define";

/**
 * Professional Profile — PUBLISHED.
 *
 * Headline and summary supplied by Randi on 2026-08-08, resolving OPEN-001 and
 * OPEN-002. Every claim below is his own: the roles, the technologies, the
 * two-year progression from internship to full-time, and the disclosure of how
 * he uses AI tooling. Nothing here was written or embellished on his behalf.
 *
 * The AI paragraph is deliberately kept. NFAC-CONTENT-002 requires ownership
 * language to be accurate, and stating plainly which tools accelerate the work
 * and which decisions stay his is more credible to an interviewer than leaving
 * it implied — particularly on a portfolio that documents the practice.
 */
export const profile = defineProfile({
  id: "profile-randi-fajar-wicaksono",

  // Confirmed: DEC-012.
  fullName: "Randi Fajar Wicaksono",
  displayName: "Randi Fajar Wicaksono",

  // Confirmed positioning: DEC-003.
  professionalTitle: "Backend-Focused Full-Stack Developer",

  headline:
    "Backend-focused full-stack developer building Node.js, GraphQL, and MongoDB systems, " +
    "seeking remote backend and software engineering roles.",

  summary:
    "I'm a backend-focused full-stack developer with more than two years of hands-on experience " +
    "progressing from internship to contract and full-time backend roles. My work is centered on " +
    "Node.js, GraphQL, MongoDB, APIs, data processing, background jobs, and integrations used in " +
    "academic and administrative workflows.\n\n" +
    "I regularly work on problems that cross application and environment boundaries: designing " +
    "aggregation pipelines, integrating supporting services, tracing database and CORS issues, " +
    "investigating memory and background-job failures, and validating changes across " +
    "development, staging, pre-production, and production environments.\n\n" +
    "I use Codex, Claude Code, and ChatGPT to accelerate analysis, planning, implementation, " +
    "debugging, testing, and documentation, while keeping responsibility for requirement " +
    "validation, technical decisions, code review, regression checking, security, and final " +
    "verification. I'm currently looking for remote Backend Developer, Full-Stack Developer, or " +
    "Software Engineer opportunities.",

  // Confirmed: DEC-013.
  location: "Yogyakarta, Indonesia",
  remoteAvailability: "Open to remote opportunities",

  // Confirmed: DEC-004.
  targetRoles: ["Backend Developer", "Full-Stack Developer", "Software Engineer"],

  // DEC-019. The image was supplied on 2026-08-08, so the asset it points at
  // is Published too and the Hero renders with a photograph.
  photoAssetId: "media-profile-photograph",

  publicationStatus: "published",
  updatedAt: "2026-08-08",
});
