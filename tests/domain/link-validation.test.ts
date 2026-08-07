import { describe, expect, it } from "vitest";
import type { ContentSet } from "@/domain/content/validation";
import type { SiteConfig } from "@/domain/content/schemas";
import type { LinkTarget } from "@/domain/content/link-validation";
import {
  classifyExternalStatus,
  collectLinks,
  emailAddressOf,
  isBotHostile,
  localAssetCandidates,
} from "@/domain/content/link-validation";

/**
 * The link checker performs network and filesystem calls, so all of its
 * decisions live here where they can be exercised without either. Rules that
 * can only be tested by hitting live hosts are rules that never get tested.
 */

describe("classifyExternalStatus", () => {
  it("treats 2xx and 3xx as reachable", () => {
    for (const status of [200, 204, 301, 302, 308]) {
      expect(classifyExternalStatus("https://example.com", status)).toBe("reachable");
    }
  });

  it("treats 4xx and 5xx as broken", () => {
    for (const status of [400, 404, 410, 500, 503]) {
      expect(classifyExternalStatus("https://example.com", status)).toBe("broken");
    }
  });

  it("treats 999 as an anti-bot challenge from any host", () => {
    // 999 is not a real HTTP status. Nothing but a bot filter emits it.
    expect(classifyExternalStatus("https://example.com", 999)).toBe("requires-manual-check");
  });

  it("excuses 403 and 429 only from hosts known to challenge automation", () => {
    expect(classifyExternalStatus("https://www.linkedin.com/in/x", 403)).toBe(
      "requires-manual-check",
    );
    expect(classifyExternalStatus("https://www.linkedin.com/in/x", 429)).toBe(
      "requires-manual-check",
    );
    expect(classifyExternalStatus("https://github.com/x", 403)).toBe("broken");
  });

  /**
   * The assertion that keeps the excuse honest. A deleted LinkedIn profile
   * still has to fail — excusing every non-2xx from a bot-hostile host would
   * turn the whole check into decoration.
   */
  it("still reports a deleted profile on a bot-hostile host as broken", () => {
    expect(classifyExternalStatus("https://www.linkedin.com/in/deleted", 404)).toBe("broken");
  });
});

describe("isBotHostile", () => {
  it("matches the host and its subdomains", () => {
    expect(isBotHostile("https://linkedin.com/in/x")).toBe(true);
    expect(isBotHostile("https://www.linkedin.com/in/x")).toBe(true);
  });

  it("does not match a lookalike host", () => {
    // A suffix check written as a substring check would wrongly excuse these.
    expect(isBotHostile("https://notlinkedin.com/in/x")).toBe(false);
    expect(isBotHostile("https://evil-linkedin.com/in/x")).toBe(false);
    expect(isBotHostile("https://linkedin.com.attacker.test/in/x")).toBe(false);
  });

  it("returns false rather than throwing on an unparseable url", () => {
    expect(isBotHostile("not a url")).toBe(false);
  });
});

describe("localAssetCandidates", () => {
  it("maps a path to its public file", () => {
    expect(localAssetCandidates("/resume.pdf").publicFile).toBe("public/resume.pdf");
    expect(localAssetCandidates("/images/profile/a.webp").publicFile).toBe(
      "public/images/profile/a.webp",
    );
  });

  it("also offers the App Router files that could generate the path", () => {
    // /opengraph-image has no file in public/. It is rendered on request, and a
    // checker that only looked in public/ would call the working card broken.
    const { routeFiles } = localAssetCandidates("/opengraph-image");

    expect(routeFiles).toContain("src/app/opengraph-image.tsx");
    expect(routeFiles).toContain("src/app/opengraph-image/route.ts");
  });
});

describe("emailAddressOf", () => {
  it("extracts the address", () => {
    expect(emailAddressOf("mailto:person@example.com")).toBe("person@example.com");
  });

  it("ignores a query string", () => {
    expect(emailAddressOf("mailto:person@example.com?subject=Hello")).toBe("person@example.com");
  });

  it("rejects anything that is not a usable address", () => {
    expect(emailAddressOf("https://example.com")).toBeNull();
    expect(emailAddressOf("mailto:")).toBeNull();
    expect(emailAddressOf("mailto:not-an-address")).toBeNull();
    expect(emailAddressOf("mailto:missing@domain")).toBeNull();
  });
});

/* ------------------------------------------------------------------------- */
/* collectLinks                                                               */
/* ------------------------------------------------------------------------- */

const siteConfig = {
  name: "Owner",
  defaultTitle: "Owner",
  titleTemplate: "%s",
  defaultDescription: "Description.",
  ownerName: "Owner",
  locale: "en",
  email: "owner@example.com",
  linkedInUrl: "https://www.linkedin.com/in/owner",
  gitHubUrl: "https://github.com/owner",
  defaultSocialImagePath: "/opengraph-image",
} as unknown as SiteConfig;

const emptyContent = {
  profile: { id: "profile-a", publicationStatus: "draft" },
  experience: [],
  projects: [],
  skills: [],
  aiPractices: [],
  resumes: [],
  contactChannels: [],
  externalProfiles: [],
  mediaAssets: [],
} as unknown as ContentSet;

function makeContent(overrides: Partial<Record<keyof ContentSet, unknown>>): ContentSet {
  return { ...emptyContent, ...overrides } as unknown as ContentSet;
}

function find(links: readonly LinkTarget[], value: string): LinkTarget | undefined {
  return links.find((link) => link.value === value);
}

describe("collectLinks", () => {
  it("always collects the site-wide links as public", () => {
    const links = collectLinks(emptyContent, siteConfig);

    expect(find(links, "https://github.com/owner")).toMatchObject({
      kind: "external",
      isPublic: true,
    });
    expect(find(links, "/opengraph-image")).toMatchObject({
      kind: "local-asset",
      isPublic: true,
    });
  });

  it("requests a repeated destination once but names every source", () => {
    // The LinkedIn URL is authored twice. A failure has to name both places
    // that need fixing, without hitting the host twice.
    const links = collectLinks(
      makeContent({
        externalProfiles: [
          {
            id: "profile-linkedin",
            platform: "linkedin",
            label: "LinkedIn",
            url: "https://www.linkedin.com/in/owner",
            publicationStatus: "published",
          },
        ],
      }),
      siteConfig,
    );

    const linkedIn = links.filter((link) => link.value === "https://www.linkedin.com/in/owner");

    expect(linkedIn).toHaveLength(1);
    expect(linkedIn[0]?.sources).toHaveLength(2);
  });

  it("marks a link public when any one of its sources is public", () => {
    const links = collectLinks(
      makeContent({
        mediaAssets: [
          {
            id: "media-draft",
            type: "professional-photograph",
            filePath: "/shared.webp",
            publicationStatus: "draft",
            confidentialityClass: "public",
          },
          {
            id: "media-published",
            type: "social-sharing-image",
            filePath: "/shared.webp",
            publicationStatus: "published",
            confidentialityClass: "public",
          },
        ],
      }),
      siteConfig,
    );

    expect(find(links, "/shared.webp")?.isPublic).toBe(true);
  });

  it("does not mark Draft or confidential records public", () => {
    const links = collectLinks(
      makeContent({
        mediaAssets: [
          {
            id: "media-draft",
            type: "professional-photograph",
            filePath: "/draft.webp",
            publicationStatus: "draft",
            confidentialityClass: "public",
          },
        ],
        projects: [
          {
            id: "project-restricted",
            slug: "restricted",
            repositoryUrl: "https://github.com/owner/restricted",
            publicationStatus: "published",
            confidentialityClass: "restricted",
          },
        ],
      }),
      siteConfig,
    );

    expect(find(links, "/draft.webp")?.isPublic).toBe(false);
    expect(find(links, "https://github.com/owner/restricted")?.isPublic).toBe(false);
  });

  it("treats an inactive Resume as not public even when it is Published", () => {
    // A Resume reaches a visitor only when it is both active and Published
    // (FAC-RESUME-001), so an inactive record's missing file is not a defect.
    const links = collectLinks(
      makeContent({
        resumes: [
          {
            id: "resume-old",
            publicPath: "/old.pdf",
            isActive: false,
            publicationStatus: "published",
            confidentialityClass: "public",
          },
          {
            id: "resume-current",
            publicPath: "/resume.pdf",
            isActive: true,
            publicationStatus: "published",
            confidentialityClass: "public",
          },
        ],
      }),
      siteConfig,
    );

    expect(find(links, "/old.pdf")?.isPublic).toBe(false);
    expect(find(links, "/resume.pdf")?.isPublic).toBe(true);
  });

  it("collects a project repository url only when one is authored", () => {
    const links = collectLinks(
      makeContent({
        projects: [
          {
            id: "project-none",
            slug: "none",
            publicationStatus: "published",
            confidentialityClass: "public",
          },
        ],
      }),
      siteConfig,
    );

    expect(links.filter((link) => link.kind === "external")).toHaveLength(2);
  });

  it("collects a contact channel as an email link", () => {
    const links = collectLinks(
      makeContent({
        contactChannels: [
          {
            id: "contact-email",
            type: "email",
            label: "Email",
            value: "owner@example.com",
            publicLink: "mailto:owner@example.com",
            publicationStatus: "published",
          },
        ],
      }),
      siteConfig,
    );

    expect(find(links, "mailto:owner@example.com")).toMatchObject({
      kind: "email",
      isPublic: true,
    });
  });
});
