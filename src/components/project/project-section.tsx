import type { ReactNode } from "react";
import { MarkdownContent } from "@/components/ui/markdown-content";

interface ProjectSectionProps {
  readonly heading: string;
  /** Markdown body. When omitted, the whole section is skipped. */
  readonly body?: string | undefined;
  readonly children?: ReactNode;
}

/**
 * One section of a case study.
 *
 * Renders nothing when it has no body and no children, which is how optional
 * sections such as Architecture or AI-Assisted Engineering disappear cleanly
 * rather than leaving a heading with nothing under it (FAC-PROJECT-006).
 *
 * Headings are h2: the page h1 is the project title, so case-study sections sit
 * one level below it (NFAC-A11Y-003).
 *
 * V3 sets the heading as a label in its own column from 900 px, with the text
 * beside it, as the approved mockup's case study does (UX3 7.5). Below that it
 * stacks. Only the presentation changed: the sections, their order, and their
 * words are as they were (DEC-054).
 */
export function ProjectSection({ heading, body, children }: ProjectSectionProps) {
  if (!body && !children) {
    return null;
  }

  return (
    <section className="grid gap-4 border-t border-border pt-8 min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] min-[900px]:gap-10">
      <h2 className="text-kicker font-semibold text-accent uppercase min-[900px]:pt-1">
        {heading}
      </h2>
      <div className="flex min-w-0 flex-col gap-4">
        {body ? <MarkdownContent>{body}</MarkdownContent> : null}
        {children}
      </div>
    </section>
  );
}
