import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import {
  getPublishedModeIntro,
  getPublishedProfile,
  getSiteConfig,
} from "@/domain/content/selectors";
import type { Mode } from "@/domain/content/types";
import { parseSurfaceTokens } from "@/domain/design/tokens";

/**
 * The social sharing cards (UX 18.3; V3 plan 3.9): one per mode route.
 *
 * Typographic only. UX 18.3 forbids a project screenshot here, because a
 * screenshot could carry confidential detail into a link preview that appears
 * far outside the site's own confidentiality controls.
 *
 * Every word comes from content and every colour from the stylesheet, so the
 * cards cannot drift from the site. The routes build only their words; the
 * layout and palette are here, once.
 *
 * The typeface stays the renderer's default sans. Geist is loaded through
 * next/font, which applies to the document and not to ImageResponse; using it
 * here would mean fetching and embedding the font file on every render, for a
 * difference nobody sees at thumbnail size.
 */

export const SOCIAL_CARD_SIZE = { width: 1200, height: 630 };

/**
 * The card's palette, read from the stylesheet that ships: the dark surface,
 * as the site opens. This route runs in Node at build time, so it can read the
 * token file directly and the values need never be copied — the card drifted
 * once already when they were. The fallbacks apply only if the token file
 * cannot be parsed.
 */
function cardPalette() {
  const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
  const { dark } = parseSurfaceTokens(css);

  return {
    background: dark["color-background"] ?? "#0b0f14",
    text: dark["color-text-primary"] ?? "#f8fafc",
    accent: dark["color-accent"] ?? "#60a5fa",
    muted: dark["color-text-secondary"] ?? "#c3cdd9",
  };
}

export interface SocialCardText {
  /** A small line above the headline: a mode's eyebrow. */
  readonly kicker?: string | null;
  readonly headline: string;
  /** A line in the accent below the headline: the professional title. */
  readonly accent?: string | null;
  /** A muted closing line: the location, or a mode's description. */
  readonly detail?: string | null;
}

/** One sentence for a card's `alt`, from the same words the card shows. */
export function socialCardAlt({ kicker, headline, accent }: SocialCardText): string {
  return [kicker, headline, accent].filter(Boolean).join(" — ");
}

/**
 * The site's own card: the Overall page's, and every other route's fallback.
 * The name, title, and location come from the Published profile. In v1 the
 * title and location were literals, so the card kept advertising the old
 * positioning after the profile had moved on; v1.1 derived them. With no
 * publicly eligible profile they are omitted rather than substituted: a card
 * travels without the site around it, and a stale claim there is worse than a
 * sparse card (FAC-HOME-005).
 */
export function siteCardText(): SocialCardText {
  const profile = getPublishedProfile();

  return {
    headline: getSiteConfig().ownerName,
    accent: profile?.professionalTitle ?? null,
    detail: profile?.location ?? null,
  };
}

/**
 * The words of a mode route's card: its intro's eyebrow, its two heading lines
 * as one headline, and its description. Null when the mode has no published
 * intro; the route then falls back to the site's card.
 */
export function modeCardText(mode: Exclude<Mode, "overall">): SocialCardText | null {
  const intro = getPublishedModeIntro(mode);

  return intro
    ? { kicker: intro.eyebrow, headline: intro.headingLines.join(" "), detail: intro.description }
    : null;
}

export function renderSocialCard({ kicker, headline, accent, detail }: SocialCardText) {
  const palette = cardPalette();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 24,
        backgroundColor: palette.background,
        padding: 80,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", height: 8, width: 120, backgroundColor: palette.accent }} />

      {kicker ? (
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: palette.muted,
          }}
        >
          {kicker}
        </div>
      ) : null}

      <div style={{ display: "flex", fontSize: 68, fontWeight: 700, color: palette.text }}>
        {headline}
      </div>

      {accent ? (
        <div style={{ display: "flex", fontSize: 40, color: palette.accent }}>{accent}</div>
      ) : null}

      {detail ? (
        <div style={{ display: "flex", fontSize: 28, lineHeight: 1.4, color: palette.muted }}>
          {detail}
        </div>
      ) : null}
    </div>,
    SOCIAL_CARD_SIZE,
  );
}
