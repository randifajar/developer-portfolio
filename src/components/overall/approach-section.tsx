import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionTitle } from "@/components/ui/section-title";
import { getPublishedEngineeringPractices } from "@/domain/content/selectors";

/**
 * How I approach engineering — the page's one blue section (UX3 3, 7.1).
 *
 * Six practices, each restating a résumé line; their sources are listed in
 * src/content/practices.ts. The headline was proposed wording, approved by
 * Randi on 2026-11-19 (OPEN-009). It is a section title, not a quotation: the
 * requirements ask that nothing be presented as his words unless he wrote it.
 */
const HEADING_ID = "approach-heading";

export function ApproachSection() {
  const practices = getPublishedEngineeringPractices();

  if (practices.length === 0) {
    return null;
  }

  return (
    <Section surface="blue" labelledBy={HEADING_ID}>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-5">
          <Eyebrow>How I approach engineering</Eyebrow>
          <SectionTitle
            id={HEADING_ID}
            lead="Understand it, change it carefully, "
            accent="prove it works."
          />
        </div>

        <ul className="grid gap-x-10 gap-y-8 min-[560px]:grid-cols-2 min-[900px]:grid-cols-3">
          {practices.map((practice) => (
            <li key={practice.id} className="flex flex-col gap-3 border-t border-border pt-5">
              <h3 className="text-card-title font-semibold">{practice.title}</h3>
              <p className="text-body text-text-secondary">{practice.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
