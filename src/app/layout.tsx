import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { buildRootMetadata } from "@/domain/metadata/build-metadata";
import { MAIN_CONTENT_ID } from "@/lib/constants";
import "./globals.css";

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
