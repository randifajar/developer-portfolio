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

---

## 2026-08-10 — P32 rollback drill and post-launch closure

### Hosting rollback: verified

Randi promoted the previous deployment in Vercel, confirmed the site served
it, and rolled forward again. Straightforward, with nothing behaving
unexpectedly.

Confirmed independently after the drill: all six public routes return 200,
`index, follow` is intact, the Hero and Work Experience render, the sitemap
holds four entries, and no draft marker appears. The roll-forward restored the
site completely rather than partially, which is the failure mode worth checking
and the reason it was checked rather than assumed.

### Source rollback: not exercised

`docs/release-checklist.md` section 10 defines two paths. Only the hosting one
was run.

That is worth stating plainly rather than recording P32 as complete. TD 25.2 is
explicit: a hosting rollback alone leaves source and production inconsistent.
Vercel would be serving an older build while `production` still contains the
change that caused the problem, so the next merge silently reintroduces it. The
hosting rollback buys time; the source correction is what actually resolves an
incident.

Two things about that path are now different from when the checklist was
written, and both make it *more* important to have rehearsed:

- The `Protect production` ruleset requires a pull request with `quality` and
  `e2e` green. A revert can no longer be pushed directly, so recovery takes at
  least one full CI cycle.
- Amending or force-pushing is no longer available as a shortcut. The
  repository is public, so rewriting a pushed commit would permanently publish
  the pre-rewrite SHA. Reverting forward is the only correct move.

The practical consequence: **the fastest possible source correction is a revert
pull request through CI.** That is a known, bounded cost, but it is not
instant, and discovering it during an incident would be the wrong time.

### Post-launch checklist closed

| Item | State |
|---|---|
| Private vulnerability reporting | **Enabled** — it was still off after the section 9 pass and was caught here |
| Dependabot opening pull requests | Confirmed: five raised, two merged, three closed by the deliberate version ceilings in `dependabot.yml` |
| Repository description and topics | Set; eleven topics |
| LinkedIn and email actions | Confirmed manually by Randi. Neither can be settled automatically — LinkedIn answers any non-browser client with HTTP 999 |

### Standing state

Open pull requests: none. Dependabot, CodeQL, and secret-scanning alerts: zero
each. `validate:release`, `audit:prod`, and `check:links` all pass. CI green on
`production`.

### Outstanding, deliberately

| Item | Status |
|---|---|
| Source rollback rehearsal | Not done. The one gap in P32 |
| P33 Docker portability | Deferred by decision. Vercel does not accept container images, so Docker here would demonstrate portability rather than deliver anything. `architecture.md` already scopes it as a post-launch enhancement and the Handoff lists mandatory Docker as a non-goal |

---

## 2026-08-12 — v1.1 corrective release, closed

| | |
|---|---|
| Commits audited | `68a96d0`, `72854ec`, `61df24b`, `66eae95` on `production` |
| Deployment | `https://developer-portfolio-delta-three.vercel.app` |
| Content state | All launch content Published. No content added or removed in this release |
| Purpose | Close the seven issues in `V1.1_HANDOFF.md`, and record what running them surfaced |

This is the §21 completion report the v1.1 handoff asks for. It is here rather
than in its own file because the four v1 entries above are the record of what
this project found by actually running things, and v1.1 belongs in that
sequence rather than beside it.

### What shipped

| Issue | Outcome | Pull request |
|---|---|---|
| 1 — README accuracy | Corrected before v1.1 formally opened | #41 |
| 2 — Backend-first positioning | Eight locations, not one | #42 |
| 3 — Neutral opportunity wording | `Open to remote opportunities` → `Open to opportunities` | #42 |
| 4 — Shorter About | **No work needed.** See below | — |
| 5 — Homepage hierarchy | Work Experience now precedes Selected Projects | #43 |
| 6 — Project card scanability | Role moved above summary, labelled "My role" | #44 |
| 7 — AI section visual weight | Emphasis background removed, cards denser | #45 |

Suite: 397 tests in 25 files → **408 in 28**. End-to-end unchanged at 149
passed with 1 documented skip, across three engines.

### Issue 4 required no work, and saying so mattered

The handoff lists "About section too long" as an issue. Measured before editing:
the body was already **126 words** against a 100–150 target. The handoff was
describing the earlier, longer summary and had not been updated after it
changed.

Nothing was cut on that basis. The summary did shorten to 110 words, but only
as a consequence of removing the "currently looking for remote…" closer that
Issue 3 required — not to satisfy a length target that was already met.

The handoff's own instruction covers this: it states product intent, the
repository is the technical source of truth, and a conflict is reported rather
than guessed at.

### The positioning lived in eight places, and one of them was not a file

Issue 2 reads as a content edit. It was not. The title was duplicated across
`profile.ts`, `site.ts`, `opengraph-image.tsx`, `media.ts`, the About heading,
`README.md`, `package.json` — and the **GitHub repository description**.

That last one is the instructive case. It is a public, recruiter-visible
surface at the top of the repository page and in search results, and it is a
repository *setting*. A `grep` across the working tree — the check that found
the other seven — could not have found it, because it is not in the tree. It
was caught by reading `github-configuration.md`, which carries the approved
description text, and noticing the live setting still disagreed.

The live setting was updated on 2026-08-12 and the governance document now
matches it.

### Four decisions were being held in place by nothing

The finding that recurred across every issue in this release, stated plainly:
four approved, documented, implemented decisions had **no test**. Each could
have been silently undone by an ordinary refactor with the whole suite green.

| Decision | How it was held | Now |
|---|---|---|
| Homepage section order | Nobody had reordered the JSX | `homepage-order.test.tsx` |
| Project card field order | Presence tests that pass under any sequence | `project-card-order.test.tsx` |
| Social card derives from content | A comment claiming it did | `opengraph-card.test.ts` |
| Corrected-assumption evidence | A conditional branch no fixture triggered | `homepage-sections.test.tsx` |

The social card is the sharpest of the four. Its source comment said it was
generated from configuration *"so it cannot drift out of sync with the name and
positioning shown on the site itself."* Only the name was read; the
professional title and location line were string literals. Because the card
renders to a PNG, no assertion on page text reached them, and the one string a
test *could* have reached — the `alt` export — carried the same stale literal.
It would have gone on advertising the v1 positioning in every link preview
after the site itself had moved on.

The corrected-assumption branch is the quietest. It renders conditionally and
no fixture ever supplied one, so the block had never executed in any test — and
it could have been dropped during the Issue 7 density pass with every check
still passing. It is the least flattering content in the AI section and the
most load-bearing: the difference between claiming AI output is verified and
showing an instance where verification caught something.

Every one of the four new gates was confirmed by breaking what it guards and
observing the failure, not by watching it pass.

### Two approved specifications asserted things that had stopped being true

| Document | What it said | Resolution |
|---|---|---|
| **FAC-PROFILE-001** (P0) | The page must display "Remote-work availability" | Amended to require *availability* without dictating its form. The neutral wording Issue 3 required could not satisfy the criterion as written |
| **PRD 1.2**, **Product Model 1.4/1.5** | Positioning as Backend-Focused Full-Stack Developer, stated as *current* intent | Amended in place |

A P0 acceptance criterion being amended is not routine, and it was raised
explicitly in #42 rather than folded in quietly.

The FAC, UX/UI specification, implementation plan and reference plan still
carry the old positioning. That is deliberate: they are dated records of what
v1 decided, not claims about what is true now.

Six decisions were superseded rather than overwritten, using the ledger's
existing convention, so the original rows keep their text and remain legible:

```text
SUP-002  positioning                SUP-005  homepage section order
SUP-003  target roles               SUP-006  project card order and label
SUP-004  availability wording       SUP-007  AI section visual weight
```

A test named `(FAC-PROFILE-002)` for location and availability was in fact
asserting FAC-PROFILE-001; `-002` is the photograph criterion. Corrected while
amending the requirement it pointed at.

### Issue 7 asked a question, so it got measured

The handoff asked whether the AI section's treatment gave it more weight than
Work Experience or Projects. That is a question, not a premise. Measured at
1280px before any change:

| Section | Height | Share | Background |
|---|---:|---:|---|
| Work Experience | 2079px | 36.1% | muted |
| **AI-Assisted Engineering** | **1206px** | **21.0%** | **muted** |
| Selected Projects | 734px | 12.8% | plain |
| Technical Skills | 656px | 11.4% | plain |

Yes, on two counts: 64% taller than Projects, and one of only two sections
carrying a filled background — so the evidence sections sat on plain background
while the section about *tooling* was promoted alongside employment history.
There is no alternating-band pattern in the page and no recorded rationale for
the two that had one.

After: **1134px, 20.0%, +54% over Projects, plain background.** Verified again
against production after merge. Exactly one section now carries the emphasis
background, and it is Work Experience.

Height parity was not pursued and is explicitly not a goal. Four practices
carrying activity, tool, purpose, human responsibility, verification method and
a corrected assumption is that much content, and reaching 734px would mean
deleting the disclosure the section exists to make. Inlining the three
sub-block headings would have saved a further ~120px, taken from exactly the
content the handoff says to preserve and from its heading semantics. UX 7.8
now records this so it is not relitigated: reduce prominence, not honesty.

### Corrections made during this release

Recorded because the standing rule is to correct plainly rather than quietly.

| Claim | Correction |
|---|---|
| "Five tests will break on the positioning change" | Seven did. Two asserted `/remote/i` and the AI tool names — neither contains the old title, so grep never saw them. Only running the suite found them |
| "`navigation-links.ts` needs the same swap" | Imprecise. Its first entry targets the `/projects` route, not a section anchor, so it is not part of the section order. The swap was still made, for a different reason: the other four entries do mirror the homepage |
| "Nothing asserted the order" (#43) | True of the homepage, not the header. `layout-chrome.test.tsx` already asserted the navigation inventory and caught the change on the first run |
| "Tool disclosure is unguarded" (#45) | It is not. `homepage-sections.test.tsx` already asserted `Claude Code` renders. Only the corrected-assumption branch was uncovered |
| "`check` fails on the merged tree" (#42 verification) | Wrong. A `next start` process left running held a lock on the SWC binary and `npm ci` failed — with its output suppressed. No code problem |

### Standing state

Open pull requests: none. Dependabot, CodeQL, and secret-scanning alerts: zero
each. `npm run check` exit 0 with 408 passing; `npm run test:e2e` exit 0 with
149 passing and 1 documented skip; `audit:prod` exit 0; `check:links` exit 0
with the same two links that always need a human. CI green on `production`.

`validate:release` exits 1 in a plain local shell because `SITE_URL` is unset,
and exits 0 once it is supplied — which is how `release-audit.yml` runs it. An
environment gap, not a content one, but worth writing down so the next person
to see that failure does not go looking for a defect that is not there.

Live verification after each merge covered the rendered document rather than
the source: section order by element id, heading sequence, header link order
including anchors resolving from a Project Detail page, the social card PNG
fetched and viewed, all routes, byte-identical unknown-slug responses, robots
and noindex state, and a sweep confirming **zero** stale positioning strings.

### Outstanding after v1.1

| Item | Status |
|---|---|
| Source rollback rehearsal | **Still not done.** v1.1 merged four pull requests through the normal path and none of them was a `git revert`, so four further opportunities to rehearse it passed unused. Carried forward from P32 and `V2_HANDOFF.md` §9 |
| P33 Docker portability | Deferred by decision, unchanged |
| `remoteAvailability` field name | Now holds "Open to opportunities", so the name is misleading. Renaming touches schema, selectors, components and tests for no reader-visible gain; left to v2 deliberately (SUP-004) |
| Specification drift | The FAC, UX/UI spec, and both plans still describe the v1 positioning as historical record. Intentional, but a reader who opens them cold will need SUP-002 to interpret them |

---

## 2026-08-16 — v2 "Performance Engineering" release, closed

| | |
|---|---|
| Commits audited | `9867be2` … `2ec9d00` on `production` — thirteen squash merges, PRs #47–#59 |
| Deployment | `https://developer-portfolio-delta-three.vercel.app` |
| Content state | All content Published. **No content was added, removed, or reworded in v2** |
| Purpose | Close the v2 UI/UX evolution governed by `V2_HANDOFF.md` and `V2_HANDOFF_PRD.md`, and record what running the gate surfaced |

v2 is a redesign that changed no claims. That is the most important line in this
entry: every employer, date, title, metric and technology on the site is the one
Randi approved in v1, and the two open content questions raised during v2 both came
back "no change". A visual release is exactly where invented detail creeps in to fill
a layout, and none did.

### What shipped

| Phase | Outcome | PR |
|---|---|---|
| — | v2 design analysis, 27 sections, with a measured visual baseline | #47 |
| — | UX/UI specification v2.0, mockups, review gate | #48 |
| 2a | Three surface tokens and a contrast gate — **zero visual change** | #49 |
| 2b | Archivo display face and a nine-step tokenised type scale | #50 |
| 2c | Motion tokens, reduced-motion, three accessibility gaps closed | #51 |
| 2c | Hero points at Experience; "full-stack" dropped from Contact | #52 |
| 3 | The `Section` primitive; hero and header on dark | #53 |
| 4 | Work Experience grouped by employer | #54 |
| 5 | Selected Work as editorial modules; index adapted | #55 |
| 6 | Fast-scan layer on Project Detail | #56 |
| 8 | Page closes on dark; social card palette derived from the tokens | #57 |
| 9 | Responsive widths and 200% zoom gated instead of eyeballed | #58 |
| 7 | Skills and AI Workflow surfaces; SUP-007 finally enforced | #59 |

Suite: **408 tests in 28 files → 436 in 32.** End-to-end **149 → 211** across three
engines, 2 documented skips. Seven new test files, every one added because something
was being held in place by nothing.

### The release gate failed twice, and only one was the repository's fault

`npm run check` and `npm run test:e2e` were green on the merged tree. `npm run
release:check` — those two plus `validate:release`, `check:links` and `audit:prod` —
exited **1**.

**First failure: mine.** `SITE_URL is not set`. Production has it set; the canonical
link, `og:url` and every `sitemap.xml` entry are absolute and correct. I had run the
command without the environment that `release-checklist.md` line 41 documents.
Recorded because the failure text is identical to what a genuinely misconfigured
production would produce, and the difference is only visible if you go and look at
the deployed page instead of reading the error.

**Second failure: real.** `nanoid@3.3.17`, high severity, reached through
`next@16.3.0 → postcss@8.5.23 → nanoid`. Fixed by `npm update nanoid` to **3.3.18**:
postcss declares `^3.3.16`, so the patched version was already inside the permitted
range. Three lines of `package-lock.json`, no Next bump, no `overrides` entry, and
none of the deliberate `dependabot.yml` ceilings touched. `audit:prod` then reported
`found 0 vulnerabilities`.

Worth stating plainly: **`quality` and `e2e` never run `audit:prod`.** All thirteen
v2 pull requests passed CI with that advisory outstanding, because the dependency
audit lives only in `release:check`, which only runs at a release. The vulnerability
was not reachable in a way that mattered for a static portfolio, but the structural
point stands — CI being green for thirteen consecutive merges said nothing at all
about dependency security.

### The performance measurement was wrong the first time

First Lighthouse pass against production: Home **86**, Projects 91, Detail 88 — below
the ≥ 90 of NFAC-PERF-002.

It was taken while `release:check` was building the site and driving three browser
engines on the same machine. The 2026-08-09 entry above records this exact trap in
the opposite direction, where a cold-deployment reading produced a pessimistic risk
assessment that a warm re-measurement disproved. Re-run on an idle machine, three
runs per route:

| Page | Runs | Median | LCP | CLS |
|---|---|---:|---|---|
| Home | 88, 90, 92 | **90** | 2.3–2.4 s | 0 |
| Projects Index | 90, 92, 92 | **92** | 2.0–2.2 s | 0–0.006 |
| Project Detail | 91, 92, 90 | **91** | 2.1–2.3 s | 0 |

Accessibility, Best Practices and SEO: **100 on all three pages.**

NFAC-PERF-001 (P0) passes with room: LCP ≤ 2.4 s against a 2.5 s limit, CLS
effectively zero against 0.1. NFAC-PERF-002 (P1) passes **at the median with no
headroom** — Home's median is exactly 90, and one of its three runs scored 88.

The LCP element is the hero photograph, which the release checklist names as the
first thing to suspect. It transfers at **16 KB**, so payload is not the cost.

v2 added exactly one webfont — Archivo, the display face; Geist was already the body
face in v1.1. The two together transfer **63 KB**, and the stylesheet blocks render
for 150 ms. So the v2-shaped candidate is roughly half of that 63 KB plus whatever
the surface system added to the stylesheet, not the whole of either.

This is not a launch blocker — it is a P1 that passes — but "passes at exactly the
threshold" is worth writing down, because the next change that adds a kilobyte to the
critical path will be the one that breaks it, and it will look like that change's
fault.

### Four documents were describing a product that no longer existed

Not found by a tool. Found by reading the documents the release was supposed to be
closing, which is the only way this class of defect is ever found.

| Document | Said | Was |
|---|---|---|
| `PORTFOLIO_UX_UI_SPEC_v2.0.md` | "Proposed. Awaiting the PRD §78 design review gate" and **"Nothing here is implemented"** | Every rule in it live in production |
| `src/content/media.ts` | "Media Assets — DRAFT … every asset here is Draft, and the referenced files do not exist yet" | Both assets Published; the photograph is production's measured LCP element |
| Decision Ledger, open decisions | Seven items, all "Open Decision" | Four resolved on 2026-08-08 and left unmarked for eight months |
| Decision Ledger, confirmed decisions | Fifty-seven rows | **None** mentioning a surface, a typeface, a type scale, a contrast floor, or motion |

This is v1.1 Issue 1 again — the public `README.md` announcing a site that was "not
yet deployed" long after launch — and it recurred inside a release whose own handoff
opened by cataloguing how stale `V2_HANDOFF.md` had become. The pattern is not
carelessness about documents. It is that **a document's status line is the one part
of it that nothing ever executes.** Prose describing behaviour eventually gets
contradicted by the running site; a header saying "Proposed" is contradicted by
nothing, forever.

All four are corrected in this release, and the seven v2 design decisions are now
DEC-049 through DEC-055 with their approval basis recorded — Randi's merge of the
pull request that implemented each.

### A stated process that was not followed, and should not have been

The v2.0 specification instructed: *"Implementation PRs update citations in the files
they touch."* Seventeen files carrying v0.1 `UX n.n` citations were modified during
v2. **Not one v0.1 citation was replaced.** Seven of the seventeen gained a `UX2`
citation alongside the old one; the other ten gained nothing.

The instruction was not followed, and following it would have made the repository
worse. `globals.css` cites `UX 4.4` precisely in order to record that v0.1
recommended `#64748B`, that the colour measured **4.34:1**, and that it was rejected.
Rewriting that citation to `UX2 2` would delete the reason the token is what it is,
and leave a number with no provenance for someone to later "simplify".

What actually emerged in practice — add the current rule, keep the historical one —
is the correct behaviour, and it happened in seven files without ever being written
down. Some citations point at a governing rule and some are deliberately historical,
and no find-and-replace can tell them apart. So the instruction is now replaced by
the mapping table as the sole resolution mechanism, and the table was completed: it
covered fifteen sections while code cited seven more, meaning a reader following a
citation into v0.1 had no way to learn whether what they found there still applied.

The ten files that gained nothing are not a defect to fix in bulk. They are a reason
the mapping table has to be complete, which it now is.

### A number that was never counted

Both halves of the Layer A rule said the case study made a reader scroll through
"fifteen sections". Counted on the live site: **twelve** `h2` sections on the personal
project, thirteen on the sanitised professional one, the difference being a
conditional screen-reader-only confidentiality heading.

The fifteen came from v0.1 UX 9.5, which does list fifteen ordered items — but three
of them are not deep sections. Technology Stack moved into Layer A during Phase 6,
Confidentiality Note is an `sr-only` heading, and Related Navigation is a `nav`
landmark. The figure was inherited and repeated, never counted.

It mattered here more than a wrong number usually does, because the sentence was
Layer A's own justification. The feature is right; the case made for it overstated
the problem by three sections.

### What v2 gated that v1 did not

| Now enforced | Previously |
|---|---|
| Contrast, 93 pairs against the shipping `globals.css`, in `quality` | axe only, which cannot see a `color-mix` against `transparent` — the cause of v1's second contrast failure |
| AI section never more emphatic than Experience or Selected Work (SUP-007) | **Nothing.** Measured once in pixels during v1.1, then held by nothing at all |
| Homepage surface sequence, and section omission | Nothing |
| Project detail fast-scan order, by real vertical position in a browser | Nothing |
| Reduced motion, including `animation-timeline` | Nothing; a blanket duration override cannot stop a progress-driven timeline |
| Seven viewport widths and 200% zoom | Manual review |
| Type scale tokenisation and `rem`-based `clamp()` | Nothing |

Each was verified by breaking what it guards and watching it fail. SUP-007 is the one
worth naming: promoting AI Workflow to `dark` fails with `expected 3 to be less than
or equal to 1`, and to `neutral` with `expected 2 to be less than or equal to 1`.
Since Phase 3 that assertion had been printing `SUP-007 rank rule not yet enforceable`
because two of its three inputs had no surface yet — so its silence proved nothing
until Phase 7 supplied the third.

### Production verification

| Check | Result |
|---|---|
| `/`, `/projects`, both case studies, `/resume.pdf`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | all 200, correct content types |
| `/projects/does-not-exist`, `/projects/draft`, `/admin` | all 404 |
| Surface sequence, read from the deployed page | `dark → dark → light → dark → light → neutral → light → dark → dark`, **0 sections without a surface** |
| Neutral token as served | `--color-background:#eaeff5`, identical to the local capture |
| Identity and positioning | "Backend Developer" throughout; no "full-stack" on the homepage |
| Contact targets | `randifajar2307@gmail.com`, `github.com/randifajar`, `linkedin.com/in/randifajar` — match DEC-014, 015, 016 |
| Draft content reachable | None exists — all 26 content records are `published` |

LinkedIn returns HTTP 999 to automated requests. That is its standard anti-bot
response rather than a broken link, but it does mean no automated check can confirm
it — the checklist's manual "open by hand" step is the only thing that can, and it
remains Randi's to do.

### Outstanding after v2

| Item | State |
|---|---|
| Source rollback rehearsal | **Still not done.** v2 merged thirteen more pull requests and not one was a `git revert`, so thirteen further opportunities passed unused. Carried since v1 P32, now across three releases |
| Q9 — project diagram schema field | Deferred. Listed as blocking implementation; implementation completed without it. Nothing to render until a diagram is sanitised (OPEN-006) |
| Q10 — `remoteAvailability` rename | Deferred by v1.1 to v2, and by v2 to nothing. Twice-deferred is worth closing as a decision either way |
| Home Lighthouse headroom | Median exactly 90 against a P1 floor of 90 |
| `audit:prod` outside CI | The nanoid advisory survived thirteen green CI runs. Moving the audit into `quality`, or adding a scheduled run, would close it |
| OPEN-003, OPEN-006, OPEN-007 | Third project, safe project visuals, custom domain — genuinely open |
| `V2_HANDOFF_PRD.md` | Still untracked, pending Randi's decision on whether it is published |
