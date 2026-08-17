# Developer Portfolio — Decision Ledger

## Document Information

- **Product Name:** Randi Fajar Wicaksono Developer Portfolio
- **Document Type:** Decision Ledger
- **Version:** 1.0
- **Status:** Updated at the v2 release
- **Owner:** Randi Fajar Wicaksono
- **Last Updated:** 2026-08-16

---

## Status Definitions

| Status | Meaning |
|---|---|
| Confirmed | Explicitly approved requirement |
| Proposed | Recommended but not yet approved |
| Open Decision | Requires resolution |
| Assumption | Temporary working position |
| Superseded | Replaced by a newer decision |

---

## Confirmed Decisions

| ID | Topic | Decision | Status | Source |
|---|---|---|---|---|
| DEC-001 | Primary purpose | Help Randi secure a new job. | Confirmed | User approval |
| DEC-002 | Long-term purpose | Grow into a personal-branding platform. | Confirmed | User approval |
| DEC-003 | Positioning | Backend-Focused Full-Stack Developer. | Superseded | User approval; replaced by SUP-002 |
| DEC-004 | Target roles | Backend Developer, Full-Stack Developer, Software Engineer. | Superseded | User input; replaced by SUP-003 |
| DEC-005 | Market | Remote-friendly Indonesian and international roles. | Confirmed | User approval |
| DEC-006 | Language | English. | Confirmed | User approval |
| DEC-007 | Access | Public read-only website. | Confirmed | Round 1 approval |
| DEC-008 | Authentication | No visitor authentication in Version 1. | Confirmed | Round 1 approval |
| DEC-009 | Contact | Direct email, LinkedIn, and GitHub only. | Confirmed | Round 1 approval |
| DEC-010 | Contact form | No contact form in Version 1. | Confirmed | Round 1 approval |
| DEC-011 | Owner workflow | Source-controlled publishing workflow is part of product behavior. | Confirmed | Round 1 approval |
| DEC-012 | Public name | Randi Fajar Wicaksono. | Confirmed | User input |
| DEC-013 | Location | Yogyakarta, Indonesia. | Confirmed | User input |
| DEC-014 | Email | randifajar2307@gmail.com. | Confirmed | User input |
| DEC-015 | GitHub | https://github.com/randifajar. | Confirmed | User input |
| DEC-016 | LinkedIn | https://www.linkedin.com/in/randifajar. | Confirmed | User input |
| DEC-017 | CV | Public CV download is enabled. | Confirmed | User input |
| DEC-018 | Current company | Current company may be displayed. | Confirmed | User input |
| DEC-019 | Photograph | Professional photograph is included. | Confirmed | User input |
| DEC-020 | Employment dates | Exact employment dates are displayed. | Confirmed | User input |
| DEC-021 | Project status | Project delivery status is displayed. | Confirmed | User input |
| DEC-022 | Actors | Five actors are Recruiter, Manager, Technical Interviewer, Professional Contact, and Portfolio Owner. | Confirmed | Round 2 approval |
| DEC-023 | Core concepts | Twelve approved core concepts are used. | Confirmed | Round 3 approval |
| DEC-024 | Routes | Home, Projects Index, Project Detail, Resume, and Not Found. | Confirmed | Round 4 and 5 approval |
| DEC-025 | Homepage sections | Navigation, Hero, About, Selected Projects, Work Experience, Technical Skills, AI Workflow, Contact, Footer. | Superseded | Round 4 approval; replaced by SUP-005 |
| DEC-026 | Project index | Projects use a separate index page. | Confirmed | Round 4 approval |
| DEC-027 | Project detail | Projects use dedicated detail pages. | Confirmed | Round 4 approval |
| DEC-028 | Filtering | No project filtering in Version 1. | Confirmed | Round 4 approval |
| DEC-029 | Direct entry | Project Detail pages must work independently. | Confirmed | Round 4 approval |
| DEC-030 | Launch projects | Version 1 may launch with two strong projects. | Confirmed | Round 4 and 6 approval |
| DEC-031 | Third project | Third project is not a launch blocker. | Confirmed | Round 6 approval |
| DEC-032 | Project integrity | Unfinished or reassigned work is not represented as completed. | Confirmed | User approval |
| DEC-033 | Production integrity | Non-production work is not represented as Production. | Confirmed | User approval |
| DEC-034 | Confidentiality | Restricted company information is never published. | Confirmed | User approval |
| DEC-035 | AI positioning | AI accelerates work; Randi retains technical accountability. | Confirmed | User approval |
| DEC-036 | Content storage | Version 1 uses local source-controlled content. | Confirmed | Round 6 approval |
| DEC-037 | Database | No database in Version 1. | Confirmed | Round 6 approval |
| DEC-038 | CMS/admin | No CMS or admin dashboard in Version 1. | Confirmed | Round 6 approval |
| DEC-039 | External APIs | No live LinkedIn or GitHub synchronization. | Confirmed | Round 1 and 6 approval |
| DEC-040 | Deployment | Managed automatic deployment is required. | Confirmed | Round 6 approval |
| DEC-041 | Production infrastructure | Self-managed production infrastructure is not required. | Confirmed | Round 6 approval |
| DEC-042 | Docker | Docker production hosting is not mandatory for Version 1. | Confirmed | Round 6 approval |
| DEC-043 | Mobile | Essential functionality and content must work on mobile and desktop. | Confirmed | Round 4 approval |
| DEC-044 | Publication Status | Draft, Published, Archived. | Confirmed | Round 3 approval |
| DEC-045 | Delivery Status | Personal Project, In Development, Completed, Internal Release, Proof of Concept, Production, Archived. | Confirmed | Round 3 approval |
| DEC-046 | Confidentiality values | Public, Sanitized, Private, Restricted. | Confirmed | Round 3 approval |
| DEC-047 | Not Found privacy | Unknown and non-public project routes have the same public result. | Confirmed | Round 5 approval |
| DEC-048 | Version 1 boundary | Future features are not implicit Version 1 requirements. | Confirmed | Round 6 approval |

### Version 2 design decisions

Added at the v2 release, 2026-08-16. Each was approved by Randi merging the pull
request that implemented it, after review — that is the approval basis, and it is
recorded here rather than left implicit in Git history. Before this block the ledger
described a product whose entire visual system was undocumented: fifty-seven rows,
none of them mentioning a surface, a typeface, or a contrast floor.

| ID | Topic | Decision | Status | Source |
|---|---|---|---|---|
| DEC-049 | Composition system | **Three surfaces — `light`, `neutral`, `dark` — alternating down the page.** Implemented as `[data-surface]` CSS-variable overrides, so components resolve colour through `var()` against whichever band contains them and no component knows which surface it is on. Still a single theme with no switcher. | Confirmed | v2 Phase 2a–7, PRs #49–#59 |
| DEC-050 | Typefaces | **Archivo for display, Geist Sans for body.** Geist was already the body face; v2 added the display face only, chosen from a rendered specimen rather than from prose description. Both self-hosted by `next/font` at build time, so there is no external font request at runtime. | Confirmed | v2 Phase 2b |
| DEC-051 | Type scale | **Nine tokenised steps using `clamp()`**, each preferred value carrying a `rem` term so browser text scaling still applies. Raw Tailwind size utilities are forbidden in `src/` and the ban is asserted. | Confirmed | v2 Phase 2b |
| DEC-052 | Contrast floor | **4.8:1 text and 3.3:1 non-text — stricter than WCAG AA on purpose.** Both v1 contrast failures were within 4% of passing, so a floor set exactly at 4.5 would have admitted them again. Enforced by a 93-pair matrix parsing the shipping `globals.css`, in `quality` rather than only in axe. | Confirmed | v2 Phase 2a |
| DEC-053 | Motion | **Motion is tokenised and reduced-motion is honoured structurally.** `prefers-reduced-motion` collapses the duration tokens and sets `animation-timeline: none`, because a scroll-driven timeline is progress-driven and a duration override alone does not stop it. | Confirmed | v2 Phase 2c |
| DEC-054 | Project detail structure | **Two layers.** Layer A carries role, status, stack, problem and outcome above the deep content; Layer B is the existing sequence. Technology Stack moved from the deep sequence into Layer A. Asserted by measuring real vertical positions in a browser, not by DOM order. | Confirmed | v2 Phase 6 |
| DEC-055 | Work Experience grouping | **Grouped by employer**, so an internship → contract → full-time progression at one employer reads as one relationship rather than three unrelated jobs. | Confirmed | v2 Phase 4 |

---

## Remaining Content Decisions

Reconciled at the v2 release. Four of the seven were resolved during v1 content
approval and stayed marked "Open Decision" here for eight months, which made this
table useless as a to-do list — the two entries that genuinely still need Randi are
the two easiest to overlook in a column of seven identical values.

| ID | Topic | Status |
|---|---|---|
| OPEN-001 | Final professional headline | **Resolved** 2026-08-08 — supplied by Randi (`src/content/profile.ts`) |
| OPEN-002 | Final professional summary | **Resolved** 2026-08-08 — supplied by Randi (`src/content/profile.ts`) |
| OPEN-003 | Final third project | Open Decision — two published case studies; never a launch blocker (DEC-031) |
| OPEN-004 | Final skill classification | **Resolved** 2026-08-08 — every classification confirmed as assigned (`src/content/skills.ts`) |
| OPEN-005 | Final professional photograph | **Resolved** 2026-08-08 — supplied, converted to WebP at 400×400, live |
| OPEN-006 | Safe project visuals | Open Decision — no diagram sanitised yet, which is also why Q9's schema field was not added |
| OPEN-007 | Custom domain at launch | Open Decision — still the Vercel subdomain |

---

## Superseded Decisions

| ID | Previous Decision | Replacement |
|---|---|---|
| SUP-001 | MVP structure required unspecified changes. | Original five-route structure approved in Rounds 4 and 5. |
| SUP-002 | DEC-003 — positioning as Backend-Focused Full-Stack Developer. | **Backend Developer.** Randi's positioning is now consistently Backend Developer across LinkedIn, CV, and applications; the portfolio was the last surface still saying otherwise. Full-stack capability remains stated where it is truthful — the case studies and the technologies list — but no longer competes with the primary identity. v1.1 Issue 2. |
| SUP-003 | DEC-004 — target roles including Full-Stack Developer. | **Backend Developer, Backend Engineer, Software Engineer.** Follows SUP-002 for the same reason. v1.1 Issue 2. |
| SUP-004 | Availability stated as "Open to remote opportunities". | **"Open to opportunities."** The remote-only wording excluded hybrid and onsite roles Randi would consider, and no onsite, hybrid, or relocation availability has been confirmed — so the neutral form states openness without inventing a form of it. v1.1 Issue 3. The `remoteAvailability` field name is unchanged; renaming it would touch schema, selectors, components, and tests for no reader-visible gain, and belongs to v2. |
| SUP-007 | AI-Assisted Engineering rendered on `bg-surface-muted`, sharing the emphasis treatment with Work Experience. | **Plain background, denser cards.** Measured before changing anything, because the handoff asked whether the treatment gave the section more weight than Work Experience or Projects rather than asserting it did: at 1280px it occupied 1206px against Projects' 734 (+64%) and was one of only two sections with a filled background — so the evidence sat on plain background while the section about tooling was visually promoted. Now 1134px (+54%) on plain background, using the same card treatment as project cards rather than a promoted variant. Height parity is not reachable without deleting the disclosure the section exists to make, so it was not chased. Position is unchanged and still after Work Experience, Projects and Technical Skills. v1.1 Issue 7, UX 7.8 amended. |
| SUP-006 | Project card ordered title, summary, role, with the label "Role". | **Project type + delivery status, title, my role, summary, technologies, View case study.** No field added or removed — order and label only. In a five-to-ten second scan the summary describes the project and the role describes Randi, so "what did *he* do here?" was answered last. "My role" scopes the claim for the same reason FAC-PROJECT-003 splits responsibility on the detail page. v1.1 Issue 6, UX 7.5 amended. Asserted by `tests/components/project-card-order.test.tsx`; nothing asserted it before. |
| SUP-005 | DEC-025 — Selected Projects before Work Experience on the homepage. | **Navigation, Hero, About, Work Experience, Selected Projects, Technical Skills, AI Workflow, Contact, Footer.** DEC-025 was right when project evidence had to carry the weight; Randi now has more than two years of professional experience with a legible internship → contract → full-time progression, and a recruiter reading an experienced developer expects employment history before case studies. v1.1 Issue 5. The header inventory (UX 6.1) moves with it, so the two surfaces do not disagree about what comes first. The order is now asserted by `tests/components/homepage-order.test.tsx`; nothing asserted it before. |
