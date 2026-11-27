import { defineMediaAsset } from "@/domain/content/define";

/**
 * Media Assets — PUBLISHED.
 *
 * Every asset below is Published and resolves. The profile photograph and the
 * social card are verified serving in production; the V3 hero portrait reaches
 * production with the V3 release. OPEN-005 is resolved: the photograph was
 * supplied on 2026-08-08 with its crop and alt text, and OPEN-010 on 2026-11-21
 * with the hero portrait.
 *
 * This header said "DRAFT" and "every asset here is Draft, and the referenced
 * files do not exist yet" until 2026-08-16, by which point the photograph had
 * been live for months and was the measured Largest Contentful Paint element of
 * the homepage. Corrected at the v2 release, alongside the same class of stale
 * status claim in the v2.0 specification header.
 *
 * The site still degrades to text when optional media is absent — FAC-HOME-006
 * and FAC-PROJECT-006 require it, and that behaviour is tested rather than
 * merely no longer exercised by this file.
 *
 * OPEN-006, safe project visuals, was resolved on 2026-11-26 (DEC-076), and
 * the first two diagrams were approved on 2026-11-28. They are not media: a
 * case study's diagram is the `diagram` field of its record, the field Q9
 * deferred, drawn by the page from its words. Nothing here changes for them.
 *
 * NFAC-SEC-002 and TD 16.4: no project screenshot or diagram may expose
 * internal identifiers, internal URLs, customer or student data, or private
 * architecture. Anything added here passes Randi's confidentiality review
 * first.
 */
export const mediaAssets = [
  /*
   * The profile photograph, supplied on 2026-08-08 and converted from JPEG to
   * WebP at quality 85. That setting was chosen by measurement rather than by
   * habit: the source was already a compressed JPEG, so re-encoding at 90 or
   * above produced a *larger* file than the original. 85 lands under it.
   *
   * Dimensions are the source's real 400x400. The record previously claimed
   * 800x800, and stating a size the file does not have would make Next.js
   * reserve the wrong space and reintroduce the layout shift that the
   * width/height pair exists to prevent (NFAC-PERF-001).
   */
  defineMediaAsset({
    id: "media-profile-photograph",
    type: "professional-photograph",
    filePath: "/images/profile/randi-fajar-wicaksono.webp",
    // Describes what the image conveys, not that it is an image
    // (NFAC-A11Y-004).
    altText:
      "Randi Fajar Wicaksono outdoors against a pale blue sky, wearing sunglasses and a dark " +
      "hooded jacket.",
    width: 400,
    height: 400,
    ownerType: "profile",
    ownerId: "profile-randi-fajar-wicaksono",
    confidentialityClass: "public",
    publicationStatus: "published",
  }),
  /*
   * The V3 hero's portrait (UX3 7.6, OPEN-010), supplied by Randi on
   * 2026-11-21: a larger version of the portrait above, at 1254x1254, so the
   * hero can fill its half of a wide screen without upscaling a 400 px image.
   *
   * Committed without its embedded metadata chunk, at his request. Only that
   * chunk was removed: decoded, the committed file and the supplied one are
   * identical pixel for pixel.
   *
   * Kept as the supplied PNG rather than re-encoded. The hero requests it
   * through next/image, which serves AVIF or WebP at the width the layout
   * needs, so the file's 2.1 MB does not reach a visitor.
   */
  defineMediaAsset({
    id: "media-hero-photograph",
    type: "professional-photograph",
    filePath: "/images/profile/randi-fajar-wicaksono-hero.png",
    // The same scene as the portrait above, so the same description.
    altText:
      "Randi Fajar Wicaksono outdoors against a pale blue sky, wearing sunglasses and a dark " +
      "hooded jacket.",
    width: 1254,
    height: 1254,
    ownerType: "profile",
    ownerId: "profile-randi-fajar-wicaksono",
    confidentialityClass: "public",
    publicationStatus: "published",
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
    altText: "Randi Fajar Wicaksono — Software Engineer · Backend & Infrastructure.",
    width: 1200,
    height: 630,
    ownerType: "metadata",
    ownerId: "profile-randi-fajar-wicaksono",
    confidentialityClass: "public",
    publicationStatus: "published",
  }),
];
