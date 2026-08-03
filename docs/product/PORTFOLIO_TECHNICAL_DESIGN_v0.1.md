# Technical Design Specification — Randi Fajar Wicaksono Developer Portfolio

## Document Information

- **Product Name:** Randi Fajar Wicaksono Developer Portfolio
- **Document Type:** Technical Design Specification
- **Version:** 0.1
- **Status:** Draft for Review
- **Source Documents:**
  - `PORTFOLIO_PRD_v0.1.md`
  - `PORTFOLIO_FAC_v0.1.md`
  - `PORTFOLIO_NFAC_v0.1.md`
  - `PORTFOLIO_UX_UI_SPEC_v0.1.md`
- **Product Owner:** Randi Fajar Wicaksono
- **Last Updated:** 2026-08-04

---

# 1. Purpose

This document defines how Version 1 of the portfolio will be implemented.

It covers:

- Technology stack
- Runtime and package management
- Application architecture
- Source structure
- Content model
- Content validation
- Rendering strategy
- Route generation
- UI component boundaries
- Accessibility implementation
- Testing
- Security
- SEO
- CI/CD
- Deployment
- Recovery
- Docker upgrade path
- Future migration boundaries

This document must remain consistent with the approved PRD, FAC, NFAC, and UX/UI Specification.

---

# 2. Technical Goals

Version 1 must:

1. Launch quickly and cheaply.
2. Render fast public pages.
3. Require no database or runtime API.
4. Support source-controlled content updates.
5. Validate content before publication.
6. Prevent Draft, Private, and Restricted content from appearing publicly.
7. Generate project routes at build time.
8. Provide automated quality checks.
9. Deploy automatically after approved changes reach `main`.
10. Remain easy to expand without building a premature CMS.

---

# 3. Technical Non-Goals

Version 1 will not implement:

- Database persistence
- Authentication
- Admin dashboard
- CMS
- Server Actions for content mutation
- Custom API routes
- Contact form
- Visitor analytics unless separately approved
- Live GitHub or LinkedIn integrations
- Runtime project fetching
- Self-managed production server
- Docker-based production deployment
- Microservices
- State-management library
- Internationalization
- Runtime feature flags
- Complex animation framework

---

# 4. Architecture Summary

## 4.1 Architecture Style

**Statically generated content application with build-time validation.**

```text
Typed local content modules
        │
        ├── Zod structure validation
        ├── Cross-record validation
        └── Publication and confidentiality filtering
                    │
                    ▼
          Content selector layer
                    │
                    ▼
        Next.js App Router pages
                    │
        ├── Static homepage
        ├── Static Projects Index
        ├── Generated Project Detail pages
        ├── Static metadata
        ├── Sitemap and robots
        └── Static Resume asset
                    │
                    ▼
           Managed Vercel deployment
```

## 4.2 Runtime Behavior

The production site requires no application database and no custom API.

Portfolio content is imported during build. Public pages are generated from approved content.

The browser receives rendered pages and only the minimum JavaScript required for interactive UI such as the mobile navigation menu.

## 4.3 Rendering Strategy

- Use the Next.js App Router.
- Use Server Components by default.
- Use Client Components only for browser state or event handling.
- Generate Project Detail routes at build time.
- Use static metadata where possible.
- Use dynamic metadata generation only for project-specific values.
- Do not use `output: export` in Version 1.
- Use normal Next.js production output on Vercel so image optimization, metadata features, and future incremental capabilities remain available.
- No page depends on request-time private data.

---

# 5. Technology Stack

## 5.1 Runtime

| Technology | Decision |
|---|---|
| Node.js | Node.js 24 LTS |
| Package manager | npm |
| Lock file | `package-lock.json` |
| Module system | ECMAScript modules where supported |
| Language | TypeScript |

### Runtime policy

- Local development, CI, and production must use Node.js 24 LTS.
- Add `.nvmrc` with `24`.
- Add `.node-version` with the approved Node.js 24 patch version.
- `package.json` must define a Node.js 24 engine range.
- Production applications must not depend on Node.js Current releases.

## 5.2 Application Framework

| Technology | Decision |
|---|---|
| Framework | Next.js, current stable release at project initialization |
| Router | App Router |
| React | Version supported by the selected stable Next.js release |
| Rendering | Static generation through App Router |
| Images | `next/image` |
| Fonts | `next/font` or a system font stack |
| Metadata | Next.js Metadata API |

The exact installed framework versions must be locked in `package-lock.json`.

## 5.3 Styling

| Technology | Decision |
|---|---|
| Styling | Tailwind CSS v4 |
| Global styles | `src/app/globals.css` |
| Design tokens | CSS custom properties |
| Class composition | Small local helper only when necessary |
| Component library | None for Version 1 |

Do not add a large UI component library.

Reusable UI components will be implemented locally to preserve the approved visual direction and reduce dependency weight.

## 5.4 Content Validation

| Technology | Decision |
|---|---|
| Schema validation | Zod v4 |
| Validation time | Development and build time |
| Cross-record validation | Custom TypeScript validation |
| Release validation | Dedicated strict validation command |

## 5.5 Rich Text

| Technology | Decision |
|---|---|
| Storage | Markdown strings inside typed TypeScript content modules |
| Rendering | `react-markdown` |
| Markdown extension | `remark-gfm` |
| Raw HTML | Disabled |

Rich text is used only for longer portfolio sections such as project context, approach, testing, outcome, and lessons.

Raw HTML from content is not supported.

## 5.6 Testing

| Test level | Technology |
|---|---|
| Unit and content logic | Vitest |
| React component tests | Testing Library |
| DOM assertions | `@testing-library/jest-dom` |
| End-to-end | Playwright |
| Accessibility automation | `@axe-core/playwright` |
| Performance release audit | Lighthouse CLI or Lighthouse CI |

## 5.7 Code Quality

| Area | Technology |
|---|---|
| Linting | ESLint |
| Formatting | Prettier |
| Type checking | TypeScript compiler |
| Dependency audit | npm audit for production dependencies |
| Secret protection | GitHub secret scanning and repository review |

No pre-commit framework is required for Version 1. CI is the authoritative quality gate.

---

# 6. Architecture Decisions

## ADR-001 — Use Next.js App Router

### Decision

Use Next.js App Router for page routing, static generation, metadata, images, sitemap, robots, and Not Found behavior.

### Reason

The product requires multiple public routes, strong metadata, static project generation, image optimization, and a clear future upgrade path.

### Consequence

The application remains a single Next.js project with no separate backend service.

---

## ADR-002 — Use Node.js 24 LTS

### Decision

Use Node.js 24 LTS across local development, CI, and production.

### Reason

The project should use a supported production runtime and avoid Current or end-of-life versions.

### Consequence

All contributors and automation must use the same Node.js major version.

---

## ADR-003 — Use typed local content modules

### Decision

Store profile, experience, projects, skills, AI practices, links, media metadata, and Resume metadata as TypeScript modules.

### Reason

Typed modules provide:

- Fast implementation
- Source-control history
- Compile-time checking
- Easy Zod validation
- No database
- No CMS
- Clear content ownership

### Consequence

Content editing requires repository changes.

This is accepted for Version 1.

---

## ADR-004 — Use structured project objects with Markdown section strings

### Decision

Each Project Case Study is a typed object.

Long-form section values use Markdown strings rendered through `react-markdown`.

### Reason

This preserves structured required fields while allowing readable long-form content.

### Consequence

Adding a project requires creating one content module and registering it in the project content index.

---

## ADR-005 — Validate at build time

### Decision

All content must pass Zod structure validation and custom cross-record validation before a production build is accepted.

### Reason

A public static site cannot rely on runtime validation after incorrect content has already shipped.

### Consequence

Invalid content blocks CI and deployment.

---

## ADR-006 — Separate structural validation from release validation

### Decision

Provide two validation modes.

#### Structural validation

Runs during normal development and every pull request.

Validates:

- Required field types
- Enum values
- Unique identifiers
- Unique project slugs
- Valid internal references
- Publication and confidentiality rules

#### Release validation

Runs before production launch and release approval.

Additionally validates:

- At least two Published projects
- Personal Developer Portfolio is Published
- Jury Process Management Integration is Published
- Exactly one active Published Resume
- No public placeholder text
- Required production URL
- Required social metadata
- Required public links
- No unresolved release-blocking content

### Reason

Early implementation should not be blocked because final portfolio content is still being prepared.

### Consequence

A development build can succeed with Draft placeholders, while a release build cannot.

---

## ADR-007 — Server Components by default

### Decision

Use Server Components for all content rendering unless browser-only interaction is required.

### Approved Client Component candidates

- Mobile navigation menu
- Optional active-section navigation behavior
- Optional copy-link control

### Reason

The site is primarily static content and does not require broad client state.

### Consequence

Most pages ship little client-side JavaScript.

---

## ADR-008 — No runtime content API

### Decision

Do not create API routes or a backend service for Version 1.

### Reason

All content is local and changes only through the owner publishing workflow.

### Consequence

There is no API authentication, API hosting, API monitoring, or runtime database dependency.

---

## ADR-009 — Deploy through Vercel Git integration

### Decision

Connect the public GitHub repository to Vercel.

- Pull requests receive Preview Deployments.
- The production branch is `main`.
- Merges to `main` trigger Production Deployments.

### Reason

This provides managed preview and production deployment without self-managed infrastructure.

### Consequence

Vercel manages hosting infrastructure, while GitHub Actions remains the code-quality gate.

---

## ADR-010 — Keep Docker outside the Version 1 launch path

### Decision

Docker is not required to launch Version 1.

### Reason

The production application is a small managed Next.js deployment with no separate services.

### Consequence

Docker support may be added after launch as a portability and infrastructure-learning enhancement.

---

## ADR-011 — Keep private evidence outside the public repository

### Decision

Raw Claude exports, Codex exports, company documents, internal notes, Private content, Restricted content, and unsafe media remain outside the public repository.

### Reason

A file committed to a public repository is public even when the website does not link to it.

### Consequence

`publicationStatus = Draft` does not make repository content private.

Only Public or safely Sanitized material may enter the public repository.

---

# 7. Repository Boundary

## 7.1 Private workspace

```text
portfolio-workspace/
├── preparation/
├── planning/
└── portfolio/
```

The following remain outside the public repository:

- Raw Claude exports
- Raw Codex exports
- Confidential screenshots
- Internal project notes
- Company documents
- Private project evidence
- Restricted diagrams
- Drafts containing protected details
- Credentials
- Environment secrets

## 7.2 Public repository

Only this directory becomes a Git repository:

```text
portfolio-workspace/portfolio/
```

The public repository may contain:

- Application source
- Approved Public content
- Approved Sanitized content
- Safe project diagrams
- Active public Resume
- Public documentation
- CI configuration

---

# 8. Recommended Project Structure

```text
portfolio/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── release-audit.yml
│
├── public/
│   ├── images/
│   │   ├── profile/
│   │   ├── projects/
│   │   └── social/
│   ├── icons/
│   ├── resume.pdf
│   └── favicon.ico
│
├── scripts/
│   ├── validate-content.ts
│   ├── validate-release.ts
│   └── check-links.ts
│
├── src/
│   ├── app/
│   │   ├── projects/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   ├── opengraph-image.tsx
│   │   ├── page.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── footer.tsx
│   │   │   ├── header.tsx
│   │   │   └── mobile-navigation.tsx
│   │   ├── project/
│   │   │   ├── project-card.tsx
│   │   │   ├── project-header.tsx
│   │   │   ├── project-navigation.tsx
│   │   │   ├── project-responsibility.tsx
│   │   │   └── project-section.tsx
│   │   ├── sections/
│   │   │   ├── about-section.tsx
│   │   │   ├── ai-workflow-section.tsx
│   │   │   ├── contact-section.tsx
│   │   │   ├── experience-section.tsx
│   │   │   ├── hero-section.tsx
│   │   │   ├── projects-section.tsx
│   │   │   └── skills-section.tsx
│   │   └── ui/
│   │       ├── button-link.tsx
│   │       ├── external-link.tsx
│   │       ├── markdown-content.tsx
│   │       ├── section-header.tsx
│   │       ├── status-badge.tsx
│   │       └── technology-tag.tsx
│   │
│   ├── content/
│   │   ├── ai-practices.ts
│   │   ├── contact.ts
│   │   ├── experience.ts
│   │   ├── media.ts
│   │   ├── profile.ts
│   │   ├── projects/
│   │   │   ├── index.ts
│   │   │   ├── jury-process-management.ts
│   │   │   └── personal-developer-portfolio.ts
│   │   ├── resume.ts
│   │   ├── site.ts
│   │   └── skills.ts
│   │
│   ├── domain/
│   │   ├── content/
│   │   │   ├── schemas.ts
│   │   │   ├── selectors.ts
│   │   │   ├── types.ts
│   │   │   └── validation.ts
│   │   ├── metadata/
│   │   │   └── build-metadata.ts
│   │   └── projects/
│   │       ├── delivery-status.ts
│   │       └── project-navigation.ts
│   │
│   └── lib/
│       ├── constants.ts
│       ├── environment.ts
│       └── paths.ts
│
├── tests/
│   ├── components/
│   ├── content/
│   └── domain/
│
├── e2e/
│   ├── accessibility.spec.ts
│   ├── home.spec.ts
│   ├── navigation.spec.ts
│   ├── project-detail.spec.ts
│   ├── projects.spec.ts
│   └── resume.spec.ts
│
├── .env.example
├── .gitignore
├── .node-version
├── .nvmrc
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── playwright.config.ts
├── postcss.config.mjs
├── prettier.config.mjs
├── README.md
├── tsconfig.json
└── vitest.config.ts
```

## 8.1 Boundary rules

- `content/` contains approved content data, not UI behavior.
- `domain/` contains pure types, schemas, selectors, and validation.
- `components/` contains presentation behavior.
- `app/` composes routes and metadata.
- `lib/` contains small infrastructure helpers.
- No general dumping-ground `utils.ts` file.
- A Client Component must be placed at the smallest interactive boundary.

---

# 9. Content Model

## 9.1 Internal enum values

Use stable machine-readable values internally.

### Publication Status

```ts
type PublicationStatus = "draft" | "published" | "archived";
```

### Project Delivery Status

```ts
type ProjectDeliveryStatus =
  | "personal-project"
  | "in-development"
  | "completed"
  | "internal-release"
  | "proof-of-concept"
  | "production"
  | "archived";
```

### Confidentiality Classification

```ts
type ConfidentialityClassification =
  | "public"
  | "sanitized"
  | "private"
  | "restricted";
```

### Skill Classification

```ts
type SkillClassification =
  | "strong-working-skill"
  | "professional-experience"
  | "currently-learning";
```

Human-readable labels are defined in one mapping module.

Components must not invent alternative labels.

---

## 9.2 Project content shape

The final schema must follow this conceptual structure:

```ts
interface ProjectCaseStudy {
  id: string;
  slug: string;
  title: string;
  summary: string;
  projectType: "personal" | "professional";
  role: string;
  deliveryStatus: ProjectDeliveryStatus;
  period?: string;

  context: string;
  problem: string;
  personalResponsibilities: string[];
  teamResponsibilities?: string[];
  technicalApproach: string;
  workflowOrArchitecture?: string;
  challenges: Array<{
    title: string;
    description: string;
  }>;
  decisionsAndTradeoffs: Array<{
    decision: string;
    rationale: string;
    tradeoff?: string;
  }>;
  implementationSummary: string;
  testingAndVerification: string;
  outcome: string;
  aiUsage?: string;
  lessonsLearned: string;

  technologyIds: string[];
  mediaAssetIds?: string[];
  repositoryUrl?: string;
  confidentialityNote?: string;

  confidentialityClass: ConfidentialityClassification;
  featured: boolean;
  featuredPriority?: number;
  publicationStatus: PublicationStatus;
  updatedAt: string;
}
```

Fields containing `string` rich text may contain Markdown.

---

## 9.3 Content definition helper

Every content module should be created through a definition helper.

Example:

```ts
export const juryProcessManagementProject = defineProject({
  // Approved project data
});
```

`defineProject` must:

1. Parse data with the Zod schema.
2. Return typed validated data.
3. Fail immediately when the module structure is invalid.

---

## 9.4 Cross-record validation

The validation layer must verify:

- Unique IDs across each content type
- Unique project slugs
- Valid technology references
- Valid media references
- Valid project references
- One active Published Resume
- One active Published Professional Profile
- No Restricted content marked Published
- No Private content marked Published
- Published projects have all required sections
- Featured projects are Published
- Featured priorities do not conflict
- Production status is explicitly confirmed in content metadata
- External URLs use allowed protocols
- Resume path points to a PDF
- Public media paths are local and safe

---

## 9.5 Production confirmation field

To reduce accidental Production labels, a Production project must contain an explicit confirmation field.

Conceptual example:

```ts
productionConfirmation?: {
  verified: true;
  note: string;
};
```

Validation rule:

- `deliveryStatus = "production"` requires `productionConfirmation.verified = true`.
- Non-production statuses must not require it.
- The note remains public-safe and must not expose internal deployment details.

This field is for content integrity, not external employment verification.

---

## 9.6 Public repository confidentiality rule

The content schema controls website visibility, not repository privacy.

Therefore:

- Public repository content may only be Public or Sanitized.
- Private and Restricted content must never be committed.
- Draft content committed to the public repository must already be safe if read directly from GitHub.
- Raw AI exports never enter `src/content`.

---

# 10. Content Selectors

The page layer must not filter raw content ad hoc.

Provide tested selector functions:

```ts
getPublishedProfile()
getPublishedExperience()
getPublishedProjects()
getFeaturedProjects(limit?: number)
getPublishedProjectBySlug(slug: string)
getAdjacentPublishedProjects(slug: string)
getPublishedSkillGroups()
getPublishedAIPractices()
getActiveResume()
getPublishedContactChannels()
getPublishedExternalProfiles()
```

## Selector requirements

- Exclude non-Published content.
- Exclude non-public confidentiality classes.
- Apply consistent ordering.
- Return immutable or read-only results where practical.
- Throw a build-time error for impossible required states.
- Return `null` for a missing public project so the route can call `notFound()`.

---

# 11. Route Design

## 11.1 Root layout

`src/app/layout.tsx` owns:

- HTML language
- Global metadata defaults
- Font setup
- Global styles
- Header
- Main-content boundary
- Footer when shared globally
- Skip-to-content link

## 11.2 Home

`src/app/page.tsx`

Responsibilities:

- Load approved homepage data through selectors.
- Compose homepage sections.
- Provide section IDs.
- Remain a Server Component.

## 11.3 Projects Index

`src/app/projects/page.tsx`

Responsibilities:

- Load all Published projects.
- Render approved ordering.
- Render truthful empty state.
- Provide page metadata.

## 11.4 Project Detail

`src/app/projects/[slug]/page.tsx`

Responsibilities:

- Export `generateStaticParams()`.
- Export `generateMetadata()`.
- Set `dynamicParams = false`.
- Resolve the Published project.
- Call `notFound()` when unavailable.
- Render approved case-study section order.
- Render adjacent-project navigation.

## 11.5 Not Found

`src/app/not-found.tsx`

Responsibilities:

- Provide the same public result for unknown and unavailable content.
- Link to Home and Projects.
- Avoid private existence details.

## 11.6 Resume

The active Resume file is stored at:

```text
public/resume.pdf
```

All Resume actions use the stable `/resume.pdf` path.

Resume metadata remains in `src/content/resume.ts` for validation and display labels.

## 11.7 Sitemap

`src/app/sitemap.ts`

Includes only:

- Home
- Projects Index
- Published Project Detail routes

The Resume may be excluded from sitemap indexing.

## 11.8 Robots

`src/app/robots.ts`

Allows crawling of public pages.

Non-public project routes are absent from static route generation and sitemap.

---

# 12. Metadata and SEO

## 12.1 Site configuration

Define one site configuration object containing:

- Site name
- Default title
- Title template
- Default description
- Owner name
- Site URL
- Locale
- LinkedIn URL
- GitHub URL
- Email
- Default social image

## 12.2 Site URL

Use the environment variable:

```text
SITE_URL
```

Rules:

- Optional during local development with a localhost fallback.
- Required by release validation.
- Must be an absolute HTTPS URL in production.
- Must not be exposed as a secret because it is public metadata.

## 12.3 Home metadata

Contains:

- Randi's name
- Professional positioning
- Short description
- Canonical URL
- Open Graph values
- Social image

## 12.4 Project metadata

Generated from Project Case Study content:

- Unique title
- Summary
- Canonical route
- Project-specific or default social image
- No Private or Restricted metadata

## 12.5 Structured data

Version 1 may include JSON-LD for:

- `Person`
- `WebSite`
- `ProfilePage`

Project-specific structured data is optional and must not delay launch.

---

# 13. UI Component Design

## 13.1 Component policy

A component should exist when it:

- Is reused
- Has a clear responsibility
- Encapsulates meaningful presentation behavior
- Improves accessibility consistency
- Simplifies page composition

Do not create components for every wrapper element.

## 13.2 UI primitives

### `ButtonLink`

For internal or external call-to-action links.

Props should distinguish:

- `href`
- Visual variant
- External behavior
- Accessible label
- Optional icon

### `StatusBadge`

Receives only a valid `ProjectDeliveryStatus`.

It maps status to:

- Approved label
- Approved visual treatment
- Optional icon
- Accessible description

### `TechnologyTag`

Displays the canonical skill name.

### `SectionHeader`

Standardizes eyebrow, heading, and description structure.

### `MarkdownContent`

Renders approved Markdown strings with:

- Raw HTML disabled
- Styled headings
- Styled lists
- Safe links
- Responsive images when explicitly supported
- Code formatting only when needed

## 13.3 Section components

Section components receive validated view data.

They must not import raw unvalidated content directly when a selector is available.

## 13.4 Client component boundary

`MobileNavigation` may be a Client Component.

The Header should remain a Server Component that composes the interactive mobile boundary.

No homepage-wide client state is approved.

---

# 14. Styling Architecture

## 14.1 Tailwind CSS

Use Tailwind CSS for layout and component styling.

## 14.2 CSS custom properties

Define semantic design tokens in `globals.css`.

Example categories:

- `--color-background`
- `--color-surface`
- `--color-text-primary`
- `--color-text-secondary`
- `--color-border`
- `--color-accent`
- `--color-focus`
- Status colors
- Content width
- Header height

Tailwind utilities may reference these tokens.

## 14.3 Class composition

Avoid long unreadable conditional class expressions.

A minimal class-composition helper may be used.

Do not add a component-variant library unless the design implementation demonstrates a real need.

## 14.4 Typography

Use one primary sans-serif family.

Long-form project content uses a dedicated prose style built locally.

A large typography plugin is optional, not mandatory.

## 14.5 Animation

Use CSS transitions for:

- Hover
- Focus
- Mobile navigation
- Small card movement

Do not add a general animation library for Version 1.

Respect `prefers-reduced-motion`.

---

# 15. Accessibility Implementation

## 15.1 Global requirements

- Add a skip-to-content link.
- Use one `h1` per page.
- Use semantic landmarks.
- Use visible focus styles.
- Use keyboard-operable navigation.
- Ensure anchor targets account for sticky header height.
- Avoid color-only status meaning.
- Provide alt text for meaningful images.
- Mark decorative images appropriately.
- Provide text descriptions for diagrams.

## 15.2 Mobile navigation

When open:

- Menu button exposes `aria-expanded`.
- Menu has an accessible label.
- Escape closes the menu.
- Selecting a link closes the menu.
- Focus behavior is controlled.
- Background interaction is prevented where appropriate.

## 15.3 External links

External links must have understandable labels.

An external-link icon must not be the only indication.

## 15.4 Automated accessibility

Playwright accessibility tests must scan:

- Home
- Projects Index
- One representative Project Detail page
- Not Found

Critical and serious findings block release.

---

# 16. Image and Asset Handling

## 16.1 Image format

Prefer:

- WebP or AVIF for photographs and screenshots
- SVG for simple local diagrams and icons
- PDF for Resume

## 16.2 Image metadata

Each meaningful image requires:

- Public path
- Width
- Height
- Alt text
- Confidentiality classification
- Publication Status

## 16.3 Image rendering

Use `next/image` for raster images.

Static dimensions must be available to prevent layout shift.

## 16.4 Project diagrams

Diagrams must:

- Be sanitized
- Use readable labels
- Remain understandable with a text explanation
- Avoid internal identifiers and URLs
- Be tested at mobile width

## 16.5 Asset naming

Use lowercase kebab-case.

Examples:

```text
randi-fajar-wicaksono.webp
jury-process-management-flow.svg
portfolio-social-card.png
```

---

# 17. Error and Empty State Implementation

## 17.1 Missing optional media

Do not render the media container.

Text content remains unchanged.

## 17.2 No Published projects

Render the approved empty state.

Release validation fails because Version 1 requires at least two Published projects.

## 17.3 Missing Resume

Hide or disable normal Resume actions only when the unavailable state is clearly communicated.

The site must not claim a download succeeded.

## 17.4 Invalid project

Call `notFound()`.

Do not distinguish unknown, Draft, Archived, Private, or Restricted projects publicly.

## 17.5 Content validation failure

Fail the build with:

- Content type
- Record identifier
- Field path
- Clear error message

Do not silently omit required invalid content.

---

# 18. Testing Strategy

## 18.1 Unit tests

Unit tests cover:

- Enum-to-label mappings
- Status presentation mapping
- Publication filtering
- Confidentiality filtering
- Project ordering
- Adjacent-project calculation
- URL validation
- Resume validation
- Release-rule validation

## 18.2 Content schema tests

Tests cover:

- Valid project
- Missing required section
- Duplicate slug
- Invalid Project Delivery Status
- Production without explicit confirmation
- Published Private content
- Published Restricted content
- Invalid skill reference
- Invalid media reference
- Multiple active Resumes
- Featured Draft project

## 18.3 Component tests

Testing Library covers important reusable behavior:

- StatusBadge renders text
- ProjectCard exposes correct link
- Header navigation labels
- Mobile menu accessibility state
- Resume action unavailable state
- External link attributes
- Empty state recovery actions

Avoid snapshot-heavy tests.

## 18.4 End-to-end tests

Playwright covers:

### Home

- Identity appears
- Required sections exist
- View Projects works
- Resume action resolves
- External links use approved destinations

### Projects

- Published project cards appear
- Draft projects do not appear
- Project detail opens

### Project Detail

- Required sections appear
- Status and role appear near top
- Back navigation works
- Direct route works
- Invalid slug shows Not Found

### Responsive behavior

- Mobile navigation opens and closes
- No essential horizontal overflow
- Important actions remain reachable

### Accessibility

- Axe scan on major page types
- Keyboard navigation smoke test

### Resume

- `/resume.pdf` returns a valid response in release tests

## 18.5 Cross-browser scope

Release E2E tests run against:

- Chromium
- Firefox
- WebKit

## 18.6 Performance audit

Before launch, run Lighthouse against:

- Home
- Projects Index
- One representative Project Detail page

Release evidence must be saved or recorded.

---

# 19. Package Scripts

The final `package.json` should expose commands equivalent to:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit",
    "validate:content": "tsx scripts/validate-content.ts",
    "validate:release": "tsx scripts/validate-release.ts",
    "check:links": "tsx scripts/check-links.ts",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "audit:prod": "npm audit --omit=dev --audit-level=high",
    "check": "npm run format:check && npm run lint && npm run typecheck && npm run validate:content && npm run test:run && npm run build",
    "release:check": "npm run check && npm run validate:release && npm run check:links && npm run test:e2e && npm run audit:prod"
  }
}
```

Exact command details may be adjusted during implementation when required by installed stable versions.

The behavioral contract must remain unchanged.

---

# 20. TypeScript Configuration

Use strict TypeScript.

Required settings include:

- `strict: true`
- `noUncheckedIndexedAccess: true`
- `forceConsistentCasingInFileNames: true`
- `noEmit: true`
- Path alias for `@/*` to `src/*`

Avoid `any`.

When an external library returns unknown data, validate or narrow it.

---

# 21. Environment Configuration

## 21.1 `.env.example`

```text
SITE_URL=http://localhost:3000
```

## 21.2 Rules

- No secret environment variable is required for Version 1.
- Production `SITE_URL` must be HTTPS.
- Environment parsing occurs in one module.
- Release validation fails when the production site URL is absent or invalid.
- Do not read environment variables throughout unrelated components.

---

# 22. Security Design

## 22.1 Secret policy

- No secrets in source.
- No secrets in content modules.
- No secrets in public images.
- No company credentials in Git history.
- Enable GitHub secret scanning and push protection where available.

## 22.2 External links

- Allow `https:` for public external profiles.
- Allow `mailto:` for the email action.
- Reject unsupported protocols.
- Use safe new-tab attributes when opening a new context.

## 22.3 Security headers

Configure practical static-site headers through Next.js or Vercel:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- Frame protection
- Restrictive `Permissions-Policy`

A strict Content Security Policy may be added only after it is tested against the selected Next.js production output.

Do not add an untested policy that breaks the application merely to achieve an impressive header scanner screenshot.

## 22.4 Dependency policy

- Use the minimum required dependencies.
- Lock dependencies.
- Audit production dependencies.
- Resolve critical vulnerabilities before launch.
- Resolve or document high-severity vulnerabilities.

---

# 23. CI Design

## 23.1 CI provider

GitHub Actions.

## 23.2 Required pull-request workflow

Workflow: `.github/workflows/ci.yml`

Triggers:

- Pull request to `main`
- Push to `main`

Jobs:

### Job 1 — Quality

1. Checkout repository.
2. Install Node.js 24.
3. Restore npm cache.
4. Run `npm ci`.
5. Run formatting check.
6. Run lint.
7. Run type check.
8. Run structural content validation.
9. Run unit and component tests.
10. Run production build.

### Job 2 — End-to-end

Depends on Quality.

1. Install Playwright browsers and dependencies.
2. Start the production build.
3. Run Chromium, Firefox, and WebKit tests.
4. Upload Playwright report on failure.

## 23.3 Branch protection

Protect `main`.

Require:

- Pull request
- Required Quality check
- Required E2E check
- Branch up to date before merge

For a one-person repository, self-approval may be permitted, but direct pushes to `main` should still be avoided.

## 23.4 Release audit

Workflow: `.github/workflows/release-audit.yml`

Trigger:

- Manual workflow dispatch
- Optional production release tag

Runs:

- Release content validation
- Link checks
- Production dependency audit
- Lighthouse audit
- Production smoke checks when a URL is available

---

# 24. Vercel Deployment Design

## 24.1 Repository integration

Connect the GitHub repository to Vercel.

## 24.2 Environments

### Development

Local machine.

### Preview

Created for pull requests and non-production branches.

### Production

Created from `main`.

## 24.3 Deployment flow

```text
Feature branch
→ Pull request
→ GitHub Actions validation
→ Vercel Preview Deployment
→ Owner review
→ Merge to main
→ Vercel Production Deployment
→ Production verification
```

## 24.4 Vercel settings

- Framework preset: Next.js
- Node.js version: 24
- Install command: `npm ci`
- Build command: `npm run build`
- Production branch: `main`
- Production environment variable: `SITE_URL`
- Preview environment must not contain private or restricted content

## 24.5 Deployment acceptance

A deployment is accepted only after checking:

- Home
- Projects Index
- Published Project Detail pages
- Resume
- Email link
- LinkedIn link
- GitHub link
- Mobile layout
- Not Found behavior

Vercel success alone is not final acceptance.

---

# 25. Recovery and Rollback

## 25.1 Source rollback

Every production change is represented by a Git commit.

When a release is incorrect:

1. Revert the offending commit or restore the previous valid revision.
2. Merge through the normal workflow.
3. Allow automatic redeployment.
4. Verify production.

## 25.2 Hosting rollback

Vercel deployment rollback may be used for urgent recovery.

The source repository must still be corrected afterward so source and production do not remain inconsistent.

## 25.3 Content correction

Incorrect content is corrected in source.

Do not edit generated production output manually.

---

# 26. Docker Upgrade Path

Docker is a post-launch enhancement.

## 26.1 Goal

Provide a portable self-hosting option and demonstrate containerization knowledge.

## 26.2 Planned approach

When Docker is added:

- Configure Next.js standalone output.
- Use a multi-stage Docker build.
- Build with Node.js 24.
- Run as a non-root user.
- Copy only required standalone runtime files.
- Expose the application port.
- Provide a simple health check.
- Add `.dockerignore`.
- Document build and run commands.

## 26.3 Optional files

```text
Dockerfile
.dockerignore
docker-compose.yml
```

`docker-compose.yml` is optional because Version 1 has only one service.

## 26.4 Docker acceptance

```text
docker build
→ container starts
→ homepage responds
→ project routes respond
→ Resume responds
→ container runs as non-root
```

## 26.5 Boundary

Docker support must not replace the managed Vercel launch path unless a later approved decision changes production hosting.

---

# 27. Future Backend and CMS Migration

Version 1 does not build abstractions merely to imitate a future backend.

However, boundaries must make migration possible.

## 27.1 Stable boundaries

Keep pages dependent on selector functions rather than raw content arrays.

Future implementations can replace local selectors with:

- Headless CMS adapter
- Custom API client
- Database repository

## 27.2 Migration rule

Do not migrate to a CMS or backend until at least one real requirement exists, such as:

- Frequent browser-based publishing
- Multiple content editors
- Draft-review workflow
- Image library management
- Article publishing
- Content scheduling

## 27.3 No speculative database schema

The product-level schema in the PRD remains the source for a future persistence design.

Version 1 should not create database migrations for unused storage.

---

# 28. Observability

Version 1 requires minimal operational visibility.

## 28.1 Required

- Vercel deployment logs
- GitHub Actions history
- Build failure visibility
- Playwright failure reports
- Lighthouse release evidence

## 28.2 Not required

- Application performance monitoring agent
- Log aggregation service
- Distributed tracing
- Error-reporting SaaS
- Runtime analytics dashboard

A static portfolio does not need an observability platform designed for a payment network.

---

# 29. Documentation Requirements

The public `README.md` must contain:

1. Product purpose
2. Public URL
3. Technology stack
4. Architecture summary
5. Local prerequisites
6. Installation
7. Development command
8. Quality commands
9. Content structure
10. How to add or update a project
11. Publication and confidentiality rules
12. Testing
13. CI/CD
14. Deployment model
15. Docker status
16. AI-assisted development responsibility
17. License decision

## 29.1 Architecture documentation

Add:

```text
docs/
├── architecture.md
├── content-authoring.md
└── release-checklist.md
```

These documents belong inside the public repository only when they contain no Private or Restricted information.

---

# 30. Implementation Sequence

The downstream Implementation Plan should use this order:

1. Initialize repository and runtime.
2. Configure TypeScript, ESLint, Prettier, and Tailwind.
3. Create design tokens and base layout.
4. Define domain schemas and enums.
5. Create content modules and definition helpers.
6. Implement structural and release validation.
7. Implement selector functions.
8. Implement UI primitives.
9. Implement Header, Footer, and navigation.
10. Implement homepage sections.
11. Implement Projects Index.
12. Implement Project Detail static generation.
13. Implement Resume and Not Found behavior.
14. Implement metadata, sitemap, robots, and social image.
15. Add unit and component tests.
16. Add Playwright and accessibility tests.
17. Add GitHub Actions.
18. Connect Vercel and configure Preview/Production.
19. Run release validation and quality audits.
20. Replace all Draft placeholders with approved content.
21. Verify production.
22. Add Docker only after the managed launch is stable.

---

# 31. Technical Acceptance Checklist

The Technical Design is correctly implemented when:

## Architecture

- [ ] App Router is used.
- [ ] Server Components are the default.
- [ ] No runtime content API exists.
- [ ] No database exists.
- [ ] Project pages are generated from Published content.
- [ ] Unknown and unavailable projects resolve to Not Found.

## Content

- [ ] Content uses typed modules.
- [ ] Zod validates structures.
- [ ] Cross-record validation runs.
- [ ] Release validation is separate.
- [ ] Private and Restricted content are outside the repository.
- [ ] Production status requires explicit confirmation.

## Quality

- [ ] Strict TypeScript passes.
- [ ] ESLint passes.
- [ ] Formatting check passes.
- [ ] Unit tests pass.
- [ ] E2E tests pass.
- [ ] Accessibility checks pass.
- [ ] Production build passes.

## Deployment

- [ ] Pull requests receive CI checks.
- [ ] Pull requests receive Preview Deployments.
- [ ] `main` triggers Production Deployment.
- [ ] Production is manually verified.
- [ ] Rollback is documented.

## Scope

- [ ] No CMS.
- [ ] No database.
- [ ] No contact form.
- [ ] No unnecessary state library.
- [ ] No large UI library.
- [ ] No animation framework.
- [ ] Docker does not block launch.

---

# 32. Open Technical Decisions

The following decisions may be finalized during implementation without changing product behavior:

1. Exact stable Next.js patch version
2. Exact stable Tailwind CSS patch version
3. Inter versus Geist versus system font stack
4. Whether to use a small class-name helper
5. Whether Lighthouse runs in every pull request or only release audit
6. Exact production domain or Vercel subdomain
7. Whether a strict Content Security Policy is ready for Version 1
8. Exact Docker base image after launch
9. Public repository license

Any choice must preserve the requirements in this document.

---

# 33. Technical Design Review

## 33.1 Requirement coverage

- PRD routes are implemented.
- FAC flows have technical support.
- NFAC quality gates have verification mechanisms.
- UX/UI components and responsive behavior have implementation boundaries.

## 33.2 Complexity review

The design deliberately avoids:

- Runtime data services
- Unused abstractions
- CMS complexity
- Production server administration
- Broad client-side state
- Excessive dependencies

## 33.3 Security review

- Private evidence remains outside the public repository.
- Publication status is not treated as repository privacy.
- Content validation blocks unsafe states.
- No visitor data is collected.

## 33.4 Future migration review

Selector and domain boundaries allow a later CMS or API migration without requiring Version 1 to imitate infrastructure it does not use.

---

# 34. Approval

This Technical Design Specification is ready for Product Owner review.

After approval, the next artifact is the detailed Implementation Plan for Claude or Codex.
