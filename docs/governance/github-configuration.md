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

---

## 10. Recommended Repository Metadata

### Description

```text
Personal developer portfolio showcasing my backend-focused full-stack
experience, engineering projects, and AI-assisted development workflow.
```

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
