# Developer Portfolio — UX/UI Specification v3.0

**Status:** Approved design, **partly built on `staging`, nothing released.** Randi
approved the V3.1 review mockup on 2026-11-18. The mockup stays on his machine by his
decision (2026-11-19), so this document is the repository's record of that design. It
is built phase by phase on `staging` (V3 implementation plan, P3–P10). Until the V3
release, `PORTFOLIO_UX_UI_SPEC_v2.0.md` describes the live site.

| Section | On `staging` |
|---|---|
| §2 Colour, §3 Surfaces, §4 Typography (tokens and type steps) | Built in P3. The v2 pages on `staging` already use them |
| §6 Navigation: header, mode switch, Résumé menu; §7.7 Footer | Built in P4, with two differences noted in §6.1 and §6.2. The `/backend` and `/infrastructure` routes exist and show their intros |
| §6.5 Focus and scroll on a mode change; §7 the persistent hero; §7.1 Overall | Built in P5, with the stacked career layout (§8.4 adds the pinned one in P8) and a labelled placeholder for the photograph (§7.6). §6.5 is amended: see the note there |
| §7.2 Backend, §7.3 Infrastructure | Built in P6. See the as-built note under §7.3 |
| §7.4 Projects, §7.5 Case study | Built in P7. See the as-built note under §7.5 |
| §8.1–§8.3, §8.5, §8.6 (entrance, mode change, pointer light, reveal, reduced motion) | Built in P8. See the as-built note under §8.6 |
| §5, §7.6, §8.4, §9–§11 (layout, photograph, career pinning, responsive, accessibility, performance) | Not built yet; P8b onwards |

**Will supersede:** `PORTFOLIO_UX_UI_SPEC_v2.0.md`, at the V3 release.

**Companions:**

- `PORTFOLIO_V3_REQUIREMENTS.md`: what was asked for.
- `docs/plans/2026-11-18-v3-implementation-plan.md`: how it is built.
- The decision ledger, DEC-056 to DEC-063 and SUP-010 to SUP-017: what was decided.

> **Status accuracy.** v2.0 once said "nothing here is implemented" while all of it was
> live. This document makes the opposite claim, that nothing here is live yet. It must be
> updated as phases land, and at the release, rather than left saying either.

> **Citation note.** Code comments cite this document as **`UX3 n.n`**, so it is never
> confused with v0.1 (`UX`) or v2.0 (`UX2`).

---

## 1. Visual Direction

The site is an engineering biography rather than a dashboard. The requirements ask for
five qualities (§1.1): cinematic, elegant, minimalist, personal, content-first. The
approved design achieves them with very little:

- **One photograph**, on the Overall hero only.
- **Quiet surfaces.** Near-black, navy, off-white and white. There is no canvas imagery,
  no light-and-motion panels and no decorative illustration.
- **Blue as an accent, not a background.** It appears only on:
  - the active mode;
  - selected words;
  - links and hairlines;
  - the one blue section.
- **Large editorial type** and generous negative space.
- **Motion that explains structure.** It shows which mode you are in and where you are in
  the career. It is never decoration that delays content.

The design must stay original. Nothing is taken from the reference page's assets,
branding or imagery (V3-DES-007).

---

## 2. Colour

| Token | Value | Use |
|---|---|---|
| `black` | `#070B12` | Dark surface, hero |
| `navy` | `#0A1931` | Navy surface |
| `navy-2` | `#0F2142` | Raised elements on navy |
| `off-white` | `#F5F7FA` | Light surface |
| `white` | `#FFFFFF` | White surface |
| `ink` | `#111827` | Text on light and white |
| `ink-2` | `#4B5563` | Secondary text on light and white |
| `fg` | `#F8FAFC` | Text on dark and navy |
| `fg-2` | `#A3B1C6` | Secondary text on dark and navy |
| `blue` | `#2563EB` | Accent; the blue surface |
| `blue-dark` | `#1D4ED8` | Accent text on light surfaces where contrast is tight |
| `sky` | `#60A5FA` | Accent on dark surfaces; the hero's second line |
| `line-light` | `#E2E7EE` | Hairlines on light and white |
| `line-dark` | `rgba(248, 250, 252, 0.14)` | Hairlines on dark and navy |

**Contrast:**

- The DEC-052 floor stays: **4.8:1** for text and **3.3:1** for non-text. The contrast
  matrix is rebuilt for these pairs in P3.
- One pair needs care. `blue` on `off-white` measures 4.816:1, inside the floor by 0.016.
  Wherever a token change could erode that margin, accent text on light surfaces uses
  `blue-dark` (6.24:1).

---

## 3. Surfaces

Five surfaces (SUP-016) replace v2's three:

| Surface | Background | Used for |
|---|---|---|
| `dark` | `black` | Hero, Explore further, footer, page heroes |
| `navy` | `navy` | Engineering focus, toolkits |
| `light` | `off-white` | Profile, selected work, most content sections |
| `white` | `white` | Career, education, case-study body |
| `blue` | `blue` | "How I approach engineering" only |

Each surface sets its own `muted`, `line` and `accent` values, so a component placed on
any surface resolves the right colours without per-use overrides. v2's `data-surface`
mechanism (DEC-049) is the model for this.

---

## 4. Typography

**Typeface:** Geist only (SUP-013). The approved mockup included a serif comparison
toggle; it was a review tool, and the serif option was not chosen.

The display sizes join the tokenised `clamp()` scale (DEC-061). Raw Tailwind size
utilities stay banned (DEC-051).

| Role | Size | Weight and treatment |
|---|---|---|
| Hero line 1 | `clamp(1.9rem, 1rem + 2.8vw, 3.8rem)` | 500, uppercase, tracking −0.012em |
| Hero line 2 | `clamp(2.6rem, 0.8rem + 7vw, 8.6rem)` | 700, uppercase, `sky` on dark |
| Eyebrow | `0.74rem` (hero `0.78rem`) | 600, uppercase, tracking 0.2em, preceded by a 20 × 2 px accent bar |
| Lead | `clamp(1.05rem, 1rem + 0.35vw, 1.22rem)` | Line height 1.65, at most 54 characters wide |
| Mode label | `0.74rem` (`0.7rem` below 640 px) | 600 |

The section heading sizes come from the existing scale. P3 fixes their tokens and
measures them against the contrast and zoom tests.

---

## 5. Layout

- **Gutter:** `max(20px, 4vw, env(safe-area-inset-left))`.
- **Header height:** measured at runtime and exposed as `--hdr`. Anchored scrolling and
  the hero's top spacing use it, because the header's height changes when it wraps.
- **Breakpoints:**

| Width | What changes |
|---|---|
| < 900 px | The career sequence stops pinning and stacks (§8.4). Profile and project rows become one column. The approach and toolkit grids drop to two columns |
| < 860 px | Hero content aligns to the bottom, under the photograph. Education and the work blocks become one column |
| < 760 px | Engineering focus, role lists, case-study sections and footer columns become one column |
| < 640 px | The header height token drops to 76 px and its gaps tighten. The Infrastructure mode label shortens to "Infra"; its accessible name stays "Infrastructure" |
| < 560 px | The approach grid becomes one column |
| < 520 px | The toolkit becomes one column |
| 390 px | The header is still one row |
| 360 px | The header wraps to two rows. This is the minimum width the layout is designed for |

There is no horizontal page scroll at 320, 360, 390, 768, 1024 or 1440 px, on any route.

---

## 6. Navigation

### 6.1 Header

The header holds **only** two things:

- **Left:** the mode switch, with Overall, Backend and Infrastructure.
- **Right:** Résumé.

There is no identity lockup, no menu and no burger. This differs from the requirements
(§12, row 1).

- **Background.**
  - Opaque near-black (the dark surface, `#070B12`) with a hairline, at all times.
  - It looks the same on every route (V3-NAV-005).
  - **Amended in P4.** The approved mockup's header was transparent at the top and became a
    translucent `rgba(7, 11, 18, 0.78)` with an 18 px backdrop blur after 24 px of scroll.
    That was not adopted. Text on a translucent surface sits on a colour that no contrast
    gate can measure, the class of pairing that hid one of v1's contrast failures (UX2
    records why the v2 header is opaque). Over the dark hero, where the mockup showed
    transparency, the difference is hard to see.
- **Skip link.** A skip link is first in the tab order.
- **Narrow screens.** The header wraps to two rows below about 375 px rather than overflowing
  or hiding the switch (§5, V3-NAV-010).

### 6.2 Mode switch

- **Element.** Each mode is a real link to a real route (V3-NAV-002): `/`, `/backend`,
  `/infrastructure`.
- **Active mode.**
  - It carries `aria-current="page"`.
  - A pill marks it, so the state is shown by shape as well as colour.
  - The pill moves at once on click (V3-NAV-003). In P4 it appears on the new mode without
    moving; the movement is motion, and arrives with P8.
- **Clicking the current mode** does nothing. It does not replay the transition.
- **Target size.** Links are at least 40 px high, and the Résumé button 44 px.

### 6.3 Résumé menu

- **Mechanism.**
  - A button opens a popover listing the two résumés, backend and infrastructure (DEC-059).
  - It is built on the native Popover API. Opening, closing on Escape and closing on an
    outside click therefore work without JavaScript.
  - The client component adds arrow-key movement between the items.
  - Focus returns to the button on close.
- **Current page.** The résumé matching the current mode is marked "· this page".
- **Before publication.** Until a résumé is approved for publication, its item reads "PDF
  available after approval" and links nowhere. Only published variants are ever offered as
  downloads (FAC-RESUME-003).

### 6.4 Reaching Projects and Contact

Neither is in the header. They are reached:

- **From the page:** selected work, and "All projects" in Explore further.
- **From the footer**, on every route. The footer carries the email and Résumés.

V3-NAV-009 is met this way: the Résumé is always one click away in the header, and
contact is at the end of every page.

### 6.5 Focus and scroll on a mode change

The hero persists across the three mode routes (§7), so after a mode change `ModeHero`
does two things:

- resets the scroll to the top, instantly;
- moves focus to the new `h1`, with `preventScroll`.

The router cannot be left to do this. In the installed Next.js (16.4.6) it would scroll
the page below the persistent hero into view, and it leaves focus where it was.

**Amended in P5.** This section said mode links therefore use `scroll={false}`. They do
not need it. `ModeHero` wraps the page it sits above, and React runs layout effects
children first, so the router's scroll handler for the page runs before the hero's reset and
the reset has the last word, before paint. Every link into a mode route then behaves the
same without a prop to remember, including links added in later phases.

The same holds for every way into a mode route except two, which are left alone:

- **A page load or reload.** The browser keeps its position and nothing is focused that the
  visitor did not ask for.
- **Back and Forward.** The browser's scroll restoration stands.

Arriving from the projects pages counts as a mode change: the hero is created by the
navigation, and it resets and focuses as above.

---

## 7. Pages

The three mode routes share one persistent hero, a client component inside a route-group
layout. The page content below it is server-rendered per route. Hero copy for each mode
is content (`modeIntro`), not code.

Each hero names the engineer, the focus and the next action (V3-CONT-003). Wording marked
**proposed** stays Draft until Randi approves it (OPEN-009).

### 7.1 Overall (`/`)

| # | Section | Surface | Content |
|---|---|---|---|
| 1 | Hero | dark | The positioning as the eyebrow ("Software Engineer · Backend & Infrastructure", SUP-010). The name as the `h1`, over two lines. An action into the profile. The photograph, from §7.6 |
| 2 | Profile | light | A short profile statement (**proposed**). A fact list: location, current role, employer, years in software delivery, education |
| 3 | Engineering focus | navy | Two columns, Backend and Infrastructure: what each covers, in a sentence or two each |
| 4 | Career | white | Three chapters: 2024, the foundation; 2025, building systems; 2026, the move to the infrastructure team. Each chapter points at real experience records and never restates their dates (§8.4) |
| 5 | Selected work | light | Backend and infrastructure side by side. The case study links to its route; overviews are not links (DEC-060) |
| 6 | How I approach engineering | blue | Six practices, each traceable to a résumé line (**proposed** headline) |
| 7 | Education & credentials | white | Degree, programme, certification, course, languages |
| 8 | Explore further | dark | Backend, Infrastructure, All projects, Résumés |
| 9 | Footer | dark | §7.7 |

**As built in P5.** Five details differ from the approved mockup, each for a recorded reason:

- **Engineering focus.** Each column's text is that mode's intro description, so the Overall
  page and the mode page describe a discipline in the same words. The mockup's infrastructure
  column named the employer's reverse proxy, which DEC-064 keeps off the site, and the backend
  column follows the same rule so the two stay parallel.
- **Profile.** The statement is the approved two paragraphs (OPEN-009). The mockup's third
  paragraph, on AI tools, is not repeated here: AI-assisted practice is stated in the
  engineering approach (SUP-014).
- **Career.** The stacked layout follows the mockup's phone layout, which lists each
  chapter's roles and nothing else. The desktop panel's extra line, "Not an SRE title · A
  delivery and infrastructure role", belongs to the pinned layout and is decided with it in
  P8. Nothing on the site calls the role SRE (§7.3).
- **Selected work.** Overviews are Draft until their titles are confirmed (OPEN-011), so for
  now the section lists the one case study with a discipline. Nothing is added to fill it.
- **Explore further.** "Seven pieces of work, by discipline" was a count typed into the copy.
  The count is now taken from what is published. "By discipline" returned in P7 with the
  projects filter.

### 7.2 Backend (`/backend`)

| # | Section | Surface | Content |
|---|---|---|---|
| 1 | Hero | dark | Eyebrow "Randi Fajar Wicaksono · Backend", headline "Behind the Application.", a description, an action into the work. No photograph |
| 2 | Backend | light | An introduction, then four blocks: APIs & business workflows; data within applications; asynchronous integrations; debugging & release verification |
| 3 | Selected work | white | The backend case study and overviews |
| 4 | Experience | light | The backend roles, with highlights tagged backend |
| 5 | Toolkit | navy | Grouped tools: runtime and APIs, data, background work, and what is used alongside |

### 7.3 Infrastructure (`/infrastructure`)

| # | Section | Surface | Content |
|---|---|---|---|
| 1 | Hero | dark | Eyebrow "Randi Fajar Wicaksono · Infrastructure", headline "Beyond Deployment.", a description, an action into the work. No photograph |
| 2 | The transition | light | From backend developer to the infrastructure team (the bridge sentence is **proposed**). Now, Before and Scope facts |
| 3 | Infrastructure work | white | Four blocks: Jenkins; CI/CD quality, security and access; Linux & containers; AWS email-event delivery |
| 4 | Selected work | light | The infrastructure overviews |
| 5 | Tools & practices | navy | Grouped: cloud, Linux & containers, automation, backend foundation |

The role is a delivery and infrastructure role. **It is never presented as SRE**, in any
eyebrow, heading or tag. The requirements' eyebrow "Infrastructure & Reliability" was
replaced for that reason (§12).

How much infrastructure detail is public is Randi's decision (V3 plan, I3). Until he
makes it, copy names the technology categories (Jenkins, Docker, Linux, AWS) but not how
the employer's systems are wired together.

**As built in P6 (§7.2, §7.3).** The pages follow the approved mockup, with these
differences:

- **Infrastructure detail (DEC-064).** The mockup's infrastructure blocks named the proxy
  in front of hosted services and the AWS services of the email-event chain. They read as
  the infrastructure experience record does: "reverse proxies" and "AWS email-event
  delivery". A test holds the text to an approved list.
- **Tense.** The infrastructure role is current, so its ongoing work is in the present
  tense, as its experience record has it. The mockup used the past tense.
- **Backend experience.** The mockup listed each role on one line. Each role now shows
  its summary, its responsibilities and contributions as two lists, and its technologies,
  which is what FAC-EXP-001 asks of an entry.
- **Infrastructure selected work** is omitted until the overviews are published
  (OPEN-011), because no infrastructure case study exists.
- **Content source.** The pages' opening paragraphs and work areas are content, in
  `src/content/discipline-pages.ts`, and each work area cites the roles it restates.
  Section headings stay in the components, as elsewhere.

### 7.4 Projects (`/projects`)

- **Page hero.** Dark, with the heading "Projects".
- **Filter.** All, Backend or Infrastructure, each with its count. The state lives in
  `?discipline=`, so it survives Back and a reload. An unknown value falls back to All.
  Without JavaScript, every project shows.
- **Rows.** Each row shows the title, type, disciplines and a one-line summary.
- **Links.**
  - A case study links to its route; an overview is not a link.
  - A project with no discipline appears only under All. The personal portfolio project is
    one.

### 7.5 Case study (`/projects/[slug]`)

- **Content.** Unchanged. Case studies keep their content and DEC-054's two layers: a
  summary layer, then the deep sequence. V3 changes their presentation only.
- **Presentation.**
  - A dark page hero carries the type and disciplines as an eyebrow and the title as the
    `h1`.
  - The body is on white and light surfaces.
  - The back link returns to the projects index with its filter intact.
- **Not found.** An overview slug and an unknown slug return the same not-found result
  (DEC-047).

**As built in P7 (§7.4, §7.5).** The pages follow the approved mockup, with these
differences:

- **Projects lead.** The mockup's first sentence, "Work from Zettabyte and one personal
  project", stated counts that change as overviews are published. The lead is v2's
  approved description of the case studies instead, with the mockup's sentence about
  overviews added only when there are overviews to describe. The sanitization note stays
  (UX 8.2).
- **A filter with nothing published** says so ("Nothing is published under Infrastructure
  yet.") rather than showing an empty list. Each filter change is announced to screen
  readers.
- **The way back.** The index links "← Overall" to the selected work, as the mockup does,
  and the persistent hero now leaves a link to an anchor to the router (§6.5). The case
  study's "← Projects" returns to the filtered view the visitor came from.
- **Case-study sections** keep their names as headings, set as labels beside the text. The
  mockup gave each section a new headline ("Two applications, one workflow."), which the
  content does not have; writing them would be new claims, so it waits for Randi. The
  mockup's Team fact is left out for the same reason: team work is a list, not a summary
  line.
- **v2's project card** and the shared section header, no longer used, were removed.

### 7.6 Photograph

There is one photograph, on the Overall hero only.

- **Desktop:** it occupies the right 46% of the hero, full height, with its left edge
  masked into the background.
- **Phones:** it runs full width at the top of the hero, masked downward into the dark.
- **Loading:** it loads eagerly through `next/image` with `preload`, explicit `sizes` and
  a fixed aspect ratio, so it never shifts the layout.
- **On the other modes:** the photograph is clipped away rather than shown.
- **Until Randi supplies it:** a labelled placeholder stands in on `staging`, and release
  validation rejects it (OPEN-010).

### 7.7 Footer

- **Heading:** "Get in touch."
- **Email:** the public address (DEC-014) as a `mailto:` link, plus a "Copy address"
  button. The button is a client component; the link works without it.
- **Pages:** Overall, Backend, Infrastructure, Projects.
- **Elsewhere:** GitHub, LinkedIn, Résumés.
- **Location:** a line giving the location.
- **Never:** a phone number or an availability statement (SUP-011).

---

## 8. Motion

DEC-053 still holds: motion is tokenised, and reduced motion is honoured structurally.
DEC-062 records the V3 additions below.

### 8.1 Hero entrance (first load)

CSS keyframes:

- the photograph rises 30 px and fades in over about 1.6 s;
- the heading lines rise in sequence.

There is no opening cover or loading screen; the hero's own entrance is the opening
(§12). Content is visible without JavaScript.

### 8.2 Mode change

The mode change uses the Web Animations API in `ModeHero`:

| Phase | Timing |
|---|---|
| Exit | The current heading lines and text leave in about 220 ms, staggered by about 25 ms |
| Swap | The new hero copy renders; the content below is the new route's server output |
| Enter | Heading lines rise over 440–460 ms, staggered by 55–60 ms |
| Rest | The description and action follow over 340 ms, after a 90–100 ms delay plus 35–40 ms per item |
| Settled | About **0.75 s after the click**, within the requirements' 500–800 ms target |

- **Interruptions.** A token cancels an earlier sequence, so five rapid clicks settle on
  the last choice and leave nothing half-animated (V3-NAV-006).
- **Navigation is never delayed.** The route changes at once.

### 8.3 Pointer light

One blue light follows the pointer in the hero.

- **Conditions:** it runs only under `(hover: hover) and (pointer: fine)` and for the mouse
  pointer type.
- **Movement:** it eases towards the pointer, closing 12% of the gap each frame, and only
  while the pointer is moving.
- **Opacity:** 1 while moving, 0.32 at rest, 0 once the pointer leaves the hero.
- **Off:** on touch, and under reduced motion.

### 8.4 Career sequence

- **Pinned (at least 900 px wide, motion allowed):**
  - A sticky stage sits on a track about 210 svh long.
  - The scroll position selects the chapter.
  - Arrows move between chapters, and a large year rolls to the current one.
  - No scroll hijacking: native scrolling drives everything (V3-MOT-007).
- **Stacked (below 900 px, under reduced motion, or without JavaScript):**
  - The chapters are a plain vertical sequence, with year tabs on phones.
  - Stacked is the default: the pinned class is added only after hydration (V3-MOT-004).
- **No content exists only in the pinned view.** While pinned, the role details are
  visually hidden but stay in the document and are announced to assistive technology.
- **Scrolling backward** reverses the sequence coherently (V3-MOT-003).

### 8.5 Section reveal

Sections reveal with a CSS scroll-driven animation (`animation-timeline: view()`) inside
`@supports`:

- they rise 22 px from 30% opacity, and are never fully hidden;
- there is no JavaScript;
- an engine without support shows the content with no reveal;
- reduced motion stops it through the existing DEC-053 guard.

### 8.6 Reduced motion

Under reduced motion:

- the mode swaps instantly;
- the career does not pin;
- there is no pointer light and no reveal.

Every function remains (V3-MOT-005), and animation failure never blocks content or
navigation (V3-MOT-006).

**As built in P8 (§8.1–§8.3, §8.5).** The timings are as specified, with three differences:

- **Movement without fades, for anything a contrast check reads.** The first-load entrance
  (§8.1) moves the text and does not fade it. The section reveal (§8.5) rises 22 px and does
  not start at 30% opacity. A section below the fold would otherwise sit at 30% opacity until
  it is scrolled to, and that is what an accessibility scan, which runs with motion allowed,
  measures. The mode change still fades the copy out and in, because it runs only after a
  click and finishes in under a second.
- **Focus waits for the new copy.** During the exit the old heading is still on screen, so
  focus moves to the heading when the new copy arrives. A screen reader never announces the
  heading that is leaving. The route and the scroll change at once.
- **No shared-element transition.** The optional case-study spike (V3 plan 3.3) was not run;
  entering a case study has no transition.

Without the Web Animations API the copy swaps at once, as under reduced motion.

---

## 9. Responsive

§5 lists the breakpoints. On phones:

- The header is one row at 390 px and two at 360 px.
- The mode switch is never hidden behind a menu (V3-NAV-010).
- The photograph sits at the top of the hero (§7.6).
- The career is stacked.
- Sections are a single column.

---

## 10. Accessibility

- Mode links carry `aria-current`, and the active state is shown by shape and colour.
- The Résumé menu is a native popover with arrow keys, Escape and outside click, and focus
  returns to its button.
- After a mode change, focus moves to the new `h1` (§6.5).
- A skip link is first in the tab order.
- Everything works with JavaScript disabled, with reduced motion, at 200% zoom and at
  320 px.
- axe runs on every route in both motion modes. The v2 missing-heading and
  single-`h1` checks stay.
- The contrast floor is DEC-052 (§2).

---

## 11. Performance

| Target | Value |
|---|---|
| Largest Contentful Paint | ≤ 2.5 s |
| Cumulative Layout Shift | ≤ 0.1 |
| Interaction to Next Paint | ≤ 200 ms |
| Lighthouse performance, mobile | ≥ 90 |
| Lighthouse accessibility | ≥ 95 |

How the design stays within these:

- Client JavaScript is limited to the six components in DEC-057.
- There is no canvas, and no animation loop at rest.
- There is one passive scroll handler, on the career section.
- One font family.
- Per-route bundle sizes are recorded at each phase.

---

## 12. Differences from the requirements

The approved V3.1 design changed some of what `PORTFOLIO_V3_REQUIREMENTS.md` asked for.
Each change came from the V3.1 improvement brief and was approved with the mockup on
2026-11-18. Where this table and the requirements disagree, this table governs.

| Requirement | Approved design | Why |
|---|---|---|
| §5.2: the header includes an identity or logo, Projects and Contact | Modes and Résumé only (§6.1) | A quiet header keeps the mode switch the one signature control. Projects and Contact are reached from every page and the footer (§6.4) |
| §6.2, Overall headline "The engineering journey." | The name is the Overall heading, under the positioning eyebrow | §6.2 also requires Randi to be identified prominently. The name does both |
| §6.2, Infrastructure eyebrow "Infrastructure & Reliability" | "Randi Fajar Wicaksono · Infrastructure" | The role is not an SRE role, and "Reliability" invites that reading |
| §7.3–7.8: a biography overlay, a selected-facts stats band, a full-screen engineering-philosophy quote, a related-content slider | Removed. Replaced by the profile statement with a fact list, the "How I approach engineering" section, and Explore further | Content-first and quiet: each removed element repeated content or decorated it |
| V3-MOT-001, an opening animation that resolves into the hero | No opening cover. The hero's own entrance is the opening (§8.1) | Nothing stands between a visitor and the content |
| §4.3, cinematic quality without additional pictures | Kept, with no canvas or light-and-motion panels at all | An earlier mockup used abstract blue panels; V3.1 removed them as decoration |
| §7.6, the start date of the infrastructure chapter "must be confirmed" | Confirmed: August 2026 (Randi, 2026-11-18) | Not a difference, a resolution, recorded here because the requirement asked for it |

---

## 13. v2.0 → v3.0

| v2.0 | v3.0 |
|---|---|
| One homepage with anchor navigation | Three mode routes, plus Projects and case studies (DEC-056) |
| Three surfaces (DEC-049) | Five (SUP-016) |
| Archivo display with Geist body (DEC-050) | Geist only (SUP-013) |
| Mobile navigation menu | No menu; the mode switch is always visible |
| About, Experience, Skills, AI Workflow and Contact sections | Profile, focus, career, work, approach, education, explore, footer (SUP-012) |
| AI-Assisted Engineering section | Retired (SUP-014) |
| One résumé | Two variants (DEC-059) |
| "Open to opportunities" | Removed (SUP-011) |
| Target roles list | Removed (SUP-017) |
