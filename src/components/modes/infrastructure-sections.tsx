import { Section } from "@/components/layout/section";
import { WorkAreaGrid } from "@/components/modes/work-area-grid";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionTitle } from "@/components/ui/section-title";
import {
  getMostRecentExperience,
  getPublishedDisciplineIntro,
  getPublishedExperience,
  getPublishedWorkAreas,
} from "@/domain/content/selectors";
import { SECTION_IDS } from "@/lib/constants";
import { formatRoleDates } from "@/lib/dates";

/**
 * The Infrastructure page's own sections (UX3 7.3). Its selected work and
 * toolkit are shared with Backend and live beside these.
 */

/**
 * The transition — the first section, and the hero action's target. Renders
 * while the infrastructure intro is published, which is the condition the
 * `(modes)` layout checks before it offers the action.
 *
 * The facts are read from the experience records, so the dates cannot drift
 * from the timeline. The first is the latest infrastructure role, labelled
 * "Now" while it is current and "Most recent role" once it has ended (DEC-072).
 * Before is the most recent backend role. Scope is the intro's.
 *
 * The role is a delivery and infrastructure role, never presented as SRE
 * (UX3 7.3). The scope line says so in the approved mockup's words.
 */
export function TransitionSection() {
  const intro = getPublishedDisciplineIntro("infrastructure");

  if (!intro) {
    return null;
  }

  const roles = getPublishedExperience();
  const latest = getMostRecentExperience("infrastructure");
  const before = roles.find((role) => !role.isCurrent && role.disciplines.includes("backend"));

  const facts = [
    ...(latest
      ? [
          {
            term: latest.isCurrent ? "Now" : "Most recent role",
            value: `${latest.position} · ${formatRoleDates(latest)}`,
          },
        ]
      : []),
    ...(before
      ? [{ term: "Before", value: `${before.position} · ${formatRoleDates(before)}` }]
      : []),
    ...(intro.scope ? [{ term: "Scope", value: intro.scope }] : []),
  ];

  return (
    <Section surface="light" id={SECTION_IDS.infrastructureWork} labelledBy="transition-heading">
      <div className="grid gap-12 min-[900px]:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] min-[900px]:gap-16">
        <div className="flex flex-col gap-5">
          <Eyebrow>The transition</Eyebrow>
          <SectionTitle
            id="transition-heading"
            lead="From backend developer to the "
            accent="infrastructure team."
          />
          <p className="max-w-(--spacing-prose) text-lead text-pretty text-text-secondary">
            {intro.lead}
          </p>
        </div>

        {facts.length > 0 ? (
          <dl className="flex flex-col self-end border-t border-border">
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

/** Infrastructure work — the four areas of the infrastructure role (UX3 7.3). */
export function InfrastructureWorkSection() {
  const areas = getPublishedWorkAreas("infrastructure");

  if (areas.length === 0) {
    return null;
  }

  return (
    <Section surface="white" labelledBy="infrastructure-work-heading">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-5">
          <Eyebrow>Infrastructure work</Eyebrow>
          <SectionTitle
            id="infrastructure-work-heading"
            lead="Pipelines, environments, "
            accent="and what breaks."
          />
        </div>
        <WorkAreaGrid areas={areas} />
      </div>
    </Section>
  );
}
