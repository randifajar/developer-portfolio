import { Section } from "@/components/layout/section";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionTitle } from "@/components/ui/section-title";
import { getPublishedModeIntro } from "@/domain/content/selectors";
import type { Discipline } from "@/domain/content/types";
import { DISCIPLINE_LABELS, ROUTES } from "@/lib/constants";
import { countedNoun } from "@/lib/numbers";

/**
 * Engineering focus — Backend and Infrastructure side by side (UX3 7.1).
 *
 * Each column's description is that mode's intro description, so the Overall
 * page and the mode page describe the discipline in the same words, and both
 * stay at the detail level Randi set for infrastructure (DEC-064). The approved
 * mockup's infrastructure column named the employer's reverse proxy, which that
 * decision keeps off the site.
 *
 * The column titles and the section headline are the approved mockup's. The
 * headline's count is the number of columns shown, so it stays true if a mode
 * intro is ever unpublished.
 */
const HEADING_ID = "focus-heading";

const COLUMNS: readonly { readonly discipline: Discipline; readonly title: string }[] = [
  { discipline: "backend", title: "Systems, data and integrations" },
  { discipline: "infrastructure", title: "Delivery, environments and operations" },
];

export function FocusSection() {
  const columns = COLUMNS.flatMap((column) => {
    const description = getPublishedModeIntro(column.discipline)?.description;
    return description ? [{ ...column, description }] : [];
  });

  if (columns.length === 0) {
    return null;
  }

  return (
    <Section surface="navy" labelledBy={HEADING_ID}>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-5">
          <Eyebrow>Engineering focus</Eyebrow>
          <SectionTitle
            id={HEADING_ID}
            lead={`${countedNoun(columns.length, "discipline")}, `}
            accent="one way of working."
          />
        </div>

        <div className="grid gap-6 min-[760px]:grid-cols-2">
          {columns.map((column) => {
            const label = DISCIPLINE_LABELS[column.discipline];
            const titleId = `focus-${column.discipline}`;

            return (
              <article
                key={column.discipline}
                aria-labelledby={titleId}
                className="flex flex-col gap-4 rounded-(--radius-card) border border-border bg-surface p-6 sm:p-8"
              >
                <Eyebrow>{label}</Eyebrow>
                <h3 id={titleId} className="text-card-title font-semibold">
                  {column.title}
                </h3>
                <p className="text-body text-text-secondary">{column.description}</p>
                <div className="mt-auto">
                  <ArrowLink href={ROUTES[column.discipline]}>{label}</ArrowLink>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
