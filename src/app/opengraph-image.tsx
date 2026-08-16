import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getPublishedProfile, getSiteConfig } from "@/domain/content/selectors";
import { parseSurfaceTokens } from "@/domain/design/tokens";

/**
 * The card's palette, read from the stylesheet that ships.
 *
 * This used to be a block of hardcoded hex values, with a comment explaining
 * that the image renderer has no access to CSS. The renderer still does not —
 * but this route runs in Node at build time, so it can read the token file
 * directly and the values need never be copied.
 *
 * That matters because this card has already drifted once. In v1 its title and
 * location were literals, so it kept advertising the old positioning after the
 * profile had changed; v1.1 fixed the text by deriving it. The colours were the
 * same problem waiting for the same trigger, and v2 is exactly the release that
 * would have triggered it — the site is now dark and the card was still light.
 *
 * Dark, because that is how the site opens. A link preview that looks like a
 * different website is a small thing that reads as carelessness.
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

/**
 * The card's own text, derived once and shared by the renderer and the `alt`
 * export so the two can never describe different images.
 *
 * The title and location line come from the Published profile. If no profile is
 * publicly eligible, they are omitted rather than substituted: a social card is
 * the one surface that travels without the site around it, and a stale claim
 * there is worse than a sparse card. This is the same omit-rather-than-fill
 * rule the homepage sections follow (FAC-HOME-005).
 */
function cardText(): { name: string; title: string | null; location: string | null } {
  const profile = getPublishedProfile();

  return {
    name: getSiteConfig().ownerName,
    title: profile?.professionalTitle ?? null,
    location: profile
      ? [profile.location, profile.remoteAvailability].filter(Boolean).join(" · ")
      : null,
  };
}

export const alt = [cardText().name, cardText().title].filter(Boolean).join(" — ");
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The default social sharing card (UX 18.3).
 *
 * Generated from the site configuration rather than shipped as a static image,
 * so it cannot drift out of sync with the name and positioning shown on the
 * site itself.
 *
 * That was the stated intent from the start, and the name was the only part
 * that actually honoured it — the title and location were hardcoded literals
 * here, which is exactly how the card kept the old positioning after the
 * profile had moved on. Both now read from the profile (v1.1).
 *
 * Deliberately typographic: name, title, and location on a clean background.
 * UX 18.3 forbids using a project screenshot here, because a screenshot could
 * carry confidential detail into a link preview that appears far outside the
 * site's own confidentiality controls.
 *
 * Colours come from the dark surface in globals.css — see cardPalette above for
 * why they are read rather than copied.
 *
 * The typeface stays the renderer's default sans. Archivo is loaded through
 * next/font, which applies to the document and not to ImageResponse; using it
 * here would mean fetching and embedding the font file on every render. That is
 * a real cost for a difference nobody sees at thumbnail size in a link preview,
 * so it is deliberately not done.
 */
export default function OpenGraphImage() {
  const { name, title, location } = cardText();
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

      <div style={{ display: "flex", fontSize: 68, fontWeight: 700, color: palette.text }}>
        {name}
      </div>

      {title ? (
        <div style={{ display: "flex", fontSize: 40, color: palette.accent }}>{title}</div>
      ) : null}

      {location ? (
        <div style={{ display: "flex", fontSize: 28, color: palette.muted }}>{location}</div>
      ) : null}
    </div>,
    size,
  );
}
