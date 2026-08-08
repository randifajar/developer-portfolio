import { ImageResponse } from "next/og";
import { getSiteConfig } from "@/domain/content/selectors";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * The browser tab icon.
 *
 * Added because the P29 release audit found /favicon.ico returning 404 on every
 * page. That is small but not cosmetic: it logged a browser console error on
 * every route, which Lighthouse counts against Best Practices, and it left the
 * tab showing a blank default icon on a site whose whole purpose is being
 * opened by a recruiter.
 *
 * Generated rather than shipped as a binary, matching opengraph-image.tsx. The
 * initials come from the site configuration, so the icon cannot drift out of
 * sync with the name on the site, and no design asset has to be produced before
 * launch.
 *
 * Colours are the literal token values rather than CSS variables — this runs in
 * the image renderer, which has no access to the stylesheet.
 */
export default function Icon() {
  const siteConfig = getSiteConfig();

  // "Randi Fajar Wicaksono" becomes "RF". Two letters is the most that stays
  // legible at 32 pixels; three is a smudge.
  const initials = siteConfig.ownerName
    .split(/\s+/)
    .filter((part) => part.length > 0)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2563EB",
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: 700,
        letterSpacing: -0.5,
        fontFamily: "sans-serif",
        borderRadius: 6,
      }}
    >
      {initials}
    </div>,
    size,
  );
}
