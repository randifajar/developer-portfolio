# Implementation Plan — Portfolio V3 (Cinematic Blue Editorial)

## Document Information

| Field | Value |
|---|---|
| Date | 2026-11-18 |
| Status | **Approved 2026-11-18** ("approved, use your recommendations"). Randi also asked for a pre-production environment, so the integration branch is `staging` (D5, section 6). On 2026-11-19 he settled D12 (Zettabyte), D9 (professional experience), the infrastructure detail level (DEC-064) and the proposed wording (approved), and asked for the target-roles list to be removed. P0 to P10 are merged into `staging` (#99 to #114). On 2026-11-21 Randi supplied the photograph (I1) and decided the résumé (I2, D6), and on 2026-11-22 the content and design calls (DEC-065 to DEC-070). P11, the release, is under way: the README and the v3 release-audit entry are prepared, and the promotion pull request is his to merge. The overview titles are working titles (OPEN-011) |
| Approved design | V3.1 review mockup, approved 2026-11-18. It stays on Randi's machine by his decision (2026-11-19); `docs/product/PORTFOLIO_UX_UI_SPEC_v3.0.md` records the design |
| Inputs | V3 master requirements v1.0, the V3.1 improvement brief, the backend and infrastructure résumés, the repository at `25a31d5` |
| Decision and merge authority | Randi Fajar Wicaksono, per pull request |

---

# 1. Executive summary

V3 rebuilds the site's presentation to match the approved V3.1 mockup. It keeps the stack, the
content-validation model and the quality gates that v1 and v2 established.

**What changes for a visitor**

- Three viewing modes with real URLs: **Overall** (`/`), **Backend** (`/backend`) and
  **Infrastructure** (`/infrastructure`). The header holds only the mode selector and a Résumé
  menu.
- Overall follows a driver-profile structure:
  - a hero with one photograph;
  - profile and engineering focus;
  - a three-chapter career sequence;
  - selected work and engineering approach;
  - education and credentials;
  - links onward.
- Full Backend and Infrastructure pages built from the two résumés, a Projects index with a
  discipline filter, and restyled case studies.
- Quiet near-black, navy, off-white and white surfaces, one blue section, and blue as the accent.
- One pointer-following light in the hero, animated mode changes, and a pinned career sequence on
  desktop.

**How it is built**

- **Stack.** Same stack: Next.js 16.4.6 App Router, React 19.2.8, TypeScript, Tailwind v4, Zod,
  Vitest, Playwright and Vercel. **No new runtime dependency.**
- **Motion.** Motion uses CSS (including scroll-driven animation), the Web Animations API and
  `position: sticky`. GSAP is not needed.
- **Content.** Content stays in typed modules validated at build time. The model gains:
  - discipline tags and project overviews;
  - career chapters and mode intros;
  - education, certifications and two résumé variants.
- **Rendering.** Six small client components; everything else stays a Server Component.
- **Delivery.** Twelve reviewable phases (P0–P11), each in its own pull request that Randi merges.
  The recommended route is an integration branch. That needs a governance amendment, because
  `production` is currently the only long-lived branch allowed (section 6).

**Before any code:** twelve decisions (section 4) and a set of owner inputs (section 5). Most phases
can start before every input arrives, because unapproved content stays Draft and release
validation refuses to ship it.

---

# 2. Current state (verified 2026-11-18)

| Area | Today |
|---|---|
| Routes | `/`, `/projects`, `/projects/[slug]`, not-found, `robots`, `sitemap`, Open Graph image; `/resume.pdf` as a static file |
| Case studies | Two published: Jury Process Management Integration, Personal Developer Portfolio |
| Client components | `mobile-navigation.tsx` only. The header is deliberately a Server Component that composes it (Technical Design §13.4) |
| Content | `profile`, `experience`, `projects/*`, `skills`, `ai-practices`, `contact`, `resume`, `media`, `site` |
| Validation | Zod schemas at import; 14 cross-record rules in `validation.ts`; stricter release validation |
| Selector boundary | Pages read content only through `selectors.ts`, enforced by `no-restricted-imports` |
| Design system | Three surfaces (DEC-049); Archivo display with Geist body (DEC-050); nine-step `clamp()` type scale (DEC-051); contrast floor 4.8:1 text and 3.3:1 non-text (DEC-052); tokenised motion with a reduced-motion guard that also stops scroll timelines (DEC-053) |
| Tests | 439 unit and component tests in 33 files (observed 2026-11-18 on a tree identical to `25a31d5`). 211 end-to-end tests passed and 2 skipped across Chromium, Firefox and WebKit at the last recorded run (`release-audit.md`) |
| CI | `quality` and `e2e` required on pull requests to `production`; `audit` advisory; a daily audit that opens an issue on failure |

**Live content that is out of date (phase P0):**

1. **Current role.** `experience.ts` marks Backend Developer as the current role (`isCurrent: true`).
   Since August 2026 the current role is **AI Delivery Engineer, Infrastructure Team**, as Randi
   confirmed on 2026-11-18. `profile.ts` also describes him in the present tense as a Backend
   Developer, in the title and in both summaries.
2. **Availability.** "Open to opportunities" is still shown in the hero, the contact section and
   the Open Graph image. Randi asked for it to be removed.
3. **Résumé note.** `src/content/resume.ts` records that the published résumé carries no phone
   number. The published PDF does carry one.

---

# 3. Target architecture

## 3.1 Routes

| Route | Page | Rendering | Notes |
|---|---|---|---|
| `/` | Overall | Static | Shares the mode layout with the two routes below |
| `/backend` | Backend | Static | New (extends DEC-024) |
| `/infrastructure` | Infrastructure | Static | New (extends DEC-024) |
| `/projects` | Projects index | Static; filter state in `?discipline=` | Unknown values fall back to "all" |
| `/projects/[slug]` | Case study | Static, `dynamicParams = false` | Only projects with a full case study get a route; the two existing case studies keep theirs. Overviews and unknown slugs return the same not-found result (DEC-047) |
| `/resume/backend.pdf`, `/resume/infrastructure.pdf` | Résumés | Static files | Each is added only once that PDF is approved for publication (D6) |
| `/resume.pdf` | Legacy | Permanent redirect | Points to the backend résumé, so existing links on CVs and applications keep working |

**As decided on 2026-11-21 (D6).** The v2 PDF is the only résumé and stays at `/resume.pdf`, so
neither `/resume/*.pdf` file is added and no redirect is needed: existing links keep working
because the file never moves.

## 3.2 Layout and components

```text
app/layout.tsx                       Header (server) composing ModeSwitch + ResumeMenu; Footer (server) with CopyEmail
app/(modes)/layout.tsx               ModeHero (client, persists across the three mode routes) + children
app/(modes)/page.tsx                 Overall sections (server)
app/(modes)/backend/page.tsx         Backend sections (server)
app/(modes)/infrastructure/page.tsx  Infrastructure sections (server)
app/projects/page.tsx                Project list (server) + ProjectFilter (client)
app/projects/[slug]/page.tsx         Case study (server)
```

**The `(modes)` route group.** This is the key decision. Next.js keeps a shared layout mounted when
navigating between its child routes, so the hero is not torn down on a mode change. It can
therefore run the mockup's exit and entrance sequence while the address changes to a real URL.

**Client components.** There are six, all small. The header and footer stay Server Components that
compose them, as Technical Design §13.4 intends.

| Component | Responsibility |
|---|---|
| `ModeSwitch` | Positions the active pill and sets `aria-current` from the pathname; uses `next/link` |
| `ResumeMenu` | Built on the native Popover API, so it opens and closes (Escape, outside click) without JavaScript. The component adds arrow-key movement and marks the résumé that matches the current page |
| `ModeHero` | Runs the hero text exit and entrance when the pathname changes, and owns scroll and focus for mode changes (3.3). Also holds the photograph on Overall and the pointer light |
| `CareerJourney` | Pinned three-chapter sequence with arrows on desktop. It adds the pinned class only after hydration, so the stacked layout is the default without JavaScript and with reduced motion |
| `ProjectFilter` | Discipline filter synced to `?discipline=`. Without JavaScript every project shows |
| `CopyEmail` | The footer's "Copy address" button. The `mailto:` link works without it |

**Removed:** `mobile-navigation.tsx`, `navigation-links.ts`, and the v2 homepage sections in
`src/components/sections/`. Each is removed in the phase that replaces its last consumer, so every
phase leaves a working site. Reusable primitives are kept and restyled: `external-link`,
`markdown-content`, `status-badge` and `technology-tag`.

## 3.3 Mode transition

| Step | Implementation |
|---|---|
| Click a mode | `next/link` client navigation to the real route; the pill moves at once (CSS transition). No `scroll={false}` is needed (UX3 6.5, amended in P5): `ModeHero` wraps the page, so its reset runs after the router's own scroll |
| Exit | `ModeHero` sees the pathname change and runs a Web Animations exit on the current heading lines and text (about 220 ms) |
| Swap | New hero copy renders; the page below is the new route's server output |
| Entrance | Heading lines rise, then the description and the action. Everything settles roughly 0.75 s after the click, as in the approved mockup |
| Scroll and focus | `ModeHero` resets the scroll to the top instantly and moves focus to the new `h1` (`preventScroll`) |
| Interruption | A token cancels the earlier sequence, so rapid clicks settle on the last choice |
| Reduced motion | No animation; immediate swap |

**Why `ModeHero` handles scroll and focus itself.** This was verified in the installed Next.js
16.4.6 router (`layout-router.js`). After a navigation, the router scrolls the first element of the
changed segment into view whenever that element's top edge is outside the viewport. It leaves focus
untouched.

Here the changed segment is the page below the persistent hero. The default behaviour would
therefore jump straight past the hero, and keyboard focus would stay on the mode link. P5
confirms the hero's handling for every entry path before motion is layered on
(`e2e/mode-change.spec.ts`, `tests/components/mode-hero.test.tsx`):
- mode to mode, from mid-page, at desktop and phone widths: top, focus on the new `h1`;
- from `/projects`: the same;
- back and forward: left to the browser;
- reload: left alone.

**As built in P5,** the hero wraps the page rather than sitting beside it. React runs layout effects
children first, so the router's handler for the page runs before the hero's reset, and the reset has
the last word. Beside the page, the hero's effect would run first and the router could still scroll
past it. The P4 skeleton, which this section originally gave the check to, rendered a static hero
per route, so the check moved to P5 with the persistent hero.

**Shared-element transition (optional).** A shared-element move from a project row into its case
study would need React's `<ViewTransition>`. Whether that works with App Router navigations in this
Next.js version, in all three engines, is what a P8 spike establishes. No experimental flag is
assumed. If the spike fails, case-study entry keeps a plain fade.

## 3.4 Content model changes

| Record | Change | Why |
|---|---|---|
| `profile` | Add `positioning` (D1); remove `availabilityStatement` | Positioning is editorial and separate from formal titles. Availability is removed at Randi's request |
| `experience` | Add the AI Delivery Engineer, Infrastructure Team role (Aug 2026 – Present); end Backend Developer at Jul 2026; add `disciplines` to records and to individual highlights | One timeline shared by all modes. Each mode picks its highlights without duplicating the record |
| `careerChapter` (new) | Year, label, headline, body, and the IDs of the roles it covers | The 2024 / 2025 / 2026 grouping is editorial. It must point at real roles, never restate their dates |
| `modeIntro` (new) | Eyebrow, two heading lines, description and action per mode | Hero copy lives in content, not in components |
| `project` | Add `disciplines`, which may be empty, and `presentation: "case-study" \| "overview"`. Overviews need only title, summary, contribution, technologies and disciplines, and get no route | Six résumé projects ship as truthful overviews; only approved projects become case studies. The portfolio project has no discipline and appears only under "All", as in the mockup |
| `skill` | Add the tools used in the infrastructure role; add per-mode toolkit grouping; settle classifications (D9) | The toolkits on each mode page |
| `education`, `certification`, `language` (new) | One record per item, as on both résumés | The Education & credentials section |
| `engineeringPractice` (new) | Title and one sentence, each traceable to a résumé line | "How I approach engineering" |
| `resume` | Add `variant: "backend" \| "infrastructure"`. The rule becomes "at most one active Published résumé per variant" (changes FAC-RESUME-004) | Two résumés behind one menu |
| `siteConfig` | Default title and description follow the positioning | Search results and link previews |
| `ai-practices` | Retired in P5 (D10) | V3 has no AI section |

**Selectors.** Pages keep reading content only through the selector layer, which gains per-mode
functions:
- `selectModeIntro`
- `selectCareerChapters`
- `selectFeaturedWork(mode)`
- `selectToolkit(mode)`
- `selectExperienceHighlights(mode)`

**New cross-record rules:**
- chapter references resolve;
- a chapter's year falls within its roles' dates;
- exactly one `modeIntro` per mode;
- an overview never has a route;
- at most one active résumé per variant.

## 3.5 Design system

- **Tokens:**

  | Role | Value |
  |---|---|
  | Near-black | `#070B12` |
  | Navy | `#0A1931` |
  | Off-white | `#F5F7FA` |
  | White | `#FFFFFF` |
  | Ink | `#111827` |
  | Muted text | `#4B5563` (light surfaces), `#A3B1C6` (dark) |
  | Blue | `#2563EB` and `#1D4ED8` |
  | Sky | `#60A5FA` |
- **Surfaces:** `dark`, `navy`, `light` and `white`, plus one `blue` accent section. These replace
  DEC-049's three surfaces.
- **Contrast:** the 4.8:1 and 3.3:1 floor (DEC-052) stays, and the contrast matrix is rebuilt for
  the new pairs. One pair needs attention: `#2563EB` text on off-white is 4.82:1 (4.816), just over
  the 4.8 floor. The other pairs have room, all computed 2026-11-18:

  | Pair | Ratio |
  |---|---|
  | `#2563EB` on white | 5.17:1 |
  | `#1D4ED8` on off-white | 6.24:1 |
  | `#60A5FA` on near-black | 7.75:1 |

  The darker blue is used for text wherever the margin matters.
- **Typography:** Geist only, unless D8 chooses the serif option shown in the mockup. Dropping
  Archivo removes one font request. The tokenised `clamp()` scale (DEC-051) gains the display steps
  the hero needs; raw Tailwind size utilities stay banned.

## 3.6 Motion

| Interaction | Implementation | Phones and touch | Reduced motion |
|---|---|---|---|
| Hero entrance | CSS keyframes on first load; content visible without JavaScript | Same | None |
| Mode change | Web Animations in `ModeHero` (3.3) | Same | Instant |
| Pointer light | CSS custom properties; `requestAnimationFrame` only while the pointer moves; only under `(hover: hover) and (pointer: fine)` | Off | Off |
| Career sequence | `position: sticky` stage about 210 svh long; scroll position selects the chapter; arrows scroll to a chapter | Stacked chapters with year tabs | Stacked |
| Section reveal | CSS scroll-driven animation (`animation-timeline: view()`) inside `@supports`, starting from 30% opacity, never fully hidden. No JavaScript. Engines without support show the content without the reveal | Same | Stopped by the existing DEC-053 guard |
| Projects filter | Instant; state in the URL | Same | Same |

## 3.7 Performance

Targets from the requirements:
- LCP ≤ 2.5 s;
- CLS ≤ 0.1;
- INP ≤ 200 ms;
- Lighthouse performance ≥ 90 on mobile;
- Lighthouse accessibility ≥ 95.

Measures:

- **Photograph.** Served through `next/image` with `preload` (the `priority` prop is deprecated in
  Next.js 16.4.6), explicit `sizes` and a fixed aspect ratio, so it never shifts layout.
- **Fonts.** Self-hosted through `next/font`; one family if D8 keeps Geist only.
- **Client JavaScript.** Limited to the six components in 3.2. Bundle sizes per route are recorded
  from `next build` at each phase.
- **Runtime cost.** No canvas, and no animation loop at rest. No scroll listeners beyond one passive
  handler on the career section.

## 3.8 Accessibility

- **Mode switch.** Links with `aria-current="page"`; the active state is shown by shape as well as
  colour.
- **Résumé menu.** Native popover with a button invoker. Arrow keys move between items; Escape and
  outside click close it; focus returns to the button.
- **Focus.** Focus moves to the new heading after a mode change. A skip link stays first in the tab
  order.
- **Robustness.** Everything works with JavaScript disabled, with reduced motion, at 200% zoom and
  at 320 px.
- **Automated checks.** axe runs on every route in both motion modes; the missing-heading checks
  from v2 are kept.

## 3.9 SEO and metadata

- **Per-route metadata.** Titles, descriptions, canonical URLs and Open Graph images for `/`,
  `/backend`, `/infrastructure`, `/projects` and each case study.
- **Sitemap.** Adds the two mode routes.

**As built in P9.** The sitemap lists `/backend` and `/infrastructure`, and each mode route
has its own Open Graph card: its hero's eyebrow, heading, and description, with the site's card
as the fallback. The cards share one renderer, which reads its palette from the stylesheet.
Two items waited on the résumés (D6): the `/resume.pdf` redirect, tied to moving the file to
`/resume/backend.pdf`, which D6 made unnecessary on 2026-11-21 (see 3.1); and
per-route titles and descriptions already existed from P4.
- **Unchanged.** Robots. Canonical URLs keep coming from `SITE_URL` (`src/lib/environment.ts`).

---

# 4. Decisions required before coding

Each one changes a ledger entry, a design document or a governance rule, so each needs Randi's
explicit yes.

| # | Decision | Recommendation | Effect |
|---|---|---|---|
| D1 | Public positioning | "Software Engineer · Backend & Infrastructure" as positioning, as in the approved mockup. Formal titles stay unchanged in the timeline | Supersedes SUP-002 (recorded as SUP-010). Target roles (SUP-003) are not part of it: they are Randi's job-search intent, still to be confirmed |
| D2 | Routes | Adopt 3.1, including the `/resume.pdf` redirect | Extends DEC-024 |
| D3 | Homepage structure | The V3.1 Overall order | Supersedes SUP-005 |
| D4 | Client boundary | The six components in 3.2. The header and footer stay Server Components | Amends Technical Design §13.4, which allows only `MobileNavigation` and "no homepage-wide client state" |
| D5 | Delivery strategy | Integration branch, named `staging` at Randi's request for a pre-production environment (section 6, option B) | Amends the Mandatory Branch Rule in `CLAUDE.md` and `git-workflow.md` §2 |
| D6 | Résumé publication | Publish both only after two things: (a) the backend résumé shows Backend Developer ending Jul 2026, and (b) Randi approves the phone number being public or supplies versions without it. **Decided 2026-11-21:** the v2 PDF, as it is, is the only résumé; the phone number stays public; no infrastructure PDF | Changes FAC-RESUME-004 |
| D7 | Project overviews | Six résumé projects as overviews under the general titles. None becomes a case study without its own approval | New |
| D8 | Display typeface | Geist only (the mockup default) | Supersedes DEC-050; extends DEC-051 |
| D9 | Skill classification | **Decided 2026-11-19: Docker, Linux, Jenkins and AWS are professional experience.** SUP-008 had deliberately kept Docker as currently-learning (confirmed 2026-08-16), although it was used professionally; the infrastructure role now centres on them | Supersedes SUP-008 (SUP-018) |
| D10 | AI section | Retire it. AI-assisted practice appears in the engineering approach and in the AI-assisted development project | Retires SUP-007 and SUP-009, which both govern the AI section |
| D11 | Location wording | "Sleman, Yogyakarta, Indonesia", as in the experience records and on both résumés | Supersedes DEC-013 ("Yogyakarta, Indonesia") |
| D12 | Company name spelling | **Decided 2026-11-19: "Zettabyte Pte Ltd"**, as on his résumés. The site's "ZettaByte" is corrected in the content phase | DEC-063 |
| D13 | Target roles | **Decided 2026-11-19: remove the list** from the page, with the field, in the content phase | Supersedes SUP-003 (SUP-017) |

---

# 5. Owner inputs

| # | Input | Blocks | Until then |
|---|---|---|---|
| I1 | The photograph | Release (P11) | **Supplied 2026-11-21**: a larger version of the v2 portrait (OPEN-010) |
| I2 | An updated backend résumé (role dates) and the publication decision (D6) | Live résumé links | **Decided 2026-11-21** (D6): the v2 PDF as it is, so the Résumé menu lists the backend résumé alone |
| I3 | Approval of the general project titles and of the level of AWS and Jenkins detail | Publishing the overviews | **Detail level decided 2026-11-19** (DEC-064). The titles are working titles (OPEN-011), so the overviews stay Draft |
| I4 | Approval of the proposed wording: profile statement, engineering headline, transition sentence | Publishing those sections | **Approved 2026-11-19** |
| I5 | Optional: for each infrastructure item, what the team owned and how the result was verified | Richer infrastructure copy | Résumé wording only |
| I6 | Optional: learning topics actually being studied | A learning section | Section omitted |

**V3-GATE-006** asks for the final mockups *and content* to be approved before coding. The mockup
was approved on 2026-11-18; I3 and I4 are the content part of that gate.

This plan lets structural phases start before I3 and I4 arrive, keeping the affected content Draft.
If Randi prefers the gate's literal order, P2 waits for I3 and I4.

---

# 6. Delivery strategy

V2 shipped as small pull requests straight to `production`, each improving the live site. V3
replaces the whole presentation, so the same approach would leave a half-old, half-new site live
between merges.

| Option | How | For | Against |
|---|---|---|---|
| **B (chosen): integration branch `staging`** | Task branches open pull requests into `staging`, and CI runs on them. Vercel deploys `staging` as a Preview at its stable branch URL, behind Vercel login and marked noindex. One promotion pull request goes from `staging` to `production` | Production stays untouched until Randi promotes. Every phase is reviewed and previewed. One cut-over and one revert point | Needed a governance amendment: `production` was "the only long-lived and production branch" (`CLAUDE.md`), and `git-workflow.md` §2 had no other permanent branch. `ci.yml` must also run on pull requests into `staging`. Production changes must be merged into `staging` as they land |
| C: build flag on production | Phase pull requests go straight to `production`. V3 is built behind a build-time flag that is on for Vercel previews and off for the production deployment, until a final pull request turns it on | Branch rules unchanged; every pull request small | Two designs coexist in the code for weeks. CI has to test both, roughly doubling end-to-end time. A cleanup pull request removes the flag and v2 afterwards |

**How option B runs**

Randi asked on 2026-11-18 that production not be disturbed for now, so nothing goes to
`production` first: P0 and P1 also land on `staging`.

1. **`staging` created.** Cut from `production` at `25a31d5` on 2026-11-18. The first pull request
   into it (`chore/staging-environment`) carries the governance amendment and the `ci.yml` change.
   Until that merges, pull requests into `staging` run no CI.
2. **Phase merges.** Task branches start from `staging`. Randi squash-merges each one into it, as
   today.
3. **Syncing production.** When `production` changes (a security or Dependabot fix):
   - merge `origin/production` into `staging` locally;
   - run the full gate, then push;
   - never rebase `staging`, because it is shared.

   This is the merge-from-production route that `git-workflow.md` §10 already allows. It is not
   done through a pull request: merge commits are disabled on GitHub, and a squash would leave
   `staging` permanently behind `production` and repeat production's changes in the final diff.
4. **Protection.** A `Protect staging` ruleset restricting deletion and force pushes. This is a
   repository-settings change, so it is Randi's to make, and it must exist before the first
   promotion: otherwise automatic head-branch deletion removes `staging` when that merges.
5. **Promotion.** `staging → production` is synced first, passes the full gate and
   `release:check`, and Randi merges it. The squash makes the release one commit on `production`.
   Afterwards, `production` is merged back into `staging`. Randi can promote at any point, for
   example after P0 alone if he wants the corrected role live before V3 is finished.

Every phase pull request runs the full gate, and Randi merges each one.

---

# 7. Phases

Every phase ends the same way:
- `npm run check` and `npm run test:e2e` pass locally, never run concurrently;
- `quality` and `e2e` pass in CI;
- the Vercel preview is reviewed;
- **Randi merges**.

Sizes are relative: S, M, L.

| Phase | Goal | Main files | Size | Depends on |
|---|---|---|---|---|
| **P0** | Correct the content, on the v2 design. Starts with a baseline `release:check` on `25a31d5`, which had not been re-run since #98 | `experience.ts` (new current role, Backend Developer ends Jul 2026); `profile.ts` (present-tense title and summaries; remove `availabilityStatement` and the "open to backend and …" clause); `resume.ts` note; the schema; the hero, contact and Open Graph components; their tests; FAC-PROFILE-001; ledger SUP-010 and SUP-011 | S | D1. Targets `staging`; reaches the live site at the first promotion |
| **P1** | Record decisions and specs | Decision ledger (DEC-056 to DEC-063, SUP-012 to SUP-017, OPEN-008 to OPEN-010); Technical Design §13.4; `docs/product/PORTFOLIO_V3_REQUIREMENTS.md` (the reference generalized, by Randi's decision); `docs/product/PORTFOLIO_UX_UI_SPEC_v3.0.md`; this plan; `.gitignore` for the local mockups. The mockup is not committed, by his decision. The governance amendment and `ci.yml` went ahead separately, as the first pull request into `staging` | M | Decisions. Targets `staging` |
| **P2** | Content model and content; additions only, so nothing the v2 site renders is removed, with two exceptions decided on 2026-11-19 and applied here: company spelling "Zettabyte" (DEC-063) and the target-roles list removed (SUP-017) | `src/domain/content/{types,schemas,define,validation,release-validation,selectors}.ts`; new `src/content/{career,modes,education,certifications,languages,practices}.ts`; project overviews; résumé variants; tests | L | P1 |
| **P3** | Design system | `src/domain/design/{tokens,contrast}.ts`, `globals.css`, fonts in `app/layout.tsx`; contrast and typography tests | M | P1 |
| **P4** | Global chrome and the route skeleton | `ModeSwitch`, `ResumeMenu`, footer with `CopyEmail`; `/backend` and `/infrastructure` showing their intros; mobile navigation removed. The `(modes)` group and the persistent hero moved to P5: before the Overall page is rebuilt, `/` would show two heroes | M | P2, P3 |
| **P5** | Overall page | The `(modes)` route group with the persistent `ModeHero`, and scroll and focus verified for every entry path; then profile, focus, career (stacked first), selected work, engineering approach, education, explore. Removes the v2 homepage sections and `ai-practices` | L | P4 |
| **P6** | Backend and Infrastructure pages | Both pages from the mode selectors; experience highlights by discipline; toolkits | L | P5 |
| **P7** | Projects | Index with `ProjectFilter`; overview rows; case-study restyle; related and back links | M | P4 |
| **P8** | Motion | `ModeHero` transitions; `CareerJourney` pinning and arrows; pointer light; entrance and reveal; the view-transition spike | M | P5, P6 |
| **P9** | Metadata | Per-route metadata, Open Graph images, sitemap, `/resume.pdf` redirect | S | P6, P7 |
| **P10** | Hardening | Accessibility, responsive widths, Lighthouse on the preview, cross-browser review, link check | M | P8, P9 |
| **P11** | Release | Sync; README and release audit; `release:check`; the promotion pull request `staging → production`; post-deploy verification on the live URL; sync back into `staging` | S | P10, I1–I4 |

P0 leaves one known gap: until I2 arrives, the published backend résumé still lists Backend
Developer as "Present". On 2026-11-21 Randi decided to keep that PDF as it is (D6), so the
gap stays, by his decision.

---

**P10 as built.** Hardening done on `staging`:

- the header is one row at 390 px and wraps at 360 px (UX3 5): the mode labels had
  the eyebrow's tracking, 0.2em, where the mockup has 0.05em;
- the header's measured height is published as `--hdr`, so anchors clear it when it wraps;
- the mode pill moves (V3-NAV-003), which P8 had left out;
- the hero shows a photograph when one is set, and release validation refuses the
  placeholder (OPEN-010);
- the link check passes, with two links for a human, as before.

Not done in P10, and why:

- **Lighthouse on the Vercel preview.** The preview is behind Vercel login, and Lighthouse is
  not installed in this repository; adding a dependency for it was out of scope. It is a
  release-time measurement (section 8, "Measured on the Vercel preview"), for P11.
- **A manual cross-browser review.** The end-to-end suite runs in all three engines; a
  human look on real devices belongs with the preview review at P11.

# 8. Test strategy

**Unit and content tests (Vitest)**

- Schemas for every new record type. `availabilityStatement` is gone from the profile schema.
- Each new cross-record rule (3.4) gets a test that breaks the rule and confirms validation fails.
- Selectors per mode: ordering, discipline filtering, featured work and toolkit groups.
- Release validation rejects:
  - the photo placeholder;
  - Draft wording on published sections;
  - a résumé link without a published variant.
- `generateStaticParams` returns case studies only; overviews never get a route.

**Component tests (Testing Library)**

- `ModeSwitch`: `aria-current` follows the pathname.
- `ResumeMenu`: arrow keys move between items; only published variants are listed; the current
  page's résumé is marked.
- `CareerJourney`: renders stacked and complete without the pinned class.
- `ProjectFilter`: reads and writes `?discipline=`; unknown values fall back to all.

**End-to-end tests (Playwright, three engines)**

- Direct entry, refresh, back and forward on every route.
- Mode change:
  - URL, heading, focus and title update;
  - switching from mid-page, and arriving from `/projects`, both land at the top with focus on the
    new `h1`;
  - five rapid switches end in a consistent state;
  - no full-screen element is left behind.
- Résumé menu: opens; Escape and outside click close it; focus returns to the button, in each
  engine.
- Reduced motion: instant switch, no pinning, no pointer light. Touch: no pointer light.
- JavaScript disabled: every route renders, and mode links and the Résumé menu work.
- No horizontal scroll at 320, 360, 390, 768, 1024 and 1440 px on every route.
- The projects filter survives a visit to a case study and Back.
- Overviews are not links. An overview slug and an unknown slug return the same not-found result.
- axe on every route in both motion modes; header contrast over light sections.
- The v2 tests that assert the old homepage structure are rewritten, not silently deleted. Each
  pull request lists its rewrites.

**Measured on the Vercel preview and recorded in the release audit:** Lighthouse mobile for the
five page types, and bundle sizes per route.

---

# 9. Documentation and governance

- **Decision ledger.**
  - D1–D13, with the superseded IDs marked: SUP-010 and SUP-011 in P0, the rest in P1.
  - The consequences of the mockup approval itself: DEC-049 superseded (five surfaces, SUP-016)
    and DEC-053 extended (mode-transition timings, DEC-062).
- **Technical Design §13.4** amended (D4). The Mandatory Branch Rule and `git-workflow.md` §2
  were amended in #100 (D5).
- **New documents:** V3 requirements (with the design reference generalized), UX/UI
  specification v3.0, and this plan.
- **Updated documents:**
  - `architecture.md`: route group, client components, content model.
  - `content-authoring.md`: new record types, overviews, discipline tags.
  - `README.md`: Version 3 at release. The existing status-accuracy test checks it against the
    newest release-audit heading.
  - `release-audit.md`: an entry for the release.
- **Confidentiality:**
  - The V3.1 brief names internal applications and must never be committed. Both V3 briefs and
    the unedited requirements were moved to `planning/design/` on 2026-11-19, outside the
    repository. The local mockups in `docs/design/v3/` are ignored by git.
  - Published copy uses only the general project titles.
  - No phone number appears on any page.

---

# 10. Risks

| Risk | Mitigation |
|---|---|
| `staging` drifts from `production` | Merge `production` into `staging` after every production change; keep phase pull requests small |
| Next.js scroll and focus defaults conflict with the persistent hero | `ModeHero` owns scroll and focus, and wraps the page so its reset runs after the router's (P5). Verified for every entry path in `e2e/mode-change.spec.ts` before motion is added |
| Client JavaScript grows | Six components only; bundle sizes recorded at each phase |
| Content approvals lag behind code | Unapproved content stays Draft; release validation blocks shipping it |
| Internal names or the phone number leak | Briefs kept out of git; review of every content pull request; résumés published only on approval |
| Pinned scrolling misbehaves in some browsers | Pinning only at 900 px and wider with motion allowed; WebKit and Firefox in the end-to-end tests; stacked fallback elsewhere |
| Contrast margins are tight | The contrast gate runs on every token change; the darker blue is used for text where needed |
| Old tests encode the v2 structure | Rewrites listed and justified in each pull request |

---

# 11. Requirements traceability

| Criterion | Built in | Verified by |
|---|---|---|
| V3-NAV-001 modes reachable from the header; NAV-002 a real URL per mode; NAV-005 a stable header | P4 | End-to-end tests |
| V3-NAV-003 the indicator transitions; NAV-004 the hero transforms; NAV-006 cinematic but non-blocking | P8 | End-to-end tests: rapid switching, input during a transition |
| V3-NAV-007 direct entry, refresh, back and forward work | P4, P8 | End-to-end tests on every route |
| V3-NAV-008 working project and case-study links | P7 | End-to-end tests |
| V3-NAV-009 contact and résumé easy to reach; NAV-010 mobile mode switching without extra steps | P4 | End-to-end tests at 320–390 px |
| V3-MOT-001 opening resolves into the hero; MOT-002 meaningful career transitions; MOT-003 coherent backward scrolling | P8 | End-to-end tests; preview review |
| V3-MOT-004 no dependence on pinning on mobile; MOT-005 reduced motion keeps every function; MOT-006 animation failure blocks nothing; MOT-007 no scroll hijacking | P5 (stacked default), P8 | End-to-end tests in reduced motion and with JavaScript disabled |
| V3-CONT-001 Overall tells the whole journey; CONT-008 an onward path on every page | P5–P7 | Content review; end-to-end tests |
| V3-CONT-002 Backend shows verified experience | P6 | Review against the résumé |
| V3-CONT-003 every hero names the engineer, focus and next action | P2 (the `modeIntro` schema requires all three) | Schema tests |
| V3-CONT-004 consistent facts across modes | P2 (one record per fact, read through selectors) | Selector tests |
| V3-CONT-005 learning not confused with experience | P2 (D9) | Schema tests |
| V3-CONT-006 no fabricated metrics, statuses or confidential details | Every content pull request | Review; release validation |
| V3-CONT-007 concise, human introductions | I4 | Randi's approval |
| V3-DES-003 signature blue in every mode; DES-005 CTAs discoverable without animation; DES-007 original design, nothing taken from the reference's assets or branding | P3, P5–P8 | Contrast gate; reduced-motion tests; review |
| V3-DES-001, 002, 004, 006 | Mockup-stage criteria, covered by the approved mockup. DES-006's alternatives are implemented in P8 | — |
| V3-GATE-001 to 005 | Mockup-stage gates; not implementation work | — |
| V3-GATE-006 mockups and content approved before coding | Section 5 | Unapproved content stays Draft |

---

# 12. Rollback

The release is one squash commit on `production`. Both recovery routes have been exercised on this
site (`docs/release-checklist.md` §10):

- **Hosting.** Promote the previous deployment in Vercel. Drilled 2026-08-10.
- **Source.** A `git revert` pull request. The 2026-08-17 rehearsal measured about seven minutes
  from push and thirteen from decision.

---

# 13. Out of scope

- CMS, database, backend API and contact form.
- Analytics and internationalisation.
- A light/dark theme toggle.
- GSAP or any animation library.
- Any change of framework.
