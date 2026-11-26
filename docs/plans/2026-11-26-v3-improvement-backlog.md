# V3 Improvement Backlog

## Document Information

| Field | Value |
|---|---|
| Date | 2026-11-26 |
| Status | **In progress.** Randi's answers of 2026-11-27 are in section 1.1, and items move to section 4 as they land |
| Source | Randi's decisions of 2026-11-26 on what was left open after V3, numbered here as he numbered them (decisions 1 to 12) |
| Scope | Improve V3, not redesign it. The architecture, the Cinematic Blue Editorial design system, the content-governance and confidentiality rules, the accessibility requirements, the security controls, and the release discipline all stay as they are |
| Delivery | One focused pull request per item into `staging`, each gated in full and merged only with Randi's approval. Nothing reaches `production` except through a promotion he approves |

---

## 1. The decisions

1. **Project overviews (OPEN-011).** Five are published under their current titles and summaries:
   - Jenkins CI/CD Migration and Agent Modernization
   - Notification Hub and AWS Email Events
   - Configurable Data Tables and Export Workflows
   - Notification and Document Service Integrations
   - Evaluation and Certification Platform

   "AI-Assisted Development Across Three Applications" stays Draft. Randi would rather show
   AI-assisted development through his engineering practice and his technical contributions than
   as a project of its own. Before anything is published, every summary, contribution, and
   technology is checked against the confidentiality and publication rules.
2. **Résumés and employment (D6, revised).** There will be two résumés, Backend Engineering and
   Infrastructure Engineering. Both carry the same employment chronology but emphasise different
   capabilities, skills, and projects. Randi supplies both PDFs. Until both are approved, the
   current résumé stays and no placeholder is published. Once they are, the Résumé menu offers
   the variant that matches the active mode, and `/resume.pdf` keeps working. When the current
   role ends, the employment records and every present-tense description change with it.
3. **A third case study (OPEN-003).** Jenkins CI/CD Migration and Agent Modernization becomes the
   first Infrastructure case study. It covers the engineering context and the original problem,
   Randi's responsibilities and contribution, the build-agent migration, the technical decisions
   and tradeoffs, the connectivity and configuration challenges, security and quality, testing and
   verification, the verified outcomes, and the lessons learned. Nothing is invented: a content
   proposal comes first, with every fact that needs Randi's confirmation marked.
4. **Project visuals (OPEN-006).** Original, minimalist technical diagrams, where they genuinely
   support a case study. They can be conceptual architecture, workflow, data-flow, CI/CD
   lifecycle, or before-and-after diagrams.
   - They are styled in the Cinematic Blue Editorial design system.
   - They never show proprietary topology, internal screenshots, source code, credentials,
     hostnames, or confidential company information.
   - Nothing decorative is added to fill space.
   - Randi reviews a proposal before anything is published.
5. **Custom domain (OPEN-007).** Deferred. `randi-fajar-wicaksono.vercel.app` stays.
   - **New:** a post-deployment smoke check. It verifies the canonical domain, the portfolio's
     identity, the published routes, the résumé, the sitemap, and the canonical metadata, so that
     the alias incident recorded on 2026-11-17 cannot happen again unnoticed.
6. **Card headlines.** The social-card renderer gets a real bold weight.
   - The cards keep Geist and their visual identity.
   - Every card is verified: Overall, Backend, Infrastructure, Projects, and each case study.
   - The release audit records the finding, its cause, the fix, and its verification.
7. **Card word spacing.** Check whether a compatible newer renderer fixes it. It does not justify
   a new dependency, a risky framework upgrade, or a complicated workaround. Without a
   straightforward fix, the limitation is documented and deferred.
8. **The next promotion.** #133 waits for the next approved V3 improvements. A maintenance-only
   change is promoted on its own only if it becomes urgent or security-critical. The
   `staging`-to-`production` workflow and its gates stay. Nothing is promoted without Randi's
   explicit approval.
9. **The Staging Preview review.** It stays mandatory.
   - Randi reviews the Preview through his Vercel account before he approves a promotion.
   - Production verification stays a separate post-deployment step and does not replace the
     review.
   - He gets a concise checklist for it.
10. **Home page mobile performance.** Investigate the 4.4 s Speed Index.
    - Compare several measurements rather than a single run.
    - Measure Backend and Infrastructure separately.
    - Keep the cinematic experience: no meaningful animation is removed, and visual quality is
      not lowered, just to chase a score.
    - Findings and proposals come before any significant change.
11. **Workspace instructions.** These are kept outside this repository and handled there.
12. **Project identity.** The project is named **Randi W01**: designation W01, a Personal
    Engineering Portfolio, with the design identity Cinematic Blue Editorial. W01 is the first
    generation under this identity.
    - The name is used in the README, in project documentation, and in future release records.
    - Randi's full name stays the primary identity on the website.
    - V1, V1.1, V2, and V3 keep their names, and release versioning continues as it is.
    - The repository, the Vercel project, the production domain, and the package name are not
      renamed yet. A migration proposal comes first.

### 1.1 The answers of 2026-11-27

Randi answered the questions this backlog raised. Each answer is also recorded in the decision
ledger, as DEC-071 to DEC-080 alongside the decisions above.

- **A. After 27 November 2026 (DEC-072).**
  - The headline stays "Software Engineer · Backend & Infrastructure".
  - The AI Delivery Engineer role ends on 27 November 2026. Zettabyte is presented as Randi's most
    recent employer, not his current one.
  - Present-tense descriptions of the role become completed experience, and "Current role" becomes
    "Most recent role" where it appears.
  - The full history and career progression stay. Nothing says he is unemployed or available, and
    no new employment is claimed.
- **B. The Geist font files.** Approved. They come from an official source, are checked for
  authenticity, weights, licence, and compatibility with the card renderer, and are committed with
  their licence.
- **C. The README (DEC-071).**
  - It opens with "Randi W01" and the tagline "An evolving engineering identity."
  - It may name Regulus AL01 as another project in Randi's personal engineering collection, without
    implying any dependency or integration between the two.
  - The tagline may also appear in project documentation and in the portfolio's own case study, but
    not in the website's hero.
- **D. The default résumé (DEC-073).**
  - `/resume.pdf` keeps serving the backend résumé.
  - Each variant has one canonical file at a stable path: `/resume/backend.pdf` and
    `/resume/infrastructure.pdf`.
  - The selector recommends the variant for the current mode, and keeps both reachable.
- **E. Merge authorization (DEC-080).** Claude may merge a pull request that Randi has explicitly
  authorized, under the conditions now in `docs/governance/git-workflow.md` section 11. Approval to
  implement a change is not approval to merge it, and a promotion always needs its own approval.
- **F. The Résumé description (DEC-074).** The Overall page describes the Résumé link as "Résumés —
  Backend and infrastructure versions.", which is untrue while only the backend résumé exists.
  - The label and description come from the published résumé records.
  - Today they read "Résumé — Backend engineering résumé."
  - Once both variants are published, the page reflects that by itself.
  - This becomes item 14.

---

## 2. The backlog, in priority order

| # | Item | Decision | Needs from Randi |
|---|---|---|---|
| 1 | Employment records when the current role ends | 2, A | **Done** on `staging`; content approval before the promotion |
| 14 | Résumé label and description from the published records | F | Nothing more: approved |
| 2 | Publish five project overviews | 1 | **Done** in #135 |
| 3 | Staging Preview review checklist | 9 | A review of the checklist |
| 4 | Post-deployment smoke check | 5 | A review of the new workflow, which needs to write issues |
| 5 | Card headline weight | 6, B | Nothing more: approved |
| 6 | Card word spacing check | 7 | **Done:** deferred (section 4) |
| 7 | Randi W01 in the README and documentation | 12, C | Nothing more: approved |
| 8 | Naming migration proposal | 12 | Approval before any rename |
| 9 | Home page mobile performance investigation | 10 | Approval of any significant change |
| 10 | Jenkins CI/CD case study | 3 | Answers to the proposal's questions; content approval |
| 11 | Case-study diagrams | 4 | Approval of each proposal |
| 12 | Two résumé variants and a contextual Résumé menu | 2, D | The two approved PDFs |
| 13 | The next promotion | 8, 9 | The Staging Preview review, and explicit approval |

**Why this order:**

- **Item 1 comes first.** Once the current role ends, the live site states something untrue.
- **Item 14 ranks with it.** It was added on 2026-11-27, and it also corrects something untrue on
  the live site.
- **Items 2 to 6 come next.** They are decided and need little or nothing more from Randi.
- **Items 7 to 9 follow.** Each is small, but it waits on a question or produces a proposal.
- **Items 10 to 12 come last.** They depend on facts, images, or files that only Randi can
  supply or approve.

---

## 3. The items

### Item 1 — Employment records when the current role ends

- **Scope (DEC-072).**
  - The AI Delivery Engineer record in `src/content/experience.ts` ends on 27 November 2026, with
    `isCurrent: false`.
  - Every present-tense statement about that role moves to completed experience. That includes the
    profile (`src/content/profile.ts`), the Infrastructure page (`src/content/discipline-pages.ts`,
    where DEC-069 now puts all of that role's work in the past tense), the career chapters
    (`src/content/career.ts`), and anything else a search for present-tense claims finds.
  - "Current role" becomes "Most recent role" where it appears.
  - The headline stays "Software Engineer · Backend & Infrastructure".
- **Never added.** An unemployment status, an availability statement, or a new employment claim.
- **Timing.** The change goes to `staging` first. It reaches the live site only through a promotion
  Randi approves.
- **Depends on.** Nothing more: Randi answered on 2026-11-27.
- **Done when.**
  - No page, card, or metadata states a current role that has ended.
  - The record shows its end month.
  - The full history and career progression are unchanged.
  - Release validation passes.
- **Verification.**
  - The full gate.
  - Release validation.
  - A search of the built pages for present-tense role claims.
  - Randi's content approval, release checklist step 3, before the promotion.
- **Note.** The résumé PDF stays as it is until item 12 replaces it, by Randi's decision.
- **Needs from Randi.** Content approval, before the promotion.

### Item 2 — Publish five project overviews

- **Scope.**
  - Five records in `src/content/project-overviews.ts` become Published. The sixth stays Draft,
    with Randi's reason recorded beside it.
  - The tests that hold every overview at Draft change to hold the sixth only. They are
    `tests/content/overviews-and-resumes.test.ts` and the page tests that refer to OPEN-011.
  - Published overviews appear on the projects index, on the mode page for each of their
    disciplines, and among the Overall page's selected work, and they count in its explore
    section.
- **Before publishing.** Each summary, contribution, and technology is checked against three
  things:
  - DEC-060: general titles, and no internal application names.
  - DEC-064: tools may be named, but not how the employer's systems are wired, and the service
    names stay out.
  - The release scan for names that must not appear.
- **Done when.**
  - The five appear wherever DEC-060 places them.
  - The sixth appears in no page's HTML, DOM text, or client JavaScript.
  - Release validation passes.
- **Verification.**
  - The full gate.
  - Release validation.
  - A search of the build output for the sixth overview's title and summary, done as it was for
    Draft content at the V3 release.
  - Randi's content approval at the promotion.
- **Needs from Randi.** Nothing more. Approved on 2026-11-26.

### Item 3 — Staging Preview review checklist

- **Scope.** A concise checklist for Randi's review of the staging Preview before he approves a
  promotion. It covers:
  - the pages the release affects;
  - the interactions: the mode switch and its animation, the Résumé menu, the projects filter, and
    the pinned career sequence;
  - responsive widths: 320, 390, and 768 px, and desktop;
  - visual regressions against production;
  - the link previews, when cards change.

  It lives in `docs/release-checklist.md` and is referenced from `git-workflow.md` section 11.
  Each promotion pull request names the pages its release touches.
- **Keeps.** The Preview review stays mandatory. Production verification stays a separate step
  (release checklist step 9).
- **Done when.** The checklist exists, and the next promotion pull request uses it.
- **Verification.** The full gate.
- **Needs from Randi.** A review of the checklist.

### Item 4 — Post-deployment smoke check

- **Scope.** A script that checks the live site over HTTP. It reads what to expect from the content
  records rather than hardcoding it. It checks that:
  - the site answers at `SITE_URL`;
  - the canonical URL, `og:url`, every sitemap entry, and `robots.txt` all name that host;
  - the home page shows Randi's name and positioning;
  - every Published route answers 200, and the sitemap lists exactly those routes;
  - `/resume.pdf` answers with a PDF;
  - an unknown route answers 404;
  - no Draft title appears.
- **Where it runs.**
  - At release checklist step 9.
  - In a workflow after each Production deployment, and once a day. On failure, the workflow opens
    an issue the way `security-audit.yml` does, because a failed scheduled run on its own only
    sends an email.
- **Why.** The 2026-11-17 entry in `docs/release-audit.md`: nothing in the gate tests the site's
  own address. That is why production could declare a canonical URL that pointed first at a 404
  and then at someone else's site.
- **Depends on.** Nothing. Item 2 changes what the check expects, and it reads that from the
  content.
- **Done when.**
  - It passes against production.
  - It fails, and each failure is observed, in three cases:
    - a canonical host that differs from `SITE_URL`;
    - a Published route that 404s;
    - a Draft title in a page.
- **Verification.** The break tests above, and one drill of the issue path, as the security-audit
  workflow had.
- **Needs from Randi.** A review. This would be the second workflow with write access, to issues
  only. `github-configuration.md` section 4 records the first.

### Item 5 — Card headline weight

- **Finding (#123).** No card headline renders bold. `next/og` (`@vercel/og` 1.0.1 in Next.js
  16.4.6) bundles only Geist Regular and registers it as weight 700 as well, so `fontWeight: 700`
  draws the regular face.
- **Scope.** A real Geist Bold goes to the renderer through `ImageResponse`'s `fonts` option. It is
  shared by the five card routes: `src/app/opengraph-image.tsx`, the Backend and Infrastructure
  routes, `/projects`, and `/projects/[slug]`. Geist stays the family. The renderer reads TTF,
  OTF, or WOFF, but not WOFF2, so the site's own `next/font` files cannot be reused.
- **Depends on.** A Geist Bold font file from the official Geist release, under the SIL Open Font
  License, committed with that license.
- **Done when.**
  - The headlines render bold on every card.
  - Nothing else on the cards changes.
  - The cards stay 1200×630.
- **Verification.**
  - Every card is rendered before and after the change, and the two are compared.
  - The full gate.
  - A release-audit entry recording the finding, its cause, the fix, and its verification.
- **Needs from Randi.** Nothing more. On 2026-11-27 he approved downloading Geist Regular, Geist
  Bold, and the licence from the official Geist release, with their authenticity, weights, licence,
  and compatibility checked. Both weights are needed, because giving the renderer any font
  replaces its built-in one.

### Item 6 — Card word spacing check

- **Finding (#123).** The renderer positions each word by its unkerned width but draws it with
  kerning. The gap after a word therefore grows by that word's own kerning: about 5 to 6 px after
  "Software".
- **Scope.** Check whether a newer compatible renderer fixes it, meaning the `@vercel/og` in a
  later Next.js 16 release. No new dependency, no risky framework upgrade, and no workaround.
- **Done when.**
  - If a routine compatible update fixes it, the fix goes in with that update.
  - Otherwise, the release audit records the limitation as deferred.
- **Verification.** The same before-and-after card renders as item 5.
- **Outcome, 2026-11-27: deferred.** No routine update fixes it.
  - Next.js 16.4.6, the newest 16.x release, bundles Satori 0.29.0.
  - Satori 0.46.0 added a `fontKerning` property that might even out the gaps; that is untested.
  - The fix would need a new dependency and moving the cards off `next/og`, which DEC-078 rules
    out.

  The release audit records the limitation and when to look again.
- **Needs from Randi.** Nothing.

### Item 7 — Randi W01 in the README and documentation

- **Scope.** The README introduces the project as Randi W01: designation W01, a personal
  engineering portfolio, with the design identity Cinematic Blue Editorial. Future release-audit
  entries and documents use the name.
- **Keeps.**
  - The website keeps Randi's full name as its primary identity.
  - V1, V1.1, V2, and V3 keep their names.
  - Release versioning continues as it is.
- **Not renamed.** The repository, the Vercel project, the domain, and the package name. Item 8
  deals with those.
- **Done when.** The README states the identity, and the README status-accuracy test still passes.
- **Verification.** The full gate.
- **Answered 2026-11-27 (DEC-071).** The README opens with the heading "Randi W01" and the tagline
  "An evolving engineering identity." It may name Regulus AL01 as another project in Randi's
  collection, independent of this one. The tagline may also appear in project documentation and in
  the portfolio's own case study, but not in the website's hero.
- **Needs from Randi.** Nothing more.

### Item 8 — Naming migration proposal

- **Scope.** An assessment, with no change made. For each of the repository, the Vercel project,
  the domain, and the package name, it sets out what a rename would break and how to do it safely.
- **Why it needs care.** The 2026-11-17 entry is the precedent. Renaming the Vercel project
  released its automatic `*.vercel.app` alias, and that alias later served someone else's site
  while this site still declared it canonical. Before any Vercel rename, it has to be established
  whether `randi-fajar-wicaksono.vercel.app` is tied to the project's name.
- **Done when.** The proposal lists, for each rename, the effects, the steps, the verification, and
  the way back.
- **Needs from Randi.** Approval of the proposal before anything is renamed.

### Item 9 — Home page mobile performance investigation

- **Finding (2026-11-22).** On mobile, `/` has a Speed Index of 4.4 s, against 0.9 s on the other
  pages measured. Its Performance score is 97.
- **Scope.**
  - Several Lighthouse runs per page, on mobile, against production, for Overall, Backend, and
    Infrastructure, compared by their medians.
  - Then an assessment of what accounts for the figure: the hero entrance animation, the
    photograph reveal, font rendering, image loading, or something else.
- **Keeps.** The cinematic experience. Nothing meaningful is removed to chase a score.
- **Done when.** The findings are presented, with their measurements and the proposed
  optimizations.
- **Needs from Randi.** Approval of any significant change.

### Item 10 — Jenkins CI/CD case study

- **Scope, in three steps.**
  1. **A content proposal.** The case study's sections, as decision 3 lists them, filled in only
     with what is already confirmed: the résumé line behind the overview, and its technologies.
     Every missing fact becomes a question for Randi. The proposal stays outside this repository
     until he has answered it, because a Draft file in a public repository is still public.
  2. **The case-study record**, Draft until he approves its text.
  3. **Publication**, as the first Infrastructure case study.
- **Rules.**
  - DEC-064: tools are named, the wiring is not.
  - No hostnames, topology, or credentials.
  - Personal and team responsibilities stay separate (FAC-PROJECT-003).
  - `deliveryStatus` describes reality.
- **Depends on.**
  - Randi's answers.
  - Item 11, for its diagrams.
  - A decision on whether the Jenkins overview (item 2) stays once the case study exists.
- **Done when.**
  - Every statement traces to Randi.
  - Release validation passes.
  - He approves the text.
- **Needs from Randi.** Answers to the proposal's questions, and content approval.

### Item 11 — Case-study diagrams

- **Scope.**
  - Original, minimalist diagrams, where they support a case study, drawn with the design
    system's tokens.
  - Each comes with alt text and a text explanation.
  - The content model already lists the `architecture-diagram` and `workflow-diagram` media types.
    The case-study page has no place for a diagram yet: that is the schema field deferred as Q9.
- **Depends on.** Item 10, for the Jenkins diagrams. Either existing case study can also have one
  where a diagram genuinely helps.
- **Done when.** Randi has approved each diagram before it is published.
- **Needs from Randi.** Approval of each proposal.

### Item 12 — Two résumé variants and a contextual Résumé menu

- **Scope (DEC-073).** This starts once both approved PDFs have arrived:
  - `/resume/backend.pdf` and `/resume/infrastructure.pdf` (V3 plan, section 3.1), with one record
    and one canonical file per variant;
  - a Résumé selector that recommends the variant for the current mode, and keeps both reachable;
  - `/resume.pdf`, which keeps serving the backend résumé for backward compatibility, without a
    second copy of the file.
- **Until then.** The current résumé stays, and no placeholder is published.
- **Depends on.**
  - The PDFs.
  - Item 1, since both résumés share its chronology.
  - A personal-data check of each PDF before it is committed, since anything under `public/` is
    served the moment it is committed. FAC-RESUME-004, which allows exactly one active Published
    résumé, has to allow one per variant.
- **Done when.**
  - Both PDFs can be downloaded.
  - The menu follows the mode.
  - `/resume.pdf` resolves.
  - Release validation enforces one active résumé per variant.
- **Needs from Randi.** The two approved PDFs. `/resume.pdf` serves the backend one (answered
  2026-11-27).

### Item 13 — The next promotion

- **Scope.** `staging` to `production`, carrying #133 and whichever approved items have merged by
  then. Item 1 corrects the live site, so the promotion after it merges should not wait for the
  rest.
- **Gates.**
  - `staging` is in sync with `production`.
  - Randi reviews the Staging Preview, using item 3's checklist.
  - `release:check` passes on the exact tree.
  - Randi gives explicit approval.
  - Production is verified afterwards, including the smoke check from item 4.

### Item 14 — Résumé label and description from the published records

- **Finding (2026-11-26).** The Overall page's "Explore further" section labels the Résumé link
  "Résumés" and describes it as "Backend and infrastructure versions." The text has been hardcoded
  since #107, the day before D6 settled on one résumé. So the live site describes an infrastructure
  résumé that does not exist.
- **Scope (DEC-074).** The label and the description come from the published résumé records, not
  from the copy.
  - With only the backend résumé, they read "Résumé" and "Backend engineering résumé."
  - Once both variants are published, they say so by themselves, with no copy change.
- **Depends on.** Nothing.
- **Done when.**
  - The page states only what is published.
  - A test covers both the one-résumé state and the two-résumé state.
- **Verification.** The full gate.
- **Needs from Randi.** Nothing more. Approved on 2026-11-27.

---

## 4. Done already

- **#133.** Dependabot uses its default labels. It is on `staging`, and under decision 8 it waits
  for the next promotion.
- **Item 2, #135.** The five project overviews are Published on `staging`, and the AI-assisted one
  stays Draft. They reach production with the next promotion.
- **Item 6.** The card word spacing is deferred: no routine update fixes it, and the release
  audit's "Outstanding after v3" row records why and when to look again.
- **Item 1.** The infrastructure role ends on 27 November 2026, with no role current. It is shown
  as the most recent role, and its wording is in the past tense (DEC-072). It is on `staging`, and
  needs Randi's content approval before the promotion that takes it live.
