import { Section } from "@/components/layout/section";
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

  /*
   * The strong dark closing section (UX2 4.3).
   *
   * The card treatment is dropped. On a light page a bordered panel separated
   * Contact from what came before; on a dark band it would be a box inside a
   * box, and PRD 20 asks for fewer cards where containment carries no meaning.
   * The surface change is the separation now.
   */
  return (
    <Section surface="dark" id={SECTION_IDS.contact}>
      <div className="flex flex-col gap-8">
        <SectionHeader
          eyebrow="Get in touch"
          heading="Contact"
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
    </Section>
  );
}
