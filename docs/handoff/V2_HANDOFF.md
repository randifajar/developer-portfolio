# Portfolio v2 Handoff — UI/UX Improvement

**From:** Version 1, shipped and live · **To:** whoever builds Version 2
**Written:** 2026-08-10 · **v1 final commit:** `81cd81a`

---

## 0. Read this first

Version 1 is **live, indexed, and complete**. It is not a prototype and not a
draft. Every route serves real content, every gate passes, and the case study
published on the site makes verifiable claims about how the repository works.

Version 2 is scoped to **UI and UX**. That scope is narrower than it sounds,
because much of what looks like presentation in this codebase is actually a
requirement with a test behind it. This document exists so you find that out
now rather than when CI turns red.

The single most useful thing to understand: **this project's checks are
adversarial on purpose.** Tests are written to fail when content or behaviour
changes, so that a change is always a reviewed diff. When something breaks, the
first question is not "how do I make this pass" but "is this test telling me
something true".

---

## 1. What Version 1 is

A statically generated portfolio for Randi Fajar Wicaksono, a backend-focused
full-stack developer. Its purpose is to get him interviews.

| | |
|---|---|
| Live | `https://developer-portfolio-delta-three.vercel.app` |
| Repository | `randifajar/developer-portfolio`, public |
| Hosting | Vercel, production branch `production` |
| Routes | `/`, `/projects`, `/projects/[slug]`, `/resume.pdf`, Not Found |
| Content | 1 profile · 3 work experience · 2 case studies · 12 skills · 4 AI practices · 1 resume |
| Tests | 397 unit and component · 149 end-to-end on three engines |
| Lighthouse | performance 97–98 · accessibility 100 · best practices 100 · SEO 100 |

### Stack

```
next 16.3.0          react 19.2.8         typescript 6.0.3
tailwindcss 4.3.3    zod 4.4.3            vitest 4.1.10
@playwright/test 1.62.1                   eslint 9.39.5 (pinned, see below)
```

Two version ceilings are deliberate and documented in `.github/dependabot.yml`:
TypeScript is held below 7 because typescript-eslint refuses to load against
it, and ESLint is held below 10 because `eslint-config-next` bundles a plugin
calling a removed API. Dependabot will keep proposing both. Do not accept them
without checking the upstream blockers first.

---

## 2. The architecture, in one pass

```
src/content/*.ts          Typed content modules, parsed by Zod at import
        ↓
src/domain/content/       Schemas, cross-record validation, selectors
        ↓
src/components/           Server Components receiving already-filtered data
        ↓
src/app/                  Routes, metadata, sitemap, robots
```

**The selector layer is the only path from content to pages.** A lint rule
(`no-restricted-imports`, scoped to `src/app/**` and `src/components/**`)
forbids importing `@/content` directly. That boundary is what makes the
confidentiality guarantee structural rather than a thing someone must remember.

If a component needs data it cannot get from a selector, add a selector. Do not
reach past the boundary, and do not add a carve-out to the lint rule.

Everything is a Server Component except `MobileNavigation`. That is the only
`"use client"` in the project. Adding interactivity in v2 means adding a
deliberate, minimal client boundary — not converting a section.

---

## 3. Invariants v2 must not break

These are not preferences. Each has a requirement ID, a test, and in most cases
a defect in the history that caused it to exist.

### 3.1 Confidentiality

- The repository is **public**. Draft status hides content from the website; it
  does not hide it from GitHub. Every string in `src/content/` must be safe to
  read directly.
- An unpublished project has **no route**. `dynamicParams = false` plus
  `generateStaticParams()` means its absence is what hides it, not a runtime
  check. An unknown slug and an unpublished slug return **byte-identical**
  responses (DEC-047, FAC-NAV-006), asserted end to end.
- No internal identifier, partner system name, internal URL, or customer data
  in any content field. Asserted by test, not only by review.

### 3.2 Truthfulness

- `deliveryStatus` describes reality. `production` requires a verified
  `productionConfirmation` (TD 9.5, FAC-PROJECT-004). The portfolio project
  carries one; the professional case study deliberately does not.
- Personal and team responsibility render as **visually distinct blocks**
  (FAC-PROJECT-003). A merged list silently attributes a team's work to Randi.
  If you redesign the Project Detail layout, this separation survives the
  redesign.
- No invented metrics anywhere. Several fields say so explicitly in comments.

### 3.3 Accessibility

- WCAG 2.2 AA. The axe scan blocks on critical and serious findings **plus an
  explicit always-blocking set**: `page-has-heading-one`, `heading-order`,
  `landmark-one-main`, `html-has-lang`, `region`.
- That extra set exists because two routes once shipped with **no `h1` at
  all**. Axe rates a missing page heading as *moderate*, so the severity-based
  threshold let it through. Tool severity describes how badly a rule breaks a
  page in general; it does not know which requirements this project treats as
  launch-blocking.
- Empty sections omit themselves entirely rather than rendering a heading with
  nothing under it (FAC-HOME-005).

### 3.4 Indexing

`isPubliclyLaunchReady()` is derived from content — a Published profile and at
least two Published projects (DEC-030). It drives both `robots.txt` and the
`robots` meta tag. Do not hardcode either. The switch flipped itself at launch,
which was the point.

---

## 4. Traps specific to UI/UX work

This section is the reason this document exists. Everything below has already
cost time once.

### 4.1 Tailwind v4 configures through CSS, not a config file

Design tokens live in `src/app/globals.css` inside `@theme static`. There is no
`tailwind.config.js` and adding one will not do what you expect.

The `static` keyword is load-bearing. Without it Tailwind tree-shakes tokens it
cannot see used, and **seven of fourteen tokens vanished** the first time. If a
token stops generating a utility, check that first.

### 4.2 Colour contrast has failed twice, the same way both times

| Pairing | Measured | Required |
|---|---|---|
| `--color-text-muted` on background | 4.34:1 | 4.5:1 |
| Base accent on a 10% tint of itself | 4.31:1 | 4.5:1 |

Both were caught by the axe scan, not by eye, and both were within 4% of
passing. **Any colour paired with a tint of itself needs measuring**, because
the tint carries the same hue and the ratio collapses.

There is a contrast calculator pattern in the git history if you need one; the
short version is that eyeballing a palette does not work at these margins.

### 4.3 Heading levels are typed, and the type was once wrong

`SectionHeader` takes `level: 1 | 2 | 3 | 4`. It originally omitted `1`, which
is how two routes shipped without an `h1`. `ProjectCard` takes
`headingLevel?: 2 | 3`.

If you restructure the page hierarchy, the tests asserting exactly one `h1` per
route will tell you immediately. Believe them.

### 4.4 Image dimensions must be true

The media record states `400x400` because that is the image's real size. It
previously claimed `800x800`, which makes Next.js reserve the wrong space and
reintroduces the layout shift the `width`/`height` pair exists to prevent.

CLS is currently **0.005**. If it moves, check this first.

### 4.5 Do not trust a single post-deploy performance measurement

A Lighthouse run taken immediately after a deploy showed **92 / LCP 2.5 s**, and
that was recorded as a risk with no headroom. Re-measured warm, the same page
scores **97 / LCP 1.6 s**.

Measure warm, measure more than once, and do not treat a cold-deployment
reading as a baseline.

### 4.6 `textContent` concatenates without separators

A test asserted `/\bProduction\b/` did not appear in a section. It could never
fail: the rendered text reads `...Personal projectProduction. Verified...`, and
there is no word boundary between `project` and `Production`.

**Prefer role queries and attributes over text scanning.** Where you must scan
text, remember adjacent elements run together.

---

## 5. How to work in this repository

### 5.1 Branch protection is enforced, not advisory

The `Protect production` ruleset is **active with no bypass actors** — it
applies to the repository owner too.

- Direct pushes to `production` are refused
- Pull request required, **squash merge only**
- `quality` and `e2e` must pass, branch must be up to date
- Linear history required, force pushes and deletions blocked

### 5.2 Never amend or force-push

The repository is public. Rewriting a pushed commit permanently publishes the
pre-rewrite SHA to event archives outside this repository's control. **Fix
forward with a new commit, always.**

This is not stylistic. An amended-away commit from before the repository went
public still exists server-side; it is containable only because it was orphaned
while the repository was private. That protection no longer applies.

### 5.3 Merge authority

**Claude must never merge a pull request.** Randi merges every one, explicitly,
per pull request. Passing CI is necessary and not sufficient. No AI co-author
trailers unless he asks for them.

### 5.4 Commands

```bash
npm run check          # format, lint, typecheck, validate:content, tests, build
npm run test:e2e       # Playwright, three engines, against a production build
npm run release:check  # check + validate:release + check:links + e2e + audit:prod
```

`npm run check` runs on every pull request. `release:check` does not — which is
precisely how four defects survived in it for months. See section 7.

---

## 6. The tests are deliberately brittle

Several tests assert the **current** publication state and are written to fail
when it changes. That is intentional: it makes every content transition a
reviewed diff rather than something that happens quietly.

If a test fails after a content change, read it before editing it. The question
is whether the new state is correct, not how to make the assertion green.

Files that behave this way:

- `tests/content/selectors-real-content.test.ts`
- `tests/content/modules.test.ts`
- `tests/content/release-validation.test.ts`
- `tests/components/homepage-empty-state.test.tsx`

### Two tests once passed for the wrong reason

Worth knowing, because it is the failure mode hardest to see:

- A fixture spread a real project to build a negative case. When the real
  project gained the field being tested, the spread carried it across and the
  rule stopped firing. The test passed while exercising nothing.
- The `textContent` word-boundary assertion in 4.6 could never fail.

**When you write an assertion that matters, break the thing it guards and
confirm it complains.** Both defects were found that way, and only that way.

---

## 7. What v1 learned the hard way

Five lessons are published in the case study on the live site. They are there
because they are true, and because a reader can verify each one against this
repository. Do not soften them in v2.

1. **Encoding a rule beats remembering it.** Confidentiality requirements
   became validation failures rather than a checklist.
2. **Verifying each part is not verifying the whole.** Two branches each passed
   their own checks and broke CI on merge.
3. **A local check that does not reproduce CI is worse than none.** A Windows
   checkout and a Linux runner disagreed on line endings; every local
   "verified" was meaningless until `.gitattributes` normalised it.
4. **A quality threshold encodes a judgement, and that judgement can be
   wrong.** See 3.3.
5. **A gate that has never run is not a gate.** Running the release pipeline end
   to end for the first time found four problems, every one because a check had
   never been executed: an unrun dependency audit hiding three high-severity
   advisories, a link validator whose script file had never been written, a
   workflow never once dispatched, and a 404 no test in the project could see.

The sharper form, learned after those were published: **a gate that never runs
and a gate that always passes are indistinguishable from outside.** Both are
green.

---

## 8. Where the truth lives

| Question | Document |
|---|---|
| How the system is put together | `docs/architecture.md` |
| How to write and publish content | `docs/content-authoring.md` |
| Branching, commits, merge rules | `docs/governance/git-workflow.md` |
| Repository and security settings | `docs/governance/github-configuration.md` |
| Launch gate, step by step | `docs/release-checklist.md` |
| What was audited and found, dated | `docs/release-audit.md` |
| Requirements, decisions, UX spec | `docs/product/` |
| The v1 build plan, 33 phases | `docs/plans/2026-08-04-portfolio-implementation-plan.md` |
| The original v0 handoff | `docs/handoff/CLAUDE_HANDOFF.md` |

`docs/release-audit.md` is the most useful of these for context. It records
four dated audits including what was found, what was decided, and what was
deliberately not done.

---

## 9. Open items inherited by v2

| Item | State |
|---|---|
| Source rollback rehearsal | **Not done.** Vercel rollback was drilled; the `git revert` through a PR path was not. Now costs one full CI cycle under the ruleset |
| P33 Docker portability | Deferred by decision. Vercel does not accept container images, so Docker here demonstrates portability rather than delivering anything |
| Advanced Security sub-features | Non-provider secret patterns and validity checks require a paid plan. Recorded as unavailable, not as done |
| Custom domain | Deferred (OPEN-007). Currently a Vercel subdomain |
| An unreachable pre-sanitisation commit | Exists server-side, contains three of the employer's internal identifiers. Randi accepted the residual risk with reasoning recorded in `release-audit.md`. Do not reopen without reading that entry |

---

## 10. Suggested shape for v2

Advice, not instruction. Randi decides scope.

**Start by reading the live site as a recruiter would**, on a phone, in thirty
seconds. The content is strong and verifiable; the presentation is deliberately
restrained ("Quiet Engineering", UX §4). Whether that restraint still serves him
is exactly the question v2 exists to ask.

**Change presentation, not the content model.** The selector boundary, the
three independent axes, and the validation layers are what make the case study
true. A UI change that requires weakening them is the wrong change.

**Re-measure after every visual change.** Contrast and CLS are both currently
at values that took work to reach, and both have regressed before.

**Expect the brittle tests to fail, and read them.** They are the mechanism that
made v1 safe to build against placeholders. They will do the same for v2.

---

## 11. First session checklist

```bash
git clone https://github.com/randifajar/developer-portfolio.git
cd developer-portfolio
npm ci
npm run check          # expect exit 0, 397 tests
npm run test:e2e       # expect 149 passed, 1 skipped
```

The one skip is a documented WebKit platform default on skip-link focus, not a
defect.

Then read, in this order: this document, `docs/architecture.md`,
`docs/release-audit.md`, and the live case study at
`/projects/personal-developer-portfolio` — which describes the system you are
about to change, in Randi's own published words.
