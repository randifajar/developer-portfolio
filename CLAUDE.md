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

## Merge Authority

Claude may prepare commits, push a task branch, and create or update a pull
request when authorized.

Claude must not merge a pull request into `production` without Randi Fajar
Wicaksono's explicit approval in the current conversation.

## Confidentiality

Never commit raw Claude, Codex, or ChatGPT sessions, company documents,
credentials, internal URLs, private screenshots, customer or student data,
private repository content, or Restricted evidence.
