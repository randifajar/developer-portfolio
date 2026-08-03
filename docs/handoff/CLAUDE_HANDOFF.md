# Claude Handoff — Randi Fajar Wicaksono Developer Portfolio

## Document Information

- **Handoff Version:** 1.0
- **Date:** 2026-08-04
- **Product Owner:** Randi Fajar Wicaksono
- **Current Stage:** Implementation Planning
- **Assigned Agent:** Claude
- **Immediate Assignment:** Inspect the repository and create the implementation plan
- **Implementation Permission:** Not granted

---

# 1. Mission

Create a detailed, executable implementation plan for the **Randi Fajar Wicaksono Developer Portfolio**.

The portfolio is intended to:

1. Help Randi secure a new job.
2. Position him as a **Backend-Focused Full-Stack Developer**.
3. Present truthful professional experience and selected project case studies.
4. Demonstrate responsible AI-assisted engineering.
5. Become the foundation of his long-term personal brand.

Your current task is **planning only**.

Do not begin application implementation.

---

# 2. Required Completion Boundary

You must stop after producing the implementation plan.

You must not:

- Scaffold the application
- Install or update dependencies
- Modify source code
- Create application components
- Create content modules
- Configure CI/CD
- Configure Vercel
- Add Docker files
- Deploy the application
- Commit implementation changes
- Rewrite approved product requirements
- Invent missing professional achievements
- Publish Draft, Private, or Restricted content

The only repository change allowed during this stage is the implementation-plan document itself, when the Product Owner explicitly permits you to write it.

If file creation is not yet permitted, provide the complete plan in chat and wait.

---

# 3. Approved Source Documents

Read these files before planning, in this priority order:

1. `docs/product/PORTFOLIO_Decision_Ledger_v1.0.md`
2. `docs/product/PORTFOLIO_PRD_v0.1.md`
3. `docs/product/PORTFOLIO_FAC_v0.1.md`
4. `docs/product/PORTFOLIO_NFAC_v0.1.md`
5. `docs/product/PORTFOLIO_UX_UI_SPEC_v0.1.md`
6. `docs/product/PORTFOLIO_TECHNICAL_DESIGN_v0.1.md`
7. `docs/product/PORTFOLIO_Product_Model_v1.0.md`

Supporting references:

- `docs/reference/PORTFOLIO_5_THINGS.md`
- `docs/reference/PORTFOLIO_Open_Decisions.md`
- `docs/reference/portfolio-development-plan.md`

## Source precedence

When sources conflict, use this order:

1. Latest explicit Product Owner instruction
2. Decision Ledger
3. PRD
4. FAC and NFAC
5. UX/UI Specification
6. Technical Design
7. Product Model
8. Supporting references
9. Your inference

Do not silently resolve a material conflict through inference.

Record the conflict and propose one resolution.

---

# 4. Confirmed Product Decisions

Treat these as fixed unless the Product Owner explicitly changes them:

- The website is public and read-only.
- The primary language is English.
- The primary goal is to secure a new job.
- The long-term goal is personal branding.
- The positioning is Backend-Focused Full-Stack Developer.
- Target roles are:
  1. Backend Developer
  2. Full-Stack Developer
  3. Software Engineer
- Target opportunities are remote-friendly Indonesian and international roles.
- Version 1 has no visitor login.
- Version 1 has no admin dashboard.
- Version 1 has no CMS.
- Version 1 has no database.
- Version 1 has no custom runtime API.
- Version 1 has no contact form.
- Version 1 has no live LinkedIn or GitHub synchronization.
- Public contact uses email, LinkedIn, GitHub, and Resume.
- Content is maintained through source-controlled files.
- The Portfolio Owner publishing workflow uses branches, pull requests, CI checks, managed previews, merge to `production`, automatic deployment, and production verification.
- Version 1 may launch with two strong published projects.
- The Personal Developer Portfolio is a launch project.
- Jury Process Management Integration is a launch case study.
- The third project is not a launch blocker.
- Unfinished or reassigned work cannot be represented as completed.
- Work not deployed to production cannot use the Production status.
- Private and Restricted information must never enter the public repository.
- Raw Claude, Codex, and ChatGPT exports remain private.
- AI accelerates engineering work; Randi retains responsibility for requirements, architecture, review, testing, security, and final decisions.
- Managed hosting is the Version 1 production path.
- Docker must not block the initial launch.

---

# 5. Confirmed Technical Direction

The approved technical direction is:

- **UI library:** React
- **Application framework:** Next.js App Router
- **Language:** TypeScript
- **Runtime:** Node.js 24 LTS
- **Package manager:** npm
- **Styling:** Tailwind CSS v4
- **Content:** Typed local TypeScript modules
- **Long-form project content:** Markdown strings rendered safely
- **Validation:** Zod plus custom cross-record validation
- **Rendering:** Static generation with Server Components by default
- **Client Components:** Only at the smallest browser-interaction boundaries
- **Testing:** Vitest, Testing Library, Playwright, and automated accessibility checks
- **CI:** GitHub Actions
- **Preview and Production hosting:** Vercel Git integration
- **Production branch:** `production`
- **Docker:** Post-launch enhancement

Next.js does not replace React. The implementation uses React through Next.js.

The Technical Design is the accepted baseline, but you must validate it against the actual repository and installed stable versions.

Do not silently change the architecture.

When a change is necessary, document:

1. The approved design
2. The repository reality
3. The conflict
4. The recommended change
5. The affected requirements
6. The trade-off

---

# 6. Required Repository Inspection

Before creating the implementation plan, inspect the actual workspace.

At minimum inspect:

## Git state

- Repository root
- Current branch
- Git status
- Existing commits
- Existing `.gitignore`
- Whether the repository is public or private

## Runtime and dependencies

- `package.json`
- `package-lock.json`
- `.nvmrc`
- `.node-version`
- Node engine declaration
- Installed framework versions
- Existing dependencies
- Existing scripts

## Application structure

- `src/app`
- `src/components`
- `src/content`
- `src/domain`
- `src/lib`
- `public`
- Existing routes
- Existing assets
- Existing content

## Configuration

- `tsconfig.json`
- `next.config.*`
- ESLint configuration
- Prettier configuration
- Tailwind and PostCSS configuration
- Environment files
- Playwright configuration
- Vitest configuration

## Quality and delivery

- Existing tests
- Existing GitHub Actions
- Existing Vercel configuration
- Existing documentation
- Existing Docker files
- Existing security or secret-scanning configuration

Do not assume that the repository already matches the Technical Design.

If the repository is empty, explicitly state that and plan initialization without performing it.

---

# 7. Planning Principles

## 7.1 Use real repository paths

Every task must reference actual paths discovered during inspection.

When a file does not yet exist, identify it as a file to create.

## 7.2 Plan in dependency order

A task may depend only on completed earlier tasks.

Do not plan pages before the required domain model, content validation, selectors, and design foundations exist.

## 7.3 Prefer small reviewable tasks

Each task should:

- Have one primary objective
- Touch a limited set of related files
- Define tests
- Define verification commands
- End at a reasonable commit boundary

Do not create one task called “Build the portfolio.”

## 7.4 Use test-driven development where logic matters

For:

- Content schemas
- Cross-record validation
- Selectors
- Route-resolution rules
- Project ordering
- Publication filtering
- Status mappings
- Resume validation
- Critical reusable behavior

Plan this sequence:

1. Define expected behavior.
2. Create a failing test.
3. Implement the smallest valid change.
4. Run the focused test.
5. Run affected regression tests.
6. Refactor after passing.

Do not add ceremonial tests after all implementation is finished.

## 7.5 Preserve scope

Do not add:

- Database
- CMS
- Authentication
- Admin dashboard
- Contact form
- API routes
- Global state library
- Large UI component library
- Animation framework
- Runtime content fetching
- Microservices
- Production container orchestration

A new dependency requires a clear purpose.

## 7.6 Preserve confidentiality

The plan must keep these outside the public repository:

- Raw AI exports
- Company documents
- Internal notes
- Unsafe screenshots
- Private project evidence
- Internal URLs
- Credentials
- Student or customer data
- Restricted diagrams

`Draft` means unpublished by the website. It does not make a file private on GitHub.

Draft content committed publicly must already be safe.

---

# 8. Required Implementation-Plan Structure

Create the final plan at:

`docs/plans/2026-08-04-portfolio-implementation-plan.md`

Use the current date instead when planning occurs on another date.

The document must contain the following sections.

## 8.1 Executive Summary

Include:

- Current repository state
- Recommended implementation approach
- Estimated phase sequence, without time promises
- Main risks
- Readiness for implementation

## 8.2 Repository Assessment

Document:

- Existing files
- Existing configuration
- Existing dependencies
- Missing prerequisites
- Differences from the Technical Design
- Technical debt that directly affects this project

Do not recommend unrelated refactoring.

## 8.3 Source-Document Summary

Summarize:

- Product goal
- Version 1 scope
- Non-goals
- Required routes
- Required user flows
- Key FAC requirements
- Key NFAC requirements
- UX direction
- Technical boundaries

## 8.4 Confirmed Technical Assumptions

List assumptions that are safe to use during implementation.

Every assumption must have a source.

## 8.5 Conflicts and Risks

For each issue, include:

- ID
- Description
- Source conflict
- Impact
- Recommended resolution
- Whether it blocks implementation

## 8.6 Dependency Graph

Show the implementation dependency order.

Example structure:

```text
Repository setup
→ Tooling
→ Design tokens
→ Domain schemas
→ Content validation
→ Selectors
→ UI primitives
→ Shared layout
→ Homepage
→ Projects
→ Metadata
→ Tests
→ CI/CD
→ Deployment
→ Release verification
```

Adapt this to the real repository.

## 8.7 Detailed Phases

Each phase must include:

- Phase ID and title
- Goal
- Dependencies
- Files to create
- Files to modify
- Files to remove, when justified
- Step-by-step implementation
- Tests to create first
- Commands to run
- Expected results
- Related FAC IDs
- Related NFAC IDs
- Risks
- Verification steps
- Commit boundary

## 8.8 Test Strategy

Map tests to:

- Domain validation
- Content filtering
- Selectors
- Components
- Navigation
- Project Detail routes
- Resume
- Not Found
- Accessibility
- Responsive behavior
- Cross-browser behavior
- Performance release audit

## 8.9 CI/CD Plan

Define:

- Required pull-request jobs
- Required commands
- Branch protection
- Preview deployment behavior
- Production deployment behavior
- Release audit
- Production verification

## 8.10 Release Plan

Include:

- Structural validation
- Release validation
- Content approval
- Confidentiality review
- Link validation
- Resume validation
- Accessibility audit
- Performance audit
- Production smoke test
- Rollback procedure

## 8.11 Traceability Matrix

Map every implementation phase to:

- PRD sections
- FAC IDs
- NFAC IDs
- UX/UI sections
- Technical Design sections

## 8.12 Open Questions

Include only questions that:

- Cannot be answered through repository inspection
- Cannot be answered through approved documents
- Materially block implementation

Do not ask for final headline, final photograph, third project, or final content merely to begin building the safe Draft structure.

Those are content inputs and may remain Draft until release.

---

# 9. Minimum Planning Phases to Evaluate

You may revise the order based on repository evidence, but the plan must cover:

1. Repository and Node.js initialization
2. Next.js, React, TypeScript, and Tailwind setup
3. ESLint and Prettier
4. Design tokens and global layout
5. Domain enums, types, and Zod schemas
6. Content definition helpers
7. Safe Draft content modules
8. Structural content validation
9. Release content validation
10. Content selector layer
11. Reusable UI primitives
12. Header, mobile navigation, and Footer
13. Homepage Hero and About
14. Selected Projects
15. Work Experience
16. Technical Skills
17. AI-Assisted Engineering
18. Contact section
19. Projects Index
20. Project Detail static routes
21. Resume behavior
22. Not Found behavior
23. Metadata
24. Open Graph image
25. Sitemap and robots
26. Unit tests
27. Component tests
28. End-to-end tests
29. Accessibility tests
30. Cross-browser verification
31. GitHub Actions
32. Vercel Preview and Production preparation
33. Release audit
34. Production verification
35. Rollback verification
36. Post-launch Docker enhancement

Do not merge these into a few enormous phases merely to shorten the document.

---

# 10. Required Acceptance Coverage

The plan must explicitly cover all launch-blocking criteria.

## Functional

At minimum:

- Professional identity
- Public navigation
- Homepage sections
- Work Experience
- Projects Index
- Project Detail
- Project status integrity
- Skills
- AI workflow
- Resume
- Email
- LinkedIn
- GitHub
- Publication filtering
- Confidentiality filtering
- Owner publishing flow
- Invalid-route privacy

## Non-functional

At minimum:

- Core Web Vitals
- Lighthouse
- WCAG 2.2 AA
- Keyboard navigation
- Mobile behavior
- Secret protection
- Confidentiality
- Dependency audit
- Safe external links
- Reliability
- SEO
- Browser compatibility
- Structured validation
- Test commands
- CI/CD
- Production verification
- Rollback
- Content quality

---

# 11. Content Strategy During Implementation

Safe placeholder content is permitted only as Draft content.

Placeholder requirements:

- Clearly marked in source
- Structurally valid
- Public-repository safe
- Contains no company secrets
- Contains no fake production result
- Cannot pass release validation
- Does not use fake metrics
- Does not appear on Published routes

The production release must contain no:

- `TODO`
- `TBD`
- `Lorem ipsum`
- Fake metrics
- Unverified claim
- Unsafe screenshot
- Raw AI conversation
- Empty required section

---

# 12. Plan Quality Standard

The plan is acceptable only when another engineering agent can execute it without inventing:

- File paths
- Requirement behavior
- Validation rules
- Test expectations
- Deployment flow
- Publication rules
- Confidentiality rules
- Success conditions

Avoid vague tasks such as:

- “Set up the frontend”
- “Add tests”
- “Make it responsive”
- “Improve SEO”
- “Configure CI/CD”

Specify the concrete behavior, files, commands, and acceptance criteria.

---

# 13. Final Response Required from Claude

After the plan is created, provide:

1. Repository assessment summary
2. Plan file location
3. Number of phases and tasks
4. Material conflicts found
5. Genuine blockers
6. Confirmation that no implementation was performed

Then stop and wait for Product Owner approval.

---

# 14. Start Instruction

Begin by:

1. Reading this handoff.
2. Reading all approved source documents.
3. Inspecting the actual repository.
4. Reporting the repository assessment.
5. Creating the implementation plan.
6. Stopping before implementation.
