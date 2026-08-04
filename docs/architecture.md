# Architecture

How this portfolio is built, and why. For the phase-by-phase build sequence see
`docs/plans/2026-08-04-portfolio-implementation-plan.md`.

---

## The shape of it

A statically generated Next.js App Router site with no database, no runtime API,
and no CMS. Content lives in typed TypeScript modules, is validated at build
time, and reaches pages through a single filtering layer.

```text
src/content/*.ts          Typed content modules, authored by hand
        ↓                 Zod parses at import — invalid data fails the build
src/domain/content/       Schemas, cross-record validation, selectors
        ↓                 One eligibility rule applied in one place
src/components/**         Server Components receiving filtered view data
        ↓
Static HTML               One page per Published project, and nothing else
```

---

## The one rule that matters

**A page never touches raw content.**

Every read goes through `src/domain/content/selectors.ts`, which applies one
eligibility test:

```ts
publicationStatus === "published" &&
  confidentialityClass in { public, sanitized }
```

Draft, Archived, Private, and Restricted records are removed before any
component sees them. This is enforced by lint, not convention:
`no-restricted-imports` blocks `src/content` imports from `src/app` and
`src/components`.

The rule has no exceptions. Site configuration has no publication status and
needs no filtering, but it is still exposed through `getSiteConfig()` rather
than imported directly — a boundary with carve-outs is one people learn to
route around.

**If you need content in a component, add or extend a selector.** Overriding the
lint rule is almost always the wrong fix.

---

## Three independent axes

A common mistake is collapsing these into one field. They answer different
questions.

| Axis | Question | Values |
|---|---|---|
| Publication Status | Does the website show this? | `draft`, `published`, `archived` |
| Delivery Status | What is the real state of the work? | `personal-project`, `in-development`, `completed`, `internal-release`, `proof-of-concept`, `production`, `archived` |
| Confidentiality | Is this safe to publish at all? | `public`, `sanitized`, `private`, `restricted` |

A project can be genuinely `completed` while its case study is still `draft`.
A `sanitized` case study is publishable; a `restricted` one never is, whatever
its publication status says.

`production` is special: it requires an explicit `productionConfirmation`
object, so the label cannot be applied by accident. Work that did not reach
production must not claim it.

---

## How unpublished projects stay hidden

Not by a runtime check. By not existing.

`src/app/projects/[slug]/page.tsx` sets `dynamicParams = false` and generates
params only from `getPublishedProjects()`. An unpublished project therefore has:

- no generated route
- no sitemap entry
- no metadata

An unknown slug and a Draft slug produce **byte-identical** 404 responses —
asserted in `e2e/navigation.spec.ts`, not merely assumed. Two 404s with
different copy would still leak.

`robots.ts` deliberately disallows nothing. A disallow entry would publish the
existence of the paths it is trying to hide.

The Not Found copy is tested against phrases like "not yet published" and
"private", because helpful-sounding wording is the easiest way to undo this.

---

## Two validation modes

Splitting these is what makes it possible to build against placeholder content.

**Structural** (`npm run validate:content`) runs on every pull request. Fifteen
cross-record rules — uniqueness, references, one active Resume, no Published
private content, complete Published projects. Passes today.

**Release** (`npm run validate:release`) runs before launch only. Adds the
launch-readiness rules and a deep placeholder scan. **Fails today, by design.**

That failure is the mechanism keeping Draft content out of production. If it
ever passes on incomplete content, the safety property is gone. A test asserts
it fails on the current content, and a second fixture proves it can pass on
complete content — without that pair, the failing assertion would be
meaningless.

The placeholder scan skips non-rendered keys such as ids, because an id like
`experience-placeholder-current` is internal bookkeeping no visitor reads.

---

## Client JavaScript

Exactly one Client Component: `src/components/layout/mobile-navigation.tsx`.

Everything else is a Server Component. `Header` composes the mobile menu but
stays server-rendered — marking it `"use client"` would pull the whole
navigation tree into the browser bundle for one toggle.

Markdown rendering has raw HTML **disabled** and it stays that way. Enabling
`rehype-raw` would turn every content field into an injection surface. Three
tests assert that a script tag, an `img onerror`, and an iframe all fail to
become live elements.

---

## Layout of the source

```text
src/
├── app/          Routes, metadata, sitemap, robots, OG image
├── components/
│   ├── layout/   Header, mobile navigation, Footer
│   ├── project/  Card, sections, responsibility split, navigation
│   ├── sections/ The seven homepage sections
│   └── ui/       Six primitives everything composes from
├── content/      Typed content modules — the only data source
├── domain/
│   ├── content/  Types, schemas, define helpers, validation, selectors
│   ├── metadata/ Metadata construction
│   └── projects/ Delivery status labels, adjacent navigation
└── lib/          Constants, environment parsing
```

`domain/` holds pure logic and is where the correctness-critical tests live.
`content/` holds data, not behaviour. `components/` holds presentation and
never filters.

---

## Commands

```bash
npm run dev              # development server
npm run check            # format, lint, typecheck, validate, test, build
npm run test:run         # unit and component tests
npm run test:e2e         # end-to-end and accessibility, production build
npm run validate:content # structural validation
npm run validate:release # launch gate — expected to fail until content is final
```

`npm run check` is what CI runs as the `quality` job. The job names `quality`
and `e2e` are matched by exact string in the branch ruleset, so renaming one
silently detaches the required check.

---

## Deliberate non-goals

No database, CMS, authentication, admin dashboard, contact form, API routes,
state-management library, UI component library, animation framework, or
analytics. Each is excluded by an approved decision, not an oversight.

Docker is a post-launch enhancement and must not block launch.

---

## Where the boundaries allow change

Pages depend on selector functions rather than raw content arrays. A future
migration to a CMS, an API client, or a database replaces the selector
implementations without touching a single component.

That boundary exists because it is useful now — one filtering rule in one place
— not to imitate infrastructure the project does not have.
