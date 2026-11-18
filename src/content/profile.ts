import { defineProfile } from "@/domain/content/define";

/**
 * Professional Profile — PUBLISHED.
 *
 * Headline and summary supplied by Randi on 2026-08-08, resolving OPEN-001 and
 * OPEN-002. Every claim below is his own: the roles, the technologies, the
 * two-year progression from internship to full-time, and the disclosure of how
 * he uses AI tooling. Nothing here was written or embellished on his behalf.
 *
 * Updated 2026-11-18 for his move to the infrastructure team (V3 plan, P0).
 * Claude made the changes; no new claim was added. The title is the
 * positioning Randi approved (D1, SUP-010). The headline is assembled from
 * the backend and infrastructure descriptions in the V3.1 mockup he approved,
 * and the first summary paragraph adds the move he confirmed that day.
 * "Backend Developer" in the present tense was the only false statement here,
 * and the availability wording was removed at his request (SUP-011). The
 * reworded lines are listed in the pull request for his confirmation before
 * promotion.
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
  //
  // Repositioned again on 2026-11-18 (SUP-010). Since August 2026 Randi has
  // been an AI Delivery Engineer on the infrastructure team, so "Backend
  // Developer" no longer described the present. The title names the span of
  // his work rather than a job title; formal titles stay in the experience
  // timeline. The middle dot is the approved V3.1 mockup's form, and it keeps
  // "Name — Title" strings free of a second em dash.
  professionalTitle: "Software Engineer · Backend & Infrastructure",

  // Availability clause removed 2026-11-18 at Randi's request (SUP-011). The
  // rest is the noun phrase from the approved mockup's two mode descriptions,
  // so it claims no present-tense activity beyond the confirmed current role.
  headline:
    "Backend services in Node.js, GraphQL, and MongoDB, and the Jenkins pipelines and " +
    "AWS environments that deliver them.",

  // Repositioned, not rewritten. This is Randi's own approved v1 wording with
  // exactly two changes: the opening no longer leads with "backend-focused
  // full-stack developer", and the "currently looking for remote …" closer is
  // gone (it duplicated the headline and pinned the search to remote-only).
  //
  // 110 words, against the 100-150 target. The drop from 126 is the removed
  // closer.
  //
  // 2026-11-18: three changes for the move to the infrastructure team, all
  // statements of fact Randi confirmed. "a Backend Developer" became "a
  // software engineer"; the first sentence gained the move itself; "My work
  // centers on" became "My backend work centers on". The second paragraph moved
  // to the present perfect, because aggregation pipelines and CORS tracing were
  // the backend role's work, not necessarily today's. 125 words, counted.
  //
  // The AI paragraph keeps the tool names. A generic "AI-assisted tools" was
  // considered and rejected: naming what he actually uses is the disclosure,
  // and vagueness there reads worse to an interviewer than specificity.
  summary:
    "I'm a software engineer with more than two years of hands-on experience, progressing from " +
    "internship to contract and full-time backend roles, and in August 2026 to the " +
    "infrastructure team as an AI Delivery Engineer. My backend work centers on Node.js, " +
    "GraphQL, MongoDB, APIs, data processing, background jobs, and integrations used in " +
    "academic and administrative workflows.\n\n" +
    "I have regularly worked on problems that cross application and environment boundaries: " +
    "designing aggregation pipelines, integrating supporting services, tracing database and " +
    "CORS issues, " +
    "investigating memory and background-job failures, and validating changes across " +
    "development, staging, pre-production, and production environments.\n\n" +
    "I use Codex, Claude Code, and ChatGPT to accelerate analysis, planning, implementation, " +
    "debugging, testing, and documentation, while keeping responsibility for requirement " +
    "validation, technical decisions, code review, regression checking, security, and final " +
    "verification.",

  // Confirmed: DEC-013.
  location: "Yogyakarta, Indonesia",

  // There is no availability field any more. "Open to opportunities" (SUP-004,
  // renamed availabilityStatement in Q10) was removed on 2026-11-18 at Randi's
  // request, together with the field, so that it cannot quietly return
  // (SUP-011, FAC-PROFILE-001 amended).

  // DEC-004 listed Full-Stack Developer second. Removed in v1.1 for the same
  // reason as the title: it competed with the backend-first identity.
  //
  // Unchanged on 2026-11-18 although the title moved: target roles are Randi's
  // job-search intent, which nobody else can state. Open question for him.
  targetRoles: ["Backend Developer", "Backend Engineer", "Software Engineer"],

  // DEC-019. The image was supplied on 2026-08-08, so the asset it points at
  // is Published too and the Hero renders with a photograph.
  photoAssetId: "media-profile-photograph",

  publicationStatus: "published",
  updatedAt: "2026-11-18",
});
