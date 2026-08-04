import { ExternalLink } from "@/components/ui/external-link";

import {
  getPublishedContactChannels,
  getPublishedExternalProfiles,
  getSiteConfig,
} from "@/domain/content/selectors";
import { MAIN_CONTENT_ID } from "@/lib/constants";

interface FooterProps {
  /**
   * Injected rather than computed so the rendered year is deterministic in
   * tests and in the static build. A component reading the clock directly
   * would make snapshotting and build reproducibility awkward.
   */
  readonly year?: number;
}

/**
 * The site footer (UX 7.10).
 *
 * Compact by design: name, year, the approved public links, and a back-to-top
 * action. Everything comes through selectors, so an unpublished channel simply
 * does not appear.
 */
export function Footer({ year = new Date().getFullYear() }: FooterProps) {
  const contactChannels = getPublishedContactChannels();
  const externalProfiles = getPublishedExternalProfiles();
  const siteConfig = getSiteConfig();

  return (
    <footer className="mt-24 border-t border-border bg-surface-muted">
      <div className="mx-auto flex max-w-(--spacing-content) flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-text-primary">{siteConfig.ownerName}</p>
          <p className="text-sm text-text-muted">© {year}</p>
        </div>

        <nav aria-label="Footer links" className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {contactChannels.map((channel) => (
            <a
              key={channel.id}
              href={channel.publicLink}
              className="text-sm text-text-secondary hover:text-accent"
            >
              {channel.value}
            </a>
          ))}

          {externalProfiles.map((entry) => (
            <ExternalLink
              key={entry.id}
              href={entry.url}
              className="text-sm text-text-secondary hover:text-accent"
            >
              {entry.label}
            </ExternalLink>
          ))}

          <a href={`#${MAIN_CONTENT_ID}`} className="text-sm text-text-secondary hover:text-accent">
            Back to top
          </a>
        </nav>
      </div>
    </footer>
  );
}
