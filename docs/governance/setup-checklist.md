# Git Governance Setup Checklist

Items are checked only when verified. Repository-visible items can be confirmed
from the working tree and Git history. Items marked *interface* must be
confirmed in the GitHub or Vercel web interface and cannot be verified from the
repository.

Items marked **blocked** are not available on the current GitHub plan while the
repository is private. They are not outstanding mistakes — see
`github-configuration.md` section 4.

## Local and GitHub Branch

- [x] Create repository `randifajar/developer-portfolio`
- [x] Use `production` as the local branch
- [x] Push `production`
- [x] Set `production` as GitHub default — verified via API
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

*Configured in the GitHub interface. Verified via API 2026-08-04.*

- [x] Enable squash merge only
- [x] Enable automatic branch deletion
- [x] Disable merge commits
- [x] Disable rebase merge

The eleven pull requests merged before this was configured landed as merge
commits. That history is left as it is; rewriting it would be more disruptive
than the inconsistency is worth.

## Ruleset

**Blocked — branch rulesets and branch protection are unavailable for private
repositories on the GitHub Free plan.** Both the rulesets API and the legacy
branch-protection API return `403: Upgrade to GitHub Pro or make this repository
public`.

Until this is resolved, nothing technically prevents a direct push to
`production`. The prohibition in `git-workflow.md` section 8 is policy, not
enforcement.

Complete these **immediately** after switching the repository to Public, before
sending the URL with any job application:

- [ ] Create `Protect production` — *blocked*
- [ ] Require pull requests — *blocked*
- [ ] Require conversation resolution — *blocked*
- [ ] Require linear history — *blocked*
- [ ] Block force pushes — *blocked*
- [ ] Block deletion — *blocked*
- [ ] Require branch up to date — *blocked*
- [ ] Set approvals to zero for solo ownership — *blocked*
- [ ] Add status checks `quality` and `e2e` — *blocked*; both job names are
      already known to GitHub from repeated green runs, so they will appear in
      the picker as soon as rulesets are available

## Security

*Configured in the GitHub interface. Several are also plan-restricted while the
repository is private.*

- [ ] Enable dependency graph
- [ ] Enable Dependabot alerts
- [x] Enable Dependabot security updates — version updates confirmed working;
      `.github/dependabot.yml` is opening pull requests
- [ ] Enable secret scanning when available — *likely blocked while private*
- [ ] Enable push protection when available — *likely blocked while private*
- [ ] Enable code scanning after code exists — *likely blocked while private*
- [ ] Restrict default Actions token permissions — the CI workflow already
      declares `permissions: contents: read` at workflow level, so this setting
      is defence in depth rather than the only control

## Vercel

*Configured in the Vercel interface. Verified against the live deployment
2026-08-04.*

- [x] Connect the GitHub repository
- [x] Set Production Branch to `production` — merges to `production` deploy
      automatically, confirmed
- [ ] Confirm task branches create Preview Deployments — not yet observed; the
      next task branch will show whether previews are enabled
- [x] Confirm merge to `production` creates Production Deployment
- [x] Set production `SITE_URL` — confirmed live: canonical links, sitemap, and
      Open Graph tags all use the production domain rather than the localhost
      fallback
