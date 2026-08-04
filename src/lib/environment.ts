/**
 * Environment parsing.
 *
 * TD 21.2 requires this to happen in exactly one module. Reading process.env
 * throughout components makes it impossible to see what the application
 * actually depends on, and makes the fallback behaviour inconsistent.
 *
 * SITE_URL is public metadata, not a secret (TD 12.2). It appears in canonical
 * links and Open Graph tags, so it is safe to expose and must never be treated
 * as sensitive.
 */

const LOCALHOST_FALLBACK = "http://localhost:3000";

/**
 * The site's absolute base URL, without a trailing slash.
 *
 * Optional during local development, where the localhost fallback applies.
 * Release validation separately requires an absolute HTTPS value in
 * production, so an unset variable fails the launch gate rather than silently
 * shipping localhost URLs into production metadata.
 */
export function getSiteUrl(): string {
  const configured = process.env.SITE_URL?.trim();

  if (!configured) {
    return LOCALHOST_FALLBACK;
  }

  return configured.replace(/\/+$/, "");
}

/** An absolute URL for a root-relative path. */
export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;

  return `${base}${normalized}`;
}
