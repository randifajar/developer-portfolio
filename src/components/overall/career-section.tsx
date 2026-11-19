import { Section } from "@/components/layout/section";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionTitle } from "@/components/ui/section-title";
import { getPublishedCareerChapters, type CareerChapterView } from "@/domain/content/selectors";
import type { Discipline } from "@/domain/content/types";
import { DISCIPLINE_LABELS, ROUTES, SECTION_IDS } from "@/lib/constants";
import { formatRoleDates } from "@/lib/dates";
import { countedNoun } from "@/lib/numbers";

/**
 * Career — three chapters, one direction (UX3 7.1, 8.4).
 *
 * This is the stacked layout, which stays the layout without JavaScript and
 * with reduced motion. V3 P8 adds the pinned desktop sequence on top of it;
 * nothing here depends on that arriving.
 *
 * Chapters hold the narrative and roles hold the facts. Each role's title and
 * dates come from its experience record (DEC-020: exact dates, shown at month
 * precision), never from the chapter, so the two cannot disagree.
 *
 * Each mode page is linked once, from the last chapter whose roles belong to
 * it: the 2025 chapter leads to Backend and the 2026 chapter to
 * Infrastructure, as in the approved mockup. A link on every chapter would put
 * two identical "Backend" links a few lines apart.
 */
const HEADING_ID = "career-heading";

export function CareerSection() {
  const chapters = getPublishedCareerChapters();

  if (chapters.length === 0) {
    return null;
  }

  const links = lastChapterLinks(chapters);

  return (
    <Section surface="white" id={SECTION_IDS.career} labelledBy={HEADING_ID}>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-5">
          <Eyebrow>Career</Eyebrow>
          <SectionTitle
            id={HEADING_ID}
            lead={`${countedNoun(chapters.length, "chapter")}, `}
            accent="one direction."
          />
        </div>

        <ol className="flex flex-col">
          {chapters.map((chapter) => {
            const headlineId = `career-${chapter.id}`;

            return (
              <li key={chapter.id} className="border-t border-border py-10 last:pb-0">
                <article
                  aria-labelledby={headlineId}
                  className="grid gap-6 min-[900px]:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)_minmax(0,1.2fr)] min-[900px]:gap-10"
                >
                  {/* The year is in the heading for assistive technology. */}
                  <p
                    aria-hidden="true"
                    className="text-display-section leading-none font-bold text-accent"
                  >
                    {chapter.year}
                  </p>

                  <div className="flex flex-col gap-4">
                    <Eyebrow>{chapter.label}</Eyebrow>
                    <h3 id={headlineId} className="text-page-title font-semibold text-balance">
                      <span className="sr-only">{chapter.year}: </span>
                      {chapter.headline}
                    </h3>
                    <p className="max-w-(--spacing-prose) text-body text-text-secondary">
                      {chapter.body}
                    </p>
                    {(links.get(chapter.id) ?? []).map((discipline) => (
                      <ArrowLink key={discipline} href={ROUTES[discipline]}>
                        {DISCIPLINE_LABELS[discipline]}
                      </ArrowLink>
                    ))}
                  </div>

                  {chapter.roles.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      <p className="text-kicker font-semibold text-text-muted uppercase">
                        {chapter.roles.length === 1 ? "Role" : "Roles"}
                      </p>
                      <ul className="flex flex-col gap-3">
                        {chapter.roles.map((role) => (
                          <li key={role.id} className="flex flex-col gap-0.5">
                            <span className="text-body font-semibold">{role.position}</span>
                            <span className="text-meta text-text-secondary">
                              {formatRoleDates(role)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}

/** For each chapter, the mode pages it links to: those it is the last chapter of. */
function lastChapterLinks(chapters: readonly CareerChapterView[]): Map<string, Discipline[]> {
  const lastChapter = new Map<Discipline, string>();

  for (const chapter of chapters) {
    for (const role of chapter.roles) {
      for (const discipline of role.disciplines) {
        lastChapter.set(discipline, chapter.id);
      }
    }
  }

  const links = new Map<string, Discipline[]>();

  for (const [discipline, chapterId] of lastChapter) {
    links.set(chapterId, [...(links.get(chapterId) ?? []), discipline]);
  }

  return links;
}
