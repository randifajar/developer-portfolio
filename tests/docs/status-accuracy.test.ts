import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * The README's version claim must match the newest release on record.
 *
 * Five stale current-state claims were found by hand in August 2026: the v2.0
 * specification header said "Nothing here is implemented" while all of it was
 * live, src/content/media.ts said its assets were Draft files that did not
 * exist while one was production's LCP element, the ledger listed four resolved
 * decisions as open, layout.tsx named the wrong LCP element, and the README
 * announced "Version 1 is deployed" after v2 had shipped.
 *
 * Every one was caught by reading. Nothing in a repository with 436 unit tests
 * and 211 end-to-end tests was watching, because a status line is the one part
 * of a document that nothing ever executes: prose describing behaviour is
 * eventually contradicted by the running site, and a version number never is.
 *
 * This is deliberately narrow. It checks one fact that has now gone stale
 * twice rather than trying to police prose, because a gate people learn to work
 * around is worse than no gate.
 */

const ROOT = process.cwd();

/** Headings look like: `## 2026-08-16 — v2 "Performance Engineering" release, closed` */
const ENTRY = /^## (\d{4}-\d{2}-\d{2}) — (.+)$/gm;
const VERSION_IN_TITLE = /\bv(\d+(?:\.\d+)?)\b/i;

/** `**Status:** Production. Version 2 is deployed, indexed, and verified …` */
const README_CLAIM = /\*\*Status:\*\*[^\n]*?\bVersion (\d+(?:\.\d+)?) is deployed\b/;

interface ReleaseEntry {
  readonly date: string;
  readonly version: string;
}

/**
 * The newest entry that *names* a release, which is not the same as the newest
 * entry. The 2026-08-17 rollback rehearsal names no version, and treating it as
 * the latest release would compare the README against nothing.
 */
function latestRecordedRelease(audit: string): ReleaseEntry | undefined {
  const releases: ReleaseEntry[] = [];

  for (const match of audit.matchAll(ENTRY)) {
    const date = match[1];
    const title = match[2];
    if (date === undefined || title === undefined) continue;

    const version = VERSION_IN_TITLE.exec(title)?.[1];
    if (version !== undefined) releases.push({ date, version });
  }

  return releases.sort((a, b) => a.date.localeCompare(b.date)).at(-1);
}

describe("the README's status matches the release record", () => {
  const readme = readFileSync(join(ROOT, "README.md"), "utf8");
  const audit = readFileSync(join(ROOT, "docs/release-audit.md"), "utf8");

  /*
   * Both extractions are asserted before they are compared. If either document
   * is reworded so the pattern stops matching, this test has to fail loudly
   * rather than compare undefined to undefined and pass — which is exactly how
   * two tests in this repository were green for an entire build while testing
   * nothing.
   */
  it("finds a version claim in the README", () => {
    expect(README_CLAIM.exec(readme)?.[1]).toBeDefined();
  });

  it("finds a release entry in the audit record", () => {
    expect(latestRecordedRelease(audit)).toBeDefined();
  });

  it("states the version of the newest recorded release", () => {
    const claimed = README_CLAIM.exec(readme)?.[1];
    const recorded = latestRecordedRelease(audit);

    expect(claimed).toBe(recorded?.version);
  });
});
