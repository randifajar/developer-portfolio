interface ProjectResponsibilityProps {
  readonly personal: readonly string[];
  readonly team: readonly string[] | undefined;
}

/**
 * The responsibility split.
 *
 * FAC-PROJECT-003 and NFAC-CONTENT-002 require that team or external work is
 * never presented as Randi's sole ownership. The two lists are rendered as
 * visually distinct blocks with explicit headings rather than one merged list,
 * because a merged list silently attributes everything to the author.
 *
 * "My Responsibility" always renders — the schema requires at least one entry.
 * "Team or External Responsibility" renders only when supplied, since a solo
 * personal project genuinely has none.
 */
export function ProjectResponsibility({ personal, team }: ProjectResponsibilityProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-3 rounded-(--radius-card) border border-accent/30 bg-accent/5 p-5">
        <h3 className="text-sm font-semibold tracking-wide text-accent uppercase">
          My responsibility
        </h3>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-text-secondary">
          {personal.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {team && team.length > 0 ? (
        <div className="flex flex-col gap-3 rounded-(--radius-card) border border-border bg-surface-muted p-5">
          <h3 className="text-sm font-semibold tracking-wide text-text-muted uppercase">
            Team or external responsibility
          </h3>
          <ul className="flex list-disc flex-col gap-2 pl-5 text-text-secondary">
            {team.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
