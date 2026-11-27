import { Fragment } from "react";
import type { CaseStudyDiagram } from "@/domain/content/schemas";

type HandoffDiagram = Extract<CaseStudyDiagram, { kind: "handoff" }>;
type PipelineDiagram = Extract<CaseStudyDiagram, { kind: "pipeline" }>;

/**
 * A case study's diagram (DEC-076, backlog item 11), drawn from its record.
 *
 * One figure, two layouts. It spans the whole section, not only the text
 * column, so from 1024 px wide it has about 880 px: room for the approved
 * shape, two lanes for a handoff and a row of stages for a pipeline. Below
 * that, the same diagram runs down one column, so its text never shrinks below
 * the page's own sizes. Only one layout is displayed at a time; the other is
 * `display: none`.
 *
 * Both sit inside one `role="img"`, named by the record's description, so a
 * screen reader hears the diagram once, in words, and its caption from the
 * figure. The section's own text, beside it, stays the full explanation.
 *
 * Every colour is a surface token, so the diagram follows the case study's
 * surface with no colours of its own.
 */
export function ProjectDiagram({ diagram }: { readonly diagram: CaseStudyDiagram }) {
  // Browsers name a figure from its caption; saying so explicitly means every
  // engine and every testing tool agrees on the name. A page shows at most one
  // diagram per case study, and titles differ, so the title makes the id.
  const captionId = `diagram-${diagram.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

  return (
    <figure className="flex flex-col gap-3" data-diagram={diagram.kind} aria-labelledby={captionId}>
      <div
        role="img"
        aria-label={diagram.description}
        className="rounded-(--radius-card) bg-surface-muted p-4 sm:p-6"
      >
        {diagram.kind === "handoff" ? (
          <HandoffDiagramView diagram={diagram} />
        ) : (
          <PipelineDiagramView diagram={diagram} />
        )}
      </div>
      <figcaption id={captionId} className="text-meta text-text-muted">
        {diagram.title}
      </figcaption>
    </figure>
  );
}

const WIDE = "hidden lg:block";
const NARROW = "mx-auto w-full max-w-xl lg:hidden";

function StepNumber({ value }: { readonly value: number }) {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-meta font-bold text-on-accent">
      {value}
    </span>
  );
}

function ArrowHead({ down = false }: { readonly down?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 10 10"
      className={`size-2.5 shrink-0 fill-accent ${down ? "rotate-90" : ""}`}
    >
      <path d="M0 0 L10 5 L0 10 z" />
    </svg>
  );
}

/* ------------------------------------------------------------------------- */
/* Handoff: work moving between two systems                                   */
/* ------------------------------------------------------------------------- */

/*
 * The wide layout's geometry, in rem. Lane rows are fixed so the connectors,
 * drawn in rem units too, meet the steps exactly whatever the root font size.
 * A step sits STEP_OFFSET below its row's top, clear of the lane's label, and
 * is centred in the rest of the row.
 */
const LANE_ROW = 9;
const GAP_ROW = 4.5;
const STEP_OFFSET = 1;
const TOTAL = LANE_ROW * 2 + GAP_ROW;
const laneCentre = (lane: 0 | 1) =>
  (lane === 0 ? 0 : LANE_ROW + GAP_ROW) + STEP_OFFSET + (LANE_ROW - STEP_OFFSET) / 2;

function HandoffDiagramView({ diagram }: { readonly diagram: HandoffDiagram }) {
  const { lanes, steps, handoffs, note } = diagram;
  const lastStep = steps.length - 1;

  return (
    <div className="flex flex-col gap-4">
      <div
        data-layout="wide"
        className="hidden lg:grid"
        style={{
          gridTemplateColumns: steps
            .map((_, index) => (index === lastStep ? "3fr" : "3fr 1fr"))
            .join(" "),
          gridTemplateRows: `${LANE_ROW}rem ${GAP_ROW}rem ${LANE_ROW}rem`,
        }}
      >
        {lanes.map((lane, laneIndex) => (
          <div
            key={lane}
            className="relative rounded-(--radius-card) border border-border bg-surface"
            style={{ gridColumn: "1 / -1", gridRow: laneIndex === 0 ? "1" : "3" }}
          >
            <p className="absolute top-3 left-4 text-kicker font-semibold text-text-muted uppercase">
              {lane}
            </p>
          </div>
        ))}

        {steps.map((step, index) => (
          <div
            key={`step-${index}`}
            className={`relative z-10 flex items-center gap-3 self-center rounded-(--radius-card) bg-accent-subtle p-3.5 font-semibold text-on-accent-subtle ${index === 0 ? "ml-4" : ""} ${index === lastStep ? "mr-4" : ""}`}
            style={{
              gridColumn: String(index * 2 + 1),
              gridRow: step.lane === 0 ? "1" : "3",
              marginTop: `${STEP_OFFSET}rem`,
            }}
          >
            <StepNumber value={index * 2 + 1} />
            <span>{step.label}</span>
          </div>
        ))}

        {handoffs.map((handoff, index) => {
          const from = laneCentre(steps[index]?.lane ?? 0);
          const to = laneCentre(steps[index + 1]?.lane ?? 1);
          const middle = (from + to) / 2;
          return (
            <div
              key={`handoff-${index}`}
              className="relative z-20"
              style={{ gridColumn: String(index * 2 + 2), gridRow: "1 / 4" }}
            >
              <svg
                aria-hidden="true"
                viewBox={`0 0 100 ${TOTAL}`}
                preserveAspectRatio="none"
                className="absolute inset-0 size-full overflow-visible"
              >
                <path
                  d={`M0 ${from} C50 ${from} 50 ${to} 100 ${to}`}
                  fill="none"
                  strokeWidth={2.5}
                  vectorEffect="non-scaling-stroke"
                  className="stroke-accent"
                />
              </svg>
              <span
                className="absolute right-0 -translate-y-1/2"
                style={{ top: `${(to / TOTAL) * 100}%` }}
              >
                <ArrowHead />
              </span>
              <span
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ top: `${(middle / TOTAL) * 100}%` }}
              >
                <StepNumber value={index * 2 + 2} />
              </span>
              <span
                className="absolute w-max max-w-60 -translate-y-1/2 text-meta text-text-secondary"
                style={{ top: `${(middle / TOTAL) * 100}%`, left: "calc(50% + 1.25rem)" }}
              >
                {handoff}
              </span>
            </div>
          );
        })}
      </div>

      <div data-layout="narrow" className={`flex flex-col ${NARROW}`}>
        {steps.map((step, index) => (
          <Fragment key={`narrow-${index}`}>
            <div className="flex flex-col gap-2">
              <p className="text-kicker font-semibold text-text-muted uppercase">
                {lanes[step.lane]}
              </p>
              <div className="flex items-center gap-3 rounded-(--radius-card) bg-accent-subtle p-3.5 font-semibold text-on-accent-subtle">
                <StepNumber value={index * 2 + 1} />
                <span>{step.label}</span>
              </div>
            </div>
            {index < handoffs.length ? (
              <div className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-x-3 py-1 pl-3.5">
                <span aria-hidden="true" className="mx-auto h-3 w-0.5 bg-accent" />
                <span />
                <StepNumber value={index * 2 + 2} />
                <span className="text-meta text-text-secondary">{handoffs[index]}</span>
                <span aria-hidden="true" className="flex flex-col items-center">
                  <span className="h-3 w-0.5 bg-accent" />
                  <ArrowHead down />
                </span>
                <span />
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>

      {note ? (
        <div className="rounded-(--radius-card) border border-dashed border-accent bg-surface p-4">
          <p className="font-semibold text-text-primary">{note.title}</p>
          <p className="text-meta text-text-secondary">{note.body}</p>
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Pipeline: stages in order, and the modes that apply to some of them        */
/* ------------------------------------------------------------------------- */

type Stage = PipelineDiagram["stages"][number];

function stageTone(stage: Stage, isOutput: boolean): string {
  if (isOutput) return "border-accent bg-accent text-on-accent";
  if (stage.emphasis) return "border-accent bg-accent-subtle text-on-accent-subtle";
  return "border-border bg-surface text-text-primary";
}

function PipelineDiagramView({ diagram }: { readonly diagram: PipelineDiagram }) {
  const { stages, modes } = diagram;
  const last = stages.length - 1;
  const emphasised = stages.flatMap((stage, index) => (stage.emphasis ? [index] : []));
  const first = emphasised[0];
  const span = emphasised.length;

  const modeCards = modes
    ? modes.items.map((item) => (
        <div
          key={item.name}
          className={`flex flex-col gap-1 rounded-(--radius-card) border bg-surface p-4 ${item.emphasis ? "border-accent" : "border-border"}`}
        >
          <p
            className={`text-kicker font-semibold uppercase ${item.emphasis ? "text-accent" : "text-text-muted"}`}
          >
            {item.name}
          </p>
          <p className="font-semibold text-text-primary">{item.heading}</p>
          <p className="text-meta text-text-secondary">{item.body}</p>
        </div>
      ))
    : null;

  return (
    <div className="flex flex-col gap-4">
      <div data-layout="wide" className={WIDE}>
        <div
          className="grid gap-x-8"
          style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}
        >
          {stages.map((stage, index) => (
            <div
              key={`wide-${index}`}
              className={`relative flex min-h-20 items-center justify-center rounded-(--radius-card) border p-3 text-center text-meta font-semibold ${stageTone(stage, index === last)}`}
            >
              {stage.label}
              {index < last ? (
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 left-full flex w-8 -translate-y-1/2 items-center px-1"
                >
                  <span className="h-0.5 flex-1 bg-accent" />
                  <ArrowHead />
                </span>
              ) : null}
            </div>
          ))}

          {modes && first !== undefined ? (
            <div
              className="flex flex-col items-center"
              style={{ gridColumn: `${first + 1} / span ${span}` }}
            >
              <span
                aria-hidden="true"
                className="h-5 self-stretch rounded-b-lg border-x-2 border-b-2 border-accent"
                style={{ marginInline: `calc((100% - ${span - 1} * 2rem) / ${2 * span})` }}
              />
              <span aria-hidden="true" className="h-4 w-0.5 bg-accent" />
              <p className="pt-1 text-kicker font-semibold text-text-muted uppercase">
                {modes.label}
              </p>
            </div>
          ) : null}
        </div>
        {modes ? (
          <div
            className="mt-3 grid gap-4"
            style={{ gridTemplateColumns: `repeat(${modes.items.length}, minmax(0, 1fr))` }}
          >
            {modeCards}
          </div>
        ) : null}
      </div>

      <div data-layout="narrow" className={`flex flex-col ${NARROW}`}>
        {stages.map((stage, index) => (
          <Fragment key={`narrow-${index}`}>
            <div
              className={`rounded-(--radius-card) border p-3.5 text-center font-semibold ${stageTone(stage, index === last)}`}
            >
              {stage.label}
            </div>
            {index < last ? (
              <span aria-hidden="true" className="flex flex-col items-center py-1">
                <span className="h-3 w-0.5 bg-accent" />
                <ArrowHead down />
              </span>
            ) : null}
          </Fragment>
        ))}
        {modes ? (
          <div className="mt-5 flex flex-col gap-3">
            <p className="text-kicker font-semibold text-text-muted uppercase">{modes.label}</p>
            {modeCards}
          </div>
        ) : null}
      </div>
    </div>
  );
}
