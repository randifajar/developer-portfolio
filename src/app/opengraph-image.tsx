import {
  SOCIAL_CARD_SIZE,
  renderSocialCard,
  siteCardText,
  socialCardAlt,
} from "@/domain/metadata/social-card";

/**
 * The site's social sharing card (UX 18.3): the Overall page's, and the
 * fallback for every route without its own. The words come from the profile
 * and the layout and palette are shared with the mode cards, in
 * social-card.tsx.
 */
export const alt = socialCardAlt(siteCardText());
export const size = SOCIAL_CARD_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderSocialCard(siteCardText());
}
