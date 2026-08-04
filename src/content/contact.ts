import { defineContactChannel, defineExternalProfile } from "@/domain/content/define";
import { siteConfig } from "@/content/site";

/**
 * Contact channels and external profiles.
 *
 * These are Confirmed decisions rather than placeholders, so they are
 * Published: DEC-014 (email), DEC-015 (GitHub), DEC-016 (LinkedIn).
 * NFAC-PRIV-002 permits exactly this email publicly.
 *
 * Version 1 has no contact form and no submission endpoint (DEC-010,
 * FAC-CONTACT-005). The email is a mailto: link only, and the site never
 * claims a message was delivered (FAC-CONTACT-002).
 */
export const contactChannels = [
  defineContactChannel({
    id: "contact-email",
    type: "email",
    label: "Email Randi",
    value: siteConfig.email,
    publicLink: `mailto:${siteConfig.email}`,
    publicationStatus: "published",
  }),
];

export const externalProfiles = [
  defineExternalProfile({
    id: "profile-linkedin",
    platform: "linkedin",
    label: "LinkedIn",
    url: siteConfig.linkedInUrl,
    publicationStatus: "published",
  }),
  defineExternalProfile({
    id: "profile-github",
    platform: "github",
    label: "GitHub",
    url: siteConfig.gitHubUrl,
    publicationStatus: "published",
  }),
];
