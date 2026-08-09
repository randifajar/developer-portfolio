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

---

## 2026-08-09 — P31 production verification, post-launch

| | |
|---|---|
| Commit audited | `847deda` on `production` |
| Deployment | `https://developer-portfolio-delta-three.vercel.app` |
| Content state | **Launch complete.** Profile, three Work Experience records, both case studies, twelve skills, four AI practices, and the active Resume all Published |
| Purpose | Verify the launched site rather than infer it from a green deployment (NFAC-CICD-004) |

### The gate that had never passed

```text
npm run release:check → exit 0
```

`release:check` failed for the entire build, and that failing was the mechanism
that made developing against placeholder content acceptable (ADR-006). This is
the first time every stage has passed end to end.

| Stage | Result |
|---|---|
| `format:check`, `lint`, `typecheck` | pass |
| `validate:content` | pass |
| `test:run` | pass, 397 tests |
| `build` | pass, both project routes emitted |
| `validate:release` | **pass — first time** |
| `check:links` | pass, no broken link |
| `test:e2e` | pass, 149 tests on three engines |
| `audit:prod` | pass, 0 vulnerabilities |

### Indexing reversed itself, as designed

`isPubliclyLaunchReady()` is derived from content — a Published profile and at
least two Published projects (DEC-030). Publishing the second case study
flipped it with no configuration change, which is what the design was for:
nobody had to remember to enable indexing at launch, and nobody could enable it
early by hand.

Verified live:

| | Before launch | After |
|---|---|---|
| `robots` meta | `noindex, nofollow, nocache` | `index, follow` |
| `robots.txt` | `Disallow: /` | `Allow: /` plus a `Sitemap:` line |
| Sitemap entries | 3 | 4 — both case studies present |

### Lighthouse, launched site

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Home | 97 | 100 | 100 | **100** |
| Projects Index | 98 | 100 | 100 | **100** |
| Project Detail (professional) | 97 | 100 | 100 | **100** |

Core Web Vitals, Home: LCP **1.6 s**, CLS **0.005**, TBT **180 ms** — inside
NFAC-PERF-001. No failing SEO audit.

**A prediction that did not hold.** Implementation plan risk R-04 anticipated
that a large hero photograph would threaten the ≥ 90 Lighthouse requirement,
and a reading taken immediately after the photograph deployed showed
performance 92 and LCP 2.5 s, exactly at the threshold. That was recorded as
having no headroom left.

Re-measured on a warm deployment the same page scores 97 with LCP 1.6 s. The
earlier figure was a cold-deployment artefact, not a content cost. The useful
correction is about method rather than about the photograph: **a single
measurement taken immediately after a deploy is not a baseline**, and treating
one as such produced a risk assessment that was wrong in the pessimistic
direction.

### Production smoke checks (TD 24.5)

| Check | Result |
|---|---|
| `/`, `/projects`, both case studies, `/resume.pdf` | all 200 |
| `/resume.pdf` content type | `application/pdf` |
| Open Graph title, url, image, type | present; image 200 `image/png` |
| GitHub profile link | 200 |
| LinkedIn profile link | 999 — anti-bot challenge, **requires manual confirmation** |
| Unknown route | 404, and no word suggesting hidden content exists (DEC-047) |
| Security headers | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` all present |
| Draft markers in rendered HTML | 0 |

### Still outstanding after launch

| Item | Owner | Note |
|---|---|---|
| Manual confirmation of the LinkedIn and email actions | Randi | No automated request can settle either; release-checklist step 5 |
| Repository visibility switch to Public | Randi | The repository is **still private**. The live site is public; its source is not |
| `Protect production` ruleset, secret scanning, push protection, code scanning | Randi | All 403 on GitHub Free while private. They unlock the moment visibility changes, and `github-configuration.md` section 9 requires enabling them **first**, before the URL is sent anywhere |
| P32 rollback drill | Randi | Vercel rollback is interface-only |
| P33 Docker portability | Post-launch | Cannot be verified in the current environment; Docker is not installed |

The gap worth naming: the site is launched and indexable while the repository
that produces it has no enforced branch protection. Nothing prevents a direct
push to `production` today. That has been true for the whole build and was
acceptable while the site was invisible; it is less acceptable now.

---

## 2026-08-10 — Public visibility gate and an accepted risk

| | |
|---|---|
| Repository | Public as of this date |
| Trigger | `github-configuration.md` section 9 |

### An exposure found at the gate, and the decision taken

Plan risk R-05 recorded that an amended commit left an unreachable object
server-side, and said to re-confirm it at the public-visibility gate. Confirmed
there: `ff7e735cce0eab952d3c679256936ae8f26646a6` is served by GitHub and
contains the pre-sanitisation development plan.

The exposure is three internal identifiers belonging to Randi's employer — a
project code, a system name, and a feature code — in two lines of one planning
document. Everything else in that commit is byte-identical to public history:
the diff against the current root is `1 file changed, 2 insertions, 2
deletions`. No credential, customer data, source code, or architecture detail
is involved.

The repository was briefly returned to private while this was assessed, which
closed anonymous access, and then made public again.

**Randi accepted the residual risk rather than requesting garbage collection.**
The decision is recorded here with its evidence so it reads as a judgement
rather than an oversight.

Evidence supporting the decision:

| Question | Answer |
|---|---|
| Reachable from any branch or tag? | No — unreferenced |
| Carried by a network `git clone`? | **No** — verified by cloning and checking |
| Present in the commit list, history, or code search? | No |
| Forks | 0 |
| Repository views during the public window | 0 |
| Discoverable without the exact 40-character SHA? | No |
| Was the SHA ever published? | **No.** The commit was authored and amended while the repository was private, so it never entered GitHub's public event firehose |

The counter-argument, recorded because it was real: the identifiers belong to
an employer rather than to Randi, and the fix — one support request, with the
site unaffected throughout — was close to free. The recommendation at the time
was to request garbage collection. Randi weighed it and chose otherwise.

### A rule this creates

The reason that object is undiscoverable is that it was orphaned **while the
repository was private**. GitHub does not publish events for private
repositories, so the pre-amend SHA was never emitted anywhere.

That protection no longer applies. From now on, **amending or force-pushing a
pushed commit publishes the pre-rewrite SHA permanently**, to event archives
outside this repository's control. Fix forward with a new commit instead. This
is not a style preference; it is the only reason the current exposure is
containable.

### Section 9 checklist, applied

| Item | State |
|---|---|
| `Protect production` ruleset | **Active.** Deletion, force-push, and non-linear history blocked; pull request required with conversation resolution; squash-only merges; `quality` and `e2e` required; branch must be up to date |
| Bypass actors | **None** — the ruleset applies to the owner as well |
| Secret scanning | Enabled |
| Push protection | Enabled |
| Dependabot alerts and security updates | Enabled |
| Code scanning | CodeQL default setup configured |
| Repository topics | 11 set |
| Non-provider secret patterns, validity checks | **Not enabled** — Advanced Security extras requiring a paid plan. Recorded as unavailable rather than as done |

Verified against `GET /repos/.../rules/branches/production`, which returns the
rules GitHub will actually evaluate, rather than trusting that creating the
ruleset was enough.

The prohibition on direct pushes to `production` has been policy since the
first governance commit. As of today it is enforcement.
