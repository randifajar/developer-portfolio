import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink } from "@/components/ui/external-link";

interface MarkdownContentProps {
  readonly children: string;
  readonly className?: string;
}

/**
 * Renders approved Markdown from content modules.
 *
 * Raw HTML is disabled and stays disabled (TD 5.5). react-markdown ignores
 * embedded HTML unless `rehype-raw` is added; adding it for convenience would
 * turn every content field into an injection surface. Content is authored by
 * one trusted person, but the safety property should not depend on that
 * remaining true.
 *
 * Only long-form prose fields use this — context, approach, testing, outcome,
 * lessons. Short fields are plain strings rendered directly.
 */
export function MarkdownContent({ children, className }: MarkdownContentProps) {
  return (
    <div
      className={["flex max-w-(--spacing-prose) flex-col gap-4", className]
        .filter(Boolean)
        .join(" ")}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children: content }) => (
            <p className="text-base leading-relaxed text-text-secondary">{content}</p>
          ),
          // Content starts at h3: the page owns h1 and the section owns h2, so
          // a content heading must not outrank them (NFAC-A11Y-003).
          h1: ({ children: content }) => (
            <h3 className="mt-2 text-xl font-semibold text-text-primary">{content}</h3>
          ),
          h2: ({ children: content }) => (
            <h3 className="mt-2 text-xl font-semibold text-text-primary">{content}</h3>
          ),
          h3: ({ children: content }) => (
            <h4 className="mt-2 text-lg font-semibold text-text-primary">{content}</h4>
          ),
          ul: ({ children: content }) => (
            <ul className="flex list-disc flex-col gap-2 pl-6 text-text-secondary">{content}</ul>
          ),
          ol: ({ children: content }) => (
            <ol className="flex list-decimal flex-col gap-2 pl-6 text-text-secondary">{content}</ol>
          ),
          li: ({ children: content }) => <li className="leading-relaxed">{content}</li>,
          strong: ({ children: content }) => (
            <strong className="font-semibold text-text-primary">{content}</strong>
          ),
          code: ({ children: content }) => (
            <code className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-sm text-text-primary">
              {content}
            </code>
          ),
          blockquote: ({ children: content }) => (
            <blockquote className="border-l-4 border-border pl-4 text-text-muted italic">
              {content}
            </blockquote>
          ),
          a: ({ href, children: content }) => {
            // Relative links stay internal; anything absolute is treated as
            // external and gets the safe new-tab attributes.
            if (href && /^https?:\/\//.test(href)) {
              return (
                <ExternalLink href={href} className="text-accent underline underline-offset-2">
                  {content}
                </ExternalLink>
              );
            }
            return (
              <a href={href} className="text-accent underline underline-offset-2">
                {content}
              </a>
            );
          },
          // Long-form content can include wide tables; they scroll rather than
          // forcing the page to scroll horizontally (NFAC-RESP-001).
          table: ({ children: content }) => (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">{content}</table>
            </div>
          ),
          th: ({ children: content }) => (
            <th className="border-b border-border px-3 py-2 font-semibold text-text-primary">
              {content}
            </th>
          ),
          td: ({ children: content }) => (
            <td className="border-b border-border px-3 py-2 text-text-secondary">{content}</td>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
