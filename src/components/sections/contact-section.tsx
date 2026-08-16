import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeader } from "@/components/ui/section-header";
import {
  getActiveResume,
  getPublishedContactChannels,
  getPublishedExternalProfiles,
  getPublishedProfile,
} from "@/domain/content/selectors";
import { SECTION_IDS } from "@/lib/constants";

/**
 * Contact (UX 7.9).
 *
 * A call-to-action panel with the email as the primary action and LinkedIn,
 * GitHub, and Resume as secondary ones.
 *
 * There is no contact form and no submission endpoint anywhere in the
 * application (DEC-010, FAC-CONTACT-005). The email is a mailto: link, so the
 * visitor's own mail client takes over and the site never claims a message was
 * sent or delivered (FAC-CONTACT-002, NFAC-REL-002). No visitor data is
 * collected at any point (NFAC-PRIV-001).
 */
export function ContactSection() {
  const channels = getPublishedContactChannels();
  const externalProfiles = getPublishedExternalProfiles();
  const resume = getActiveResume();
  const profile = getPublishedProfile();

  if (channels.length === 0 && externalProfiles.length === 0) {
    return null;
  }

  const [primaryChannel] = channels;

  return (
    <section className="mx-auto w-full max-w-(--spacing-content) px-5 py-16 sm:px-8 lg:px-12">
      <div className="flex flex-col gap-8 rounded-(--radius-card) border border-border bg-surface p-8 sm:p-12">
        <SectionHeader
          eyebrow="Get in touch"
          heading="Contact"
          id={SECTION_IDS.contact}
          /*
           * V2-P0-001. This offered "backend, full-stack, and software
           * engineering roles", which contradicted SUP-002 — v1.1 removed
           * Full-Stack Developer as a target role, and this line was the last
           * place still offering it.
           *
           * Wording is Randi's decision, taken from the PRD proposal.
           */
          description="Open to backend and software engineering opportunities. The fastest way to reach me is email."
        />

        <div className="flex flex-wrap items-center gap-3">
          {primaryChannel ? (
            <ButtonLink href={primaryChannel.publicLink}>{primaryChannel.label}</ButtonLink>
          ) : null}

          {externalProfiles.map((entry) => (
            <ButtonLink key={entry.id} href={entry.url} variant="secondary" external>
              {entry.label}
            </ButtonLink>
          ))}

          {resume ? (
            <ButtonLink href={resume.publicPath} variant="secondary" external>
              View Resume
            </ButtonLink>
          ) : null}
        </div>

        {primaryChannel ? (
          <p className="text-meta text-text-muted">
            Or copy the address directly:{" "}
            <span className="text-text-secondary">{primaryChannel.value}</span>
          </p>
        ) : null}

        {profile ? (
          <p className="text-meta text-text-muted">
            {profile.location} · {profile.remoteAvailability}
          </p>
        ) : null}
      </div>
    </section>
  );
}
