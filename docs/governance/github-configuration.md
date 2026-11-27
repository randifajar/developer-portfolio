# GitHub Repository and Security Configuration

## 1. Repository Identity

Recommended settings:

| Setting | Value |
|---|---|
| Owner | `randifajar` |
| Repository | `developer-portfolio` |
| Default branch | `production` |
| Visibility during development | Private |
| Visibility before job applications | Public |
| Production hosting | Vercel |
| Vercel Production Branch | `production` |

Before changing visibility to Public, inspect all files, Git history, workflow
logs, releases, and assets for confidential information.

---

## 2. Rename `main` to `production`

> **Status: already complete.** This repository was created directly on
> `production`. No `main` branch has ever existed locally or on the remote, so
> the local rename and the remote deletion below must not be re-run. The
> procedure is retained for reference only. The GitHub default-branch setting
> still requires confirmation in the repository interface.

### Local branch

```bash
git branch -m main production
git push -u origin production
```

### GitHub

1. Open repository **Settings**.
2. Open **Branches** or **Default branch**.
3. Set `production` as the default branch.
4. Update open pull-request bases when necessary.
5. Confirm rulesets target `production`.
6. Confirm Actions workflows reference `production`.
7. Confirm Vercel uses `production`.

### Remove old branch

Only after all references are updated:

```bash
git push origin --delete main
```

Do not delete `main` before `production` is the GitHub default and all required
services have been updated.

### Search stale references

```bash
git grep -n -E '\bmain\b|dev-production'
```

Review:

- Workflow triggers
- Documentation
- Badges
- Deployment settings
- Scripts
- Raw GitHub URLs
- Branch-protection configuration

---

## 3. Merge Configuration

Under **Settings → General → Pull Requests**:

Enable:

- Allow squash merging
- Automatically delete head branches

Disable:

- Allow merge commits
- Allow rebase merging

Default squash message recommendation:

- Pull request title and commit details, or
- Pull request title only when the title follows Conventional Commits

---

## 4. Protect `production`

> **Plan limitation — not configurable while the repository is private.**
>
> Branch rulesets and branch protection are unavailable for private
> repositories on the GitHub Free plan. Both the rulesets API and the legacy
> branch-protection API return:
>
> ```text
> 403: Upgrade to GitHub Pro or make this repository public
>      to enable this feature.
> ```
>
> This section was written assuming the feature was available. It is not, so
> the checklist item moves to the public-visibility step in section 9 rather
> than being treated as an outstanding configuration mistake.
>
> **Until then, nothing technically prevents a direct push to `production`.**
> The prohibition in `git-workflow.md` section 8 is policy, not enforcement.
> The practical risk is limited — there is a single contributor, and CI still
> runs on every pull request — but the gap is real and should not be
> misremembered as protection that exists.
>
> Three ways to resolve it:
>
> 1. **Wait for public visibility.** Protection becomes available at no cost
>    the moment the repository is made public, which section 1 already plans
>    before job applications. Recommended.
> 2. **Upgrade to GitHub Pro.** Protection immediately, and it persists after
>    the repository becomes public.
> 3. Making the repository public early is **not** an acceptable workaround.
>    It would bypass the confidentiality gate in section 9.
>
> Configure the ruleset below as soon as the feature becomes available.

Create a branch ruleset:

```text
Name: Protect production
Target: production
Enforcement: Active
```

Enable:

- Restrict deletions
- Block force pushes
- Require a pull request before merging
- Required approving reviews: `0`
- Dismiss stale approvals when available
- Require conversation resolution
- Require status checks
- Require branch to be up to date
- Require linear history
- Prevent direct updates
- Apply to administrators when available

Do not configure a permanent bypass actor.

### Required status checks

Add these after the workflows exist and have run at least once:

```text
quality
e2e
```

Use the exact workflow job names. These match the two jobs defined in the
Technical Design CI workflow.

Dependency and secret protection are covered without a separate required check.
Dependabot alerts, secret scanning, and push protection are configured in
section 6, and the production dependency audit runs in three places:

| Where | When | Blocking |
|---|---|---|
| `ci.yml` job `audit` | every pull request and push | no |
| `security-audit.yml` | daily, 21:00 UTC | no — **opens an issue on failure** |
| `npm run release:check` | manually, at a release | yes, locally |

**The `audit` job is deliberately not a required status check.** Adding it would
mean an advisory published upstream overnight blocks every merge — including the
revert needed to recover from an unrelated incident, which the 2026-08-17
rollback rehearsal measured at seven minutes only because nothing else was in
the way. A dependency audit fails for reasons that have nothing to do with the
pull request in front of it.

This is a change from the original arrangement, where the audit ran *only* at a
release. A high-severity `nanoid` advisory consequently reached `production`
through thirteen consecutive green CI runs and was found by hand on 2026-08-16.
Visibility on every change was the gap; blocking every change was never the fix.

**Visibility was not enough either.** From 2026-09-03 to 2026-11-15 the scheduled
audit failed 69 days running while production ran Next.js under critical
advisories, and nobody saw it: a failed scheduled workflow only sends an email.
It was still correct to keep it non-blocking. What it lacked was a way to reach a
person. A failure now opens a GitHub issue, labelled `security-audit` and assigned
to the repository owner; later failures update the same issue in place and only
comment when the set of advisories changes, and the first passing run closes it.
It is one of two workflow files in this repository that request write access, and
only to issues; the other is `smoke-check.yml` below. (CodeQL default setup is
configured by GitHub, not by a file here, and carries its own scopes.)

**The site's own address is checked the same way (DEC-077).** `smoke-check.yml`
runs `npm run smoke:live` after each successful Production deployment and once a
day. It checks that the live site answers at its canonical address and declares
that address everywhere: canonical URLs, `og:url`, the sitemap, `robots.txt`, the
résumé, a 404 for an unknown route, and no Draft title. A failure opens an issue
labelled `smoke-check`, in the same way and with the same drill. It exists
because of the 2026-11-17 entry in `docs/release-audit.md`: a renamed Vercel
project released the site's old alias, and the site kept declaring it canonical.

**Prove it still works rather than assuming it.** Dispatch the workflow manually
with `drill` checked: it skips the audit, forces the failure path, and opens an
issue labelled `security-audit-drill`. Then dispatch it again without the drill:
that run should close the drill issue. An alert that has never fired cannot be
told apart from one that is broken.

Randi remains the only merge authority by project policy, even when GitHub
requires zero external approvals.

### Protect `staging`

Added 2026-11-18 with the `staging` branch (`git-workflow.md` section 2).
Configure it before the first promotion:

```text
Name: Protect staging
Target: staging
Enforcement: Active
```

Enable:

- Restrict deletions
- Block force pushes

Deliberately not enabled:

- **Require a pull request, or require status checks.** The sync merge from
  `production` is pushed directly (`git-workflow.md` section 10). A ruleset that
  requires status checks only accepts commits whose checks already passed on
  another ref, so either setting would reject that push. CI still runs on every
  pull request into `staging` and on every push to it.
- **Require linear history.** The sync merges are merge commits.

Restricting deletion matters most at promotion. `staging` is the head branch of
the promotion pull request, and automatic head-branch deletion would otherwise
remove it.

---

## 5. GitHub Actions Configuration

Under **Settings → Actions → General**:

### Actions permissions

Allow actions required by approved workflows.

Prefer pinned or trusted first-party actions.

### Workflow permissions

Use:

```text
Read repository contents permission
```

Each workflow must declare the minimum additional permission it requires.

Do not enable broad write permissions by default.

### Fork pull requests

Because this is a personal portfolio:

- Do not expose secrets to pull requests from forks
- Require approval before running workflows from untrusted contributors
- Never run untrusted pull-request code with production deployment credentials

---

## 6. Security and Analysis

Enable every feature available under the current GitHub plan:

- Dependency graph
- Dependabot alerts
- Dependabot security updates
- Secret scanning
- Push protection
- Code scanning
- Private vulnerability reporting after the repository becomes public

> **Several of these are also plan-restricted on a private repository.**
>
> Secret scanning, push protection, and code scanning are GitHub Advanced
> Security features and are generally unavailable on a private repository on
> the Free plan. Dependabot version updates work regardless — the configuration
> in `.github/dependabot.yml` is already opening pull requests — but Dependabot
> *alerts* are a separate toggle.
>
> Enable whatever the plan currently offers, and re-check this list when the
> repository becomes public, at which point the remainder become available at
> no cost. Do not record an unavailable feature as enabled.

### Dependabot

Use `.github/dependabot.yml`.

Review automated pull requests normally.

Do not merge a dependency update solely because it was opened by Dependabot.

Require:

- CI pass
- Changelog review
- Breaking-change review
- Production dependency audit
- Preview verification when behavior may change

### Secret protection

Before every public release or visibility change, search:

```bash
git grep -n -i -E 'password|secret|token|api[_-]?key|private[_-]?key|mongodb|internal'
```

Also inspect Git history and workflow logs manually.

---

## 7. Repository Features

Recommended Version 1 settings:

| Feature | Setting |
|---|---|
| Issues | Disabled initially |
| Discussions | Disabled |
| Wiki | Disabled |
| Projects | Disabled |
| Sponsorships | Disabled |
| Releases | Use only when a release process is approved |

Enable Issues later when the repository has outside users or contributors.

---

## 8. Vercel Configuration

Connect:

```text
randifajar/developer-portfolio
```

Set:

```text
Production Branch: production
```

Expected behavior:

- `production` creates Production Deployments
- Task branches create Preview Deployments
- Pull requests display Preview URLs
- GitHub Actions remains the required code-quality gate

### `staging`

To Vercel, `staging` is an ordinary branch: it builds Preview Deployments, and
the branch's stable Preview URL always serves its latest commit. Nothing about
it touches the Production Deployment.

Observed on 2026-11-18 on this project's Preview Deployments: they redirect
visitors to Vercel's login (Vercel Authentication) and are served with
`X-Robots-Tag: noindex`. Staging is therefore visible to the account owner and
kept out of search results without further configuration.

Which `SITE_URL` a staging build sees depends on whether the variable is scoped
to Preview as well as Production. Unset, it falls back to
`http://localhost:3000` (`src/lib/environment.ts`), which leaves canonical and
social URLs on staging pointing nowhere useful. Check once on the first staging
deployment; setting `SITE_URL` for Preview, scoped to the `staging` branch,
fixes it.

Production environment:

```text
SITE_URL=https://<approved-production-domain>
```

No secret environment variable is required for Version 1.

---

## 9. Public Visibility Gate

Before switching the repository from Private to Public:

- Run structural content validation
- Run release validation
- Run secret scanning
- Inspect all assets
- Inspect Git history
- Inspect GitHub Actions logs
- Confirm raw AI sessions are absent
- Confirm company documents are absent
- Confirm internal URLs are absent
- Confirm private repository URLs are absent
- Confirm customer and student data are absent
- Confirm active Resume is intentionally public
- Confirm repository description and topics
- Confirm License decision

Once a repository becomes public, hiding a file from the current branch does
not remove it from previous Git history.

### Immediately after switching to Public

These become available at no cost the moment visibility changes, and are easy
to forget precisely because the switch feels like the finish line:

- [ ] Create the `Protect production` ruleset from section 4 — this is the item
      deferred by the plan limitation, and the repository has been running
      without enforced branch protection until now
- [ ] Add `quality` and `e2e` as required status checks
- [ ] Enable secret scanning and push protection
- [ ] Enable code scanning
- [ ] Enable private vulnerability reporting

Enabling protection *after* going public leaves a window where the repository
is both public and unprotected. Do this first, before announcing the URL or
sending it with any job application.

---

## 10. Recommended Repository Metadata

### Description

```text
Personal developer portfolio showcasing my backend engineering experience,
projects, and AI-assisted development workflow.
```

> **Corrected in v1.1 (Issue 2).** This read "backend-focused full-stack
> experience". The repository description is a public, recruiter-visible
> surface — it sits at the top of the repository page and in GitHub search
> results — but it is a repository *setting*, not a tracked file, so the
> positioning sweep that covered `src/`, `README.md`, and `package.json` could
> not have found it. The live setting was updated on 2026-08-12; this block is
> the source of truth for it.

### Topics

```text
portfolio
developer-portfolio
nextjs
react
typescript
tailwindcss
vitest
playwright
github-actions
vercel
ai-assisted-development
```
