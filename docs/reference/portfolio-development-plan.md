# Portfolio Development Plan

## 1. Purpose

Build a professional portfolio that helps Wicak secure a new job while creating a foundation for long-term personal branding.

The portfolio will position Wicak as a:

> **Backend-Focused Full-Stack Developer**

The primary strength is backend engineering, supported by practical frontend development, deployment, debugging, system integration, and AI-assisted software development.

The first version must be:

- Fast to build
- Cheap to deploy
- Honest and evidence-based
- Easy for recruiters to understand
- Maintainable and expandable
- Safe from confidential company information

---

## 2. Primary Goals

The portfolio must:

1. Help Wicak get interviews and job opportunities.
2. Present credible professional experience.
3. Demonstrate backend-focused full-stack capability.
4. Show completed and meaningful engineering work.
5. Explain how AI is used responsibly during development.
6. Provide easy access to the CV, LinkedIn, GitHub, and contact information.
7. Become the foundation of Wicak's long-term personal brand.

---

## 3. Target Audience

The portfolio will primarily target:

- Remote-friendly companies
- Indonesian companies
- International companies
- Recruiters
- Hiring managers
- Engineering managers
- Technical interviewers

The portfolio will use English as its primary language.

---

## 4. Professional Positioning

### Working Title

**Backend-Focused Full-Stack Developer**

### Draft Headline

> Building reliable backend systems, data-heavy applications, integrations, and end-to-end features with Node.js, TypeScript, MongoDB, GraphQL, Docker, AWS, and AI-assisted engineering workflows.

This headline is still a draft and will be refined after reviewing the CV, LinkedIn profile, and project evidence.

---

## 5. Portfolio Scope

### Version 1: Urgent Job-Search Portfolio

The first release will include:

1. Hero section
2. About section
3. Selected projects
4. Work experience
5. Technical skills
6. AI-assisted engineering workflow
7. CV download
8. LinkedIn and GitHub links
9. Contact section
10. Responsive mobile and desktop layouts
11. Basic SEO and social-sharing metadata

### Future Versions

Possible future improvements:

- Technical articles
- Blog or notes section
- Custom domain
- Headless CMS
- Custom backend and database
- Admin dashboard
- Portfolio analytics
- More project case studies
- Downloadable case-study documents
- Richer diagrams and project visuals
- Production container deployment

These future features must not delay the first release.

---

## 6. Project Strategy

The launch portfolio should contain three strong project entries.

### Project 1: Personal Developer Portfolio

This will be Wicak's first public personal project.

It will demonstrate:

- Requirement definition
- Product planning
- Frontend implementation
- Responsive design
- TypeScript code quality
- Testing
- CI/CD
- Deployment
- Documentation
- AI-assisted development
- Long-term maintenance

### Project 2: Jury Process Management Integration

A sanitized professional case study based on Wicak's responsibility for integrating Jury Process Management with a separate internal application.

Possible topics:

- Cross-application integration
- Workflow synchronization
- Jury assignment and scheduling
- Backend and frontend integration
- GraphQL or API communication
- MongoDB data handling
- Task creation and downstream workflows
- Production debugging
- Regression prevention
- Coordination across repositories and teams

The final case study must avoid exposing:

- Private source code
- Internal URLs
- Credentials
- Customer or student data
- Confidential screenshots
- Proprietary architecture details
- Private repository links

### Project 3: Pending Evidence Audit

The third project will be selected after auditing the exported Claude and Codex conversations.

Possible candidates may include:

- A completed student correction-type feature
- Another completed production feature
- A completed integration
- A meaningful production bug fix
- A new public backend project

A project must not be selected only because work was started. It should have enough evidence of ownership, completion, technical complexity, and outcome.

---

## 7. Project Classification Rules

Each project candidate will be classified as follows:

| Status | Portfolio Use |
|---|---|
| Completed and deployed | Main case study |
| Completed and approved but not deployed | Secondary case study |
| Proof of concept | Engineering experiment |
| Unfinished or reassigned | Supporting experience only |
| Analysis or planning only | Mention under responsibilities |
| Confidential or unclear | Exclude or heavily sanitize |

The portfolio must never imply that an unfinished, reassigned, or non-production project was successfully delivered to production.

---

## 8. AI-Assisted Engineering Positioning

AI-assisted development will be an important part of the portfolio.

The portfolio should not present Wicak as someone who depends blindly on AI-generated code.

The intended message is:

> I use AI to accelerate engineering work while remaining responsible for architecture, requirement validation, code review, testing, security, and final technical decisions.

### AI Tools

- OpenAI Codex
- Claude Code
- ChatGPT

### AI-Assisted Activities

- Repository exploration
- Requirement analysis
- Technical planning
- Implementation planning
- Scoped code generation
- Debugging
- Test generation
- Code review
- Documentation
- Prompt refinement
- Architecture discussion

### Human Responsibility

Wicak remains responsible for:

- Understanding the business requirement
- Validating assumptions
- Selecting the architecture
- Reviewing generated code
- Running tests
- Checking regressions
- Protecting confidential information
- Approving the final implementation

---

## 9. Recommended MVP Architecture

### Technology Stack

| Area | Recommendation |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Content | Markdown, MDX, or typed local data |
| Repository | Public GitHub repository |
| CI | GitHub Actions |
| CD | Managed Git deployment |
| Hosting | Vercel or equivalent managed hosting |
| Database | Not required for Version 1 |
| Backend API | Not required for Version 1 |
| Resume | Static PDF |
| Project images | Static optimized assets |

### Deployment Flow

```text
Feature branch
    ↓
Pull request
    ↓
GitHub Actions
    ├── Install dependencies
    ├── Lint
    ├── Type-check
    ├── Run tests
    └── Build
    ↓
Merge to main
    ↓
Automatic production deployment
```

---

## 10. Database Decision

Version 1 will not use a database.

Portfolio content will be managed through:

- Markdown files
- MDX files
- Typed TypeScript data
- Git version history
- Pull requests
- Automatic deployment

This provides:

- Content history
- Review
- Rollback
- Simple publishing
- Low hosting cost
- Minimal security risk
- Fast development

A database may be added later when there is a real requirement for:

- Admin login
- Browser-based content editing
- Draft and published states
- Image management
- Article management
- Visitor accounts
- Comments
- Custom analytics
- Frequent content updates by non-developers

---

## 11. Docker Decision

Docker is not required for the first production deployment.

### Version 1

- Deploy using a managed platform
- Use GitHub Actions for CI
- Avoid VPS maintenance
- Focus on launching quickly

### Later Improvement

Add:

- `Dockerfile`
- `.dockerignore`
- Optional `docker-compose.yml`
- Docker documentation
- Local container verification

Docker support can demonstrate container knowledge without forcing the production site to run on a self-managed server.

---

## 12. Portfolio Content Structure

The first version should contain the following pages or sections.

### Home

- Name
- Professional title
- Short professional summary
- Primary call to action
- CV download
- Contact links

### About

- Professional background
- Backend focus
- Full-stack capability
- Engineering values
- Current career direction

### Experience

For each role:

- Company
- Position
- Employment dates
- Main responsibilities
- Technologies
- Important contributions
- Production or operational involvement

### Projects

Each case study should include:

- Project title
- Context
- Problem
- Wicak's role
- Responsibilities
- Technical challenges
- Architecture
- Important decisions
- Implementation
- Testing
- Deployment status
- Outcome
- Lessons learned
- AI usage
- Confidentiality note where appropriate

### Technical Skills

Skills should be grouped into:

1. Strong working skills
2. Professional experience
3. Currently learning

Avoid percentage-based skill bars.

### AI-Assisted Engineering

Explain:

- How AI is used
- Where human judgment is required
- How generated work is verified
- Examples of successful AI-assisted workflows
- Examples where AI assumptions were corrected

### Contact

- Professional email
- LinkedIn
- GitHub
- CV download
- Remote-work availability

---

## 13. Information to Prepare

### Identity

Prepare:

- Full public name
- Preferred professional title
- Current city and country
- Remote-work availability
- Professional email
- LinkedIn URL
- GitHub URL
- Current CV
- Latest LinkedIn profile PDF

Suggested public location format:

> Yogyakarta, Indonesia · Open to Remote Opportunities

Do not include a full home address.

### Work Experience

For each role, prepare:

- Company name
- Position
- Start date
- End date or current status
- Main responsibilities
- Technologies used
- Completed projects
- Deployed features
- Major bugs or incidents solved
- Integrations owned
- Operational or deployment work
- Observable outcomes
- Reliable metrics, if available

Do not invent metrics.

When exact numbers are unavailable, use truthful outcomes such as:

- Enabled a new workflow
- Integrated two applications
- Reduced manual steps
- Resolved a production issue
- Improved system reliability
- Passed QA
- Released to production
- Supported a production rollout

### Project Evidence

For each possible case study, prepare:

- Project name
- Business problem
- User problem
- Wicak's role
- Exact responsibilities
- Technical architecture
- Data flow
- Technologies
- Important decisions
- Difficult bugs
- Testing process
- Deployment status
- Final outcome
- Lessons learned
- Supporting evidence

### AI Evidence

Prepare examples from:

- Claude Code
- Codex
- ChatGPT

Useful evidence includes:

- Planning conversations
- Repository analysis
- Debugging sessions
- Code review
- Implementation decisions
- Testing and verification
- Incorrect AI assumptions that were corrected
- Prompt improvements
- Final implementation summaries

### Visual Assets

Prepare only safe assets:

- Professional photograph, optional
- CV PDF
- Sanitized diagrams
- Sanitized screenshots
- GitHub profile
- LinkedIn profile

Do not include:

- Credentials
- Secrets
- Internal URLs
- Customer data
- Student data
- Private repository links
- Confidential code
- Confidential database screenshots
- Unapproved company application screenshots

---

## 14. Preparation Workspace

The preparation workspace is not the portfolio repository.

It is a private working folder used to collect evidence, drafts, exports, and assets before development begins.

Recommended structure:

```text
portfolio-workspace/
├── preparation/
│   ├── cv.pdf
│   ├── linkedin-profile.pdf
│   ├── profile-notes.md
│   ├── work-experience.md
│   ├── skills.md
│   ├── project-candidates.md
│   ├── claude-exports/
│   ├── codex-exports/
│   └── assets/
│
├── planning/
│   ├── portfolio-plan.md
│   ├── portfolio-brief.md
│   ├── content-inventory.md
│   ├── design-specification.md
│   └── implementation-plan.md
│
└── portfolio/
    └── Future Git repository
```

### Repository Boundary

Only the `portfolio/` directory will later become the public Git repository.

The following should remain private:

- Raw Claude exports
- Raw Codex exports
- Internal project evidence
- Confidential screenshots
- Draft notes
- Unfiltered work history
- Company documents
- Credentials or environment information

Do not initialize Git at the root of `portfolio-workspace/`.

Initialize Git only inside:

```text
portfolio-workspace/portfolio/
```

---

## 15. Development Phases

### Phase 1: Professional Identity

Finalize:

- Title
- Headline
- Summary
- Target roles
- Main strengths
- Remote positioning
- Personal tone

### Phase 2: Content Inventory

Collect and organize:

- CV
- LinkedIn
- Work history
- Skills
- Project candidates
- AI-assisted development evidence
- Safe assets

### Phase 3: Evidence Audit

Analyze Claude and Codex exports to identify:

- Completed work
- Production work
- Ownership
- Technical decisions
- Debugging evidence
- AI usage
- Portfolio-safe case studies

### Phase 4: Project Selection

Select:

1. Personal Developer Portfolio
2. Jury Process Management Integration
3. Strongest remaining project

### Phase 5: Portfolio Brief

Define:

- Purpose
- Audience
- Positioning
- Content scope
- Design direction
- Technical boundaries
- Success criteria

### Phase 6: UX and Visual Design

Define:

- Page structure
- Navigation
- Section order
- Typography
- Colors
- Mobile behavior
- Desktop behavior
- Calls to action
- Project case-study layout

### Phase 7: Technical Specification

Define:

- Application architecture
- Folder structure
- Content model
- Component boundaries
- SEO
- Accessibility
- Testing
- CI/CD
- Deployment
- Docker upgrade path
- Future backend upgrade path

### Phase 8: Implementation Plan

Break implementation into small tasks:

1. Project initialization
2. Tooling and quality checks
3. Design tokens and base layout
4. Content model
5. Navigation
6. Hero
7. About
8. Experience
9. Skills
10. AI workflow
11. Project listing
12. Case-study pages
13. Contact and CV
14. Responsive behavior
15. Tests
16. CI
17. Deployment
18. Documentation

Each task must have clear acceptance criteria.

### Phase 9: AI-Assisted Implementation

Recommended workflow:

```text
Requirement
    ↓
Approved design
    ↓
Implementation plan
    ↓
Small scoped task
    ↓
AI implementation
    ↓
Human code review
    ↓
Lint, type-check, tests, and build
    ↓
Browser verification
    ↓
Commit
```

### Phase 10: Launch Verification

Before launch, verify:

- All links work
- CV download works
- Mobile layout works
- Desktop layout works
- No confidential content is exposed
- Claims are truthful
- Metadata is correct
- Social preview works
- Lint passes
- Type-check passes
- Tests pass
- Production build passes
- Deployment works
- Basic accessibility checks pass
- Basic performance checks pass

---

## 16. First Release Acceptance Criteria

The first release is complete when:

- The portfolio is publicly accessible.
- The portfolio clearly positions Wicak as a backend-focused full-stack developer.
- The portfolio contains an honest professional summary.
- The portfolio contains work experience.
- The portfolio contains at least two credible project entries.
- The portfolio includes the Jury Process Management Integration case study.
- The portfolio explains AI-assisted engineering responsibly.
- The CV can be downloaded.
- LinkedIn, GitHub, and email links work.
- The website works on mobile and desktop.
- CI checks run automatically.
- Production deployment is automatic after approved changes reach `main`.
- No confidential company information is exposed.
- The repository includes clear setup and architecture documentation.

---

## 17. Deliberately Postponed Features

The following are not required for Version 1:

- Database
- Authentication
- Admin dashboard
- Blog CMS
- Newsletter
- Comments
- Visitor accounts
- Complex animations
- VPS deployment
- Production Docker deployment
- Custom backend
- Elaborate logo
- Theme switcher
- Testimonials
- Large numbers of weak project cards

These features may be added only when they support a real personal-branding need.

---

## 18. Immediate Next Steps

1. Create the private workspace.
2. Add the current CV.
3. Add the latest LinkedIn profile PDF.
4. Export Claude project conversations.
5. Export Codex project conversations.
6. Create initial work-experience notes.
7. Create an initial skills list.
8. Create a list of possible project case studies.
9. Audit the evidence.
10. Create the Portfolio Brief.
11. Select the final projects.
12. Approve the design.
13. Write the technical specification.
14. Write the implementation plan.
15. Create the public portfolio repository.
16. Build and deploy the MVP.

---

## 19. Guiding Principle

> Build the smallest professional portfolio that provides credible evidence, supports job applications, and creates a clean foundation for future personal branding.

The first version does not need to contain every possible feature.

It needs to be live, truthful, understandable, maintainable, and useful.
