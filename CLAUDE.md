# Project Instructions

## Git Governance

Before creating or changing branches, staging files, committing, pushing,
rebasing, opening pull requests, merging, releasing, or changing repository
settings, follow:

@docs/governance/git-workflow.md

For GitHub repository settings and security configuration, follow:

@docs/governance/github-configuration.md

## Mandatory Branch Rule

`production` is the only long-lived and production branch.

Never modify application or documentation files directly on `production`.
Create a short-lived task branch first.

This is now enforced as well as required. The `Protect production` ruleset is
active with no bypass actors, so it applies to the repository owner too: pull
request required, squash merge only, `quality` and `e2e` must pass, linear
history, force pushes and deletions blocked.

## Never Rewrite Pushed History

This repository is public. Amending or force-pushing a commit that has been
pushed permanently publishes the pre-rewrite SHA to event archives outside this
repository's control.

Fix forward with a new commit. Always. There is no shortcut worth this, and
recovery during an incident is exactly when the temptation appears — see the
rollback section of `docs/release-checklist.md`.

## Merge Authority

Claude may prepare commits, push a task branch, and create or update a pull
request when authorized.

Claude must not merge a pull request into `production` without Randi Fajar
Wicaksono's explicit approval in the current conversation. Passing CI is
necessary, never sufficient. Approval of one pull request is not approval of the
next.

## Verification Before Pushing

Never report that a check passed without having observed its output.

Run the whole gate, not the convenient part of it:

```bash
npm run check      # format, lint, typecheck, validate:content, tests, build
npm run test:e2e   # three engines, against a production build
```

Unit tests passing is not the suite passing — a change with green unit tests
once broke CI because the end-to-end suite was not run. After a merge, verify
the merged tree rather than the branch: two branches that each pass alone can
break the moment they meet.

For an assertion that guards something important, break what it guards and
confirm it complains. Two tests in this repository were green for the entire
build while testing nothing.

## Content Truthfulness

Never invent a professional claim: employer, dates, job title, metric, outcome,
or the technologies used on a specific project. If a fact is missing, ask for
it. A bracketed question is better than a confident guess.

`deliveryStatus` describes reality, and `production` requires a verified
`productionConfirmation` (FAC-PROJECT-004, TD 9.5). Personal and team
responsibility render as separate blocks so shared work is never read as
individual work (FAC-PROJECT-003).

See `docs/content-authoring.md` before editing anything under `src/content/`.

## Confidentiality

Never commit raw Claude, Codex, or ChatGPT sessions, company documents,
credentials, internal URLs, private screenshots, customer or student data,
private repository content, or Restricted evidence.
