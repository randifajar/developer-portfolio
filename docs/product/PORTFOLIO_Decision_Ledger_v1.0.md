# Developer Portfolio — Decision Ledger

## Document Information

- **Product Name:** Randi Fajar Wicaksono Developer Portfolio
- **Document Type:** Decision Ledger
- **Version:** 1.0
- **Status:** Updated for V3 decisions (approved 2026-11-18 and 2026-11-19; not yet released)
- **Owner:** Randi Fajar Wicaksono
- **Last Updated:** 2026-11-19

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

### Version 3 decisions

Approved by Randi on 2026-11-18, with the V3 implementation plan
(`docs/plans/2026-11-18-v3-implementation-plan.md`, "approved, use your
recommendations"), and on 2026-11-19 (DEC-063, SUP-017). **Approved is not
implemented.** Unless a row says otherwise, the live site follows the decision a
row extends or supersedes until the V3 release, and the pull request that
implements a row cites it.

| ID | Topic | Decision | Status | Source |
|---|---|---|---|---|
| DEC-056 | Routes (V3) | **`/` (Overall), `/backend`, `/infrastructure`, `/projects`, `/projects/[slug]`.** Only a project with a full case study gets a route; an overview and an unknown slug return the same not-found result (DEC-047). Each résumé is served at `/resume/backend.pdf` or `/resume/infrastructure.pdf` once approved for publication, and `/resume.pdf` becomes a permanent redirect to the backend résumé, so links already sent keep working. Extends DEC-024. | Confirmed | V3 plan D2 |
| DEC-057 | Client component boundary (V3) | **Six client components:** `ModeSwitch`, `ResumeMenu`, `ModeHero`, `CareerJourney`, `ProjectFilter`, `CopyEmail`. The header and footer stay Server Components that compose them; the mode hero is the only state that persists across routes, and it is derived from the pathname. Amends Technical Design §13.4. | Confirmed | V3 plan D4 |
| DEC-058 | Pre-production branch | **`staging` is the second long-lived branch.** The next release is assembled there from reviewed pull requests and reaches `production` through one promotion pull request. Vercel serves it as a Preview, behind Vercel login and marked noindex. In force since #100. | Confirmed | Randi, 2026-11-18 (V3 plan D5) |
| DEC-059 | Résumé variants | **Two résumés, backend and infrastructure, with at most one active Published résumé per variant**; FAC-RESUME-004 is amended when this is implemented. Neither is published until the backend résumé shows the backend role ending Jul 2026 and Randi decides whether his phone number is public. | Confirmed | V3 plan D6 |
| DEC-060 | Project overviews | **Six résumé projects ship as overviews:** general titles, no route, no case study. None becomes a case study without its own approval, and internal application names never appear. | Confirmed | V3 plan D7 |
| DEC-061 | Type scale (V3) | The tokenised `clamp()` scale gains the display steps the V3 hero needs; raw Tailwind size utilities stay forbidden. Extends DEC-051. | Confirmed | V3 plan D8 |
| DEC-062 | Motion (V3) | **A mode change animates the persistent hero** with the Web Animations API: exit about 220 ms, settled about 0.75 s after the click, and a later click cancels an earlier sequence. The career sequence pins only at 900 px and wider with motion allowed; section reveals are CSS scroll-driven animations; the pointer light runs only on a fine pointer. Under reduced motion all of it is off and every function remains. Extends DEC-053. | Confirmed | Approved V3.1 mockup, 2026-11-18 |
| DEC-063 | Company name | **"Zettabyte Pte Ltd"**, as on Randi's infrastructure résumé. Corrected on the site in #102. *Correction:* the question put to him said both résumés used "Zettabyte"; the backend résumé in fact mixes the two spellings ("ZettaByte" twice, "Zettabyte" once), so it disagrees with the site until it is replaced. | Confirmed | Randi, 2026-11-19 (V3 plan D12) |
| DEC-064 | Infrastructure detail | **Tools are named; how the employer's systems are wired is not.** Jenkins, EC2, Ubuntu, Docker Buildx and Nginx appear as on the résumé; the proxy layer in front of hosted services and the AWS email-event service chain are described generically. This is the level P0 shipped, now the rule for the whole site. | Confirmed | Randi, 2026-11-19 (V3 plan I3) |

---

## Remaining Content Decisions

Reconciled at the v2 release. Four of the seven were resolved during v1 content
approval and stayed marked "Open Decision" here for eight months, which made this
table useless as a to-do list — the two entries that genuinely still need Randi are
the two easiest to overlook in a column of seven identical values.

| ID | Topic | Status |
|---|---|---|
| OPEN-001 | Final professional headline | **Resolved** 2026-08-08 — supplied by Randi (`src/content/profile.ts`). **Reworded 2026-11-18** for the move to the infrastructure team (#99); the new wording awaits his confirmation |
| OPEN-002 | Final professional summary | **Resolved** 2026-08-08 — supplied by Randi (`src/content/profile.ts`). **Reworded 2026-11-18** in the same pull request; awaits his confirmation |
| OPEN-003 | Final third project | Open Decision — two published case studies; never a launch blocker (DEC-031) |
| OPEN-004 | Final skill classification | **Resolved** 2026-08-08 — every classification confirmed as assigned (`src/content/skills.ts`) |
| OPEN-005 | Final professional photograph | **Resolved** 2026-08-08 — supplied, converted to WebP at 400×400, live |
| OPEN-006 | Safe project visuals | Open Decision — no diagram sanitised yet, which is also why Q9's schema field was not added |
| OPEN-007 | Custom domain at launch | Open Decision — still the Vercel subdomain |
| OPEN-008 | Docker, Linux and Jenkins classification (V3 plan D9) | **Resolved** 2026-11-19 — all four, with AWS, are professional experience (SUP-018) |
| OPEN-009 | Proposed V3 wording: profile statement, engineering headline, transition sentence (V3 plan I4) | **Resolved** 2026-11-19 — Randi approved all three as proposed in the V3.1 mockup |
| OPEN-011 | Titles of the six project overviews (DEC-060) | Open Decision — working titles. Randi, 2026-11-19: "all in here is draft, we can revise it later". The overviews stay Draft until he confirms or renames them |
| OPEN-010 | V3 hero photograph (V3 plan I1) | Open Decision — the 400×400 portrait from OPEN-005 is too small for the V3 hero; a labelled placeholder stands in on `staging`, and release validation rejects it |

---

## Superseded Decisions

| ID | Previous Decision | Replacement |
|---|---|---|
| SUP-001 | MVP structure required unspecified changes. | Original five-route structure approved in Rounds 4 and 5. |
| SUP-002 | DEC-003 — positioning as Backend-Focused Full-Stack Developer. | **Backend Developer.** Randi's positioning is now consistently Backend Developer across LinkedIn, CV, and applications; the portfolio was the last surface still saying otherwise. Full-stack capability remains stated where it is truthful — the case studies and the technologies list — but no longer competes with the primary identity. v1.1 Issue 2. |
| SUP-003 | DEC-004 — target roles including Full-Stack Developer. | **Backend Developer, Backend Engineer, Software Engineer.** Follows SUP-002 for the same reason. v1.1 Issue 2. |
| SUP-004 | Availability stated as "Open to remote opportunities". | **"Open to opportunities."** The remote-only wording excluded hybrid and onsite roles Randi would consider, and no onsite, hybrid, or relocation availability has been confirmed — so the neutral form states openness without inventing a form of it. v1.1 Issue 3. The `remoteAvailability` field name was left unchanged at the time; renaming it would have touched schema, selectors, components, and tests for no reader-visible gain, and was assigned to v2. **Renamed to `availabilityStatement` on 2026-08-25 (Q10)** — v2 deferred it a second time, and a field whose name says *remote* while its value does not is a small untruth in a repository built to argue against those. Reader-visible output is unchanged. |
| SUP-018 | SUP-008 — Docker kept as currently-learning although used professionally. | **Docker, Linux, Jenkins and AWS are professional experience.** Randi, 2026-11-19 (V3 plan D9), asked with the August reasoning in front of him: his infrastructure role now centres on them. Jenkins, Linux and AWS gained skill records the same day. |
| SUP-017 | SUP-003 — target roles Backend Developer, Backend Engineer, Software Engineer. | **No target-roles list.** Removed at Randi's request on 2026-11-19, together with the field, in the V3 content phase. |
| SUP-016 | DEC-049 — three surfaces, `light`, `neutral`, `dark`. | **Five:** `dark`, `navy`, `light`, `white`, and one `blue` accent section, from the approved V3.1 mockup. Takes effect with the V3 release. `neutral` left `staging` in V3 P5b, with the Skills section that was its last user. |
| SUP-015 | DEC-013 — location "Yogyakarta, Indonesia". | **"Sleman, Yogyakarta, Indonesia"**, as in the experience records and on both résumés. V3 plan D11; applied in the V3 content phase. |
| SUP-014 | SUP-007 and SUP-009 — how the AI-Assisted Engineering section is presented, and which tool it names. | **No AI section.** AI-assisted practice is stated in the engineering approach and in the AI-assisted development project overview. V3 plan D10; takes effect with the V3 release. The section left `staging` in V3 P5 with the v2 homepage, and its records, schema, and release rule in P5b. |
| SUP-013 | DEC-050 — Archivo for display, Geist Sans for body. | **Geist only**, with display sizes from the type scale (DEC-061): one font request fewer. V3 plan D8; takes effect with the V3 release. |
| SUP-012 | SUP-005 — homepage order Navigation, Hero, About, Work Experience, Selected Projects, Technical Skills, AI Workflow, Contact, Footer. | **The V3.1 Overall order:** hero, profile, engineering focus, career (2024, 2025, 2026), selected work, how I approach engineering, education and credentials, explore further, contact. V3 plan D3; built on `staging` in V3 P5, takes effect with the V3 release. |
| SUP-011 | SUP-004 — availability stated as "Open to opportunities". | **No availability statement.** Removed at Randi's request on 2026-11-18, together with the `availabilityStatement` field, the contact section's separate "Open to backend and software engineering opportunities" sentence, and the social card's location suffix. FAC-PROFILE-001 now forbids the statement rather than requiring it. V3 plan, P0. |
| SUP-010 | SUP-002 — positioning as Backend Developer. | **Software Engineer · Backend & Infrastructure.** Since August 2026 Randi has been an AI Delivery Engineer on the infrastructure team, so "Backend Developer" no longer described the present. The positioning names the span of the work; formal titles stay in the experience timeline. Approved by Randi on 2026-11-18 (V3 plan, D1). Target roles (SUP-003) are unchanged, pending his decision. |
| SUP-009 | V2-P0-004 — whether AI practices should model Codex, Claude Code and ChatGPT rather than one tool. | **Claude Code is the representative tool; no change.** The About summary names three tools and every practice names Claude Code, which reads like an oversight and is not one. Confirmed by Randi 2026-08-16. PRD 13 forbids remodelling the content model to create visual symmetry: inventing per-tool practices to fill a grid would describe work that was not done that way. Recorded in `src/content/ai-practices.ts` so the asymmetry is not "fixed" later. |
| SUP-008 | V2-P0-003 — whether Docker's `currently-learning` classification should be upgraded because it appears in the current role. | **No change; the distinction is intentional.** Using a technology professionally does not make it a skill Randi is prepared to claim independently. Confirmed by Randi 2026-08-16 after the question was raised rather than assumed. PRD 13 explicitly forbids auto-upgrading it. Recorded in `src/content/skills.ts` because the apparent contradiction invites a well-meaning correction that would be inventing a claim on his behalf. |
| SUP-007 | AI-Assisted Engineering rendered on `bg-surface-muted`, sharing the emphasis treatment with Work Experience. | **Plain background, denser cards.** Measured before changing anything, because the handoff asked whether the treatment gave the section more weight than Work Experience or Projects rather than asserting it did: at 1280px it occupied 1206px against Projects' 734 (+64%) and was one of only two sections with a filled background — so the evidence sat on plain background while the section about tooling was visually promoted. Now 1134px (+54%) on plain background, using the same card treatment as project cards rather than a promoted variant. Height parity is not reachable without deleting the disclosure the section exists to make, so it was not chased. Position is unchanged and still after Work Experience, Projects and Technical Skills. v1.1 Issue 7, UX 7.8 amended. |
| SUP-006 | Project card ordered title, summary, role, with the label "Role". | **Project type + delivery status, title, my role, summary, technologies, View case study.** No field added or removed — order and label only. In a five-to-ten second scan the summary describes the project and the role describes Randi, so "what did *he* do here?" was answered last. "My role" scopes the claim for the same reason FAC-PROJECT-003 splits responsibility on the detail page. v1.1 Issue 6, UX 7.5 amended. Asserted by `tests/components/project-card-order.test.tsx`; nothing asserted it before. |
| SUP-005 | DEC-025 — Selected Projects before Work Experience on the homepage. | **Navigation, Hero, About, Work Experience, Selected Projects, Technical Skills, AI Workflow, Contact, Footer.** DEC-025 was right when project evidence had to carry the weight; Randi now has more than two years of professional experience with a legible internship → contract → full-time progression, and a recruiter reading an experienced developer expects employment history before case studies. v1.1 Issue 5. The header inventory (UX 6.1) moves with it, so the two surfaces do not disagree about what comes first. The order is now asserted by `tests/components/homepage-order.test.tsx`; nothing asserted it before. |
