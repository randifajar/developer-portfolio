import { ArrowLink } from "@/components/ui/arrow-link";
import type { Discipline } from "@/domain/content/types";

/**
 * Project rows, as plain data and presentation (UX3 7.1–7.4).
 *
 * Kept free of selectors so the projects filter, a client component, can
 * render the same rows the server renders on the mode pages. The server
 * builds the data (`project-rows.tsx`); this only lays it out.
 *
 * Each row says what kind of work it is, and only a case study links: an
 * overview has no page of its own (DEC-060).
 */
export interface ProjectRowData {
  readonly id: string;
  /** "Backend", "Backend · Infrastructure", or the project type when it has no discipline. */
  readonly label: string;
  /** "Case study · 2026" or "Overview". */
  readonly kind: string;
  readonly title: string;
  readonly summary: string;
  readonly technologies: readonly string[];
  /** The case study's route. Overviews have none. */
  readonly href?: string;
  readonly disciplines: readonly Discipline[];
}

export function ProjectRowList({ rows }: { readonly rows: readonly ProjectRowData[] }) {
  return (
    <ol className="flex flex-col border-t border-border">
      {rows.map((row) => (
        <li
          key={row.id}
          className="grid gap-4 border-b border-border py-8 min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)_minmax(0,1.3fr)] min-[900px]:gap-10"
        >
          <p className="flex flex-col gap-1 text-meta">
            <span className="font-semibold text-accent">{row.label}</span>
            <span className="text-text-muted">{row.kind}</span>
          </p>

          <div className="flex flex-col gap-2">
            <h3 className="text-card-title font-semibold text-balance">{row.title}</h3>
            <p className="text-body text-text-secondary">{row.summary}</p>
          </div>

          <div className="flex flex-col gap-2 min-[900px]:items-end min-[900px]:text-right">
            {row.technologies.length > 0 ? (
              <p className="text-meta text-text-muted">{row.technologies.join(" · ")}</p>
            ) : null}
            {row.href ? (
              <ArrowLink href={row.href} context={row.title}>
                Read the case study
              </ArrowLink>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
