import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BackendPage from "@/app/(modes)/backend/page";
import InfrastructurePage from "@/app/(modes)/infrastructure/page";
import ModesLayout from "@/app/(modes)/layout";
import OverallPage from "@/app/(modes)/page";

/**
 * The Backend and Infrastructure pages against the real content (UX3 7.2,
 * 7.3; V3 P6), each rendered inside the `(modes)` layout as Next.js renders
 * it, since the h1 is the layout's.
 */

const navigation = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname }));

function renderMode(pathname: string, Page: () => React.ReactElement) {
  navigation.pathname = pathname;
  return render(
    <ModesLayout>
      <Page />
    </ModesLayout>,
  );
}

/** Each section's accessible name and surface, in document order. */
function sectionsOf(container: HTMLElement) {
  return Array.from(container.querySelectorAll("section[data-surface]")).map((section) => [
    document.getElementById(section.getAttribute("aria-labelledby") ?? "")?.textContent?.trim(),
    section.getAttribute("data-surface"),
  ]);
}

describe("Backend (UX3 7.2)", () => {
  it("renders its sections in the approved order, each on its approved surface", () => {
    const { container } = renderMode("/backend", BackendPage);

    expect(sectionsOf(container)).toEqual([
      ["Behind the Application.", "dark"],
      ["Services for academic and administrative workflows.", "light"],
      ["Backend work.", "white"],
      ["Backend roles at Zettabyte Pte Ltd.", "light"],
      ["Grouped by how I use it.", "navy"],
    ]);
  });

  it("has exactly one h1, and the hero action leads to the first section", () => {
    const { container } = renderMode("/backend", BackendPage);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: /explore backend work/i })).toHaveAttribute(
      "href",
      "#backend-work",
    );
    expect(container.querySelector("#backend-work")).toHaveAttribute("data-surface", "light");
  });

  it("lists the four backend work areas", () => {
    renderMode("/backend", BackendPage);
    const work = within(
      screen.getByRole("region", { name: "Services for academic and administrative workflows." }),
    );

    expect(work.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "Logic that matches the real process",
      "Configurable Data Tables and Export Workflows",
      "Notification and Document Service Integrations",
      "Following failures across environments",
    ]);
  });

  /**
   * FAC-EXP-001: each entry shows the position, exact dates, summary,
   * responsibilities and contributions as separate lists, and technologies.
   */
  it("lists the backend roles, most recent first, each as FAC-EXP-001 requires", () => {
    renderMode("/backend", BackendPage);
    const experience = screen.getByRole("region", { name: "Backend roles at Zettabyte Pte Ltd." });
    const roles = within(experience).getAllByRole("article");

    expect(
      roles.map((role) => within(role).getByRole("heading", { level: 3 }).textContent),
    ).toEqual(["Backend Developer", "Backend Developer, Contract", "Backend Developer Intern"]);
    expect(roles[0]).toHaveTextContent("Apr 2025 – Jul 2026");
    expect(roles[2]).toHaveTextContent("Jul 2024 – Oct 2024");

    const fullTime = within(roles[0]!);
    expect(fullTime.getByRole("heading", { level: 4, name: "Responsibilities" })).toBeVisible();
    expect(fullTime.getByRole("heading", { level: 4, name: "Contributions" })).toBeVisible();
    expect(fullTime.getByText(/audit-log service using Redis and BullMQ/)).toBeVisible();
    expect(roles[0]).toHaveTextContent("Node.js");
  });

  it("says where the latest role was, as completed work, and links to it", () => {
    renderMode("/backend", BackendPage);
    const experience = within(
      screen.getByRole("region", { name: "Backend roles at Zettabyte Pte Ltd." }),
    );

    // The infrastructure role ended on 27 November 2026, so the line gives its
    // span rather than "Since …" (DEC-072).
    expect(
      experience.getByText(
        /From August 2026 to November 2026 my role was on the infrastructure team\./,
      ),
    ).toBeVisible();
    expect(experience.queryByText(/Since August 2026/)).toBeNull();
    expect(experience.getByRole("link", { name: "Infrastructure" })).toHaveAttribute(
      "href",
      "/infrastructure",
    );
  });

  it("shows the backend case study under selected work", () => {
    renderMode("/backend", BackendPage);
    const work = within(screen.getByRole("region", { name: "Backend work." }));

    expect(
      work.getByRole("link", { name: "Read the case study: Jury Process Management Integration" }),
    ).toHaveAttribute("href", "/projects/jury-process-management-integration");
  });

  it("lists the backend overviews after the case study, unlinked, and not the Draft one", () => {
    renderMode("/backend", BackendPage);
    const work = within(screen.getByRole("region", { name: "Backend work." }));

    expect(work.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "Jury Process Management Integration",
      "Notification Hub and AWS Email Events",
      "Configurable Data Tables and Export Workflows",
      "Notification and Document Service Integrations",
      "Evaluation and Certification Platform",
    ]);
    // An overview has no page of its own, so only the case study links (DEC-060).
    expect(work.getAllByRole("link", { name: /^Read the case study/ })).toHaveLength(1);
  });
});

describe("Infrastructure (UX3 7.3)", () => {
  it("renders its sections in the approved order, each on its approved surface", () => {
    const { container } = renderMode("/infrastructure", InfrastructurePage);

    // No infrastructure case study exists yet, so the projects section holds
    // the infrastructure overviews, Published on 2026-11-26 (OPEN-011).
    expect(sectionsOf(container)).toEqual([
      ["Beyond Deployment.", "dark"],
      ["From backend developer to the infrastructure team.", "light"],
      ["Pipelines, environments, and what breaks.", "white"],
      ["Infrastructure projects.", "light"],
      ["Grouped by how I use them.", "navy"],
    ]);
  });

  it("lists the infrastructure overviews under its projects, unlinked, and not the Draft one", () => {
    renderMode("/infrastructure", InfrastructurePage);
    const work = within(screen.getByRole("region", { name: "Infrastructure projects." }));

    expect(work.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "Jenkins CI/CD Migration and Agent Modernization",
      "Notification Hub and AWS Email Events",
      "Evaluation and Certification Platform",
    ]);
    expect(work.queryAllByRole("link", { name: /^Read the case study/ })).toEqual([]);
  });

  it("has exactly one h1, and the hero action leads to the first section", () => {
    const { container } = renderMode("/infrastructure", InfrastructurePage);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: /explore infrastructure work/i })).toHaveAttribute(
      "href",
      "#infrastructure-work",
    );
    expect(container.querySelector("#infrastructure-work")).toHaveAttribute(
      "data-surface",
      "light",
    );
  });

  it("states the transition from the records: the most recent role, before, and the scope", () => {
    renderMode("/infrastructure", InfrastructurePage);
    const transition = within(
      screen.getByRole("region", { name: "From backend developer to the infrastructure team." }),
    );

    // Ended on 27 November 2026: "Most recent role", never "Now" (DEC-072).
    expect(transition.getByText("Most recent role")).toBeVisible();
    expect(transition.queryByText("Now")).toBeNull();
    expect(
      transition.getByText("AI Delivery Engineer, Infrastructure Team · Aug 2026 – Nov 2026"),
    ).toBeVisible();
    expect(transition.getByText("Backend Developer · Apr 2025 – Jul 2026")).toBeVisible();
    expect(
      transition.getByText("A delivery and infrastructure role, not an SRE title"),
    ).toBeVisible();
  });

  it("frames the Jenkins migration with its context", () => {
    renderMode("/infrastructure", InfrastructurePage);
    const jenkins = screen.getByRole("article", { name: "Build agent modernization" });

    expect(jenkins).toHaveTextContent("Part of a wider Jenkins modernization I contributed to");
  });

  it("links the backend side from the tools", () => {
    renderMode("/infrastructure", InfrastructurePage);
    const tools = within(screen.getByRole("region", { name: "Grouped by how I use them." }));

    expect(tools.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "Cloud",
      "Linux & containers",
      "Automation",
      "Backend foundation",
    ]);
    expect(tools.getByRole("link", { name: "Backend" })).toHaveAttribute("href", "/backend");
  });

  /** UX3 7.3: never presented as SRE in an eyebrow, heading, or tag. */
  it("calls the role SRE in no heading or eyebrow", () => {
    const { container } = renderMode("/infrastructure", InfrastructurePage);
    const titles = Array.from(container.querySelectorAll("h1, h2, h3, h4, p.uppercase, .uppercase"))
      .map((element) => element.textContent ?? "")
      .join(" | ");

    expect(titles).not.toMatch(/\bSRE\b|site reliability/i);
  });
});

describe("every offered hero action has its target on the page", () => {
  for (const [pathname, Page] of [
    ["/", OverallPage],
    ["/backend", BackendPage],
    ["/infrastructure", InfrastructurePage],
  ] as const) {
    it(`on ${pathname}`, () => {
      const { container } = renderMode(pathname, Page);
      const hero = container.querySelector("section[data-surface]")!;
      const actions = Array.from(hero.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));

      expect(actions, "no hero action offered").toHaveLength(1);
      for (const action of actions) {
        const target = action.getAttribute("href")!;
        expect(container.querySelector(target), `${target} is not on the page`).not.toBeNull();
      }
    });
  }
});
