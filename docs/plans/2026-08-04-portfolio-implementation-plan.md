# Implementation Plan — Randi Fajar Wicaksono Developer Portfolio

## Document Information

- **Product Name:** Randi Fajar Wicaksono Developer Portfolio
- **Document Type:** Implementation Plan
- **Version:** 1.0
- **Status:** Draft for Product Owner Review
- **Product Owner:** Randi Fajar Wicaksono
- **Planning Agent:** Claude
- **Date:** 2026-08-04
- **Source Documents:** Decision Ledger v1.0, PRD v0.1, FAC v0.1, NFAC v0.1, UX/UI Specification
  v0.1, Technical Design v0.1, Product Model v1.0

---

# Context

The repository holds seven approved specifications and a Git-governance package, but no
application. Everything from `package.json` upward must be built. This plan converts the approved
PRD, FAC, NFAC, UX/UI Specification, and Technical Design into an ordered, executable sequence of
33 phases, each ending at a reviewable commit boundary.

It exists because the Handoff (§1) requires a plan another engineering agent can execute without
inventing file paths, validation rules, test expectations, or success conditions — and because the
Technical Design defers several decisions ("current stable release at project initialization") that
must be resolved against reality before work starts. Those versions are verified against the npm
registry and recorded in section 4.

The intended outcome is a public, accessible, statically generated portfolio on Vercel that
positions Randi as a Backend-Focused Full-Stack Developer, launches with two truthful published
case studies, and cannot publish Draft, Private, or Restricted content.

---

# 1. Executive Summary

**Current repository state.** Documentation-only. `production` holds 12 specification documents. No
`package.json`, no `src/`, no configuration, no `.gitignore`, no workflows, no `node_modules`. Node
24.18.0 and npm 11.17.0 are installed and match the approved runtime.

**Recommended approach.** Build bottom-up in dependency order: runtime and tooling first, then the
domain and content layer with tests written before implementation, then presentation, then routes,
then automation and deployment. No page is built before the schemas, validation, and selectors it
depends on exist. Content ships as safe Draft placeholders throughout, so development is never
blocked on final copy, and release validation is what refuses to launch with placeholders.

**Phase sequence.**

| Stage | Phases | Outcome |
|---|---|---|
| A — Foundation | P01–P04 | Runtime pinned, app scaffolded, lint/format/test harness green |
| B — Domain | P05–P11 | Tokens, schemas, content, validation, selectors — all test-driven |
| C — Presentation | P12–P19 | UI primitives, layout chrome, seven homepage sections |
| D — Routes | P20–P23 | Projects Index, Project Detail, Resume, Not Found, metadata, sitemap |
| E — Quality | P24–P26 | Coverage closure, E2E, accessibility, cross-browser |
| F — Delivery | P27–P29 | GitHub Actions, Vercel, release audit |
| G — Launch | P30–P32 | Content finalization, production verification, rollback drill |
| H — Post-launch | P33 | Docker portability |

No time estimates are given, per Handoff §8.1.

**Main risks.** TypeScript 7 is a compiler rewrite and may not yet be supported by
typescript-eslint or the Next type plugin (P02 gates this). Tailwind v4 configures through CSS
rather than a JS config, so older guidance does not apply. Release validation is the only thing
preventing placeholder content from shipping, so P10 must be genuinely strict.

**Readiness.** Ready to implement. No specification conflict blocks the start.

---

# 2. Flow

Five flows govern this project. Every phase in section 8 serves one of them.

## 2.1 Content flow — author to visitor

```text
Typed TypeScript content module          src/content/*.ts
  authored by Randi, reviewed for truth and confidentiality
        │
        ▼
defineProject() / defineProfile() …      src/domain/content/define.ts
  Zod parses at module load. Invalid shape throws immediately,
  so a malformed record fails the build rather than reaching a page.
        │
        ▼
Cross-record validation                  src/domain/content/validation.ts
  Rules no single record can enforce: unique slugs, valid references,
  exactly one active Resume, no Published Restricted content.
        │
        ▼
Selector layer                           src/domain/content/selectors.ts
  The ONLY way pages read content. Filters to publicationStatus === "published"
  AND confidentialityClass ∈ {public, sanitized}, then applies approved ordering.
        │
        ▼
Server Components                        src/app/**, src/components/**
  Receive already-filtered view data. No component filters content itself.
        │
        ▼
Static HTML at build time                Vercel
```

The critical property: **a page cannot accidentally render unpublished content, because a page
never touches raw content arrays.** Draft, Archived, Private, and Restricted records are removed by
the selector before any component sees them (FAC-PUBLISH-001, FAC-PUBLISH-002, NFAC-SEC-006).

## 2.2 Build flow

```text
npm run build
  → Next.js compiles Server Components
  → src/content/*.ts imported → Zod parses every record
  → generateStaticParams() asks getPublishedProjects() for slugs
  → one static HTML page emitted per Published project ONLY
  → dynamicParams = false, so any other slug returns 404 without executing code
  → sitemap.ts and robots.ts emit from the same selectors
```

Unpublished projects have no route, no sitemap entry, and no metadata. Their absence — not a
runtime check — is what hides them (FAC-NAV-006).

## 2.3 Request flow — public visitor

```text
GET /                    → static HTML, Server Components, minimal JS
GET /projects            → static HTML, all Published cards
GET /projects/[slug]     → prerendered if Published; otherwise not-found.tsx
GET /resume.pdf          → static asset from public/
GET /anything-else       → not-found.tsx
```

Only one interactive island ships JavaScript: `MobileNavigation`. Unknown, Draft, Archived, and
Restricted slugs all produce the identical Not Found response, so the response never reveals
whether private content exists (DEC-047, FAC-NAV-006).

## 2.4 Publishing and delivery flow

```text
Randi edits content or Claude implements a phase
        ↓
git switch -c feat/<scope>        short-lived task branch, one objective
        ↓
npm run check                     format · lint · typecheck · validate:content · tests · build
        ↓
git push -u origin feat/<scope>
        ↓
Pull request → production         .github/pull_request_template.md
        ↓
GitHub Actions                    required checks: quality, e2e
Vercel                            Preview Deployment on the pull request
        ↓
Randi reviews the preview and approves the merge   ← Claude stops here, always
        ↓
Squash merge → production
        ↓
Vercel Production Deployment (automatic)
        ↓
Manual production verification    deployment success alone is NOT acceptance
```

`production` is the only long-lived branch. Claude never merges without explicit per-pull-request
approval (`CLAUDE.md`, `docs/governance/git-workflow.md` §11).

## 2.5 Per-phase execution flow

Every phase in section 8 runs this loop. It is the Handoff §7.4 sequence.

```text
1. Read the FAC/NFAC IDs the phase claims to satisfy
2. Write the failing test that expresses that behavior
3. Run it — confirm it fails for the right reason
4. Implement the smallest change that passes
5. Run the focused test
6. Run npm run check
7. Refactor with tests green
8. Commit at the stated boundary
```

Tests are written before implementation for every phase in Stage B and for every reusable component
in Stage C. Route-level behavior is proven by E2E in Stage E. Tests are never added ceremonially
after the fact.

---

# 3. Repository Assessment

**Existing files.** `README.md` (placeholder), 7 specifications in `docs/product/`, 3 references in
`docs/reference/`, `docs/handoff/CLAUDE_HANDOFF.md`, `CLAUDE.md`, the workflow skill under
`.claude/skills/following-git-workflow/`, three governance documents in `docs/governance/`,
`.github/pull_request_template.md`, `.github/dependabot.yml`.

**Existing configuration.** None. **Existing dependencies.** None. **Existing tests.** None.
**Existing automation.** `dependabot.yml` only. **Existing deployment config.** None.

**Missing prerequisites — every one is created by this plan.**

| Missing | Created in |
|---|---|
| `.gitignore`, `.nvmrc`, `.node-version`, `.env.example`, `LICENSE` | P01 |
| `package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs` | P02 |
| `eslint.config.mjs`, `prettier.config.mjs` | P03 |
| `vitest.config.ts`, `playwright.config.ts` | P04 |
| `src/`, `public/`, `scripts/`, `tests/`, `e2e/` | P02 onward |
| `.github/workflows/ci.yml`, `release-audit.yml` | P27 |

**Differences from the Technical Design.** Only one of substance: TD §8 shows the project root as
`portfolio/`; the real directory is `developer-portfolio/`, matching the GitHub repository name. The
Git boundary rule (TD §7.2) is satisfied — `preparation/` and `planning/` sit outside the
repository. Both are currently empty, which affects content readiness in P30, not build readiness.

**Technical debt affecting this project.** None. The repository has no code to carry debt.

---

# 4. Source-Document Summary

**Product goal.** Help Randi secure a job as a Backend-Focused Full-Stack Developer, and become the
foundation of his long-term personal brand (DEC-001, DEC-002, DEC-003).

**Version 1 scope.** Public read-only site. Professional identity with photograph, work experience,
at least two complete project case studies, technical skills, an AI-assisted engineering section,
CV access, and email/LinkedIn/GitHub links. Responsive, accessible, SEO-ready, automatically
validated and deployed, with production verification.

**Non-goals.** No authentication, admin dashboard, CMS, database, backend API, contact form,
newsletter, comments, project filtering or search, multiple languages, blog, testimonials, live
LinkedIn/GitHub sync, self-managed infrastructure, mandatory Docker, theme switcher, or complex
animation (PRD §1.6, TD §3).

**Required routes.** `/`, `/projects`, `/projects/[slug]`, `/resume.pdf`, Not Found (DEC-024).

**Required homepage sections, in order.** Navigation, Hero, About, Selected Projects, Work
Experience, Technical Skills, AI-Assisted Engineering, Contact, Footer (DEC-025).

**Required user flows.** Recruiter scan; Hiring Manager evaluation; Technical Interviewer deep read
entering directly on a Project Detail URL; Professional Contact; Portfolio Owner publishing
(PRD §4.2–4.6).

**Key FAC requirements.** Publication filtering (FAC-PUBLISH-001/002); truthful delivery status,
with `Production` only when actually deployed (FAC-PROJECT-004, FAC-PUBLISH-004); personal versus
team responsibility separated (FAC-PROJECT-003); no percentage skill scores (FAC-SKILL-003); exactly
one active Resume (FAC-RESUME-001/004); identical Not Found for unknown and unavailable routes
(FAC-NAV-006); launch valid with exactly two projects and no filler card (FAC-HOME-004).

**Key NFAC requirements.** LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms (NFAC-PERF-001); WCAG 2.2 AA
(NFAC-A11Y-001); usable from 320 CSS pixels (NFAC-RESP-001); no secrets or confidential company data
in repository or output (NFAC-SEC-001/002); non-public routes absent from navigation, indexes, and
metadata (NFAC-SEC-006); deterministic builds (NFAC-REL-004); every quality command exits non-zero
on failure (NFAC-TEST-001); production verified after deploy (NFAC-CICD-004); rollback possible
(NFAC-REC-002); no `TODO`/`TBD`/`Lorem ipsum`/fake metrics in production (NFAC-CONTENT-004).

**UX direction.** "Quiet Engineering" — light-first single theme, neutral slate, one restrained blue
accent (`#2563EB`), border-led cards with minimal shadow, 8-point spacing, editorial typography,
limited animation, left-aligned long-form content. No theme switcher, no auto-typing hero, no
particle systems (UX §4, §21).

**Technical boundaries.** Next.js App Router, Server Components by default, static generation, no
`output: export`, no runtime API, no database, Client Components only at the smallest interaction
boundary (TD §4.3, ADR-007, ADR-008).

---

# 5. Confirmed Technical Assumptions

Every assumption has a source. Versions were verified against the npm registry on 2026-08-04.

| Assumption | Value | Source |
|---|---|---|
| Node.js | 24.18.0 installed; `.nvmrc` = `24` | TD §5.1, ADR-002; verified locally |
| Package manager | npm 11.17.0, `package-lock.json` committed | TD §5.1; verified locally |
| Framework | `next@16.2.12` (engines `node >=20.9.0`) | TD §5.2; registry |
| UI library | `react@19.2.8`, `react-dom@19.2.8` | TD §5.2; Next 16 peer range `^19.0.0` |
| Language | `typescript@7.0.2`, gated in P02 | TD §20; Product Owner decision |
| Styling | `tailwindcss@4.3.3`, `@tailwindcss/postcss@4.3.3` | TD §5.3; registry |
| Validation | `zod@4.4.3` | TD §5.4; registry |
| Rich text | `react-markdown@10.1.0`, `remark-gfm@4.0.1`, raw HTML disabled | TD §5.5 |
| Unit tests | `vitest@4.1.10`, `@vitest/coverage-v8@4.1.10`, `jsdom@30.0.1` | TD §5.6 |
| Component tests | `@testing-library/react@16.3.2`, `jest-dom@7.0.0`, `user-event@14.6.1` | TD §5.6 |
| E2E | `@playwright/test@1.62.1` | TD §5.6 |
| Accessibility | `@axe-core/playwright@4.12.1` | TD §5.6 |
| Lint | `eslint@10.8.0`, `eslint-config-next@16.2.12`, `eslint-config-prettier@10.1.8` | TD §5.7 |
| Format | `prettier@3.9.6` | TD §5.7 |
| Script runner | `tsx@4.23.5` for `scripts/*.ts` | TD §19 |
| Production branch | `production` | Product Owner, 2026-08-04; governance |
| Hosting | Vercel Git integration; Preview on branches, Production on `production` | ADR-009 |
| License | MIT | Product Owner decision; TD §29 item 17 |
| Site URL | `SITE_URL`, localhost fallback in dev, required by release validation | TD §12.2, §21 |
| Analytics | None in Version 1 | NFAC-PRIV-003 (unresolved ⇒ disabled) |
| Domain | Vercel subdomain at launch; custom domain deferred | OPEN-007 |
| Font | Geist via `next/font` | TD §32 item 3; UX §4.6 |
| Lighthouse | Release audit only, not per pull request | TD §32 item 5, §23.4 |
| CSP | Baseline security headers only; strict CSP deferred | TD §22.3, §32 item 7 |
| Docker | Post-launch, must not block launch | ADR-010, DEC-042 |

---

# 6. Conflicts and Risks

| ID | Description | Source conflict | Impact | Recommended resolution | Blocks? |
|---|---|---|---|---|---|
| C-01 | Handoff §9 lists "Unit tests" and "Component tests" as phases 26–27, after all implementation | Handoff §9 vs Handoff §7.4 ("Do not add ceremonial tests after all implementation is finished") | Following §9 literally produces exactly the anti-pattern §7.4 forbids | §7.4 wins — it is a principle, and §9 permits reordering. Tests are written first inside P06–P19; P24 closes measured gaps only | No |
| C-02 | TypeScript 7.0.2 is a ground-up native compiler rewrite | New major vs ecosystem readiness | If typescript-eslint or the Next type plugin lags, `lint` or `typecheck` breaks | P02 gates on `tsc --noEmit` and `npm run lint` before any application code exists. Falling back to 5.9.3 is then a one-line change | No |
| C-03 | Tailwind v4 configures through CSS `@theme`, not `tailwind.config.js` | TD §14.2 says tokens live in `globals.css` — correct for v4, but most published guidance targets v3 | An implementer following v3 habits creates a config file Tailwind v4 ignores | P05 defines tokens with `@theme` in `globals.css`. No `tailwind.config.js` is created | No |
| C-04 | `docs/reference/PORTFOLIO_5_THINGS.md` §6.3 records the MVP structure as an unresolved question | 5 Things vs Decision Ledger SUP-001 | Could reopen a settled page inventory | Decision Ledger wins (precedence 2 vs 8). The five-route structure is approved | No |
| C-05 | TD §23.3 describes branch protection loosely; `github-configuration.md` §4 defines the authoritative ruleset | Technical Design vs governance | Two descriptions of one setting | Governance is authoritative for repository settings. P27 references it rather than restating | No |
| R-01 | Release validation is the only barrier between Draft placeholders and production | ADR-006 | A weak `validate:release` ships `Lorem ipsum` to a recruiter | P10 is test-driven with explicit failing cases per rule. It must fail the build, not warn | No |
| R-02 | `preparation/` and `planning/` are empty — no CV, photograph, or evidence staged | Repository state | P30 cannot complete without real content | Content is an input, not a build dependency. P01–P29 run on Draft placeholders | No |
| R-03 | No `.gitignore` exists and `npm install` runs in P02 | Repository state | `node_modules/` or a future `.env` could be staged | `.gitignore` is created in P01, **before** any install | No |
| R-04 | Lighthouse ≥ 90 (NFAC-PERF-002, P1) may not be met with a large hero photograph | NFAC vs content | Launch quality gate misses | P23 and P29 measure. NFAC-PERF-002 permits a documented exception with Product Owner approval | No |

---

# 7. Dependency Graph

```text
P01 Repository foundation ── .gitignore, .nvmrc, .node-version, .env.example, LICENSE
        │
        ▼
P02 Next.js + React + TypeScript + Tailwind scaffold ──┐ (TypeScript gate)
        │                                              │
        ▼                                              │
P03 ESLint + Prettier + check pipeline                 │
        │                                              │
        ▼                                              │
P04 Vitest + Playwright harness ←──────────────────────┘
        │
        ├──────────────────────────────┐
        ▼                              ▼
P05 Design tokens + layout shell    P06 Domain enums, types, Zod schemas
        │                              │
        │                              ▼
        │                           P07 Content definition helpers
        │                              │
        │                              ▼
        │                           P08 Safe Draft content modules
        │                              │
        │                              ▼
        │                           P09 Structural content validation
        │                              │
        │                              ▼
        │                           P10 Release content validation
        │                              │
        │                              ▼
        │                           P11 Content selector layer
        │                              │
        └──────────────┬───────────────┘
                       ▼
                P12 Reusable UI primitives
                       │
                       ▼
                P13 Header, mobile navigation, Footer
                       │
        ┌──────────────┼──────────────┬──────────────┬──────────────┬──────────────┐
        ▼              ▼              ▼              ▼              ▼              ▼
      P14 Hero       P15 Selected   P16 Work       P17 Technical  P18 AI-        P19 Contact
      + About        Projects       Experience     Skills         Assisted       section
        └──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
                       │
                       ▼
                P20 Projects Index ──▶ P21 Project Detail ──▶ P22 Resume + Not Found
                       │
                       ▼
                P23 Metadata, OG image, sitemap, robots
                       │
                       ▼
                P24 Coverage closure ──▶ P25 E2E + accessibility ──▶ P26 Cross-browser
                       │
                       ▼
                P27 GitHub Actions ──▶ P28 Vercel Preview + Production ──▶ P29 Release audit
                       │
                       ▼
                P30 Content finalization ──▶ P31 Production verification ──▶ P32 Rollback drill
                       │
                       ▼
                P33 Docker (post-launch)
```

P14–P19 depend only on P13 and the selectors, so they may be implemented in any order. Everything
else is strictly sequential.

---

# 8. Detailed Phases

Each phase is one task branch, one pull request, one squash commit. Every phase ends with
`npm run check` passing and the confidentiality gate reviewed.

## Stage A — Foundation

### P01 — Repository foundation and Node runtime

**Goal.** Pin the runtime and make the repository safe to install into.
**Depends on.** Nothing.
**Branch.** `chore/repository-foundation`

**Creates.** `.gitignore`, `.nvmrc`, `.node-version`, `.env.example`, `LICENSE`

**Steps.**
1. `.gitignore` — `node_modules/`, `.next/`, `out/`, `build/`, `coverage/`, `.env*` (negating
   `!.env.example`), `playwright-report/`, `test-results/`, `.vercel/`, `*.tsbuildinfo`, `.DS_Store`.
2. `.nvmrc` containing `24`.
3. `.node-version` containing `24.18.0`.
4. `.env.example` containing `SITE_URL=http://localhost:3000`.
5. `LICENSE` — MIT, copyright `2026 Randi Fajar Wicaksono`.

**Tests first.** None — no executable logic.
**Commands.** `git status --short` · `git check-ignore -v node_modules .env .next`
**Expected.** Five files tracked; `.gitignore` present before any install.
**FAC.** — **NFAC.** NFAC-SEC-001, NFAC-MAINT-004
**Risks.** Creating `.gitignore` after `npm install` would stage `node_modules/`. This phase exists
to prevent exactly that.
**Verification.** `git check-ignore` resolves all three paths.
**Commit.** `chore: add repository foundation and node runtime pinning`

---

### P02 — Next.js, React, TypeScript, and Tailwind scaffold

**Goal.** A building Next.js App Router application matching the TD §8 structure, with the
TypeScript decision verified.
**Depends on.** P01
**Branch.** `feat/application-scaffold`

**Creates.** `package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`,
`postcss.config.mjs`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
**Removes.** create-next-app boilerplate: default SVG assets in `public/`, demo markup in
`page.tsx`.

**Steps.**
1. Scaffold in place with `create-next-app@16.2.12`, using `--typescript --tailwind --eslint --app
   --src-dir --import-alias "@/*"`. Confirm flag names against `--help` first; flags change between
   majors.
2. Pin exact versions in `package.json` — no `^` ranges on `next`, `react`, `react-dom`,
   `typescript`, `tailwindcss`. NFAC-REL-004 requires deterministic builds.
3. Add `"engines": { "node": ">=24 <25" }`.
4. Add the full script set from TD §19 verbatim.
5. `tsconfig.json` — `strict: true`, `noUncheckedIndexedAccess: true`,
   `forceConsistentCasingInFileNames: true`, `noEmit: true`, path alias `@/*` → `src/*` (TD §20).
6. `next.config.ts` — no `output: export`. Add the TD §22.3 security headers:
   `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
   `X-Frame-Options: DENY`, restrictive `Permissions-Policy`. No CSP yet.
7. Create the TD §8 directory skeleton: `src/components/{layout,project,sections,ui}`,
   `src/content/projects`, `src/domain/{content,metadata,projects}`, `src/lib`, `scripts`,
   `tests/{components,content,domain}`, `e2e`, `public/images/{profile,projects,social}`,
   `public/icons`.
8. Strip the demo homepage to a minimal placeholder.

**TypeScript gate (C-02).** Immediately after install, before writing application code, run
`tsc --noEmit` and `npm run lint`. If either fails on tooling incompatibility rather than on project
code, change `typescript` to `5.9.3`, delete `node_modules` and `package-lock.json`, reinstall, and
record the fallback in the pull request. This is the cheapest possible moment.

**Tests first.** None — scaffolding.
**Commands.** `npm ci` · `npx tsc --noEmit` · `npm run lint` · `npm run build` · `npm run dev`
**Expected.** Build succeeds. `tsc --noEmit` exits 0. Dev server serves the placeholder.
**FAC.** — **NFAC.** NFAC-REL-004, NFAC-TEST-003
**Risks.** create-next-app may overwrite `README.md` and `.gitignore` — check both in the diff and
restore. Tailwind v4 needs no `tailwind.config.js` (C-03).
**Verification.** `git diff --stat` shows no unintended deletion under `docs/`.
**Commit.** `feat: scaffold next.js application with typescript and tailwind`

---

### P03 — ESLint, Prettier, and the check pipeline

**Goal.** One command, `npm run check`, that gates every pull request.
**Depends on.** P02
**Branch.** `chore/lint-and-format`

**Creates.** `prettier.config.mjs`, `.prettierignore`
**Modifies.** `eslint.config.mjs`, `package.json`

**Steps.**
1. `eslint.config.mjs` — flat config extending `eslint-config-next`, with `eslint-config-prettier`
   last so formatting rules do not conflict.
2. `prettier.config.mjs` — 2-space indent, semicolons, double quotes, 100-character width, trailing
   commas. Match whatever create-next-app produced to avoid a reformat-everything diff.
3. `.prettierignore` — `.next/`, `coverage/`, `node_modules/`, `package-lock.json`,
   `playwright-report/`.
4. Confirm `check` chains in the TD §19 order. `validate:content` and `test:run` will fail until P09
   and P04 — expected; the chain is completed then.

**Tests first.** None.
**Commands.** `npm run format` · `npm run format:check` · `npm run lint`
**Expected.** Both exit 0. Re-running `format` produces no diff.
**FAC.** — **NFAC.** NFAC-TEST-001
**Risks.** Prettier and ESLint fighting over the same rule — `eslint-config-prettier` must be last.
**Verification.** Introduce a deliberate formatting error, confirm non-zero exit, revert.
**Commit.** `chore: configure eslint and prettier`

---

### P04 — Vitest and Playwright harness

**Goal.** Make the test-first loop possible. Deliberately early — Handoff §9 lists tests late, but
§7.4 forbids ceremonial tests and every Stage B phase needs a working runner (C-01).
**Depends on.** P03
**Branch.** `test/configure-test-harness`

**Creates.** `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts`,
`tests/domain/smoke.test.ts`, `e2e/smoke.spec.ts`

**Steps.**
1. Install dev dependencies: `vitest`, `@vitest/coverage-v8`, `jsdom`, `@vitejs/plugin-react`,
   `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`,
   `@playwright/test`, `@axe-core/playwright`, `tsx`.
2. `vitest.config.ts` — `environment: "jsdom"`, `setupFiles: ["./vitest.setup.ts"]`, alias `@` →
   `src`, include `tests/**/*.test.{ts,tsx}`, coverage via v8.
3. `vitest.setup.ts` — `import "@testing-library/jest-dom/vitest"`.
4. `playwright.config.ts` — projects for Chromium, Firefox, WebKit (TD §18.5); `webServer` running
   the production build; HTML reporter; retries in CI only.
5. One trivial passing unit test and one E2E test asserting the homepage returns 200. These prove
   the harness and are replaced by real tests later.
6. `npx playwright install --with-deps chromium firefox webkit`.

**Tests first.** The smoke tests are the deliverable.
**Commands.** `npm run test:run` · `npm run test:e2e` · `npm run check`
**Expected.** Unit suite green. E2E green on all three browsers.
**FAC.** — **NFAC.** NFAC-TEST-001, NFAC-COMPAT-001
**Risks.** WebKit needs system libraries on Linux CI — `--with-deps` handles it in P27.
**Verification.** Break the smoke assertion, confirm non-zero exit, revert.
**Commit.** `test: configure vitest and playwright harness`

---

## Stage B — Domain and content

### P05 — Design tokens and global layout shell

**Goal.** Encode the "Quiet Engineering" direction as CSS custom properties, and build the layout
skeleton every page inherits.
**Depends on.** P04
**Branch.** `feat/design-tokens-and-layout`

**Creates.** `src/lib/constants.ts`
**Modifies.** `src/app/globals.css`, `src/app/layout.tsx`

**Steps.**
1. In `globals.css`, declare tokens inside Tailwind v4's `@theme` block (C-03) using the exact
   UX §4.4 palette: background `#F8FAFC`, surface `#FFFFFF`, surface-muted `#F1F5F9`, text-primary
   `#0F172A`, text-secondary `#475569`, text-muted `#64748B`, border `#CBD5E1`, accent `#2563EB`,
   accent-hover `#1D4ED8`, focus `#3B82F6`, success `#166534`, warning `#92400E`, neutral-status
   `#334155`, error `#B91C1C`.
2. Layout tokens: content width `1200px`, prose width `768px`, header height, and the 8-point
   spacing scale (UX §4.7).
3. Global base styles — body background and text colour, `1.6` line height, a visible
   `:focus-visible` ring using the focus token, and a `prefers-reduced-motion` block that disables
   transitions (NFAC-A11Y-006).
4. `layout.tsx` — `<html lang="en">`, Geist via `next/font`, a skip-to-content link as the first
   focusable element, `<main id="main-content">`, and slots for Header and Footer (TD §11.1).
5. `src/lib/constants.ts` — section anchor IDs (`experience`, `skills`, `ai-workflow`, `contact`)
   and the stable resume path `/resume.pdf`, so no string is duplicated across components.

**Tests first.** `tests/domain/constants.test.ts` — anchor IDs are unique and lowercase kebab-case.
**Commands.** `npm run check` · `npm run dev`
**Expected.** Placeholder page renders with the token palette. Tab from page load reveals the skip
link. Anchor targets are not hidden behind the sticky header (UX §6.3).
**FAC.** FAC-NAV-002 **NFAC.** NFAC-A11Y-002/003/005/006, NFAC-RESP-001
**Risks.** Tailwind v4 `@theme` syntax differs from v3 `theme.extend` — verify a token generates a
utility before building on it.
**Verification.** Browser at 320px: no horizontal scroll. Keyboard: skip link is the first stop.
**Commit.** `feat: add design tokens and global layout shell`

---

### P06 — Domain enums, types, and Zod schemas

**Goal.** One authoritative definition of every content shape. Nothing downstream may redefine
these.
**Depends on.** P04
**Branch.** `feat/domain-schemas`

**Creates.** `src/domain/content/types.ts`, `src/domain/content/schemas.ts`,
`src/domain/projects/delivery-status.ts`, `tests/domain/schemas.test.ts`,
`tests/domain/delivery-status.test.ts`

**Steps.**
1. `types.ts` — the four enums exactly as TD §9.1 specifies, in machine-readable kebab-case:
   `PublicationStatus` (`draft` | `published` | `archived`), `ProjectDeliveryStatus` (seven values),
   `ConfidentialityClassification` (four values), `SkillClassification` (three values).
2. `delivery-status.ts` — the single mapping from enum value to human label, badge treatment
   (UX §4.5), and accessible description. Components must never invent an alternative label.
3. `schemas.ts` — Zod schemas for `ProfessionalProfile`, `WorkExperience`, `ProjectCaseStudy`,
   `TechnicalSkill`, `AIAssistedEngineeringPractice`, `Resume`, `ContactChannel`,
   `ExternalProfessionalProfile`, `MediaAsset`, using the exact field names and optionality from
   PRD §7 and TD §9.2.
4. Encode record-local rules directly in Zod: `endDate` required when `isCurrent` is false and not
   before `startDate` (FAC-EXP-002); `deliveryStatus === "production"` requires
   `productionConfirmation.verified === true` (TD §9.5, FAC-PROJECT-004); external URLs must be
   `https:` and email must be `mailto:` (NFAC-SEC-003); resume path must end `.pdf`.

**Tests first.** Nine cases before any schema is written: valid project parses; missing required
section rejected; invalid delivery status rejected; `production` without confirmation rejected;
`endDate` before `startDate` rejected; non-current role without `endDate` rejected; `http:` external
URL rejected; non-PDF resume path rejected; every enum value has exactly one unique label.

**Commands.** `npm run test:run -- tests/domain` · `npm run check`
**Expected.** All nine fail first, then pass. No page or component imports these yet.
**FAC.** FAC-EXP-002, FAC-PROJECT-004, FAC-SKILL-002, FAC-PUBLISH-004, FAC-RESUME-001
**NFAC.** NFAC-MAINT-001/002, NFAC-SEC-003
**Risks.** Zod 4 differs from Zod 3 in error formatting and some method names — verify against the
installed version, not from memory.
**Verification.** Each case fails for the intended reason before implementation.
**Commit.** `feat: add domain enums, types, and content schemas`

---

### P07 — Content definition helpers

**Goal.** Make it impossible to author a structurally invalid content module — failure happens at
import, not at render.
**Depends on.** P06
**Branch.** `feat/content-definition-helpers`

**Creates.** `src/domain/content/define.ts`, `tests/content/define.test.ts`

**Steps.**
1. Export `defineProfile`, `defineExperience`, `defineProject`, `defineSkill`, `defineAIPractice`,
   `defineResume`, `defineContactChannel`, `defineExternalProfile`, `defineMediaAsset`.
2. Each parses its input with the P06 schema and returns the typed, validated value.
3. On failure, throw immediately with content type, record identifier, field path, and a clear
   message (TD §17.5). A silently omitted invalid record is forbidden.

**Tests first.** Valid data returns typed data; a missing required field throws; the thrown message
names the record id and the field path.
**Commands.** `npm run test:run -- tests/content` · `npm run check`
**Expected.** Importing a malformed module fails the build with a readable error.
**FAC.** FAC-PROJECT-005, FAC-OWNER-001 **NFAC.** NFAC-MAINT-002
**Risks.** Throwing at module scope means one bad record fails the whole build. That is the intended
design (ADR-005).
**Verification.** Corrupt a fixture temporarily; confirm `npm run build` fails naming the field.
**Commit.** `feat: add content definition helpers`

---

### P08 — Safe Draft content modules

**Goal.** Populate every content type with structurally valid, public-repository-safe Draft
placeholders so all later phases have real data to render.
**Depends on.** P07
**Branch.** `feat/draft-content-modules`

**Creates.** `src/content/site.ts`, `profile.ts`, `experience.ts`, `skills.ts`, `ai-practices.ts`,
`resume.ts`, `contact.ts`, `media.ts`, `projects/index.ts`,
`projects/personal-developer-portfolio.ts`, `projects/jury-process-management.ts`

**Steps.**
1. `site.ts` — site name, title template, default description, owner name, locale, and the approved
   public links: `https://www.linkedin.com/in/randifajar`, `https://github.com/randifajar`,
   `randifajar2307@gmail.com` (DEC-014/015/016, FAC-CONTACT-001/003/004).
2. `profile.ts` — `publicationStatus: "draft"`, real name/location/target roles, placeholder
   headline and summary clearly marked as Draft.
3. `experience.ts` — sanitized entries with `confidentialityClass: "sanitized"`, exact dates,
   `isCurrent` set truthfully.
4. `projects/personal-developer-portfolio.ts` — `projectType: "personal"`,
   `deliveryStatus: "in-development"`, `publicationStatus: "draft"`, all required sections present
   as honest placeholders.
5. `projects/jury-process-management.ts` — `projectType: "professional"`,
   `confidentialityClass: "sanitized"`, with a `confidentialityNote`. **No internal identifiers, no
   partner-system names, no internal URLs.**
6. `skills.ts`, `ai-practices.ts`, `contact.ts`, `media.ts`, `resume.ts` — Draft placeholders with
   valid shape.
7. `projects/index.ts` — the single registry array both selectors and validation read.

**Placeholder rules (Handoff §11).** Clearly marked in source; structurally valid; safe if read
directly on GitHub; no company secrets; no fake production results; no invented metrics; and they
must fail release validation.

**Tests first.** Every module parses; every id is unique; every slug is unique; no project is
simultaneously Draft and Published-featured.
**Commands.** `npm run test:run` · `npm run check`
**Expected.** All modules import cleanly. Nothing is Published yet, so public routes render empty
states — correct at this stage.
**FAC.** FAC-OWNER-001, FAC-PUBLISH-001 **NFAC.** NFAC-SEC-002, NFAC-CONTENT-004
**Risks.** Placeholder text leaking to production. P10 and P29 are the defences.
**Verification.** Grep `src/content/` for `lorem`, `TODO`, `TBD`, and any internal identifier
pattern — only deliberate, marked Draft markers appear.
**Commit.** `feat: add safe draft content modules`

---

### P09 — Structural content validation

**Goal.** Enforce the cross-record rules no single schema can express. Runs on every pull request.
**Depends on.** P08
**Branch.** `feat/structural-content-validation`

**Creates.** `src/domain/content/validation.ts`, `scripts/validate-content.ts`,
`tests/content/validation.test.ts`

**Steps.** Implement all fifteen TD §9.4 rules: unique ids per type; unique project slugs; valid
technology references; valid media references; valid project references; exactly one active
Published Resume; exactly one active Published Profile; no Restricted content Published; no Private
content Published; Published projects have every required section; featured projects are Published;
`featuredPriority` values do not collide; `production` status carries explicit confirmation;
external URLs use allowed protocols; resume path is a PDF; public media paths are local and safe.
`scripts/validate-content.ts` runs them, prints every violation rather than only the first, and
exits non-zero on any.

**Tests first.** One failing case per rule — fifteen tests — before the implementation.
**Commands.** `npm run validate:content` · `npm run check`
**Expected.** Passes on the P08 Draft content. `npm run check` completes end to end for the first
time.
**FAC.** FAC-PROFILE-004, FAC-EXP-003, FAC-PROJECT-005, FAC-RESUME-004, FAC-PUBLISH-002/003
**NFAC.** NFAC-MAINT-002, NFAC-SEC-006, NFAC-TEST-001
**Risks.** Reporting only the first error makes fixing content tedious — collect and report all.
**Verification.** Introduce a duplicate slug; confirm exit 1 and a message naming both records.
**Commit.** `feat: add structural content validation`

---

### P10 — Release content validation

**Goal.** A second, stricter gate that Draft placeholders cannot pass. This is what makes it safe to
develop with placeholders at all (ADR-006).
**Depends on.** P09
**Branch.** `feat/release-content-validation`

**Creates.** `scripts/validate-release.ts`, `tests/content/release-validation.test.ts`

**Steps.** In addition to every structural rule, require: at least two Published projects; the
Personal Developer Portfolio Published; the Jury Process Management Integration Published; exactly
one active Published Resume; **no placeholder text anywhere in Published content** —
case-insensitive `TODO`, `TBD`, `Lorem ipsum`, `PLACEHOLDER`, `FIXME`, `XXX`; `SITE_URL` present and
an absolute HTTPS URL; required social metadata present; all required public links present.

**Tests first.** Prove it **fails** on the current Draft content — the phase's central assertion.
Then one failing case per additional rule, plus a passing case against a fully-populated fixture.
**Commands.** `npm run validate:release` · `npm run test:run -- tests/content`
**Expected.** Exits **non-zero** today, listing exactly why the site is not launch-ready. It must not
pass until P30.
**FAC.** FAC-HOME-004, FAC-PROJECTS-004, FAC-RESUME-001, launch criteria in FAC §15
**NFAC.** NFAC-CONTENT-004, NFAC-SEO-001, NFAC-TEST-004
**Risks.** A weak placeholder scan is the single largest content risk (R-01). Scan rendered string
fields, not just top-level keys.
**Verification.** `npm run release:check` fails, and the message would tell a stranger exactly what
is missing.
**Commit.** `feat: add release content validation`

---

### P11 — Content selector layer

**Goal.** The single boundary between raw content and pages. After this phase, no component may
import `src/content/` directly.
**Depends on.** P10
**Branch.** `feat/content-selectors`

**Creates.** `src/domain/content/selectors.ts`, `src/domain/projects/project-navigation.ts`,
`tests/domain/selectors.test.ts`, `tests/domain/project-navigation.test.ts`

**Steps.** Implement the eleven TD §10 selectors: `getPublishedProfile`, `getPublishedExperience`,
`getPublishedProjects`, `getFeaturedProjects(limit?)`, `getPublishedProjectBySlug`,
`getAdjacentPublishedProjects`, `getPublishedSkillGroups`, `getPublishedAIPractices`,
`getActiveResume`, `getPublishedContactChannels`, `getPublishedExternalProfiles`.

Every selector applies the same eligibility filter — `publicationStatus === "published"` **and**
`confidentialityClass ∈ {public, sanitized}` — then approved ordering (featured priority, then
recency, then remaining). `getPublishedProjectBySlug` returns `null` for anything ineligible so the
route can call `notFound()`. Ordering is stable; results are read-only.

**Tests first.** Draft excluded; Archived excluded; Private excluded; Restricted excluded; unknown
slug returns `null`; Draft slug returns `null` — **identical** to unknown; featured ordering respects
priority; `getFeaturedProjects(2)` returns two when three are Published; adjacent navigation is
`null` at both ends and never points at an unpublished neighbour; empty skill groups are omitted.

**Commands.** `npm run test:run -- tests/domain` · `npm run check`
**Expected.** Selectors return only eligible content under every fixture.
**FAC.** FAC-HOME-003/005, FAC-PROJECTS-001/003, FAC-PROJECT-001/008, FAC-NAV-006,
FAC-PUBLISH-001/002
**NFAC.** NFAC-SEC-006, NFAC-MAINT-003, NFAC-TEST-002
**Risks.** A page bypassing a selector reintroduces every leakage risk. P24 adds a lint rule
forbidding `src/content` imports outside `src/domain`.
**Verification.** The Draft-slug and unknown-slug tests assert the *same* return value.
**Commit.** `feat: add content selector layer`

---

## Stage C — Presentation

### P12 — Reusable UI primitives

**Goal.** The six primitives every section composes from (TD §13.2).
**Depends on.** P05, P11
**Branch.** `feat/ui-primitives`

**Creates.** `src/components/ui/{button-link,external-link,status-badge,technology-tag,section-header,markdown-content}.tsx`
and a matching test file per component under `tests/components/`.

**Steps.**
1. `ButtonLink` — `href`, variant (primary/secondary/text), external flag, accessible label,
   optional icon.
2. `ExternalLink` — `target="_blank"` with `rel="noopener noreferrer"`, an understandable accessible
   name; the icon is never the only external indicator (TD §15.3, NFAC-SEC-003).
3. `StatusBadge` — accepts only a valid `ProjectDeliveryStatus`; renders the P06 label, treatment,
   and accessible description. Never colour alone (UX §4.5).
4. `TechnologyTag` — canonical skill name as readable text, never a bare logo.
5. `SectionHeader` — eyebrow, heading, optional description, with a configurable heading level so
   hierarchy stays valid.
6. `MarkdownContent` — `react-markdown` + `remark-gfm`, **raw HTML disabled**, styled headings and
   lists, safe links, constrained prose width.

**Tests first.** Status badge renders approved text for all seven statuses; external link has both
`rel` tokens; button link exposes an accessible name; markdown renders `**bold**` but does **not**
render an injected `<script>` or `<img onerror>`; technology tag renders its label.

**Commands.** `npm run test:run -- tests/components` · `npm run check`
**Expected.** All primitives pass; the raw-HTML rejection test is the security-critical one.
**FAC.** FAC-PROJECT-004, FAC-SKILL-003, FAC-CONTACT-003/004
**NFAC.** NFAC-A11Y-003/004/005, NFAC-SEC-003
**Risks.** Enabling `rehype-raw` for convenience would open an injection path. It stays disabled.
**Verification.** The injection test asserts the script tag appears as escaped text, not an element.
**Commit.** `feat: add reusable ui primitives`

---

### P13 — Header, mobile navigation, and Footer

**Goal.** The shared chrome, with the project's only Client Component.
**Depends on.** P12
**Branch.** `feat/layout-chrome`

**Creates.** `src/components/layout/{header,mobile-navigation,footer}.tsx`, tests for each
**Modifies.** `src/app/layout.tsx`

**Steps.**
1. `Header` stays a **Server Component** composing the interactive boundary (TD §13.4). Desktop
   links: Home, Projects, Experience, Skills, AI Workflow, Contact, plus the Resume action (UX §6.1).
2. `MobileNavigation` is `"use client"` — the only one. Requirements from UX §6.2 and TD §15.2:
   `aria-expanded` on the trigger, an accessible label on the menu, Escape closes, selecting a link
   closes, focus is managed, background scroll is controlled.
3. `Footer` — name, current year, email, LinkedIn, GitHub, back-to-top. Compact.
4. Wire both into `layout.tsx` around `<main>`.

**Tests first.** `aria-expanded` toggles `false`→`true`; Escape closes; selecting a link closes; all
seven nav labels present; footer renders the three approved external links.
**Commands.** `npm run test:run -- tests/components` · `npm run dev`
**Expected.** Keyboard-only operation works end to end at 320px and at desktop width.
**FAC.** FAC-NAV-001/002/003, FAC-CONTACT-003/004
**NFAC.** NFAC-A11Y-002/003, NFAC-RESP-002/004
**Risks.** Marking `Header` as a Client Component would pull the whole tree client-side. Keep
`"use client"` on `MobileNavigation` alone.
**Verification.** `Tab` reaches every action; `Escape` closes the menu; nothing is mouse-only.
**Commit.** `feat: add header, mobile navigation, and footer`

---

### P14–P19 — Homepage sections

Six phases sharing one pattern, listed separately because each is its own commit boundary. Each
creates `src/components/sections/<name>-section.tsx` plus `tests/components/<name>-section.test.tsx`,
and modifies `src/app/page.tsx` to compose it in the DEC-025 order.

**Shared pattern for every section phase.**
- Server Component. Receives data from a P11 selector — never imports `src/content` directly.
- Wrapped in `<section id="…">` using an id from `src/lib/constants.ts` where it is an anchor target.
- Renders nothing when its selector returns empty, rather than an empty shell (FAC-HOME-005).
- Missing optional media degrades to text; no broken image placeholder (FAC-HOME-006).
- Test written first, asserting: the section renders approved fields; Draft records are absent; the
  empty state omits the section; heading level keeps hierarchy valid.
- Commands: `npm run test:run -- tests/components` then `npm run check`.
- Commit: `feat: add <name> section`.

| Phase | Section | Selector | Specific requirements | FAC | NFAC |
|---|---|---|---|---|---|
| **P14** | Hero + About | `getPublishedProfile`, `getActiveResume` | Name, title, headline, `Yogyakarta, Indonesia`, remote availability, photograph, **View Projects** primary and Resume secondary action. Two-column desktop / stacked mobile. No auto-typing, no title carousel (UX §7.3). About shows positioning, strengths, direction. | FAC-PROFILE-001/002/003, FAC-HOME-002 | NFAC-PERF-001, NFAC-A11Y-004 |
| **P15** | Selected Projects | `getFeaturedProjects` | Cards with visual, type, status, title, summary, role, technologies, case-study link. **Two Published projects render two balanced cards — never an empty third or a fake "Coming Soon"** (FAC-HOME-004). Section action: View All Projects. | FAC-HOME-003/004, FAC-PROJECTS-002 | NFAC-RESP-001 |
| **P16** | Work Experience | `getPublishedExperience` | Company, position, exact dates, current indicator, arrangement, summary, responsibilities, contributions, technologies. Most recent first. Date column desktop, dates above on mobile. | FAC-EXP-001 | NFAC-CONTENT-002 |
| **P17** | Technical Skills | `getPublishedSkillGroups` | Grouped by discipline, labelled by classification. **No progress bars, no percentages, no star ratings** (FAC-SKILL-003). Empty groups hidden. | FAC-SKILL-001/002/003, FAC-HOME-005 | NFAC-A11Y-005 |
| **P18** | AI-Assisted Engineering | `getPublishedAIPractices` | Four-step workflow — Analyze, Plan, Implement, Verify — each with AI-supported activity, human responsibility, verification method. Must not present AI as owning final decisions (FAC-AI-002). | FAC-AI-001/002 | NFAC-CONTENT-002 |
| **P19** | Contact | `getPublishedContactChannels`, `getPublishedExternalProfiles` | Email as `mailto:` primary action, LinkedIn, GitHub, Resume, location, remote availability. **No form, no "message sent" state** (FAC-CONTACT-005, FAC-CONTACT-002). | FAC-CONTACT-001–005 | NFAC-PRIV-001, NFAC-REL-002 |

**Cross-cutting risk for P14–P19.** A section that imports content directly rather than through a
selector defeats the content flow. The P24 lint rule catches this; reviewers should also check it
per pull request.

---

## Stage D — Routes

### P20 — Projects Index route

**Goal.** `/projects` listing every Published case study.
**Depends on.** P15
**Branch.** `feat/projects-index-route`

**Creates.** `src/app/projects/page.tsx`, `src/components/project/project-card.tsx`,
`tests/components/project-card.test.tsx`

**Steps.** Load `getPublishedProjects()`; render the approved ordering; include the sanitization note
from UX §8.2; render the truthful empty state with Home, Resume, and Contact actions when nothing is
Published; export static page metadata. No filtering controls (DEC-028).

**Tests first.** Card links to the correct slug; Draft projects are absent; the empty state exposes
all three recovery actions.
**Commands.** `npm run check` · `npm run dev`
**Expected.** With Draft-only content, the empty state renders — correct until P30.
**FAC.** FAC-PROJECTS-001/002/003/004, FAC-NAV-003 **NFAC.** NFAC-SEO-001, NFAC-RESP-001
**Risks.** Treating the empty state as a defect. It is valid; release validation is what blocks
launch (FAC-PROJECTS-004).
**Commit.** `feat: add projects index route`

---

### P21 — Project Detail static routes

**Goal.** One prerendered page per Published project, and nothing else.
**Depends on.** P20
**Branch.** `feat/project-detail-route`

**Creates.** `src/app/projects/[slug]/page.tsx`,
`src/components/project/{project-header,project-section,project-responsibility,project-navigation}.tsx`,
tests for each

**Steps.**
1. `export const dynamicParams = false` — any slug outside `generateStaticParams()` returns 404
   without executing route code.
2. `generateStaticParams()` returns slugs from `getPublishedProjects()` only.
3. `generateMetadata()` derives title, summary, canonical URL, and social image from the record; no
   Private or Restricted values ever reach metadata.
4. Resolve via `getPublishedProjectBySlug()`; call `notFound()` on `null`.
5. Render the fifteen UX §9.5 sections in order: Context, Problem, My Responsibility, Technical
   Approach, Architecture or Workflow, Challenges, Decisions and Trade-offs, Implementation Summary,
   Testing and Verification, Outcome, AI-Assisted Engineering, Lessons Learned, Technology Stack,
   Confidentiality Note, Related Navigation.
6. `ProjectResponsibility` renders **My Responsibility** and **Team or External Responsibility** as
   visually distinct blocks (FAC-PROJECT-003).
7. Role and status appear near the top (UX §9.2). Adjacent navigation from
   `getAdjacentPublishedProjects`.

**Tests first.** `generateStaticParams` excludes Draft; required sections all render; responsibility
blocks are distinguishable; adjacent navigation is absent at both ends.
**Commands.** `npm run build` (inspect emitted routes) · `npm run check`
**Expected.** The build emits routes only for Published slugs.
**FAC.** FAC-PROJECT-001–008, FAC-NAV-004/006 **NFAC.** NFAC-SEC-006, NFAC-SEO-001, NFAC-RESP-003
**Risks.** Omitting `dynamicParams = false` would let unknown slugs render at request time.
**Verification.** `npm run build` output lists exactly the Published slugs, no more.
**Commit.** `feat: add project detail static routes`

---

### P22 — Resume and Not Found behavior

**Goal.** Truthful Resume access and a Not Found page that leaks nothing.
**Depends on.** P21
**Branch.** `feat/resume-and-not-found`

**Creates.** `src/app/not-found.tsx`, `public/resume.pdf` (Draft placeholder),
`tests/components/not-found.test.tsx`

**Steps.**
1. All Resume actions target the stable `/resume.pdf` (TD §11.6), opening in a new tab with
   `rel="noopener noreferrer"`. Label **View Resume**, used identically everywhere (UX §10.1).
2. When no active Resume exists, the action is hidden or disabled with a truthful explanation — the
   site never claims a download succeeded (FAC-RESUME-003, NFAC-REL-002).
3. `not-found.tsx` — "Page not found", short explanation, Home and Projects actions, optional Resume
   and Email. Simple and centred. **It must not reveal whether a project exists privately, is Draft,
   or is Archived** (UX §11.3, DEC-047).

**Tests first.** Not Found exposes both required recovery actions; its copy contains no
project-specific or status-revealing wording; the Resume action is absent when no Resume is active.
**Commands.** `npm run check` · `npm run dev`
**Expected.** `/projects/does-not-exist` and a Draft slug produce identical pages.
**FAC.** FAC-RESUME-002/003, FAC-NAV-005/006 **NFAC.** NFAC-REL-002, NFAC-COMPAT-003, NFAC-SEC-006
**Risks.** A helpful message such as "this project is not yet published" would breach DEC-047.
**Verification.** Compare both responses; any difference is a defect.
**Commit.** `feat: add resume access and not found behavior`

---

### P23 — Metadata, Open Graph image, sitemap, and robots

**Goal.** Complete, safe discovery metadata.
**Depends on.** P22
**Branch.** `feat/metadata-and-seo`

**Creates.** `src/lib/environment.ts`, `src/lib/paths.ts`, `src/domain/metadata/build-metadata.ts`,
`src/app/opengraph-image.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`,
`tests/domain/build-metadata.test.ts`
**Modifies.** `src/app/layout.tsx`, `src/app/page.tsx`

**Steps.**
1. `environment.ts` — parse `SITE_URL` in exactly one place, with a localhost fallback in
   development; release validation requires an absolute HTTPS value (TD §12.2, §21).
2. `build-metadata.ts` — title template, description, canonical URL, Open Graph and Twitter values.
3. `opengraph-image.tsx` — generated card with name, professional title, clean technical layout. No
   confidential screenshot (UX §18.3).
4. `sitemap.ts` — Home, Projects Index, and Published Project Detail routes **only**. Resume may be
   excluded.
5. `robots.ts` — allow public pages. Non-public routes simply do not exist to be disallowed.
6. Optional JSON-LD for `Person`, `WebSite`, `ProfilePage` (TD §12.5) — must not delay launch.

**Tests first.** Sitemap excludes Draft slugs; canonical URLs are absolute; `SITE_URL` parsing
rejects a non-HTTPS production value; project metadata contains no Private or Restricted field.
**Commands.** `npm run build`, then inspect `/sitemap.xml`, `/robots.txt`, `/opengraph-image`
**Expected.** Sitemap lists exactly the Published routes.
**FAC.** FAC-PUBLISH-001 **NFAC.** NFAC-SEO-001–005, NFAC-SEC-006
**Risks.** A hardcoded production URL breaks preview deployments. Read it from `SITE_URL` only.
**Commit.** `feat: add metadata, open graph image, sitemap, and robots`

---

## Stage E — Quality

### P24 — Test coverage closure

**Goal.** Close measured gaps left by the test-first work; add the architectural lint rule.
**Depends on.** P23
**Branch.** `test/coverage-closure`

**Steps.**
1. Run `npm run test:coverage`; list uncovered branches in `src/domain/**` — the correctness-critical
   layer.
2. Add tests only for genuine gaps. No snapshot tests (TD §18.3).
3. Add an ESLint `no-restricted-imports` rule forbidding `@/content/*` imports outside
   `src/domain/**`, enforcing the content-flow boundary.
4. Confirm every TD §18.1 and §18.2 case has a test.

**Commands.** `npm run test:coverage` · `npm run lint` · `npm run check`
**Expected.** `src/domain` branch coverage is high and every listed behavior has a named test. The
lint rule fails on a deliberate violation.
**FAC.** FAC-PUBLISH-001/002 **NFAC.** NFAC-TEST-002, NFAC-MAINT-003
**Risks.** Chasing a coverage percentage instead of behavior. Coverage is a gap-finding tool here,
not a target.
**Commit.** `test: close unit and component coverage gaps`

---

### P25 — End-to-end and accessibility tests

**Goal.** Prove real browser behavior and WCAG 2.2 AA conformance.
**Depends on.** P24
**Branch.** `test/e2e-and-accessibility`

**Creates.** `e2e/{home,projects,project-detail,navigation,resume,accessibility}.spec.ts`
**Removes.** `e2e/smoke.spec.ts`

**Steps.** Cover TD §18.4: identity and required sections on Home; View Projects works; Resume
resolves; external links point to approved destinations; Published cards appear and Draft ones do
not; detail opens, works on direct entry, and shows role and status near the top; an invalid slug
shows Not Found; mobile navigation opens and closes; no essential horizontal overflow at 320px;
keyboard smoke test. Then `@axe-core/playwright` scans Home, Projects Index, one Project Detail, and
Not Found — **critical and serious findings fail the run** (TD §15.4).

**Commands.** `npm run test:e2e` · `npm run release:check`
**Expected.** All specs green on Chromium. Zero critical or serious axe findings.
**FAC.** FAC-NAV-001–006, FAC-HOME-001/002, FAC-PROJECTS-001, FAC-PROJECT-001/002, FAC-RESUME-002
**NFAC.** NFAC-A11Y-001–007, NFAC-RESP-001–003, NFAC-REL-001
**Risks.** E2E depending on Draft content will break in P30 when content changes. Assert on structure
and roles, not on placeholder strings.
**Verification.** Run against a production build, not the dev server.
**Commit.** `test: add end-to-end and accessibility coverage`

---

### P26 — Cross-browser verification

**Goal.** Confirm parity across the four required browsers.
**Depends on.** P25
**Branch.** `test/cross-browser`

**Steps.** Enable Firefox and WebKit in the full run; fix any engine-specific defect; manually verify
Edge, which shares Chromium (NFAC-COMPAT-001); confirm no essential behavior depends on a
single-browser API (NFAC-COMPAT-002); confirm the Resume path resolves where inline PDF rendering
differs (NFAC-COMPAT-003).

**Commands.** `npx playwright test --project=chromium --project=firefox --project=webkit`
**Expected.** Green on all three. Any deviation is fixed, not skipped.
**NFAC.** NFAC-COMPAT-001/002/003
**Risks.** Quietly skipping a WebKit failure. Record any exception in the pull request.
**Commit.** `test: verify cross-browser behavior`

---

## Stage F — Delivery

### P27 — GitHub Actions

**Goal.** The required checks that gate every pull request into `production`.
**Depends on.** P26
**Branch.** `chore/configure-github-actions`

**Creates.** `.github/workflows/ci.yml`, `.github/workflows/release-audit.yml`

**Steps.**
1. `ci.yml` triggers on pull request to **`production`** and push to **`production`**.
2. Job **`quality`**: checkout; `actions/setup-node` with Node 24 and npm cache; `npm ci`;
   `format:check`; `lint`; `typecheck`; `validate:content`; `test:run`; `build`.
3. Job **`e2e`**, `needs: quality`: install Playwright with `--with-deps`; build; start; run all
   three engines; upload the report on failure.
4. Job names must be exactly `quality` and `e2e` — `docs/governance/github-configuration.md` §4
   requires those strings as the required checks.
5. `permissions: contents: read` at workflow level; escalate per job only where needed.
6. `release-audit.yml` on `workflow_dispatch`: `validate:release`, `check:links`, `audit:prod`,
   Lighthouse, and production smoke checks when a URL is available.

**Commands.** Push the branch and observe the run.
**Expected.** Both jobs pass on the pull request. This is the first run, so the checks become
selectable in the ruleset afterwards.
**NFAC.** NFAC-CICD-001, NFAC-REL-004, NFAC-TEST-003
**Risks.** Adding required checks to the ruleset before the workflow has run once makes them
unselectable, blocking every pull request. Run first, then configure.
**Commit.** `chore: configure github actions workflows`

---

### P28 — Vercel Preview and Production preparation

**Goal.** Managed preview and production deployment.
**Depends on.** P27
**Branch.** none — interface configuration, not code.

**Steps (Vercel interface).** Connect `randifajar/developer-portfolio`. Framework preset Next.js.
Node.js 24. Install `npm ci`. Build `npm run build`. **Production Branch: `production`.** Set
production `SITE_URL` to the assigned HTTPS URL. Confirm task branches produce Preview Deployments
and that previews expose no restricted content.

**Steps (GitHub interface).** Complete `docs/governance/setup-checklist.md`: default branch
`production`; squash merge only; automatic head-branch deletion; merge commits and rebase merge
disabled; the `Protect production` ruleset with `quality` and `e2e` as required checks; dependency
graph, Dependabot alerts and security updates, secret scanning, push protection, code scanning;
`GITHUB_TOKEN` restricted to read-only contents.

**Expected.** A pull request shows both a CI result and a Preview URL.
**FAC.** FAC-OWNER-003/004 **NFAC.** NFAC-CICD-002/003
**Risks.** Vercel's default production branch is the repository default — verify it reads
`production`.
**Verification.** Open a throwaway pull request, confirm the preview renders, close it.

---

### P29 — Release audit

**Goal.** Run the full release gate and record evidence, while content is still Draft.
**Depends on.** P28
**Branch.** `chore/release-audit-dry-run`

**Steps.** Run `npm run release:check` and expect it to **fail** at `validate:release` — proof the
gate works (P10). Run `check:links` and `audit:prod` independently and resolve findings. Run
Lighthouse against the preview for Home, Projects Index, and one Project Detail; record scores.
Resolve critical vulnerabilities; document or resolve high-severity ones.

**Commands.** `npm run release:check` · `npm run audit:prod` · `npm run check:links` · Lighthouse
**Expected.** Everything green **except** release content validation, which must still fail. That is
the correct pre-launch state.
**NFAC.** NFAC-PERF-001/002, NFAC-SEC-004, NFAC-REL-005
**Risks.** Mistaking the intended `validate:release` failure for a defect and weakening the rule.
**Commit.** `chore: record release audit evidence`

---

## Stage G — Launch

### P30 — Content finalization

**Goal.** Replace every Draft placeholder with approved content and flip to Published. **This is
Randi's phase** — Claude may implement structure but cannot author professional claims.
**Depends on.** P29 and real content inputs.
**Branch.** `feat/publish-launch-content`

**Steps.**
1. Final headline, professional summary, and About copy (OPEN-001, OPEN-002).
2. Professional photograph as WebP with width, height, and alt text (OPEN-005).
3. Complete both launch case studies; set `publicationStatus: "published"`.
4. Final skills and classification (OPEN-004).
5. Real `resume.pdf` at `public/resume.pdf`; exactly one active Published Resume record.
6. Safe project visuals — sanitized, alt text, text explanation, no internal identifiers (OPEN-006).
7. Social sharing image.
8. Set `deliveryStatus` truthfully. `production` only with verified `productionConfirmation`.
9. Run the full confidentiality review, then the **public-visibility gate**
   (`docs/governance/github-configuration.md` §9) before switching the repository to Public.

**Commands.** `npm run release:check` — must now **pass** for the first time.
**Expected.** Two Published projects, one active Resume, zero placeholder markers.
**FAC.** Every launch criterion in FAC §15
**NFAC.** NFAC-CONTENT-001–005, NFAC-SEC-001/002, NFAC-PRIV-002/004
**Risks.** Publishing an unverified claim or an unsanitized visual. NFAC-PRIV-004 requires documented
owner confirmation per professional case study.
**Verification.** `npm run release:check` exits 0; manual read of every Published string.
**Commit.** `feat: publish approved launch content`

---

### P31 — Production verification

**Goal.** Confirm the live site, because deployment success is not acceptance (NFAC-CICD-004).
**Depends on.** P30 merged and deployed.
**Branch.** none — verification against production.

**Steps.** Check `/`, `/projects`, every Published Project Detail, `/resume.pdf`, the email action,
LinkedIn, GitHub, mobile layout, and Not Found (TD §24.5). Complete the NFAC-TEST-004 manual
checklist including keyboard navigation. Confirm the social preview renders. Confirm no Draft content
is reachable.

**Expected.** Every route returns a valid public result; every external link resolves.
**FAC.** FAC-OWNER-005 **NFAC.** NFAC-REL-001, NFAC-CICD-004, NFAC-TEST-004
**Risks.** Declaring launch on a green Vercel badge alone. The checklist is the acceptance criterion.

---

### P32 — Rollback verification

**Goal.** Prove recovery works **before** it is needed.
**Depends on.** P31
**Branch.** none — a drill.

**Steps.** Use Vercel's rollback to restore the previous deployment; confirm the site serves it; roll
forward again. Separately, confirm a `git revert` of a squash commit flows through the normal pull
request path and redeploys. Document both in `docs/release-checklist.md`.

**Expected.** Both paths verified and written down.
**FAC.** FAC-OWNER-006 **NFAC.** NFAC-REC-001/002/003
**Risks.** Rolling back the hosting platform without correcting source leaves them inconsistent
(TD §25.2) — the drill must include the source correction.

---

## Stage H — Post-launch

### P33 — Docker portability

**Goal.** Demonstrate containerization without changing the production path.
**Depends on.** P32, and a stable managed launch.
**Branch.** `chore/add-docker-support`

**Creates.** `Dockerfile`, `.dockerignore`
**Modifies.** `next.config.ts` (`output: "standalone"`), `README.md`

**Steps.** Multi-stage build on Node 24; copy only standalone runtime files; run as a non-root user;
expose the port; add a health check; document build and run commands (TD §26.2).

**Commands.** `docker build -t portfolio .` · `docker run -p 3000:3000 portfolio`
**Expected.** Container starts; homepage, project routes, and Resume respond; the process is
non-root.
**Risks.** `output: "standalone"` must not alter the Vercel build. Verify a preview deployment after
the change.
**Commit.** `chore: add docker support for local portability`

---

# 9. Test Strategy

| Area | Level | Location | Key assertions |
|---|---|---|---|
| Domain validation | Unit | `tests/domain/schemas.test.ts` | Nine schema rejection cases (P06) |
| Cross-record validation | Unit | `tests/content/validation.test.ts` | One failing case per fifteen rules (P09) |
| Release validation | Unit | `tests/content/release-validation.test.ts` | Fails on Draft; passes only on complete content (P10) |
| Content filtering | Unit | `tests/domain/selectors.test.ts` | Draft, Archived, Private, Restricted all excluded |
| Selectors | Unit | `tests/domain/selectors.test.ts` | Ordering, featured limit, `null` for ineligible |
| Project navigation | Unit | `tests/domain/project-navigation.test.ts` | `null` at both ends; never an unpublished neighbour |
| Status mapping | Unit | `tests/domain/delivery-status.test.ts` | All seven statuses have unique labels |
| Components | Component | `tests/components/**` | Primitives and sections; markdown rejects raw HTML |
| Navigation | Component + E2E | `tests/components/header`, `e2e/navigation.spec.ts` | `aria-expanded`, Escape, link-closes-menu |
| Project Detail routes | E2E | `e2e/project-detail.spec.ts` | Direct entry, required sections, invalid slug → Not Found |
| Resume | E2E | `e2e/resume.spec.ts` | `/resume.pdf` returns a valid response |
| Not Found | E2E | `e2e/navigation.spec.ts` | Unknown and Draft slugs are indistinguishable |
| Accessibility | E2E | `e2e/accessibility.spec.ts` | Axe on four page types; critical/serious fail the run |
| Responsive | E2E | `e2e/home.spec.ts` | No essential horizontal overflow at 320px |
| Cross-browser | E2E | full suite | Chromium, Firefox, WebKit (P26) |
| Performance | Audit | Lighthouse | Home, Projects Index, one Project Detail (P29) |

**Principles.** Tests precede implementation for all domain and reusable-component work (Handoff
§7.4). No snapshot-heavy tests (TD §18.3). E2E asserts structure and roles, not placeholder strings,
so P30 does not break the suite. Every command exits non-zero on failure (NFAC-TEST-001).

---

# 10. CI/CD Plan

**Required pull-request jobs.** `quality` and `e2e` — exactly these names, matching
`docs/governance/github-configuration.md` §4.

| Job | Commands |
|---|---|
| `quality` | `npm ci` → `format:check` → `lint` → `typecheck` → `validate:content` → `test:run` → `build` |
| `e2e` (needs `quality`) | Playwright install `--with-deps` → build → start → Chromium/Firefox/WebKit → upload report on failure |

**Branch protection.** Ruleset `Protect production` targeting `production`: restrict deletions, block
force pushes, require a pull request, 0 required approving reviews, require conversation resolution,
require status checks (`quality`, `e2e`), require branch up to date, require linear history, no
permanent bypass actor. Randi remains the only merge authority by project policy regardless of the
zero-approval setting.

**Preview deployment.** Every non-`production` branch and pull request gets a Vercel Preview.
Previews must expose no restricted content (NFAC-CICD-002).

**Production deployment.** Squash merge into `production` triggers a Vercel Production Deployment
automatically (NFAC-CICD-003).

**Release audit.** `release-audit.yml` on manual dispatch: `validate:release`, `check:links`,
`audit:prod`, Lighthouse, production smoke checks.

**Production verification.** Manual, per P31. Never inferred from a green deployment.

---

# 11. Release Plan

Ordered gate. Each step must pass before the next.

1. **Structural validation** — `npm run validate:content` exits 0.
2. **Release validation** — `npm run validate:release` exits 0 (first time ever at P30).
3. **Content approval** — Randi reads every Published string and confirms each claim is truthful,
   with personal contribution separated from team contribution.
4. **Confidentiality review** — no credentials, internal URLs, private repository links, customer or
   student data, unsafe screenshots, raw AI sessions, or internal identifiers. Includes Git history
   and Actions logs (`docs/governance/github-configuration.md` §9).
5. **Link validation** — `npm run check:links`; LinkedIn, GitHub, and the email action verified by
   hand.
6. **Resume validation** — exactly one active Published Resume; `/resume.pdf` returns a valid PDF;
   Resume and portfolio do not contradict each other (NFAC-CONTENT-005).
7. **Accessibility audit** — axe clean of critical and serious findings; manual keyboard pass.
8. **Performance audit** — Lighthouse on three page types; NFAC-PERF-001 met; any score below 90
   documented and approved.
9. **Production smoke test** — the full P31 checklist.
10. **Rollback procedure** — verified per P32 and documented in `docs/release-checklist.md`.

**Public visibility switch** happens between steps 4 and 9, and only after step 4 passes against Git
history — not merely against the working tree.

---

# 12. Traceability Matrix

| Phase | PRD | FAC | NFAC | UX/UI | Technical Design |
|---|---|---|---|---|---|
| P01 | §1.5 | — | SEC-001, MAINT-004 | — | §5.1, §8, §21 |
| P02 | §1.5 | — | REL-004, TEST-003 | — | §5.1, §5.2, §8, §20, §22.3 |
| P03 | §1.5 | — | TEST-001 | — | §5.7, §19 |
| P04 | §1.8 | — | TEST-001, COMPAT-001 | — | §5.6, §18 |
| P05 | §5.1 | NAV-002 | A11Y-002/003/005/006, RESP-001 | §4, §5, §6.3 | §11.1, §14 |
| P06 | §3, §7 | EXP-002, PROJECT-004, SKILL-002, PUBLISH-004 | MAINT-001/002, SEC-003 | §4.5 | §9.1, §9.2, §9.5 |
| P07 | §7 | PROJECT-005, OWNER-001 | MAINT-002 | — | §9.3, §17.5 |
| P08 | §3, §5 | OWNER-001, PUBLISH-001 | SEC-002, CONTENT-004 | §19 | §9.6, ADR-003 |
| P09 | §5, §6.7 | PROFILE-004, EXP-003, PROJECT-005, RESUME-004, PUBLISH-002/003 | MAINT-002, SEC-006, TEST-001 | — | §9.4, ADR-005 |
| P10 | §1.8 | HOME-004, PROJECTS-004, RESUME-001 | CONTENT-004, SEO-001, TEST-004 | §19 | ADR-006 |
| P11 | §6.1–6.3 | HOME-003/005, PROJECTS-001/003, PROJECT-001/008, NAV-006, PUBLISH-001/002 | SEC-006, MAINT-003, TEST-002 | — | §10 |
| P12 | §5.1 | PROJECT-004, SKILL-003, CONTACT-003/004 | A11Y-003/004/005, SEC-003 | §12 | §13.2, §15.3 |
| P13 | §4.7, §5.1 | NAV-001/002/003, CONTACT-003/004 | A11Y-002/003, RESP-002/004 | §6 | §13.4, §15.2 |
| P14 | §5.1 | PROFILE-001/002/003, HOME-002 | PERF-001, A11Y-004 | §7.3, §7.4 | §11.2 |
| P15 | §5.1 | HOME-003/004, PROJECTS-002 | RESP-001 | §7.5 | §13.3 |
| P16 | §5.1, §7.2 | EXP-001 | CONTENT-002 | §7.6 | §13.3 |
| P17 | §5.1, §7.4 | SKILL-001/002/003, HOME-005 | A11Y-005 | §7.7 | §13.3 |
| P18 | §5.1, §7.5 | AI-001/002 | CONTENT-002 | §7.8 | §13.3 |
| P19 | §5.1, §7.7 | CONTACT-001–005 | PRIV-001, REL-002 | §7.9 | §13.3 |
| P20 | §5.2 | PROJECTS-001/002/003/004, NAV-003 | SEO-001, RESP-001 | §8 | §11.3 |
| P21 | §5.3, §6.3 | PROJECT-001–008, NAV-004/006 | SEC-006, SEO-001, RESP-003 | §9 | §11.4 |
| P22 | §5.4, §5.5, §6.4 | RESUME-002/003, NAV-005/006 | REL-002, COMPAT-003, SEC-006 | §10, §11 | §11.5, §11.6 |
| P23 | §5.1 | PUBLISH-001 | SEO-001–005, SEC-006 | §18 | §12, §11.7, §11.8 |
| P24 | — | PUBLISH-001/002 | TEST-002, MAINT-003 | — | §18.1, §18.2 |
| P25 | §4 | NAV-001–006, HOME-001/002, PROJECTS-001, PROJECT-001/002, RESUME-002 | A11Y-001–007, RESP-001–003, REL-001 | §15, §20 | §18.4, §15.4 |
| P26 | §1.5 | — | COMPAT-001/002/003 | §14 | §18.5 |
| P27 | §4.6 | OWNER-002 | CICD-001, REL-004, TEST-003 | — | §23 |
| P28 | §4.6 | OWNER-003/004 | CICD-002/003 | — | §24 |
| P29 | §1.8 | — | PERF-001/002, SEC-004, REL-005 | — | §18.6, §23.4 |
| P30 | §1.8, §3 | FAC §15 launch criteria | CONTENT-001–005, SEC-001/002, PRIV-002/004 | §19, §22 | §9.6 |
| P31 | §4.6 | OWNER-005 | REL-001, CICD-004, TEST-004 | — | §24.5 |
| P32 | §4.6 | OWNER-006 | REC-001/002/003 | — | §25 |
| P33 | — | — | — | — | §26 |

---

# 13. Open Questions

None block implementation.

Per Handoff §8.12, the final headline, final professional summary, professional photograph, third
project, final skill classification, safe project visuals, and custom domain are **content inputs,
not blockers** — the entire structure is built and verified against safe Draft placeholders in
P01–P29, and release validation refuses to launch until they are supplied in P30.

Resolved during planning and recorded in section 5: license (MIT), TypeScript line (7.0.2 with the
P02 gate), production branch (`production`), analytics (disabled), Lighthouse cadence (release only),
CSP (deferred), font (Geist), domain (Vercel subdomain at launch).

---

# 14. Approval

This Implementation Plan is ready for Product Owner review.

Implementation of P01–P27 may proceed on approval. P28 requires GitHub and Vercel interface access.
P30 requires Randi's approved content. P31–P33 follow launch.
