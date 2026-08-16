import Link from "next/link";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { NAVIGATION_LINKS } from "@/components/layout/navigation-links";
import {
  getActiveResume,
  getPublishedExternalProfiles,
  getPublishedProfile,
  getSiteConfig,
} from "@/domain/content/selectors";
import { ROUTES } from "@/lib/constants";

/**
 * The site header.
 *
 * Deliberately a Server Component that composes the interactive boundary
 * rather than being one itself (TD 13.4). Marking this "use client" would pull
 * the entire navigation tree — and everything it imports — into the browser
 * bundle for the sake of one toggle.
 *
 * The Resume action appears only when an active Resume exists. FAC-RESUME-003
 * forbids offering an action the site cannot fulfil.
 */
export function Header() {
  const profile = getPublishedProfile();
  const resume = getActiveResume();
  const externalProfiles = getPublishedExternalProfiles();
  const siteConfig = getSiteConfig();

  // Falls back to the site owner name so the header still identifies the site
  // while the profile is Draft.
  const identity = profile?.displayName ?? siteConfig.ownerName;

  const externalLinks = externalProfiles.map((entry) => ({
    label: entry.label,
    href: entry.url,
  }));

  return (
    /*
     * The header is permanently dark (UX2 4.3).
     *
     * It is sticky and crosses every surface on the page, so it cannot inherit
     * one — a header that took its colour from whatever is beneath it would
     * change as the visitor scrolls, and there is no scroll listener to do that
     * without adding a second Client Component.
     *
     * Solid rather than translucent. The previous `bg-background/90
     * backdrop-blur` composited against whatever passed behind it, which meant
     * the header's text sat on a colour that could not be measured — the same
     * class of unmeasurable pairing that hid v1's second contrast failure. An
     * opaque surface has one value, and the contrast gate can check it.
     */
    <header
      data-surface="dark"
      className="sticky top-0 z-30 border-b border-border bg-background text-text-primary"
    >
      <div className="mx-auto flex h-(--spacing-header) max-w-(--spacing-content) items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Link
          href={ROUTES.home}
          className="text-body font-semibold text-text-primary hover:text-accent"
        >
          {identity}
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">
          {NAVIGATION_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-meta text-text-secondary hover:text-accent"
            >
              {link.label}
            </Link>
          ))}

          {resume ? (
            <a
              href={resume.publicPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-(--radius-button) border border-border px-4 text-meta font-medium text-text-primary hover:border-accent hover:text-accent"
            >
              View Resume
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
        </nav>

        <MobileNavigation
          links={NAVIGATION_LINKS}
          resumeHref={resume?.publicPath ?? null}
          externalLinks={externalLinks}
        />
      </div>
    </header>
  );
}
