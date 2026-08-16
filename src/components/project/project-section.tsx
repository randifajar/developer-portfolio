import type { ReactNode } from "react";
import { MarkdownContent } from "@/components/ui/markdown-content";

interface ProjectSectionProps {
  readonly heading: string;
  /** Markdown body. When omitted, the whole section is skipped. */
  readonly body?: string | undefined;
  readonly children?: ReactNode;
}

/**
 * One numbered section of a case study.
 *
 * Renders nothing when it has no body and no children, which is how optional
 * sections such as Architecture or AI-Assisted Engineering disappear cleanly
 * rather than leaving a heading with nothing under it (FAC-PROJECT-006).
 *
 * Headings are h2: the page h1 is the project title, so case-study sections sit
 * one level below it (NFAC-A11Y-003).
 */
export function ProjectSection({ heading, body, children }: ProjectSectionProps) {
  if (!body && !children) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4 border-t border-border pt-8">
      <h2 className="text-project-title font-semibold text-text-primary">{heading}</h2>
      {body ? <MarkdownContent>{body}</MarkdownContent> : null}
      {children}
    </section>
  );
}
