import {
  SOCIAL_CARD_SIZE,
  modeCardText,
  renderSocialCard,
  siteCardText,
  socialCardAlt,
} from "@/domain/metadata/social-card";

/**
 * The Backend page's social card (V3 plan 3.9): its hero's eyebrow, heading,
 * and description, so a shared link previews what the page says. Without a
 * published intro it is the site's card.
 */
const text = modeCardText("backend") ?? siteCardText();

export const alt = socialCardAlt(text);
export const size = SOCIAL_CARD_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderSocialCard(text);
}
