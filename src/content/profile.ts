import { defineProfile } from "@/domain/content/define";

/**
 * Professional Profile — DRAFT.
 *
 * Confirmed values (name, location, target roles, positioning) are real.
 * The headline and summary are marked DRAFT placeholders: OPEN-001 and
 * OPEN-002 in the Decision Ledger are unresolved, and Randi authors the final
 * copy in P30.
 *
 * publicationStatus stays "draft" so nothing here renders publicly
 * (FAC-OWNER-001). Release validation rejects the DRAFT markers below, which
 * is what prevents this file from reaching production unedited
 * (NFAC-CONTENT-004).
 */
export const profile = defineProfile({
  id: "profile-randi-fajar-wicaksono",

  // Confirmed: DEC-012.
  fullName: "Randi Fajar Wicaksono",
  displayName: "Randi Fajar Wicaksono",

  // Confirmed positioning: DEC-003.
  professionalTitle: "Backend-Focused Full-Stack Developer",

  // DRAFT placeholder — final headline pending (OPEN-001).
  headline:
    "DRAFT PLACEHOLDER: final professional headline pending Product Owner approval (OPEN-001).",

  // DRAFT placeholder — final summary pending (OPEN-002).
  summary:
    "DRAFT PLACEHOLDER: final professional summary pending Product Owner approval (OPEN-002). " +
    "The published version will describe backend-focused full-stack experience, the kinds of " +
    "systems worked on, engineering strengths, and current career direction.",

  // Confirmed: DEC-013.
  location: "Yogyakarta, Indonesia",
  remoteAvailability: "Open to remote opportunities",

  // Confirmed: DEC-004.
  targetRoles: ["Backend Developer", "Full-Stack Developer", "Software Engineer"],

  // Confirmed the photograph is included (DEC-019); the actual image is
  // pending (OPEN-005), so the asset is referenced but itself Draft.
  photoAssetId: "media-profile-photograph",

  publicationStatus: "draft",
  updatedAt: "2026-08-04",
});
