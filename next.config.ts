import type { NextConfig } from "next";

/**
 * Baseline security headers for a static professional website.
 *
 * Technical Design 22.3 permits these four now and defers a strict
 * Content-Security-Policy until it has been tested against the selected
 * production output. An untested CSP that breaks the application is worse
 * than no CSP.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  // Version 1 deliberately does not use `output: "export"`. Normal Next.js
  // production output on Vercel keeps image optimization, the Metadata API,
  // and future incremental capabilities available (Technical Design 4.3).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
