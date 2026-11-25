import {
  SOCIAL_CARD_SIZE,
  projectsCardText,
  renderSocialCard,
  socialCardAlt,
} from "@/domain/metadata/social-card";

/**
 * The Projects index's social card (V3 plan 3.9): the page's heading and the
 * description its link preview carries, so a shared link previews what the
 * page is.
 */
const text = projectsCardText();

export const alt = socialCardAlt(text);
export const size = SOCIAL_CARD_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderSocialCard(text);
}
