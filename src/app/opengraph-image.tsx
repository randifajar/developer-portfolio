import { ImageResponse } from "next/og";
import { getPublishedProfile, getSiteConfig } from "@/domain/content/selectors";

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
 * Colours are the literal token values rather than CSS variables — this runs
 * in the image renderer, which has no access to the stylesheet.
 */
export default function OpenGraphImage() {
  const { name, title, location } = cardText();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 24,
        backgroundColor: "#F8FAFC",
        padding: 80,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", height: 8, width: 120, backgroundColor: "#2563EB" }} />

      <div style={{ display: "flex", fontSize: 68, fontWeight: 700, color: "#0F172A" }}>{name}</div>

      {title ? (
        <div style={{ display: "flex", fontSize: 40, color: "#2563EB" }}>{title}</div>
      ) : null}

      {location ? (
        <div style={{ display: "flex", fontSize: 28, color: "#475569" }}>{location}</div>
      ) : null}
    </div>,
    size,
  );
}
