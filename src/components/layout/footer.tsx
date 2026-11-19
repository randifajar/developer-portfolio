import Link from "next/link";
import { CopyEmail } from "@/components/layout/copy-email";
import { ExternalLink } from "@/components/ui/external-link";
import {
  getPublishedContactChannels,
  getPublishedExternalProfiles,
  getPublishedProfile,
  getPublishedResumeFor,
  getSiteConfig,
} from "@/domain/content/selectors";
import { MAIN_CONTENT_ID, ROUTES } from "@/lib/constants";

interface FooterProps {
  /**
   * Injected rather than computed so the rendered year is deterministic in
   * tests and in the static build. A component reading the clock directly
   * would make snapshotting and build reproducibility awkward.
   */
  readonly year?: number;
}

/**
 * The site footer (UX3 7.7).
 *
 * "Get in touch." with the public email (DEC-014) as a `mailto:` link and a
 * copy button; the pages; the external profiles and the résumé; the location;
 * and the name, so every page identifies the portfolio (FAC-NAV-004).
 *
 * Never a phone number and never an availability statement (SUP-011). Contact
 * is a `mailto:` link only: the site never claims a message was sent
 * (FAC-CONTACT-002), and there is no form (FAC-CONTACT-005).
 *
 * Everything comes through selectors, so an unpublished channel, profile, or
 * résumé simply does not appear.
 */
const PAGES = [
  { href: ROUTES.home, label: "Overall" },
  { href: ROUTES.backend, label: "Backend" },
  { href: ROUTES.infrastructure, label: "Infrastructure" },
  { href: ROUTES.projects, label: "Projects" },
] as const;

export function Footer({ year = new Date().getFullYear() }: FooterProps) {
  const [email] = getPublishedContactChannels();
  const externalProfiles = getPublishedExternalProfiles();
  const profile = getPublishedProfile();
  const resume = getPublishedResumeFor("backend");
  const siteConfig = getSiteConfig();

  return (
    <footer data-surface="dark" className="border-t border-border bg-background text-text-primary">
      <div className="mx-auto grid max-w-(--spacing-content) gap-10 px-5 py-14 sm:px-8 md:grid-cols-[2fr_1fr_1fr] lg:px-12">
        <div className="flex flex-col gap-5">
          <h2 className="text-display-section font-semibold">Get in touch.</h2>
          {email ? (
            <div className="flex flex-wrap items-center gap-3">
              <a href={email.publicLink} className="text-lead text-accent hover:text-accent-hover">
                {email.value}
              </a>
              <CopyEmail email={email.value} />
            </div>
          ) : null}
        </div>

        <nav aria-label="Pages" className="flex flex-col gap-3">
          <h3 className="text-kicker font-semibold text-text-muted uppercase">Pages</h3>
          <ul className="flex flex-col gap-2">
            {PAGES.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="text-meta text-text-secondary hover:text-accent">
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3">
          <h3 className="text-kicker font-semibold text-text-muted uppercase">Elsewhere</h3>
          <ul className="flex flex-col gap-2">
            {externalProfiles.map((entry) => (
              <li key={entry.id}>
                <ExternalLink
                  href={entry.url}
                  className="text-meta text-text-secondary hover:text-accent"
                >
                  {entry.label}
                </ExternalLink>
              </li>
            ))}
            {resume ? (
              <li>
                <ExternalLink
                  href={resume.publicPath}
                  className="text-meta text-text-secondary hover:text-accent"
                >
                  Résumé
                </ExternalLink>
              </li>
            ) : null}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border pt-6 text-meta text-text-muted md:col-span-3">
          <p>
            © {year} {siteConfig.ownerName}
            {profile ? ` · ${profile.location}` : null}
          </p>
          <a href={`#${MAIN_CONTENT_ID}`} className="text-text-secondary hover:text-accent">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
