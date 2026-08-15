# Developer Portfolio — UX/UI Specification v2.0

**Status:** Proposed. Awaiting the PRD §78 design review gate.
**Supersedes:** `PORTFOLIO_UX_UI_SPEC_v0.1.md` for everything in scope below.
**Companion:** `PORTFOLIO_V2_ANALYSIS.md` carries the reasoning and the measurements;
this document carries the rules.

Nothing here is implemented. Approving this document is what unblocks Phase 2.

> **Citation note.** 38 in-code comments cite `UX n.n` against v0.1. This document
> uses the prefix **`UX2 n.n`** so the two are never confused. A mapping table is in
> §14. Implementation PRs update citations in the files they touch.

---

## 1. Visual Direction

**Performance Engineering** — editorial composition with engineering restraint.

The page should read as precision and deliberate decision-making. It must not read
as a motorsport site with a developer's content in it.

Governing principle, from PRD V2-DP-001: **evidence before decoration.** Where a
visual device competes with experience, responsibility, status, technology,
verification or outcome, the device loses.

### UX2 1.1 — What the design must never do

- Present AI practice with more visual weight than Work Experience or Selected Work
- Introduce any graphical proficiency indicator — **including dot scales, segmented
  bars and signal glyphs**, not only `progress`/`meter`/percentages
- Merge personal and team responsibility into one list
- Use colour as the only carrier of status meaning
- Leave any element at `opacity: 0` as its resting state

---

## 2. Colour

Three surfaces. No theme switcher (PRD §15).

Full token values are in `docs/design/v2/tokens.css`, which is the proposal
artifact — on approval its contents move into `src/app/globals.css`.

| Surface | Background | Primary text | Accent |
|---|---|---|---|
| `light` | `#F8FAFC` | `#0F172A` | `#2563EB` |
| `neutral` | `#EAEFF5` | `#0F172A` | `#1D4ED8` |
| `dark` | `#0B0F14` | `#F8FAFC` | `#60A5FA` |

### UX2 2.1 — Two accents, by measurement

The v1 accent `#2563EB` measures **3.72:1** on `#0B0F14` and cannot carry text
there. It is retained unchanged on light surfaces, preserving the v1 continuity
PRD §16 asks for. Dark surfaces use `#60A5FA` (7.56 on base, 6.89 on elevated).

`#3B82F6` was the first candidate and reached only **4.76** on the elevated dark
surface — under the floor, which is precisely the margin that caught v1 out twice.

### UX2 2.2 — Contrast floors

- **Text: 4.8:1.** Stricter than WCAG's 4.5 because both v1 failures were within 4%
  of passing (4.34 and 4.31) and both were invisible to review.
- **Non-text: 3.3:1, applied only to focus indicators and to borders that identify
  a control.** It is deliberately **not** applied to decorative card borders or
  badge tint fills. WCAG 1.4.11 covers information required to *identify UI
  components and states*; a card outline is not that. Applying it universally
  produced nine false failures that would have forced heavy borders to satisfy a
  rule that does not apply.

Current state: **93 pairs measured, 0 below floor.** Tightest text pair is accent on
the light muted surface at 4.85.

### UX2 2.3 — No alpha colour modifiers on text-bearing pairs

`bg-accent/10` compiles to `color-mix(… transparent)` and therefore has no fixed
colour — which is exactly why v1's second contrast failure was invisible. The 14
existing usages become solid per-surface tokens (`--color-accent-subtle`,
`--color-on-accent-subtle`, and the status equivalents).

Permitted exception: a genuine scrim, such as the mobile navigation backdrop.

### UX2 2.4 — Inverted action treatment on dark

On light, the primary button is white on blue. On dark, the accent fill is light, so
its label is near-black (`--color-on-accent: #0B0F14`, 7.56:1). This is a
consequence of the palette, not a stylistic choice.

---

## 3. Typography

Two roles. Display for statements, body for reading.

- **Display:** to be confirmed at the gate from `docs/design/v2/type-specimen.html`.
  Recommendation: **Archivo** — variable, SIL OFL, reads as deliberate rather than
  decorative. Alternative rendered: Instrument Serif.
- **Body:** Geist, retained (PRD §17.2 permits it).

Both load through `next/font`, which self-hosts at build time — no third-party
origin, no preconnect, CSP-clean. **Total font payload budget: ≤ 90KB**, verified in
Phase 9.

### UX2 3.1 — The scale

Nine steps, one per PRD §18 level, as `--text-*` tokens using `clamp()`:

```text
display-hero · display-section · page-title · project-title · card-title
lead · body · meta · eyebrow
```

**Every `clamp()` preferred value must contain a `rem` term.** A pure-`vw` value does
not respond to browser zoom, breaking WCAG 1.4.4 at 200% — which PRD §65 requires QA
on. This is regex-enforceable and should be enforced.

### UX2 3.2 — Size is decoupled from heading level

`SectionHeader` takes `level` (structural) and `size` (presentational) separately.
The current `DEFAULT_HEADING_SIZE` map re-couples them, which the component's own
comment already says is wrong.

Level continues to be typed `1 | 2 | 3 | 4`. It once omitted `1`, which is how two
routes shipped with no `h1`.

### UX2 3.3 — Uppercase comes from CSS

`text-transform: uppercase`, never authored uppercase strings — some screen readers
spell out authored capitals. The current code already does this correctly.

---

## 4. Grid, Spacing and Surface

12-column editorial grid at desktop, single column at mobile, deliberately composed
tablet states. Container `--spacing-content` (75rem); long-form prose constrained to
`--spacing-prose` (48rem). The 8-point spacing scale continues.

### UX2 4.1 — The `<Section>` primitive

A single component owns surface, vertical rhythm and the container:

```tsx
<Section surface="dark" id={SECTION_IDS.experience} width="content">
```

It renders a full-bleed `<section data-surface=…>` with the container inside. Today
four sections put `max-w` on the `<section>` itself, so a surface colour on them
would not span the viewport.

### UX2 4.2 — The surface wrapper lives inside the null guard

A section that returns `null` must render **nothing** — not an empty coloured band.
This is a hard implementation constraint: `homepage-section-omission.test.tsx`
asserts an empty container, no heading, and no `[id]`.

### UX2 4.3 — Surface assignment

| Section | Surface |
|---|---|
| Header | `dark`, permanently |
| Hero | `dark` |
| About | `light` |
| Work Experience | `dark` |
| Selected Work | `light` |
| Technical Skills | `neutral` |
| Engineering Workflow | `light` |
| Contact | `dark` |

The header crosses every surface and therefore cannot inherit one. It is solid
rather than translucent, which also removes a `color-mix` from the contrast surface.

### UX2 4.4 — Surface tier ranking (replaces SUP-007's mechanism)

Tiers, most to least emphatic: **`dark` > `neutral` > `light`**.

> **Engineering Workflow may never occupy a tier above Work Experience or Selected
> Work.**

SUP-007 reduced this section's prominence by removing its emphasis background. That
mechanism is void once every section carries one; the decision — *reduce prominence,
not honesty* — is unchanged. This restatement is testable via `data-surface`, where
the original height-ratio measurement never was.

---

## 5. Navigation

Inventory and order unchanged from SUP-005: Experience · Projects · Skills ·
AI Workflow · Contact, plus the Resume action. Anchors stay absolute (`/#experience`)
so they resolve from a project detail page.

### UX2 5.1 — No active-section indicator

PRD §24.2 is **deliberately not delivered**. It requires either a second Client
Component or a CSS scroll-timeline that silently does nothing in Firefox and WebKit.
`MobileNavigation` remains the only `"use client"` file — a property Randi has
published in his live case study.

Recorded as a deferral with its reason, not dropped silently.

### UX2 5.2 — Mobile navigation

Behaviour is unchanged and all of it is asserted: `aria-expanded`, `aria-controls`,
Escape closes, focus moves into the drawer on open and returns to the trigger on
close, background scroll locked.

---

## 6. Components

### UX2 6.1 — Components do not know their surface

Utilities compile to `var()` lookups, so `bg-surface` resolves against whichever
surface scope contains it. A project module renders correctly on a dark band and a
light index as the same component with the same classes. **No component takes a
`tone` prop.**

### UX2 6.2 — Fewer containers

Hierarchy comes from type, space, rule and surface (PRD §20). Cards are retained
where containment carries meaning — compact metadata, structured decisions, AI
details. The `<article>` element is retained for project modules: it is correct
semantics, and "fewer cards" is about visual containment, not landmarks.

### UX2 6.3 — Test hooks are attributes, not tags or classes

`data-project={slug}` on the project module root; `data-surface` on sections;
`data-status` on the status badge (already present). Tests must not assert on
`.closest("article")`, class-name substrings, or tag names.

### UX2 6.4 — Focus stays an outline

`outline` + `outline-offset`, with `--color-focus` per surface. Not `box-shadow`:
outline survives Windows High Contrast and forced-colors mode, where box-shadow
disappears entirely.

---

## 7. Motion

Duration tokens (`--motion-fast|base|slow`) and one easing token. Motion communicates
state, hierarchy, interaction and navigation only (PRD §22, V2-DP-005).

### UX2 7.1 — Reduced motion, three overlapping mechanisms

1. Duration tokens collapse to `1ms`
2. `animation-timeline: none !important`
3. The v1 blanket duration override, retained as a backstop

Mechanism 2 is not redundant. `animation-duration: 0.01ms` does **nothing** to
`animation-timeline: view()`, which advances on scroll progress rather than elapsed
time — so a scroll-driven reveal would ignore the preference entirely while
appearing to respect it.

### UX2 7.2 — Entrance effects animate from visible

Opt-in under `prefers-reduced-motion: no-preference`, animating *from* a visible
resting state. No element may rely on an animation completing to become readable.

**A reduced-motion end-to-end test must exist.** PRD §62 says to *maintain*
reduced-motion tests; there are currently none.

---

## 8. Fast Scan and Deep Dive

Every major page supports both (V2-DP-003).

### UX2 8.1 — Homepage fast scan

Within roughly ten seconds a recruiter should have: name, Backend Developer,
location and availability, the employer progression, and two case studies with role
and status.

### UX2 8.2 — Project detail, Layer A

Above the deep content: title, project type, delivery status, period, **My role**,
core technologies, the problem in one or two sentences, and the outcome. No scrolling
through fifteen sections to learn what the project was.

### UX2 8.3 — Project detail, Layer B

The existing fifteen sections, unchanged in substance and order. Responsibility
separation survives the redesign (PRD §38, FAC-PROJECT-003).

---

## 9. Section-Level Rules

### UX2 9.1 — Work Experience

Grouped by employer, with the progression legible rather than inferred. Three roles
at one employer read as Internship → Contract → Full-time under a single employer
heading. The current role carries emphasis; earlier roles compress.

### UX2 9.2 — Selected Work

Editorial modules, not a uniform card pair. Field order and the literal **"My role:"**
label are preserved from SUP-006 — PRD §32 lists the identical order, so the decision
travels to the new format unchanged.

### UX2 9.3 — Projects Index

Count-aware composition. With two projects the layout must look deliberate, never
like a grid missing its third item. No filters or search — PRD §52 forbids them at
this count, and an `<input>` would break the no-form assertion.

### UX2 9.4 — Technical Skills

Grouped with evidence labels. No numeric or graphical proficiency indicator of any
kind (UX2 1.1).

### UX2 9.5 — Engineering Workflow

Compact. Preserves human responsibility, verification method, corrected-assumption
evidence, and the truthful tool disclosure. Bound by the tier rule in UX2 4.4.

### UX2 9.6 — Contact

Strong dark closing section, backend-first wording. No form, no endpoint.

---

## 10. Project Diagrams

Sanitised, public-by-construction diagrams are the only route to a more visual
professional case study (PRD §31, V2-DP-007).

- Authored as public artifacts from the start, never sanitised after the fact
- No internal identifiers, partner system names, internal URLs or hostnames
- Every diagram carries a text alternative conveying the same information
- Lightweight — SVG preferred, with explicit dimensions

**Whether this requires a new content field is unresolved.** PRD §51 sets a
six-question bar and any field needs approval before implementation assumes it.

---

## 11. Responsive

Mobile single-column; tablet deliberately composed; desktop editorial grid.

- **Zero horizontal overflow at 320px** — below §64's smallest listed width, and the
  binding assertion
- 44px minimum touch targets, verified by measurement in a real browser rather than
  by class-name substring
- Review at 375, 390, 768, 1024, 1280 and 1440 (PRD §64)
- 200% browser zoom must not break layout or hide content

---

## 12. Accessibility

WCAG 2.2 AA, designed in rather than cleaned up (V2-DP-008). Thresholds are not
weakened to make v2 pass.

The axe gate is retained unchanged, including the always-blocking set:
`page-has-heading-one`, `heading-order`, `landmark-one-main`, `html-has-lang`,
`region`.

### UX2 12.1 — Coverage additions

1. **Add the project detail route to the axe page list.** It is currently scanned by
   nothing and is receiving the largest redesign.
2. **Add a reduced-motion test.** None exists.
3. **Add a contrast matrix test** that parses the shipping `globals.css` and runs in
   `quality`, so a failure surfaces on every PR rather than late in `e2e` on three
   engines. Its fixtures are the historical bugs: 4.34 and 4.31 must fail, 5.04 and
   5.59 must pass.

Exactly one `h1` per route. Heading order never skips.

---

## 13. Performance

LCP ≤ 2.5s, CLS < 0.1, INP < 200ms (PRD §46.1). Current CLS is 0.005 and the hero
`h1` is the LCP element.

- Keep `next/font`'s metric-adjusted fallback enabled
- **Re-measure CLS and LCP against the 0.005 / 1.6s baseline in Phase 9** rather than
  assuming the display face is free
- Measure warm and more than once. A v1 cold-deploy reading of 92 / LCP 2.5s was
  recorded as a risk and re-measured at 97 / LCP 1.6s
- Server Components by default; the client surface stays at one component

---

## 14. v0.1 → v2.0 Mapping

| v0.1 | v2.0 | Status |
|---|---|---|
| UX 4.3 single theme | UX2 2 | Superseded — three surfaces, still no switcher |
| UX 4.4 palette | UX2 2 | Superseded |
| UX 4.5 status treatment | UX2 2.3 | Amended — solid tokens replace alpha modifiers |
| UX 4.6 typography | UX2 3 | Superseded — two faces, tokenised scale |
| UX 4.7 spacing | UX2 4 | Retained |
| UX 4.8 radius | UX2 4 | Retained |
| UX 5.1 widths | UX2 4 | Retained |
| UX 6.1 navigation inventory | UX2 5 | Retained as amended in v1.1 |
| UX 6.3 anchor offset | UX2 4.1 | Retained |
| UX 7.3–7.9 sections | UX2 9 | Superseded |
| UX 7.5 project cards | UX2 9.2 | Superseded — modules; SUP-006 order retained |
| UX 7.8 AI visual weight | UX2 4.4 | **Mechanism replaced, decision retained** |
| UX 9.5 detail sections | UX2 8.3 | Retained |
| UX 12 components | UX2 6 | Amended |
| UX 18.3 social card | — | Retained |

---

## 15. Open Questions

Blocking implementation:

| # | Question |
|---|---|
| Q1 | Display typeface — decide from `type-specimen.html` |
| Q9 | Whether project diagrams need a schema field (PRD §51's six questions) |

Not blocking this specification, but open:

| # | Question |
|---|---|
| Q6 | Docker classified `currently-learning` while listed under the current role |
| Q7 | Whether Claude Code is the deliberate representative tool for AI practices |
| Q8 | Contact copy and hero CTA wording — Randi's voice, and an availability claim |
| Q10 | `remoteAvailability` rename, deferred to v2 by v1.1 |
