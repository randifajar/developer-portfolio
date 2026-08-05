import { defineProject } from "@/domain/content/define";

/**
 * Personal Developer Portfolio — PUBLISHED.
 *
 * A confirmed launch project (Handoff section 4). This one is unusual: it is a
 * case study about the very repository it lives in, so its content is written
 * from observable facts rather than requiring Randi to recall private context.
 * Decisions visible in the code, defects the checks actually caught, and
 * behaviour verified against the live deployment. Nothing here is an invented
 * achievement.
 *
 * Approved for publication by Randi on 2026-08-05, including the "Sole
 * developer" role wording — the work was AI-accelerated under his direction,
 * and `aiUsage` discloses that explicitly rather than leaving it implied.
 *
 * deliveryStatus remains "in-development" and that is deliberate. The
 * application is deployed and verified running, but the portfolio itself has
 * not launched: most content is still Draft and indexing is disabled.
 * FAC-PROJECT-004 forbids claiming a status the work has not reached, and
 * "production" would additionally require a verified productionConfirmation
 * (TD 9.5). Revisit this at launch, not before.
 *
 * Editing any claim here means re-checking it against the repository. The
 * value of this case study is that every statement in it is verifiable.
 */
export const personalDeveloperPortfolio = defineProject({
  id: "project-personal-developer-portfolio",
  slug: "personal-developer-portfolio",
  title: "Personal Developer Portfolio",
  summary:
    "A statically generated portfolio built with typed local content, build-time validation, and " +
    "a publishing workflow that cannot ship unpublished or confidential material.",

  projectType: "personal",
  role: "Sole developer — requirements, architecture, implementation, testing, and delivery",
  deliveryStatus: "in-development",
  period: "2026",

  context:
    "Professional information was scattered across a CV, LinkedIn, GitHub, and private company " +
    "repositories. Recruiters and technical interviewers had no single place to understand what " +
    "kind of developer I am, what I personally contributed, and which work actually reached " +
    "production.",

  problem:
    "Most professional source code cannot be published because it belongs to private company " +
    "systems. The portfolio had to turn verified professional evidence into truthful, " +
    "confidentiality-safe case studies — without overstating delivery status or presenting team " +
    "outcomes as individual work.",

  personalResponsibilities: [
    "Defined the product requirements, acceptance criteria, and technical design before writing code.",
    "Designed the content model so publication status, delivery status, and confidentiality are three independent axes.",
    "Implemented build-time validation that blocks unpublished or unsafe content from rendering.",
    "Built the static site with Next.js App Router using Server Components by default.",
    "Set up the automated quality gate and the branch-and-pull-request publishing workflow.",
  ],

  technicalApproach:
    "Content lives in typed TypeScript modules parsed by Zod at import, so a malformed record " +
    "fails the build rather than reaching a page. A selector layer is the only way pages read " +
    "content, and it applies one eligibility rule: published, and classified public or " +
    "sanitized. Project routes are generated at build time from that selector, so an " +
    "unpublished project has no route, no sitemap entry, and no metadata — its absence is what " +
    "hides it, not a runtime check.",

  workflowOrArchitecture:
    "Typed content modules → Zod structure validation → cross-record validation → selector layer " +
    "→ Server Components → static HTML. Two validation modes exist: a structural one that runs " +
    "on every pull request, and a stricter release one that additionally rejects placeholder " +
    "text and requires the launch content to be complete.",

  challenges: [
    {
      title: "Preventing accidental disclosure structurally rather than by discipline",
      description:
        "Marking content as Draft hides it from the website but does not make it private on " +
        "GitHub. The repository is public, so Draft content still has to be safe to read " +
        "directly. The model separates 'will the site show this' from 'is this safe to publish " +
        "at all', and validation enforces that private and restricted material can never be " +
        "marked published.",
    },
    {
      title: "Building against content that does not exist yet",
      description:
        "Waiting for final copy would have blocked all implementation. Instead the site is built " +
        "against structurally valid Draft placeholders, and a separate release validation refuses " +
        "to launch while any placeholder remains. Development is never blocked, and placeholders " +
        "cannot reach production.",
    },
  ],

  decisionsAndTradeoffs: [
    {
      decision: "Typed local content modules instead of a CMS or database",
      rationale:
        "One author, infrequent updates, and a need for review and rollback. Git already provides " +
        "history, review, and rollback; a CMS would add hosting, authentication, and a migration " +
        "surface for no benefit at this scale.",
      tradeoff:
        "Content changes require a repository change and a pull request rather than a browser " +
        "editor. Accepted for Version 1, and the selector boundary keeps a later migration open.",
    },
    {
      decision: "Server Components by default, with one interactive client boundary",
      rationale:
        "The site is almost entirely static content. Shipping React state to the browser for " +
        "content that never changes would cost load time for nothing.",
      tradeoff:
        "Interactive behaviour must be deliberately isolated. Only the mobile navigation menu is " +
        "a Client Component.",
    },
    {
      decision: "Two validation modes rather than one",
      rationale:
        "A single strict validator would have blocked every early commit, since no real content " +
        "existed yet. Splitting structural from release validation let implementation proceed " +
        "while keeping the launch gate strict.",
      tradeoff:
        "Two code paths to maintain, and the release gate must be genuinely strict or it provides " +
        "false confidence.",
    },
  ],

  implementationSummary:
    "Version 1 is a statically generated Next.js App Router site with no database, no runtime " +
    "API, and no CMS. Content lives in typed TypeScript modules parsed by Zod at import, so a " +
    "malformed record fails the build rather than reaching a page. Fifteen cross-record rules " +
    "cover what no single schema can see — unique slugs, valid references, exactly one active " +
    "resume, no published private content. A selector layer is the only path from content to " +
    "pages, enforced by a lint rule rather than by convention.\n\n" +
    "Everything else is deliberately absent: no authentication, admin dashboard, CMS, database, " +
    "backend API, contact form, state-management library, UI component library, or analytics. " +
    "Each was excluded by an explicit decision rather than left undone. Docker was scoped as a " +
    "post-launch enhancement so it could not delay the launch.",

  testingAndVerification:
    "Domain logic is test-driven: schema rules, publication and confidentiality filtering, " +
    "selectors, and adjacent-project navigation all have tests written before the implementation. " +
    "Component tests cover reusable behaviour. End-to-end tests run against a production build on " +
    "Chromium, Firefox, and WebKit, including automated accessibility scans where critical and " +
    "serious findings fail the run.",

  outcome:
    "The site is deployed and running on managed hosting, with the automated quality gate green " +
    "on every merge: formatting, linting, strict type checking, content validation, unit and " +
    "component tests, a production build, and end-to-end plus accessibility tests across three " +
    "browser engines.\n\n" +
    "The confidentiality behaviour is verified against the live deployment rather than assumed. " +
    "An unknown project URL and an unpublished one return byte-identical responses, so the site " +
    "cannot reveal that unpublished work exists. Unpublished projects are absent from the sitemap " +
    "and carry no metadata, because their routes are never generated in the first place.\n\n" +
    "Several defects were caught by the checks rather than by review: a colour pairing that " +
    "failed the WCAG AA contrast threshold, two routes that shipped with no primary heading, and " +
    "a build that passed locally but failed in CI because line endings differed between the two " +
    "environments. Each was fixed at the cause and covered by a regression test.",

  aiUsage:
    "AI accelerated repository analysis, implementation planning, scoped code generation, and " +
    "test authoring. I retained responsibility for the requirements, the architecture, reviewing " +
    "every change, and deciding what was correct. Where an AI-proposed approach conflicted with " +
    "the approved design, the conflict was recorded and resolved explicitly rather than absorbed " +
    "silently.",

  lessonsLearned:
    "**Encoding a rule beats remembering it.** The confidentiality requirements could have been a " +
    "checklist. Making them validation failures meant that publishing restricted content, or " +
    "labelling work as production without verified deployment, became impossible rather than " +
    "merely discouraged.\n\n" +
    "**Verifying each part is not the same as verifying the whole.** Two branches each passed " +
    "their own checks and broke CI the moment they merged, because neither contained both the " +
    "linter configuration and the file it needed to cover. The lesson was not to test more, but " +
    "to test the combination that actually ships.\n\n" +
    "**A local check that does not reproduce CI is worse than no local check.** The same commit " +
    "passed locally and failed in CI because a Windows checkout and a Linux runner disagreed on " +
    "line endings. Until that was normalised, every local 'verified' was quietly meaningless.\n\n" +
    "**A quality threshold encodes a judgement, and mine was wrong.** The accessibility scan " +
    "blocked on critical and serious findings only. Missing page headings are rated moderate, so " +
    "two routes reached production with no primary heading at all. Tool severity describes how " +
    "badly a rule breaks a page in general; it does not know which requirements a given project " +
    "treats as launch-blocking.\n\n" +
    "**Splitting the launch gate from the development gate was the decision that made the rest " +
    "workable.** Development ran for the entire build against placeholder content, with a second " +
    "validator that refused to let any of it reach production.",

  technologyIds: [
    "skill-typescript",
    "skill-react",
    "skill-nextjs",
    "skill-vitest",
    "skill-playwright",
    "skill-git",
    "skill-ai-assisted-engineering",
  ],

  confidentialityClass: "public",

  // Published and featured together: Technical Design 9.4 requires every
  // featured project to be Published, because featuring one puts it on the
  // homepage. featuredPriority 1 places it first in the approved ordering.
  featured: true,
  featuredPriority: 1,
  publicationStatus: "published",
  updatedAt: "2026-08-04",
});
