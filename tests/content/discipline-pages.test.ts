import { describe, expect, it } from "vitest";
import { contentSet } from "@/content/content-set";
import { disciplineIntros, workAreas } from "@/content/discipline-pages";
import { validateRelease } from "@/domain/content/release-validation";
import { workAreaSchema } from "@/domain/content/schemas";
import { validateContentSet } from "@/domain/content/validation";

/**
 * The Backend and Infrastructure pages' content (UX3 7.2, 7.3; V3 P6): the
 * discipline intros and the work areas.
 */

const rulesFor = (content: typeof contentSet) =>
  validateContentSet(content).map((issue) => issue.rule);

describe("the work area schema", () => {
  it("requires at least one cited role, so every area is traceable", () => {
    const [first] = workAreas;

    expect(() => workAreaSchema.parse({ ...first, experienceIds: [] })).toThrow();
  });
});

describe("rule 19: work areas cite real roles of their own discipline", () => {
  it("passes on the real content", () => {
    expect(rulesFor(contentSet)).not.toContain("work-area-discipline-matches");
    expect(rulesFor(contentSet)).not.toContain("valid-experience-references");
  });

  it("rejects a role that does not exist", () => {
    const [first, ...rest] = contentSet.workAreas;

    expect(
      rulesFor({
        ...contentSet,
        workAreas: [{ ...first!, experienceIds: ["experience-missing"] }, ...rest],
      }),
    ).toContain("valid-experience-references");
  });

  it("rejects a role from the other discipline", () => {
    const backendArea = contentSet.workAreas.find((area) => area.discipline === "backend")!;

    expect(
      rulesFor({
        ...contentSet,
        workAreas: [
          { ...backendArea, experienceIds: ["experience-zettabyte-ai-delivery-engineer"] },
        ],
      }),
    ).toContain("work-area-discipline-matches");
  });
});

describe("rule 20: at most one Published intro per discipline page", () => {
  it("passes on the real content", () => {
    expect(rulesFor(contentSet)).not.toContain("single-discipline-intro");
  });

  it("rejects two for the same discipline", () => {
    const backend = contentSet.disciplineIntros.find((intro) => intro.discipline === "backend")!;

    expect(
      rulesFor({
        ...contentSet,
        disciplineIntros: [...contentSet.disciplineIntros, { ...backend, id: "intro-second" }],
      }),
    ).toContain("single-discipline-intro");
  });
});

describe("release validation scans the new records for placeholders", () => {
  it("rejects a TODO in a Published work area, and passes the real content", () => {
    const [first, ...rest] = contentSet.workAreas;
    const poisoned = { ...contentSet, workAreas: [{ ...first!, body: "TODO: write" }, ...rest] };
    const rules = (content: typeof contentSet) =>
      validateRelease(content, { siteUrl: "https://example.com" }).map((issue) => issue.rule);

    expect(rules(poisoned)).toContain("no-published-placeholders");
    expect(rules(contentSet)).not.toContain("no-published-placeholders");
  });
});

/**
 * DEC-064: tools are named; how the employer's systems are wired is not.
 *
 * The infrastructure text is held to this approved list word for word, so a
 * more specific line cannot come back without a deliberate edit here,
 * reviewed against DEC-064. An approved list, not a denylist: a denylist
 * would have to spell out the names it keeps off the site, and this
 * repository is public.
 */
describe("the infrastructure work areas stay at the approved detail level (DEC-064)", () => {
  it("say exactly what was approved", () => {
    const infrastructure = workAreas
      .filter((area) => area.discipline === "infrastructure")
      .map(({ label, title, body, context }) => ({ label, title, body, context }));

    expect(infrastructure).toEqual([
      {
        label: "Jenkins",
        title: "Build agent modernization",
        body:
          "Migrated Jenkins build execution to an Ubuntu-based AWS EC2 agent, configuring " +
          "Docker Buildx, QEMU, the AWS CLI and headless Chrome, and resolved WebSocket " +
          "connectivity, Nginx reverse-proxy, file-permission and PATH issues.",
        context: "Part of a wider Jenkins modernization I contributed to",
      },
      {
        label: "CI/CD",
        title: "Quality, security and access",
        body:
          "Maintain and standardize Jenkins CI/CD pipelines across multiple repositories, with " +
          "security and quality checks, branch-based deployment workflows, and role-based " +
          "access controls for staging, pre-production and production.",
        context: undefined,
      },
      {
        label: "Linux & containers",
        title: "Services behind the proxy",
        body:
          "Support Linux-hosted Docker Compose services behind reverse proxies, investigating " +
          "TLS routing, environment variables, duplicate containers, failed deployments and " +
          "service connectivity.",
        context: undefined,
      },
      {
        label: "AWS",
        title: "Email-event delivery",
        body:
          "Troubleshoot AWS email-event delivery, dead-letter routing, cloud-region mismatches " +
          "and application configuration across environments.",
        context: undefined,
      },
    ]);
  });

  it("keep the infrastructure lead and scope as approved (OPEN-009, UX3 7.3)", () => {
    const infrastructure = disciplineIntros.find((intro) => intro.discipline === "infrastructure");

    expect(infrastructure?.lead).toBe(
      "After two years of building backend services, I moved to the infrastructure team in " +
        "August 2026. The backend foundation stayed: most delivery problems I now trace start " +
        "or end in application code.",
    );
    expect(infrastructure?.scope).toBe("A delivery and infrastructure role, not an SRE title");
  });
});

describe("the backend work areas", () => {
  it("are the four approved areas, in order", () => {
    expect(
      workAreas
        .filter((area) => area.discipline === "backend")
        .map((area) => `${area.label} — ${area.title}`),
    ).toEqual([
      "APIs & business workflows — Logic that matches the real process",
      "Data within applications — Configurable Data Tables and Export Workflows",
      "Asynchronous integrations — Notification and Document Service Integrations",
      "Debugging & release verification — Following failures across environments",
    ]);
  });
});
