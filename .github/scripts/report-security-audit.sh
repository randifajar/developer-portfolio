#!/usr/bin/env bash
#
# Turn the scheduled security audit's result into something a person sees.
#
# From 2026-09-03 to 2026-11-15 the daily audit failed 69 times in a row while
# production ran Next.js under critical advisories. Every one of those runs was
# correct. None of them reached anyone, because a failed scheduled workflow only
# sends an email. See the 2026-11-17 entry in docs/release-audit.md.
#
# So a failure now opens an issue assigned to the repository owner, and the first
# passing run closes it. Later failures update the same issue in place and only
# comment when the set of advisories changes — an alert that fires every day gets
# muted, and a muted alert is the problem this exists to fix.
#
# Inputs, all from the environment:
#   OUTCOME  "success" or "failure" — the audit step's outcome
#   RUN_URL  link to this workflow run
#   OWNER    the account to assign
#   DRILL    "true" to exercise the failure path under a separate label
#   REPORT   path to the captured audit output (default: audit.txt)

set -euo pipefail

: "${OUTCOME:?OUTCOME is required}"
: "${RUN_URL:?RUN_URL is required}"
: "${OWNER:?OWNER is required}"
DRILL="${DRILL:-false}"
REPORT="${REPORT:-audit.txt}"
TODAY="$(date -u +%Y-%m-%d)"

REAL_LABEL="security-audit"
DRILL_LABEL="security-audit-drill"

gh label create "$REAL_LABEL" --color B60205 --force \
  --description "Opened and closed automatically by the Security Audit workflow" >/dev/null
gh label create "$DRILL_LABEL" --color C5DEF5 --force \
  --description "Drill issue from the Security Audit workflow; safe to ignore" >/dev/null

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
The audit passed on $TODAY: \`npm run audit:prod\` found 0 vulnerabilities. Closing automatically.

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
  title="[drill] Security audit failing"
  lead="**This is a drill.** The audit was not run; the failure path was triggered on purpose to prove that an alert reaches a person. The next normal run will close this issue."
else
  label="$REAL_LABEL"
  title="Security audit failing"
  lead="**The scheduled security audit is failing.** At least one production dependency has an advisory at or above \`high\` severity."
fi

advisories="$(grep -oE 'GHSA-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}' "$REPORT" 2>/dev/null | sort -u | tr '\n' ' ' | sed 's/ $//' || true)"
fingerprint="<!-- advisories: ${advisories:-none} -->"
excerpt="$(head -c 50000 "$REPORT" 2>/dev/null || echo "(no audit output was captured)")"

body="$(cat <<EOF
$lead

This issue was opened by the [Security Audit workflow]($RUN_URL). It is updated in place on later failures, with a comment only when the set of advisories changes, and it closes itself the first time the audit passes.

| | |
|---|---|
| Last checked | $TODAY |
| Advisories | ${advisories:-none listed} |

**What to do:** update the affected package, preferring a version inside its parent's declared range — or record a documented decision, per \`docs/release-checklist.md\` section 8. Verify the built output before merging; a dependency marked dev-only can still change what visitors receive.

**Why this issue exists:** from 2026-09-03 to 2026-11-15 this audit failed 69 days running and nobody saw it, because a failed workflow only sends an email. See the 2026-11-17 entry in \`docs/release-audit.md\`.

<details>
<summary>Audit output</summary>

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

previous="$(gh issue view "$existing" --json body --jq '.body' | grep -oE '<!-- advisories: [^>]* -->' | head -1 || true)"
gh issue edit "$existing" --body-file - <<<"$body" >/dev/null
echo "Updated #$existing in place."

if [ "$previous" != "$fingerprint" ]; then
  gh issue comment "$existing" --body-file - <<EOF
The set of advisories changed on $TODAY. The issue description now shows the latest report.

[Run]($RUN_URL)
EOF
  echo "Advisory set changed; commented on #$existing."
fi
