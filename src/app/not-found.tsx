import { ButtonLink } from "@/components/ui/button-link";
import { getActiveResume, getPublishedContactChannels } from "@/domain/content/selectors";
import { ROUTES } from "@/lib/constants";

/**
 * Not Found (UX 11, PAGE-005).
 *
 * The wording is deliberately generic. DEC-047 and FAC-NAV-006 require unknown,
 * Draft, Archived, Private, and Restricted routes to produce the same public
 * result, so this page must never hint that a project exists but is
 * unavailable. A helpful-sounding message such as "this case study is not yet
 * published" would breach that directly.
 *
 * Recovery actions are Home and Projects, both required by FAC-NAV-005.
 */
export default function NotFound() {
  const resume = getActiveResume();
  const [contact] = getPublishedContactChannels();

  return (
    <div className="mx-auto flex w-full max-w-(--spacing-prose) flex-col items-center gap-6 px-5 py-24 text-center sm:px-8">
      <p className="text-meta font-medium tracking-wide text-accent uppercase">404</p>

      <h1 className="text-display-hero font-bold text-text-primary">Page not found</h1>

      <p className="text-lead text-text-secondary">
        This page does not exist. It may have been moved, or the address may be incorrect.
      </p>

      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <ButtonLink href={ROUTES.home}>Return home</ButtonLink>
        <ButtonLink href={ROUTES.projects} variant="secondary">
          Browse Projects
        </ButtonLink>
      </div>

      {resume || contact ? (
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          {resume ? (
            <a
              href={resume.publicPath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-meta text-text-secondary hover:text-accent"
            >
              View Resume
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}

          {contact ? (
            <a
              href={contact.publicLink}
              className="text-meta text-text-secondary hover:text-accent"
            >
              {contact.label}
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
