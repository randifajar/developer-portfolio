import { Section } from "@/components/layout/section";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { SectionHeader } from "@/components/ui/section-header";
import { TechnologyTag } from "@/components/ui/technology-tag";
import type { WorkExperience } from "@/domain/content/schemas";
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

interface EmployerGroup {
  readonly companyName: string;
  readonly roles: readonly WorkExperience[];
}

/**
 * Group *consecutive* roles at the same employer.
 *
 * Consecutive, not global. The selector orders by current-first then start date
 * descending, so grouping every matching name together would reorder history
 * for anyone who left an employer and returned — A, B, A would silently render
 * as A, A, B and imply an unbroken run that never happened.
 *
 * Randi's three roles are all at one employer today, so the two approaches
 * currently produce identical output. The distinction is invisible now and
 * would be a truthfulness bug later, which is exactly the kind of thing worth
 * getting right while it costs nothing.
 */
function groupByEmployer(roles: readonly WorkExperience[]): readonly EmployerGroup[] {
  const groups: EmployerGroup[] = [];

  for (const role of roles) {
    const current = groups.at(-1);

    if (current && current.companyName === role.companyName) {
      groups[groups.length - 1] = {
        companyName: current.companyName,
        roles: [...current.roles, role],
      };
    } else {
      groups.push({ companyName: role.companyName, roles: [role] });
    }
  }

  return groups;
}

/**
 * The span a group covers, from its earliest start to its latest end.
 *
 * Derived rather than authored: a hand-written range would be a second place
 * for the same fact to live, and the two would drift.
 */
function groupPeriod(roles: readonly WorkExperience[]): string {
  // Years only. The employer line is a span, not a date — the precise months
  // belong to the individual roles, and repeating them here would be a second
  // place for the same fact.
  const year = (isoDate: string): string => isoDate.slice(0, 4);

  const from = roles.map((role) => year(role.startDate)).sort()[0] ?? "";
  const ongoing = roles.some((role) => role.isCurrent);
  const to = ongoing
    ? "Present"
    : (roles
        .map((role) => (role.endDate ? year(role.endDate) : ""))
        .filter(Boolean)
        .sort()
        .at(-1) ?? "");

  return from === to || to === "" ? from : `${from} — ${to}`;
}

/**
 * Work Experience (UX2 9.1).
 *
 * Grouped by employer so the progression reads as one story. Three roles at one
 * company previously rendered as three repeated company names, leaving the
 * reader to infer that Internship → Contract → Full-time was a promotion path
 * rather than three unrelated jobs. The employer is now stated once and the
 * roles nest beneath it.
 *
 * The dark surface, because this is the section the homepage leads with
 * (SUP-005) and the largest thing on the page. Emphasis follows evidence.
 *
 * A decorative timeline is still avoided: UX 7.6 warns it reduces readability,
 * and this section is scanned rather than read.
 */
export function ExperienceSection() {
  const experience = getPublishedExperience();

  if (experience.length === 0) {
    return null;
  }

  const employers = groupByEmployer(experience);

  return (
    <Section surface="dark" id={SECTION_IDS.experience}>
      <div className="flex flex-col gap-10">
        <SectionHeader eyebrow="Career" heading="Internship to full-time, one employer" />

        {employers.map((employer) => (
          <div key={employer.companyName} className="flex flex-col gap-8">
            {/*
             * The employer is stated once, as an h3, and the roles below become
             * h4. Heading order matters here beyond tidiness: axe's
             * heading-order rule is in the always-blocking set, because two
             * routes once shipped with no h1 at all and severity-based
             * filtering let it through.
             */}
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-4">
              <h3 className="text-project-title font-semibold text-text-primary">
                {employer.companyName}
              </h3>
              <p className="text-meta text-text-muted">{groupPeriod([...employer.roles])}</p>
            </div>

            <ol className="flex flex-col gap-10 border-l border-border pl-6 md:pl-8">
              {employer.roles.map((role) => {
                const technologies = getTechnologyNames(role.technologyIds);

                return (
                  <li
                    key={role.id}
                    className={
                      role.isCurrent
                        ? // The current role is marked by an accent rule rather
                          // than by colour alone, so the emphasis survives for
                          // anyone who cannot distinguish the hue.
                          "-ml-6 flex flex-col gap-4 border-l-2 border-accent pl-6 md:-ml-8 md:pl-8"
                        : "flex flex-col gap-4"
                    }
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-card-title font-semibold text-text-primary">
                          {role.position}
                        </h4>
                        {role.isCurrent ? (
                          /*
                           * Solid tokens, not bg-accent/10 (UX2 2.3).
                           *
                           * The old alpha modifier compiled to
                           * color-mix(… transparent), which has no fixed colour
                           * of its own — it was whatever happened to be painted
                           * behind it. That is precisely why this pairing
                           * measured 4.31:1 and nobody saw it: there was no
                           * pair to measure until the composite was worked out.
                           *
                           * accent-subtle and on-accent-subtle are opaque and
                           * flip per surface, so the contrast gate checks them
                           * on every pull request.
                           */
                          <span className="inline-flex w-fit rounded-(--radius-badge) bg-accent-subtle px-2 py-0.5 text-eyebrow font-medium text-on-accent-subtle">
                            Current
                          </span>
                        ) : null}
                      </div>

                      <p className="text-meta font-medium text-text-secondary">
                        {formatMonthYear(role.startDate)} —{" "}
                        {role.isCurrent ? "Present" : formatMonthYear(role.endDate ?? "")}
                        {role.locationOrArrangement ? ` · ${role.locationOrArrangement}` : ""}
                      </p>
                    </div>

                    <MarkdownContent>{role.summary}</MarkdownContent>

                    <div className="flex flex-col gap-2">
                      <h5 className="text-meta font-semibold tracking-wide text-text-muted uppercase">
                        Responsibilities
                      </h5>
                      <ul className="flex list-disc flex-col gap-1 pl-5 text-text-secondary">
                        {role.responsibilities.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {role.contributions && role.contributions.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        <h5 className="text-meta font-semibold tracking-wide text-text-muted uppercase">
                          Selected contributions
                        </h5>
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
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </Section>
  );
}
