import { Section } from "@/components/layout/section";
import { WorkAreaGrid } from "@/components/modes/work-area-grid";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionTitle } from "@/components/ui/section-title";
import {
  getMostRecentExperience,
  getPublishedDisciplineIntro,
  getPublishedExperienceFor,
  getPublishedWorkAreas,
  getTechnologyNames,
} from "@/domain/content/selectors";
import { DISCIPLINE_LABELS, ROUTES, SECTION_IDS } from "@/lib/constants";
import { formatMonthYearLong, formatRoleDates } from "@/lib/dates";

/**
 * The Backend page's own sections (UX3 7.2). Its selected work and toolkit are
 * shared with Infrastructure and live beside these.
 */

/**
 * Backend — the first section, and the hero action's target. Renders while
 * the backend intro is published, which is the condition the `(modes)` layout
 * checks before it offers the action.
 */
export function BackendWorkSection() {
  const intro = getPublishedDisciplineIntro("backend");

  if (!intro) {
    return null;
  }

  const areas = getPublishedWorkAreas("backend");

  return (
    <Section surface="light" id={SECTION_IDS.backendWork} labelledBy="backend-work-heading">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-5">
          <Eyebrow>Backend</Eyebrow>
          <SectionTitle
            id="backend-work-heading"
            lead="Services for academic and "
            accent="administrative workflows."
          />
          <p className="max-w-(--spacing-prose) text-lead text-pretty text-text-secondary">
            {intro.lead}
          </p>
        </div>
        {areas.length > 0 ? <WorkAreaGrid areas={areas} /> : null}
      </div>
    </Section>
  );
}

/**
 * Experience — the backend roles, current first (UX3 7.2; FAC-EXP-001).
 *
 * Each role shows what FAC-EXP-001 asks of an entry: the position, the exact
 * dates at month precision (DEC-020), the summary, the responsibilities and
 * contributions as two separate lists, and the technologies. The company is
 * named once, in the heading, when every role shares it.
 *
 * When the latest role is not a backend one, a closing line says so and links
 * to its page, so the list does not read as if backend work were the latest.
 * While that role is current the line says "Since …"; once it has ended, the
 * line gives its span instead (DEC-072).
 */
export function BackendExperienceSection() {
  const roles = getPublishedExperienceFor("backend");

  if (roles.length === 0) {
    return null;
  }

  const companies = [...new Set(roles.map((role) => role.companyName))];
  const latest = getMostRecentExperience();
  const movedOn =
    latest?.disciplines.includes("infrastructure") && !latest.disciplines.includes("backend")
      ? latest
      : undefined;

  return (
    <Section surface="light" labelledBy="backend-experience-heading">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-5">
          <Eyebrow>Experience</Eyebrow>
          {companies.length === 1 ? (
            <SectionTitle
              id="backend-experience-heading"
              lead="Backend roles at "
              accent={`${companies[0]}.`}
            />
          ) : (
            <SectionTitle id="backend-experience-heading" lead="Backend " accent="roles." />
          )}
        </div>

        <ol className="flex flex-col">
          {roles.map((role) => {
            const technologies = getTechnologyNames(role.technologyIds);
            const positionId = `role-${role.id}`;

            return (
              <li key={role.id} className="border-t border-border py-10 first:pt-8">
                <article
                  aria-labelledby={positionId}
                  className="grid gap-6 min-[900px]:grid-cols-[minmax(0,0.8fr)_minmax(0,3fr)] min-[900px]:gap-10"
                >
                  <p className="text-meta font-semibold text-text-secondary">
                    {formatRoleDates(role)}
                    {role.isCurrent ? (
                      <span className="mt-1 block text-accent">Current role</span>
                    ) : null}
                  </p>

                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <h3 id={positionId} className="text-card-title font-semibold">
                        {role.position}
                      </h3>
                      {companies.length === 1 ? null : (
                        <p className="text-meta text-text-secondary">{role.companyName}</p>
                      )}
                      <p className="max-w-(--spacing-prose) text-body text-text-secondary">
                        {role.summary}
                      </p>
                    </div>

                    <div className="grid gap-6 min-[760px]:grid-cols-2">
                      <RoleList heading="Responsibilities" items={role.responsibilities} />
                      {role.contributions && role.contributions.length > 0 ? (
                        <RoleList heading="Contributions" items={role.contributions} />
                      ) : null}
                    </div>

                    {technologies.length > 0 ? (
                      <p className="text-meta text-text-muted">
                        <span className="sr-only">Technologies: </span>
                        {technologies.join(" · ")}
                      </p>
                    ) : null}
                  </div>
                </article>
              </li>
            );
          })}
        </ol>

        {movedOn ? (
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-8 text-body text-text-secondary">
            {movedOn.isCurrent || !movedOn.endDate
              ? `Since ${formatMonthYearLong(movedOn.startDate)} my role has been on the infrastructure team.`
              : `From ${formatMonthYearLong(movedOn.startDate)} to ${formatMonthYearLong(movedOn.endDate)} my role was on the infrastructure team.`}
            <ArrowLink href={ROUTES.infrastructure}>{DISCIPLINE_LABELS.infrastructure}</ArrowLink>
          </p>
        ) : null}
      </div>
    </Section>
  );
}

function RoleList({
  heading,
  items,
}: {
  readonly heading: string;
  readonly items: readonly string[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-kicker font-semibold text-text-muted uppercase">{heading}</h4>
      <ul className="flex list-disc flex-col gap-2 pl-5 text-meta text-text-secondary marker:text-accent">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
