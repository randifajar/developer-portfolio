# Functional Acceptance Criteria — Randi Fajar Wicaksono Developer Portfolio

## Document Information

- **Product Name:** Randi Fajar Wicaksono Developer Portfolio
- **Document Type:** Functional Acceptance Criteria
- **Version:** 0.1
- **Status:** Draft for Review
- **Source PRD:** `PORTFOLIO_PRD_v0.1.md`
- **Product Owner:** Randi Fajar Wicaksono
- **Last Updated:** 2026-08-04

---

## 1. Purpose

This document defines the functional conditions that must be satisfied before Version 1 of the portfolio can be accepted.

The criteria describe **what the product must do** from the perspective of public visitors and the Portfolio Owner.

The criteria do not prescribe implementation details such as framework choice, component structure, styling library, hosting vendor, or source-code organization.

---

## 2. Acceptance Rule

A functional criterion is accepted only when:

1. The described behavior is implemented.
2. The expected result can be observed.
3. Required validation passes.
4. Failure behavior is truthful.
5. No conflicting behavior exists.
6. Evidence is available through manual verification, automated tests, or both.

### Status values

- `Not Started`
- `In Progress`
- `Blocked`
- `Passed`
- `Failed`
- `Not Applicable`

### Priority values

- `P0` — Required for launch
- `P1` — Important for launch
- `P2` — May be completed after launch only when explicitly approved

All criteria in this document are `P0` or `P1`.

---

# 3. Professional Profile

## FAC-PROFILE-001 — Display the public identity

**Priority:** P0

**Given**
- A Published Professional Profile exists.

**When**
- A visitor opens the homepage.

**Then**
- The page displays:
  - `Randi Fajar Wicaksono`
  - The approved professional title
  - The approved headline
  - `Yogyakarta, Indonesia`
  - Availability

> **Amended in v1.1 (Issue 3).** This bullet read "Remote-work availability".
> The neutral wording adopted in SUP-004 states that Randi is open without
> asserting a form of availability that has not been confirmed, so the criterion
> now requires availability to be shown rather than requiring it to be remote.
> The visitor-facing guarantee is unchanged.

**Acceptance evidence**
- Homepage screenshot on desktop
- Homepage screenshot on mobile
- Automated content-rendering test

---

## FAC-PROFILE-002 — Display the professional photograph safely

**Priority:** P1

**Given**
- An approved Published professional photograph exists.

**When**
- The homepage is rendered.

**Then**
- The photograph is displayed.
- Meaningful alternative text is available.
- The image does not expose private or confidential information.

**Failure behavior**
- If the photograph is unavailable, the homepage remains usable and does not show a broken image.

---

## FAC-PROFILE-003 — Display the professional summary

**Priority:** P0

**Given**
- A Published Professional Profile exists.

**When**
- A visitor views the About section.

**Then**
- The section explains:
  - Backend-focused full-stack positioning
  - Relevant professional experience
  - Main engineering strengths
  - Current career direction

---

## FAC-PROFILE-004 — Keep one active public profile

**Priority:** P0

**Given**
- Portfolio content is prepared for publication.

**When**
- Publication validation runs.

**Then**
- No more than one Professional Profile can be active and Published.
- Conflicting active profiles block publication.

---

# 4. Navigation and Public Routes

## FAC-NAV-001 — Open the homepage

**Priority:** P0

**Given**
- The production application is available.

**When**
- A visitor opens `/`.

**Then**
- The homepage loads successfully.
- The primary professional identity is visible.
- Navigation is available.

---

## FAC-NAV-002 — Navigate to homepage sections

**Priority:** P0

**Given**
- The visitor is on the homepage.

**When**
- The visitor selects:
  - Experience
  - Skills
  - AI Workflow
  - Contact

**Then**
- The page navigates to the corresponding section.
- The destination heading is visible.
- Keyboard navigation remains usable.

---

## FAC-NAV-003 — Navigate to the Projects Index

**Priority:** P0

**Given**
- The visitor is on the homepage.

**When**
- The visitor selects `Projects` or `View All Projects`.

**Then**
- The visitor reaches `/projects`.

---

## FAC-NAV-004 — Open a Project Detail page directly

**Priority:** P0

**Given**
- A Published project with a valid slug exists.

**When**
- A visitor opens `/projects/[slug]` directly.

**Then**
- The case study is understandable without first visiting the homepage.
- Portfolio identity and navigation are available.
- Project title, role, and status are visible near the top.

---

## FAC-NAV-005 — Recover from an invalid route

**Priority:** P0

**Given**
- A visitor opens an unknown route.

**When**
- The route cannot be resolved.

**Then**
- The Not Found page is displayed.
- The visitor can return to Home.
- The visitor can open Projects.

---

## FAC-NAV-006 — Hide private route existence

**Priority:** P0

**Given**
- A project is Draft, Archived, Private, Restricted, or does not exist.

**When**
- A public visitor requests its slug.

**Then**
- The visitor receives the same public-facing Not Found result.
- The response does not reveal whether private content exists.

---

# 5. Homepage

## FAC-HOME-001 — Render all approved homepage sections

**Priority:** P0

**Given**
- Required Published content exists.

**When**
- The homepage loads.

**Then**
- The following sections are available:
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

## FAC-HOME-002 — Show primary calls to action

**Priority:** P0

**Given**
- The visitor views the Hero.

**Then**
- A `View Projects` action is available.
- A Resume action is available when an active Resume exists.

---

## FAC-HOME-003 — Show only valid featured projects

**Priority:** P0

**Given**
- Multiple Project Case Studies exist.

**When**
- The Selected Projects section is rendered.

**Then**
- Only projects with:
  - `publicationStatus = Published`
  - Publishable confidentiality classification
  - Complete required content
  - `featured = true`
  are displayed.

---

## FAC-HOME-004 — Allow launch with two projects

**Priority:** P0

**Given**
- Two valid featured projects are Published.
- The third project is not ready.

**When**
- The homepage renders.

**Then**
- Two project cards are shown.
- No empty placeholder card is shown.
- No fake `Coming Soon` project is shown.

---

## FAC-HOME-005 — Hide empty skill groups

**Priority:** P1

**Given**
- A skill group has no Published skills.

**When**
- The Skills section renders.

**Then**
- The empty group is not displayed.

---

## FAC-HOME-006 — Keep the homepage functional without optional media

**Priority:** P0

**Given**
- Optional project visuals or the professional photograph are unavailable.

**When**
- The homepage renders.

**Then**
- Text content remains complete and usable.
- No broken media placeholder is displayed.

---

# 6. Work Experience

## FAC-EXP-001 — Display Published experience records

**Priority:** P0

**Given**
- One or more Published Work Experience records exist.

**When**
- A visitor views the Work Experience section.

**Then**
- Each entry displays:
  - Company name
  - Position
  - Exact employment dates
  - Current-employment state when relevant
  - Role summary
  - Selected responsibilities
  - Selected contributions when available
  - Relevant technologies

---

## FAC-EXP-002 — Validate employment dates

**Priority:** P0

**Given**
- A Work Experience record is prepared for publication.

**When**
- Validation runs.

**Then**
- `startDate` is present.
- A non-current role has an `endDate`.
- `endDate` does not precede `startDate`.
- A current role is clearly marked.

---

## FAC-EXP-003 — Prevent Restricted experience publication

**Priority:** P0

**Given**
- A Work Experience record has `confidentialityClass = Restricted`.

**When**
- Publication is attempted.

**Then**
- Publication is blocked.
- The record does not appear publicly.

---

# 7. Projects Index

## FAC-PROJECTS-001 — Display all valid Published projects

**Priority:** P0

**Given**
- Valid Published Project Case Studies exist.

**When**
- A visitor opens `/projects`.

**Then**
- All valid Published projects are displayed.
- Draft, Archived, Private, and Restricted projects are excluded.

---

## FAC-PROJECTS-002 — Display required project-card information

**Priority:** P0

**Given**
- A project is displayed on the Projects Index.

**Then**
- Its card shows:
  - Title
  - Summary
  - Project type
  - Randi's role
  - Project Delivery Status
  - Selected technologies
  - Case-study action
  - Optional safe visual

---

## FAC-PROJECTS-003 — Use approved ordering

**Priority:** P1

**Given**
- Multiple projects are Published.

**When**
- The Projects Index renders.

**Then**
- Projects are ordered by:
  1. Featured priority
  2. Relevance or recency
  3. Remaining Published projects

---

## FAC-PROJECTS-004 — Handle no Published projects truthfully

**Priority:** P0

**Given**
- No valid Project Case Study is Published.

**When**
- A visitor opens `/projects`.

**Then**
- A truthful case-study preparation message appears.
- Home, Resume, and Contact actions remain available.
- The product is marked as not launch-ready in release validation.

---

# 8. Project Detail

## FAC-PROJECT-001 — Resolve a Published project by slug

**Priority:** P0

**Given**
- A Project Case Study has:
  - A unique slug
  - `publicationStatus = Published`
  - A publishable confidentiality classification

**When**
- A visitor opens its Project Detail URL.

**Then**
- The correct case study is displayed.

---

## FAC-PROJECT-002 — Display required case-study sections

**Priority:** P0

**Given**
- A valid Published project exists.

**When**
- Its detail page renders.

**Then**
- The page includes:
  - Project title
  - Summary
  - Project type
  - Randi's role
  - Project Delivery Status
  - Context
  - Problem
  - Personal responsibilities
  - Technical approach
  - Challenges
  - Decisions and trade-offs
  - Implementation summary
  - Testing and verification
  - Outcome
  - Lessons learned
  - Technology stack
  - Confidentiality note when relevant
  - Related navigation

---

## FAC-PROJECT-003 — Separate personal and team responsibilities

**Priority:** P0

**Given**
- A professional case study is Published.

**When**
- A visitor reviews the responsibility section.

**Then**
- Randi's responsibilities are explicit.
- Team or external-system responsibilities are not presented as Randi's sole ownership.

---

## FAC-PROJECT-004 — Display accurate delivery status

**Priority:** P0

**Given**
- A project is Published.

**When**
- The project card or detail page displays its status.

**Then**
- The status matches one approved Project Delivery Status value.
- `Production` is used only when production deployment is verified.
- `Completed` does not imply Production.
- `Proof of Concept` does not imply general production usage.

---

## FAC-PROJECT-005 — Prevent incomplete case-study publication

**Priority:** P0

**Given**
- A project is missing one or more required sections.

**When**
- Publication is attempted.

**Then**
- Publication is blocked.
- The project remains Draft.
- It does not appear on public routes.

---

## FAC-PROJECT-006 — Allow optional content omission

**Priority:** P1

**Given**
- A project has no safe diagram, screenshot, public repository, or numeric metric.

**When**
- The page renders.

**Then**
- The optional item is omitted.
- No invented content is created.
- Required narrative content remains complete.

---

## FAC-PROJECT-007 — Show AI-assisted engineering when relevant

**Priority:** P1

**Given**
- A project has approved AI-assisted engineering content.

**When**
- The Project Detail page renders.

**Then**
- The case study explains:
  - Tool used
  - Activity accelerated
  - Human decision responsibility
  - Review and validation method

---

## FAC-PROJECT-008 — Provide related navigation

**Priority:** P1

**Given**
- A visitor reaches the end of a Project Detail page.

**Then**
- `Back to Projects` is available.
- Previous or next project is available when applicable.
- Resume and Contact actions are available.

---

# 9. Technical Skills

## FAC-SKILL-001 — Display skills by practical group

**Priority:** P0

**Given**
- Published Technical Skills exist.

**When**
- The Skills section renders.

**Then**
- Skills are organized into approved practical groups.

---

## FAC-SKILL-002 — Display evidence-oriented classifications

**Priority:** P0

**Given**
- A skill is displayed.

**Then**
- Its classification is one of:
  - Strong Working Skill
  - Professional Experience
  - Currently Learning

---

## FAC-SKILL-003 — Do not display percentage scores

**Priority:** P0

**When**
- Skills are rendered.

**Then**
- No numeric proficiency percentage is shown.
- No progress bar implies a numeric skill score.

---

## FAC-SKILL-004 — Prevent duplicate canonical skill names

**Priority:** P1

**Given**
- Skills are validated.

**Then**
- The same canonical skill name does not exist as conflicting duplicate records.

---

# 10. AI-Assisted Engineering

## FAC-AI-001 — Display the approved AI workflow

**Priority:** P0

**Given**
- Published AI-Assisted Engineering content exists.

**When**
- A visitor views the AI Workflow section.

**Then**
- The section explains:
  - Tools used
  - Engineering activities supported
  - Human responsibilities
  - Review process
  - Testing and verification

---

## FAC-AI-002 — Preserve human accountability

**Priority:** P0

**When**
- AI usage is described anywhere in the portfolio.

**Then**
- The content does not present AI as the owner of final technical decisions.
- Randi remains explicitly responsible for review and validation.

---

## FAC-AI-003 — Prevent publication of raw private AI sessions

**Priority:** P0

**Given**
- Raw Claude, Codex, or ChatGPT exports exist in the private workspace.

**When**
- Public content is prepared.

**Then**
- Raw exports are not published.
- Only reviewed, sanitized summaries may appear publicly.

---

# 11. Resume

## FAC-RESUME-001 — Provide one active public Resume

**Priority:** P0

**Given**
- Resume publication validation runs.

**Then**
- Exactly one Resume is active and Published.
- The file format is PDF.

---

## FAC-RESUME-002 — Open or download the Resume

**Priority:** P0

**Given**
- An active public Resume exists.

**When**
- A visitor selects the Resume action.

**Then**
- The browser opens the PDF or provides browser-native download behavior.

---

## FAC-RESUME-003 — Handle unavailable Resume truthfully

**Priority:** P0

**Given**
- The active Resume file is unavailable or invalid.

**When**
- A visitor selects the Resume action.

**Then**
- The product does not claim success.
- A truthful unavailable state is provided.
- Home, LinkedIn, and email alternatives remain available.

---

## FAC-RESUME-004 — Prevent multiple active Resumes

**Priority:** P0

**Given**
- More than one Resume is active and Published.

**When**
- Validation runs.

**Then**
- Publication fails until exactly one active Resume remains.

---

# 12. Contact and External Profiles

## FAC-CONTACT-001 — Display the public email

**Priority:** P0

**Then**
- `randifajar2307@gmail.com` is available through an approved public email action.

---

## FAC-CONTACT-002 — Start email contact without claiming delivery

**Priority:** P0

**When**
- A visitor selects the email action.

**Then**
- The visitor's environment attempts to open a configured email client.
- The portfolio does not claim that an email was sent or delivered.

---

## FAC-CONTACT-003 — Open LinkedIn

**Priority:** P0

**When**
- A visitor selects LinkedIn.

**Then**
- The approved URL opens:
  - `https://www.linkedin.com/in/randifajar`

---

## FAC-CONTACT-004 — Open GitHub

**Priority:** P0

**When**
- A visitor selects GitHub.

**Then**
- The approved URL opens:
  - `https://github.com/randifajar`

---

## FAC-CONTACT-005 — Exclude a contact form

**Priority:** P0

**Then**
- Version 1 contains no contact-submission form.
- No contact-form API or success state is exposed.

---

# 13. Publication and Confidentiality

## FAC-PUBLISH-001 — Publish only Published content

**Priority:** P0

**Given**
- Content exists in multiple Publication Status values.

**When**
- Public pages render.

**Then**
- Only `Published` content is visible.

---

## FAC-PUBLISH-002 — Publish only safe confidentiality classes

**Priority:** P0

**Given**
- Content is classified as Public, Sanitized, Private, or Restricted.

**When**
- Publication validation runs.

**Then**
- Only Public or approved Sanitized content can be Published.
- Private and Restricted content cannot appear publicly.

---

## FAC-PUBLISH-003 — Prevent restricted media rendering

**Priority:** P0

**Given**
- A Media Asset is Restricted.

**When**
- A public page renders.

**Then**
- The asset is never rendered.
- Its private path is not exposed.

---

## FAC-PUBLISH-004 — Preserve truthful project status

**Priority:** P0

**Given**
- A project did not reach production.

**When**
- Its case study is prepared.

**Then**
- The project cannot use `Production`.

---

## FAC-PUBLISH-005 — Prevent invented outcome metrics

**Priority:** P0

**Given**
- Reliable numeric metrics are unavailable.

**When**
- A case study is authored.

**Then**
- The outcome uses truthful observable results.
- No numeric impact is invented.

---

# 14. Portfolio Owner Publishing Flow

## FAC-OWNER-001 — Keep incomplete content in Draft

**Priority:** P0

**Given**
- Required content or evidence is incomplete.

**When**
- The owner prepares a change.

**Then**
- The item remains Draft.
- It cannot appear publicly.

---

## FAC-OWNER-002 — Block publication when automated validation fails

**Priority:** P0

**Given**
- A pull request contains an invalid change.

**When**
- Automated validation fails.

**Then**
- The change cannot be accepted as publication-ready.
- The failure is visible to the owner.

---

## FAC-OWNER-003 — Require preview review before publication

**Priority:** P1

**Given**
- A change passes automated validation.

**When**
- A preview is available.

**Then**
- The owner can review the changed public experience before merge.

---

## FAC-OWNER-004 — Deploy approved changes automatically

**Priority:** P0

**Given**
- An approved change is merged into the production branch.

**When**
- The merge completes.

**Then**
- Managed production deployment is triggered automatically.

---

## FAC-OWNER-005 — Verify production after deployment

**Priority:** P0

**Given**
- Deployment reports success.

**When**
- Publication is evaluated.

**Then**
- The owner verifies the production website.
- A deployment is not considered fully accepted only because the deployment system returned success.

---

## FAC-OWNER-006 — Correct or roll back invalid production content

**Priority:** P0

**Given**
- Production content is incorrect, broken, or unsafe.

**When**
- The issue is identified.

**Then**
- The owner can correct the content through a new change or restore the previous valid state.

---

# 15. Launch Acceptance Criteria

Version 1 is functionally launch-ready only when all conditions below are Passed:

- [ ] FAC-PROFILE-001
- [ ] FAC-PROFILE-003
- [ ] FAC-NAV-001 through FAC-NAV-006
- [ ] FAC-HOME-001 through FAC-HOME-006
- [ ] FAC-EXP-001 through FAC-EXP-003
- [ ] FAC-PROJECTS-001 through FAC-PROJECTS-004
- [ ] FAC-PROJECT-001 through FAC-PROJECT-008
- [ ] FAC-SKILL-001 through FAC-SKILL-003
- [ ] FAC-AI-001 through FAC-AI-003
- [ ] FAC-RESUME-001 through FAC-RESUME-004
- [ ] FAC-CONTACT-001 through FAC-CONTACT-005
- [ ] FAC-PUBLISH-001 through FAC-PUBLISH-005
- [ ] FAC-OWNER-001 through FAC-OWNER-006
- [ ] At least two complete Project Case Studies are Published.
- [ ] The Personal Developer Portfolio case study is Published.
- [ ] The Jury Process Management Integration case study is Published.
- [ ] All public claims have been reviewed by the Portfolio Owner.
- [ ] No Restricted information is exposed.

---

## 16. Traceability Summary

| FAC Area | Primary PRD Sections |
|---|---|
| Professional Profile | 1, 3, 5, 7 |
| Navigation and Routes | 4, 5, 6 |
| Homepage | 4, 5, 6 |
| Work Experience | 3, 5, 7 |
| Project Index and Detail | 3, 4, 5, 6, 7 |
| Skills | 3, 5, 7 |
| AI-Assisted Engineering | 3, 5, 6, 7 |
| Resume | 3, 5, 6, 7 |
| Contact | 2, 3, 5, 6, 7 |
| Publication and Confidentiality | 1, 3, 5, 6, 7 |
| Owner Publishing Flow | 1, 2, 4, 6 |

---

## 17. Approval

This FAC document is ready for Product Owner review.
