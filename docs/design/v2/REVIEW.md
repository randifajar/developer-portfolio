# V2 Design Review Gate

**This is the PRD §78 gate.** Nothing is implemented. Every decision below is
cheaper to change now than at any later point.

A 700-line specification is not reviewable. This is the same material as eighteen
questions with pictures.

## How to look at it

Open these two files directly in a browser (they need a network connection for the
fonts — the real build self-hosts them):

| File | What it shows |
|---|---|
| [`homepage.html`](homepage.html) | The full homepage composition, all seven sections |
| [`type-specimen.html`](type-specimen.html) | Both display typeface candidates at real sizes |

Rendered captures, if you would rather not open the files:

| Before (v1, live) | After (v2, proposed) |
|---|---|
| [`baseline/home-desktop-1440.jpg`](baseline/home-desktop-1440.jpg) | [`proposed/homepage-desktop-1440.jpg`](proposed/homepage-desktop-1440.jpg) |
| [`baseline/home-mobile-375.jpg`](baseline/home-mobile-375.jpg) | [`proposed/homepage-mobile-375.jpg`](proposed/homepage-mobile-375.jpg) |

`tokens.css` in this directory is the literal CSS destined for `globals.css`.
Approving the picture and approving the tokens are the same act.

---

## The eighteen questions

### 1. Homepage, desktop

Does this read as *your* portfolio, or as a template with your content in it? PRD §9
sets the bar: *not "Aston Martin F1 with MongoDB replacing Fernando Alonso."*

### 2. Homepage, mobile

Single column throughout. Does the hero still say who you are before the fold?

### 3. Surface alternation

`dark → light → dark → light → neutral → light → dark`.

Work Experience gets a dark band because it is already 36.6% of the page and SUP-005
made it lead. Is that the emphasis you want, or should Experience be neutral and
Selected Work carry the dark band instead?

### 4. Navigation

Solid dark header, permanently — it crosses every surface so it cannot inherit one.
**No active-section indicator.** Delivering one costs either a second Client
Component or a Chromium-only CSS feature; your case study currently says
`MobileNavigation` is *"the entire client-side JavaScript surface of the site."*

Is holding that line right?

### 5. Hero

Primary CTA is now **View Experience**, not View Projects — aligning with the
homepage hierarchy (V2-P0-002). Secondary is View Resume.

### 6. About

Light surface, two-column. Unchanged content.

### 7. Work Experience

The biggest change. Three roles now group under **one employer heading** with the
progression visible — Internship → Contract → Full-time — rather than three repeated
company names. Current role carries an accent rule.

Does the progression read correctly?

### 8. Project feature

Editorial modules rather than a card pair. Field order and the **"My role:"** label
are preserved exactly from SUP-006.

**Known weakness:** at desktop the left metadata column is sparse. Worth fixing
before implementation — options are to move the year inline, or widen the module to
full bleed with metadata above the title.

### 9. Projects Index

Not mocked. Count-aware composition so two projects never look like a grid missing a
third (V2-P0-005).

### 10. Skills

Neutral surface, plain tags. **No dot scales or segmented bars** — the spec forbids
the whole category, because the current tests would not catch one built from plain
spans.

### 11. Engineering Workflow

Light surface — deliberately the *least* emphatic tier.

This is where §14 and your v1.1 decision collide. §14 suggests "Dark / Neutral" for
this section, but dark is the most emphatic tier, and putting it there would visually
re-promote exactly what you demoted three days ago.

**Proposed rule:** *AI Workflow may never occupy a surface tier above Work Experience
or Selected Work.* Same decision as SUP-007, new mechanism, and testable this time —
SUP-007 has never had a test.

### 12. Contact

Strong dark closing section. Backend-first wording per V2-P0-001.

### 13. Typography

Recommendation is **Archivo**. Instrument Serif is rendered beside it so you can
disagree with something concrete. Body stays Geist.

Anton and Oswald were deliberately excluded — PRD §17.3 warns against ultra-condensed
faces for long text and against picking a font because it resembles motorsport
branding, and they hit both.

### 14. Colour

Your v1 blue `#2563EB` is kept unchanged on light surfaces. Dark surfaces use
`#60A5FA`, because **`#2563EB` measures 3.72:1 on near-black and fails AA.**

Consequence: the identity blue is not literally one hex. Acceptable?

### 15. The contrast floor

Proposed at **4.8**, stricter than WCAG's 4.5, because both v1 failures were within
4% of passing and neither was visible to review.

It has teeth: the light muted surface had to lighten from `#F1F5F9` to `#F5F8FB` to
keep your accent compliant, and the tightest pair in the whole system now sits at
4.85.

### 16. What the floor deliberately does *not* cover

A blanket non-text floor flagged nine pairs — every card border and badge fill. Those
are **false failures**: WCAG 1.4.11 covers information needed to *identify controls*,
which a decorative outline is not. Enforcing it would have forced heavy borders to
satisfy a rule that does not apply.

So the non-text floor applies only to focus rings and control-identifying borders. Do
you agree with that scoping?

### 17. Motion

Restrained, duration tokens, entrance effects animating *from* visible.

Notable: the v1 reduced-motion block **cannot** neutralise scroll-driven animation,
because `animation-timeline: view()` advances on scroll progress rather than time. A
reveal built that way would ignore the preference while appearing to respect it. The
spec adds `animation-timeline: none` and a test.

### 18. What is deliberately *not* in v2

No theme switcher · no active-section indicator · no filters · no analytics · no
content-model changes without approval · no new client components.

---

## Still open, and not blocking this gate

**Q6 — Docker.** Classified `currently-learning` while listed under your current
role. §13 says do not automatically upgrade. Is that the intended distinction?

**Q7 — AI tools.** All four practice records carry `toolName: "Claude Code"` while
the About summary names three tools. Deliberate representative tool, or should
practices model multiple?

Both are claims about your own evidence, so neither is answered here.

---

## If this is approved

Phase 2 begins, split into three PRs. The first — tokens, the `data-surface`
mechanism and the contrast gate — has **zero visual change** and is reviewable on its
logic alone.
