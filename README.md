# Developer Portfolio

Personal developer portfolio of **Randi Fajar Wicaksono**, a backend developer
based in Yogyakarta, Indonesia.

It presents professional experience, selected project case studies, technical
skills, and an account of AI-assisted engineering practice — with the
truthfulness and confidentiality rules enforced in code rather than left to
review.

**Live:** <https://developer-portfolio-delta-three.vercel.app/>

**Status:** Production. Version 2 is deployed, indexed, and verified against
[`docs/release-checklist.md`](docs/release-checklist.md) rather than inferred
from a successful build. `npm run release:check` passes end to end: formatting,
linting, strict type checking, content validation, unit and component tests, a
production build, release validation, link validation, end-to-end and
accessibility tests across three browser engines, and a production dependency
audit.

---

## Technology

| Area       | Choice                                                   |
| ---------- | -------------------------------------------------------- |
| Runtime    | Node.js 24 LTS (pinned via `.nvmrc` and `.node-version`) |
| Framework  | Next.js 16 App Router                                    |
| UI         | React 19, Server Components by default                   |
| Language   | TypeScript 6, strict                                     |
| Styling    | Tailwind CSS v4, configured in CSS                       |
| Validation | Zod 4 plus custom cross-record validation                |
| Rich text  | react-markdown with raw HTML disabled                    |
| Testing    | Vitest, Testing Library, Playwright, axe-core            |
| CI         | GitHub Actions                                           |
| Hosting    | Vercel, deployed from `production`                       |

Framework versions are pinned exactly — no caret ranges — so builds are
reproducible.

---

## Architecture in one paragraph

Content lives in typed TypeScript modules. Zod parses every record at import, so
malformed content fails the build rather than reaching a page. A selector layer
is the only path from content to pages, and it applies a single eligibility
rule: Published, and classified Public or Sanitized. Project routes are
generated at build time from that selector, so an unpublished project has no
route, no sitemap entry, and no metadata — its absence is what hides it, not a
runtime check.

Full detail: [`docs/architecture.md`](docs/architecture.md).

---

## Local setup

Requires Node.js 24. With `nvm`:

```bash
nvm use
npm ci
npm run dev
```

Optional environment configuration:

```bash
cp .env.example .env.local
```

`SITE_URL` is public metadata used for canonical links and social previews, not
a secret. It falls back to `http://localhost:3000` in development.

---

## Commands

| Command                    | Purpose                                                       |
| -------------------------- | ------------------------------------------------------------- |
| `npm run dev`              | Development server                                            |
| `npm run build`            | Production build                                              |
| `npm run check`            | Format, lint, typecheck, content validation, tests, build     |
| `npm run test:run`         | Unit and component tests                                      |
| `npm run test:e2e`         | End-to-end and accessibility tests against a production build |
| `npm run validate:content` | Structural content validation                                 |
| `npm run validate:release` | Launch gate — content completeness and placeholder scan       |
| `npm run audit:prod`       | Production dependency audit                                   |

`npm run check` is what CI runs. Run it before opening a pull request.

---

## Content structure

```text
src/content/
├── site.ts          Site name, links, metadata defaults
├── profile.ts       Professional identity
├── experience.ts    Work history
├── skills.ts        Technical skills and classification
├── ai-practices.ts  AI-assisted engineering workflow
├── resume.ts        Active Resume metadata
├── contact.ts       Email and external profiles
├── media.ts         Images and their alt text
└── projects/
    ├── index.ts     The project registry
    └── *.ts         One module per case study
```

### Adding or updating a project

1. Create `src/content/projects/<slug>.ts` using `defineProject`.
2. Register it in `src/content/projects/index.ts`.
3. Run `npm run validate:content`.
4. Set `publicationStatus: "published"` only when the content is complete,
   truthful, and confidentiality-reviewed.

Validation errors name the content type, the record, and the exact field path.

---

## Publication and confidentiality

Three independent axes govern every record:

- **Publication Status** — does the website show it? (`draft`, `published`, `archived`)
- **Delivery Status** — what is the real state of the work? (`completed`, `production`, …)
- **Confidentiality** — is it safe to publish at all? (`public`, `sanitized`, `private`, `restricted`)

Two rules that are easy to get wrong:

**Draft hides content from the website, not from GitHub.** This repository is
public, so every string in `src/content/` must already be safe to read
directly, whatever its publication status.

**`production` requires proof.** The status is rejected unless the record
carries a verified `productionConfirmation`. Work that did not reach production
cannot claim it.

Private and Restricted material — raw AI session exports, company documents,
internal identifiers, customer or student data, unsanitized screenshots — never
enters this repository at all.

---

## Testing

Domain logic is test-driven: schema rules, publication and confidentiality
filtering, selectors, and validation all have tests written before the
implementation. End-to-end tests run against a production build on Chromium,
Firefox, and WebKit, including axe scans where critical and serious findings
fail the run.

Two tests are load-bearing rather than routine:

- An unknown slug and an unpublished slug must return **byte-identical**
  responses. Two 404s with different copy would still leak.
- Every release-validation rule is asserted in **both** directions: it fires
  against content that violates it, and stays quiet against real content. Only
  the second half would leave a broken rule and a satisfied rule looking
  identical.

Release validation failed for the whole of development, which is what made
building against placeholder content safe. It passes now, so each rule is
exercised against a deliberately violating fixture instead.

---

## CI/CD

Pull requests to `production` run three jobs, two of which are required:
`quality` (format, lint, typecheck, content validation, tests, build) and `e2e`
(all three browser engines plus accessibility). The job names are matched by
exact string in the branch ruleset, so renaming one silently detaches the
required check.

The third, `audit`, runs the production dependency audit and is deliberately
**not** required. An advisory published upstream overnight would otherwise block
every merge, including a revert needed during an unrelated incident. It reports
on every change without holding the merge button hostage.

`production` is the only long-lived branch. Work happens on short-lived task
branches, merges by squash after review, and deploys automatically. Deployment
success is not acceptance — production is verified manually against
[`docs/release-checklist.md`](docs/release-checklist.md).

`production` is protected by a branch ruleset with no bypass actors, so it
applies to the repository owner too: pull request required, squash merge only,
both checks green, linear history, force pushes and deletions blocked.

The release audit workflow is manual rather than automatic, because running the
full gate on every push would be slow without being more informative. Running it
end to end for the first time is what surfaced four defects — including a script
declared in `package.json` that had never been written, and a workflow that had
never once been dispatched.

A separate scheduled workflow runs the dependency audit daily. A vulnerability
is published on its author's timetable, not on the cadence of pull requests: a
high-severity advisory once reached `production` through thirteen consecutive
green CI runs, because at the time the audit ran only at a release.

---

## Deployment

Vercel Git integration: task branches produce Preview Deployments, `production`
produces Production Deployments. Rollback is available through Vercel for urgent
recovery, followed by a source correction so the two never stay inconsistent.

**Docker** is a post-launch enhancement for portability and is deliberately not
on the launch path.

---

## AI-assisted development

This project was built with substantial AI assistance — repository analysis,
implementation planning, scoped code generation, and test authoring.

Randi retains responsibility for the requirements, the architecture, reviewing
every change, testing, security, and every final decision. Where an AI-proposed
approach conflicted with the approved design, the conflict was recorded and
resolved explicitly rather than absorbed silently.

Raw AI session exports are never published.

---

## Documentation

| Document                                                 | Contents                                               |
| -------------------------------------------------------- | ------------------------------------------------------ |
| [`docs/architecture.md`](docs/architecture.md)           | How the system is built and why                        |
| [`docs/release-checklist.md`](docs/release-checklist.md) | The ordered gate before going public                   |
| [`docs/release-audit.md`](docs/release-audit.md)         | Dated audits: what was found, decided, and deferred    |
| [`docs/content-authoring.md`](docs/content-authoring.md) | How to write and publish content truthfully            |
| [`docs/product/`](docs/product/)                         | PRD, acceptance criteria, UX/UI spec, technical design |
| [`docs/governance/`](docs/governance/)                   | Git workflow and GitHub configuration                  |
| [`docs/plans/`](docs/plans/)                             | Implementation plan                                    |

---

## License

[MIT](LICENSE) © 2026 Randi Fajar Wicaksono
