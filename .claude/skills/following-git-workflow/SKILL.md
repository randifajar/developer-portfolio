---
name: following-git-workflow
description: Use when creating branches, staging files, committing, pushing, rebasing, opening or merging pull requests, preparing releases, or changing GitHub repository settings in this project.
---

# Following Git Workflow

## Core Rule

`production` is the only long-lived branch. Never work directly on it.

Before any Git write action:

1. Run `git status --short --branch`.
2. Confirm no unexpected files or changes exist.
3. Fetch the remote.
4. Create or switch to a short-lived task branch.
5. Keep the branch limited to one objective.

## Branch Names

Use:

- `feat/<scope>`
- `fix/<scope>`
- `hotfix/<scope>`
- `test/<scope>`
- `docs/<scope>`
- `refactor/<scope>`
- `chore/<scope>`

Use lowercase kebab-case. Never use `main`, `dev-production`, `changes`,
`update`, or similarly vague names.

## Before Commit

1. Review `git diff` and `git diff --staged`.
2. Remove unrelated files.
3. Stop if secrets, private evidence, internal URLs, raw AI sessions, customer
   data, or student data appear.
4. Run the checks relevant to the changed scope.
5. Use a Conventional Commit message.
6. Never add an AI co-author trailer unless explicitly requested.

## Push and Pull Request

- Never push directly to `production`.
- Never force-push `production`.
- Never bypass hooks or required checks.
- Never use plain `--force`.
- Use `--force-with-lease` on a task branch only after explicit approval.
- Every production change goes through a pull request.
- Follow `.github/pull_request_template.md`.

## Merge Boundary

Claude must stop before merge unless Randi explicitly approves merging the
specific pull request in the current conversation.

Use squash merge only. Delete the task branch after merge.

## Completion Report

Report:

- Branch
- Commits
- Checks run and results
- Pull-request state
- Confidentiality review
- Remaining risks
- Whether merge approval is still required

## Full Policy

Read and follow:

- `docs/governance/git-workflow.md`
- `docs/governance/github-configuration.md`
