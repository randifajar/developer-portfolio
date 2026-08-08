import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectNavigation } from "@/components/project/project-navigation";
import { ProjectResponsibility } from "@/components/project/project-responsibility";
import { ProjectSection } from "@/components/project/project-section";
import type { ProjectCaseStudy } from "@/domain/content/schemas";
import { ROUTES, SECTION_IDS } from "@/lib/constants";

/**
 * The Project Detail building blocks.
 *
 * All three were at zero unit coverage. The detail page exercises them through
 * end-to-end tests, but only in the one configuration the current content
 * happens to produce — a solo personal project with no neighbours. Every other
 * branch, including the one that separates team work from Randi's own, had
 * never rendered.
 */

/* ------------------------------------------------------------------------- */
/* ProjectResponsibility                                                      */
/* ------------------------------------------------------------------------- */

/**
 * FAC-PROJECT-003 and NFAC-CONTENT-002. This is a truthfulness control, not a
 * layout preference: a merged list silently attributes a team's work to the
 * author, and a technical interviewer probing ownership is exactly who reads
 * this section.
 */
describe("ProjectResponsibility keeps team work separable from personal work", () => {
  it("always renders the personal block", () => {
    render(<ProjectResponsibility personal={["Designed the schema."]} team={undefined} />);

    expect(screen.getByRole("heading", { name: /my responsibility/i })).toBeVisible();
    expect(screen.getByText("Designed the schema.")).toBeVisible();
  });

  it("omits the team block entirely for solo work", () => {
    render(<ProjectResponsibility personal={["Did it all."]} team={undefined} />);

    expect(screen.queryByRole("heading", { name: /team or external/i })).not.toBeInTheDocument();
  });

  it("omits the team block for an empty list rather than rendering an empty heading", () => {
    render(<ProjectResponsibility personal={["Did it all."]} team={[]} />);

    expect(screen.queryByRole("heading", { name: /team or external/i })).not.toBeInTheDocument();
  });

  it("renders both blocks with distinct headings when team work exists", () => {
    render(
      <ProjectResponsibility personal={["I wrote the parser."]} team={["The team ran QA."]} />,
    );

    expect(screen.getByRole("heading", { name: /my responsibility/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: /team or external responsibility/i })).toBeVisible();
  });

  /**
   * The assertion that actually enforces the requirement. Rendering both
   * headings proves nothing if the items are pooled underneath them.
   */
  it("never lists team work under the personal heading", () => {
    render(
      <ProjectResponsibility personal={["I wrote the parser."]} team={["The team ran QA."]} />,
    );

    const lists = screen.getAllByRole("list");

    expect(lists).toHaveLength(2);

    const [personalList, teamList] = lists;

    expect(within(personalList as HTMLElement).getByText("I wrote the parser.")).toBeVisible();
    expect(within(personalList as HTMLElement).queryByText("The team ran QA.")).toBeNull();
    expect(within(teamList as HTMLElement).getByText("The team ran QA.")).toBeVisible();
    expect(within(teamList as HTMLElement).queryByText("I wrote the parser.")).toBeNull();
  });

  it("keeps its headings below the page heading (NFAC-A11Y-003)", () => {
    const { container } = render(<ProjectResponsibility personal={["A."]} team={["B."]} />);

    // The page h1 is the project title and section headings are h2, so these
    // sit at h3. An h1 or h2 here would break the outline.
    expect(container.querySelector("h1, h2")).toBeNull();
    expect(container.querySelectorAll("h3")).toHaveLength(2);
  });
});

/* ------------------------------------------------------------------------- */
/* ProjectSection                                                             */
/* ------------------------------------------------------------------------- */

describe("ProjectSection omits itself when it has nothing to say", () => {
  it("renders nothing without a body or children (FAC-PROJECT-006)", () => {
    const { container } = render(<ProjectSection heading="Architecture" />);

    expect(container).toBeEmptyDOMElement();
  });

  it("announces no heading when omitted", () => {
    const { container } = render(<ProjectSection heading="Architecture" body="" />);

    // An empty string is as absent as undefined — a heading with nothing under
    // it is worse for a screen-reader user than no section.
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a markdown body", () => {
    render(<ProjectSection heading="Outcome" body="The site **shipped**." />);

    expect(screen.getByRole("heading", { level: 2, name: "Outcome" })).toBeVisible();
    expect(screen.getByText("shipped")).toBeVisible();
  });

  it("renders children without a body", () => {
    render(
      <ProjectSection heading="Responsibility">
        <p>Custom block.</p>
      </ProjectSection>,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Responsibility" })).toBeVisible();
    expect(screen.getByText("Custom block.")).toBeVisible();
  });

  it("renders as h2, one level below the project title", () => {
    const { container } = render(<ProjectSection heading="Context" body="Text." />);

    expect(container.querySelector("h1")).toBeNull();
    expect(container.querySelector("h2")).not.toBeNull();
  });
});

/* ------------------------------------------------------------------------- */
/* ProjectNavigation                                                          */
/* ------------------------------------------------------------------------- */

function projectStub(slug: string, title: string): ProjectCaseStudy {
  return { slug, title } as unknown as ProjectCaseStudy;
}

describe("ProjectNavigation", () => {
  it("always offers a way back to the index", () => {
    render(<ProjectNavigation previous={null} next={null} resumeHref={null} contactHref={null} />);

    expect(screen.getByRole("link", { name: /back to projects/i })).toHaveAttribute(
      "href",
      ROUTES.projects,
    );
  });

  it("renders no neighbour links when there are no neighbours", () => {
    render(<ProjectNavigation previous={null} next={null} resumeHref={null} contactHref={null} />);

    expect(screen.queryByText(/previous project/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/next project/i)).not.toBeInTheDocument();
  });

  it("links a previous neighbour to its slug", () => {
    render(
      <ProjectNavigation
        previous={projectStub("earlier", "Earlier Project")}
        next={null}
        resumeHref={null}
        contactHref={null}
      />,
    );

    expect(screen.getByRole("link", { name: /earlier project/i })).toHaveAttribute(
      "href",
      "/projects/earlier",
    );
    expect(screen.queryByText(/next project/i)).not.toBeInTheDocument();
  });

  it("links a next neighbour to its slug", () => {
    render(
      <ProjectNavigation
        previous={null}
        next={projectStub("later", "Later Project")}
        resumeHref={null}
        contactHref={null}
      />,
    );

    expect(screen.getByRole("link", { name: /later project/i })).toHaveAttribute(
      "href",
      "/projects/later",
    );
    expect(screen.queryByText(/previous project/i)).not.toBeInTheDocument();
  });

  it("offers no Resume action when none is active (FAC-RESUME-003)", () => {
    render(<ProjectNavigation previous={null} next={null} resumeHref={null} contactHref={null} />);

    expect(screen.queryByRole("link", { name: /resume/i })).not.toBeInTheDocument();
  });

  it("offers the Resume when one is active", () => {
    render(
      <ProjectNavigation previous={null} next={null} resumeHref="/resume.pdf" contactHref={null} />,
    );

    expect(screen.getByRole("link", { name: /view resume/i })).toHaveAttribute(
      "href",
      "/resume.pdf",
    );
  });

  it("falls back to the contact section when no channel is Published", () => {
    render(<ProjectNavigation previous={null} next={null} resumeHref={null} contactHref={null} />);

    expect(screen.getByRole("link", { name: /^contact$/i })).toHaveAttribute(
      "href",
      `${ROUTES.home}#${SECTION_IDS.contact}`,
    );
  });

  it("uses the Published contact channel when there is one", () => {
    render(
      <ProjectNavigation
        previous={null}
        next={null}
        resumeHref={null}
        contactHref="mailto:person@example.com"
      />,
    );

    expect(screen.getByRole("link", { name: /^contact$/i })).toHaveAttribute(
      "href",
      "mailto:person@example.com",
    );
  });

  it("labels itself so the landmark is distinguishable", () => {
    render(<ProjectNavigation previous={null} next={null} resumeHref={null} contactHref={null} />);

    expect(screen.getByRole("navigation", { name: /related project/i })).toBeVisible();
  });
});
