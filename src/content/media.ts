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
  /*
   * The social sharing card.
   *
   * Unlike the other assets here, this one is not a file waiting to be
   * supplied. It is generated at request time by src/app/opengraph-image.tsx
   * from the site configuration, so it cannot drift out of sync with the name
   * and positioning shown on the site itself, and it needs no design work
   * before launch.
   *
   * It is therefore Published now rather than Draft: the asset genuinely
   * exists and is verified serving 200 image/png at 1200x630. The record
   * previously pointed at a static PNG that was never created, which would
   * have left the release gate asking for a file nobody should produce.
   */
  defineMediaAsset({
    id: "media-social-card",
    type: "social-sharing-image",
    filePath: "/opengraph-image",
    altText: "Randi Fajar Wicaksono — Backend-Focused Full-Stack Developer.",
    width: 1200,
    height: 630,
    ownerType: "metadata",
    ownerId: "profile-randi-fajar-wicaksono",
    confidentialityClass: "public",
    publicationStatus: "published",
  }),
];
