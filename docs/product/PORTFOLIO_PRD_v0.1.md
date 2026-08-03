# Product Requirements Document — Randi Fajar Wicaksono Developer Portfolio

## Document Information

- **Product Name:** Randi Fajar Wicaksono Developer Portfolio
- **Document Type:** Product Requirements Document
- **Version:** 0.1
- **Status:** Draft for Review
- **Target Readiness:** L3 — Buildable
- **Product Owner:** Randi Fajar Wicaksono
- **Last Updated:** 2026-08-04
- **Primary Language:** English

---

# 1. App Reason, Scope, and Responsibility Boundary

## 1.1 App Name

**Randi Fajar Wicaksono Developer Portfolio**

## 1.2 App Purpose

The product is a public professional portfolio that helps Randi Fajar Wicaksono secure new job opportunities while creating the foundation for long-term personal branding.

The portfolio presents Randi as a **Backend-Focused Full-Stack Developer**. It must communicate that backend engineering is his primary strength, supported by practical experience in frontend implementation, application integration, debugging, deployment support, and AI-assisted software development.

## 1.3 Problem Statement

Randi's professional information is distributed across his CV, LinkedIn profile, GitHub profile, private professional repositories, internal project history, and AI-assisted development sessions.

Recruiters and technical hiring teams cannot quickly determine:

- What kind of developer Randi is
- Which roles he is targeting
- What work he personally contributed
- Which projects reached meaningful completion or deployment
- Which technologies he has used professionally
- How he approaches technical decisions, debugging, testing, and verification
- How he uses AI without delegating engineering accountability
- How to contact him or review his formal CV

Most professional source code and project evidence cannot be published directly because it belongs to private company systems. The portfolio must transform verified professional evidence into truthful, useful, confidentiality-safe case studies.

## 1.4 Business Reason

The portfolio exists to improve Randi's ability to:

- Obtain recruiter attention
- Secure interviews
- Demonstrate engineering credibility
- Explain professional contributions that are not visible on GitHub
- Support remote-friendly applications to Indonesian and international companies
- Maintain a reusable professional identity beyond one hiring cycle

The portfolio must be quick and inexpensive to launch. It must favor a strong, credible first release over a larger but unfinished personal-branding platform.

## 1.5 In Scope

Version 1 includes:

### Professional identity

- Full public name
- Professional photograph
- Professional title
- Professional headline
- Short professional summary
- Location
- Remote-friendly availability
- Target-role direction

### Work experience

- Company name
- Position
- Exact employment dates
- Current-employment status
- Responsibility summary
- Selected contributions
- Technologies used
- Publicly safe outcomes

### Projects

- Projects Index
- Dedicated Project Detail pages
- At least two complete published projects
- Personal Developer Portfolio project
- Jury Process Management Integration case study
- Third project when selected and ready
- Accurate project delivery status
- Randi's role and responsibilities
- Problem, approach, challenges, decisions, verification, outcome, and lessons
- AI-assisted workflow where relevant
- Confidentiality note for sanitized professional work

### Technical skills

- Practical skill groups
- Evidence-oriented skill classification
- No percentage-based skill scores

### AI-assisted engineering

- Tools used
- Activities supported
- Human responsibilities
- Review and verification practices
- Safe examples connected to real work

### Public actions

- View portfolio
- Browse projects
- Open project details
- Open or download CV
- Open LinkedIn
- Open GitHub
- Start email contact

### Quality

- Responsive mobile and desktop experience
- Accessible navigation
- Useful alternative text
- Basic SEO metadata
- Social-sharing metadata
- Truthful empty and error states
- Automated pre-publication validation
- Managed automatic deployment
- Production verification

## 1.6 Out of Scope

Version 1 excludes:

- Visitor authentication
- Portfolio-owner login
- Admin dashboard
- CMS
- Database
- Custom backend API
- Contact form
- Newsletter
- Comments
- Visitor accounts
- Project search
- Project filtering
- Multiple languages
- Blog or article publishing
- Testimonials
- Endorsements
- Live GitHub synchronization
- Live LinkedIn synchronization
- Job-application tracking
- Recruiter analytics dashboard
- User-generated content
- Self-managed VPS production hosting
- Mandatory Docker-based production hosting
- Container orchestration
- Complex animation system
- Theme customization
- Dark/light theme switcher
- Automatic CV generation
- Automatic employment verification
- Automatic publication of AI-session content

## 1.7 Responsibility Boundary

### The portfolio owns

- Public presentation of approved professional content
- Public case studies
- Public skill presentation
- AI-assisted engineering explanation
- Resume access
- Public contact and profile links
- Publication Status
- Project Delivery Status
- Confidentiality-safe presentation
- Responsive navigation
- Safe empty and error behavior

### The portfolio does not own

- Employment verification
- Company HR records
- Company source code
- Private repositories
- Production environments
- Company databases
- Customer or student data
- LinkedIn data
- GitHub data
- Email delivery
- Search-engine indexing decisions
- Browser PDF rendering

### Owner responsibility

The Portfolio Owner is responsible for:

- Accuracy of claims
- Correct project status
- Clear separation of personal and team contributions
- Confidentiality review
- AI-generated content and code review
- Publication approval
- Production verification

## 1.8 First Version Expectation

Version 1 is acceptable when:

- It is publicly accessible
- Professional positioning is immediately clear
- Work experience is truthful and understandable
- At least two strong projects are published
- Project status is accurate
- AI-assisted engineering is presented responsibly
- CV access works
- Email, LinkedIn, and GitHub links work
- Mobile and desktop experiences are usable
- Unpublished content is not normally accessible
- No restricted company information is exposed
- Automated validation runs before publication
- Approved changes deploy automatically
- The URL is ready for job applications

---

# 2. Primary Actors

## 2.1 Recruiter

### Purpose

Determine whether Randi is relevant to an available role.

### Main interactions

- Read professional title and summary
- Scan experience
- Scan selected projects
- Review skills
- Open or download CV
- Open LinkedIn
- Contact by email

### Responsibility

Evaluate general role fit, location, experience, and communication readiness.

### Access scope

All Published public content and approved external links.

### Limitations

The Recruiter cannot:

- View Draft or Archived content
- Access private repositories
- Access private project evidence
- Edit content
- Verify claims through company systems

### Expected result

The Recruiter can decide whether to progress Randi to the next hiring stage.

## 2.2 Hiring Manager or Engineering Manager

### Purpose

Evaluate ownership, technical maturity, communication, team fit, and growth potential.

### Main interactions

- Review experience
- Open project case studies
- Review responsibilities and outcomes
- Review technical decisions
- Review project delivery status
- Review AI-assisted engineering practices
- Contact Randi

### Access scope

All Published public content.

### Limitations

The actor cannot access private source code, internal environments, internal tickets, confidential architecture, company databases, or employer verification systems.

### Expected result

The manager understands Randi's contribution, strengths, limitations, and potential fit.

## 2.3 Technical Interviewer

### Purpose

Evaluate technical reasoning and prepare interview questions grounded in real work.

### Main interactions

- Review project problem and context
- Review Randi's exact role
- Review approach, architecture, and trade-offs
- Review testing and verification
- Review AI-assisted engineering
- Open public GitHub evidence when relevant

### Access scope

Published case studies, skills, experience, AI workflow, and public external profiles.

### Limitations

The interviewer cannot inspect private repositories, access production systems, assume omitted work belonged to Randi, or assume AI output was accepted without review.

### Expected result

The interviewer can identify meaningful technical discussion topics.

## 2.4 Developer or Professional Contact

### Purpose

Learn about Randi's work and continue professional networking or collaboration.

### Main interactions

- Review profile
- Browse projects
- Open GitHub
- Open LinkedIn
- Contact Randi

### Access scope

The same Published public content available to other visitors.

### Limitations

No edit, comment, account, or unpublished-content access.

## 2.5 Portfolio Owner

### Actor

Randi Fajar Wicaksono.

### Purpose

Maintain, verify, publish, and improve the portfolio.

### Main interactions

- Edit content
- Add or update projects
- Replace CV
- Add sanitized media
- Review confidentiality
- Validate changes
- Publish approved changes
- Verify production
- Roll back incorrect changes

### Responsibility

The Portfolio Owner is accountable for public accuracy, security, confidentiality, and publication quality.

### Access scope

- Private preparation workspace
- Draft content
- Source repository
- CI configuration
- Deployment configuration
- Hosting settings

### Limitations

Version 1 provides no browser-based admin interface, CMS, or database editor.

---

# 3. Main Data Concepts

## 3.1 Professional Profile

The primary public representation of Randi as a software developer.

**Purpose:** Help visitors understand who Randi is, what role he targets, and what value he offers.

**Relationships:** Work Experience, Project Case Studies, Technical Skills, Resume, Contact Channels, External Professional Profiles, and Media Assets.

**Business rules:**

- Only one active Professional Profile may be Published.
- The profile must not exaggerate seniority.
- The profile must remain materially consistent with the CV and LinkedIn.
- The photograph must be approved.

## 3.2 Work Experience

A verified period of professional employment.

**Purpose:** Show where Randi worked, what he was responsible for, which technologies he used, and what outcomes he contributed to.

**Relationships:** Project Case Studies and Technical Skills.

**Business rules:**

- Dates must be accurate.
- Current employment must be clear.
- Responsibilities must describe actual work.
- Team outcomes must not be presented as solely individual work unless true.
- Confidential details must be removed or sanitized.

## 3.3 Project Case Study

A structured public explanation of selected personal or professional engineering work.

**Purpose:** Provide evidence of responsibility, technical reasoning, challenges, verification, and outcomes.

**Relationships:** Work Experience, Technical Skills, AI-Assisted Engineering Practices, Media Assets, Publication Status, Project Delivery Status, and Confidentiality Classification.

**Business rules:**

- Only selected projects may be Published.
- Personal contribution must be separated from team contribution.
- Unfinished or reassigned work must not be presented as completed.
- Non-production work must not be labeled Production.
- Unknown metrics must not be invented.
- Required case-study content must be complete before publication.
- Professional content must be sanitized.

## 3.4 Technical Skill

A technology, discipline, tool, or practice Randi has used or is learning.

**Approved classification:**

- Strong Working Skill
- Professional Experience
- Currently Learning

**Business rules:**

- No arbitrary percentages.
- Strong classifications require practical evidence.
- One canonical name is used for each skill.
- Classification may change over time.

## 3.5 AI-Assisted Engineering Practice

A description of how Randi uses AI during software development.

**Business rules:**

- AI is not presented as the owner of technical decisions.
- AI-generated code must be reviewed.
- Output must be tested and verified.
- Private company context must not be published.
- Examples should show both acceleration and human correction.

## 3.6 Resume

The active public CV file.

**Business rules:**

- Only one Resume is promoted as active.
- The file must be a valid PDF.
- Portfolio and Resume must not materially contradict each other.
- Missing Resume must produce a truthful failure state.

## 3.7 Contact Channel

A public method through which a visitor can contact Randi.

**Version 1 channel:** Professional email.

**Business rules:**

- The email must be intentionally public.
- Version 1 uses a direct email link.
- No contact form exists.
- The site must not claim email delivery.

## 3.8 External Professional Profile

A public profile hosted on another platform.

**Version 1 profiles:** LinkedIn and GitHub.

**Business rules:**

- Links must be valid.
- No live API synchronization is required.
- Links must not point to private repositories.

## 3.9 Media Asset

A visual or downloadable file used by portfolio content.

**Possible types:**

- Professional photograph
- Project screenshot
- Architecture diagram
- Workflow diagram
- Social-sharing image
- Resume PDF
- Favicon

**Business rules:**

- Professional project media must be reviewed.
- Media must not expose secrets, private data, internal URLs, or confidential source code.
- Important images require useful alternative text.
- Missing optional media must not destroy content meaning.

## 3.10 Publication Status

Values:

- Draft
- Published
- Archived

Only Published content appears publicly.

## 3.11 Project Delivery Status

Values:

- Personal Project
- In Development
- Completed
- Internal Release
- Proof of Concept
- Production
- Archived

Status must reflect known truth. Production requires actual production deployment.

## 3.12 Confidentiality Classification

Values:

- Public
- Sanitized
- Private
- Restricted

Only Public or approved Sanitized content may be Published. Raw Claude and Codex exports remain Private.


---

# 4. Top-Level App Flow

## 4.1 Entry Points

Visitors may enter through:

- Homepage URL
- Projects Index URL
- Direct Project Detail URL
- Resume URL
- Search-engine result
- LinkedIn
- GitHub
- Shared social link
- Public CV link

Every Project Detail page must remain understandable when opened directly.

## 4.2 Recruiter Journey

```text
Open Home
→ Read professional title and summary
→ Scan experience and selected projects
→ Review skills
→ Open or download CV
→ Open LinkedIn or start email contact
```

**Success result:** The Recruiter understands general fit and has a clear next action.

## 4.3 Hiring Manager Journey

```text
Open Home
→ Review professional positioning
→ Review work experience
→ Open selected project
→ Review responsibilities, decisions, and outcome
→ Review AI-assisted engineering
→ Open CV or contact Randi
```

**Success result:** The manager understands ownership, technical contribution, and growth potential.

## 4.4 Technical Interviewer Journey

```text
Open Project Detail directly
→ Review project context and problem
→ Review role and responsibilities
→ Review technical approach and trade-offs
→ Review testing and AI verification
→ Open another project or GitHub
```

**Success result:** The interviewer can prepare technical questions based on real evidence.

## 4.5 Professional Contact Journey

```text
Open Home
→ Review profile and projects
→ Open GitHub or LinkedIn
→ Contact Randi
```

## 4.6 Portfolio Owner Publishing Journey

```text
Prepare or update content
→ Review accuracy and confidentiality
→ Create feature branch
→ Run local validation
→ Open pull request
→ Run automated validation
→ Review preview
→ Merge approved changes
→ Deploy automatically
→ Verify production
```

### Failure branches

- Validation failure blocks publication.
- Preview inconsistency requires correction before merge.
- Deployment failure means content is not considered successfully published.
- Production mismatch requires correction or rollback.
- Restricted content detection blocks publication.

## 4.7 Navigation Flow

```text
Home
├── Projects Index
│   └── Project Detail
│       ├── Previous Project
│       ├── Next Project
│       ├── Resume
│       └── Contact
├── Experience anchor
├── Skills anchor
├── AI Workflow anchor
├── Contact anchor
└── Resume

Invalid route
└── Not Found
    ├── Home
    └── Projects Index
```

## 4.8 Mobile Flow Requirement

Mobile users must retain access to:

- Professional positioning
- Primary actions
- Project status and role
- Full case-study content
- Resume
- Email, LinkedIn, and GitHub
- Main navigation

Essential content must never be desktop-only.

---

# 5. Pages, Fields, Actions, and Validation

## 5.1 PAGE-001 — Home

### Purpose

Present the full professional overview and direct visitors to deeper evidence and contact actions.

### Page Location

`/`

### Main Content

1. Navigation
2. Hero
3. About
4. Selected Projects
5. Work Experience
6. Technical Skills
7. AI-Assisted Engineering
8. Contact
9. Footer

### Fields

#### Hero

- Full name
- Professional title
- Headline
- Location
- Remote-work availability
- Professional photograph
- Primary action
- Secondary action
- Optional external-profile links

#### About

- Professional summary
- Primary strengths
- Current professional direction

#### Selected Projects

For each card:

- Title
- Summary
- Project type
- Role
- Project Delivery Status
- Key technologies
- Optional visual
- Case-study link

#### Work Experience

For each entry:

- Company
- Position
- Start date
- End date or current indicator
- Work arrangement or location
- Summary
- Responsibilities
- Selected contributions
- Technologies

#### Technical Skills

- Skill group
- Skill name
- Skill classification

#### AI-Assisted Engineering

- Tool
- Supported activity
- Human responsibility
- Verification method
- Optional project reference

#### Contact

- Email
- LinkedIn
- GitHub
- Location
- Remote-work availability
- Resume action

### Actions

- Open Projects Index
- Open Project Detail
- Navigate to homepage section
- Open or download Resume
- Open LinkedIn
- Open GitHub
- Start email contact
- Return to top

### Validation

- Required Professional Profile fields must exist.
- Only Published project cards appear.
- Only Published Work Experience appears.
- Skill groups with no approved items are hidden.
- Invalid external links are not rendered as active.
- Missing photograph uses a safe fallback.
- Missing optional project media does not break the card.
- Resume action is shown only when an active Resume exists.

### Empty State

- Two featured projects are acceptable.
- No fake third card is displayed.
- Missing optional visual content uses text-only presentation.
- Empty optional sections are omitted.

### Error State

- Internal route failures lead to Not Found.
- External-link failure must not be represented as portfolio success.
- Missing Resume produces a truthful unavailable state.
- Optional-content failure must not break the entire page.

### Basic Display Rules

- Primary positioning is visible without scrolling on common viewport sizes.
- Primary actions are keyboard accessible.
- Text remains readable on mobile and desktop.
- Status labels use plain language.
- No percentage skill bars.

## 5.2 PAGE-002 — Projects Index

### Purpose

Allow visitors to browse all Published project case studies.

### Page Location

`/projects`

### Main Content

- Page title
- Short introduction
- Sanitization note
- Published project cards

### Project-Card Fields

- Title
- Summary
- Project type
- Role
- Project Delivery Status
- Technologies
- Optional visual
- Case-study action

### Actions

- Open Project Detail
- Return Home
- Open Resume
- Navigate to Contact

### Validation

- Only Published projects appear.
- Each card must have a valid slug.
- Required fields must be complete.
- Invalid Project Delivery Status blocks publication.
- Restricted media cannot be rendered.

### Ordering

1. Featured priority
2. Most relevant or recent
3. Remaining Published projects

### Empty State

If no projects are Published:

- Explain that case studies are being prepared.
- Provide Home, Resume, and Contact actions.

The product is not launch-ready without at least two Published projects.

### Error State

Invalid project content must be excluded rather than shown partially.

## 5.3 PAGE-003 — Project Detail

### Purpose

Present credible technical and professional evidence for one project.

### Page Location

`/projects/[slug]`

### Required Content

#### Header

- Project title
- Summary
- Project type
- Randi's role
- Project Delivery Status
- Relevant date or period
- Optional visual

#### Context

- System or feature description
- Intended users
- Broader business context

#### Problem

- Specific problem
- Why it mattered

#### Personal Responsibility

- Randi's responsibilities
- Team responsibilities
- External-system responsibilities

#### Technical Approach

- High-level solution
- Main components or boundaries
- Public-safe data flow or workflow

#### Challenges

- Meaningful technical or delivery problems

#### Decisions and Trade-offs

- Alternatives
- Chosen approach
- Reasons
- Limitations
- Compromises

#### Implementation Summary

- What was implemented
- What was not implemented by Randi

#### Testing and Verification

- Automated tests when relevant
- Manual verification
- Regression checks
- QA involvement
- Deployment verification

#### Outcome

- Verified result
- Delivery status
- Observable impact
- No invented metrics

#### AI-Assisted Engineering

- Tool
- Activity
- Human decision
- Review
- Validation

#### Lessons Learned

- Technical learning
- Process learning
- Limitations
- Future improvement

#### Technology Stack

- Approved technologies

#### Confidentiality Note

- Sanitization explanation where relevant

#### Related Navigation

- Back to Projects
- Previous project
- Next project
- Resume
- Contact

### Actions

- Return to Projects
- Open another project
- Open public repository when available
- Open Resume
- Contact Randi

### Validation

- Slug must uniquely identify one Published project.
- Draft and Archived projects are not publicly rendered.
- Required sections must be complete.
- Personal contribution must be explicit.
- Production status requires verified production deployment.
- Restricted content blocks publication.
- Optional metrics may be omitted.
- Invalid status never defaults to Production.

### Empty State

- Optional diagrams may be omitted.
- Optional metrics may be omitted.
- Required sections may not be empty in Published content.

### Error State

- Unknown slug leads to Not Found.
- Draft or Archived slug produces the same public result as an unknown slug.
- Restricted media is never rendered.
- Missing required content prevents publication.

### Basic Display Rules

- The page is understandable when opened directly.
- Name or portfolio identity is visible in navigation.
- Long content remains readable.
- Diagrams include text explanation.
- Status and role are visible near the top.

## 5.4 PAGE-004 — Resume Asset

### Purpose

Provide the active public CV.

### Page Location

`/resume.pdf` or equivalent stable public path.

### Fields

- File name
- Format
- Version
- Publication date
- Active status
- Public path

### Actions

- Open Resume
- Download Resume through browser controls
- Return using browser navigation

### Validation

- Active Resume must exist.
- File must be PDF.
- Only one Resume is active.
- Public URL must not expose private storage data.
- Resume must be materially consistent with portfolio content.

### Empty or Error State

When unavailable:

- Do not claim success.
- Explain that the Resume is unavailable.
- Provide Home, LinkedIn, and email alternatives.

## 5.5 PAGE-005 — Not Found

### Purpose

Recover visitors from invalid, removed, unpublished, or mistyped routes.

### Entry Conditions

- Unknown URL
- Unknown project slug
- Draft project slug
- Archived project slug
- Removed page

### Main Content

- Page-not-found message
- Short explanation
- Home action
- Projects action

### Optional Content

- Resume action
- Contact link

### Validation and Security

- The page must not reveal whether a private or draft project exists.
- Unknown, Draft, and Archived project routes use the same public-facing result.


---

# 6. Detailed Functional Flows

## 6.1 Flow — View Portfolio Homepage

### Purpose

Allow a visitor to understand Randi's professional profile.

### Actor

Any public visitor.

### Start Point

Portfolio root URL or an external link.

### Preconditions

- A Published Professional Profile exists.
- The public application is available.

### Trigger Action

The visitor opens the homepage.

### Steps

1. Load the Published Professional Profile.
2. Load Published featured projects.
3. Load Published Work Experience.
4. Load approved Technical Skills.
5. Load Published AI-Assisted Engineering content.
6. Load active Resume state.
7. Render public contact and external-profile links.
8. Present responsive navigation and sections.

### Validation Points

- Profile fields are complete.
- Only Published content is rendered.
- Restricted media is excluded.
- External links are valid.
- Resume availability is truthful.

### Data Changes

None.

### Success Result

The visitor sees a complete professional overview.

### Failure Cases

- Required profile missing
- Invalid content status
- Missing optional media
- Resume unavailable
- External link unavailable

### Related Pages

Home, Projects Index, Project Detail, Resume, Not Found.

### Related Data Concepts

Professional Profile, Work Experience, Project Case Study, Technical Skill, Resume, Contact Channel, External Professional Profile, Media Asset.

### Audit Impact

No visitor audit record is required in Version 1.

## 6.2 Flow — Browse Projects

### Purpose

Allow a visitor to discover Published case studies.

### Actor

Any public visitor.

### Start Point

Home or direct Projects Index URL.

### Preconditions

The application is available.

### Trigger Action

The visitor opens the Projects Index.

### Steps

1. Load Published projects.
2. Validate required card fields.
3. Exclude invalid or Restricted items.
4. Order projects by approved ordering rules.
5. Render project cards.
6. Allow the visitor to open a case study.

### Validation Points

- Publication Status is Published.
- Slug is unique.
- Project Delivery Status is valid.
- Required summary fields exist.

### Data Changes

None.

### Success Result

The visitor can browse valid public case studies.

### Failure Cases

- No Published projects
- Invalid project record
- Missing optional media

### Related Pages

Home, Projects Index, Project Detail.

### Related Data Concepts

Project Case Study, Project Delivery Status, Publication Status, Media Asset.

### Audit Impact

None.

## 6.3 Flow — Open Project Case Study

### Purpose

Allow a visitor to review detailed evidence for one project.

### Actor

Any public visitor.

### Start Point

Project card, direct URL, search result, or adjacent-project navigation.

### Preconditions

- Requested project exists.
- Publication Status is Published.
- Required content is complete.
- Confidentiality Classification is Public or approved Sanitized.

### Trigger Action

The visitor opens a Project Detail URL.

### Steps

1. Resolve the slug.
2. Confirm Publication Status.
3. Confirm confidentiality eligibility.
4. Validate required content.
5. Render project header.
6. Render context, problem, responsibility, approach, challenges, decisions, implementation, verification, outcome, AI usage, lessons, stack, and confidentiality note.
7. Render related navigation.

### Validation Points

- Slug uniqueness
- Publication Status
- Delivery Status
- Required sections
- Confidentiality
- Personal-contribution clarity
- Media safety

### Data Changes

None.

### Success Result

The visitor receives a truthful and complete project case study.

### Failure Cases

- Unknown slug
- Draft project
- Archived project
- Restricted project
- Missing required content
- Invalid Delivery Status

### Failure Behavior

Render Not Found without revealing whether private content exists.

### Related Pages

Projects Index, Project Detail, Resume, Home, Not Found.

### Related Data Concepts

Project Case Study, Work Experience, Technical Skill, AI-Assisted Engineering Practice, Media Asset, Publication Status, Project Delivery Status, Confidentiality Classification.

### Audit Impact

None.

## 6.4 Flow — Open or Download Resume

### Purpose

Allow a visitor to access the active CV.

### Actor

Any public visitor.

### Start Point

Navigation, Hero, Contact, Projects Index, Project Detail, or direct URL.

### Preconditions

An active Published Resume exists.

### Trigger Action

The visitor selects the Resume action.

### Steps

1. Resolve the active Resume.
2. Confirm the file exists.
3. Confirm PDF format.
4. Open the public asset.
5. Allow browser-native download.

### Validation Points

- One active Resume
- Valid PDF
- Public-safe path
- Content consistency

### Data Changes

None.

### Success Result

The browser opens or downloads the CV.

### Failure Cases

- Missing file
- Invalid format
- Multiple active Resume records
- Broken public path

### Failure Behavior

Do not claim success. Present a truthful unavailable state and alternative contact paths.

### Related Pages

Home, Projects Index, Project Detail.

### Related Data Concepts

Resume, Professional Profile, Contact Channel.

### Audit Impact

None.

## 6.5 Flow — Open External Professional Profile

### Purpose

Allow visitors to continue to LinkedIn or GitHub.

### Actor

Any public visitor.

### Start Point

Hero, Contact, Footer, or relevant project.

### Preconditions

The external URL is approved and valid.

### Trigger Action

The visitor selects LinkedIn or GitHub.

### Steps

1. Read the approved URL.
2. Open the external destination.
3. Leave control to the external platform.

### Validation Points

- Correct URL scheme
- Approved public destination
- No private repository target

### Data Changes

None.

### Success Result

The external platform is opened.

### Failure Cases

- Invalid URL
- External outage
- Visitor network issue

### Failure Behavior

The portfolio does not claim external-platform success.

### Related Data Concepts

External Professional Profile.

### Audit Impact

None.

## 6.6 Flow — Start Email Contact

### Purpose

Allow a visitor to initiate an email.

### Actor

Any public visitor.

### Start Point

Hero, Contact, Footer, or Project Detail.

### Preconditions

The public email exists.

### Trigger Action

The visitor selects the email link.

### Steps

1. Read the approved public email.
2. Open the visitor's configured email client through a direct mail link.

### Validation Points

- Email format
- Approved public address

### Data Changes

None.

### Success Result

The visitor's environment attempts to open an email client.

### Failure Cases

- No configured email client
- Invalid email address

### Failure Behavior

The website must not claim the email was sent.

### Related Data Concepts

Contact Channel.

### Audit Impact

None.

## 6.7 Flow — Publish Portfolio Update

### Purpose

Allow the Portfolio Owner to publish approved changes safely.

### Actor

Portfolio Owner.

### Start Point

Private workspace and source repository.

### Preconditions

- Owner has repository access.
- Content or code changes exist.
- Required evidence is available.

### Trigger Action

The owner prepares a portfolio update.

### Steps

1. Create or update content.
2. Review factual accuracy.
3. Review personal versus team contribution.
4. Review Project Delivery Status.
5. Apply Confidentiality Classification.
6. Remove Restricted information.
7. Set content to Draft while incomplete.
8. Run local validation.
9. Create a feature branch.
10. Open a pull request.
11. Run automated validation.
12. Review preview output.
13. Set eligible content to Published.
14. Merge approved changes.
15. Trigger managed deployment.
16. Verify the production result.
17. Correct or roll back if production is incorrect.

### Validation Points

- Required content complete
- Facts reviewed
- Project status verified
- Confidentiality eligible
- Links valid
- Media safe
- Automated checks pass
- Preview correct
- Production correct

### Data Changes

- Content files
- Publication Status
- Active Resume
- Media assets
- Source history

### Success Result

The approved change is publicly available and verified.

### Failure Cases

- Validation failure
- Confidentiality issue
- Broken preview
- Deployment failure
- Production mismatch
- Incorrect claim discovered

### Failure Behavior

Publication is blocked, corrected, or rolled back.

### Related Pages

All public pages.

### Related Data Concepts

All core concepts.

### Audit Impact

Source-control and deployment history provide the Version 1 audit trail.

## 6.8 Flow — Handle Invalid or Unavailable Route

### Purpose

Recover visitors without leaking private content.

### Actor

Any public visitor.

### Start Point

Invalid URL or unavailable project URL.

### Preconditions

The requested public route cannot be resolved.

### Trigger Action

The visitor opens the route.

### Steps

1. Attempt route resolution.
2. Determine that the route cannot be shown publicly.
3. Render the Not Found page.
4. Provide Home and Projects actions.

### Validation Points

- No private existence information is exposed.
- Draft, Archived, Restricted, and unknown project routes produce the same public-facing result.

### Data Changes

None.

### Success Result

The visitor can recover safely.

### Related Page

Not Found.

### Audit Impact

None.

---

# 7. Schema / Data Structure

The following structures are product-level data contracts. They do not require a database in Version 1.

## 7.1 ProfessionalProfile

### Purpose

Represent the active public professional identity.

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | Identifier | Yes | Stable internal identifier |
| fullName | Text | Yes | Full public name |
| displayName | Text | Yes | Public display name |
| professionalTitle | Text | Yes | Primary public title |
| headline | Text | Yes | Short professional headline |
| summary | Rich text | Yes | Professional summary |
| location | Text | Yes | Public city and country |
| remoteAvailability | Text or enum | Yes | Remote-work availability |
| targetRoles | List of text | Yes | Ordered role targets |
| photoAssetId | Identifier | No | Approved professional photograph |
| publicationStatus | PublicationStatus | Yes | Visibility control |
| updatedAt | Date-time | Yes | Last approved update |

### Uniqueness Rules

Only one ProfessionalProfile may be active and Published.

### Archive Behavior

Previous versions remain in source history.

### Security Notes

No private address, identity number, or private phone number is required.

## 7.2 WorkExperience

### Purpose

Represent one verified employment period.

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | Identifier | Yes | Stable identifier |
| companyName | Text | Yes | Approved public company name |
| position | Text | Yes | Role title |
| startDate | Date | Yes | Employment start |
| endDate | Date | No | Employment end |
| isCurrent | Boolean | Yes | Current-employment indicator |
| locationOrArrangement | Text | No | Location, remote, or hybrid context |
| summary | Rich text | Yes | Role overview |
| responsibilities | List of text | Yes | Actual responsibilities |
| contributions | List of text | No | Selected approved contributions |
| technologyIds | List of Identifier | No | Related skills |
| projectIds | List of Identifier | No | Related case studies |
| confidentialityClass | ConfidentialityClassification | Yes | Publication-safety classification |
| publicationStatus | PublicationStatus | Yes | Visibility control |
| sortOrder | Number | Yes | Public ordering |

### Validation Rules

- `endDate` is required when `isCurrent` is false.
- `endDate` must not precede `startDate`.
- Current employment has no past end date.
- Restricted entries cannot be Published.

### Archive Behavior

Archived entries remain in source history but are not publicly listed.

## 7.3 ProjectCaseStudy

### Purpose

Represent one public project case study.

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | Identifier | Yes | Stable identifier |
| slug | Slug | Yes | Unique public URL segment |
| title | Text | Yes | Public project title |
| summary | Text | Yes | Short card and header summary |
| projectType | Enum or text | Yes | Personal or professional category |
| role | Text | Yes | Randi's role |
| deliveryStatus | ProjectDeliveryStatus | Yes | Actual project condition |
| period | Text or date range | No | Relevant public project period |
| context | Rich text | Yes | System and user context |
| problem | Rich text | Yes | Problem being solved |
| personalResponsibilities | List of text | Yes | Randi's responsibilities |
| teamResponsibilities | List of text | No | Team or external responsibilities |
| technicalApproach | Rich text | Yes | High-level solution |
| workflowOrArchitecture | Rich text | No | Public-safe workflow explanation |
| challenges | List of structured text | Yes | Meaningful challenges |
| decisionsAndTradeoffs | List of structured text | Yes | Decisions and rationale |
| implementationSummary | Rich text | Yes | What was implemented |
| testingAndVerification | Rich text | Yes | Verification approach |
| outcome | Rich text | Yes | Verified result |
| aiUsage | Rich text | No | AI-assisted engineering details |
| lessonsLearned | Rich text | Yes | Technical and process learning |
| technologyIds | List of Identifier | Yes | Related skills |
| mediaAssetIds | List of Identifier | No | Safe related media |
| repositoryUrl | URL | No | Public repository when relevant |
| confidentialityNote | Text | No | Public sanitization note |
| confidentialityClass | ConfidentialityClassification | Yes | Publication-safety classification |
| featured | Boolean | Yes | Homepage visibility preference |
| featuredPriority | Number | No | Featured ordering |
| publicationStatus | PublicationStatus | Yes | Visibility control |
| updatedAt | Date-time | Yes | Last approved update |

### Uniqueness Rules

- `slug` must be unique.
- `id` must be unique.

### Publication Validation

A ProjectCaseStudy may be Published only when:

- Required fields are complete.
- Delivery Status is valid and verified.
- Personal responsibilities are explicit.
- Confidentiality is Public or approved Sanitized.
- All referenced media is publishable.
- No Restricted information exists.
- Outcome does not contain invented metrics.

### Archive Behavior

Archived projects do not appear publicly and resolve to Not Found.

## 7.4 TechnicalSkill

### Purpose

Represent one technical capability.

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | Identifier | Yes | Stable identifier |
| name | Text | Yes | Canonical skill name |
| group | SkillGroup | Yes | Practical grouping |
| classification | SkillClassification | Yes | Evidence-oriented confidence |
| description | Text | No | Public context |
| relatedProjectIds | List of Identifier | No | Evidence links |
| relatedExperienceIds | List of Identifier | No | Experience links |
| publicationStatus | PublicationStatus | Yes | Visibility control |
| sortOrder | Number | Yes | Public ordering |

### SkillClassification

- Strong Working Skill
- Professional Experience
- Currently Learning

### Suggested SkillGroup

- Languages
- Backend
- Frontend
- Databases
- APIs and Integration
- Infrastructure and Deployment
- Testing and Quality
- Developer Tools
- AI-Assisted Engineering

### Uniqueness Rules

One canonical record per public skill name.

### Business Rule

No percentage score is stored or displayed.

## 7.5 AIAssistedEngineeringPractice

### Purpose

Represent one approved AI-assisted engineering practice.

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | Identifier | Yes | Stable identifier |
| toolName | Text | Yes | Codex, Claude Code, ChatGPT, or another approved tool |
| activity | Text | Yes | Engineering activity |
| purpose | Text | Yes | Why AI was used |
| humanResponsibility | Rich text | Yes | What Randi retained |
| verificationMethod | Rich text | Yes | How output was reviewed |
| exampleOutcome | Rich text | No | Safe example |
| correctedAssumption | Rich text | No | Example of human correction |
| relatedProjectIds | List of Identifier | No | Related case studies |
| confidentialityClass | ConfidentialityClassification | Yes | Safety classification |
| publicationStatus | PublicationStatus | Yes | Visibility control |

### Business Rule

Restricted or raw private session content cannot be Published.

## 7.6 Resume

### Purpose

Represent the active public CV.

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | Identifier | Yes | Stable identifier |
| fileName | Text | Yes | Public file name |
| fileFormat | Enum | Yes | PDF |
| version | Text | Yes | Human-readable version |
| publicationDate | Date | Yes | Public version date |
| publicPath | Path or URL | Yes | Stable public location |
| isActive | Boolean | Yes | Active Resume indicator |
| confidentialityClass | ConfidentialityClassification | Yes | Must be Public |
| publicationStatus | PublicationStatus | Yes | Visibility control |

### Uniqueness Rules

Only one Resume may be active and Published.

### Deletion and Archive Behavior

Old versions may be removed from public paths or retained privately in source history.

## 7.7 ContactChannel

### Purpose

Represent a public contact method.

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | Identifier | Yes | Stable identifier |
| type | ContactType | Yes | Email |
| label | Text | Yes | Public action label |
| value | Text | Yes | Public email |
| publicLink | URL | Yes | Direct mail link |
| publicationStatus | PublicationStatus | Yes | Visibility control |

### ContactType

- Email

### Business Rule

The portfolio does not store contact submissions.

## 7.8 ExternalProfessionalProfile

### Purpose

Represent an approved public external profile.

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | Identifier | Yes | Stable identifier |
| platform | ExternalPlatform | Yes | LinkedIn or GitHub |
| label | Text | Yes | Public link label |
| url | URL | Yes | Approved public URL |
| publicationStatus | PublicationStatus | Yes | Visibility control |

### ExternalPlatform

- LinkedIn
- GitHub

### Uniqueness Rules

One active Published profile per platform.

## 7.9 MediaAsset

### Purpose

Represent an approved public visual or downloadable asset.

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | Identifier | Yes | Stable identifier |
| type | MediaType | Yes | Asset category |
| filePath | Path | Yes | Public-safe path |
| altText | Text | Conditional | Required for meaningful images |
| caption | Text | No | Public caption |
| ownerType | Text | Yes | Profile, Project, Resume, or Metadata |
| ownerId | Identifier | Yes | Owning record |
| confidentialityClass | ConfidentialityClassification | Yes | Safety classification |
| publicationStatus | PublicationStatus | Yes | Visibility control |

### Suggested MediaType Values

- Professional Photograph
- Project Screenshot
- Architecture Diagram
- Workflow Diagram
- Social Sharing Image
- Resume PDF
- Favicon

### Business Rule

Restricted assets cannot be Published.

## 7.10 Enum Definitions

### PublicationStatus

- Draft
- Published
- Archived

### ProjectDeliveryStatus

- Personal Project
- In Development
- Completed
- Internal Release
- Proof of Concept
- Production
- Archived

### ConfidentialityClassification

- Public
- Sanitized
- Private
- Restricted

### Public Publication Rule

A content item is publicly eligible only when:

- `publicationStatus = Published`
- `confidentialityClass` is Public or approved Sanitized
- all required validations pass

## 7.11 Data Relationship Summary

```text
ProfessionalProfile
├── WorkExperience[]
│   └── ProjectCaseStudy[]
│       ├── TechnicalSkill[]
│       ├── AIAssistedEngineeringPractice[]
│       ├── MediaAsset[]
│       ├── ProjectDeliveryStatus
│       ├── PublicationStatus
│       └── ConfidentialityClassification
├── TechnicalSkill[]
├── Resume
├── ContactChannel[]
├── ExternalProfessionalProfile[]
└── MediaAsset[]
```

---

## PRD Readiness Review

### Placeholder Scan

Open content decisions remain for:

- Final professional headline
- Final professional summary
- Final third project
- Final skills list
- Final photograph
- Final safe project visuals
- Custom domain

These are content inputs, not unresolved product behavior. The product can be built with validated Draft placeholder content while unpublished content remains non-public.

### Internal Consistency

- Public routes match the approved Page Inventory.
- Actors match the approved Product Model.
- Core concepts support all pages and flows.
- Publication, delivery, and confidentiality states remain separate.
- Version 1 scope and non-goals are consistent.

### Scope Check

The PRD is focused on one public portfolio MVP and is suitable for one downstream technical-design and implementation-plan cycle.

### Ambiguity Check

No material product behavior requires Builder inference. Content values still to be authored are explicitly separated from product requirements.

---

## Approval Status

This PRD is ready for Product Owner review.

After approval, the next artifacts are:

1. Functional Acceptance Criteria
2. Non-Functional Acceptance Criteria
3. UX/UI specification
4. Technical design
5. Implementation plan
6. Claude Builder Prompt
