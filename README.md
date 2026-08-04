# Developer Portfolio

Personal developer portfolio of **Randi Fajar Wicaksono**, a backend-focused
full-stack developer based in Yogyakarta, Indonesia.

It presents professional experience, selected project case studies, technical
skills, and an account of AI-assisted engineering practice — with the
truthfulness and confidentiality rules enforced in code rather than left to
review.

**Public URL:** not yet deployed. Vercel connection is pending.

**Status:** implementation in progress. The application builds and is fully
tested; published content is still Draft placeholder text, so the site
intentionally renders as chrome only. `npm run validate:release` reports exactly
what remains.

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
| Hosting    | Vercel (planned)                                         |

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
| `npm run validate:release` | Launch gate — expected to fail until content is final         |
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

- An unknown slug and a Draft slug must return **byte-identical** responses.
  Two 404s with different copy would still leak.
- Release validation must **fail** on Draft content, and a completed-launch
  fixture must pass. Without that pair, the failing assertion proves nothing.

---

## CI/CD

Pull requests to `production` run two required checks: `quality` (format, lint,
typecheck, content validation, tests, build) and `e2e` (all three browser
engines plus accessibility). The job names are matched by exact string in the
branch ruleset, so renaming one silently detaches the required check.

`production` is the only long-lived branch. Work happens on short-lived task
branches, merges by squash after review, and deploys automatically. Deployment
success is not acceptance — production is verified manually against
[`docs/release-checklist.md`](docs/release-checklist.md).

The release audit workflow is manual and expected to fail during development,
because release validation refuses placeholder content.

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
| [`docs/product/`](docs/product/)                         | PRD, acceptance criteria, UX/UI spec, technical design |
| [`docs/governance/`](docs/governance/)                   | Git workflow and GitHub configuration                  |
| [`docs/plans/`](docs/plans/)                             | Implementation plan                                    |

---

## License

[MIT](LICENSE) © 2026 Randi Fajar Wicaksono
