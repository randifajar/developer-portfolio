# Non-Functional Acceptance Criteria — Randi Fajar Wicaksono Developer Portfolio

## Document Information

- **Product Name:** Randi Fajar Wicaksono Developer Portfolio
- **Document Type:** Non-Functional Acceptance Criteria
- **Version:** 0.1
- **Status:** Draft for Review
- **Source PRD:** `PORTFOLIO_PRD_v0.1.md`
- **Product Owner:** Randi Fajar Wicaksono
- **Last Updated:** 2026-08-04

---

## 1. Purpose

This document defines the quality conditions that Version 1 must satisfy before launch.

These criteria cover:

- Performance
- Accessibility
- Responsive behavior
- Security
- Privacy and confidentiality
- Reliability
- SEO and social sharing
- Compatibility
- Maintainability
- Testability
- CI/CD
- Deployment
- Recovery
- Content quality

The criteria describe measurable outcomes without forcing a specific implementation unless the approved PRD already requires it.

---

## 2. Acceptance Rule

A non-functional criterion is accepted only when:

1. Its measurable threshold is satisfied.
2. Evidence is collected from the production-like or production environment.
3. Any exception is explicitly approved and documented.
4. No higher-priority criterion is violated.

### Priority values

- `P0` — Required for launch
- `P1` — Important for launch
- `P2` — Future improvement

---

# 3. Performance

## NFAC-PERF-001 — Core Web Vitals target

**Priority:** P0

For representative public pages on mobile and desktop:

- Largest Contentful Paint should be **2.5 seconds or less** under normal test conditions.
- Cumulative Layout Shift should be **0.1 or less**.
- Interaction to Next Paint should be **200 milliseconds or less** where measurable.

**Evidence**
- Lighthouse or equivalent report
- Production or production-like URL

---

## NFAC-PERF-002 — Lighthouse performance score

**Priority:** P1

The following pages should achieve a Lighthouse Performance score of **90 or higher** under a standard mobile audit:

- Home
- Projects Index
- One representative Project Detail page

A score below 90 requires a documented reason and Product Owner approval.

---

## NFAC-PERF-003 — Avoid blocking optional media

**Priority:** P0

Optional images, diagrams, and decorative assets must not block access to essential text content.

When optional media fails:

- Page structure remains stable.
- Primary actions remain usable.
- Required text remains available.

---

## NFAC-PERF-004 — Optimize public images

**Priority:** P1

Public images must:

- Use an appropriate web format.
- Avoid shipping dimensions substantially larger than their rendered use.
- Include width and height or another mechanism that prevents layout shift.
- Use lazy loading when the image is not initially visible.

---

## NFAC-PERF-005 — Keep the MVP payload proportionate

**Priority:** P1

Version 1 must not include heavy animation, charting, state-management, CMS, database, or UI dependencies without a documented product need.

The final technical design must include a dependency review before launch.

---

# 4. Accessibility

## NFAC-A11Y-001 — WCAG target

**Priority:** P0

The public website must meet **WCAG 2.2 Level AA** for the implemented Version 1 scope, excluding only third-party external websites outside portfolio control.

---

## NFAC-A11Y-002 — Keyboard navigation

**Priority:** P0

All interactive elements must be reachable and usable through keyboard input.

This includes:

- Navigation
- Project links
- Resume actions
- Email link
- LinkedIn link
- GitHub link
- Previous and next project actions
- Not Found recovery actions

Keyboard focus must remain visible.

---

## NFAC-A11Y-003 — Semantic structure

**Priority:** P0

Each page must:

- Use one clear primary heading.
- Follow a logical heading hierarchy.
- Use semantic navigation and landmark regions.
- Use actual links or buttons according to behavior.
- Avoid clickable non-semantic containers.

---

## NFAC-A11Y-004 — Alternative text

**Priority:** P0

Meaningful images require useful alternative text.

Decorative images must be ignored by assistive technology.

Diagrams must include a text explanation that communicates the important information.

---

## NFAC-A11Y-005 — Color contrast

**Priority:** P0

Text, controls, status labels, and focus indicators must meet WCAG AA contrast requirements.

Information must not rely on color alone.

---

## NFAC-A11Y-006 — Motion safety

**Priority:** P1

Any animation must:

- Be non-essential.
- Respect reduced-motion preferences.
- Avoid flashing or rapid motion.
- Never block content or navigation.

---

## NFAC-A11Y-007 — Accessibility audit

**Priority:** P0

Before launch:

- Automated accessibility testing must run on major page types.
- Manual keyboard testing must be completed.
- Critical and serious accessibility findings must be resolved.

---

# 5. Responsive Behavior

## NFAC-RESP-001 — Supported viewport range

**Priority:** P0

The public website must remain usable from **320 CSS pixels** wide through common large desktop widths.

No essential content may require horizontal scrolling at standard zoom.

---

## NFAC-RESP-002 — Mobile feature parity

**Priority:** P0

Mobile visitors must have access to the same essential information and actions as desktop visitors:

- Professional profile
- Experience
- Projects
- Skills
- AI workflow
- Resume
- Email
- LinkedIn
- GitHub
- Navigation

---

## NFAC-RESP-003 — Readable case studies

**Priority:** P0

Long Project Detail content must remain readable on mobile.

The layout must prevent:

- Text overflow
- Unreadably narrow text
- Oversized code or diagram overflow
- Hidden status or role information

---

## NFAC-RESP-004 — Touch target size

**Priority:** P1

Interactive controls should have a target size of at least **44 by 44 CSS pixels**, or equivalent surrounding clickable space.

---

# 6. Security

## NFAC-SEC-001 — No secrets in public output

**Priority:** P0

The public repository and deployed website must not contain:

- Credentials
- Tokens
- API keys
- Private keys
- Environment secrets
- Internal passwords
- Private connection strings

Automated secret scanning should be enabled or run before launch.

---

## NFAC-SEC-002 — No confidential company data

**Priority:** P0

The public website, public repository, build output, and static assets must not expose:

- Internal URLs
- Private repository links
- Customer data
- Student data
- Company database records
- Restricted source code
- Confidential screenshots
- Raw private AI-session exports

---

## NFAC-SEC-003 — Safe external links

**Priority:** P0

External links must:

- Use approved `https` destinations, except the direct email action.
- Not point to private repositories.
- Not execute untrusted script behavior.
- Use safe new-tab behavior when opening a new browser context.

---

## NFAC-SEC-004 — Dependency vulnerability threshold

**Priority:** P1

Before launch:

- Production dependencies must be audited.
- Known critical vulnerabilities must be resolved.
- Known high-severity vulnerabilities must be resolved or explicitly documented and approved.

---

## NFAC-SEC-005 — Security headers

**Priority:** P1

The production website should provide appropriate security headers for a static professional website, including protections against:

- MIME-type sniffing
- Unnecessary framing
- Unsafe referrer leakage

The exact header configuration belongs in technical design.

---

## NFAC-SEC-006 — Private content route protection

**Priority:** P0

Draft, Archived, Private, and Restricted project content must not be emitted into publicly discoverable navigation, indexes, or static metadata.

An invalid or private project route must not reveal private existence.

---

# 7. Privacy and Confidentiality

## NFAC-PRIV-001 — Data minimization

**Priority:** P0

Version 1 must collect no visitor-submitted personal data because it includes:

- No account registration
- No contact form
- No comments
- No newsletter
- No visitor profile

---

## NFAC-PRIV-002 — Public contact consent

**Priority:** P0

Only contact information intentionally approved by the Product Owner may be displayed publicly.

The approved public email is:

`randifajar2307@gmail.com`

---

## NFAC-PRIV-003 — Analytics boundary

**Priority:** P1

If analytics is added to Version 1:

- It must be privacy-conscious.
- It must not collect unnecessary personal data.
- Its inclusion must be documented.
- Any consent or disclosure requirements must be satisfied.

If these conditions are not resolved, analytics must remain disabled.

---

## NFAC-PRIV-004 — Confidentiality review evidence

**Priority:** P0

Each professional Project Case Study must have documented owner confirmation that:

- Personal contribution is accurate.
- Restricted information is removed.
- Media is safe.
- Project status is truthful.

---

# 8. Reliability and Error Handling

## NFAC-REL-001 — Public route availability

**Priority:** P0

After production deployment, the following must return a valid public result:

- `/`
- `/projects`
- Each Published Project Detail route
- Active Resume path
- Not Found behavior for invalid routes

---

## NFAC-REL-002 — No false success states

**Priority:** P0

The portfolio must never report success for actions controlled by external systems when success cannot be verified.

Examples:

- Do not claim an email was sent.
- Do not claim a Resume downloaded when the asset failed.
- Do not claim deployment is complete before production verification.

---

## NFAC-REL-003 — Graceful optional-content failure

**Priority:** P0

Failure of optional media must not make the page unusable.

Missing optional content must not produce a fatal page error.

---

## NFAC-REL-004 — Build determinism

**Priority:** P0

The same approved source revision and dependency lock file must produce a successful repeatable build in CI.

---

## NFAC-REL-005 — Broken-link validation

**Priority:** P1

Before launch, automated or manual validation must confirm that:

- Internal links resolve.
- Resume path resolves.
- LinkedIn URL is correct.
- GitHub URL is correct.
- Public email action is correct.

---

# 9. SEO and Social Sharing

## NFAC-SEO-001 — Unique metadata

**Priority:** P0

The following page types must have appropriate metadata:

- Home
- Projects Index
- Each Published Project Detail page

Metadata must include:

- Page title
- Description
- Canonical public URL when a custom domain is available
- Social-sharing title and description

---

## NFAC-SEO-002 — Search discoverability

**Priority:** P1

Public pages intended for discovery must be crawlable.

Draft, Private, Restricted, and non-public routes must not be intentionally indexed.

---

## NFAC-SEO-003 — Structured page titles

**Priority:** P0

Page titles must clearly identify both the page subject and Randi's professional identity.

---

## NFAC-SEO-004 — Social-sharing image

**Priority:** P1

The portfolio should provide a safe social-sharing image.

If a project-specific social image is not available, a default portfolio image may be used.

---

## NFAC-SEO-005 — Sitemap and robots behavior

**Priority:** P1

The production site should expose:

- A sitemap containing public routes
- Robots instructions consistent with publication rules

Private or unavailable project routes must not be listed.

---

# 10. Browser and Platform Compatibility

## NFAC-COMPAT-001 — Supported browsers

**Priority:** P0

The portfolio must work in current stable versions of:

- Chrome
- Edge
- Firefox
- Safari

The technical design may define a practical support window.

---

## NFAC-COMPAT-002 — No browser-specific essential behavior

**Priority:** P0

Essential content and navigation must not depend on one browser-specific API.

---

## NFAC-COMPAT-003 — Resume behavior

**Priority:** P1

The Resume must remain accessible when browser PDF behavior differs.

A stable direct PDF path must be available even when inline rendering is not supported.

---

# 11. Maintainability

## NFAC-MAINT-001 — Single source of truth

**Priority:** P0

Each public content item must have one authoritative source.

The same project, profile, or experience content must not be duplicated across multiple uncontrolled files.

---

## NFAC-MAINT-002 — Structured content validation

**Priority:** P0

Portfolio content must be validated against an approved structure before publication.

Validation must detect at least:

- Missing required fields
- Invalid Publication Status
- Invalid Project Delivery Status
- Invalid Confidentiality Classification
- Duplicate project slugs
- Multiple active Resumes
- Broken required references

---

## NFAC-MAINT-003 — Clear content and presentation boundary

**Priority:** P1

Content should be maintainable without rewriting presentation components for ordinary updates such as:

- Changing summary text
- Updating skills
- Adding a project
- Updating experience
- Replacing Resume metadata
- Replacing approved media

---

## NFAC-MAINT-004 — Documentation

**Priority:** P0

The public repository must document:

- Project purpose
- Local setup
- Required commands
- Content update workflow
- Validation commands
- Build command
- Test command
- Deployment model
- Confidentiality rules
- AI-assisted development responsibility

---

## NFAC-MAINT-005 — Dependency discipline

**Priority:** P1

Every production dependency must have a clear purpose.

Unused dependencies must be removed before launch.

---

# 12. Testability and Quality Assurance

## NFAC-TEST-001 — Automated quality commands

**Priority:** P0

The repository must provide commands for:

- Linting
- Type checking
- Automated tests
- Production build

Each command must return a non-zero exit status when it fails.

---

## NFAC-TEST-002 — Core functional test coverage

**Priority:** P0

Automated tests must cover at least:

- Published-content filtering
- Project slug resolution
- Draft or private project exclusion
- Resume active-state validation
- Required-content validation
- Not Found behavior
- Approved external links

---

## NFAC-TEST-003 — Production-build validation

**Priority:** P0

A production build must complete successfully before merge to the production branch.

---

## NFAC-TEST-004 — Manual release checklist

**Priority:** P0

Before launch, manual verification must cover:

- Desktop homepage
- Mobile homepage
- Projects Index
- Two Project Detail pages
- Resume
- Email link
- LinkedIn link
- GitHub link
- Keyboard navigation
- Not Found
- Production content review

---

# 13. CI/CD

## NFAC-CICD-001 — Pull-request validation

**Priority:** P0

Every pull request to the production branch must run:

- Dependency installation from the lock file
- Lint
- Type check
- Automated tests
- Production build

A failing required check blocks acceptance.

---

## NFAC-CICD-002 — Managed preview

**Priority:** P1

A reviewable preview should be available for portfolio changes before production merge.

The preview must not expose Restricted content.

---

## NFAC-CICD-003 — Automatic production deployment

**Priority:** P0

Merging an approved revision into the production branch must trigger managed deployment automatically.

---

## NFAC-CICD-004 — Production verification

**Priority:** P0

After deployment:

- The production homepage must be checked.
- Projects Index must be checked.
- Published Project Detail pages must be checked.
- Resume must be checked.
- External links must be checked.

Deployment-system success alone is insufficient.

---

## NFAC-CICD-005 — Public repository safety

**Priority:** P0

Only the portfolio repository may be public.

The private preparation workspace, raw AI exports, internal notes, and restricted media must remain outside the public repository.

---

# 14. Recovery and Change Safety

## NFAC-REC-001 — Source-controlled history

**Priority:** P0

All production changes must be traceable to source-control history.

---

## NFAC-REC-002 — Rollback capability

**Priority:** P0

The owner must be able to restore a previously valid production revision when a new release is broken or unsafe.

---

## NFAC-REC-003 — No production-only manual edits

**Priority:** P0

Public content must not depend on manual edits made only in the hosting platform or production output.

The source repository remains the authoritative production source.

---

## NFAC-REC-004 — Resume replacement safety

**Priority:** P1

Replacing the Resume must not leave the production website with:

- No active Resume
- Multiple active Resumes
- A broken Resume path

---

# 15. Content Quality

## NFAC-CONTENT-001 — English quality

**Priority:** P0

Public English content must be:

- Grammatically understandable
- Professionally appropriate
- Consistent in terminology
- Free from obvious placeholder text

---

## NFAC-CONTENT-002 — Truthful ownership language

**Priority:** P0

Professional content must distinguish:

- `I implemented`
- `I contributed`
- `The team delivered`
- `The project reached`
- `My responsibility was`

The portfolio must not use individual-ownership language for team-owned outcomes unless accurate.

---

## NFAC-CONTENT-003 — Consistent status terminology

**Priority:** P0

Project Delivery Status terminology must be consistent across:

- Homepage cards
- Projects Index
- Project Detail
- Metadata where applicable

---

## NFAC-CONTENT-004 — No unresolved public placeholders

**Priority:** P0

Production content must not contain unresolved markers such as:

- `TODO`
- `TBD`
- `Lorem ipsum`
- Fake metrics
- Empty headings
- Draft notes

---

## NFAC-CONTENT-005 — CV consistency

**Priority:** P0

The active Resume, portfolio, and LinkedIn-facing information must not materially contradict one another regarding:

- Name
- Role
- Employer
- Employment dates
- Public contact details
- Core professional positioning

---

# 16. Launch Quality Gate

Version 1 is non-functionally launch-ready only when:

## Performance

- [ ] NFAC-PERF-001 Passed
- [ ] NFAC-PERF-003 Passed
- [ ] No unresolved critical performance defect

## Accessibility

- [ ] NFAC-A11Y-001 through NFAC-A11Y-005 Passed
- [ ] NFAC-A11Y-007 Passed
- [ ] No unresolved critical or serious accessibility finding

## Responsive behavior

- [ ] NFAC-RESP-001 through NFAC-RESP-003 Passed

## Security and privacy

- [ ] NFAC-SEC-001 through NFAC-SEC-004 Passed
- [ ] NFAC-SEC-006 Passed
- [ ] NFAC-PRIV-001 through NFAC-PRIV-004 Passed
- [ ] No exposed secret or Restricted information

## Reliability

- [ ] NFAC-REL-001 through NFAC-REL-004 Passed

## SEO

- [ ] NFAC-SEO-001 and NFAC-SEO-003 Passed

## Compatibility

- [ ] NFAC-COMPAT-001 and NFAC-COMPAT-002 Passed

## Maintainability

- [ ] NFAC-MAINT-001 through NFAC-MAINT-004 Passed

## Testing and CI/CD

- [ ] NFAC-TEST-001 through NFAC-TEST-004 Passed
- [ ] NFAC-CICD-001 Passed
- [ ] NFAC-CICD-003 through NFAC-CICD-005 Passed

## Recovery

- [ ] NFAC-REC-001 through NFAC-REC-003 Passed

## Content quality

- [ ] NFAC-CONTENT-001 through NFAC-CONTENT-005 Passed

---

## 17. Traceability Summary

| NFAC Area | Primary PRD Sections |
|---|---|
| Performance | 1.4, 1.5, 1.8, 5 |
| Accessibility | 1.5, 1.8, 4, 5 |
| Responsive behavior | 1.5, 4, 5 |
| Security | 1.6, 1.7, 3.9, 3.12, 5, 6 |
| Privacy | 1.6, 1.7, 2, 3.7, 6 |
| Reliability | 1.8, 4, 5, 6 |
| SEO | 1.5, 1.8, 5 |
| Compatibility | 1.5, 5 |
| Maintainability | 1.4, 1.7, 6, 7 |
| Testing | 1.8, 5, 6, 7 |
| CI/CD | 1.5, 1.8, 4.6, 6.7 |
| Recovery | 4.6, 6.7 |
| Content quality | 1, 3, 5, 6 |

---

## 18. Approval

This NFAC document is ready for Product Owner review.
