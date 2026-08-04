import { defineMediaAsset } from "@/domain/content/define";

/**
 * Media Assets — DRAFT.
 *
 * The photograph is a Confirmed inclusion (DEC-019) but the actual image, crop,
 * and alt text are open (OPEN-005). Safe project visuals are open (OPEN-006).
 *
 * Every asset here is Draft, and the referenced files do not exist yet. That is
 * deliberate: FAC-HOME-006 and FAC-PROJECT-006 require the site to degrade to
 * text when optional media is unavailable, so building against absent media is
 * the honest default rather than a gap.
 *
 * NFAC-SEC-002 and TD 16.4: no project screenshot or diagram may expose
 * internal identifiers, internal URLs, customer or student data, or private
 * architecture. Anything added here passes Randi's confidentiality review
 * first.
 */
export const mediaAssets = [
  defineMediaAsset({
    id: "media-profile-photograph",
    type: "professional-photograph",
    filePath: "/images/profile/randi-fajar-wicaksono.webp",
    altText:
      "DRAFT PLACEHOLDER: descriptive alternative text for the professional photograph, pending " +
      "final image selection (OPEN-005).",
    width: 800,
    height: 800,
    ownerType: "profile",
    ownerId: "profile-randi-fajar-wicaksono",
    confidentialityClass: "public",
    publicationStatus: "draft",
  }),
  defineMediaAsset({
    id: "media-social-card",
    type: "social-sharing-image",
    filePath: "/images/social/portfolio-social-card.png",
    altText: "Randi Fajar Wicaksono — Backend-Focused Full-Stack Developer.",
    width: 1200,
    height: 630,
    ownerType: "metadata",
    ownerId: "profile-randi-fajar-wicaksono",
    confidentialityClass: "public",
    publicationStatus: "draft",
  }),
];
