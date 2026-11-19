import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { buildRootMetadata } from "@/domain/metadata/build-metadata";
import { MAIN_CONTENT_ID } from "@/lib/constants";
import "./globals.css";

/**
 * One typeface, two roles (UX3 4, SUP-013).
 *
 * V3 sets display and body in Geist; the stylesheet keeps both roles, so call
 * sites still ask for "display". v2 paired Geist with Archivo for display
 * (DEC-050); the reasoning below about fallbacks and preloading came from that
 * pairing and still applies to the one face that remains.
 *
 * Served by next/font, which self-hosts the files at build time. No
 * third-party origin, no preconnect, and nothing for a future CSP to allow.
 *
 * `adjustFontFallback` defaults to true and must stay that way. It generates a
 * metric-matched local fallback so the swap from fallback to webfont does not
 * reflow the page. The hero h1 is set in the display face at up to 4.5rem, so
 * an unmatched fallback would move the largest text on the page — the single
 * most likely way for v2 to regress the CLS that v1 worked to earn.
 *
 * Both faces preload. Removing the display-face preload was measured on
 * 2026-08-19 and rejected: three runs each showed no score improvement outside
 * the noise and a slightly *worse* LCP, in exchange for the most prominent text
 * on the page rendering in fallback first.
 *
 * An earlier version of this comment said the hero h1 was the LCP element. It
 * is not, and may not have been since Phase 3 reworked the hero: Lighthouse
 * reports the profile photograph. The CLS reasoning above stands on its own —
 * a reflow of the largest text matters whether or not it is what LCP measures.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = buildRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body>
        {/*
         * Skip-to-content must be the first focusable element on the page so a
         * keyboard user can bypass the navigation (TD 11.1, NFAC-A11Y-002).
         * It is visually hidden until focused, then rendered in the accent
         * colour above all other content.
         */}
        <a
          href={`#${MAIN_CONTENT_ID}`}
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-(--radius-button) focus:bg-accent focus:px-4 focus:py-2 focus:text-surface"
        >
          Skip to main content
        </a>

        <Header />

        <main id={MAIN_CONTENT_ID}>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
