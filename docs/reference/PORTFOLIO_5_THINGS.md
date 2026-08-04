# Developer Portfolio — 5 Things Document

## Document Information

- **Product Name:** Randi Fajar Wicaksono Developer Portfolio
- **Document Type:** 5 Things Document
- **Version:** 0.1
- **Status:** Draft for Product Model Confirmation
- **Owner:** Randi Fajar Wicaksono
- **Last Updated:** 2026-08-03

---

## 1. Purpose

The Developer Portfolio is a public professional website designed to help Randi Fajar Wicaksono secure a new job while establishing a long-term personal brand.

The portfolio will position Randi as a **Backend-Focused Full-Stack Developer**, with backend development as his primary strength and practical experience across frontend implementation, integration, debugging, deployment support, and AI-assisted software development.

The portfolio must help recruiters, hiring managers, engineering managers, and technical interviewers quickly understand:

- Randi's professional positioning
- His backend and full-stack capabilities
- His work experience
- His selected project contributions
- His technical decision-making and problem-solving process
- His use of AI as an engineering tool
- His availability for remote-friendly opportunities
- How to contact him or review his professional profiles

### Primary Business Goal

Help Randi obtain interviews and job opportunities for:

1. Backend Developer roles
2. Full-Stack Developer roles
3. Software Engineer roles

### Long-Term Goal

Develop the portfolio into a maintained personal-branding platform that can later include technical writing, additional case studies, richer project evidence, and more advanced content-management capabilities.

---

## 2. User Types

### 2.1 Recruiter

**Purpose**

Quickly determine whether Randi is relevant to an available role.

**Primary Needs**

- Understand his professional title and focus
- Review his main skills
- Review recent work experience
- Download his CV
- Open his LinkedIn profile
- Contact him through email

**Limitations**

- Cannot edit portfolio content
- Cannot access private or unpublished project information
- Cannot access confidential company material

---

### 2.2 Hiring Manager or Engineering Manager

**Purpose**

Evaluate Randi's professional experience, ownership, engineering maturity, and potential fit for a development team.

**Primary Needs**

- Understand his responsibilities
- Review selected project case studies
- Evaluate the complexity of his contributions
- Understand how he approaches implementation and debugging
- Review project completion and deployment status
- Review his technical stack
- Understand his career direction

**Limitations**

- Cannot access private repositories
- Cannot access proprietary architecture or confidential data
- Cannot assume that unpublished or unfinished work was completed

---

### 2.3 Technical Interviewer

**Purpose**

Evaluate Randi's technical thinking and prepare relevant interview questions.

**Primary Needs**

- Review project problems and constraints
- Understand Randi's exact role
- Review technical decisions and trade-offs
- Review implementation challenges
- Understand testing and verification practices
- Understand how AI-assisted work was reviewed
- Review technologies used in real professional contexts

**Limitations**

- Cannot inspect confidential company source code
- Cannot access private production environments
- Cannot access client, student, or company-sensitive data

---

### 2.4 Developer or Professional Contact

**Purpose**

Learn about Randi's experience, interests, and engineering work.

**Primary Needs**

- Review his public profile
- Review selected projects
- Open GitHub
- Open LinkedIn
- Contact him for professional discussion or collaboration

**Limitations**

- Has the same public access as other visitors
- Cannot access unpublished material

---

### 2.5 Portfolio Owner

**Actor:** Randi Fajar Wicaksono

**Purpose**

Maintain, verify, publish, and improve the portfolio.

**Primary Needs**

- Update professional information
- Add or revise project case studies
- Replace CV files
- Review confidential information before publication
- Validate content through automated checks
- Publish approved updates
- Roll back incorrect changes

**Primary Workflow**

```text
Edit local source-controlled content
→ Create a feature branch
→ Review the changes
→ Open a pull request
→ Run automated CI validation
→ Merge approved changes into production
→ Trigger automatic production deployment
```

**Responsibilities**

- Ensure all published claims are truthful
- Verify project status and personal contribution
- Protect confidential company information
- Review AI-generated content and code
- Maintain working contact, resume, LinkedIn, and GitHub links

---

## 3. Top Actions Per User Type

### 3.1 Recruiter Actions

1. Open the portfolio homepage
2. Understand Randi's professional positioning
3. Scan selected projects and work experience
4. Review technical skills
5. Download the CV
6. Open LinkedIn
7. Contact Randi by email

### 3.2 Hiring Manager or Engineering Manager Actions

1. Review the professional summary
2. Review work experience
3. Open selected project case studies
4. Review responsibilities, challenges, decisions, and outcomes
5. Review project deployment status
6. Review AI-assisted engineering practices
7. Download the CV or contact Randi

### 3.3 Technical Interviewer Actions

1. Open a project case study
2. Understand the business or user problem
3. Identify Randi's exact contribution
4. Review the technical approach
5. Review challenges and trade-offs
6. Review testing and verification
7. Review responsible AI usage
8. Use the evidence to prepare interview questions

### 3.4 Developer or Professional Contact Actions

1. Review Randi's profile
2. Review public project summaries
3. Open GitHub
4. Open LinkedIn
5. Contact Randi

### 3.5 Portfolio Owner Actions

1. Edit local portfolio content
2. Add or update a project
3. Update the CV
4. Verify claims and confidentiality
5. Run or review automated validation
6. Publish approved changes
7. Confirm the production deployment
8. Roll back incorrect changes when necessary

---

## 4. Data Consumed by the Portfolio

The portfolio consumes the following information and assets.

### 4.1 Professional Identity Data

- Full public name
- Display name
- Professional title
- Professional headline
- Professional summary
- Location
- Remote-work preference
- Career direction

### 4.2 Public Contact Data

- Professional email
- LinkedIn URL
- GitHub URL
- Public resume file

### 4.3 Work Experience Data

- Company name
- Position
- Employment start date
- Employment end date or current status
- Responsibilities
- Technologies used
- Selected contributions
- Deployment or operational involvement
- Observable outcomes

### 4.4 Project Case Study Data

- Project title
- Project summary
- Project type
- Project status
- Deployment status
- Randi's role
- Business or user problem
- Responsibilities
- Technical challenges
- Technical approach
- Important decisions
- Implementation summary
- Testing and verification
- Outcome
- Lessons learned
- Technology stack
- AI-assisted engineering usage
- Confidentiality classification
- Publication status
- Supporting visual assets

### 4.5 Technical Skill Data

- Skill name
- Skill category
- Confidence classification
- Professional context
- Related projects or experience

The portfolio must not use percentage-based skill ratings.

### 4.6 AI-Assisted Engineering Data

- AI tool name
- Engineering activity
- How AI was used
- Human review responsibility
- Verification method
- Example outcomes
- Cases where incorrect AI assumptions were identified and corrected

### 4.7 Visual and Document Assets

- Professional photograph
- Resume PDF
- Sanitized project diagrams
- Sanitized screenshots
- Social-sharing image
- Portfolio favicon or identity assets

### 4.8 External Data Sources

The first version may link to, but does not own or synchronize data from:

- LinkedIn
- GitHub
- Email provider
- Current company systems
- Private repositories

The first version will not depend on live LinkedIn or GitHub APIs.

---

## 5. Data Generated or Presented by the Portfolio

### 5.1 Public Professional Profile

The portfolio presents a consolidated professional identity containing:

- Name
- Title
- Location
- Professional summary
- Primary technical strengths
- Target role direction
- Remote-friendly availability

### 5.2 Work Experience Presentation

The portfolio presents approved work-experience records with:

- Employer
- Role
- Exact employment dates
- Main responsibilities
- Selected contributions
- Technologies
- Relevant outcomes

### 5.3 Selected Project Case Studies

The initial portfolio is intended to present three strong project entries:

1. **Personal Developer Portfolio**
2. **Jury Process Management Integration**
3. **Third project pending evidence audit**

Only truthful and sufficiently verified project information may be published.

Unfinished or reassigned work must not be represented as completed.

A project that did not reach production must not be represented as production-deployed.

### 5.4 Technical Skill Presentation

The portfolio presents skills using evidence-oriented categories such as:

- Strong working skills
- Professional experience
- Currently learning

### 5.5 AI-Assisted Engineering Presentation

The portfolio presents AI as an engineering accelerator.

The intended message is:

> Randi uses AI to accelerate repository analysis, planning, implementation, debugging, testing, and documentation while remaining responsible for architecture, requirement validation, code review, security, testing, and final technical decisions.

### 5.6 Resume Access

The portfolio provides a public downloadable CV.

The system must not show a successful download state when the resume file is unavailable.

### 5.7 Contact and External Profile Access

The portfolio presents:

- Public professional email
- LinkedIn profile
- GitHub profile

External destinations must open through valid, intentional links.

### 5.8 Publication Output

Approved source-controlled content is transformed into a public production website through the owner publishing workflow.

The first version does not generate visitor accounts, comments, subscriptions, or user-created content.

---

## 6. Confirmed Initial Product Structure

### 6.1 Confirmed Pages

- Home
- Projects
- Project Detail
- Resume PDF
- Not Found

### 6.2 Confirmed Homepage Sections

- Navigation
- Hero
- About
- Selected Projects
- Work Experience
- Technical Skills
- AI-Assisted Engineering
- Contact
- Footer

### 6.3 Structure Change Status

The submitted input states that changes are required to the proposed MVP structure, but no specific changes were provided.

This is recorded as an open decision and must be resolved before the final page inventory is approved.

---

## 7. Initial Constraints

- The portfolio is urgent and should support job applications quickly.
- The first version must be inexpensive to build and host.
- Most professional source code is private.
- Confidential company information must not be exposed.
- Some projects were unfinished, reassigned, or not deployed.
- Only verified contributions may be presented as delivered work.
- Frontend is not Randi's strongest technical area.
- The website must still look professional and work well on mobile and desktop.
- The project must remain maintainable and expandable.
- The first version will use local source-controlled content.
- The first version will not require a database, CMS, or admin dashboard.
- The portfolio will use English as its primary language.

---

## 8. Initial Open Decisions

1. What changes are required to the approved MVP page structure?
2. What is the final third project?
3. What is the final professional headline?
4. What is the final professional summary?
5. Which skills belong in each skill category?
6. Which professional photograph will be used?
7. Which project screenshots or diagrams are safe to publish?
8. Will Version 1 launch with a custom domain?
9. What exact project status vocabulary will be used?
10. What information must be shown on each project card versus each project detail page?

---

## 9. Readiness

This document is ready to support the six-round Product Model discussion.

It is not yet the final Product Requirements Document.
