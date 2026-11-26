import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import {
  getMostRecentExperience,
  getPublishedEducation,
  getPublishedExperience,
  getPublishedProfile,
} from "@/domain/content/selectors";
import { SECTION_IDS } from "@/lib/constants";
import { completedYearsSince } from "@/lib/dates";

/**
 * Profile — the first section under the Overall hero (UX3 7.1), and the hero
 * action's target.
 *
 * The statement is Randi's approved profile statement (OPEN-009). Its first
 * paragraph is set large as the section's opening line; the rest follows as
 * body text.
 *
 * Every fact in the list is derived from a record, none is typed here: the
 * location from the profile, the current role and company from the current
 * experience record, the years from the earliest role's start date, and the
 * education from the first education record. "Software delivery" is the
 * approved mockup's wording for that span.
 *
 * The years are counted when the site is built, so they move on a rebuild,
 * not on the anniversary. They count completed years only and never round up:
 * from July 2024, "2+ years" until July 2027.
 */
const HEADING_ID = "profile-heading";

interface Fact {
  readonly term: string;
  readonly value: string;
}

export function ProfileSection() {
  const profile = getPublishedProfile();

  if (!profile?.statement) {
    return null;
  }

  const [opening, ...paragraphs] = profile.statement.split(/\n{2,}/);
  const facts = profileFacts(profile.location);

  return (
    <Section surface="light" id={SECTION_IDS.profile} labelledBy={HEADING_ID}>
      <div className="grid gap-12 min-[900px]:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] min-[900px]:gap-16">
        <div className="flex flex-col gap-8">
          <Eyebrow as="h2" id={HEADING_ID}>
            Profile
          </Eyebrow>
          <p className="text-page-title font-medium text-balance">{opening}</p>
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="max-w-(--spacing-prose) text-lead text-pretty text-text-secondary"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {facts.length > 0 ? (
          <dl className="flex flex-col self-start border-t border-border">
            {facts.map((fact) => (
              <div key={fact.term} className="flex flex-col gap-1 border-b border-border py-4">
                <dt className="text-kicker font-semibold text-text-muted uppercase">{fact.term}</dt>
                <dd className="text-body font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </Section>
  );
}

function profileFacts(location: string): Fact[] {
  const roles = getPublishedExperience();
  // The current role, or else the one that ended last, labelled by which it
  // is (DEC-072): the profile never presents an ended role as current.
  const latest = getMostRecentExperience();
  const firstStart = roles.map((role) => role.startDate).sort()[0];
  const years = firstStart ? completedYearsSince(firstStart) : 0;
  const [degree] = getPublishedEducation();

  return [
    { term: "Based in", value: location },
    ...(latest
      ? [
          {
            term: latest.isCurrent ? "Current role" : "Most recent role",
            value: latest.position,
          },
          { term: "Company", value: latest.companyName },
        ]
      : []),
    ...(years >= 1
      ? [
          {
            term: "Experience",
            value: `${years}+ ${years === 1 ? "year" : "years"} in software delivery`,
          },
        ]
      : []),
    ...(degree ? [{ term: "Education", value: degree.qualification }] : []),
  ];
}
