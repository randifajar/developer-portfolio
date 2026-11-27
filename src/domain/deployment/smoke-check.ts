import { projectOverviews } from "@/content/project-overviews";
import { projects } from "@/content/projects";
import {
  getPublishedProfile,
  getPublishedProjectOverviews,
  getPublishedProjects,
} from "@/domain/content/selectors";
import { RESUME_PATH, ROUTES } from "@/lib/constants";

/**
 * The post-deployment smoke check (DEC-077, backlog item 4): does the live site
 * answer at its canonical address, and does it declare that address as its own
 * everywhere a search engine or a link preview reads one?
 *
 * The 2026-11-17 entry in docs/release-audit.md is why it exists. Renaming the
 * Vercel project released the site's old automatic alias, which later served
 * someone else's site, and production kept declaring it canonical for months.
 * Nothing in the gate tested the site's own address.
 *
 * Every expectation comes from the content, through the same selectors the
 * pages, the sitemap, and robots.txt use, so publishing more work needs no edit
 * here. The checks are pure functions of what was fetched; the runner in
 * scripts/smoke-check.ts does the fetching.
 */

export interface SmokeResult {
  readonly ok: boolean;
  readonly check: string;
  /** What was found, shown when the check fails. */
  readonly detail: string;
}

const result = (ok: boolean, check: string, detail = ""): SmokeResult => ({ ok, check, detail });

/** Every page the sitemap should list: the modes, the index, each Published case study. */
export function expectedPages(): readonly string[] {
  return [
    ROUTES.home,
    ROUTES.backend,
    ROUTES.infrastructure,
    ROUTES.projects,
    ...getPublishedProjects().map((project) => ROUTES.projectDetail(project.slug)),
  ];
}

/** The titles of everything not Published: none may appear on any page. */
export function draftTitles(): readonly string[] {
  const published = new Set<string>([
    ...getPublishedProjects().map((project) => project.id),
    ...getPublishedProjectOverviews().map((overview) => overview.id),
  ]);

  return [...projects, ...projectOverviews]
    .filter((record) => !published.has(record.id))
    .map((record) => record.title);
}

/** The path a smoke check requests for a route that must not exist. */
export const MISSING_PATH = "/smoke-check-not-a-page";

/** The résumé every release serves (DEC-073 keeps this path). */
export const RESUME_CHECK_PATH = RESUME_PATH;

function attribute(html: string, pattern: RegExp): string | undefined {
  return pattern.exec(html)?.[1];
}

/** Two URLs name the same address; the root may be written with or without its slash. */
function sameAddress(declared: string | undefined, expected: string): boolean {
  if (!declared) {
    return false;
  }
  try {
    return new URL(declared).href === new URL(expected).href;
  } catch {
    return false;
  }
}

/** One page: it answers, it declares itself canonical, and it shows nothing Draft. */
export function checkPage(
  path: string,
  status: number,
  html: string,
  origin: string,
): readonly SmokeResult[] {
  const expected = new URL(path, origin).href;
  const results: SmokeResult[] = [result(status === 200, `${path} answers 200`, `got ${status}`)];

  if (status !== 200) {
    return results;
  }

  const canonical = attribute(html, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/);
  results.push(
    result(
      sameAddress(canonical, expected),
      `${path} declares itself canonical`,
      `canonical=${canonical}`,
    ),
  );

  const ogUrl = attribute(html, /<meta[^>]+property="og:url"[^>]+content="([^"]+)"/);
  results.push(
    result(
      sameAddress(ogUrl, expected),
      `${path} gives its own address as og:url`,
      `og:url=${ogUrl}`,
    ),
  );

  const shown = draftTitles().filter((title) => html.includes(title));
  results.push(result(shown.length === 0, `${path} shows no Draft title`, shown.join("; ")));

  if (path === ROUTES.home) {
    const name = getPublishedProfile()?.fullName;
    results.push(result(!!name && html.includes(name), "/ names Randi", `expected ${name}`));
  }

  return results;
}

/** The sitemap lists exactly the Published pages, every one on the canonical host. */
export function checkSitemap(xml: string, origin: string): SmokeResult {
  const listed = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1] ?? "").sort();
  const expected = expectedPages()
    .map((path) => new URL(path, origin).href)
    .sort();

  return result(
    listed.length === expected.length &&
      listed.every((url, index) => sameAddress(url, expected[index] ?? "")),
    "the sitemap lists exactly the Published pages, on the canonical host",
    `listed ${listed.length}: ${listed.join(" ")}`,
  );
}

/** robots.txt points at the sitemap on the canonical host. */
export function checkRobots(text: string, origin: string): SmokeResult {
  return result(
    text.includes(`Sitemap: ${origin}/sitemap.xml`),
    "robots.txt names the sitemap on the canonical host",
    text.split("\n").find((line) => line.startsWith("Sitemap:")) ?? "no Sitemap line",
  );
}

/** The résumé answers, and what it serves is a PDF. */
export function checkResume(status: number, firstBytes: Uint8Array): SmokeResult {
  const magic = new TextDecoder().decode(firstBytes.slice(0, 5));

  return result(
    status === 200 && magic === "%PDF-",
    `${RESUME_CHECK_PATH} serves a PDF`,
    `status ${status}, starts ${JSON.stringify(magic)}`,
  );
}

/** A route that does not exist answers 404 rather than a page. */
export function checkMissing(status: number): SmokeResult {
  return result(status === 404, "an unknown route answers 404", `got ${status}`);
}
