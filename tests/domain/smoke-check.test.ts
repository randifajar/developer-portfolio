import { describe, expect, it } from "vitest";
import { getPublishedProjects } from "@/domain/content/selectors";
import {
  checkMissing,
  checkPage,
  checkResume,
  checkRobots,
  checkSitemap,
  draftTitles,
  expectedPages,
} from "@/domain/deployment/smoke-check";

/**
 * The post-deployment smoke check's rules (DEC-077), against fixtures. The case
 * that matters most is the one that happened: on 2026-11-17 the live site
 * answered normally while declaring a released alias as its canonical address.
 */

const ORIGIN = "https://example-portfolio.test";

function page(path: string, { canonicalHost = ORIGIN, ogHost = ORIGIN, body = "" } = {}) {
  return (
    `<html><head><link rel="canonical" href="${canonicalHost}${path}"/>` +
    `<meta property="og:url" content="${ogHost}${path}"/></head>` +
    `<body>Randi Fajar Wicaksono ${body}</body></html>`
  );
}

const failures = (results: readonly { ok: boolean; check: string }[]) =>
  results.filter((entry) => !entry.ok).map((entry) => entry.check);

describe("what the smoke check expects comes from the content", () => {
  it("expects the three modes, the projects index, and each Published case study", () => {
    expect(expectedPages()).toEqual([
      "/",
      "/backend",
      "/infrastructure",
      "/projects",
      ...getPublishedProjects().map((project) => `/projects/${project.slug}`),
    ]);
  });

  it("treats the Draft overview's title as something no page may show", () => {
    expect(draftTitles()).toContain("AI-Assisted Development Across Three Applications");
  });
});

describe("a page", () => {
  it("passes when it answers, declares itself canonical, and shows nothing Draft", () => {
    expect(failures(checkPage("/backend", 200, page("/backend"), ORIGIN))).toEqual([]);
  });

  it("accepts the root declared without its trailing slash", () => {
    const html = page("").replace(`${ORIGIN}"`, `${ORIGIN}"`);

    expect(failures(checkPage("/", 200, html, ORIGIN))).toEqual([]);
  });

  it("fails when it declares another host canonical, as on 2026-11-17", () => {
    const html = page("/", { canonicalHost: "https://released-alias.example" });

    expect(failures(checkPage("/", 200, html, ORIGIN))).toEqual(["/ declares itself canonical"]);
  });

  it("fails when its og:url names another host", () => {
    const html = page("/projects", { ogHost: "https://released-alias.example" });

    expect(failures(checkPage("/projects", 200, html, ORIGIN))).toEqual([
      "/projects gives its own address as og:url",
    ]);
  });

  it("fails when it shows a Draft title", () => {
    const [draft] = draftTitles();
    const html = page("/projects", { body: draft });

    expect(failures(checkPage("/projects", 200, html, ORIGIN))).toEqual([
      "/projects shows no Draft title",
    ]);
  });

  it("fails, and checks nothing further, when it does not answer 200", () => {
    expect(failures(checkPage("/backend", 404, "", ORIGIN))).toEqual(["/backend answers 200"]);
  });

  it("fails on the home page when Randi's name is missing", () => {
    const html = page("").replace("Randi Fajar Wicaksono", "Someone Else");

    expect(failures(checkPage("/", 200, html, ORIGIN))).toEqual(["/ names Randi"]);
  });
});

describe("the sitemap", () => {
  const sitemap = (urls: readonly string[]) =>
    `<urlset>${urls.map((url) => `<url><loc>${url}</loc></url>`).join("")}</urlset>`;
  const expected = () => expectedPages().map((path) => new URL(path, ORIGIN).href);

  it("passes when it lists exactly the Published pages on the canonical host", () => {
    expect(checkSitemap(sitemap(expected()), ORIGIN).ok).toBe(true);
  });

  it("fails when a page is missing or one is extra", () => {
    expect(checkSitemap(sitemap(expected().slice(1)), ORIGIN).ok).toBe(false);
    expect(checkSitemap(sitemap([...expected(), `${ORIGIN}/projects/draft`]), ORIGIN).ok).toBe(
      false,
    );
  });

  it("fails when it lists the pages on another host", () => {
    const elsewhere = expected().map((url) =>
      url.replace(ORIGIN, "https://released-alias.example"),
    );

    expect(checkSitemap(sitemap(elsewhere), ORIGIN).ok).toBe(false);
  });
});

describe("robots.txt, the résumé, and a missing page", () => {
  it("wants the sitemap named on the canonical host", () => {
    expect(checkRobots(`User-agent: *\nSitemap: ${ORIGIN}/sitemap.xml\n`, ORIGIN).ok).toBe(true);
    expect(
      checkRobots("User-agent: *\nSitemap: https://elsewhere.test/sitemap.xml", ORIGIN).ok,
    ).toBe(false);
  });

  it("wants the résumé to answer with a PDF", () => {
    const encode = (text: string) => new TextEncoder().encode(text);

    expect(checkResume(200, encode("%PDF-1.7")).ok).toBe(true);
    expect(checkResume(200, encode("<!DOC")).ok).toBe(false);
    expect(checkResume(404, encode("%PDF-")).ok).toBe(false);
  });

  it("wants an unknown route to answer 404, not a page", () => {
    expect(checkMissing(404).ok).toBe(true);
    expect(checkMissing(200).ok).toBe(false);
  });
});
