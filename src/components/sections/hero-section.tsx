import Image from "next/image";
import { ButtonLink } from "@/components/ui/button-link";
import {
  getActiveResume,
  getPublishedMediaAsset,
  getPublishedProfile,
} from "@/domain/content/selectors";
import { ROUTES, SECTION_IDS } from "@/lib/constants";

/**
 * The Hero (UX 7.3).
 *
 * Two columns on desktop, single column on mobile with the photograph first.
 * Renders nothing when no profile is publicly eligible, rather than an empty
 * shell — there is no honest hero without an identity to present.
 *
 * No auto-typing text and no rotating job-title carousel: UX 7.3 forbids both,
 * and either would delay the one piece of information a recruiter came for.
 */
export function HeroSection() {
  const profile = getPublishedProfile();

  if (!profile) {
    return null;
  }

  const resume = getActiveResume();
  const photo = getPublishedMediaAsset(profile.photoAssetId);

  return (
    <section className="mx-auto w-full max-w-(--spacing-content) px-5 pt-16 pb-12 sm:px-8 sm:pt-24 lg:px-12">
      <div className="flex flex-col-reverse items-start gap-10 md:flex-row md:items-center md:gap-16">
        <div className="flex w-full flex-col gap-6 md:w-3/5">
          <div className="flex flex-col gap-3">
            <h1 className="text-display-hero font-bold text-balance text-text-primary">
              {profile.fullName}
            </h1>
            <p className="text-lead font-medium text-accent">{profile.professionalTitle}</p>
          </div>

          <p className="max-w-(--spacing-prose) text-lead text-pretty text-text-secondary">
            {profile.headline}
          </p>

          <p className="text-body text-text-muted">
            {profile.location} · {profile.remoteAvailability}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            {/*
             * V2-P0-002. The primary action was "View Projects", which pointed
             * away from the section the homepage now leads with: SUP-005 put
             * Work Experience ahead of Selected Projects, and the hero was
             * still sending the first click past it.
             *
             * It targets the Experience anchor rather than a route, because
             * that is where the evidence is. Wording is Randi's decision, taken
             * from the PRD proposal.
             */}
            <ButtonLink href={`${ROUTES.home}#${SECTION_IDS.experience}`}>
              View Experience
            </ButtonLink>

            {/* FAC-HOME-002: the Resume action appears only when one exists. */}
            {resume ? (
              <ButtonLink href={resume.publicPath} variant="secondary" external>
                View Resume
              </ButtonLink>
            ) : null}
          </div>
        </div>

        {/*
         * FAC-HOME-006 and UX 17.2: without an approved photograph the layout
         * becomes text-first rather than showing a broken image or a generic
         * stock avatar.
         */}
        {photo ? (
          <div className="w-full md:w-2/5">
            <Image
              src={photo.filePath}
              alt={photo.altText ?? ""}
              width={photo.width ?? 800}
              height={photo.height ?? 800}
              priority
              className="w-full rounded-(--radius-card) border border-border object-cover"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
