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

Dependency and secret protection are covered without a separate required check:
the production dependency audit runs inside `npm run release:check`, and
Dependabot alerts, secret scanning, and push protection are configured in
section 6.

Randi remains the only merge authority by project policy, even when GitHub
requires zero external approvals.

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
