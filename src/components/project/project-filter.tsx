"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { ProjectRowList, type ProjectRowData } from "@/components/shared/project-row-list";
import { DISCIPLINES, type Discipline } from "@/domain/content/types";
import { DISCIPLINE_LABELS, ROUTES } from "@/lib/constants";

/**
 * The projects filter (UX3 7.4, DEC-057): All, Backend, or Infrastructure,
 * each with its count.
 *
 * The state lives in the address, as `?discipline=`, so a filtered view
 * survives a reload and Back. An unknown value reads as All. The address is
 * replaced rather than pushed: Back leaves the page instead of stepping back
 * through filters.
 *
 * Without JavaScript every project shows. The server renders the All view,
 * which is also what React hydrates from, and the filter applies once the
 * page is interactive.
 *
 * A project with no discipline, like the portfolio itself, appears under All
 * only.
 */
type Filter = "all" | Discipline;

const FILTERS: readonly Filter[] = ["all", ...DISCIPLINES];
const FILTER_LABELS: Record<Filter, string> = { all: "All", ...DISCIPLINE_LABELS };
const CHANGE_EVENT = "project-filter-change";

function readFilter(): Filter {
  const value = new URLSearchParams(window.location.search).get("discipline");
  return (DISCIPLINES as readonly string[]).includes(value ?? "") ? (value as Discipline) : "all";
}

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/*
 * The index address the visitor last saw, filter included, for the case
 * study's back link. Module state, so it lasts across client navigations and
 * is gone after a reload, when the plain index is the right destination.
 */
let lastIndexHref: string | null = null;
const subscribeToNothing = () => () => {};

export function ProjectFilter({ rows }: { readonly rows: readonly ProjectRowData[] }) {
  const filter = useSyncExternalStore<Filter>(subscribe, readFilter, () => "all");

  useEffect(() => {
    lastIndexHref = `${window.location.pathname}${window.location.search}`;
  }, [filter]);

  function choose(next: Filter) {
    const url = new URL(window.location.href);

    if (next === "all") {
      url.searchParams.delete("discipline");
    } else {
      url.searchParams.set("discipline", next);
    }

    // Next.js keeps its router in step with a native replaceState, as long as
    // its own history state is carried over.
    window.history.replaceState(window.history.state, "", url);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  const countFor = (candidate: Filter) =>
    candidate === "all"
      ? rows.length
      : rows.filter((row) => row.disciplines.includes(candidate)).length;
  const visible = filter === "all" ? rows : rows.filter((row) => row.disciplines.includes(filter));

  return (
    <div className="flex flex-col gap-6">
      <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-x-7 gap-y-1">
        {FILTERS.map((candidate) => {
          const pressed = candidate === filter;

          return (
            <button
              key={candidate}
              type="button"
              aria-pressed={pressed}
              onClick={() => choose(candidate)}
              className={[
                "inline-flex min-h-11 items-center gap-2 border-b-2 text-body font-medium",
                pressed
                  ? "border-accent text-text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary",
              ].join(" ")}
            >
              {FILTER_LABELS[candidate]}
              <span className="text-meta text-text-muted tabular-nums">{countFor(candidate)}</span>
            </button>
          );
        })}
      </div>

      {/* Announced, so a screen-reader user hears what a filter did. */}
      <p aria-live="polite" className="sr-only">
        {`${visible.length} ${visible.length === 1 ? "project" : "projects"} shown`}
      </p>

      {visible.length > 0 ? (
        <ProjectRowList rows={visible} />
      ) : (
        <p className="border-t border-border py-8 text-body text-text-secondary">
          Nothing is published under {FILTER_LABELS[filter]} yet.
        </p>
      )}
    </div>
  );
}

/**
 * The case study's way back to the index (UX3 7.5): to the filtered view the
 * visitor came from, or the plain index when they arrived another way. It is
 * an ordinary link, so it works without JavaScript too.
 */
export function ProjectsBackLink({ className }: { readonly className?: string }) {
  const href = useSyncExternalStore(
    subscribeToNothing,
    () => lastIndexHref ?? ROUTES.projects,
    () => ROUTES.projects,
  );

  return (
    <Link href={href} className={className}>
      <span aria-hidden="true">←</span> Projects
    </Link>
  );
}
