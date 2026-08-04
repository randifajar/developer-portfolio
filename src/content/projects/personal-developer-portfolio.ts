import { defineProject } from "@/domain/content/define";

/**
 * Personal Developer Portfolio — DRAFT.
 *
 * A confirmed launch project (Handoff section 4). This one is unusual: it is a
 * case study about the very repository it lives in, so most of its content can
 * be written truthfully from observable facts rather than requiring Randi to
 * recall private context.
 *
 * It is still Draft. deliveryStatus is "in-development" because that is
 * literally true today — the site has not launched. FAC-PROJECT-004 forbids
 * claiming a status the work has not reached, and "production" additionally
 * requires an explicit verified confirmation (TD 9.5).
 *
 * Sections marked DRAFT PLACEHOLDER need Randi's judgement or post-launch
 * facts. The rest describe decisions already made and visible in this
 * repository.
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
    "DRAFT PLACEHOLDER: final implementation summary pending completion of the build. It will " +
    "describe what was implemented and what was deliberately left out of Version 1.",

  testingAndVerification:
    "Domain logic is test-driven: schema rules, publication and confidentiality filtering, " +
    "selectors, and adjacent-project navigation all have tests written before the implementation. " +
    "Component tests cover reusable behaviour. End-to-end tests run against a production build on " +
    "Chromium, Firefox, and WebKit, including automated accessibility scans where critical and " +
    "serious findings fail the run.",

  outcome:
    "DRAFT PLACEHOLDER: outcome pending launch. It will describe the verified public result " +
    "without invented metrics (FAC-PUBLISH-005).",

  aiUsage:
    "AI accelerated repository analysis, implementation planning, scoped code generation, and " +
    "test authoring. I retained responsibility for the requirements, the architecture, reviewing " +
    "every change, and deciding what was correct. Where an AI-proposed approach conflicted with " +
    "the approved design, the conflict was recorded and resolved explicitly rather than absorbed " +
    "silently.",

  lessonsLearned:
    "DRAFT PLACEHOLDER: lessons pending completion. Early observation: encoding a confidentiality " +
    "rule as a validation failure is far more reliable than remembering to apply it.",

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

  // featured stays false while this is Draft. Technical Design 9.4 requires
  // every featured project to be Published, because featuring one puts it on
  // the homepage. featuredPriority records the intended order so P30 only has
  // to flip publicationStatus and featured together.
  featured: false,
  featuredPriority: 1,
  publicationStatus: "draft",
  updatedAt: "2026-08-04",
});
