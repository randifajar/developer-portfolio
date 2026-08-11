import { MarkdownContent } from "@/components/ui/markdown-content";
import { SectionHeader } from "@/components/ui/section-header";
import { getPublishedAIPractices } from "@/domain/content/selectors";
import { SECTION_IDS } from "@/lib/constants";

/**
 * AI-Assisted Engineering (UX 7.8).
 *
 * An introduction followed by the four-step workflow, each step stating the
 * AI-supported activity, the human responsibility, and the verification
 * method.
 *
 * The three-part structure is the point. FAC-AI-002 forbids presenting AI as
 * the owner of final technical decisions, so every step renders human
 * responsibility and verification alongside the activity — they are required
 * schema fields, which means a practice physically cannot be published without
 * them.
 *
 * Tool logos are omitted. UX 7.8: the workflow matters more than vendor
 * decoration.
 *
 * Visual weight was reduced in v1.1 (Issue 7). The section is a differentiator,
 * not the identity — the page should read "a backend engineer who uses AI
 * responsibly", not "an AI-tool operator who also does backend work".
 *
 * Measured before changing anything, because the handoff asked whether the
 * treatment gave this more weight than Work Experience or Projects rather than
 * asserting that it did. At 1280px it occupied 1206px against Projects' 734 —
 * 64% more — and it carried bg-surface-muted, which only Work Experience
 * otherwise had. So the evidence sections sat on plain background while the
 * section about tooling was one of two visually promoted ones.
 *
 * The background is gone and the cards are denser. Nothing was removed:
 * responsibility, verification, corrected assumptions, and the tool names are
 * all still here, because those are what make the section honest rather than
 * promotional. Height parity with Projects is therefore not reachable — four
 * practices with five required fields each is simply that much content — and
 * chasing it would mean deleting the disclosure the section exists to make.
 */
export function AIWorkflowSection() {
  const practices = getPublishedAIPractices();

  if (practices.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="mx-auto w-full max-w-(--spacing-content) px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8">
          <SectionHeader
            eyebrow="How I work"
            heading="AI-Assisted Engineering"
            id={SECTION_IDS.aiWorkflow}
            description="AI accelerates the work. I remain responsible for the requirements, the architecture, the review, and every final decision."
          />

          <ol className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {practices.map((practice, index) => (
              <li
                key={practice.id}
                className="flex flex-col gap-3 rounded-(--radius-card) border border-border bg-surface p-5"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent"
                  >
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-text-primary">{practice.activity}</h3>
                </div>

                <p className="text-sm text-text-muted">Tool: {practice.toolName}</p>

                <MarkdownContent>{practice.purpose}</MarkdownContent>

                {/*
                  These three blocks keep their stacked uppercase labels rather
                  than being inlined to save height. Inlining would have cut
                  roughly 120px, and it would have cut it from exactly the
                  content the handoff says to preserve — the human
                  responsibility and the verification method are what stop this
                  reading as a tools showcase, so they keep their own scannable
                  headings and their heading semantics.
                */}
                <div className="flex flex-col gap-2 border-t border-border pt-3">
                  <div className="flex flex-col gap-1">
                    <h4 className="text-sm font-semibold tracking-wide text-text-muted uppercase">
                      My responsibility
                    </h4>
                    <p className="text-sm text-text-secondary">{practice.humanResponsibility}</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h4 className="text-sm font-semibold tracking-wide text-text-muted uppercase">
                      How it is verified
                    </h4>
                    <p className="text-sm text-text-secondary">{practice.verificationMethod}</p>
                  </div>

                  {practice.correctedAssumption ? (
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-semibold tracking-wide text-text-muted uppercase">
                        A corrected assumption
                      </h4>
                      <p className="text-sm text-text-secondary">{practice.correctedAssumption}</p>
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
