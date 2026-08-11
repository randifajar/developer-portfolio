import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { ProjectCaseStudy } from "@/domain/content/schemas";
import {
  buildProjectMetadata,
  buildProjectsIndexMetadata,
  buildRootMetadata,
} from "@/domain/metadata/build-metadata";
import { absoluteUrl, getSiteUrl } from "@/lib/environment";

const originalSiteUrl = process.env.SITE_URL;

afterEach(() => {
  if (originalSiteUrl === undefined) {
    delete process.env.SITE_URL;
  } else {
    process.env.SITE_URL = originalSiteUrl;
  }
});

describe("site url parsing (TD 21.2)", () => {
  it("falls back to localhost when unset, so local development works", () => {
    delete process.env.SITE_URL;

    expect(getSiteUrl()).toBe("http://localhost:3000");
  });

  it("uses the configured value", () => {
    process.env.SITE_URL = "https://example.com";

    expect(getSiteUrl()).toBe("https://example.com");
  });

  it("strips trailing slashes so joined URLs never double up", () => {
    process.env.SITE_URL = "https://example.com///";

    expect(getSiteUrl()).toBe("https://example.com");
    expect(absoluteUrl("/projects")).toBe("https://example.com/projects");
  });

  it("treats whitespace as unset", () => {
    process.env.SITE_URL = "   ";

    expect(getSiteUrl()).toBe("http://localhost:3000");
  });

  it("builds absolute URLs from paths with or without a leading slash", () => {
    process.env.SITE_URL = "https://example.com";

    expect(absoluteUrl("/projects")).toBe("https://example.com/projects");
    expect(absoluteUrl("projects")).toBe("https://example.com/projects");
  });
});

describe("root metadata", () => {
  beforeEach(() => {
    process.env.SITE_URL = "https://example.com";
  });

  it("identifies Randi and the positioning (NFAC-SEO-003)", () => {
    const metadata = buildRootMetadata();

    // Next's Metadata["title"] is a union of template shapes, so the object is
    // narrowed rather than indexed directly.
    const title = metadata.title;
    const defaultTitle =
      title && typeof title === "object" && "default" in title ? title.default : String(title);

    expect(defaultTitle).toContain("Randi Fajar Wicaksono");
    expect(metadata.description).toContain("Backend Developer");
  });

  it("sets a canonical URL", () => {
    expect(buildRootMetadata().alternates?.canonical).toBe("/");
  });

  it("provides Open Graph and Twitter values for link previews (NFAC-SEO-001)", () => {
    const metadata = buildRootMetadata();

    expect(metadata.openGraph?.title).toBeTruthy();
    expect(metadata.openGraph?.description).toBeTruthy();

    // Metadata["twitter"] is a union whose members differ by card type, so the
    // emitted value is asserted through the serialised form.
    expect(JSON.stringify(metadata.twitter)).toContain("summary_large_image");
  });
});

describe("projects index metadata", () => {
  beforeEach(() => {
    process.env.SITE_URL = "https://example.com";
  });

  it("has a unique title and description", () => {
    const metadata = buildProjectsIndexMetadata();

    expect(metadata.title).toBe("Projects");
    expect(metadata.description).toBeTruthy();
  });

  it("canonicalises to /projects", () => {
    expect(buildProjectsIndexMetadata().alternates?.canonical).toBe("/projects");
  });
});

describe("project metadata", () => {
  const project = {
    slug: "alpha-project",
    title: "Alpha Project",
    summary: "A public summary of the work.",
    confidentialityNote: "SENSITIVE NOTE THAT MUST NOT APPEAR IN METADATA",
    role: "Backend Developer",
    context: "Internal context detail.",
  } as unknown as ProjectCaseStudy;

  beforeEach(() => {
    process.env.SITE_URL = "https://example.com";
  });

  it("derives title and description from approved public fields", () => {
    const metadata = buildProjectMetadata(project);

    expect(metadata.title).toBe("Alpha Project");
    expect(metadata.description).toBe("A public summary of the work.");
  });

  it("canonicalises to the project route", () => {
    expect(buildProjectMetadata(project).alternates?.canonical).toBe("/projects/alpha-project");
  });

  it("uses an absolute Open Graph URL", () => {
    expect(buildProjectMetadata(project).openGraph?.url).toBe(
      "https://example.com/projects/alpha-project",
    );
  });

  it("never leaks non-preview fields such as the confidentiality note (NFAC-SEC-006)", () => {
    const serialised = JSON.stringify(buildProjectMetadata(project));

    expect(serialised).not.toContain("SENSITIVE NOTE");
    expect(serialised).not.toContain("Internal context detail");
  });
});
