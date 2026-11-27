#!/usr/bin/env bash
#
# Turn the post-deployment smoke check's result into something a person sees.
#
# Modelled on report-security-audit.sh, for the same reason: a failed workflow
# only sends an email, and on 2026-11-17 the site was found to have declared a
# released alias as its canonical address for months (docs/release-audit.md).
# A failing check opens an issue assigned to the repository owner, later
# failures update it in place and only comment when the set of failing checks
# changes, and the first passing run closes it.
#
# Inputs, all from the environment:
#   OUTCOME  "success" or "failure" — the smoke check step's outcome
#   RUN_URL  link to this workflow run
#   OWNER    the account to assign
#   DRILL    "true" to exercise the failure path under a separate label
#   REPORT   path to the captured smoke-check output (default: smoke.txt)

set -euo pipefail

: "${OUTCOME:?OUTCOME is required}"
: "${RUN_URL:?RUN_URL is required}"
: "${OWNER:?OWNER is required}"
DRILL="${DRILL:-false}"
REPORT="${REPORT:-smoke.txt}"
TODAY="$(date -u +%Y-%m-%d)"

REAL_LABEL="smoke-check"
DRILL_LABEL="smoke-check-drill"

gh label create "$REAL_LABEL" --color B60205 --force \
  --description "Opened and closed automatically by the Smoke Check workflow" >/dev/null
gh label create "$DRILL_LABEL" --color C5DEF5 --force \
  --description "Drill issue from the Smoke Check workflow; safe to ignore" >/dev/null

open_issue() {
  gh issue list --label "$1" --state open --limit 1 --json number --jq '.[0].number // empty'
}

# ---------------------------------------------------------------- passing run
#
# Close anything still open, real or drill. Closing a drill issue here is what
# proves the recovery path: run a drill, then run normally, and the drill issue
# should close itself.
if [ "$OUTCOME" = "success" ]; then
  for label in "$REAL_LABEL" "$DRILL_LABEL"; do
    existing="$(open_issue "$label")"
    if [ -n "$existing" ]; then
      gh issue comment "$existing" --body-file - <<EOF
The smoke check passed on $TODAY: the live site answers at its canonical address and declares it everywhere. Closing automatically.

[Run]($RUN_URL)
EOF
      gh issue close "$existing" --reason completed >/dev/null
      echo "Closed #$existing ($label)."
    fi
  done
  exit 0
fi

# ---------------------------------------------------------------- failing run

if [ "$DRILL" = "true" ]; then
  label="$DRILL_LABEL"
  title="[drill] Smoke check failing"
  lead="**This is a drill.** The smoke check was not run; the failure path was triggered on purpose to prove that an alert reaches a person. The next normal run will close this issue."
else
  label="$REAL_LABEL"
  title="Smoke check failing"
  lead="**The live site failed its smoke check.** It does not answer, or does not declare itself, at its canonical address the way the content says it should."
fi

failing="$(grep -E '^FAIL' "$REPORT" 2>/dev/null | sed -E 's/^FAIL +//; s/ — .*$//' | sort -u | tr '\n' ';' | sed 's/;$//' || true)"
fingerprint="<!-- failing: ${failing:-none} -->"
excerpt="$(head -c 50000 "$REPORT" 2>/dev/null || echo "(no smoke-check output was captured)")"

body="$(cat <<EOF
$lead

This issue was opened by the [Smoke Check workflow]($RUN_URL). It is updated in place on later failures, with a comment only when the set of failing checks changes, and it closes itself the first time the check passes.

| | |
|---|---|
| Last checked | $TODAY |
| Failing | ${failing:-none listed} |

**What to do:** open the live site and compare it with the failing lines below. A canonical, \`og:url\`, or sitemap host that is not the production domain usually means \`SITE_URL\` in Vercel's production environment no longer matches the domain the site is served from. Correct it and redeploy, then run this workflow again.

**Why this issue exists:** on 2026-11-17 the site was found to have declared a released Vercel alias as its canonical address for months, and nothing in the gate tested the site's own address. See the 2026-11-17 entry in \`docs/release-audit.md\` and DEC-077.

<details>
<summary>Smoke check output</summary>

\`\`\`\`text
$excerpt
\`\`\`\`

</details>

$fingerprint
EOF
)"

existing="$(open_issue "$label")"

if [ -z "$existing" ]; then
  url="$(gh issue create --title "$title" --label "$label" --assignee "$OWNER" --body-file - <<<"$body")"
  echo "Opened $url"
  exit 0
fi

previous="$(gh issue view "$existing" --json body --jq '.body' | grep -oE '<!-- failing: [^>]* -->' | head -1 || true)"
gh issue edit "$existing" --body-file - <<<"$body" >/dev/null
echo "Updated #$existing in place."

if [ "$previous" != "$fingerprint" ]; then
  gh issue comment "$existing" --body-file - <<EOF
The set of failing checks changed on $TODAY. The issue description now shows the latest report.

[Run]($RUN_URL)
EOF
  echo "Failing set changed; commented on #$existing."
fi
