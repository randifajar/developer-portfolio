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

  // Repositioned in v1.1 (Issue 2). DEC-003 approved "Backend-Focused
  // Full-Stack Developer" for v1; Randi's positioning is now consistently
  // Backend Developer across LinkedIn, CV, portfolio, and applications, and
  // the portfolio was the last surface still saying otherwise.
  //
  // Full-stack capability is real and still stated where it is truthful — in
  // the case studies and the technologies list. It simply no longer competes
  // with the primary identity.
  professionalTitle: "Backend Developer",

  headline:
    "Backend Developer building Node.js, GraphQL, and MongoDB systems, open to backend and " +
    "software engineering opportunities.",

  // Repositioned, not rewritten. This is Randi's own approved v1 wording with
  // exactly two changes: the opening no longer leads with "backend-focused
  // full-stack developer", and the "currently looking for remote …" closer is
  // gone (it duplicated the headline and pinned the search to remote-only).
  //
  // 110 words, against the 100-150 target. The drop from 126 is the removed
  // closer.
  //
  // The AI paragraph keeps the tool names. A generic "AI-assisted tools" was
  // considered and rejected: naming what he actually uses is the disclosure,
  // and vagueness there reads worse to an interviewer than specificity.
  summary:
    "I'm a Backend Developer with more than two years of hands-on experience, progressing from " +
    "internship to contract and full-time backend roles. My work centers on Node.js, GraphQL, " +
    "MongoDB, APIs, data processing, background jobs, and integrations used in academic and " +
    "administrative workflows.\n\n" +
    "I regularly work on problems that cross application and environment boundaries: designing " +
    "aggregation pipelines, integrating supporting services, tracing database and CORS issues, " +
    "investigating memory and background-job failures, and validating changes across " +
    "development, staging, pre-production, and production environments.\n\n" +
    "I use Codex, Claude Code, and ChatGPT to accelerate analysis, planning, implementation, " +
    "debugging, testing, and documentation, while keeping responsibility for requirement " +
    "validation, technical decisions, code review, regression checking, security, and final " +
    "verification.",

  // Confirmed: DEC-013.
  location: "Yogyakarta, Indonesia",

  // Neutral wording, v1.1 Issue 3. "Open to remote opportunities" excluded
  // hybrid and onsite roles that Randi would consider, and no onsite, hybrid,
  // or relocation availability has been confirmed — so this states openness
  // without inventing a form of it.
  //
  // Renamed from remoteAvailability on 2026-08-25 (Q10). v1.1 changed the value
  // from "Open to remote opportunities" to "Open to opportunities" but left the
  // field name, judging the rename not worth widening a corrective release. v2
  // then deferred it again. Twice-deferred is a decision by attrition, so it was
  // made deliberately instead: the name said remote, the value does not, and a
  // field whose name contradicts its content is the kind of small untruth this
  // repository exists to argue against.
  //
  // Reader-visible output is unchanged. Only the identifier moved.
  availabilityStatement: "Open to opportunities",

  // DEC-004 listed Full-Stack Developer second. Removed in v1.1 for the same
  // reason as the title: it competed with the backend-first identity.
  targetRoles: ["Backend Developer", "Backend Engineer", "Software Engineer"],

  // DEC-019. The image was supplied on 2026-08-08, so the asset it points at
  // is Published too and the Hero renders with a photograph.
  photoAssetId: "media-profile-photograph",

  publicationStatus: "published",
  updatedAt: "2026-08-08",
});
