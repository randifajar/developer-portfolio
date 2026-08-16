import { Section } from "@/components/layout/section";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { SectionHeader } from "@/components/ui/section-header";
import { getPublishedProfile } from "@/domain/content/selectors";
import { SECTION_IDS } from "@/lib/constants";

/**
 * About (UX 7.4).
 *
 * Explains the professional identity in more depth without becoming an
 * autobiography. Two columns on desktop: heading left, content right.
 *
 * The summary is rendered through MarkdownContent because it is long-form
 * prose that may use emphasis and lists, and that component has raw HTML
 * disabled.
 */
export function AboutSection() {
  const profile = getPublishedProfile();

  if (!profile) {
    return null;
  }

  /*
   * The Section wrapper sits inside the null guard, not around the component.
   *
   * If page.tsx wrapped this in a band instead, an unpublished profile would
   * leave an empty coloured stripe on the page and
   * homepage-section-omission.test.tsx would fail on the surviving [id]. The
   * omission has to take the band with it.
   */
  return (
    <Section surface="light" id={SECTION_IDS.about}>
      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        <div className="md:w-1/3">
          <SectionHeader eyebrow="About" heading="Backend engineering, end to end" />
        </div>

        <div className="flex flex-col gap-6 md:w-2/3">
          <MarkdownContent>{profile.summary}</MarkdownContent>

          {profile.targetRoles.length > 0 ? (
            <div className="flex flex-col gap-2">
              <h3 className="text-meta font-semibold tracking-wide text-text-muted uppercase">
                Target roles
              </h3>
              <ul className="flex flex-wrap gap-2">
                {profile.targetRoles.map((role) => (
                  <li
                    key={role}
                    className="rounded-(--radius-badge) border border-border bg-surface px-3 py-1 text-meta text-text-secondary"
                  >
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
