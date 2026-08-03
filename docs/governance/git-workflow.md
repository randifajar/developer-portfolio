# Git Branching and Delivery Workflow

## 1. Purpose

This policy defines how all portfolio changes move from local work to the
production website.

The goals are:

- Protect the production branch
- Keep changes reviewable
- Prevent confidential content from entering Git history
- Require automated validation
- Preserve a clean and understandable history
- Give Randi final merge authority

---

## 2. Branch Model

### Long-lived branch

```text
production
```

`production` is:

- The GitHub default branch
- The Vercel Production Branch
- The source of the public production website
- Protected from direct modification

There is no permanent `main`, `develop`, `development`, or `dev-production`
branch in Version 1.

Vercel Preview Deployments cover non-production branches.

### Short-lived task branches

| Prefix | Use |
|---|---|
| `feat/` | New user-facing or technical capability |
| `fix/` | Defect correction |
| `hotfix/` | Urgent production correction |
| `test/` | Test-only changes |
| `docs/` | Documentation-only changes |
| `refactor/` | Behavior-preserving restructuring |
| `chore/` | Tooling, dependency, or repository maintenance |

Examples:

```text
feat/project-content-schema
feat/homepage-hero
fix/private-project-routing
hotfix/broken-resume-link
test/project-publication-validation
docs/update-technical-design
refactor/project-selectors
chore/configure-github-actions
```

### Naming rules

Branch names must:

- Use lowercase letters, numbers, and hyphens
- Describe one clear scope
- Start from an approved prefix
- Avoid personal names and ticket-free generic wording

Forbidden examples:

```text
update
changes
new-branch
test123
randi-work
dev-production
final
final-v2
```

---

## 3. Starting Work

Before changing files:

```bash
git status --short --branch
git fetch --prune origin
```

Confirm:

- Current branch
- Working-tree state
- Remote state
- No unexpected untracked or modified files
- No confidential files inside the repository

Create a task branch from current `production`:

```bash
git switch production
git pull --ff-only origin production
git switch -c feat/example-scope
```

Do not use `git pull` without an explicit strategy.

Do not begin task work on `production`.

---

## 4. Scope Discipline

Each branch and pull request has one primary objective.

Allowed together:

- Feature implementation and its tests
- A bug fix and its regression test
- A configuration change and its documentation
- A refactor and tests proving preserved behavior

Separate branches are required for unrelated work.

Do not hide opportunistic dependency upgrades, formatting of unrelated files,
or unrelated refactoring in a feature pull request.

---

## 5. Commit Rules

### Commit format

Use Conventional Commit-style messages:

```text
feat: add project content validation
fix: prevent draft project routes from rendering
test: cover production status confirmation
docs: add portfolio publishing workflow
refactor: separate project selection from rendering
chore: configure pull request checks
```

Optional scope:

```text
feat(projects): add adjacent project navigation
fix(resume): handle unavailable PDF
```

### Before every commit

Run:

```bash
git status --short
git diff
git diff --staged
```

Confirm:

- Only intended files are staged
- No secret or confidential material is included
- Generated output is excluded unless intentionally tracked
- Relevant tests and checks pass
- The commit message describes the result, not the editing activity

### Co-author policy

Do not add AI co-author trailers by default.

Forbidden unless Randi explicitly requests it:

```text
Co-Authored-By: Claude ...
Co-Authored-By: Codex ...
Co-Authored-By: ChatGPT ...
```

---

## 6. Confidentiality Gate

Stop before commit when any staged or tracked content includes:

- `.env` or secret environment values
- API keys, tokens, passwords, private keys
- Database connection strings
- Internal company URLs
- Private repository URLs
- Customer or student data
- Raw Claude, Codex, or ChatGPT sessions
- Internal company documents
- Unsafe screenshots
- Private project evidence
- Restricted diagrams
- Proprietary source code

`.gitignore` prevents new accidental tracking. It does not erase committed
history.

When a secret may have entered Git history:

1. Stop pushing.
2. Report the exposure.
3. Rotate the secret.
4. Remove it from current files and history using an approved method.
5. Re-run secret checks.
6. Continue only after verification.

---

## 7. Validation Before Push

Run checks relevant to the change.

After the project is initialized, the normal complete check is expected to be:

```bash
npm run check
```

Release-impacting changes may also require:

```bash
npm run release:check
```

At minimum, report:

- Formatting
- Lint
- Type check
- Unit/component tests
- Production build
- E2E tests when relevant
- Accessibility checks when relevant
- Content validation
- Confidentiality review

Do not claim checks passed unless their output was observed.

---

## 8. Push Rules

Push only the task branch:

```bash
git push -u origin <task-branch>
```

Never:

```bash
git push origin production
git push --force origin production
git push --no-verify
```

Remote history rewriting is exceptional.

If Randi explicitly approves rewriting a task branch:

```bash
git push --force-with-lease
```

Plain `--force` is forbidden.

---

## 9. Pull Request Rules

Every production change uses a pull request targeting `production`.

The pull request must contain:

- Purpose
- Implementation summary
- Changed areas
- Tests and commands run
- FAC/NFAC references when relevant
- Screenshots for visible UI changes
- Confidentiality review
- Known limitations
- Deployment impact
- Rollback notes

Use `.github/pull_request_template.md`.

### Pull request size

Prefer reviewable pull requests.

A pull request should not combine:

- Multiple unrelated features
- A feature and broad dependency upgrades
- A bug fix and unrelated refactoring
- Product behavior changes not covered by approved requirements

---

## 10. Update and Conflict Rules

Before merge, update the task branch when required.

Preferred approach:

```bash
git fetch origin
git rebase origin/production
```

Do not rebase a shared remote branch without confirming that rewriting its
history is safe.

When conflicts occur:

1. Identify why each side changed the same area.
2. Preserve approved behavior.
3. Resolve the smallest valid scope.
4. Run affected tests.
5. Review the resulting diff.
6. Use `--force-with-lease` only when explicit approval exists.

A merge from `production` into the task branch may be used when branch-history
rewriting is not approved.

---

## 11. Merge Rules

Merge strategy:

```text
Squash merge only
```

Repository settings:

- Squash merge enabled
- Merge commits disabled
- Rebase merge disabled
- Automatic deletion of merged branches enabled

Claude must not merge without Randi's explicit approval for the specific pull
request in the current conversation.

Passing CI is necessary, not sufficient, authorization.

Before merge confirm:

- Required checks pass
- Review conversations are resolved
- Preview is verified when relevant
- Confidentiality review passes
- Pull-request scope matches the approved task
- Squash commit message is valid
- Randi approved merge

---

## 12. Hotfix Workflow

For an urgent production defect:

```bash
git switch production
git pull --ff-only origin production
git switch -c hotfix/<scope>
```

Rules:

- Change only what is required to restore valid production behavior
- Add or update a regression test
- Run focused and relevant broader checks
- Open a pull request to `production`
- Use the same merge-approval boundary
- Perform unrelated cleanup later in separate branches

Urgency never authorizes direct production changes or skipped verification.

---

## 13. Post-Merge Workflow

After squash merge:

1. Confirm Vercel Production Deployment starts.
2. Verify the affected production behavior.
3. Confirm no confidentiality issue exists.
4. Delete the remote task branch automatically.
5. Update local state:

```bash
git switch production
git pull --ff-only origin production
git branch -d <task-branch>
git fetch --prune origin
```

If production is incorrect:

- Use Vercel rollback for urgent restoration when necessary
- Revert or correct source through a new pull request
- Keep source and production aligned

---

## 14. Completion Report

Claude's final Git report must include:

```text
Branch:
Commits:
Remote push:
Pull request:
Checks run:
Preview verification:
Confidentiality review:
Known risks:
Merge state:
Approval still required:
```

Never report a task as fully delivered when the pull request is still waiting
for approval or production has not been verified.
