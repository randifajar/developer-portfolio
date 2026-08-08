import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ButtonLink } from "@/components/ui/button-link";
import { ExternalLink } from "@/components/ui/external-link";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { TechnologyTag } from "@/components/ui/technology-tag";
import { PROJECT_DELIVERY_STATUSES } from "@/domain/content/types";
import { getDeliveryStatusLabel } from "@/domain/projects/delivery-status";

describe("ExternalLink", () => {
  it("carries both rel tokens required for safe new-tab behaviour (NFAC-SEC-003)", () => {
    render(<ExternalLink href="https://github.com/randifajar">GitHub</ExternalLink>);

    const link = screen.getByRole("link");
    const rel = link.getAttribute("rel") ?? "";

    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("discloses that it opens a new tab without cluttering the visible label", () => {
    render(<ExternalLink href="https://example.com">LinkedIn</ExternalLink>);

    expect(screen.getByRole("link").textContent).toContain("opens in a new tab");
  });

  it("uses an explicit accessible label when the visible text is ambiguous", () => {
    render(
      <ExternalLink href="https://example.com" accessibleLabel="Randi on GitHub">
        →
      </ExternalLink>,
    );

    expect(screen.getByRole("link", { name: /Randi on GitHub/ })).toBeInTheDocument();
  });
});

describe("ButtonLink", () => {
  it("renders a link, never a button, because every use navigates", () => {
    render(<ButtonLink href="/projects">View Projects</ButtonLink>);

    expect(screen.getByRole("link", { name: "View Projects" })).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("applies safe new-tab attributes when external", () => {
    render(
      <ButtonLink href="https://example.com" external>
        Open
      </ButtonLink>,
    );

    const rel = screen.getByRole("link").getAttribute("rel") ?? "";

    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
  });

  it("does not mark internal links as external", () => {
    render(<ButtonLink href="/projects">Projects</ButtonLink>);

    expect(screen.getByRole("link")).not.toHaveAttribute("target");
  });

  it("meets the 44px touch target minimum through padding (NFAC-RESP-004)", () => {
    render(<ButtonLink href="/projects">Projects</ButtonLink>);

    expect(screen.getByRole("link").className).toContain("min-h-11");
  });
});

describe("StatusBadge", () => {
  it("renders the approved label for every status (NFAC-CONTENT-003)", () => {
    for (const status of PROJECT_DELIVERY_STATUSES) {
      const { unmount } = render(<StatusBadge status={status} />);

      expect(screen.getByText(getDeliveryStatusLabel(status))).toBeInTheDocument();
      unmount();
    }
  });

  it("never conveys status by colour alone (UX 4.5, NFAC-A11Y-005)", () => {
    render(<StatusBadge status="production" />);

    // The label is real text, not a background colour or an icon.
    expect(screen.getByText("Production")).toBeInTheDocument();
  });

  it("exposes the disambiguating description to assistive technology", () => {
    const { container } = render(<StatusBadge status="completed" />);

    // FAC-PROJECT-004: Completed must not imply production deployment, and the
    // disclaimer has to be announced, not just present in prose elsewhere.
    expect(container.textContent).toMatch(/not imply production/i);
  });

  it("throws on an invalid status rather than defaulting (FAC-PROJECT-004)", () => {
    expect(() => render(<StatusBadge status={"invented" as never} />)).toThrow(
      /Unknown project delivery status/,
    );
  });
});

describe("TechnologyTag", () => {
  it("renders the canonical name as readable text, not a bare logo (UX 12.6)", () => {
    render(<TechnologyTag name="TypeScript" />);

    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders no proficiency indicator of any kind (FAC-SKILL-003)", () => {
    const { container } = render(<TechnologyTag name="Node.js" />);

    expect(container.querySelector("progress")).toBeNull();
    expect(container.querySelector('[role="progressbar"]')).toBeNull();
    expect(container.textContent).not.toMatch(/\d+\s*%/);
  });
});

describe("SectionHeader", () => {
  it("renders an h2 by default", () => {
    render(<SectionHeader heading="Work Experience" />);

    expect(screen.getByRole("heading", { level: 2, name: "Work Experience" })).toBeInTheDocument();
  });

  it("renders the requested level so hierarchy stays valid (NFAC-A11Y-003)", () => {
    render(<SectionHeader heading="Challenges" level={3} />);

    expect(screen.getByRole("heading", { level: 3, name: "Challenges" })).toBeInTheDocument();
  });

  it("applies an anchor id for navigation targets (FAC-NAV-002)", () => {
    render(<SectionHeader heading="Contact" id="contact" />);

    expect(screen.getByRole("heading", { name: "Contact" })).toHaveAttribute("id", "contact");
  });

  it("omits the eyebrow and description when not supplied", () => {
    const { container } = render(<SectionHeader heading="Skills" />);

    expect(container.querySelectorAll("p")).toHaveLength(0);
  });
});

describe("MarkdownContent", () => {
  it("renders standard Markdown formatting", () => {
    render(<MarkdownContent>{"This is **bold** text."}</MarkdownContent>);

    expect(screen.getByText("bold").tagName).toBe("STRONG");
  });

  it("renders GitHub-flavoured lists", () => {
    render(<MarkdownContent>{"- first\n- second"}</MarkdownContent>);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  /**
   * The security-critical assertions. Raw HTML is disabled, so embedded markup
   * must surface as escaped text rather than as live elements. If these ever
   * fail, every content field has become an injection surface.
   */
  it("does not execute an embedded script tag", () => {
    const { container } = render(
      <MarkdownContent>{'Before <script>alert("xss")</script> after.'}</MarkdownContent>,
    );

    expect(container.querySelector("script")).toBeNull();
  });

  it("does not render an img with an onerror handler", () => {
    const { container } = render(
      <MarkdownContent>{'<img src="x" onerror="alert(1)" />'}</MarkdownContent>,
    );

    expect(container.querySelector("img")).toBeNull();
  });

  it("does not render an embedded iframe", () => {
    const { container } = render(
      <MarkdownContent>{'<iframe src="https://evil.example"></iframe>'}</MarkdownContent>,
    );

    expect(container.querySelector("iframe")).toBeNull();
  });

  it("applies safe new-tab attributes to absolute links inside content", () => {
    render(<MarkdownContent>{"[GitHub](https://github.com/randifajar)"}</MarkdownContent>);

    const rel = screen.getByRole("link").getAttribute("rel") ?? "";

    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
  });

  it("does not demote content headings above the section heading", () => {
    render(<MarkdownContent>{"# A content heading"}</MarkdownContent>);

    // The page owns h1 and the section owns h2, so content starts at h3.
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
  });

  it("keeps the rest of the heading scale below the section heading", () => {
    // Only `#` was covered. A `##` or `###` in content must not outrank the
    // section either, and each maps to a different level.
    const { unmount } = render(<MarkdownContent>{"## Second level"}</MarkdownContent>);

    expect(screen.getByRole("heading", { level: 3, name: "Second level" })).toBeInTheDocument();
    unmount();

    render(<MarkdownContent>{"### Third level"}</MarkdownContent>);

    expect(screen.getByRole("heading", { level: 4, name: "Third level" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });

  /**
   * URL scheme handling.
   *
   * react-markdown neutralises dangerous schemes by default, so these pass
   * today without any code of ours. That is exactly why they are worth
   * asserting: the protection is a library default, and a future
   * `urlTransform` override or a `rehype-raw` addition would remove it with
   * nothing to object.
   */
  it("neutralises a javascript: url in a content link", () => {
    const { container } = render(
      <MarkdownContent>{"[click](javascript:alert(1))"}</MarkdownContent>,
    );

    expect(container.querySelector("a")?.getAttribute("href")).toBe("");
  });

  it("neutralises a data: url in a content link", () => {
    const { container } = render(<MarkdownContent>{"[click](data:text/html,hi)"}</MarkdownContent>);

    expect(container.querySelector("a")?.getAttribute("href")).toBe("");
  });

  it("leaves a relative link internal, with no new tab", () => {
    // The branch opposite the external-link case: an in-site link must not be
    // torn out into a new tab, and must not carry rel tokens it does not need.
    const { container } = render(<MarkdownContent>{"[Projects](/projects)"}</MarkdownContent>);
    const link = container.querySelector("a");

    expect(link?.getAttribute("href")).toBe("/projects");
    expect(link?.getAttribute("target")).toBeNull();
  });

  it("announces that an external content link opens a new tab", () => {
    render(<MarkdownContent>{"[GitHub](https://github.com/randifajar)"}</MarkdownContent>);

    // NFAC-A11Y-004: the icon is never the only indicator, so the accessible
    // name has to carry it.
    expect(screen.getByRole("link", { name: /opens in a new tab/i })).toBeInTheDocument();
  });

  it("lets a wide table scroll inside itself rather than the page (NFAC-RESP-001)", () => {
    const { container } = render(
      <MarkdownContent>{"| A | B |\n| --- | --- |\n| 1 | 2 |"}</MarkdownContent>,
    );

    const table = container.querySelector("table");

    expect(table).not.toBeNull();
    expect(table?.parentElement?.className).toContain("overflow-x-auto");
  });

  it("renders ordered lists, inline code, and blockquotes", () => {
    const { container } = render(
      <MarkdownContent>{"1. first\n2. second\n\n`npm run check`\n\n> Quoted."}</MarkdownContent>,
    );

    expect(container.querySelector("ol")?.querySelectorAll("li")).toHaveLength(2);
    expect(screen.getByText("npm run check").tagName).toBe("CODE");
    expect(container.querySelector("blockquote")?.textContent).toContain("Quoted.");
  });
});
