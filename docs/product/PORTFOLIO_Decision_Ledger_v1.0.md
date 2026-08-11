# Developer Portfolio — Decision Ledger

## Document Information

- **Product Name:** Randi Fajar Wicaksono Developer Portfolio
- **Document Type:** Decision Ledger
- **Version:** 1.0
- **Status:** Updated After Product Model Approval
- **Owner:** Randi Fajar Wicaksono
- **Last Updated:** 2026-08-04

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

---

## Remaining Content Decisions

These do not block technical design when represented by Draft placeholder content:

| ID | Topic | Status |
|---|---|---|
| OPEN-001 | Final professional headline | Open Decision |
| OPEN-002 | Final professional summary | Open Decision |
| OPEN-003 | Final third project | Open Decision |
| OPEN-004 | Final skill classification | Open Decision |
| OPEN-005 | Final professional photograph | Open Decision |
| OPEN-006 | Safe project visuals | Open Decision |
| OPEN-007 | Custom domain at launch | Open Decision |

---

## Superseded Decisions

| ID | Previous Decision | Replacement |
|---|---|---|
| SUP-001 | MVP structure required unspecified changes. | Original five-route structure approved in Rounds 4 and 5. |
| SUP-002 | DEC-003 — positioning as Backend-Focused Full-Stack Developer. | **Backend Developer.** Randi's positioning is now consistently Backend Developer across LinkedIn, CV, and applications; the portfolio was the last surface still saying otherwise. Full-stack capability remains stated where it is truthful — the case studies and the technologies list — but no longer competes with the primary identity. v1.1 Issue 2. |
| SUP-003 | DEC-004 — target roles including Full-Stack Developer. | **Backend Developer, Backend Engineer, Software Engineer.** Follows SUP-002 for the same reason. v1.1 Issue 2. |
| SUP-004 | Availability stated as "Open to remote opportunities". | **"Open to opportunities."** The remote-only wording excluded hybrid and onsite roles Randi would consider, and no onsite, hybrid, or relocation availability has been confirmed — so the neutral form states openness without inventing a form of it. v1.1 Issue 3. The `remoteAvailability` field name is unchanged; renaming it would touch schema, selectors, components, and tests for no reader-visible gain, and belongs to v2. |
| SUP-005 | DEC-025 — Selected Projects before Work Experience on the homepage. | **Navigation, Hero, About, Work Experience, Selected Projects, Technical Skills, AI Workflow, Contact, Footer.** DEC-025 was right when project evidence had to carry the weight; Randi now has more than two years of professional experience with a legible internship → contract → full-time progression, and a recruiter reading an experienced developer expects employment history before case studies. v1.1 Issue 5. The header inventory (UX 6.1) moves with it, so the two surfaces do not disagree about what comes first. The order is now asserted by `tests/components/homepage-order.test.tsx`; nothing asserted it before. |
