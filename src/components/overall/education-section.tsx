import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import {
  getPublishedCertifications,
  getPublishedEducation,
  getPublishedLanguages,
} from "@/domain/content/selectors";
import { SECTION_IDS } from "@/lib/constants";
import { formatRoleDates } from "@/lib/dates";

/**
 * Education & credentials (UX3 7.1): degree and programme, certifications,
 * languages. Every value is as Randi's résumés state it; see
 * src/content/credentials.ts.
 *
 * A column with nothing published is left out rather than shown empty.
 */
const HEADING_ID = "education-heading";

interface Entry {
  readonly id: string;
  readonly name: string;
  readonly detail: string;
}

export function EducationSection() {
  const columns: readonly { readonly title: string; readonly entries: readonly Entry[] }[] = [
    {
      title: "Education",
      entries: getPublishedEducation().map((record) => ({
        id: record.id,
        name: record.institution,
        detail: [
          record.qualification,
          record.detail,
          formatRoleDates({
            startDate: record.startDate,
            endDate: record.endDate,
            isCurrent: false,
          }),
        ]
          .filter(Boolean)
          .join(" · "),
      })),
    },
    {
      title: "Certifications",
      entries: getPublishedCertifications().map((record) => ({
        id: record.id,
        name: record.name,
        detail: `${record.issuer} · ${record.year}`,
      })),
    },
    {
      title: "Languages",
      entries: getPublishedLanguages().map((record) => ({
        id: record.id,
        name: record.name,
        detail: record.proficiency,
      })),
    },
  ].filter((column) => column.entries.length > 0);

  if (columns.length === 0) {
    return null;
  }

  return (
    <Section surface="white" id={SECTION_IDS.education} labelledBy={HEADING_ID}>
      <div className="flex flex-col gap-10">
        <Eyebrow as="h2" id={HEADING_ID}>
          Education &amp; credentials
        </Eyebrow>

        <div className="grid gap-10 min-[860px]:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-4">
              <h3 className="text-card-title font-semibold">{column.title}</h3>
              <ul className="flex flex-col gap-4">
                {column.entries.map((entry) => (
                  <li key={entry.id} className="flex flex-col gap-1">
                    <span className="text-body font-semibold">{entry.name}</span>
                    <span className="text-meta text-text-secondary">{entry.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
