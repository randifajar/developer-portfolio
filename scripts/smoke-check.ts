/**
 * Post-deployment smoke check (DEC-077): fetch the live site at SITE_URL and
 * run the checks in src/domain/deployment/smoke-check.ts against what it
 * serves.
 *
 *   SITE_URL=https://randi-fajar-wicaksono.vercel.app npm run smoke:live
 *
 * Prints one line per check and exits 1 if any fails. The workflow in
 * .github/workflows/smoke-check.yml runs it after each Production deployment
 * and once a day, and turns a failure into an issue.
 */
import {
  MISSING_PATH,
  RESUME_CHECK_PATH,
  checkMissing,
  checkPage,
  checkResume,
  checkRobots,
  checkSitemap,
  expectedPages,
  type SmokeResult,
} from "@/domain/deployment/smoke-check";

const siteUrl = process.env.SITE_URL;

if (!siteUrl) {
  console.error("SITE_URL is required: the canonical production address to check.");
  process.exit(2);
}

const origin = new URL(siteUrl).origin;

/** Redirects are not followed: a canonical address that redirects is a finding. */
async function get(path: string): Promise<{ status: number; body: string }> {
  const response = await fetch(new URL(path, origin), { redirect: "manual" });
  return { status: response.status, body: await response.text() };
}

async function main(): Promise<void> {
  const results: SmokeResult[] = [];

  for (const path of expectedPages()) {
    const { status, body } = await get(path);
    results.push(...checkPage(path, status, body, origin));
  }

  results.push(checkSitemap((await get("/sitemap.xml")).body, origin));
  results.push(checkRobots((await get("/robots.txt")).body, origin));

  const resume = await fetch(new URL(RESUME_CHECK_PATH, origin), { redirect: "manual" });
  results.push(checkResume(resume.status, new Uint8Array(await resume.arrayBuffer()).slice(0, 5)));

  results.push(checkMissing((await get(MISSING_PATH)).status));

  for (const { ok, check, detail } of results) {
    console.log(`${ok ? "ok  " : "FAIL"}  ${check}${ok || !detail ? "" : ` — ${detail}`}`);
  }

  const failed = results.filter((entry) => !entry.ok).length;
  console.log(`\n${results.length - failed}/${results.length} checks passed against ${origin}`);
  process.exitCode = failed === 0 ? 0 : 1;
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
