# Portfolio V2 Analysis

**Document type:** V2 design analysis (PRD §76)
**Status:** Superseded by delivery. Written 2026-08-12 as the pre-implementation
analysis; v2 shipped across thirteen phase pull requests and closed on 2026-08-16.
The specification it defers to is `PORTFOLIO_UX_UI_SPEC_v2.0.md`, and the outcome
is the 2026-08-16 entry in `release-audit.md`.
**Baseline commit:** `8b26b8a` on `production`
**Date:** 2026-08-12

> The header previously read *"For review. No specification and no implementation
> code exists yet"* — true when written, false from the moment the specification
> landed. Corrected 2026-08-25. Everything below is deliberately unchanged: the
> body is a record of what was known on 2026-08-12, including seven conflicts and
> a set of open questions, and rewriting it would destroy the thing it is for.
> Only the status line made a claim about the present.

This is the first of the two artifacts PRD §75 requires before any V2 code is
written. It ends at a decision gate: §27 lists what needs Randi's answer, and the
UX/UI specification is deliberately **not** in this document.

§75 orders *"29. Identify conflicts"* before *"31. Create specification."* Seven
conflicts are recorded in §22 and §24. Several change what the specification should
say, which is why the specification waits.

---

## 1. Current Production State

Live at `https://developer-portfolio-delta-three.vercel.app`, deployed from
`production` on Vercel. Public repository, ruleset-protected, no bypass actors.

**Baseline verification, run on this branch. Output observed, not recalled:**

```text
npm run check      exit 0    Test Files 28 passed (28)    Tests 408 passed (408)
npm run test:e2e   exit 0    149 passed, 1 skipped (2.6m)
```

The one skip is a documented WebKit platform default on skip-link focus.

**Content, counted from the modules rather than from the handoff:**

| Type | Records | Published |
|---|---:|---:|
| Profile | 1 | 1 |
| Work experience | 3 | 3 |
| Project case studies | 2 | 2 |
| Technical skills | 12 | 12 |
| AI practices | 4 | 4 |
| Resume | 1 | 1 (active) |

Routes: `/`, `/projects`, `/projects/[slug]` (2 static), `/resume.pdf`, Not Found,
plus `sitemap.xml`, `robots.txt`, `icon`, `opengraph-image`.

Stack: Next 16.3.0, React 19.2.8, TypeScript 6.0.3, Tailwind 4.3.3, Zod 4.4.3,
Vitest 4.1.10, Playwright 1.62.1, ESLint 9.39.5. Exact pins, no caret ranges.
TypeScript is held below 7 and ESLint below 10 by deliberate `dependabot.yml`
ceilings; both blockers are upstream and documented.

Measured section heights at 1280px, which the surface design in §5 depends on:

| Section | Height | Share | Background |
|---|---:|---:|---|
| About | 528px | 9.3% | — |
| Work Experience | 2079px | 36.6% | muted |
| Selected Projects | 734px | 12.9% | — |
| Technical Skills | 656px | 11.5% | — |
| AI-Assisted Engineering | 1134px | 20.0% | — |
| Contact | 552px | 9.7% | — |

Baseline screenshots: `docs/design/v2/baseline/` (4 files, 1.5 MB).

> **On the screenshot set.** PRD §64 lists six widths, but that is a *manual QA*
> checklist rather than a committed-artifact requirement. This repository can never
> rewrite history, so anything committed here is permanent; the full six-width sweep
> came to 7.9 MB as PNG and 4.7 MB as JPEG. Four representative captures at 1.5 MB
> are committed instead. They exist because once V2 deploys, the live site stops
> being the V1 baseline — until then the live site remains authoritative.

---

## 2. V1 / V1.1 Strengths to Preserve

These are not stylistic preferences. Each has a requirement ID, a test, and usually
a defect in the history that caused it to exist.

- **The selector layer is the only path from content to pages**, enforced by a lint
  rule (`no-restricted-imports`, scoped to `src/app/**` and `src/components/**`).
  That boundary is what makes the confidentiality guarantee structural rather than
  remembered. If a component needs data a selector does not expose, extend the
  selector — do not add a carve-out.
- **An unpublished project has no route.** `dynamicParams = false` plus
  `generateStaticParams()`; unknown and unpublished slugs return byte-identical
  responses (DEC-047, FAC-NAV-006), asserted end to end.
- **Exactly one Client Component.** `MobileNavigation` is the entire client-side
  JavaScript surface. Verified during this analysis: the only other file matching
  `"use client"` is a comment in `header.tsx` explaining why the header deliberately
  is not one.
- **Empty sections omit themselves entirely** (FAC-HOME-005) — not a heading with
  nothing under it.
- **Responsibility separation** renders personal and team work as visually distinct
  blocks (FAC-PROJECT-003).
- **`deliveryStatus` describes reality**; `production` requires a verified
  `productionConfirmation`.
- **Indexing is derived, not hardcoded.** `isPubliclyLaunchReady()` drives both
  `robots.txt` and the `robots` meta tag.
- **The axe gate blocks on critical and serious findings plus an always-blocking
  set** — `page-has-heading-one`, `heading-order`, `landmark-one-main`,
  `html-has-lang`, `region` — because two routes once shipped with no `h1` and axe
  rates that as merely *moderate*.
- **V1.1's four new gates**: homepage section order, project card field order, the
  social card deriving from content, and corrected-assumption evidence. Each was
  added because an approved decision had nothing holding it in place.

---

## 3. V1.1 Residual Issues

PRD §13 lists five. Findings below; the questions they raise are in §27, and none is
resolved here.

**V2-P0-001 — Contact positioning.** Contact copy still offers "backend, full-stack,
and software engineering roles", which contradicts SUP-002/SUP-003. The PRD proposes
"Open to backend and software engineering opportunities." This is a claim about what
Randi is open to, in his voice — proposed, not adopted.

**V2-P0-002 — Hero CTA.** The hero leads with "View Projects" while the homepage now
leads with Experience (SUP-005). The PRD proposes "View Experience" primary, "View
Resume" secondary.

**V2-P0-003 — Docker.** Verified: `skill-docker` is classified `currently-learning`
in `infrastructure-and-deployment`, and it is listed under the **current** role
(`Backend Developer`, ZettaByte Pte Ltd, `isCurrent: true`, from 2025-04-01) at
`src/content/experience.ts:63`. The PRD is explicit that this may be correct —
using a technology professionally does not make it an independent strong working
skill. **No change proposed.** Question in §27.

**V2-P0-004 — AI tool modelling.** Verified: the About summary names three tools
(`profile.ts:57` — "Codex, Claude Code, and ChatGPT"), while all four AI practice
records carry `toolName: "Claude Code"`. So the workflow models one tool and the
prose names three. The PRD forbids remodelling for visual symmetry. **No change
proposed.** Question in §27.

**V2-P0-005 — Projects Index layout.** With two projects the index grid is
`md:grid-cols-2 lg:grid-cols-3`, which leaves a visibly empty third column at large
widths. The homepage section already solves this (`projects.length === 2 ?
"md:grid-cols-2" : …`). The index should become count-aware the same way.

---

## 4. Aston Martin Reference Analysis

The reference is `astonmartinf1.com`, and PRD §9 is unambiguous that it is a
design-principle reference, not a template: *"not: Aston Martin F1 with MongoDB
replacing Fernando Alonso."*

### Principles to Adapt

- Editorial composition over uniform card grids — hierarchy from typography,
  spacing, rules and surface changes rather than from containers
- High-contrast typographic hierarchy, with a display face carrying the largest
  statements
- Confident full-width sections with deliberate surface alternation
- Featured-story prioritisation: one thing leads, the rest support
- Large negative space and a visible vertical rhythm
- Concise metadata lines and short, concrete CTAs
- Controlled motion that signals state and hierarchy

### Elements Not to Copy

Aston Martin green as identity, the logo, any Formula One branding, car/driver/racing
imagery, the exact typography or proprietary fonts, the exact palette, composition,
navigation, animation, CTA wording, or graphic motifs.

**The adaptation risk worth naming:** the reference sells spectacle; this portfolio
sells verifiable evidence. Where the two pull apart, V2-DP-001 governs — evidence
before decoration. A motorsport-styled portfolio that buries the Experience section
would be a worse recruiting document than what is live today, however striking it
looked.

---

## 5. Proposed V2 Design Direction

**Performance Engineering** — the PRD's own name for Aston Martin's editorial
composition combined with V1's Quiet Engineering discipline. It should read as
engineering precision, deliberate decisions, and calm technical confidence.

Concretely, the direction rests on three moves:

1. **Surface alternation instead of a single light theme.** Three surfaces —
   `light`, `neutral`, `dark` — assigned per section, giving the page rhythm without
   a theme switcher (which §15 explicitly defers).
2. **Typography as the primary hierarchy device.** A display face for statements, a
   body face for reading, and a tokenised responsive scale replacing the raw
   utilities scattered across 22 files today.
3. **Fewer containers.** §20 asks for fewer cards; hierarchy should come from type,
   space, rule and surface.

---

## 6. Information Architecture

Unchanged from V1.1, and §26 explicitly reaffirms it:

```text
Navigation · Hero · About · Work Experience · Selected Work
Technical Skills · Engineering Workflow · Contact · Footer
```

> §26: *"Do not move Projects above Experience without a new product decision."*

That matches SUP-005 and is already asserted by `homepage-order.test.tsx`. Routes are
unchanged: no new pages, no filters (§52 forbids filters at two projects), no blog.

---

## 7. Homepage Design

Hero as a dark opening statement carrying name, backend identity, a one-line
positioning statement, location/availability and two CTAs — realigned to lead with
Experience per V2-P0-002. About as a light reading section. Work Experience as the
weighted centrepiece: it is already 36.6% of the page and it should stay the largest
thing. Selected Work as editorial modules rather than a uniform card pair. Skills
light and scannable. Engineering Workflow compact. Contact as a strong dark closing
section.

Surface assignment per section is a §27 decision, not settled here.

---

## 8. Experience Design

The most important section on the page, and currently the plainest. §29 asks for
employer grouping and visible progression.

The content supports this without any schema change: three roles at one employer
(ZettaByte Pte Ltd) forming Internship → Contract → Full-time. Grouping them under a
single employer block makes the progression legible instead of leaving the reader to
infer it from three repeated company names. Current role gets emphasis; earlier roles
compress.

---

## 9. Selected Work Design

Two projects, presented as **editorial modules rather than identical cards** (§20,
§30) — one professional, one personal, each getting a composition rather than a slot
in a grid. §32's required fields are unchanged from SUP-006.

---

## 10. Projects Index Design

Count-aware composition (V2-P0-005). With two projects the layout must look
deliberate rather than like a grid missing its third item — the same fix the homepage
already applies. No filters or search (§52, and an `<input>` would break the
no-form assertion).

---

## 11. Project Detail Design

The largest redesign (§33). Two layers:

- **Layer A, fast scan** — role, status, period, stack, problem and outcome legible
  in seconds
- **Layer B, deep dive** — the existing fifteen-section case study, unchanged in
  substance

Responsibility separation survives the redesign intact (§38, FAC-PROJECT-003). This
route is also currently **not scanned by axe** — see §18.

---

## 12. Project Visual Strategy

§31 permits sanitised diagrams and forbids internal screenshots. Diagrams are the
only safe route to a more visual professional case study, and they must be authored
as public artifacts from the start rather than sanitised after the fact.

Whether this needs a schema field (a diagram reference or caption) is a §27 decision
gated by §51's six questions. **No field is proposed in this document.**

---

## 13. Skills Design

Grouped presentation with evidence labels (§39). The hard constraint: FAC-SKILL-003
forbids percentages, progress bars and star ratings, and this is asserted by tests
checking for `progress`, `meter`, `[role=progressbar]` and `\d+\s*%`.

**Worth flagging for the specification:** those assertions would *not* catch a dot
scale, a segmented bar, or a signal-strength glyph built from plain `<span>`s. Such a
design would violate FAC-SKILL-003 while passing the suite. The specification should
forbid any graphical proficiency indicator explicitly rather than relying on the
current assertions.

---

## 14. Engineering Workflow Design

Compact presentation (§40), preserving human responsibility, verification method,
corrected-assumption evidence and the truthful tool disclosure. AI stays supporting
evidence (V2-DP-006). Its visual weight is constrained by SUP-007 — see §22.

---

## 15. Contact / Footer Design

Contact as the strong dark closing section, backend-first per V2-P0-001. No form, no
endpoint (FAC-CONTACT-005, and an `<input>` breaks an existing assertion). Footer
compact: identity, year, email, LinkedIn, GitHub, back to top.

---

## 16. Design System

### Color

Direction from §16: near-black/charcoal, off-white, cool grey, slate, cobalt accent,
plus accessible green/amber/red. Exact values are specification work.

**One value is already decided by measurement rather than taste.** Using the same
relative-luminance method that reproduces both of V1's recorded contrast failures:

| Pair | Ratio | |
|---|---:|---|
| old `#64748B` on `#F1F5F9` | 4.34 | reproduces the recorded V1 failure |
| current `#5B6A7D` on `#F1F5F9` | 5.04 | reproduces the recorded V1 fix |
| **accent `#2563EB` on near-black `#0B0F14`** | **3.72** | **fails AA** |
| accent `#2563EB` on `#F1F5F9` | 4.72 | passes by 5% — live today, see §24 |
| accent-hover `#1D4ED8` on `#F1F5F9` | 6.12 | |
| off-white `#F8FAFC` on near-black `#0B0F14` | 18.37 | |

The method is validated by reproducing 4.34 and 5.04 exactly, which are the two
values recorded in `globals.css` and the V1 history.

**Consequence: the V1 accent cannot carry text on dark surfaces.** Decision taken —
two accents, one per surface: `#2563EB` retained on light so §16's V1 continuity is
kept where V1 lives, and a brighter cobalt, measured, for dark.

### Typography

Two roles (§17): a display face for hero, section statements and project titles; a
body face for reading, where Geist may remain. Nine-step tokenised scale using
`clamp()` (§18): hero, section, page, project, card, lead, body, metadata, eyebrow.

Two constraints for the specification: every `clamp()` preferred value must include a
`rem` term, because a pure `vw` value breaks 200% browser zoom, which §65 requires QA
on; and uppercase must come from `text-transform`, never from authored strings, since
some screen readers spell out authored uppercase. The current code already does the
latter correctly.

The display face is a §27 decision to be taken from rendered specimens, not prose.

### Grid

12-column editorial desktop, single-column mobile, deliberately designed tablet
compositions (§19). Container stays near 1200px (`--spacing-content`, 75rem today);
long-form prose stays narrower (`--spacing-prose`, 48rem).

### Spacing

The 8-point scale continues. Section rhythm becomes a property of a shared section
primitive rather than repeated per component.

### Surface

Three surfaces as `[data-surface]` CSS-variable overrides in `@layer base`, with
every token still declared in `@theme static`.

Verified during this analysis: Tailwind v4 compiles utilities to variable lookups —
`.bg-surface{background-color:var(--color-surface)}` — so overriding a token on an
ancestor reflows every descendant **with no component changes**. A project card
renders correctly on a dark Selected Work band and a light Projects Index as the same
component with the same classes.

Three rules keep this from recreating the "seven of fourteen tokens vanished" bug in
a new shape: the override blocks must be in `@layer base`, not inside `@theme`; every
token must still be declared in `@theme static` even when only meaningful on dark;
and no surface may be selected by a dynamically built class name.

**A consequence to design for:** the 14 alpha colour modifiers in `src/` (counted)
compile to `color-mix(… transparent)` and therefore have no fixed colour. That is
precisely why V1's second contrast failure was invisible. They become solid
per-surface tokens, because a pair that cannot be measured cannot be gated.

### Components

Existing primitives largely survive; the additions are a section primitive owning
surface and rhythm, and editorial project modules. §20's "fewer cards" applies to
composition, not to dropping the `<article>` landmark.

### Motion

Restrained, communicating state and hierarchy only (§22, V2-DP-005). Motion becomes
duration tokens rather than ad-hoc transitions — see §18 for why the current
reduced-motion implementation is not sufficient for scroll-driven effects.

---

## 17. Responsive Strategy

Mobile single-column, tablet deliberately composed, desktop editorial grid. Existing
e2e assertions require zero horizontal overflow at 320px, which is below the smallest
width in §64's list and remains the binding constraint. Touch targets stay at 44px
minimum (NFAC-RESP-004).

---

## 18. Accessibility Strategy

WCAG 2.2 AA, with accessibility designed in rather than cleaned up afterwards
(V2-DP-008). The axe gate is retained unchanged, including its always-blocking rule
set. Thresholds are not weakened to make V2 pass (§62).

Three gaps found during this analysis, each proposed for closure during V2:

1. **The project detail route is not scanned by axe at all.** It is the page getting
   the largest redesign. Real coverage gap, independent of V2.
2. **No reduced-motion test exists**, although §62 says to *maintain* them. There is
   nothing to maintain.
3. **The current reduced-motion block cannot neutralise scroll-driven animation.** It
   sets `animation-duration: 0.01ms`, but `animation-timeline: view()` is driven by
   scroll progress, not time. If §22's section reveals are built that way, the user's
   preference is silently ignored. Entrance effects must also never leave an element
   at `opacity: 0` as its resting state.

Contrast is addressed by a gate rather than by care — see §22.

---

## 19. Performance Strategy

Targets unchanged: LCP ≤ 2.5s, CLS < 0.1, INP < 200ms (§46.1). Current CLS is 0.005
and Lighthouse performance 97–98.

Two specific risks a display face introduces: font payload, and CLS on the hero `h1`,
which is the LCP element. `next/font` self-hosts and generates a metric-adjusted
fallback; that must stay on, and CLS/LCP must be **re-measured against the 0.005
baseline** rather than assumed. Measure warm and more than once — a V1 cold-deploy
reading of 92/LCP 2.5s was recorded as a risk and re-measured at 97/LCP 1.6s.

---

## 20. Architecture Impact

None to the content pipeline. V2 is a presentation-layer evolution: typed content →
Zod → cross-record validation → selectors → Server Components → static pages is
preserved exactly (§48, §49).

One addition: a `src/domain/design/` module for contrast calculation — pure
functions, no content coupling, following the existing
`link-validation.ts` + `check-links.ts` split.

The single-Client-Component property is preserved. **Decision taken:** §24.2's
active-section indicator is deliberately deferred rather than delivered, because it
would require either a second client component or a Chromium-only CSS scroll-timeline
that silently does nothing in Firefox. Recorded as a deferral with its
reason, not dropped silently.

> **Corrected in Phase 2c.** This said "Firefox and WebKit". Measured across all
> three engines: Chromium and WebKit both support `animation-timeline`; only
> Firefox does not. The decision stands — a feature missing in one major engine
> is still a silent gap — but the reason as written overstated it.

---

## 21. Content Model Impact

**None proposed in this document.** §51 allows schema change only where a real
content requirement exists, behind six questions. The one plausible candidate is a
sanitised project diagram reference (§12), and it goes to §27 rather than being
assumed.

One inherited item: V1.1 deferred renaming `remoteAvailability` to V2. It now holds
"Open to opportunities", so the field name is misleading. It touches schema,
selectors, components and tests for no reader-visible gain — worth doing during a
release that is already touching those files, but it is a change with no user-facing
benefit and should be scheduled deliberately.

---

## 22. Testing Impact

The suite is deliberately brittle so that changes are reviewed diffs. Three buckets.

**Update — the decision holds, the expression changed.** Class-string assertions
(`min-h-11`, `min-w-11`, `overflow-x-auto`); the `.closest("article")` card-root
assumption; the exact `h3` count in `ProjectResponsibility`. Several of these are
better expressed differently — a touch-target assertion measured in a real browser
tests NFAC-RESP-004 far better than a class-name substring can, since jsdom has no
layout.

**Keep — they constrain the implementation.** `homepage-order.test.tsx` and its
`[id]` sequence scan; `homepage-section-omission.test.tsx` (which means the surface
wrapper must live *inside* each section's null guard, or an empty section leaves an
empty coloured band); and the focus-outline assertion. On that last one: the
specification should keep `outline` rather than moving to `box-shadow`, because
outline survives Windows High Contrast / forced-colors mode where box-shadow
disappears entirely. The test is right and the design accommodates it.

**Do not change without Randi.** SUP-005 homepage order, SUP-006 card field order and
the literal "My role:" label, the FAC-SKILL-003 absence assertions, FAC-PROJECT-003,
FAC-PROJECT-004, and the no-form assertions.

**Proposed additions:** a contrast matrix test running in `quality` on every PR
rather than waiting for axe in `e2e`; a reduced-motion e2e test; the project detail
route added to the axe page list; and — at Phase 9, not earlier — a small visual
regression set. Added during the redesign, snapshots would change in every PR and
train everyone to accept them unread, which is worse than not having them.

The contrast test's own fixtures should be the historical bugs: 4.34 and 4.31 must
fail, 5.04 and 5.59 must pass. That is this repository's "break what it guards"
discipline applied to the tool doing the guarding.

---

## 23. Documentation Impact

New: `PORTFOLIO_UX_UI_SPEC_v2.0.md` (§77). Updated: architecture, content-authoring
if any schema changes, the decision ledger, and a release-audit entry at close.

**38 in-code `UX n.n` citations** (counted) will point at the wrong document once
v2.0 renumbers. The specification needs a v0.1 → v2.0 mapping table, implementation
PRs update citations in files they touch, and a sweep catches the remainder.

---

## 24. Risks

| # | Risk | Mitigation |
|---|---|---|
| R1 | **A third contrast failure.** Two have happened, both same-hue, both within 4% of passing, both caught by axe rather than by eye | Contrast gate in `quality`; solid tokens instead of alpha modifiers |
| R2 | **A latent failure already live.** Accent on the muted band measures 4.72:1 — passing, but axe does not scan hover states, and `footer.tsx:44,54,60` use `hover:text-accent` on exactly that surface | Include hover pairs in the matrix; this one is found, not hypothetical |
| R3 | **Token tree-shaking.** Seven of fourteen tokens vanished once when `static` was missing | Every token declared in `@theme static`; no dynamic class names |
| R4 | **CLS regression from the display face.** CLS is 0.005 and the hero `h1` is the LCP element | Keep `adjustFontFallback`; re-measure in Phase 9 against the recorded baseline |
| R5 | **Decoration outgrowing evidence.** The reference sells spectacle; this site sells verifiable claims | V2-DP-001; Experience stays the weighted centre |
| R6 | **A skills design that passes the tests and still violates FAC-SKILL-003** — dot scales and segmented bars are invisible to the current assertions | Specification forbids graphical proficiency indicators explicitly |
| R7 | **Reduced motion silently ignored** for scroll-driven effects | Motion duration tokens plus `animation-timeline: none`; add the missing test |
| R8 | **Scope creep into the content model** | §51's six questions; no field without approval |

---

## 25. Non-Goals

Per §52: no CMS, database, auth, accounts, admin, comments, newsletter, blog, chat,
chatbot, or contact API. No theme switcher (§15, explicitly deferred). No analytics.
No project filters at two projects. No fake metrics or invented scale. No Aston
Martin branding. No public private-source examples.

Added here: **no active-section navigation indicator** (§20 above), and **no content
model changes** unless approved under §51.

---

## 26. Implementation Phases

Session one is two PRs, this being the first:

| PR | Branch | Contents |
|---|---|---|
| 1 | `docs/v2-analysis` | This document and the baseline set. **STOP** for decisions |
| 2 | `design/portfolio-v2-spec` | `PORTFOLIO_UX_UI_SPEC_v2.0.md`, static mockups in `docs/design/v2/`, and a review packet framing §78's items as questions with pictures. **STOP** for the design gate |

Implementation then follows the PRD's phases 2–10 across roughly thirteen PRs. Two
choices worth stating now: **Phase 2 splits into three PRs**, because it is the only
phase touching every file and its first part — tokens, the surface mechanism and the
contrast gate — has *zero visual change* and can be reviewed on its logic alone; and
every PR must leave the site coherent, since `quality` and `e2e` gate each one.

---

## 27. Decisions Requiring Randi Approval

**Already taken in conversation, recorded here for the ledger:**

| # | Decision |
|---|---|
| D1 | **Two accents, one per surface.** Forced by measurement: `#2563EB` is 3.72:1 on near-black |
| D2 | **Analysis first, then the specification.** §75 orders conflict identification before specification |
| D3 | **No active-section indicator.** Keeps `MobileNavigation` as the only Client Component; §24.2 deferred with reason |
| D4 | **Static HTML mockups in `docs/design/v2/`** as the design-review artifact |

**Open — needed before the specification is written:**

| # | Question |
|---|---|
| Q1 | **Display typeface.** A wider grotesque reads as deliberate engineering; an editorial serif is a stronger statement and risks reading as a design affectation on a backend portfolio. To be decided from rendered specimens in PR 2, not from prose — flagged now so the specimens are the right ones |
| Q2 | **Surface assignment per section.** §14 recommends a composition and says it may change in review. Specifically: is Work Experience dark or neutral? |
| Q3 | **SUP-007 re-expression.** Its *decision* — "reduce prominence, not honesty" — still holds. Its *mechanism* — remove the emphasis background so exactly one section carries a band — is void when every section carries one. It needs restating in surface terms, and it currently has **no test at all** (verified). Guessing risks visually re-promoting a section deliberately demoted on 2026-08-12 |
| Q4 | **SUP-006 scope.** It fixed a *card's* field order. §32 lists the identical order for tiles, so the ordering is reaffirmed — the open part is whether the decision, and the literal "My role:" label, are intended to survive a change of format from card to editorial module |
| Q5 | **Internal contrast floor.** Proposal: fail anything between 4.5 and 4.8 rather than at WCAG's 4.5, because both historical failures were within 4% of passing. It will reject colours: accent on the muted band is 4.72 and would fail on day one |
| Q6 | **V2-P0-003 Docker.** Classified `currently-learning` while listed under the current role. Is that the intended distinction — used professionally, not yet claimed as an independent strong skill? |
| Q7 | **V2-P0-004 AI tools.** About names Codex, Claude Code and ChatGPT; all four practice records model Claude Code. Is Claude Code the deliberate representative tool, or should practices model multiple tools? |
| Q8 | **V2-P0-001 / V2-P0-002 wording.** The PRD proposes contact copy and hero CTA labels. Both are Randi's voice and one is an availability claim |
| Q9 | **Project diagrams and schema.** If sanitised diagrams need a content field, §51's six questions must be answered and the field approved before the specification assumes it |
| Q10 | **`remoteAvailability` rename.** V1.1 deferred it to V2. Worth doing while these files are open, or leave it? |

---

**Next step:** answers to Q1–Q10, then PR 2 — the UX/UI specification and mockups.
No implementation code before the design gate (§75).
