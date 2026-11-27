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

Optional: `period`, `workflowOrArchitecture`, `diagram`, `aiUsage`,
`repositoryUrl`, `mediaAssetIds`, `confidentialityNote`, `teamResponsibilities`.

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

### Diagrams

A case study's diagram is not an image file. It is the `diagram` field of the
project record: the diagram's words, which the case-study page draws in the
design system under Architecture and Workflow (DEC-076, backlog item 11). Two
shapes exist:

- **`handoff`:** work moving between two systems. Name the two `lanes`, list
  the `steps` in order with the lane each happens in, and give one `handoffs`
  entry for what crosses between each pair of steps. Consecutive steps must be
  in different lanes. A `note` is optional.
- **`pipeline`:** `stages` in order, the last being the output. Mark the stages
  that `modes` apply to with `emphasis`; they must be consecutive.

Every diagram has a `title`, which becomes its caption, and a `description`,
which is its text alternative. Validation requires `workflowOrArchitecture`
beside it, because a diagram illustrates that text and never replaces it.

Write every label from what the case study's text already says. A diagram adds
the shape of the work, never a new claim, and it never shows topology,
hostnames, internal names, or anything else on the never-publish list. Randi
approves each diagram before it is published (DEC-076).

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

## V3 records

Added in V3 (UX/UI specification v3.0). The V3 pages read them through the
selectors: on `staging` since V3 P5 and P6, on the live site from the V3
release.

| Module | Holds | Rules beyond the schema |
|---|---|---|
| `modes.ts` | The hero copy for Overall, Backend, Infrastructure | At most one Published intro per mode; every Published intro names you, in the eyebrow or across the two heading lines. A release needs one for every mode, since the intro's heading is that page's h1 |
| `career.ts` | The three career chapters | Each chapter cites experience ids, never its own dates; every id must exist, and the chapter's year must fall within each role it cites |
| `credentials.ts` | Education, certifications, languages | Exactly as your résumés state them |
| `practices.ts` | "How I approach engineering" | Each item restates a résumé line; the module says which |
| `toolkits.ts` | The grouped tool lists on the two mode pages | Names only, no levels. Nothing that shows how an employer's systems are wired (DEC-064) |
| `discipline-pages.ts` | The Backend and Infrastructure pages below their heroes: each page's opening paragraph (and Infrastructure's scope line), and each page's four work areas | At most one Published intro per discipline. Each work area cites experience ids, which must exist and carry its discipline. The infrastructure text is held to an approved list in its test (DEC-064) |
| `project-overviews.ts` | Six résumé projects shown briefly, with no case study and no route | General titles only, never an internal application name (DEC-060). A technology only where the project's résumé line names it. Five Published since you confirmed their titles on 2026-11-26; the AI-assisted one stays Draft by your decision (OPEN-011) |

Five V3 fields sit on older records:

- **`statement`, on the profile.** The Overall profile statement.
- **`heroPhotoAssetId`, on the profile.** The Overall hero's photograph (UX3 7.6). Add the
  image under `public/`, register it in `media.ts` as a published `professional-photograph`
  with its alt text, width, and height, and point this field at it. Without it the hero
  shows a labelled placeholder and release validation refuses the release (OPEN-010).
- **`disciplines`, on every experience record.** `backend`, `infrastructure`, or both. It
  decides which mode page shows the role, so it is required: a role tagged with
  nothing would vanish from both.
- **`disciplines`, on a case study.** Optional. It drives the projects filter, and
  a case study without one appears only under "All".
- **`variant`, on a résumé.** `backend` or `infrastructure` (DEC-059). One
  active Published résumé per variant (FAC-RESUME-004, amended). The Résumé menu lists
  only variants with a Published résumé, so adding one is a record, not a code change.

The validation scripts and tests read one shared set, `src/content/content-set.ts`.
A new content type goes there, and the `ContentSet` type makes forgetting it a
compile error rather than a silent gap in validation.

---

## When you are ready to launch

Follow [`docs/release-checklist.md`](release-checklist.md) in order. Step 3
(content approval) and step 4 (confidentiality review) are yours alone — they
are judgements about real work that no automated check can make for you.
