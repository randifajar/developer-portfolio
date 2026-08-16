import type { Metadata } from "next";
import { Archivo, Geist } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { buildRootMetadata } from "@/domain/metadata/build-metadata";
import { MAIN_CONTENT_ID } from "@/lib/constants";
import "./globals.css";

/**
 * Two typefaces, two roles (UX2 3).
 *
 * Both are served by next/font, which self-hosts the files at build time. No
 * third-party origin, no preconnect, and nothing for a future CSP to allow.
 *
 * `adjustFontFallback` defaults to true and must stay that way. It generates a
 * metric-matched local fallback so the swap from fallback to webfont does not
 * reflow the page. CLS is 0.005 and the hero h1 — set in the display face at up
 * to 4.5rem — is the LCP element, which makes this the single most likely way
 * for v2 to regress a number v1 worked to earn.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Archivo, for display only: hero, section statements, page and project titles.
 *
 * Variable, so one file covers the whole weight range. SIL Open Font License.
 *
 * Chosen over an editorial serif because it reads as deliberate engineering
 * rather than as decoration, which is what V2-DP-001 asks for. Ultra-condensed
 * faces were excluded rather than compared: PRD 17.3 warns against them for
 * long text and against picking a face because it resembles motorsport
 * branding.
 */
const archivo = Archivo({
  variable: "--font-archivo",
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
    <html lang="en" className={`${geistSans.variable} ${archivo.variable}`}>
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
