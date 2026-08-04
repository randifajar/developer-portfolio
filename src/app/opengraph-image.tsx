import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/site";

export const alt = "Randi Fajar Wicaksono — Backend-Focused Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The default social sharing card (UX 18.3).
 *
 * Generated from the site configuration rather than shipped as a static image,
 * so it cannot drift out of sync with the name and positioning shown on the
 * site itself.
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

      <div style={{ display: "flex", fontSize: 68, fontWeight: 700, color: "#0F172A" }}>
        {siteConfig.ownerName}
      </div>

      <div style={{ display: "flex", fontSize: 40, color: "#2563EB" }}>
        Backend-Focused Full-Stack Developer
      </div>

      <div style={{ display: "flex", fontSize: 28, color: "#475569" }}>
        Yogyakarta, Indonesia · Open to remote opportunities
      </div>
    </div>,
    size,
  );
}
