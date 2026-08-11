# Randi Fajar Wicaksono Developer Portfolio — Product Model

## Document Information

- **Product Name:** Randi Fajar Wicaksono Developer Portfolio
- **Document Type:** Approved Product Model
- **Version:** 1.0
- **Status:** Approved
- **Product Owner:** Randi Fajar Wicaksono
- **Last Updated:** 2026-08-04

---

## 1. Product Frame

### 1.1 Product Type

A public professional portfolio website.

### 1.2 Primary Purpose

Help Randi Fajar Wicaksono secure a new job by presenting credible evidence of his professional experience, technical skills, project contributions, engineering judgment, and AI-assisted development practices.

### 1.3 Long-Term Purpose

Serve as the foundation of Randi's long-term personal brand and later expand with additional case studies, technical writing, richer project evidence, and more advanced content-management capabilities.

### 1.4 Professional Positioning

**Backend Developer**

Backend development is the primary strength, supported by practical experience in frontend implementation, system integration, debugging, deployment support, and AI-assisted engineering.

### 1.5 Target Roles

1. Backend Developer
2. Backend Engineer
3. Software Engineer

> **Amended in v1.1 (Issue 2).** 1.4 read "Backend-Focused Full-Stack
> Developer" and 1.5 listed Full-Stack Developer second — see SUP-002 and
> SUP-003. Amended here rather than left to the Decision Ledger alone because
> both sections state *current* positioning; uncorrected they would assert
> something no longer true.

### 1.6 Target Audience

#### Primary

- Recruiters
- Hiring Managers
- Engineering Managers
- Technical Interviewers

#### Secondary

- Developers
- Professional contacts
- Potential collaborators

### 1.7 Target Employment Context

- Remote-friendly roles
- Indonesian companies
- International companies

### 1.8 Primary Language

English.

---

## 2. Access Model

### 2.1 Public Visitor Access

All visitors can access published content without authentication.

Visitors may:

- View the homepage
- View work experience
- View technical skills
- Browse projects
- Open project case studies
- Open or download the CV
- Open LinkedIn
- Open GitHub
- Start an email conversation

Visitors may not:

- Create accounts
- Log in
- Edit content
- Submit content
- Access unpublished content
- Access private repositories
- Access raw AI-session exports
- Access confidential company information

### 2.2 Portfolio Owner Access

Randi manages content through a private, source-controlled publishing workflow:

```text
Prepare or update content
→ Review truthfulness and confidentiality
→ Create a feature branch
→ Run local checks
→ Open a pull request
→ Run automated validation
→ Review preview
→ Merge approved changes
→ Deploy automatically
→ Verify production
```

Version 1 has no owner login, CMS, admin dashboard, browser editor, or database-backed content management.

### 2.3 Contact Model

Version 1 uses:

- Public professional email
- LinkedIn link
- GitHub link

Version 1 does not include a contact form.

### 2.4 External Data Model

The portfolio links to external systems but does not synchronize through LinkedIn, GitHub, company, or employment-verification APIs.

---

## 3. Actors

### 3.1 Recruiter

**Purpose:** Determine whether Randi is relevant to an available role.

**Primary interactions:**

- Review professional positioning
- Scan experience and projects
- Review skills
- Download CV
- Open LinkedIn
- Contact by email

**Expected outcome:** Decide whether to progress Randi to the next hiring stage.

### 3.2 Hiring Manager or Engineering Manager

**Purpose:** Evaluate experience, ownership, technical maturity, communication, and growth potential.

**Primary interactions:**

- Review work experience
- Open project case studies
- Evaluate responsibilities, challenges, decisions, and outcomes
- Review project delivery status
- Review AI-assisted engineering practices
- Contact Randi

**Expected outcome:** Understand whether Randi fits the team and role.

### 3.3 Technical Interviewer

**Purpose:** Evaluate engineering reasoning and prepare meaningful interview questions.

**Primary interactions:**

- Review project context and problem
- Review Randi's role
- Review technical approach and trade-offs
- Review testing and verification
- Review AI-assisted engineering
- Open GitHub when public evidence exists

**Expected outcome:** Identify technical discussion topics grounded in real work.

### 3.4 Developer or Professional Contact

**Purpose:** Learn about Randi's work, technical interests, and professional direction.

**Primary interactions:**

- Review profile and projects
- Open GitHub and LinkedIn
- Contact Randi

**Expected outcome:** Continue professional networking or collaboration outside the portfolio.

### 3.5 Portfolio Owner

**Actor:** Randi Fajar Wicaksono

**Purpose:** Maintain, verify, publish, and improve the portfolio.

**Responsibilities:**

- Ensure claims are accurate
- Verify project status
- Protect confidential information
- Review AI-generated content and code
- Maintain working links and CV
- Approve publication
- Verify production deployment

---

## 4. Core Concepts

The approved core concepts are:

1. Professional Profile
2. Work Experience
3. Project Case Study
4. Technical Skill
5. AI-Assisted Engineering Practice
6. Resume
7. Contact Channel
8. External Professional Profile
9. Media Asset
10. Publication Status
11. Project Delivery Status
12. Confidentiality Classification

### 4.1 Publication Status

Approved values:

- Draft
- Published
- Archived

Only Published content appears publicly.

### 4.2 Project Delivery Status

Approved initial values:

- Personal Project
- In Development
- Completed
- Internal Release
- Proof of Concept
- Production
- Archived

Project Delivery Status describes the real project, not whether the case study is visible.

### 4.3 Confidentiality Classification

Approved values:

- Public
- Sanitized
- Private
- Restricted

Only Public or approved Sanitized content may be published.

---

## 5. Information Architecture

### 5.1 Public Routes

```text
/
├── Home
├── /projects
├── /projects/[slug]
├── /resume.pdf
└── Not Found
```

### 5.2 Homepage Sections

1. Navigation
2. Hero
3. About
4. Selected Projects
5. Work Experience
6. Technical Skills
7. AI-Assisted Engineering
8. Contact
9. Footer

### 5.3 Content Depth

| Level | Purpose |
|---|---|
| Hero and project cards | Fast identification |
| Homepage sections | Professional overview |
| Project detail pages | Technical evidence |

### 5.4 Project Launch Rule

Version 1 may launch with two strong published projects.

The third project is not a blocker when it is not selected, not sufficiently verified, or not safe to publish.

---

## 6. Page Inventory

### PAGE-001 — Home

**Route:** `/`

**Purpose:** Present the full professional overview and direct visitors to projects, CV, and contact channels.

### PAGE-002 — Projects Index

**Route:** `/projects`

**Purpose:** Present all published project case studies.

### PAGE-003 — Project Detail

**Route:** `/projects/[slug]`

**Purpose:** Present credible technical and professional evidence for one project.

### PAGE-004 — Resume Asset

**Route:** `/resume.pdf` or an equivalent stable public path.

**Purpose:** Open or download the active public CV.

### PAGE-005 — Not Found

**Route:** Any invalid or unavailable public route.

**Purpose:** Recover the visitor without revealing whether private content exists.

---

## 7. Responsibility Boundary

### 7.1 Portfolio-Owned Responsibilities

The portfolio owns:

- Public professional presentation
- Approved work-experience content
- Selected case studies
- Technical-skill presentation
- AI-assisted engineering explanation
- Resume access
- Public links
- Publication control
- Delivery-status presentation
- Confidentiality-safe content
- Responsive navigation
- Safe empty and error states

### 7.2 External Responsibilities

External systems own:

- LinkedIn profile hosting
- GitHub profile and repository hosting
- Email delivery
- Repository service availability
- CI execution
- Hosting-platform availability
- Domain resolution
- Browser rendering
- Search-engine indexing

### 7.3 Excluded Responsibilities

The portfolio does not:

- Verify employment automatically
- Expose company systems
- Host private repositories
- Store visitor accounts
- Send contact-form submissions
- Synchronize LinkedIn or GitHub data
- Manage company or customer data

---

## 8. Version 1 Scope

Version 1 includes:

- Professional identity
- Professional photograph
- Work experience
- At least two complete projects
- Projects Index
- Project Detail pages
- Technical skills
- AI-assisted engineering section
- CV access
- Email, LinkedIn, and GitHub links
- Responsive behavior
- Accessibility basics
- SEO and social-sharing metadata
- Safe empty and error states
- Automated validation
- Automatic managed deployment
- Production verification

Version 1 excludes:

- Authentication
- Admin dashboard
- CMS
- Database
- Custom backend API
- Contact form
- Newsletter
- Comments
- Visitor accounts
- Project filtering
- Multiple languages
- Blog
- Testimonials
- Live GitHub or LinkedIn synchronization
- Self-managed production infrastructure
- Mandatory Docker production hosting
- Complex animations
- Theme switcher
- Automatic CV generation

---

## 9. Content Readiness Rule

A content item is publishable only when:

1. Required content is complete.
2. Facts are reviewed.
3. Project status is verified.
4. Personal contribution is clear.
5. Confidential information is removed.
6. Links work.
7. Media is safe.
8. Publication Status is Published.
9. Automated checks pass.
10. Production output is verified.

---

## 10. Product Model Approval

All six Product Model rounds were explicitly approved by the Product Owner.

- Round 1: Product Frame and Access Model — Approved
- Round 2: Actors — Approved
- Round 3: Core Concepts — Approved
- Round 4: Experience and Information Architecture — Approved
- Round 5: Page Inventory — Approved
- Round 6: Responsibility Boundary and First Version — Approved

This Product Model is approved for PRD drafting.
