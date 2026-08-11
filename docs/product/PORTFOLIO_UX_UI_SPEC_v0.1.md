# UX/UI Specification — Randi Fajar Wicaksono Developer Portfolio

## Document Information

- **Product Name:** Randi Fajar Wicaksono Developer Portfolio
- **Document Type:** UX/UI Specification
- **Version:** 0.1
- **Status:** Draft for Review
- **Source Documents:**
  - `PORTFOLIO_PRD_v0.1.md`
  - `PORTFOLIO_FAC_v0.1.md`
  - `PORTFOLIO_NFAC_v0.1.md`
- **Product Owner:** Randi Fajar Wicaksono
- **Last Updated:** 2026-08-04

---

# 1. Purpose

This document defines how the approved portfolio product should look, feel, and behave across desktop and mobile.

It translates the approved PRD, FAC, and NFAC into:

- Visual direction
- Information hierarchy
- Page layouts
- Component behavior
- Responsive rules
- Interaction rules
- Empty and error states
- Accessibility expectations
- Content presentation rules

This document does not define implementation architecture, framework structure, data-fetching strategy, deployment configuration, or CI/CD code. Those belong in the Technical Design and Implementation Plan.

---

# 2. UX Goal

The portfolio must help a visitor answer the following questions quickly:

1. Who is Randi?
2. What kind of developer is he?
3. What has he worked on?
4. What did he personally contribute?
5. Which technologies does he use?
6. How does he use AI responsibly?
7. How can he be contacted?

The design must support two reading modes:

## 2.1 Fast Scan

For recruiters and hiring managers with limited time.

The visitor should understand the core profile from:

- Hero
- About summary
- Selected Projects
- Work Experience summary
- Skills
- Contact actions

## 2.2 Deep Review

For technical interviewers and engineering managers.

The visitor should be able to open a Project Detail page and review:

- Problem
- Responsibility
- Technical approach
- Challenges
- Decisions
- Verification
- Outcome
- AI-assisted workflow
- Lessons learned

---

# 3. Design Principles

## 3.1 Evidence Before Decoration

The design must prioritize:

- Clear project responsibility
- Delivery status
- Technical reasoning
- Work history
- Contact actions

Decorative graphics must not compete with professional evidence.

## 3.2 Calm Technical Confidence

The interface should feel:

- Professional
- Modern
- Technical
- Focused
- Honest
- Approachable

It should not resemble:

- A gaming dashboard
- A cryptocurrency landing page
- A neon cyberpunk interface
- A corporate template with no personality
- A playground for excessive animations

## 3.3 Fast Understanding

Important information must be easy to scan.

Use:

- Short section introductions
- Strong headings
- Consistent metadata
- Clear project status labels
- Concise technology tags
- Visible calls to action

## 3.4 Progressive Detail

The homepage provides overview-level information.

Project Detail pages provide deeper technical evidence.

The homepage must not repeat the entire case study.

## 3.5 Honest Presentation

The interface must distinguish:

- Personal Project
- In Development
- Completed
- Internal Release
- Proof of Concept
- Production
- Archived

Status must be visible without being exaggerated.

## 3.6 Accessible by Default

The design must support:

- Keyboard navigation
- Visible focus states
- Sufficient contrast
- Semantic heading order
- Reduced-motion preferences
- Mobile readability
- Useful alternative text

---

# 4. Recommended Visual Direction

## 4.1 Direction Name

**Quiet Engineering**

## 4.2 Visual Character

A light-first professional interface using:

- Neutral background
- Dark readable text
- One restrained blue accent
- Subtle borders
- Spacious layout
- Minimal shadow
- Limited animation
- Strong editorial typography

The visual direction should communicate engineering discipline rather than visual spectacle.

## 4.3 Theme

Version 1 uses one light theme.

A dark-mode switcher is out of scope.

## 4.4 Color Palette

The following values are recommended as design tokens.

| Token | Value | Purpose |
|---|---|---|
| Background | `#F8FAFC` | Main page background |
| Surface | `#FFFFFF` | Cards and elevated content |
| Surface Muted | `#F1F5F9` | Secondary section background |
| Text Primary | `#0F172A` | Main headings and body |
| Text Secondary | `#475569` | Supporting content |
| Text Muted | `#64748B` | Metadata |
| Border | `#CBD5E1` | Dividers and card outlines |
| Accent | `#2563EB` | Primary actions and links |
| Accent Hover | `#1D4ED8` | Hover state |
| Focus | `#3B82F6` | Keyboard focus |
| Success | `#166534` | Production and valid success labels |
| Warning | `#92400E` | In Development or caution labels |
| Neutral Status | `#334155` | Completed, Internal Release, Archived |
| Error | `#B91C1C` | Validation and unavailable states |

All final combinations must pass WCAG AA contrast requirements.

## 4.5 Status Color Rules

Status meaning must not depend on color alone.

Each status uses:

- Text label
- Optional icon
- Accessible color treatment

Recommended visual treatment:

| Status | Treatment |
|---|---|
| Personal Project | Blue-neutral |
| In Development | Amber |
| Completed | Slate |
| Internal Release | Indigo-neutral |
| Proof of Concept | Violet-neutral |
| Production | Green |
| Archived | Gray |

## 4.6 Typography

Recommended font direction:

- **Primary:** Inter, Geist, or another highly readable modern sans-serif
- **Fallback:** system sans-serif

Recommended hierarchy:

| Element | Size Direction | Weight |
|---|---:|---:|
| Hero title | 48–64 px desktop, 36–44 px mobile | 700 |
| Page title | 40–52 px desktop, 32–40 px mobile | 700 |
| Section title | 30–40 px desktop, 26–32 px mobile | 700 |
| Card title | 20–24 px | 600 |
| Body large | 18–20 px | 400 |
| Body | 16–18 px | 400 |
| Metadata | 14–16 px | 500 |

Body line height should remain approximately 1.6.

Long project content should use a readable maximum text width.

## 4.7 Spacing

Use an 8-point spacing rhythm.

Recommended spacing scale:

- 4
- 8
- 12
- 16
- 24
- 32
- 48
- 64
- 80
- 96

Sections should have generous vertical separation.

## 4.8 Border Radius

Recommended:

- Buttons: 8–10 px
- Cards: 12–16 px
- Status labels: fully rounded or 999 px
- Images: 12–16 px

Avoid excessively rounded interfaces that make every section resemble a mobile banking app.

## 4.9 Shadows

Use shadows sparingly.

Default cards should primarily use borders.

A small shadow may appear on:

- Primary featured cards
- Sticky navigation
- Hovered interactive cards

---

# 5. Global Layout

## 5.1 Content Width

Recommended maximum content width:

- Main layout: 1120–1200 px
- Long-form project text: 720–800 px
- Wide diagrams: up to main layout width

## 5.2 Page Gutters

Recommended horizontal padding:

- Mobile: 20 px
- Tablet: 32 px
- Desktop: 40–48 px

## 5.3 Section Rhythm

Each major homepage section should have:

- Clear section heading
- Optional short introduction
- Main content
- Consistent top and bottom spacing

## 5.4 Alignment

Default alignment is left-aligned.

Centered content may be used only for:

- Hero introduction on small screens when visually appropriate
- Empty states
- Not Found page
- Limited call-to-action areas

Long professional content must not be center-aligned.

---

# 6. Global Navigation

## 6.1 Desktop Navigation

The desktop header contains:

- Randi's name or compact identity mark
- Home
- Experience
- Projects
- Skills
- AI Workflow
- Contact
- Resume action

> **Amended in v1.1 (Issue 5).** Projects listed before Experience here. The
> header's four anchor links mirror the homepage, so it reads as a table of
> contents with Projects hoisted out to its own route — and leaving Projects
> first would have had the header and the page it describes disagree about what
> comes first. Reordered alongside SUP-005. The inventory is otherwise
> unchanged.

Recommended behavior:

- Header remains visible or becomes sticky after scrolling
- Active section or route receives a subtle indicator
- Resume uses a visually distinct secondary or primary button
- Header background remains readable over page content

## 6.2 Mobile Navigation

The mobile header contains:

- Name or identity mark
- Menu button
- Resume shortcut when space allows

The opened menu contains:

- Home
- Projects
- Experience
- Skills
- AI Workflow
- Contact
- Resume
- LinkedIn
- GitHub

Mobile menu requirements:

- Keyboard accessible
- Focus trapped while open when implemented as a modal drawer
- Escape key closes it
- Selecting a link closes it
- Background scrolling is controlled
- Menu state is announced to assistive technology

## 6.3 Anchor Navigation

Homepage section links navigate to:

- `#experience`
- `#skills`
- `#ai-workflow`
- `#contact`

The target heading must not be hidden behind a sticky header.

## 6.4 Focus and Hover

All navigation links require:

- Visible hover state
- Visible keyboard focus state
- No focus removal without replacement

---

# 7. PAGE-001 — Home

## 7.1 Page Objective

Provide a complete professional overview and guide visitors toward:

- Projects
- Resume
- LinkedIn
- GitHub
- Email contact

## 7.2 Homepage Layout Order

1. Navigation
2. Hero
3. About
4. Selected Projects
5. Work Experience
6. Technical Skills
7. AI-Assisted Engineering
8. Contact
9. Footer

---

## 7.3 Hero

### Desktop Layout

Recommended two-column layout:

- Left: Identity, title, headline, metadata, actions
- Right: Professional photograph or restrained visual treatment

Suggested width:

- Content: 60%
- Photograph: 40%

### Mobile Layout

Single-column layout:

1. Professional photograph
2. Name
3. Title
4. Headline
5. Location and availability
6. Primary actions
7. External profile links

### Required Content

- `Randi Fajar Wicaksono`
- Approved professional title
- Approved headline
- `Yogyakarta, Indonesia`
- Remote-friendly availability
- Professional photograph
- View Projects action
- Resume action

### Optional Content

- LinkedIn
- GitHub
- Email

### Primary Action

**View Projects**

### Secondary Action

**Download Resume** or **View Resume**

The exact label must remain consistent across the website.

### Behavior

- Actions remain visible without excessive scrolling on common desktop screens
- Photograph is not oversized
- Headline remains concise
- No auto-typing text animation
- No rotating job-title carousel

---

## 7.4 About

### Purpose

Explain the professional identity in more depth without becoming a full autobiography.

### Layout

Recommended two-column desktop layout:

- Left: Section label and heading
- Right: Summary and three to four concise strength points

Mobile layout stacks heading before content.

### Content

- Backend-focused full-stack positioning
- Type of systems worked on
- Engineering strengths
- Career direction

### Recommended Strength Presentation

Use short evidence-oriented statements rather than generic personality claims.

Example structure:

- Backend and data-heavy application development
- Cross-application integration
- Production and environment debugging
- AI-assisted engineering with human verification

---

## 7.5 Selected Projects

### Purpose

Present the strongest current project evidence.

### Layout

Desktop:

- Two-column grid when two projects are Published
- Three-column or asymmetric grid when three projects are Published

Mobile:

- One-column list

### Project Card Content

- Optional visual
- Project type
- Delivery status
- Title
- My role
- Short summary
- Key technologies
- View Case Study action

> **Amended in v1.1 (Issue 6).** Role sat below the summary and was labelled
> "Role". No field was added or removed — only the order and the label changed
> (SUP-006). In a five-to-ten second scan the summary describes the project and
> the role describes Randi, so "what did *he* do here?" was being answered last.
> The possessive scopes the claim for the same reason FAC-PROJECT-003 splits
> responsibility on the detail page: the summary can describe work a team
> delivered, and an unqualified "Role:" beneath it invites reading the whole
> summary as his.

### Card Interaction

- Entire card may be clickable when semantics remain correct
- Visible hover state
- Clear keyboard focus
- Status remains readable
- Technologies should not overwhelm the card

### Two-Project Launch

When only two projects are ready:

- Display two balanced cards
- Do not render an empty third card
- Do not render a fake Coming Soon card

### Section Action

**View All Projects**

---

## 7.6 Work Experience

### Purpose

Present professional history clearly and truthfully.

### Recommended Pattern

Vertical timeline or stacked entries.

Avoid decorative timelines that reduce readability.

### Entry Content

- Company
- Position
- Exact employment dates
- Current indicator
- Location or work arrangement when useful
- Role summary
- Selected responsibilities
- Selected contributions
- Technologies

### Desktop Layout

Option A, recommended:

- Left narrow column: dates
- Right wide column: role content

### Mobile Layout

Dates appear above each role.

### Behavior

- Most recent role appears first
- Current role receives a clear Current label
- Contributions use short bullets
- Long project detail is linked rather than repeated

---

## 7.7 Technical Skills

### Purpose

Communicate practical capability without fake precision.

### Recommended Structure

Group skills by discipline:

- Languages
- Backend
- Frontend
- Databases
- APIs and Integration
- Infrastructure and Deployment
- Testing and Quality
- Developer Tools
- AI-Assisted Engineering

### Classification Presentation

Use text labels or grouped subsections:

- Strong Working Skills
- Professional Experience
- Currently Learning

### Display Rules

- No progress bars
- No percentage scores
- No star ratings
- No skill logo wall without readable labels
- Use compact chips, lists, or structured columns

### Mobile

Groups stack vertically.

---

## 7.8 AI-Assisted Engineering

### Purpose

Demonstrate modern AI usage without suggesting blind dependency.

### Recommended Layout

One introduction followed by a four-step workflow:

1. Analyze
2. Plan
3. Implement
4. Verify

Each step contains:

- AI-supported activity
- Human responsibility
- Validation method

### Supporting Content

May include:

- Codex
- Claude Code
- ChatGPT

Tool logos are optional. The workflow matters more than vendor decoration.

### Visual Weight

This section must not out-weigh Work Experience or Selected Projects. It is a
differentiator, not the identity — the page should read "a backend engineer who
uses AI responsibly", not "an AI-tool operator who also does backend work".

It renders on the plain page background and uses the same card treatment as
project cards, rather than a promoted variant.

> **Amended in v1.1 (Issue 7).** The section previously used
> `bg-surface-muted`, which only Work Experience otherwise had, so the evidence
> sections sat on plain background while the section about tooling was one of
> two visually promoted ones. Measured at 1280px before changing anything:
> 1206px against Selected Projects' 734px. Now 1134px on plain background with
> denser cards (SUP-007).
>
> Full height parity with Selected Projects is **not** a goal. Four practices
> carrying activity, tool, purpose, human responsibility, verification method
> and a corrected assumption is simply that much content, and reaching parity
> would mean deleting the disclosure the section exists to make. Reduce
> prominence; do not reduce honesty.

### Recommended Message

AI accelerates:

- Repository exploration
- Requirement analysis
- Planning
- Scoped implementation
- Debugging
- Documentation

Randi remains responsible for:

- Requirement validation
- Architecture
- Code review
- Testing
- Regression checks
- Security
- Final decisions

### Project Links

When relevant, link to case studies that demonstrate the workflow.

---

## 7.9 Contact

### Purpose

Provide a direct next action.

### Layout

Recommended call-to-action panel with:

- Short invitation
- Professional email
- LinkedIn
- GitHub
- Resume
- Location
- Remote-friendly availability

### Primary Action

**Email Randi**

### Secondary Actions

- LinkedIn
- GitHub
- Resume

### Restrictions

- No contact form
- No fake message-sent state
- No phone number required

---

## 7.10 Footer

Contains:

- Randi Fajar Wicaksono
- Current year
- Email
- LinkedIn
- GitHub
- Back to top

The footer should remain compact.

---

# 8. PAGE-002 — Projects Index

## 8.1 Page Objective

Allow visitors to browse every Published project.

## 8.2 Header

Contains:

- Page title
- Short introduction
- Sanitization note for professional case studies

Example message:

> Professional case studies may use sanitized names, diagrams, and workflow descriptions to protect confidential company information.

## 8.3 Project Grid

Desktop:

- Two-column or three-column grid depending on card width

Tablet:

- Two-column grid

Mobile:

- One-column list

## 8.4 Card Content

Same core structure as homepage cards:

- Visual
- Project type
- Delivery status
- Title
- Summary
- Role
- Technologies
- View Case Study

## 8.5 Ordering

1. Featured priority
2. Relevance or recency
3. Remaining Published projects

## 8.6 Empty State

If no projects exist:

- Show a direct message
- Explain that case studies are being prepared
- Provide Home, Resume, and Email actions

This is a valid page state but not a launch-ready product state.

## 8.7 Filters

No filtering controls in Version 1.

---

# 9. PAGE-003 — Project Detail

## 9.1 Page Objective

Provide enough evidence for a technical reviewer to understand:

- The project problem
- Randi's role
- Technical reasoning
- Verification
- Outcome
- Lessons

## 9.2 Header Area

Contains:

- Back to Projects
- Project type
- Delivery status
- Project title
- Summary
- Randi's role
- Relevant period
- Optional featured visual
- Optional public repository action

Role and delivery status must appear near the top.

## 9.3 Project Metadata

Recommended compact metadata row:

- Role
- Status
- Period
- Main technologies

On mobile, metadata stacks.

## 9.4 Content Layout

Recommended desktop layout:

- Main article column: 720–800 px
- Optional sticky table of contents or metadata column when content length justifies it

Version 1 may omit a sticky table of contents if the case study is moderate in length.

## 9.5 Required Section Order

1. Context
2. Problem
3. My Responsibility
4. Technical Approach
5. Architecture or Workflow
6. Challenges
7. Decisions and Trade-offs
8. Implementation Summary
9. Testing and Verification
10. Outcome
11. AI-Assisted Engineering
12. Lessons Learned
13. Technology Stack
14. Confidentiality Note
15. Related Navigation

## 9.6 Responsibility Presentation

The section should use explicit labels:

### My Responsibility

What Randi personally handled.

### Team or External Responsibility

What belonged to teammates, other services, or other teams.

This separation must be visually clear.

## 9.7 Architecture and Workflow

Diagrams are optional.

When a diagram exists:

- It must be sanitized
- It must include alternative text
- It must include a written explanation
- It must remain readable on mobile
- It must not expose internal URLs, credentials, client data, or private architecture details

## 9.8 Challenges and Decisions

Recommended content block:

- Challenge
- Why it mattered
- Options considered
- Decision
- Trade-off
- Result

This may be presented as structured cards or subsections.

## 9.9 Outcome

The outcome section must:

- Use verified language
- Show delivery status
- Avoid fake numbers
- Explain observable results

## 9.10 AI-Assisted Engineering

Use the same responsibility structure as the global AI section:

- AI-assisted activity
- Human decision
- Verification
- Final result

## 9.11 Confidentiality Note

Professional case studies should display a short note near the end.

Example:

> This case study uses a sanitized project name and generalized workflow descriptions. Private source code, internal URLs, and company-sensitive information are intentionally excluded.

## 9.12 Related Navigation

At the bottom:

- Back to Projects
- Previous Project
- Next Project
- Resume
- Email Randi

Previous or next links appear only when applicable.

---

# 10. PAGE-004 — Resume

## 10.1 Access

Resume actions may:

- Open the PDF in a new browser tab
- Use browser-native download behavior

The chosen label must be consistent.

Recommended labels:

- **View Resume**
- **Download Resume**

Both may be available when technically appropriate.

## 10.2 Failure State

When the Resume is unavailable:

- Show a direct message
- Do not claim download success
- Provide Home, LinkedIn, and Email actions

---

# 11. PAGE-005 — Not Found

## 11.1 Page Objective

Help visitors recover safely.

## 11.2 Content

- `Page not found`
- Short explanation
- Return Home
- Browse Projects

Optional:

- View Resume
- Email Randi

## 11.3 Security Behavior

The message must not reveal whether:

- A project exists privately
- A project is Draft
- A project is Archived
- A route was intentionally hidden

All unavailable project routes use the same public-facing result.

## 11.4 Visual Treatment

Simple, centered, and calm.

No joke should interfere with navigation clarity.

---

# 12. Reusable UI Components

The UX/UI system requires the following reusable component types.

## 12.1 Button

Variants:

- Primary
- Secondary
- Text link
- External link
- Icon link

States:

- Default
- Hover
- Focus
- Active
- Disabled when necessary

## 12.2 Status Badge

Displays Project Delivery Status.

Requirements:

- Text label
- Optional icon
- Accessible contrast
- No color-only meaning

## 12.3 Project Card

Contains:

- Visual
- Type
- Status
- Title
- Summary
- Role
- Technologies
- Action

## 12.4 Experience Entry

Contains:

- Dates
- Company
- Position
- Current status
- Summary
- Responsibilities
- Contributions
- Technologies

## 12.5 Skill Group

Contains:

- Group title
- Classified skill items

## 12.6 Technology Tag

Short readable label.

Must not replace a full skill name with an unexplained logo.

## 12.7 Section Header

Contains:

- Optional eyebrow label
- Heading
- Optional description

## 12.8 External Profile Link

Contains:

- Platform label
- Optional icon
- External-link indication where helpful

## 12.9 Empty State

Contains:

- Clear message
- Relevant next action
- No fake data

## 12.10 Error State

Contains:

- Clear description
- Recovery action
- No false success

---

# 13. Interaction and Motion

## 13.1 Hover

Hover may affect:

- Border
- Background
- Small elevation
- Link underline
- Icon position by a few pixels

## 13.2 Animation

Allowed:

- Short fade or translate on initial section visibility
- Small button or card transitions
- Mobile menu transition

Not allowed:

- Auto-typing hero text
- Constant floating elements
- Cursor-following effects
- Background particle systems
- Rotating 3D objects
- Scroll-jacking
- Animations that delay content

## 13.3 Motion Duration

Recommended:

- 120–200 ms for controls
- 200–300 ms for panels
- No unnecessarily slow transitions

## 13.4 Reduced Motion

When reduced motion is requested:

- Remove non-essential reveal effects
- Avoid translated movement
- Keep immediate content access

---

# 14. Responsive Breakpoint Behavior

The exact breakpoint values belong in technical design, but the UX behavior is:

## Mobile

- Single-column content
- Collapsed navigation
- Full-width cards
- Stacked metadata
- Readable long-form text
- Touch-friendly actions

## Tablet

- Two-column project grids
- Simplified desktop navigation or compact menu
- Balanced section layouts

## Desktop

- Full navigation
- Two-column Hero
- Multi-column project and skill layouts
- Optional date column in Experience
- Optional supporting column on Project Detail

Essential content must not disappear at any breakpoint.

---

# 15. Accessibility Specification

## 15.1 Keyboard

- All actions keyboard reachable
- Focus visible
- Logical tab order
- Mobile menu fully keyboard operable

## 15.2 Headings

- One `h1` per page
- Logical hierarchy
- No heading level chosen only for visual size

## 15.3 Links and Buttons

- Links navigate
- Buttons perform actions
- External links use understandable labels
- Icon-only controls require accessible names

## 15.4 Images

- Meaningful images have useful alternative text
- Decorative images are ignored
- Diagrams have textual explanation

## 15.5 Contrast

- WCAG AA minimum
- Status does not rely on color alone
- Focus indicator has strong contrast

## 15.6 Error Messages

- Explain the problem
- Explain the next action
- Do not rely only on color

---

# 16. Content Writing Rules

## 16.1 Tone

Public content should be:

- Professional
- Direct
- Honest
- Technically clear
- Human
- Free from exaggerated marketing language

## 16.2 Project Ownership Language

Preferred distinctions:

- `I implemented`
- `I contributed to`
- `I was responsible for`
- `The team delivered`
- `The project reached`
- `My role focused on`

## 16.3 Avoid

- `Rockstar developer`
- `10x engineer`
- `World-class`
- `Expert` without evidence
- Invented percentage improvements
- Generic claims such as `passionate problem solver` without examples

## 16.4 Scannability

Use:

- Short paragraphs
- Clear headings
- Bullets for responsibilities
- Structured challenge and decision blocks
- Concise technology tags

---

# 17. Empty, Loading, and Error States

## 17.1 Loading

Because Version 1 uses local source-controlled content, long loading states should be uncommon.

When a loading state is required:

- Preserve layout
- Avoid flashing skeletons for instant static content
- Do not delay visible content unnecessarily

## 17.2 Missing Photograph

- Use text-first Hero layout
- Do not show a broken image
- Do not show a generic stock-avatar placeholder unless approved

## 17.3 Missing Project Media

- Show the card or article without media
- Preserve content meaning

## 17.4 No Projects

- Explain that case studies are being prepared
- Provide Resume and Contact actions
- Mark the product as not launch-ready

## 17.5 Missing Resume

- Explain unavailability
- Provide LinkedIn and email alternatives
- Do not claim successful download

## 17.6 Invalid Project

- Show Not Found
- Do not reveal private status

---

# 18. SEO and Social Presentation

## 18.1 Home Metadata

Should communicate:

- Randi's full name
- Backend-focused full-stack positioning
- Main technical direction
- Location or remote availability where appropriate

## 18.2 Project Metadata

Each Published project should have:

- Unique title
- Unique summary
- Safe social-sharing description
- Default or project-specific safe image

## 18.3 Social Image

Recommended default:

- Name
- Professional title
- Clean technical layout
- No confidential project screenshot

---

# 19. Content Required Before Final Visual QA

The following content may use Draft placeholders during implementation but must be approved before production launch:

- Final professional title formatting
- Final headline
- Final About summary
- Final professional photograph
- Work Experience copy
- Two complete Project Case Studies
- Skills classification
- AI Workflow copy
- Active Resume PDF
- Safe project visuals
- Social-sharing image

Draft placeholders must never reach production.

---

# 20. UX Acceptance Checklist

The UX/UI design is acceptable when:

- [ ] Visitors can understand Randi's role from the Hero.
- [ ] Primary actions are immediately visible.
- [ ] Homepage sections follow the approved order.
- [ ] Two projects display without an artificial empty card.
- [ ] Project status is visible and truthful.
- [ ] Personal responsibility is clearly separated from team responsibility.
- [ ] Skills do not use percentage ratings.
- [ ] AI usage emphasizes human accountability.
- [ ] Resume, email, LinkedIn, and GitHub actions are clear.
- [ ] Project Detail pages work as direct entry points.
- [ ] Mobile contains all essential content.
- [ ] Keyboard focus is visible.
- [ ] Meaningful images have alternative text.
- [ ] Missing optional media degrades safely.
- [ ] Not Found does not leak private content.
- [ ] No excessive animation delays understanding.
- [ ] The interface feels professional and technically credible.

---

# 21. Approved Design Direction for Technical Design

Unless revised by the Product Owner, the downstream Technical Design should use:

- Light-first single theme
- Neutral slate background and text
- Restrained blue accent
- Modern readable sans-serif typography
- Border-led cards with minimal shadow
- Spacious editorial layout
- Limited animation
- Responsive single-column mobile experience
- Evidence-focused Project Detail pages
- No theme switcher
- No decorative 3D or particle system

---

# 22. Open Visual Content Decisions

The following remain content or asset decisions:

1. Final professional photograph
2. Final headline
3. Final social-sharing image
4. Final safe project visuals
5. Exact title for Resume action
6. Whether a public project repository link is available per project

These do not change the approved product structure.

---

# 23. Approval

This UX/UI Specification is ready for Product Owner review.

After approval, the next artifact is the Technical Design Specification.
