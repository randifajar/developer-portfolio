# Git Governance Setup Checklist

Items are checked only when verified. Repository-visible items can be confirmed
from the working tree and Git history. Items marked *interface* must be
confirmed in the GitHub or Vercel web interface and cannot be verified from the
repository.

## Local and GitHub Branch

- [x] Create repository `randifajar/developer-portfolio`
- [x] Use `production` as the local branch
- [x] Push `production`
- [ ] Set `production` as GitHub default — *interface*
- [x] Remove stale `main` references
- [x] Delete remote `main` only after verification — not applicable; no `main`
      branch has ever existed on this remote

## Repository Instructions

- [x] Place `CLAUDE.md` at repository root
- [x] Place the skill under `.claude/skills/following-git-workflow/`
- [x] Place governance documents under `docs/governance/`
- [x] Place pull-request template under `.github/`
- [x] Place Dependabot config under `.github/`

## Pull Requests and Merge

*All items in this section are configured in the GitHub interface.*

- [ ] Enable squash merge only
- [ ] Enable automatic branch deletion
- [ ] Disable merge commits
- [ ] Disable rebase merge

## Ruleset

*All items in this section are configured in the GitHub interface.*

- [ ] Create `Protect production`
- [ ] Require pull requests
- [ ] Require conversation resolution
- [ ] Require linear history
- [ ] Block force pushes
- [ ] Block deletion
- [ ] Require branch up to date
- [ ] Set approvals to zero for solo ownership
- [ ] Add status checks after workflows exist

## Security

*All items in this section are configured in the GitHub interface.*

- [ ] Enable dependency graph
- [ ] Enable Dependabot alerts
- [ ] Enable Dependabot security updates
- [ ] Enable secret scanning when available
- [ ] Enable push protection when available
- [ ] Enable code scanning after code exists
- [ ] Restrict default Actions token permissions

## Vercel

*All items in this section are configured in the Vercel interface.*

- [ ] Connect the GitHub repository
- [ ] Set Production Branch to `production`
- [ ] Confirm task branches create Preview Deployments
- [ ] Confirm merge to `production` creates Production Deployment
- [ ] Set production `SITE_URL`
