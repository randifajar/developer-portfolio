# Content Authoring

How to write and publish content for this portfolio. Written for Randi; Claude
can implement the structure but cannot author the professional claims.

---

## The rule that governs everything

**Draft hides content from the website. It does not make it private on GitHub.**

This repository is public. Every string in `src/content/` is readable by anyone
who opens the file, regardless of `publicationStatus`. So the question is never
"will the site show this?" — it is "is this safe to exist in a public
repository at all?"

If the answer is no, it does not go in `src/content/`. It stays in the private
workspace outside the repository.

---

## Never put these in `src/content/`

- Internal project codes, ticket references, or module identifiers
- Internal or partner system names
- Internal URLs, private repository links, or environment hostnames
- Customer or student data of any kind
- Credentials, tokens, or connection strings
- Screenshots that were not sanitized and reviewed
- Raw Claude, Codex, or ChatGPT session exports
- Proprietary architecture detail or company source

The Jury Process Management case study is the highest-risk file in the
repository. Its header comment lists these constraints again for a reason.

---

## Three fields, three different questions

Getting these confused is the most common authoring mistake.

### `publicationStatus`

*Does the website render this?*

`draft` — not shown. Use while the content is incomplete.
`published` — shown publicly.
`archived` — not shown, kept for history.

### `deliveryStatus`

*What is the real state of the work?*

This describes reality, not visibility. A finished project can be `completed`
while its case study is still `draft`.

| Value | Means |
|---|---|
| `personal-project` | Built independently, outside employment |
| `in-development` | Active work, not complete |
| `completed` | Finished and delivered — **does not imply deployed** |
| `internal-release` | Released internally, not to public production |
| `proof-of-concept` | Exploratory — **does not imply general use** |
| `production` | Verified as deployed and running in production |
| `archived` | No longer active |

**`production` requires proof.** Validation rejects it unless the record carries:

```ts
productionConfirmation: {
  verified: true,
  note: "A public-safe statement of how deployment was verified.",
}
```

If you cannot honestly write that note, the status is not `production`. Use
`completed` or `internal-release` instead. This is FAC-PROJECT-004, and it is
the rule most likely to cost credibility in an interview if broken.

### `confidentialityClass`

*Is it safe to publish at all?*

`public` — no restrictions.
`sanitized` — professional work, generalized and reviewed. Publishable.
`private` / `restricted` — **never publishable, and should not be in the
repository.**

---

## Writing truthfully

NFAC-CONTENT-002 requires ownership language to be accurate. The distinction a
technical interviewer will probe:

| Use | When |
|---|---|
| "I implemented" | You wrote it |
| "I contributed to" | You did part of it |
| "I was responsible for" | You owned the outcome |
| "The team delivered" | Shared work |
| "The project reached" | Outcome, not personal action |

Every professional case study has both `personalResponsibilities` and
`teamResponsibilities`. They render as two visually distinct blocks
specifically so team work is never read as yours.

**No invented metrics.** If you do not have a reliable number, describe the
observable outcome instead: enabled a new workflow, integrated two
applications, reduced manual steps, resolved a production incident, passed QA.
A vague-but-true outcome survives scrutiny; an invented percentage does not.

**Avoid:** "rockstar", "10x", "world-class", "expert" without evidence,
"passionate problem solver" without an example.

---

## Publishing a project

1. Write the content in `src/content/projects/<slug>.ts` using `defineProject`.
2. Register it in `src/content/projects/index.ts`.
3. Run `npm run validate:content` — this catches structural problems early.
4. Review every claim for truthfulness.
5. Review every string for confidentiality.
6. Set `publicationStatus: "published"`.
7. Set `featured: true` **only** when publishing — validation rejects a
   featured Draft project, because featuring one puts it on the homepage.
8. Run `npm run validate:release`.

---

## Required sections for a Published project

Validation rejects a Published project missing any of these:

`context`, `problem`, `technicalApproach`, `implementationSummary`,
`testingAndVerification`, `outcome`, `lessonsLearned`, and at least one
`personalResponsibilities` entry.

Optional: `period`, `workflowOrArchitecture`, `aiUsage`, `repositoryUrl`,
`mediaAssetIds`, `confidentialityNote`, `teamResponsibilities`.

Long-form fields accept Markdown. Raw HTML is disabled and will render as
escaped text.

---

## Images

Every meaningful image needs `altText` — validation requires it. Describe what
the image conveys, not that it is an image.

Diagrams must additionally be understandable from the surrounding text alone, in
case the image fails to load or the reader uses a screen reader.

Before adding any project visual, check it for internal identifiers, internal
URLs, real customer or student data, and anything else on the never-publish
list above.

---

## Placeholder markers

Release validation scans all Published content for `TODO`, `TBD`,
`Lorem ipsum`, `PLACEHOLDER`, `FIXME`, `XXX`, `DRAFT PLACEHOLDER`, and
"pending approval"-style phrases. It scans nested objects too, so a placeholder
hidden inside a challenge or decision entry is still caught.

It skips identifiers, since an id like `experience-placeholder-current` is
internal bookkeeping no visitor reads.

Draft content may contain these markers freely. That is the point of the split:
develop against placeholders, and the launch gate refuses them.

---

## When you are ready to launch

Follow [`docs/release-checklist.md`](release-checklist.md) in order. Step 3
(content approval) and step 4 (confidentiality review) are yours alone — they
are judgements about real work that no automated check can make for you.
