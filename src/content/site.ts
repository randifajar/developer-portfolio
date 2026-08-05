import { defineSiteConfig } from "@/domain/content/define";

/**
 * Site-wide configuration.
 *
 * The public contact values here are Confirmed decisions, not placeholders:
 * DEC-014 (email), DEC-015 (GitHub), DEC-016 (LinkedIn), DEC-012 (public name),
 * DEC-013 (location). NFAC-PRIV-002 permits exactly this email to appear
 * publicly.
 */
export const siteConfig = defineSiteConfig({
  name: "Randi Fajar Wicaksono",
  defaultTitle: "Randi Fajar Wicaksono — Backend-Focused Full-Stack Developer",
  titleTemplate: "%s — Randi Fajar Wicaksono",
  defaultDescription:
    "Backend-focused full-stack developer based in Yogyakarta, Indonesia. Backend engineering, " +
    "system integration, and AI-assisted development with human accountability.",
  ownerName: "Randi Fajar Wicaksono",
  locale: "en",
  email: "randifajar2307@gmail.com",
  linkedInUrl: "https://www.linkedin.com/in/randifajar",
  gitHubUrl: "https://github.com/randifajar",
  // The social card is generated at request time by src/app/opengraph-image.tsx
  // rather than shipped as a static file, so it cannot drift out of sync with
  // the name and positioning above. This is the public path Next.js serves it
  // from — the earlier value pointed at a static PNG that was never created.
  defaultSocialImagePath: "/opengraph-image",
});
