# Naming Migration Proposal — Randi W01

## Document Information

| Field | Value |
|---|---|
| Date | 2026-11-27 |
| Status | **Proposed.** Nothing is renamed until Randi approves this proposal, and each rename is its own step |
| Source | DEC-071 (the Randi W01 identity), DEC-077 (the domain stays), backlog item 8 |
| Scope | The four names that still say "developer-portfolio" or point to it: the GitHub repository, the Vercel project, the production domain, and the package |

The project is now named Randi W01 (DEC-071). The README, the decision ledger, and the package
description already say so. Four names are left, and Randi asked for an assessment before any of
them changes.

What stays whatever is decided here:

- **The website's identity.** Randi's full name stays primary, and no designation or tagline goes
  in the hero.
- **The site's routes.** The case-study slug `personal-developer-portfolio` is a public address.
  Renaming it would break every link to it, and nothing about the project name requires it.
- **The release history.** Version 1 to Version 3, and the entries that record them, keep their
  names.

---

## 1. Summary

| Name | Today | Risk of renaming | Recommendation |
|---|---|---|---|
| GitHub repository | `randifajar/developer-portfolio` | Low. GitHub redirects the old name | Optional. Rename only if the new name earns it |
| Vercel project | named after the domain it serves | **High.** The 2026-11-17 precedent | Do not rename until the domain no longer depends on the project's name |
| Production domain | `randi-fajar-wicaksono.vercel.app` | — | Keep (DEC-077). A custom domain is the one change that would make the other renames safe |
| Package | `developer-portfolio` (private, 0.1.0) | Very low. Nothing outside the repository reads it | Optional, cosmetic |

**The new names are Randi's to choose.** Where an example helps, this document uses `randi-w01` as
a placeholder only.

---

## 2. The GitHub repository

- **Today.** `randifajar/developer-portfolio`, public, with the `Protect production` and
  `Protect staging` rulesets, Dependabot, CodeQL default setup, and Vercel's Git integration.
- **What a rename changes.** GitHub redirects the old web address, and `git` clone, fetch, and
  push, to the new name. Issues, pull requests, stars, and rulesets stay with the repository.
- **Risks.**
  - **Reusing the old name breaks the redirects.** If a new repository with the old name is ever
    created under the same account, the redirects stop.
  - **Vercel's Git connection.** It is tied to the repository. Whether it follows a rename
    without action is **to be verified** in Vercel's documentation and dashboard before the rename.
    A broken connection would stop deployments, not break the live site.
  - **Text that names the repository.** Eight places in the repository's own documentation say
    `randifajar/developer-portfolio`, mostly handoffs and plans that record history. They would
    keep working through the redirect, and are history, so they are not edited. Links outside the
    repository work through the redirect.
- **Steps, if approved.**
  1. Confirm on Vercel how its Git integration handles a GitHub rename.
  2. Rename in the repository settings.
  3. Update the local remote: `git remote set-url origin <new URL>`.
  4. Push a trivial pull request, and confirm that CI runs and Vercel builds a Preview.
- **Verification.**
  - The old URL redirects.
  - CI runs on a pull request.
  - Vercel builds a Preview, and later a Production deployment, from the renamed repository.
  - The rulesets still apply (`GET /repos/<owner>/<new>/rules/branches/production`).
- **The way back.** Rename it back. The redirect from the interim name then applies the same way.

## 3. The Vercel project

- **Today.** The project's automatic `*.vercel.app` address is the production domain,
  `randi-fajar-wicaksono.vercel.app`, and `SITE_URL` in its production environment names that
  address.
- **The precedent.** The 2026-11-17 entry in `docs/release-audit.md` records what happened the
  last time:
  - Renaming the project on 2026-08-25 released its automatic alias at the time,
    `developer-portfolio-delta-three.vercel.app`.
  - That alias first returned `404 DEPLOYMENT_NOT_FOUND`, and was later assigned to an unrelated
    developer's portfolio.
  - Meanwhile the site kept declaring it canonical.
- **What a rename would risk now.** If the current address is the project's automatic alias, a
  rename releases `randi-fajar-wicaksono.vercel.app` in the same way. Every link to the live
  site would then break, or later reach someone else's site:
  - the README, LinkedIn, and job applications;
  - the canonical URLs and the sitemap.

  Whether this address is tied to the project's name, or was added as a domain that survives a
  rename, is **to be established in the Vercel dashboard** (Project → Settings → Domains) before
  anything else here.
- **Conditions before any rename.**
  - **Either** the site moves to a custom domain first (OPEN-007), so that its canonical address
    no longer depends on any Vercel name;
  - **or** the dashboard shows the current address as a domain on the project that stays assigned
    after a rename, and Vercel's documentation confirms that.
- **Steps, if both the conditions and Randi's approval are met.**
  1. Rename the project.
  2. Confirm that the production address still serves this site.
  3. Confirm that `SITE_URL` still names the production address.
  4. Run `npm run smoke:live`, and let the Smoke Check workflow run (DEC-077, backlog item 4).
- **Verification.**
  - The smoke check passes: the canonical URLs, `og:url`, sitemap, and `robots.txt` agree with
    the address the site is served from.
  - The old automatic alias, if any was released, is noted in the release audit.
- **The way back.** Renaming back does not recover a released alias that someone else has taken.
  That is why the conditions come first.

## 4. The production domain

- **Today.** `randi-fajar-wicaksono.vercel.app`. On 2026-11-26 Randi kept it and deferred a
  custom domain (OPEN-007, DEC-077).
- **Why it matters here.** A custom domain is the only change that makes the site's address
  independent of the Vercel project's name. It is the safe route to a Vercel rename, if one is
  ever wanted.
- **If it is ever done.**
  1. Buy the domain.
  2. Add it to the Vercel project.
  3. Set `SITE_URL` to it and redeploy.
  4. Keep the `vercel.app` address as a redirect.
  5. Run the smoke check against the new address.
  6. Update the README's Live link, and every place the address is published outside the
     repository.

  This is deferred, and nothing here changes it.

## 5. The package

- **Today.** `"name": "developer-portfolio"`, `"private": true`, version 0.1.0. It is never
  published, so no registry or consumer reads the name.
- **What a rename changes.**
  - The `name` field in `package.json`, and the two copies of it in `package-lock.json`.
  - The link checker's user-agent string, `developer-portfolio-link-check`, in
    `scripts/check-links.ts`, if it should match.
- **Risk.** Very low. It is cosmetic.
- **Verification.** `npm ci` and the full gate on the change.
- **The way back.** Revert the pull request.

---

## 6. Recommendation

1. **Settle the domain question first.** It decides whether a Vercel rename is ever safe. Until
   then, **do not rename the Vercel project**.
2. **The repository and the package are optional.** The README, the ledger, and the package
   description already carry the Randi W01 name. Renaming the repository mostly changes its URL;
   GitHub redirects the old one, and every link already published keeps working. Do it only if a
   `randi-w01`-style URL is worth more than the old one's familiarity.
3. **If the repository is renamed, rename the package in the same change.** Then the names agree.
   Confirm Vercel's Git integration first, and run the full gate and a Preview build afterwards.

## 7. Needs from Randi

- **Approval of this proposal**, or the parts of it he wants.
- **The new names**, for whichever names change.
- **Two checks in the Vercel dashboard,** which only his account can do:
  - whether `randi-fajar-wicaksono.vercel.app` is the project's automatic alias or an added domain;
  - how the Git connection treats a GitHub rename.
