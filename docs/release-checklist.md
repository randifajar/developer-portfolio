# Release Checklist

The ordered gate between the current repository and a public production site.
Each step must pass before the next. Nothing here is optional.

Source: Implementation Plan section 11, NFAC launch quality gate, and
`docs/governance/github-configuration.md` section 9.

---

## Before you start

Two facts govern everything below.

1. **Draft hides content from the website, not from GitHub.** The repository is
   public once visibility is switched, so every string in `src/content/` must
   already be safe to read directly, regardless of publication status
   (ADR-011).
2. **Release validation is expected to fail today.** It refuses Draft
   placeholder content by design. Step 2 passing for the first time is the
   signal that content work is genuinely complete — not an obstacle to work
   around.

---

## 1. Structural validation

```bash
npm run validate:content
```

Must exit 0. Enforces the fifteen cross-record rules: unique ids and slugs,
valid references, one active Resume, no Published private or restricted
content, complete Published projects, featured projects Published, unique
featured priorities, Production requiring confirmation, safe URLs, PDF resume
path, local media paths.

## 2. Release validation

```bash
SITE_URL=https://<production-domain> npm run validate:release
```

Must exit 0. This is the first time it ever should. It additionally requires:

- at least two Published projects
- both confirmed launch case studies Published
- exactly one active Published Resume
- a Published profile, experience, skills, and AI practices
- **no placeholder markers anywhere in public content**
- an absolute HTTPS `SITE_URL`
- email, LinkedIn, and GitHub links present
- a Published social sharing image

## 3. Content approval — Randi only

Read every Published string. Claude cannot perform this step: these are factual
claims about real work.

- [ ] Every claim is truthful and verifiable
- [ ] Personal contribution is separated from team contribution
      (NFAC-CONTENT-002)
- [ ] Delivery status matches reality. `Production` is used **only** where
      deployment was actually verified, and carries a `productionConfirmation`
- [ ] No invented metrics or numeric impact (FAC-PUBLISH-005)
- [ ] Resume, portfolio, and LinkedIn do not materially contradict each other
      on name, role, employer, dates, or contact details (NFAC-CONTENT-005)

## 4. Confidentiality review

Check the **working tree, Git history, and Actions logs** — not just the current
files. A file removed from the current branch remains in history.

```bash
git grep -n -i -E 'password|secret|token|api[_-]?key|private[_-]?key|mongodb|internal'
git grep -n -E '\b[A-Z]{2,}_[0-9]' $(git rev-list --all)
```

- [ ] No credentials, tokens, or keys
- [ ] No internal identifiers, ticket codes, or partner system names
- [ ] No internal URLs or private repository links
- [ ] No customer or student data
- [ ] No raw Claude, Codex, or ChatGPT session exports
- [ ] No unsanitized screenshots or restricted diagrams
- [ ] Each professional case study has documented owner confirmation
      (NFAC-PRIV-004)

### Public visibility switch

Only after step 4 passes **against history**, switch the repository from Private
to Public. Once public, hiding a file from the current branch does not remove it
from previous history.

## 5. Link validation

```bash
npm run check:links
```

Requires network access. Each destination is reported as one of four outcomes:

| Outcome | Meaning |
|---|---|
| `ok` | Requested and answered, or the file resolves in `public/` or an App Router route |
| `manual` | An automated request cannot answer this — see below |
| `pending` | Authored only in non-public content, so an absent target is expected |
| `BROKEN` | Publicly visible and unreachable. Exits non-zero |

`manual` is not a pass. LinkedIn answers automated requests with HTTP 999
regardless of whether the profile exists, and email deliverability cannot be
checked without sending mail. Both need a human.

- [ ] `npm run check:links` reports no `BROKEN` link
- [ ] Every `pending` link is intentional, not a file that was forgotten
- [ ] LinkedIn, GitHub, and the email action opened by hand and confirmed to
      resolve to the approved destinations

## 6. Resume validation

- [ ] `public/resume.pdf` exists and is a valid PDF
- [ ] Exactly one Resume record is active and Published
- [ ] `/resume.pdf` returns 200 in production
- [ ] The Resume opens in browsers that render PDFs inline and in those that
      download instead (NFAC-COMPAT-003)

## 7. Accessibility audit

```bash
npm run test:e2e
```

Automated scanning covers roughly a third of WCAG issues. It is a floor.

- [ ] Zero critical or serious axe findings on Home, Projects Index, one
      Project Detail, and Not Found
- [ ] **Manual keyboard pass**: every action reachable by Tab, focus always
      visible, mobile menu fully operable, no keyboard trap
- [ ] Colour contrast verified on any new colour pairing

## 8. Performance audit

Lighthouse against the deployed preview for Home, Projects Index, and one
Project Detail.

- [ ] LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms (NFAC-PERF-001, P0)
- [ ] Lighthouse Performance ≥ 90 (NFAC-PERF-002, P1). A lower score needs a
      documented reason and Product Owner approval — most likely cause is the
      hero photograph, so check its dimensions and format first

```bash
npm run audit:prod
```

- [ ] Critical vulnerabilities resolved; high-severity resolved or documented

## 9. Production smoke test

Deployment success is **not** acceptance (NFAC-CICD-004). Check the live site:

- [ ] `/` renders with correct identity and positioning
- [ ] `/projects` lists every Published case study
- [ ] Each Published Project Detail route opens directly, not only by clicking
      through
- [ ] `/resume.pdf` resolves
- [ ] Email, LinkedIn, and GitHub links work
- [ ] Mobile layout at 320px has no horizontal overflow
- [ ] An invalid route shows Not Found
- [ ] **No Draft content is reachable anywhere**
- [ ] Social preview renders correctly when the URL is shared

## 10. Rollback verification

Prove recovery works *before* it is needed.

### Hosting rollback

1. In Vercel, promote the previous deployment.
2. Confirm the site serves it.
3. Roll forward again.

### Source rollback

1. `git revert` the squash commit on a task branch.
2. Open a pull request to `production`, let CI run, merge.
3. Confirm the deployment reflects the revert.

Hosting rollback alone leaves source and production inconsistent (TD 25.2). Any
urgent hosting rollback must be followed by a source correction — otherwise
Vercel serves an older build while `production` still contains the change that
caused the problem, and the next merge silently reintroduces it.

**A pull request is the only route.** The `Protect production` ruleset blocks
direct pushes and requires `quality` and `e2e` to pass, so the fastest possible
source correction costs one full CI cycle. Budget for that rather than
discovering it mid-incident.

**Never amend or force-push to recover.** The repository is public, so
rewriting a pushed commit permanently publishes the pre-rewrite SHA to event
archives outside this repository's control. Always revert forward with a new
commit.

---

## After launch

Completed 2026-08-10. Recorded in [`release-audit.md`](release-audit.md).

- [x] Enable private vulnerability reporting (now that the repository is public)
- [x] Confirm Dependabot is opening pull requests — five raised, two merged,
      three closed by the version ceilings in `dependabot.yml`
- [x] Set repository description and topics

The `Protect production` ruleset, secret scanning, push protection, Dependabot
alerts and security updates, and CodeQL default setup were applied in the same
pass and verified through `GET /repos/.../rules/branches/production`, which
returns what GitHub actually evaluates.

Two Advanced Security sub-features — non-provider secret patterns and validity
checks — require a paid plan and are recorded as unavailable rather than as
done.
