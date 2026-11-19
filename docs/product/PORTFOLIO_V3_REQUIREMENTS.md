# Portfolio V3 — Master Product, Content & Cinematic Design Requirements

> **Repository copy, 2026-11-19.** Randi's V3 requirements as he supplied them on
> 18 November 2026, with one change by his decision: the design reference, a real
> motorsport team's driver-profile page, is described generically instead of
> named. The named original is kept privately, outside the repository.
>
> The document information below is the document's own, as of that date. Since
> then the V3.1 mockup and the V3 implementation plan were approved (2026-11-18),
> and implementation is under way on `staging`. Where the plan's decisions or the
> approved mockup differ from these requirements, they govern; the UX/UI
> specification v3.0 lists the differences.

**Version:** 1.0  
**Date:** 18 November 2026  
**Status:** Requirements approved for mockup exploration; visual design and implementation are not yet approved  
**Owner:** Randi Fajar Wicaksono  
**Existing website:** https://randi-fajar-wicaksono.vercel.app/  
**Repository:** https://github.com/randifajar/developer-portfolio  
**Primary reference:** a motorsport team's driver-profile page (see the note above)

---

# 1. Project Vision

Create a personal software engineering portfolio inspired by the **structure and cinematic experience of a motorsport driver-profile page**.

The portfolio must introduce Randi Fajar Wicaksono as a person and engineer, tell his professional story, showcase his work, and provide clear paths to explore his different engineering specializations.

This is not a traditional developer dashboard, technology showcase, or animated résumé template.

It should feel like a **premium personal profile with genuine engineering substance**.

## 1.1 Design principles

The design must follow five principles.

### Cinematic

The website unfolds like a carefully directed story.

Use immersive section transitions, refined loading behavior, scroll-driven storytelling, controlled typography animation, and subtle visual depth.

Movement must make the content more engaging rather than simply demonstrate animation techniques.

### Elegant

Use sophisticated typography, restrained colors, balanced compositions, intentional spacing, and strong visual hierarchy.

The experience should feel mature, professional, and timeless.

### Minimalist

Every element must serve a purpose.

Avoid excessive cards, decorative graphics, unnecessary statistics, redundant descriptions, crowded headers, and technology badges.

A single compelling headline should be more important than a collection of visual effects.

### Personal

The main subject is Randi, not Node.js, Jenkins, or any particular technology.

Visitors should understand his background, motivation, engineering journey, strengths, and career direction.

### Content-first

Professional content is the foundation of the design.

The website must communicate real experience, engineering decisions, verified results, and meaningful lessons.

Visual presentation supports that content, never replaces it.

---

# 2. Primary Design Reference

## 2.1 The driver-profile reference

Reference: a motorsport team's driver-profile page. The address is kept in the private original.

Study the actual page structure and its interaction behavior.

The most important structural inspiration is:

1. Personal identity and hero
2. Short introduction and key facts
3. Biography
4. Meaningful career facts or achievements
5. Personal statement or philosophy
6. Chronological career highlights
7. Related stories and content
8. Clear onward navigation

Adapt this structure to a software engineering portfolio.

The website should feel like a personal biography accompanied by professional evidence.

## 2.2 What to borrow

- Strong personal introduction
- Large editorial headings
- Clear separation between narrative chapters
- Full-screen or generously spaced sections
- Chronological career storytelling
- Prominent career milestones
- Scroll-based visual progression
- Meaningful transition between sections
- Related-content navigation
- Deliberate pacing and negative space

## 2.3 What not to copy

- The reference team's trademarks and branding
- Motorsport racing imagery
- Proprietary photographs
- Exact typography or logo treatment
- Exact component layouts
- Racing-specific statistics
- Commercial promotional sections
- Unnecessary photography density

The result must have an original identity.

**Important:** The primary reference is the driver-profile page, not the team's general homepage.

---

# 3. Visual Identity

## 3.1 Approved direction

**Cinematic Blue Editorial**

The visual identity combines:

- Cinematic storytelling
- Elegant editorial composition
- Minimalist presentation
- Signature blue from the existing portfolio
- A warm, human atmosphere
- Strong personal identity

Warmth should come primarily from photography, natural composition, and the writing style.

Do not convert the website into a predominantly beige or brown design.

## 3.2 Color palette

Use the existing portfolio's blue identity as the starting point.

| Role | Initial color |
|---|---|
| Primary brand blue | `#2563EB` |
| Light blue for dark surfaces | `#60A5FA` |
| Dark background | `#0B0F14` |
| Main light background | `#F8FAFC` |
| Primary dark text | `#111827` |
| Secondary text | Muted neutral gray |
| Light text | Off-white |

These are initial design tokens, subject to contrast validation and visual refinement.

### Color rules

Blue should be used for selected emphasis, links, active navigation, meaningful highlights, and restrained animation details.

Do not create separate blue, orange, or green branding for different career modes.

All three modes share **one consistent visual identity**.

Avoid neon effects, cyberpunk gradients, glowing interfaces, and excessive colored outlines.

## 3.3 Typography

Typography should carry much of the cinematic character.

Propose a refined display typeface for major headlines and a highly readable sans-serif for content.

A serif display typeface may be explored if it improves the premium editorial aesthetic.

Use:

- Large personal headlines
- Strong contrast between display text and body copy
- Short supporting statements
- Carefully controlled line breaks
- Elegant editorial section numbering
- Readable project descriptions

Monospace typography may appear in technical metadata, but must not dominate the interface.

## 3.4 Layout

Use generous negative space and clear composition.

Favor:

- Full-width hero sections
- Editorial text columns
- Carefully balanced split layouts
- Large typographic sections
- Selective sticky content
- Clean transitions between dark and light surfaces

Avoid repetitive grids of identical cards.

---

# 4. Photography and Media Constraints

## 4.1 Available photography

**Only one personal photograph will be provided.**

This is a strict constraint.

The design must work beautifully without requiring any additional personal photos.

## 4.2 Image usage

Use the photograph as the main visual asset for the Overall hero.

Claude should design the hero around the actual image's dimensions, composition, and subject placement when it becomes available.

Do not:

- Request an entire personal photo gallery.
- Invent additional portraits.
- Repeatedly use the same photo in every section.
- Use stock portraits to represent Randi.
- Fill the site with generic stock images.
- Recreate the reference page's photography collection.

If the image has not been supplied during mockup creation, show a clearly labeled placement area with correct layout proportions. Do not invent Randi's appearance.

## 4.3 Cinematic design without additional pictures

The rest of the website should achieve cinematic quality primarily through:

- Typography
- Scroll transitions
- Motion timing
- Negative space
- Layout changes
- Large chronological dates
- Content reveals
- Subtle background transitions
- Minimal graphical structure

Project case studies may use approved technical screenshots or original diagrams when those assets genuinely explain the work.

They must not be decorative filler.

---

# 5. Website Architecture

## 5.1 Required routes

| Route | Page | Purpose |
|---|---|---|
| `/` | Overall | Complete professional biography and engineering journey |
| `/backend` | Backend | Backend engineering specialization |
| `/infrastructure` | Infrastructure | Infrastructure, delivery, operations, and reliability experience |
| `/projects` | Projects | Browse eligible published projects and case studies |
| `/projects/[slug]` | Project Detail | Read an individual engineering case study |
| `/resume.pdf` | Résumé | Access the current approved résumé |

Contact information should be accessible from every page through shared navigation and/or a shared contact section.

## 5.2 Global navigation

The navigation must include:

- Personal identity or compact logo
- **Overall**
- **Backend**
- **Infrastructure**
- Projects
- Contact
- Résumé

The three modes form a distinctive interactive selector in the header.

Projects and Contact should remain visually secondary to this selector, without becoming difficult to find.

The header must remain consistent throughout the website.

## 5.3 Page relationships

The visitor journey should follow:

**Discover the engineer → Explore a specialization → Review professional work → Read technical case studies → Connect.**

Visitors must also be able to enter at any individual page through a direct URL.

The website must not force everyone to begin at Overall.

---

# 6. Signature Feature: Three-Mode Navigation

## 6.1 Required modes

The portfolio contains three professional perspectives:

**Overall | Backend | Infrastructure**

These are three ways of exploring the same engineer.

They are not different professional identities.

| Mode | Main narrative |
|---|---|
| Overall | The complete engineering journey |
| Backend | Application systems, integrations, data, and backend engineering decisions |
| Infrastructure | Delivery, deployment, operations, troubleshooting, and reliability |

Each mode must show distinct content while preserving one consistent personal brand.

## 6.2 Proposed hero messages

### Overall

**Eyebrow:** Software Engineering

**Headline:** The engineering journey.

**Description:** The complete story of my work across backend development and infrastructure.

### Backend

**Eyebrow:** Backend Engineering

**Headline:** Behind the application.

**Description:** The systems, integrations, and technical decisions behind the software I build.

### Infrastructure

**Eyebrow:** Infrastructure & Reliability

**Headline:** Beyond deployment.

**Description:** The pipelines, operational challenges, and reliability practices shaping my engineering journey.

These are proposed messages, not yet approved final copy.

The homepage should still identify **Randi Fajar Wicaksono** prominently, regardless of which editorial headline is chosen.

## 6.3 Mode transition requirement

**Switching modes must produce a cinematic visual transition.**

The experience should feel like the visitor is changing chapters of a single biography.

It should not feel like navigating to an unrelated website.

### Required transition sequence

**Stage 1 — Selection**

The visitor selects another mode.

The active selection indicator moves smoothly toward the chosen mode.

**Stage 2 — Exit**

The current hero heading and supporting text begin a subtle exit animation.

The motion should be controlled, with minimal movement and no jarring distortion.

**Stage 3 — Transformation**

The visual composition transitions toward the destination mode.

This may involve:

- A subtle background shift
- A typography mask
- A refined crossfade
- Repositioning of decorative elements
- Coordinated movement of the active indicator

Avoid large colored wipes that cover the entire screen.

**Stage 4 — Entrance**

The destination heading appears through a refined text reveal.

The description and primary action follow in a controlled sequence.

**Stage 5 — Ready**

The selected mode's content, project highlights, and professional narrative are available.

The URL reflects the destination route.

### Timing guidance

Target approximately **500–800 milliseconds** for the combined visual experience, subject to testing.

Do not introduce an artificial delay just to complete the animation.

The transition must be interruptible and should not block navigation.

## 6.4 Technical and usability behavior

- Overall opens `/`.
- Backend opens `/backend`.
- Infrastructure opens `/infrastructure`.
- Each route supports direct navigation and refresh.
- Browser back and forward work normally.
- The active mode remains visibly indicated.
- The header stays stable during transitions.
- Keyboard navigation remains functional.
- Focus is managed appropriately after navigation.
- Reduced-motion users receive an immediate or minimally animated transition.
- Route failure or animation failure cannot leave a full-screen overlay covering the site.

### Scroll position

When changing modes, the default behavior is to return to the destination hero.

When following a specific anchor or deep link, navigation should target the requested section.

Browser history restoration should remain predictable.

## 6.5 One identity across every mode

The mode switch may change:

- Hero headline
- Supporting text
- Featured professional contributions
- Skills emphasis
- Career narrative focus
- Project selection
- Section order where appropriate

It must not change:

- Actual employment dates
- Historical job titles
- Project outcomes
- Project delivery status
- Verified responsibilities
- Personal identity
- Fundamental visual branding

---

# 7. Overall Page Requirements

**Route:** `/`

## 7.1 Purpose

Introduce Randi as a software engineer whose professional experience began in backend development and expanded into infrastructure engineering.

The Overall page should feel closest to the driver-profile reference.

This is the most important page in the experience.

## 7.2 Scene 01 — Personal Hero

### Content

- Randi Fajar Wicaksono
- Proposed identity: Software Engineer — Backend & Infrastructure
- Short, meaningful personal positioning statement
- One personal photograph
- Three-mode selector
- Primary CTA: Explore My Journey
- Secondary CTA: View My Work or Résumé

### Design

- Cinematic full-viewport composition
- Large, elegant typography
- Personal photograph positioned intentionally
- Restrained signature-blue details
- Minimal supporting text
- Subtle scroll indicator
- No technology-logo collection
- No floating statistics
- No excessive decorative graphics

### Animation

- Brief entrance sequence
- Refined name reveal
- Subtle photograph reveal
- Supporting copy appears afterward
- Scroll indicator introduces the next chapter

## 7.3 Scene 02 — Biography

### Purpose

Tell the professional story in a personal voice.

### Content requirements

Explain:

- How Randi entered software development
- His backend engineering foundation
- How his responsibilities developed
- His growing involvement with infrastructure
- His interest in understanding systems beyond application code
- His direction as an engineer

Avoid generic inspirational writing and exaggerated personal branding.

The writing should sound like a real engineer explaining his development, not a marketing agency inventing a personality.

### Design

Primarily typography.

Use a refined editorial layout with a strong introductory statement and readable supporting paragraphs.

No additional personal photograph.

## 7.4 Scene 03 — Selected Professional Facts

Use only facts that help visitors understand professional experience.

Potential information:

- Professional engineering experience
- Primary engineering disciplines
- Current or most recent professional responsibilities
- Selected published case studies

Avoid turning ordinary facts into artificial achievements.

For example, working across four environments may be useful context, but it is not automatically an impressive engineering outcome.

No unnecessary counters.

## 7.5 Scene 04 — Engineering Philosophy

Include a short personal statement about how Randi approaches engineering.

Potential themes:

- Understanding the problem before writing code
- Verifying changes instead of assuming success
- Learning from operational failures
- Considering reliability and security
- Understanding the complete software lifecycle

Claude may propose wording, but Randi must approve anything presented as a personal quotation.

Do not fabricate a direct quote.

## 7.6 Scene 05 — Career Journey

This is the central scroll-driven storytelling section.

### Proposed career progression

**2024 — The Foundation**

Backend development, early professional experience, application logic, APIs, databases, and learning through real work.

**2025 — Growing as a Backend Engineer**

Expanded responsibilities, integration work, more complicated application behavior, data processing, and technical troubleshooting.

**2026 — Beyond the Application**

Greater involvement with infrastructure, CI/CD, deployment workflows, environment operations, and reliability thinking.

The exact start date of infrastructure responsibilities must be confirmed against the professional records before publication.

### Design requirements

Use a chronological editorial structure inspired by the reference driver-profile career highlights.

The timeline should:

- Feature prominent years or dates
- Present concise career headlines
- Describe meaningful professional developments
- Reveal the progression as the visitor scrolls
- Use typography and composition instead of a photo for every milestone
- Include relevant links to deeper work

### Animation requirements

Desktop may use selective sticky or pinned storytelling.

As the visitor scrolls:

1. A career chapter becomes active.
2. The year and headline transition.
3. Supporting text is introduced.
4. The next chapter takes its place.
5. The sequence eventually releases into the following section.

The animation must support reverse scrolling.

Do not create an excessively long scroll distance for a small amount of text.

On mobile and in reduced-motion mode, provide a normally flowing chronological layout.

## 7.7 Scene 06 — Selected Engineering Work

Show a carefully curated combination of backend and infrastructure experience.

Featured work should focus on meaningful engineering problems rather than the number of technologies used.

Each item should present:

- Project title
- Short context
- Problem
- Randi's personal contribution
- Important decision or tradeoff
- Verified outcome
- Link to full case study

### Visual presentation

Use large, minimalist editorial project showcases.

No dense wall of cards.

Each project should have its own visual hierarchy.

Technical diagrams are optional and must be accurate, public-safe, and useful.

## 7.8 Scene 07 — Related Content

Inspired by the related-content section of the reference profile.

Provide clear paths to:

- Backend
- Infrastructure
- Projects
- Résumé
- Contact

These should feel like the natural continuation of the professional story.

## 7.9 Scene 08 — Contact

Finish with a simple and memorable closing section.

Include:

- Email
- GitHub
- LinkedIn
- Résumé
- Location where appropriate
- Accurate professional availability statement

No lengthy decorative animation should delay contact actions.

---

# 8. Backend Page Requirements

**Route:** `/backend`

## 8.1 Purpose

Present Randi's backend engineering experience in detail.

This page must demonstrate actual engineering capability and professional responsibility.

It should use the same cinematic editorial language as Overall, without repeating the entire biography.

## 8.2 Content structure

### Scene 01 — Backend Hero

Headline:

**Behind the application.**

Include concise positioning around backend development, APIs, databases, integrations, and application behavior.

Use typography as the primary visual element.

No additional portrait required.

### Scene 02 — Backend Engineering Overview

Explain the kinds of systems and problems Randi has worked on.

Focus areas may include:

- Node.js and TypeScript
- GraphQL and REST APIs
- MongoDB and data processing
- Background jobs
- Service integrations
- Application troubleshooting
- Testing and verification

Do not present this as a large technology-logo grid.

### Scene 03 — Featured Backend Work

Lead with the approved and published **Jury Process Management Integration** case study if its current publication status remains eligible.

Preserve the verified scope and delivery status.

Explain the actual engineering problem, including workflow coordination and asynchronous processing where supported by approved content.

Do not claim a production release or measured performance improvement unless evidence supports it.

### Scene 04 — Backend Experience

Show relevant professional contributions from the canonical employment records.

Preserve actual employment dates, titles, and relationships.

Prioritize contributions over generic job descriptions.

### Scene 05 — Engineering Practices

Cover relevant practices such as:

- Validation
- Business rule handling
- Database query design
- Asynchronous workflows
- Error handling
- Debugging
- Testing
- Security considerations

Use examples from actual work.

### Scene 06 — Related Projects and Contact

Provide links to:

- Backend-relevant project details
- All Projects
- Overall
- Infrastructure
- Résumé
- Contact

---

# 9. Infrastructure Page Requirements

**Route:** `/infrastructure`

## 9.1 Purpose

Present the expansion of Randi's engineering experience into infrastructure, delivery systems, troubleshooting, and reliability.

This page should be substantial, not a collection of empty placeholders.

At the same time, do not exaggerate his professional background or claim a formal SRE position without supporting evidence.

## 9.2 Content structure

### Scene 01 — Infrastructure Hero

Headline:

**Beyond deployment.**

Describe the transition from backend engineering into delivery infrastructure and operational problem-solving.

Use cinematic typography and restrained motion.

### Scene 02 — The Transition

Explain:

- Why the work expanded beyond backend applications
- How deployment and operational concerns became more important
- What infrastructure responsibilities Randi actually undertook
- How backend knowledge contributes to infrastructure work
- What he wants to learn next

This must be personal and accurate.

### Scene 03 — Infrastructure Engineering Work

Potential professional subjects for verification and public-safe writing:

**CI/CD Engineering**

- Jenkins pipeline implementation and improvements
- Build and deployment automation
- Pipeline quality verification
- Security scanning integration
- Workflow troubleshooting

**Environment Operations**

- Linux servers
- Docker-based services
- Application deployment environments
- Configuration and environment issues
- Deployment verification

**Operational Troubleshooting**

- Resource constraints
- Service failures
- Background processing problems
- CI/CD failures
- Multi-environment debugging

Each contribution must identify:

- The problem
- Randi's responsibility
- The engineering approach
- Validation
- Outcome
- Team boundaries

Do not reveal confidential Jenkins job names, hosts, credentials, client information, infrastructure addresses, or proprietary configurations.

### Scene 04 — Reliability and Incident Thinking

Present a small number of approved, sanitized professional examples.

Use an incident-style narrative:

1. Situation
2. Symptoms
3. Investigation
4. Evidence
5. Action
6. Verification
7. Lessons learned

Do not claim incident ownership where the work was limited to investigation or assistance.

### Scene 05 — Selected Infrastructure Projects

Prioritize verified professional infrastructure contributions once approved for public use.

The delivery workflow of the personal portfolio can appear as supporting evidence.

It should not overshadow more meaningful professional work.

### Scene 06 — Current Learning

Clearly distinguish:

- Tools used professionally
- Topics practiced personally
- Concepts currently being studied

Kubernetes, observability, and SRE fundamentals may appear only with accurate experience labels.

Do not portray production Kubernetes ownership or SRE responsibility without evidence.

### Scene 07 — Related Content and Contact

Provide links to:

- Relevant infrastructure projects
- Overall
- Backend
- Projects
- Résumé
- Contact

---

# 10. Projects Index Requirements

**Route:** `/projects`

## 10.1 Purpose

Provide an editorial index of published engineering work.

It must support exploration without becoming a generic portfolio card grid.

## 10.2 Content

Each project preview should include:

- Project title
- Engineering discipline
- Concise summary
- Personal role
- Important problem or contribution
- Verified project status
- Technologies where useful
- Case-study link

## 10.3 Filtering

Support:

- All Projects
- Backend
- Infrastructure

Filters should use canonical project classification.

A project may belong to more than one category.

Filtering must not duplicate the underlying project record or alter its facts.

If there are too few published projects to justify visible filtering, provide a simpler editorial listing without inventing entries.

## 10.4 Navigation

- Click a project to open `/projects/[slug]`.
- Return from the detail page to the relevant projects listing.
- Preserve filtering context when practical.
- Keep global navigation and contact available.
- Ensure every project supports a direct URL.

---

# 11. Project Detail Page Requirements

**Route:** `/projects/[slug]`

## 11.1 Purpose

Demonstrate real engineering depth.

Project details should satisfy a technical interviewer who wants to understand what Randi did and why.

## 11.2 Content hierarchy

### Section 01 — Project Hero

- Title
- Short engineering summary
- Project category
- Role
- Delivery status
- Key verified technologies

### Section 02 — Context

Explain the product or system at a safe level of detail.

### Section 03 — Engineering Problem

What needed to be solved?

Why was it difficult?

### Section 04 — Responsibilities

Distinguish:

- Personal contributions
- Team contributions
- Responsibilities owned by other functions

### Section 05 — Architecture or Workflow

Use written explanations and technical diagrams where appropriate.

Only public-safe material may be included.

### Section 06 — Decisions and Tradeoffs

Describe genuine technical decisions.

Explain why a chosen approach made sense and what limitations it introduced.

### Section 07 — Implementation

Explain the relevant engineering approach without exposing confidential source code or internal architecture.

### Section 08 — Challenges

Describe meaningful problems, failures, and troubleshooting work.

### Section 09 — Testing and Verification

Explain what was actually verified, in which type of environment, and by whom where appropriate.

### Section 10 — Outcome

Present the verified result.

Do not invent metrics or imply production adoption without evidence.

### Section 11 — Lessons Learned

Explain the engineering insight gained.

### Section 12 — Continue Exploring

Offer:

- Back to Projects
- Related project
- Relevant engineering mode
- Contact

## 11.3 Design

The detail page should retain the cinematic editorial design language but prioritize readability.

Long technical text is appropriate here.

Use animation sparingly around technical explanations, code samples, diagrams, and tables.

---

# 12. Cinematic Motion System

## 12.1 Motion philosophy

Motion should feel:

- Deliberate
- Smooth
- Refined
- Continuous
- Responsive
- Interruptible
- Accessible

Avoid animation for its own sake.

## 12.2 Required motion types

### Opening animation

A short initial sequence that establishes the identity and resolves naturally into the hero.

Do not use a separate blocking splash screen.

Do not use fake loading percentages.

### Mode switching

A coordinated transition between Overall, Backend, and Infrastructure.

This is a signature interaction and must be demonstrated in the mockup.

### Text reveal

Large headings may appear through subtle masking, opacity, or restrained movement.

### Scroll storytelling

Career milestones and important narrative sections may use scroll-linked transitions.

### Section transitions

Create continuity between chapters with meaningful changes in spacing, typography, surface color, and composition.

### Project reveals

Introduce featured projects through controlled editorial transitions.

### Navigation transitions

Page changes should feel connected while respecting real routes, browser history, and accessibility.

## 12.3 Scroll rules

- Prefer native scrolling.
- No full-site scroll hijacking.
- No mandatory horizontal scrolling.
- No unnecessary pinned sequences.
- No giant empty scroll distances.
- No hidden content requiring a specific scrolling gesture.
- Reversing scroll direction must produce coherent states.
- Mobile must remain naturally scrollable.

## 12.4 Reduced motion

Respect `prefers-reduced-motion`.

Replace complex effects with static content or minimal transitions.

All information and navigation must remain available.

## 12.5 Error tolerance

Animation failure must not break the website.

Content should remain visible and navigable when animation code fails or cannot load.

---

# 13. Responsive Design

## Desktop

- Full cinematic composition
- Large typography
- Prominent three-mode header
- Selective sticky storytelling
- Generous editorial layouts

## Tablet

- Adapted typography
- Reduced complexity
- Readable content columns
- Simplified pinned interactions where needed

## Mobile

- Clear, touch-friendly mode selector
- Accessible main navigation
- Responsive typography
- Naturally flowing career timeline
- Minimal decorative animation
- No oversized pinned sequences
- Direct access to projects and contact

Do not simply compress the desktop design.

The mobile experience must be deliberately composed.

---

# 14. Accessibility and Performance

The portfolio must remain usable with:

- Keyboard-only navigation
- Screen readers
- Reduced-motion preferences
- Mobile devices
- Browser zoom
- Slow network connections
- Animation failures

## Accessibility requirements

- Semantic landmarks and headings
- Meaningful link labels
- Visible focus indicators
- Accessible mode selector
- Proper focus handling on navigation
- Sufficient contrast
- Alt text for informative images
- No essential content inside decorative canvas-only animations
- No inaccessible pinned content
- No animation-dependent access to links or information

## Performance objectives

Target:

- LCP ≤ 2.5 seconds
- INP ≤ 200 ms
- CLS ≤ 0.1
- Lighthouse accessibility ≥ 95
- Lighthouse performance target ≥ 90 on representative mobile testing

These objectives must be assessed during implementation planning and validation, not treated as proven results of the mockup.

Prioritize a fast and readable site over expensive effects.

---

# 15. Content Governance

## 15.1 Canonical data

Keep one authoritative source for:

- Personal information
- Employment history
- Project records
- Skills
- Professional experience
- Project delivery status
- Confidentiality classification
- Publication eligibility

The three modes must reference that information rather than create competing copies.

## 15.2 Career chronology

Preserve verified dates and job titles from the existing records.

The proposed public identity **Software Engineer — Backend & Infrastructure** is an editorial positioning statement.

It must not silently replace formal historical job titles.

Confirm the infrastructure transition date, current title, employment status, and public résumé wording before final publication.

## 15.3 Evidence requirements

Never invent:

- Quantified improvements
- Performance numbers
- Availability metrics
- Deployment results
- Certifications
- Production ownership
- Official job titles
- Customer details
- Project delivery status

An unverified claim should be marked for owner review rather than presented as fact.

## 15.4 Confidentiality

Never expose:

- Internal domains or hostnames
- Credentials or secrets
- Private repositories
- Customer data
- Internal project identifiers
- Sensitive infrastructure topology
- Private architecture diagrams
- Proprietary operational procedures

Sanitize professional examples before placing them in any publicly accessible repository, including mockup documents committed to public branches.

## 15.5 Editorial tone

Use:

- First-person storytelling where appropriate
- Clear, natural English
- Specific engineering experiences
- Modest, confident professional language
- Concise headlines
- Evidence-backed technical explanations

Avoid:

- Generic motivational quotes
- Exaggerated seniority
- Empty marketing language
- Excessive technical jargon in introductory sections
- Long paragraphs on cinematic pages

---

# 16. Existing Technology and Architecture

Keep the current Next.js application.

Do not migrate to another framework.

Preserve the current:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Content validation
- Publication and confidentiality logic
- Testing infrastructure
- Existing CI/CD controls
- Vercel deployment workflow

GSAP and ScrollTrigger may be evaluated after mockup approval if they are genuinely needed for the cinematic interaction.

Native CSS animations should be preferred for simple interface transitions.

Do not introduce an unnecessary custom scrolling engine.

Do not add a backend, CMS, or database for this redesign.

---

# 17. Mockup Requirements

**Claude must create and demonstrate mockups before implementing the production redesign.**

A textual description alone is not sufficient.

The mockup must show the actual visual composition, content hierarchy, navigation, and motion behavior.

## 17.1 First review: core cinematic experience

Create a high-fidelity interactive concept demonstrating:

### A. Overall hero

- Personal identity
- One photograph placement
- Signature blue
- Elegant typography
- Minimal navigation
- Cinematic opening

### B. Interactive three-mode selector

Demonstrate actual transitions between:

- Overall
- Backend
- Infrastructure

The active indicator and hero content must animate together.

### C. Biography

Show the editorial layout using meaningful, proposed content.

### D. Career journey

Demonstrate at least three sequential scroll states:

- Backend foundation
- Growing responsibilities
- Infrastructure transition

### E. Featured project

Show one minimalist, editorial case-study preview and its navigation into project details.

### F. Mobile concept

Show the hero, mode selector, navigation, and career timeline on mobile.

## 17.2 Second review: connected page experience

After approval of the core visual direction, extend the mockup to cover:

- Overall
- Backend
- Infrastructure
- Projects
- Project details
- Shared contact
- Page-to-page navigation
- Mobile versions
- Reduced-motion behavior

Use functional links or navigable routes in the mockup.

This stage is still design work, not implementation of the existing production application.

## 17.3 Mockup quality expectations

The mockup must not be another enormous generic page filled with placeholders and repeated cards.

Focus on:

- Visual authenticity
- Content clarity
- Cinematic pacing
- Smooth mode switching
- Strong typographic composition
- Accurate career storytelling
- Page-to-page consistency

If the current content is insufficient, document the missing facts separately.

Do not fill visual gaps with invented content.

---

# 18. Acceptance Criteria

## Product and content

- **V3-CONT-001:** Overall communicates the complete engineering journey.
- **V3-CONT-002:** Backend presents verified backend engineering experience.
- **V3-CONT-003:** Infrastructure presents verified infrastructure work and distinguishes professional experience from learning.
- **V3-CONT-004:** All modes use consistent canonical professional facts.
- **V3-CONT-005:** Projects explain responsibilities, decisions, validation, and outcomes.
- **V3-CONT-006:** No fabricated or confidential professional claims appear.
- **V3-CONT-007:** Introductory content remains concise, human, and understandable.
- **V3-CONT-008:** Every page offers a clear onward navigation path.

## Visual design

- **V3-DES-001:** The design follows the driver-profile reference's editorial and storytelling structure.
- **V3-DES-002:** The website is cinematic, elegant, and minimalist.
- **V3-DES-003:** Signature blue is preserved across all modes.
- **V3-DES-004:** Only one personal photograph is required.
- **V3-DES-005:** The design does not rely on generic stock photography or decorative technical visualizations.
- **V3-DES-006:** Typography and composition carry the visual narrative.
- **V3-DES-007:** The design is original and does not copy the reference team's assets or branding.

## Navigation and interaction

- **V3-NAV-001:** Overall, Backend, and Infrastructure are directly accessible through the main header.
- **V3-NAV-002:** Each mode has a real URL.
- **V3-NAV-003:** The active-mode indicator transitions smoothly.
- **V3-NAV-004:** Hero content transforms when switching modes.
- **V3-NAV-005:** The header remains visually stable.
- **V3-NAV-006:** Route transitions are cinematic but non-blocking.
- **V3-NAV-007:** Direct entry, refresh, back, and forward navigation work.
- **V3-NAV-008:** Projects and case studies have functional links.
- **V3-NAV-009:** Contact and résumé remain easily accessible.
- **V3-NAV-010:** Mobile users can switch modes without unnecessary steps.

## Motion

- **V3-MOT-001:** The opening animation resolves naturally into the hero.
- **V3-MOT-002:** Career milestones have meaningful scroll-driven transitions.
- **V3-MOT-003:** Scrolling backward remains coherent.
- **V3-MOT-004:** Mobile does not depend on desktop-style pinned storytelling.
- **V3-MOT-005:** Reduced motion preserves all functionality.
- **V3-MOT-006:** Animation failure does not block content or navigation.
- **V3-MOT-007:** No scroll hijacking or unnecessary waiting is introduced.

## Delivery controls

- **V3-GATE-001:** The first deliverable is an interactive mockup.
- **V3-GATE-002:** No existing production application components are modified during the mockup stage.
- **V3-GATE-003:** No implementation dependencies are installed during mockup exploration.
- **V3-GATE-004:** No deployment or production merge occurs.
- **V3-GATE-005:** Randi explicitly approves the visual direction before the full-page mockup expansion.
- **V3-GATE-006:** Randi separately approves the final mockups and content before implementation planning and coding.

---

# 19. Claude's Required Workflow

## Phase 1 — Reference and repository review

Inspect:

1. The driver-profile reference page
2. The current live portfolio
3. Existing source code and content
4. Current public projects
5. Existing professional records
6. Previous mockups, for understanding rejected directions only

Document:

- Reference structure
- Verifiable animation behavior
- Current reusable content
- Content gaps
- Technical constraints
- Confidentiality risks

Do not assume animation behavior based solely on a static screenshot.

## Phase 2 — Content proposal

Produce:

- Overall narrative
- Backend narrative
- Infrastructure narrative
- Career chronology
- Project selections
- Proposed headlines
- Biography copy
- Experience summaries
- Verification questions

Content must be grounded in approved information.

## Phase 3 — Interactive core mockup

Create the first high-fidelity visual concept covering:

- Hero
- Mode switching
- Biography
- Career transition
- Selected project
- Mobile behavior

Demonstrate the animation, not just describe it.

## Phase 4 — Owner review

Present the actual mockup and explain:

- What matches the reference
- What has been adapted
- How the one-photo constraint was solved
- How the three modes transform
- How professional content is represented
- What still needs confirmation

Stop for review.

## Phase 5 — Connected page mockups

Only after visual-direction approval, complete the additional page mockups and navigation flows.

Stop for another approval.

## Phase 6 — Implementation planning

Only after full mockup and content approval, propose:

- Component architecture
- Routing changes
- Motion library requirements
- Content model changes
- Performance strategy
- Accessibility testing
- Migration steps
- Quality gates
- Rollout plan

Do not begin coding automatically.

---

# 20. Final Instruction to Claude

You are designing a personal engineering biography, not a developer dashboard.

The primary inspiration is a **motorsport driver-profile page**.

Preserve its sense of editorial storytelling, progression, cinematic movement, and personal identity, while producing an original design using my existing signature blue.

I will provide only **one personal photograph**. The remaining sections must be cinematic through typography, composition, scrolling, and transitions rather than additional photography.

The portfolio has three viewing modes:

**Overall | Backend | Infrastructure**

They must share a consistent visual identity and provide a distinctive animated transition when changing modes.

Every mode must contain meaningful, accurate engineering content. The complete website must also include a Projects index, technical project detail pages, résumé access, and contact navigation.

**Content is more important than decorative animation.**

Keep the current Next.js architecture and established content-validation safeguards.

The previous mockups are rejected as visual directions.

Your immediate task is to inspect the reference, review the existing content, and create a compelling interactive core mockup.

**Do not implement the production application. Present the mockup for approval and stop.**

---

**Design statement**

*One photograph introduces the engineer. His story defines the experience. His work provides the evidence. Cinematic motion connects the chapters.*
