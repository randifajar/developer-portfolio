# Developer Portfolio V2 — Claude Handoff

> **Product:** Randi Fajar Wicaksono Developer Portfolio  
> **Release:** Version 2.0  
> **Document Type:** Product / UX / Engineering Handoff  
> **Repository:** `randifajar/developer-portfolio`  
> **Production Branch:** `production`  
> **Current Portfolio:** `https://developer-portfolio-delta-three.vercel.app/`  
> **Primary UI/UX Reference:** `https://www.astonmartinf1.com/en-GB`  
> **Date:** 2026-08-12

---

# 1. Purpose of This Handoff

This document is the product-intent source of truth for **Developer Portfolio V2**.

It is intended for a fresh Claude Code session working in the existing portfolio workspace.

V2 must improve the portfolio significantly without losing the engineering discipline established in V1 and V1.1.

This document defines:

- why V2 exists;
- what V2 should accomplish;
- the approved visual direction;
- the Aston Martin F1 reference boundaries;
- what should change;
- what must remain unchanged;
- page-by-page UX goals;
- visual-system expectations;
- motion rules;
- project storytelling improvements;
- accessibility requirements;
- performance requirements;
- confidentiality requirements;
- architecture constraints;
- implementation phases;
- acceptance criteria;
- verification requirements;
- release expectations;
- what Claude must do before writing code.

The repository remains the **technical source of truth**.

This handoff is the **V2 product-intent source of truth**.

If they conflict, Claude must report the conflict rather than silently guessing.

---

# 2. Executive Summary

Portfolio V1 established the engineering foundation.

Portfolio V1.1 corrected professional positioning and recruiter-facing information hierarchy.

Portfolio V2 is the:

# **Presentation and Storytelling Evolution**

The central question is no longer:

> Does the portfolio contain enough evidence that Randi is a real backend developer?

It does.

The V2 question is:

> Can a recruiter understand the strongest evidence in approximately 30 seconds, while a technical interviewer can still explore the engineering work deeply?

V2 must make the existing substance:

- faster to understand;
- easier to scan;
- visually stronger;
- more memorable;
- easier to navigate;
- more clearly backend-focused;
- richer without becoming noisy;
- more effective on mobile;
- more visually explanatory;
- still truthful;
- still confidentiality-safe;
- still technically defensible.

The intended feeling is:

> **Precision + Engineering + Performance + Restraint**

The internal working name for the V2 visual direction is:

# **Performance Engineering**

This is an internal design label.

It is not required to appear as public marketing copy.

---

# 3. Why V2 Exists

## 3.1 What V1 Already Solved

V1 already provides a serious engineering foundation:

- Next.js App Router;
- TypeScript;
- Server Components by default;
- typed content modules;
- Zod validation;
- cross-record validation;
- static generation;
- selector-based publication control;
- confidentiality classification;
- publication status;
- delivery status;
- production confirmation;
- project responsibility separation;
- professional vs personal project distinction;
- detailed technical case studies;
- unit/component testing;
- Playwright end-to-end testing;
- accessibility checks;
- CI/CD;
- Vercel deployment;
- production verification;
- release auditing;
- AI-assisted engineering disclosure.

These are strengths.

They are not V2 problems.

---

## 3.2 What V1.1 Already Solved

V1.1 corrected:

- stale pre-launch README information;
- backend-first professional positioning;
- remote-only wording;
- target-role consistency;
- homepage hierarchy;
- recruiter scanning of project cards;
- excessive visual prominence of AI-Assisted Engineering.

The current professional identity is:

> **Backend Developer**

The current target direction is:

- Backend Developer
- Backend Engineer
- Software Engineer

The current homepage hierarchy is:

1. Hero
2. About
3. Work Experience
4. Selected Projects
5. Technical Skills
6. AI-Assisted Engineering
7. Contact

That professional-evidence-first hierarchy remains the foundation for V2.

---

# 4. Core V2 Problem

The current portfolio has strong evidence but still behaves visually like a very carefully constructed technical document.

That creates several UX limitations.

## Current weaknesses

- visual identity is professional but relatively generic;
- many sections use similar visual rhythm;
- project evidence is text-heavy;
- project-detail pages require substantial reading;
- career progression exists but is not visually celebrated;
- project visuals are minimal;
- skills are evidence-based but visually fragmented;
- AI workflow is good but still consumes substantial reading space;
- navigation is functional but minimally contextual;
- project pages serve technical readers better than fast-scanning recruiters;
- the design could communicate more personality without becoming unprofessional.

V2 should solve those problems.

---

# 5. V2 Primary Goal

Transform the portfolio from:

> **a strong technical portfolio document**

into:

> **a premium editorial engineering portfolio**

without reducing technical depth.

---

# 6. V2 Audience

V2 must continue supporting two main audiences.

## 6.1 Recruiter / Hiring Manager

Typical behavior:

- limited time;
- scans;
- may spend less than one minute initially;
- wants quick evidence;
- wants role clarity;
- wants experience clarity;
- wants technical-stack clarity;
- wants easy Resume / Contact access.

They should not need to read an entire case study to understand whether the portfolio is relevant.

---

## 6.2 Engineering Manager / Technical Interviewer

Typical behavior:

- may inspect individual projects;
- wants technical reasoning;
- wants responsibility boundaries;
- wants architecture understanding;
- wants trade-offs;
- wants testing evidence;
- wants failure/lesson evidence;
- wants proof that claims are defensible.

V2 must preserve this depth.

---

# 7. V2 Success Criteria

## Fast-scan success

Within approximately 30 seconds, a recruiter should be able to identify:

- Randi Fajar Wicaksono;
- Backend Developer;
- Yogyakarta, Indonesia;
- 2+ years of progressive backend experience;
- internship → contract → full-time progression;
- current core backend stack;
- professional project evidence;
- current employer history;
- Resume;
- Contact;
- GitHub / LinkedIn.

---

## Deep-review success

A technical interviewer should be able to understand:

- project context;
- project problem;
- Randi's responsibility;
- architecture/workflow;
- technical decisions;
- trade-offs;
- challenges;
- testing strategy;
- verification;
- outcome;
- AI-assisted engineering usage;
- lessons learned;
- confidentiality limitations.

---

## Visual success

The site should feel:

- premium;
- precise;
- technical;
- editorial;
- modern;
- disciplined;
- intentional;
- confident.

It should **not** feel:

- like a racing fan website;
- like an Aston Martin clone;
- like a cyberpunk dashboard;
- like a crypto landing page;
- like a terminal theme;
- like a gaming interface;
- like an animation experiment;
- like a generic portfolio template;
- like a component library demo.

---

# 8. Approved UI/UX Reference

Primary reference:

`https://www.astonmartinf1.com/en-GB`

The reference is useful because of its **editorial design language**.

We want to learn from:

- large visual storytelling blocks;
- strong typography;
- high-contrast hierarchy;
- concise metadata;
- short CTAs;
- large negative space;
- visual rhythm;
- featured-story prioritization;
- alternating compositions;
- confident full-width sections;
- premium restraint;
- controlled motion.

---

# 9. What Must NOT Be Copied From Aston Martin F1

The portfolio must not copy:

- Aston Martin logo;
- Formula One branding;
- Aston Martin green as the identity;
- car imagery;
- driver imagery;
- racing photography;
- exact typography;
- proprietary fonts;
- exact page composition;
- exact navigation;
- exact animations;
- exact color palette;
- exact CTA wording;
- exact graphic motifs;
- proprietary visual assets.

The reference is a **design-principle reference**, not a template.

The final portfolio must remain recognizably:

> **Randi Fajar Wicaksono's Backend Developer portfolio**

not:

> Aston Martin F1 with MongoDB replacing Fernando Alonso.

---

# 10. Approved Design Direction

V2 combines:

> **Aston Martin-inspired premium editorial composition**

with:

> **V1 Quiet Engineering discipline**

Result:

# **Performance Engineering**

The design should communicate:

- engineering precision;
- deliberate decisions;
- performance awareness;
- strong systems thinking;
- calm technical confidence.

---

# 11. V2 Design Principles

## V2-DP-001 — Evidence Before Decoration

Professional evidence always wins.

If decoration competes with:

- experience;
- responsibility;
- project status;
- technology;
- verification;
- outcome;

reduce or remove it.

---

## V2-DP-002 — Editorial, Not Dashboard

Use:

- large layouts;
- strong sections;
- feature compositions;
- typography;
- images/diagrams;
- spacing;
- rules;
- asymmetry.

Do not put everything inside identical cards.

---

## V2-DP-003 — Fast Scan, Deep Dive

Every major page should support:

### Fast Scan

Understand the important evidence quickly.

### Deep Dive

Continue into technical reasoning.

---

## V2-DP-004 — Backend First

The primary professional identity remains:

> **Backend Developer**

Full-stack capability may appear where supported by actual evidence.

It must not compete with the backend identity.

---

## V2-DP-005 — Performance Without Noise

Motion and visual effects must communicate:

- state;
- hierarchy;
- interaction;
- navigation.

They must not exist purely for spectacle.

---

## V2-DP-006 — AI Is Supporting Evidence

The visitor should think:

> Randi is a backend engineer who uses AI responsibly.

Not:

> Randi is an AI-tool operator who also does backend work.

---

## V2-DP-007 — Confidentiality by Design

Professional work becomes more visual through **sanitized public diagrams**, not through leaking company screenshots.

---

## V2-DP-008 — Accessibility From the Beginning

Accessibility is part of the design.

It is not a final cleanup stage.

---

# 12. Complete V2 Scope

V2 includes:

1. V1.1 residual cleanup
2. Visual-system redesign
3. Typography
4. Color system
5. Layout/grid system
6. Section rhythm
7. Navigation redesign
8. Hero redesign
9. About redesign
10. Work Experience redesign
11. Selected Work redesign
12. Projects Index redesign
13. Project Detail redesign
14. Project visual/diagram system
15. Skills redesign
16. AI workflow redesign
17. Contact redesign
18. Footer redesign
19. Motion system
20. Responsive system
21. Accessibility hardening
22. Performance hardening
23. Open Graph redesign
24. Tests
25. Documentation
26. Release verification

---

# 13. Phase 0 — V1.1 Residual Cleanup

Before major V2 implementation, review the following small inconsistencies.

---

## V2-P0-001 — Contact Positioning

Current Contact copy still references:

> backend, full-stack, and software engineering roles

This conflicts with V1.1's backend-first positioning.

Preferred direction:

> **Open to backend and software engineering opportunities.**

Do not reintroduce Full-Stack Developer as a target role.

---

## V2-P0-002 — Hero CTA

The current hero prioritizes:

> View Projects

while the homepage now intentionally prioritizes Experience.

V2 should align the hero CTA with the new professional hierarchy.

Preferred primary CTA:

> **View Experience**

Alternative:

> **Explore My Work**

Preferred secondary CTA:

> **View Resume**

Avoid meaningless labels such as:

> Learn More

---

## V2-P0-003 — Docker Evidence Review

Current skill classification:

> Docker — Currently Learning

Docker also appears in professional experience.

This may be correct.

Using a technology professionally does not automatically mean the user considers it an independent strong working skill.

Claude must inspect the evidence and explain the intended distinction.

Do not automatically upgrade Docker.

Do not automatically remove Docker from professional experience.

---

## V2-P0-004 — AI Tool Evidence Review

The About summary references:

- Codex
- Claude Code
- ChatGPT

The detailed AI workflow currently uses Claude Code as the structured tool.

Claude must determine whether:

1. Claude Code is intentionally the representative workflow tool;
2. or AI practices need multi-tool modeling.

Do not modify the content model merely to create visual symmetry.

---

## V2-P0-005 — Projects Index Layout

Current project count is two.

The Projects Index must not use a layout that visually implies a missing third project.

V2 must make project-count-aware composition intentional.

---

# 14. V2 Theme Model

V2 should be:

# **Dark-Dominant Editorial**

This does **not** mean every section must be black.

Use deliberate contrast between:

- dark feature sections;
- light reading sections;
- neutral transition sections.

Recommended composition:

```text
Hero               Dark
About              Light
Experience         Dark or Neutral
Selected Work      Mixed / Alternating
Skills             Light
Workflow           Dark / Neutral
Contact            Strong Dark Closing Section
```

Exact ordering may change during visual design review.

---

# 15. Theme Switcher

A light/dark mode switcher is **not required for V2**.

Do not add one automatically.

The editorial design already intentionally uses dark and light surfaces.

A manual theme system would:

- increase complexity;
- increase testing surface;
- increase token requirements;
- provide limited recruiter benefit.

Defer it unless separately approved.

---

# 16. Color Direction

Do not use Aston Martin green as the identity.

Recommended personal direction:

```text
Near Black / Charcoal
Off White
Cool Grey
Slate
Cobalt / Electric Blue Accent
Accessible Green for success
Accessible Amber for warnings
Accessible Red for errors
```

The blue accent creates continuity with V1 while allowing a much stronger V2 system.

Exact color values must be determined during the V2 design-system phase.

Every final combination must be contrast-tested.

---

# 17. Typography Direction

Typography is a major V2 feature.

Use two roles.

## 17.1 Display Typeface

Used for:

- hero;
- large section statements;
- project feature titles;
- page titles.

Characteristics:

- strong;
- editorial;
- modern;
- readable;
- visually distinctive.

Uppercase may be used selectively.

Do not use an ultra-condensed font for long text.

---

## 17.2 Body Typeface

Used for:

- experience;
- case studies;
- descriptions;
- responsibilities;
- technical content.

Characteristics:

- calm;
- highly readable;
- comfortable at long reading widths.

Existing Geist may remain if it remains appropriate.

---

## 17.3 New Fonts

If adding a display font:

- verify licensing;
- prefer open/public distribution;
- verify performance impact;
- verify accessibility/readability;
- do not choose a font purely because it resembles motorsport branding.

---

# 18. Responsive Typography

Use a tokenized responsive scale.

Prefer:

`clamp()`

or equivalent responsive typography.

Conceptual hierarchy:

```text
Hero Display
Section Display
Page Title
Project Title
Card / Tile Title
Lead Body
Body
Metadata
Eyebrow
```

Do not use giant typography that pushes all useful information below the fold.

---

# 19. Layout / Grid System

Recommended desktop foundation:

> **12-column editorial grid**

Mobile:

> **single-column content flow**

Tablet:

> deliberately designed intermediate compositions

Main container may remain near the existing 1200px range.

Long technical prose should remain narrower.

Wide architecture diagrams may use more horizontal space.

---

# 20. Card Usage

V2 should intentionally use **fewer cards**.

Use cards where containment provides meaning.

Good uses:

- compact metadata;
- structured decisions;
- AI details;
- small interactive units.

Avoid:

- card for every experience;
- card for every section;
- card inside card;
- every project presented identically.

Hierarchy should come from:

- typography;
- layout;
- spacing;
- surface changes;
- rules;
- imagery;
- alignment.

---

# 21. Section Numbering

V2 may use section labels such as:

```text
01 / EXPERIENCE
02 / SELECTED WORK
03 / TOOLKIT
04 / ENGINEERING WORKFLOW
05 / CONTACT
```

This supports the editorial/performance theme.

Keep it restrained.

Do not turn section numbers into fake telemetry.

---

# 22. Motion System

Motion must be subtle and purposeful.

## Allowed

- section reveal;
- line/rule expansion;
- navigation indicator motion;
- project-image hover scale;
- button transitions;
- restrained opacity/translate entrance;
- diagram emphasis;
- menu transitions.

## Avoid

- scroll-jacking;
- excessive parallax;
- cursor followers;
- autoplay background video;
- rotating titles;
- auto-typing text;
- looping background effects;
- motion delaying content;
- animations requiring expensive JavaScript.

---

# 23. Reduced Motion

Every non-essential animation must respect:

`prefers-reduced-motion`

Reduced-motion mode should preserve the full information architecture.

No information may depend on an animation completing.

---

# 24. Global Navigation — V2

Recommended desktop inventory:

- Experience
- Projects
- Skills
- Workflow
- Contact
- Resume

Optional external links may remain secondary.

---

## 24.1 Identity

Use:

- Randi's name;
- or a restrained text-based identity treatment.

Do not create an elaborate logo automatically.

---

## 24.2 Active Section

V2 should add subtle section awareness.

Possible treatments:

- underline;
- rule;
- position marker;
- weight change.

Do not rely on color alone.

---

## 24.3 Sticky Header

Sticky navigation remains acceptable.

The header must remain readable across dark and light sections.

Claude must design intentional section-transition behavior.

---

# 25. Mobile Navigation

Possible approach:

> full-screen or large editorial menu

Requirements:

- keyboard accessible;
- focus managed;
- Escape closes where applicable;
- menu button announces state;
- background scrolling controlled;
- link selection closes menu;
- Resume remains accessible;
- GitHub / LinkedIn remain accessible.

No hover dependency.

---

# 26. Approved Homepage Order

```text
Navigation
Hero
About
Work Experience
Selected Work
Technical Skills
Engineering Workflow
Contact
Footer
```

Do not move Projects above Experience without a new product decision.

---

# 27. Hero — V2 Scope

## Goal

Immediately answer:

- Who?
- What role?
- What backend focus?
- Where?
- What action next?

---

## Required content

- Randi Fajar Wicaksono
- Backend Developer
- backend-oriented headline
- Yogyakarta, Indonesia
- neutral availability
- professional photo
- primary CTA
- Resume CTA

Optional:

- concise stack line;
- GitHub;
- LinkedIn.

---

## Recommended editorial composition

Desktop:

```text
Large Identity / Headline
+
Large Photograph / Visual Field
+
Minimal Metadata
+
2 Primary Actions
```

Avoid reproducing the exact V1 60/40 layout with different colors.

---

## Suggested stack line

```text
Node.js · GraphQL · MongoDB
```

Do not place the full Skills section in the hero.

---

# 28. About — V2 Scope

About remains concise.

Purpose:

> explain the professional identity without becoming a biography.

Possible editorial heading:

```text
BACKEND ENGINEERING,
END TO END.
```

The existing concise summary can remain.

Do not substantially increase text.

---

# 29. Work Experience — V2 Priority

This is one of the most important V2 redesigns.

The current career progression is:

```text
Backend Developer Intern
        ↓
Backend Developer, Contract
        ↓
Backend Developer, Full-Time
```

All roles are with the same employer.

V2 must make that progression visually obvious.

---

## 29.1 Employer Grouping

Prefer a single employer story:

```text
ZETTABYTE PTE LTD
2024 — PRESENT
```

Then display role progression inside it.

---

## 29.2 Current Role

Full-time Backend Developer receives the most detail.

Show:

- role;
- date;
- concise summary;
- important responsibilities;
- selected contributions;
- technologies.

---

## 29.3 Contract / Internship

Keep them visible but more compact.

Their main purpose is to demonstrate:

> progression and trust.

Do not hide them entirely.

---

## 29.4 Experience Visual Direction

Possible:

```text
2024
INTERN

↓

2024–2025
CONTRACT

↓

2025–NOW
BACKEND DEVELOPER
```

or a horizontal progression on desktop.

Keep the implementation readable.

No decorative timeline maze.

---

# 30. Selected Work — V2 Priority

The homepage currently has two projects.

That is enough.

Do not manufacture filler projects.

Instead, make each project more significant.

---

## 30.1 Professional Project

### Jury Process Management

Homepage feature should contain:

- professional-work label;
- delivery status;
- project title;
- My Role;
- concise summary;
- core technologies;
- sanitized architecture/workflow visual;
- case-study CTA.

---

## 30.2 Personal Project

### Personal Developer Portfolio

Use a different editorial composition from the professional project.

For example:

```text
Project 1:
[visual] [content]

Project 2:
[content] [visual]
```

This creates visual rhythm.

---

# 31. Project Visual Strategy

This is a **major V2 scope item**.

The portfolio currently contains limited project imagery.

V2 should create safe, purpose-built visuals.

---

## 31.1 Allowed Visual Types

- architecture diagram;
- workflow diagram;
- request lifecycle;
- service interaction;
- background-job flow;
- data-processing flow;
- validation flow;
- CI/CD flow;
- simplified system model.

---

## 31.2 Never Use

- private application screenshots;
- internal architecture screenshots;
- real customer/student information;
- internal URLs;
- IP addresses;
- credentials;
- internal project codes;
- private repository names;
- proprietary database schemas;
- raw company documentation.

---

## 31.3 Sanitization Rule

Professional diagrams must be created from **already approved public/sanitized case-study content**.

Do not inspect private company repositories to reconstruct diagrams for public use.

---

## 31.4 Diagram Style

The diagram style should visually align with V2:

- clean;
- geometric;
- high-contrast;
- restrained;
- minimal;
- readable;
- no unnecessary illustration.

Example conceptual flow:

```text
Client
  ↓
GraphQL API
  ↓
Service Layer
  ↓
MongoDB
  ↘
Background Job
  ↓
Supporting Service
```

This example is illustrative only.

Do not treat it as the actual project architecture.

---

# 32. Projects Index — V2

The Projects Index should become an editorial project archive.

With two projects:

> two balanced large project entries.

Do not render a three-column layout with an empty third position.

---

## Project tile requirements

Every project should expose:

- project type;
- status;
- title;
- My Role;
- concise summary;
- core technologies;
- optional approved visual;
- clear CTA.

---

## No Filters Yet

Do not add:

- search;
- categories;
- filtering;
- sorting controls.

Two projects do not require enterprise inventory management. Civilization will continue without it.

---

# 33. Project Detail — V2 Major Redesign

This is one of the highest-value V2 areas.

The current project case studies contain excellent depth.

Do **not** delete it.

The UX problem is that readers must consume too much text before extracting the strongest evidence.

V2 must introduce:

# **Fast Scan + Deep Dive**

---

# 34. Project Detail Layer A — Fast Scan

At the top, show:

- project title;
- project type;
- status;
- period;
- My Role;
- core stack;
- short summary;
- problem;
- personal responsibility;
- architecture/workflow visual;
- concise outcome/verification evidence.

A recruiter should understand the project from this layer alone.

---

# 35. Project Detail Layer B — Deep Dive

Then provide full technical content.

Preserve:

- Context
- Problem
- Responsibility
- Technical Approach
- Architecture and Workflow
- Challenges
- Decisions and Trade-offs
- Implementation Summary
- Testing and Verification
- Outcome
- AI-Assisted Engineering
- Lessons Learned
- Technology Stack
- Confidentiality Note

Do not remove strong evidence simply to shorten the page.

---

# 36. Project Detail Navigation

Consider a restrained in-page table of contents.

Desktop:

- sticky side index;
- or sticky horizontal mini navigation.

Mobile:

- compact non-obstructive version;
- or simple section list.

Requirements:

- accessible anchors;
- keyboard accessible;
- sticky-header offset respected;
- active section subtle;
- no excessive screen occupation.

---

# 37. Project Detail Visual Rhythm

Do not make every section:

> heading + paragraph + bordered card

Instead vary appropriately:

- large section headings;
- diagrams;
- pull-out decisions;
- comparison blocks;
- rules;
- wide visuals;
- narrow prose.

The page should feel editorial while remaining readable.

---

# 38. Responsibility Must Remain Explicit

Professional project pages must make clear:

> what Randi personally did.

Do not visually merge:

- project result;
- team result;
- personal responsibility.

Responsibility remains a critical credibility constraint.

---

# 39. Skills — V2

Keep the evidence classification system.

Current model avoids:

- percentage bars;
- stars;
- arbitrary scores.

Preserve that philosophy.

---

## 39.1 V2 Visual Grouping

Suggested presentation:

### Core Backend

- Node.js
- TypeScript
- MongoDB
- GraphQL
- REST APIs

### Infrastructure & Quality

- Docker
- Git
- Vitest
- Playwright

### Frontend Capability

- React
- Next.js

### Engineering Workflow

- AI-Assisted Engineering

This is primarily a **presentation grouping**.

Do not modify the underlying domain model unless necessary.

---

## 39.2 Evidence Labels

Retain:

- Strong working skill
- Professional experience
- Currently learning

Present them quietly.

Possible:

```text
Node.js
Strong working skill
```

or compact metadata.

---

# 40. AI-Assisted Engineering — V2

The current workflow model is:

```text
ANALYZE
   ↓
PLAN
   ↓
IMPLEMENT
   ↓
VERIFY
```

Use this as the main visual story.

---

## 40.1 Compact Presentation

Instead of four large equal cards, use a compact workflow.

Each step can reveal:

- tool;
- purpose;
- human responsibility;
- verification method.

---

## 40.2 Interaction

Possible implementation:

- semantic `details`;
- accessible accordion;
- compact expandable item.

Essential information must not require hover.

---

## 40.3 Corrected Assumption

Keep the real corrected-assumption example.

This is valuable engineering evidence because it shows:

- an assumption was wrong;
- tooling was insufficient;
- the issue was identified;
- verification changed.

Consider an editorial block:

```text
WHAT WENT WRONG
WHAT CHANGED
```

---

## 40.4 Tool Logos

Do not add tool logos.

The workflow matters more than vendor branding.

---

# 41. Contact — V2

The site should close confidently.

Possible working statement:

```text
LET'S BUILD
RELIABLE
SYSTEMS.
```

This is working design copy, not mandatory final copy.

Required links:

- Email
- LinkedIn
- GitHub
- Resume

Keep the contact path simple.

---

## No Contact Form

Do not add a contact backend by default.

The current mailto/contact-link model:

- collects no visitor data;
- requires no backend;
- introduces little failure surface.

That remains appropriate.

---

# 42. Footer — V2

Keep the footer restrained.

Possible:

- Randi Fajar Wicaksono
- Backend Developer
- Yogyakarta
- GitHub
- LinkedIn
- Resume
- copyright

Do not build a giant corporate footer.

---

# 43. Responsive Design

V2 must be **mobile-first**.

Do not design desktop and then compress it until it technically fits.

---

## 43.1 Mobile

Requirements:

- no horizontal scroll;
- large headings fit cleanly;
- project visuals remain readable;
- metadata wraps deliberately;
- CTAs remain accessible;
- diagrams have mobile treatment;
- no hover-only information;
- long technical content remains readable;
- navigation remains manageable.

---

## 43.2 Tablet

Tablet must receive deliberate layout decisions.

Do not blindly inherit desktop two-column structures.

---

## 43.3 Desktop

Desktop may use:

- asymmetry;
- large images;
- editorial grid;
- negative space;
- horizontal progression;
- wide diagrams.

But important information must not require an ultrawide display.

---

# 44. Accessibility Requirements

V2 must preserve or improve V1 accessibility.

Required:

- semantic landmarks;
- correct heading hierarchy;
- one meaningful page H1;
- skip-to-content;
- keyboard navigation;
- visible focus;
- accessible menu;
- contrast;
- reduced motion;
- descriptive alt text;
- no hover-only content;
- status not color-only;
- correct link naming;
- mobile zoom/readability;
- accessible diagrams.

---

# 45. Diagram Accessibility

Every architecture or workflow visual requires:

1. useful alt text;
2. adjacent textual explanation when complex;
3. no information conveyed only by color.

A diagram is supplementary evidence.

It must not become the only explanation of the system.

---

# 46. Performance Requirements

V2 should look more premium without becoming unnecessarily heavy.

Preserve:

- Server Components by default;
- static generation;
- optimized images;
- minimal client JavaScript.

Avoid:

- autoplay hero video;
- giant animation libraries without need;
- unnecessary state frameworks;
- third-party trackers;
- huge font payloads;
- oversized imagery;
- client-side layout effects that CSS can handle.

---

## 46.1 Internal Performance Targets

Working quality targets:

```text
LCP <= 2.5s
CLS < 0.1
INP < 200ms
```

Measure honestly.

Do not manipulate test conditions to achieve a green number.

---

# 47. Image Performance

Use:

- responsive images;
- explicit dimensions;
- modern formats;
- lazy loading below fold;
- preload only for genuinely critical hero imagery.

Architecture diagrams should be lightweight.

---

# 48. Existing Architecture to Preserve

V2 is primarily a presentation-layer evolution.

Preserve the general architecture:

```text
Typed Content
      ↓
Zod Validation
      ↓
Cross-Record Validation
      ↓
Selector Layer
      ↓
Server Components
      ↓
Static Pages
```

---

# 49. Domain Guarantees That Must Remain

Preserve:

- publication status;
- delivery status;
- confidentiality class;
- production confirmation;
- project registry;
- active resume model;
- published/sanitized filtering;
- responsibility separation;
- unpublished route protection;
- sitemap exclusion;
- metadata exclusion.

---

# 50. Allowed Architecture Changes

V2 may change:

- presentational component structure;
- layout primitives;
- navigation presentation;
- tokens;
- typography;
- section components;
- project-feature components;
- visual/media components;
- diagram components;
- motion utilities;
- project-detail composition;
- Open Graph design.

---

# 51. Content Schema Changes

Schema changes are allowed only when a real content requirement exists.

Potential legitimate examples:

- public project visual reference;
- diagram caption;
- fast-scan summary;
- safe project focus label.

Before adding a field, Claude must answer:

1. What reader problem does it solve?
2. Why can existing content not solve it?
3. Is it factual?
4. Can it be maintained?
5. Does it increase confidentiality risk?
6. How is it validated?

Never add schema purely to make a component aesthetically convenient.

---

# 52. Explicit V2 Non-Goals

Do not add:

- CMS;
- database;
- auth;
- user accounts;
- admin dashboard;
- comments;
- newsletter;
- blog platform;
- live chat;
- chatbot;
- contact API;
- theme switcher automatically;
- analytics automatically;
- project filters with only two projects;
- fake metrics;
- fake system scale;
- public private-source-code examples;
- Aston Martin branding.

---

# 53. Confidentiality Rules

This remains a public repository.

Never introduce:

- employer source code;
- internal repository names;
- private GitHub links;
- internal tickets;
- internal URLs;
- private IP addresses;
- internal hostnames;
- AWS identifiers;
- customer/student data;
- credentials;
- passwords;
- keys;
- tokens;
- internal emails;
- proprietary PRDs;
- raw AI transcripts;
- internal screenshots;
- unsanitized architecture.

---

# 54. Critical Confidentiality Rule

> **Draft does not mean private.**

Anything committed to this repository must already be safe for the public.

---

# 55. Truthfulness Rules

Never invent:

- user counts;
- latency improvements;
- percentage improvements;
- revenue;
- database scale;
- traffic;
- system scale;
- ownership;
- team size;
- technologies;
- job dates;
- job titles;
- production status;
- outcomes.

The design must become impressive by communicating real evidence better.

Not by manufacturing evidence.

---

# 56. Metadata / Open Graph

V2 should redesign the generated Open Graph card.

Keep it content-driven.

Required:

- Randi Fajar Wicaksono;
- Backend Developer;
- new V2 design language;
- readable social-card hierarchy.

Do not reintroduce hardcoded stale career positioning.

---

# 57. Testing Strategy

Do not remove existing tests simply because the UI changes.

When a V1 test encodes an obsolete visual decision:

1. identify the old requirement;
2. record the superseding V2 decision;
3. update the specification;
4. update the test;
5. verify the new behavior.

---

# 58. V2 Navigation Tests

Cover:

- desktop navigation;
- mobile navigation;
- active section;
- Resume;
- external profiles;
- keyboard operation;
- menu state;
- close behavior.

---

# 59. V2 Homepage Tests

Cover:

- section order;
- Backend Developer identity;
- Hero actions;
- experience progression;
- featured projects;
- skills;
- workflow;
- Contact.

---

# 60. V2 Project Tests

Cover:

- project-count-aware presentation;
- published project visibility;
- unpublished project invisibility;
- project detail route;
- status;
- responsibility;
- visual fallback.

---

# 61. Fast-Scan Layer Test

Project pages should expose important information before deep-dive content.

Verify document order for:

- title;
- status;
- My Role;
- summary;
- stack;
- key responsibility;
- verification/outcome.

---

# 62. Accessibility Tests

Maintain:

- axe;
- heading checks;
- keyboard tests;
- reduced-motion tests;
- mobile-menu tests;
- route accessibility;
- diagram accessibility where automatable.

Do not weaken accessibility thresholds to make V2 pass.

---

# 63. Visual Regression Tests

Consider a small stable set of Playwright screenshots:

- homepage desktop;
- homepage mobile;
- professional project desktop;
- professional project mobile.

Do not snapshot every component.

That would eventually make changing padding feel like negotiating an international treaty.

---

# 64. Manual Visual QA

Review at:

```text
375 px
390 px
768 px
1024 px
1280 px
1440 px
```

Check:

- Hero fold;
- navigation;
- title wrapping;
- progression;
- project layouts;
- diagrams;
- case-study reading;
- Skills;
- Workflow;
- Contact;
- Footer.

---

# 65. Additional Manual QA

Also test:

- keyboard only;
- 200% browser zoom;
- reduced motion;
- slow image loading;
- missing optional media;
- project navigation;
- 404;
- social metadata;
- sitemap;
- Resume links.

---

# 66. V2 Documentation Requirements

Do not silently overwrite V1 product history.

Create V2 documentation.

Recommended:

```text
docs/product/PORTFOLIO_UX_UI_SPEC_v2.0.md
```

---

# 67. Decision Ledger

Record V2 decisions using the existing decision/supplement pattern.

When V2 replaces a V1 visual decision:

> supersede it explicitly.

Do not pretend the previous decision never existed.

---

# 68. Content Authoring Documentation

If V2 introduces diagrams/media, update authoring documentation to cover:

- sanitization;
- visual approval;
- alt text;
- file format;
- image size;
- confidentiality;
- diagrams.

---

# 69. Release Audit

V2 requires a new dated release-audit record.

Production deployment alone does not prove acceptance.

---

# 70. Implementation Strategy

Do not implement V2 in one massive branch.

Use small reviewable PRs.

Follow repository governance.

`production` remains protected.

---

# 71. V2 Phase Plan

## Phase 0 — Baseline

- read current repository;
- run baseline verification;
- resolve residual V1.1 issues;
- capture current visual state.

---

## Phase 1 — UX/UI Design Specification

Before implementation:

- analyze current site;
- analyze Aston Martin reference;
- define visual system;
- define typography;
- define color;
- define grid;
- define spacing;
- define section structure;
- define motion;
- define responsive behavior;
- define project diagram style;
- define page wireframes.

Create:

`PORTFOLIO_UX_UI_SPEC_v2.0.md`

Then stop for Randi's review.

---

## Phase 2 — Design System Foundation

Implement:

- V2 tokens;
- typography;
- surfaces;
- layout primitives;
- button styles;
- links;
- section labels;
- motion utilities.

Do not redesign all pages in the same PR.

---

## Phase 3 — Navigation + Hero + About

Implement:

- navigation;
- mobile menu;
- active states;
- Hero;
- About.

Verify before proceeding.

---

## Phase 4 — Work Experience

Implement:

- employer grouping;
- progression;
- current-role emphasis;
- responsive experience design.

---

## Phase 5 — Selected Work + Projects Index

Implement:

- editorial homepage project modules;
- project visuals;
- count-aware Projects Index.

---

## Phase 6 — Project Detail

Implement:

- new project hero;
- fast-scan layer;
- visual architecture;
- deep-dive layout;
- optional section navigation.

---

## Phase 7 — Skills + Workflow

Implement:

- consolidated Skills presentation;
- evidence labels;
- compact AI workflow;
- corrected-assumption presentation.

---

## Phase 8 — Contact + Footer + Metadata

Implement:

- Contact;
- Footer;
- Open Graph;
- metadata visual updates.

---

## Phase 9 — Hardening

Perform:

- responsive QA;
- accessibility QA;
- reduced-motion QA;
- performance optimization;
- browser testing.

---

## Phase 10 — Release

Run:

- complete CI;
- release checks;
- production deployment;
- manual production verification;
- release audit.

---

# 72. Git / Branch Strategy

Use short-lived task branches.

Examples only:

```text
design/portfolio-v2-spec
feat/v2-design-system
feat/v2-navigation-hero
feat/v2-experience
feat/v2-selected-work
feat/v2-project-detail
feat/v2-skills-workflow
feat/v2-contact
fix/v2-accessibility
```

Follow current repository naming rules if different.

Do not create a long-lived V2 integration branch without an explicit governance decision.

---

# 73. V2 Acceptance Criteria

## V2-AC-001 — Backend Identity

The primary identity is clearly:

> Backend Developer

---

## V2-AC-002 — 30-Second Scan

The homepage exposes:

- identity;
- experience;
- progression;
- stack;
- project evidence;
- Resume;
- Contact.

without opening another page.

---

## V2-AC-003 — Career Progression

The progression:

> Intern → Contract → Full-Time

is visually obvious.

---

## V2-AC-004 — Editorial Project Presentation

Homepage projects are presented as feature stories, not merely identical cards.

---

## V2-AC-005 — Project Fast Scan

A project page exposes key evidence before the deep-dive sections.

---

## V2-AC-006 — Deep Evidence Preserved

Technical depth from V1 remains accessible.

---

## V2-AC-007 — Safe Project Visual

At least the featured professional project has a useful sanitized public diagram or equivalent visual unless Randi explicitly rejects it during design review.

---

## V2-AC-008 — No Confidentiality Regression

No visual or content reveals private company material.

---

## V2-AC-009 — Skills Evidence Model Preserved

No percentages, stars, or fake proficiency scoring.

---

## V2-AC-010 — AI Remains Secondary

AI appears below:

- Experience;
- Projects;
- Skills.

and does not visually dominate.

---

## V2-AC-011 — Original Identity

The site feels inspired by premium editorial/motorsport presentation but not like an Aston Martin clone.

---

## V2-AC-012 — Responsive

Homepage, Projects, and Project Detail work intentionally on:

- mobile;
- tablet;
- desktop.

---

## V2-AC-013 — Accessible

Current accessibility guarantees remain intact or improve.

---

## V2-AC-014 — Reduced Motion

All non-essential motion respects user preference.

---

## V2-AC-015 — Performance

V2 does not require unnecessary client-side weight.

---

## V2-AC-016 — Publication Safety

Draft/private/restricted projects remain absent from:

- UI;
- routes;
- sitemap;
- metadata.

---

## V2-AC-017 — Quality Gates

All relevant automated quality gates pass.

---

## V2-AC-018 — Production Verification

The deployed production site is manually verified.

---

# 74. Definition of Done

V2 is complete only when:

- V2 UX/UI design is approved;
- design system is implemented;
- Hero is redesigned;
- Experience progression is visually clear;
- Selected Work uses editorial presentation;
- project visuals exist safely;
- Project Detail supports fast scan + deep dive;
- Projects Index adapts correctly;
- Skills are easier to scan;
- AI workflow is compact;
- Contact is backend-first;
- navigation is contextual;
- responsive layouts are intentional;
- motion is restrained;
- reduced motion works;
- accessibility passes;
- performance remains healthy;
- metadata is updated;
- confidentiality passes review;
- tests pass;
- release documentation is updated;
- production is manually verified.

---

# 75. What Claude Must Do First

**Do not start implementation immediately.**

The first V2 session is for:

> Analysis → Design → Specification

Claude must first:

1. Read this handoff completely.
2. Read `CLAUDE.md`.
3. Inspect latest `production`.
4. Read current repository governance.
5. Read V1 PRD.
6. Read FAC.
7. Read NFAC.
8. Read current UX/UI specification.
9. Read technical design.
10. Read product model.
11. Read decision ledger.
12. Read architecture.
13. Read content-authoring rules.
14. Read release checklist.
15. Read release audit.
16. Inspect recent V1.1 commits.
17. Inspect current homepage.
18. Inspect Projects Index.
19. Inspect project detail.
20. Inspect Experience.
21. Inspect Skills.
22. Inspect AI workflow.
23. Inspect Contact.
24. Inspect tests.
25. Inspect current portfolio visually.
26. Analyze the Aston Martin F1 reference.
27. Identify which V1 decisions remain valid.
28. Identify which V1 visual decisions V2 supersedes.
29. Identify conflicts.
30. Create V2 design analysis.
31. Create V2 UX/UI specification.
32. Present it for Randi's review.
33. **STOP.**

Do not write V2 implementation code before design approval.

---

# 76. Required First-Session Output

Claude must produce:

```markdown
# Portfolio V2 Analysis

## 1. Current Production State

## 2. V1 / V1.1 Strengths to Preserve

## 3. V1.1 Residual Issues

## 4. Aston Martin Reference Analysis
### Principles to Adapt
### Elements Not to Copy

## 5. Proposed V2 Design Direction

## 6. Information Architecture

## 7. Homepage Design

## 8. Experience Design

## 9. Selected Work Design

## 10. Projects Index Design

## 11. Project Detail Design

## 12. Project Visual Strategy

## 13. Skills Design

## 14. Engineering Workflow Design

## 15. Contact / Footer Design

## 16. Design System
### Color
### Typography
### Grid
### Spacing
### Surface
### Components
### Motion

## 17. Responsive Strategy

## 18. Accessibility Strategy

## 19. Performance Strategy

## 20. Architecture Impact

## 21. Content Model Impact

## 22. Testing Impact

## 23. Documentation Impact

## 24. Risks

## 25. Non-Goals

## 26. Implementation Phases

## 27. Decisions Requiring Randi Approval
```

---

# 77. Required UX/UI Specification

Create:

```text
docs/product/PORTFOLIO_UX_UI_SPEC_v2.0.md
```

It must describe:

- visual direction;
- page layout;
- component behavior;
- responsive states;
- motion;
- accessibility;
- project diagrams;
- interaction;
- navigation;
- typography;
- colors;
- spacing;
- fast-scan experience;
- deep-dive experience.

---

# 78. Design Review Gate

Before implementation, Randi must be able to review:

- homepage desktop;
- homepage mobile;
- navigation;
- Hero;
- About;
- Experience;
- project feature;
- Projects Index;
- project-detail fast scan;
- deep-dive structure;
- diagram style;
- Skills;
- Workflow;
- Contact;
- Footer;
- colors;
- typography;
- motion.

Where possible, provide real local mockups/screenshots.

A major visual redesign should not be approved from prose alone.

---

# 79. Expected Final Implementation Report

At the end of V2:

```markdown
# Portfolio V2 Implementation Report

## Summary

## Goals Achieved

## Final Design Direction

## Final Information Architecture

## Design System

## Pages Updated

## Components Added / Changed

## Content Model Changes

## Project Visuals

## Responsive Review

## Accessibility Review

## Performance Review

## Confidentiality Review

## Tests

## CI / Release Verification

## Production Verification

## Files Changed

## Decisions Added / Superseded

## Deferred Work

## Remaining Risks

## Final Release Result
```

---

# 80. Suggested Initial Claude Prompt

```text
We are starting Developer Portfolio V2.

This is a NEW Claude session in the existing portfolio workspace.

Do not assume context from previous Claude sessions unless it is documented
in the repository.

Base branch:
production

V2 handoff:
<PATH_TO_V2_HANDOFF>

Current production portfolio:
https://developer-portfolio-delta-three.vercel.app/

Primary UI/UX reference:
https://www.astonmartinf1.com/en-GB

The Aston Martin F1 website is a design-language reference only.

Do not copy:
- its branding
- logo
- exact colors
- proprietary fonts
- assets
- exact layouts
- exact animations
- copy

The purpose of V2 is to evolve the existing portfolio from a strong
technical/evidence portfolio into a premium editorial engineering portfolio.

V1 and V1.1 already established important engineering guarantees that must
be preserved:

- typed content
- Zod validation
- cross-record validation
- selector-based publication filtering
- confidentiality classes
- publication status
- delivery status
- production confirmation
- project responsibility separation
- static generation
- unpublished-route protection
- sitemap/metadata protection
- accessibility
- testing
- CI/CD
- release verification

DO NOT IMPLEMENT ANYTHING YET.

First:

1. Read this handoff completely.
2. Read CLAUDE.md.
3. Inspect the current production branch.
4. Read all relevant product, architecture, governance, content-authoring,
   testing, and release documents.
5. Review recent V1.1 commits.
6. Inspect the current live portfolio visually.
7. Inspect the Aston Martin F1 reference.
8. Identify the design principles we can adapt without copying branding.
9. Identify V1/V1.1 decisions that remain valid.
10. Identify V1 visual decisions that V2 should supersede.
11. Identify any conflict between the V2 handoff and repository source of truth.
12. Produce the required Portfolio V2 Analysis.
13. Create PORTFOLIO_UX_UI_SPEC_v2.0.md.
14. Prepare the design-review package.

Then STOP.

Do not write V2 implementation code before I review and approve the design.

The target experience is:

precision + engineering + performance + restraint.

The portfolio must let a recruiter understand my strongest backend engineering
evidence in roughly 30 seconds while allowing technical interviewers to go
deep into architecture, responsibility, decisions, testing, verification,
and lessons learned.

Do not make the portfolio more impressive by inventing metrics.

Do not expose private company information to make project visuals richer.

Make the real evidence easier to understand and more memorable.
```

---

# 81. Final V2 Principle

V1 proved the substance.

V1.1 clarified the positioning.

V2 must make the substance:

> **memorable without making it noisy.**

For every V2 decision, ask:

> Does this help a recruiter or engineer understand Randi's backend engineering evidence faster or more clearly?

If yes, explore it.

If it only makes the portfolio busier, remove it.

# **Precision over spectacle.**

# **Evidence over decoration.**

# **Performance without noise.**
::: ​​