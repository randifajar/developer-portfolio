import { Eyebrow } from "@/components/ui/eyebrow";
import type { WorkArea } from "@/domain/content/schemas";

/**
 * A discipline's work areas as blocks (UX3 7.2, 7.3): a label, a title, the
 * work, and where there is one, the context that frames it.
 */
export function WorkAreaGrid({ areas }: { readonly areas: readonly WorkArea[] }) {
  return (
    <div className="grid gap-6 min-[860px]:grid-cols-2">
      {areas.map((area) => {
        const titleId = `work-area-${area.id}`;

        return (
          <article
            key={area.id}
            aria-labelledby={titleId}
            className="flex flex-col gap-4 rounded-(--radius-card) border border-border bg-surface p-6 sm:p-8"
          >
            <Eyebrow>{area.label}</Eyebrow>
            <h3 id={titleId} className="text-card-title font-semibold text-balance">
              {area.title}
            </h3>
            <p className="text-body text-text-secondary">{area.body}</p>
            {area.context ? (
              <dl className="mt-auto border-t border-border pt-4">
                <dt className="text-kicker font-semibold text-text-muted uppercase">Context</dt>
                <dd className="mt-1 text-meta text-text-secondary">{area.context}</dd>
              </dl>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
