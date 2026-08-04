import { MarkdownContent } from "@/components/ui/markdown-content";
import { SectionHeader } from "@/components/ui/section-header";
import { TechnologyTag } from "@/components/ui/technology-tag";
import { getPublishedExperience, getTechnologyNames } from "@/domain/content/selectors";
import { SECTION_IDS } from "@/lib/constants";

/**
 * Format an ISO date as a readable month and year.
 *
 * Exact employment dates are a Confirmed decision (DEC-020) and FAC-EXP-001
 * requires them displayed, so this abbreviates presentation without hiding the
 * underlying precision.
 */
function formatMonthYear(isoDate: string): string {
  const [year, month] = isoDate.split("-");
  if (!year || !month) {
    return isoDate;
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${monthNames[Number(month) - 1] ?? month} ${year}`;
}

/**
 * Work Experience (UX 7.6).
 *
 * Stacked entries with a dates column on desktop and dates above each role on
 * mobile. Most recent first, current role leading — the selector applies that
 * ordering.
 *
 * A decorative timeline is deliberately avoided: UX 7.6 warns it reduces
 * readability, and this section is scanned rather than read.
 */
export function ExperienceSection() {
  const experience = getPublishedExperience();

  if (experience.length === 0) {
    return null;
  }

  return (
    <section className="bg-surface-muted py-16">
      <div className="mx-auto w-full max-w-(--spacing-content) px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-10">
          <SectionHeader eyebrow="Career" heading="Work Experience" id={SECTION_IDS.experience} />

          <ol className="flex flex-col gap-10">
            {experience.map((role) => {
              const technologies = getTechnologyNames(role.technologyIds);

              return (
                <li
                  key={role.id}
                  className="flex flex-col gap-4 border-t border-border pt-8 md:flex-row md:gap-10"
                >
                  <div className="flex shrink-0 flex-col gap-1 md:w-48">
                    <p className="text-sm font-medium text-text-secondary">
                      {formatMonthYear(role.startDate)} —{" "}
                      {role.isCurrent ? "Present" : formatMonthYear(role.endDate ?? "")}
                    </p>
                    {role.isCurrent ? (
                      <span className="inline-flex w-fit rounded-(--radius-badge) bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                        Current
                      </span>
                    ) : null}
                    {role.locationOrArrangement ? (
                      <p className="text-sm text-text-muted">{role.locationOrArrangement}</p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-xl font-semibold text-text-primary">{role.position}</h3>
                      <p className="text-text-secondary">{role.companyName}</p>
                    </div>

                    <MarkdownContent>{role.summary}</MarkdownContent>

                    <div className="flex flex-col gap-2">
                      <h4 className="text-sm font-semibold tracking-wide text-text-muted uppercase">
                        Responsibilities
                      </h4>
                      <ul className="flex list-disc flex-col gap-1 pl-5 text-text-secondary">
                        {role.responsibilities.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {role.contributions && role.contributions.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        <h4 className="text-sm font-semibold tracking-wide text-text-muted uppercase">
                          Selected contributions
                        </h4>
                        <ul className="flex list-disc flex-col gap-1 pl-5 text-text-secondary">
                          {role.contributions.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {technologies.length > 0 ? (
                      <ul className="flex flex-wrap gap-2 pt-1">
                        {technologies.map((name) => (
                          <li key={name}>
                            <TechnologyTag name={name} />
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
