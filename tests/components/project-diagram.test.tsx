import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectDiagram } from "@/components/project/project-diagram";
import { ProjectSection } from "@/components/project/project-section";
import { getPublishedProjects } from "@/domain/content/selectors";
import type { CaseStudyDiagram } from "@/domain/content/schemas";

/**
 * A case study's diagram (DEC-076, backlog item 11).
 *
 * jsdom applies no stylesheet, so both layouts are in the document here; which
 * one shows at which width is asserted in the browser, in
 * e2e/project-diagram.spec.ts. These tests hold what does not depend on width:
 * the figure's words, their order, and how a screen reader meets them.
 */

const handoff: CaseStudyDiagram = {
  kind: "handoff",
  title: "Work across two systems",
  description: "Three steps across two systems, with two handoffs between them.",
  lanes: ["First system", "Second system"],
  steps: [
    { lane: 0, label: "Started" },
    { lane: 1, label: "Processed" },
    { lane: 0, label: "Finished" },
  ],
  handoffs: ["Sent across", "Sent back"],
  note: { title: "A note.", body: "What the note explains." },
};

const pipeline: CaseStudyDiagram = {
  kind: "pipeline",
  title: "A pipeline",
  description: "Four stages in order, two of them checked in two modes.",
  stages: [
    { label: "Input" },
    { label: "Check one", emphasis: true },
    { label: "Check two", emphasis: true },
    { label: "Output" },
  ],
  modes: {
    label: "Two modes",
    items: [
      { name: "Fast", heading: "Always", body: "The quick checks." },
      { name: "Full", heading: "Before a release", body: "Everything.", emphasis: true },
    ],
  },
};

const layout = (container: HTMLElement, name: "wide" | "narrow") => {
  const element = container.querySelector<HTMLElement>(`[data-layout="${name}"]`);
  if (!element) throw new Error(`no ${name} layout`);
  return element;
};

describe("ProjectDiagram is one figure, read once", () => {
  it("names its image by the description, and captions it with the title", () => {
    render(<ProjectDiagram diagram={handoff} />);

    const figure = screen.getByRole("figure", { name: "Work across two systems" });
    expect(within(figure).getByRole("img")).toHaveAccessibleName(handoff.description);
  });

  it("keeps both layouts inside the one image, so a screen reader hears it once", () => {
    const { container } = render(<ProjectDiagram diagram={pipeline} />);
    const image = screen.getByRole("img");

    expect(image).toContainElement(layout(container, "wide"));
    expect(image).toContainElement(layout(container, "narrow"));
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });
});

describe("a handoff diagram", () => {
  it("numbers the steps and the handoffs between them in order, down one column", () => {
    const { container } = render(<ProjectDiagram diagram={handoff} />);
    const text = layout(container, "narrow").textContent ?? "";
    const order = ["1Started", "2Sent across", "3Processed", "4Sent back", "5Finished"];
    const positions = order.map((item) => text.indexOf(item));

    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it("places them left to right across the lanes, where the order is the grid's", () => {
    const { container } = render(<ProjectDiagram diagram={handoff} />);
    const wide = within(layout(container, "wide"));
    const placement = (label: string, property: "grid-column" | "grid-row") => {
      const style = wide.getByText(label).closest("[style*='grid-column']")?.getAttribute("style");
      return new RegExp(`${property}:\\s*([^;]+)`).exec(style ?? "")?.[1]?.trim();
    };
    const labels = ["Started", "Sent across", "Processed", "Sent back", "Finished"];

    expect(labels.map((label) => placement(label, "grid-column"))).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
    ]);
    // Steps sit in their lanes' rows; each handoff spans all three rows.
    expect(labels.map((label) => placement(label, "grid-row"))).toEqual([
      "1",
      "1 / 4",
      "3",
      "1 / 4",
      "1",
    ]);
    expect(wide.getByText("1")).toBeInTheDocument();
    expect(wide.getByText("5")).toBeInTheDocument();
  });

  it("puts each step in its lane", () => {
    const { container } = render(<ProjectDiagram diagram={handoff} />);
    const narrow = layout(container, "narrow").textContent ?? "";

    expect(narrow.indexOf("First system")).toBeLessThan(narrow.indexOf("Started"));
    expect(narrow.indexOf("Second system")).toBeLessThan(narrow.indexOf("Processed"));
    expect(narrow.lastIndexOf("First system")).toBeLessThan(narrow.indexOf("Finished"));
    expect(narrow.lastIndexOf("First system")).toBeGreaterThan(narrow.indexOf("Processed"));
  });

  it("shows the note once, under both layouts", () => {
    render(<ProjectDiagram diagram={handoff} />);

    expect(screen.getAllByText("What the note explains.")).toHaveLength(1);
  });
});

describe("a pipeline diagram", () => {
  it("lists the stages in order, with the last one as the output", () => {
    const { container } = render(<ProjectDiagram diagram={pipeline} />);
    const stages = [...layout(container, "narrow").children].filter((child) =>
      child.className.includes("rounded"),
    );

    expect(stages.map((stage) => stage.textContent)).toEqual([
      "Input",
      "Check one",
      "Check two",
      "Output",
    ]);
    expect(stages.at(-1)?.className).toContain("bg-accent ");
    expect(stages[1]?.className).toContain("bg-accent-subtle");
    expect(stages[0]?.className).toContain("bg-surface");
  });

  it("brackets the emphasised stages above the modes they run in", () => {
    const { container } = render(<ProjectDiagram diagram={pipeline} />);
    const bracket = within(layout(container, "wide")).getByText("Two modes").parentElement;

    // Columns 2 and 3: the two emphasised stages.
    expect(bracket?.getAttribute("style")).toContain("grid-column: 2 / span 2");
  });

  it("draws no bracket when no stage is emphasised", () => {
    const plain: CaseStudyDiagram = {
      ...pipeline,
      stages: pipeline.stages.map(({ label }) => ({ label })),
    };
    const { container } = render(<ProjectDiagram diagram={plain} />);

    expect(within(layout(container, "wide")).queryByText("Two modes")).toBeNull();
    // The modes themselves are still shown.
    expect(within(layout(container, "wide")).getByText("Before a release")).toBeInTheDocument();
  });
});

describe("the diagram's place on a case study", () => {
  it("sits under the Architecture and Workflow text, which it never replaces", () => {
    render(
      <ProjectSection
        heading="Architecture and Workflow"
        body="The text the diagram illustrates."
        figure={<ProjectDiagram diagram={handoff} />}
      />,
    );

    const text = screen.getByText("The text the diagram illustrates.");
    const figure = screen.getByRole("figure");
    expect(text.compareDocumentPosition(figure) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("is drawn for both published case studies, each beside its own text", () => {
    const withDiagrams = getPublishedProjects().filter((project) => project.diagram);

    expect(withDiagrams.map((project) => project.slug).sort()).toEqual([
      "jury-process-management-integration",
      "personal-developer-portfolio",
    ]);
    for (const project of withDiagrams) {
      expect(project.workflowOrArchitecture).toBeTruthy();
    }
  });
});
