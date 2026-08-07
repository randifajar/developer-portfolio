# Release Audit Evidence

Record of the P29 release audit: running the full launch gate while content is
still Draft, to confirm the gate works and to find defects before they become
launch-day surprises.

This file is appended to, not overwritten. Each run is dated so the trend is
visible and so P31 has a baseline to compare against.

---

## 2026-08-08 — pre-launch dry run

| | |
|---|---|
| Commit audited | `5995d7e` on `production` |
| Deployment | `https://developer-portfolio-delta-three.vercel.app` |
| Content state | 1 of 2 launch case studies Published; profile, experience, skills, AI practices, and resume all Draft |
| Purpose | Prove the gate refuses to launch, and find what breaks when the gate is actually run |

### Results

| Check | Command | Result |
|---|---|---|
| Structural validation | `validate:content` | pass |
| Release validation | `validate:release` | **fail, 7 blockers — expected and correct** |
| Production dependency audit | `audit:prod` | fail → **resolved**, see findings |
| Link validation | `check:links` | crashed → **resolved**, see findings |
| Unit and component tests | `test:run` | pass, 295 tests |
| End-to-end and accessibility | `test:e2e` | pass, Chromium + Firefox + WebKit |
| Lighthouse | manual | pass on performance and accessibility, see below |
| `release-audit.yml` workflow | `workflow_dispatch` | ran correctly; failed only at release validation, as designed |

`validate:release` failing is the entire point of this exercise. It is the
mechanism that let the site be built against placeholder content for 27 phases
without any of it reaching production (ADR-006). A passing release validation
before P30 would mean the gate was broken.

### Launch blockers reported

All 7 require content that only Randi can author or supply:

1. Fewer than two Published projects
2. Jury Process Management Integration not Published
3. No active Published Resume
4. Professional Profile is Draft
5. No Published Work Experience
6. No Published Technical Skill
7. No Published AI-Assisted Engineering Practice

### Lighthouse

Chrome 32-bit headless against the live deployment, categories at default
weighting.

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Home `/` | 96 | 100 | 96 → **100** | 66 |
| Projects Index `/projects` | 96 | 100 | 96 → **100** | 66 |
| Project Detail `/projects/personal-developer-portfolio` | 97 | 100 | 96 → **100** | 66 |

Core Web Vitals, all three pages:

| Metric | Home | Projects | Detail | Target (NFAC-PERF-001) |
|---|---|---|---|---|
| First Contentful Paint | 1.2 s | 0.9 s | 0.9 s | — |
| Largest Contentful Paint | 2.2 s | 1.9 s | 2.0 s | ≤ 2.5 s ✅ |
| Cumulative Layout Shift | 0 | 0 | 0 | ≤ 0.1 ✅ |
| Total Blocking Time | 200 ms | 190 ms | 180 ms | — |
| Speed Index | 1.5 s | 2.2 s | 2.2 s | — |

**Performance exceeds the ≥ 90 threshold (NFAC-PERF-002) on every page**, and
this is before the professional photograph lands. R-04 in the implementation
plan anticipated a large hero image putting that at risk, so re-measure after
the photograph is added rather than assuming the headroom survives.

**Accessibility is 100 on every page.** Automated scanning is not a substitute
for the manual keyboard pass in `release-checklist.md` step 7.

**SEO 66 is deliberate and expected.** The only failing audit is
`is-crawlable: Page is blocked from indexing` — the site carries
`noindex, nofollow, nocache` until launch, because a half-built portfolio being
indexed is worse than not being indexed at all. This score is meaningless until
`isPubliclyLaunchReady()` returns true, and must be re-measured at P31.

Best Practices was 96 on every page from a single missing favicon; see findings.

### Findings and resolutions

**1. Three high-severity advisories — resolved (PR #16)**

`audit:prod` exited 1. `next@16.2.12` reached vulnerable `postcss` (XSS via
unescaped `</style>`, GHSA-qx2v-qp2m-jg93) and `sharp` (libvips
CVE-2026-33327, CVE-2026-33328, CVE-2026-35590, CVE-2026-35591). Both
transitive. Upgraded to `next@16.3.0`, a minor bump, preserving exact pinning.
Result: 0 vulnerabilities.

**2. `check:links` referenced a script that did not exist — resolved (PR #17)**

`npm run check:links` crashed with `ERR_MODULE_NOT_FOUND`.
`scripts/check-links.ts` was declared in `package.json` and wired into
`release:check`, but had never been written. The launch gate therefore contained
a step that could not pass, and `release-checklist.md` step 5 instructed a
reader to run a command that always crashed.

It hid because `check:links` is not part of `npm run check` — only of
`release:check`, which nothing had run end to end until this audit.

**3. `/favicon.ico` returned 404 on every route — resolved (PR #18)**

Found by Lighthouse, not by any existing test. It logged a browser console
error on all three page types and cost four points of Best Practices. Fixed
with a generated `src/app/icon.tsx`.

Worth recording: the Playwright console-error assertions added alongside the
fix do **not** catch this defect. Headless Chromium under automation never
requests `/favicon.ico`, so there is nothing for them to observe. Only Lighthouse
saw it. This is a standing argument for keeping Lighthouse in the release gate
rather than assuming the e2e suite covers the same ground.

**4. `release-audit.yml` had never been dispatched — resolved (this change)**

The workflow was written in P27 and never run. The first dispatch behaved
correctly, but revealed two gaps: it never invoked `check:links`, and its
summary claimed Lighthouse could not be automated because Vercel was not
connected, which stopped being true at P28.

### Pattern across findings 2, 3, and 4

Each was a check that existed on paper and had never been executed in the
configuration that mattered. This is the same shape as two earlier defects in
this project: a build that passed locally and failed in CI on line endings, and
two branches that each passed alone and broke CI on merge.

The lesson is consistent — **a gate that has never run is not a gate**, and the
only way to find out is to run it before you need it to work.

### Deferred, with reasons

| Item | Why not now |
|---|---|
| Automating Lighthouse in CI | Needs a third-party action to drive Chrome. `github-configuration.md` section 5 prefers pinned first-party actions, so this is a deliberate decision, not a side effect of an audit fix |
| Production smoke checks in the workflow | Belongs with P31, where the checklist defines what "verified" means |
| `Protect production` ruleset | Returns 403 on GitHub Free for a private repository. Tracked in `github-configuration.md` section 9 |

### Next

P30 content finalization. Every remaining blocker is content. Two of them —
the professional photograph and `public/resume.pdf` — now surface in
`check:links` as `pending`, so they are visible from the gate rather than only
from release validation.

Re-run this audit at P31 against the launched site, when SEO becomes meaningful
and the photograph makes performance worth re-measuring.
