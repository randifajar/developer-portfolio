import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

/**
 * Sections read through selectors, which read the real content modules. Those
 * are Draft, so the selectors are mocked here to exercise rendering. A final
 * block uses the unmocked selectors to prove the empty-state behaviour.
 */

const profile = {
  id: "profile-a",
  fullName: "Randi Fajar Wicaksono",
  displayName: "Randi Fajar Wicaksono",
  professionalTitle: "Backend-Focused Full-Stack Developer",
  headline: "Building reliable backend systems and integrations.",
  summary: "A **real** professional summary.",
  location: "Yogyakarta, Indonesia",
  remoteAvailability: "Open to remote opportunities",
  targetRoles: ["Backend Developer", "Software Engineer"],
  photoAssetId: "media-photo",
  publicationStatus: "published",
  updatedAt: "2026-08-04",
};

const project = {
  id: "project-a",
  slug: "alpha-project",
  title: "Alpha Project",
  summary: "A short public summary.",
  projectType: "professional",
  role: "Backend Developer",
  deliveryStatus: "completed",
  technologyIds: ["skill-ts"],
  featured: true,
  featuredPriority: 1,
  publicationStatus: "published",
  confidentialityClass: "sanitized",
};

const mocks = {
  getPublishedProfile: vi.fn(() => profile),
  getActiveResume: vi.fn(() => ({ id: "resume-a", publicPath: "/resume.pdf" })),
  getPublishedMediaAsset: vi.fn(() => null),
  getFeaturedProjects: vi.fn(() => [project]),
  getTechnologyNames: vi.fn(() => ["TypeScript"]),
  getPublishedExperience: vi.fn(() => [
    {
      id: "e-1",
      companyName: "Example Company",
      position: "Backend Developer",
      startDate: "2024-01-01",
      isCurrent: true,
      locationOrArrangement: "Yogyakarta, Indonesia",
      summary: "Role overview.",
      responsibilities: ["Built backend services."],
      contributions: ["Shipped an integration."],
      technologyIds: ["skill-ts"],
    },
  ]),
  getPublishedSkillGroups: vi.fn(() => [
    {
      group: "languages",
      skills: [{ id: "skill-ts", name: "TypeScript", classification: "strong-working-skill" }],
    },
  ]),
  getPublishedAIPractices: vi.fn(() => [
    {
      id: "ai-1",
      toolName: "Claude Code",
      activity: "Repository analysis",
      purpose: "Understand an unfamiliar codebase quickly.",
      humanResponsibility: "I confirm the analysis against the real system.",
      verificationMethod: "Checked against actual source.",
    },
  ]),
  getPublishedContactChannels: vi.fn(() => [
    {
      id: "c-email",
      label: "Email Randi",
      value: "randifajar2307@gmail.com",
      publicLink: "mailto:randifajar2307@gmail.com",
    },
  ]),
  getPublishedExternalProfiles: vi.fn(() => [
    { id: "x-li", platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com/in/x" },
    { id: "x-gh", platform: "github", label: "GitHub", url: "https://github.com/x" },
  ]),
};

vi.mock("@/domain/content/selectors", () => mocks);

const { AboutSection } = await import("@/components/sections/about-section");
const { AIWorkflowSection } = await import("@/components/sections/ai-workflow-section");
const { ContactSection } = await import("@/components/sections/contact-section");
const { ExperienceSection } = await import("@/components/sections/experience-section");
const { HeroSection } = await import("@/components/sections/hero-section");
const { ProjectsSection } = await import("@/components/sections/projects-section");
const { SkillsSection } = await import("@/components/sections/skills-section");

describe("Hero (FAC-PROFILE-001, FAC-HOME-002)", () => {
  it("renders identity, title, headline, location, and availability", () => {
    render(<HeroSection />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Randi Fajar Wicaksono");
    expect(screen.getByText("Backend-Focused Full-Stack Developer")).toBeInTheDocument();
    expect(screen.getByText(/Building reliable backend systems/)).toBeInTheDocument();
    expect(screen.getByText(/Yogyakarta, Indonesia/)).toBeInTheDocument();
  });

  it("offers View Projects and the Resume action", () => {
    render(<HeroSection />);

    expect(screen.getByRole("link", { name: "View Projects" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View Resume/ })).toBeInTheDocument();
  });

  it("stays usable with no photograph and shows no broken image (FAC-HOME-006)", () => {
    const { container } = render(<HeroSection />);

    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders exactly one h1 (NFAC-A11Y-003)", () => {
    render(<HeroSection />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });
});

describe("About (FAC-PROFILE-003)", () => {
  it("renders the summary as formatted prose", () => {
    render(<AboutSection />);

    expect(screen.getByText("real").tagName).toBe("STRONG");
  });

  it("lists the target roles", () => {
    render(<AboutSection />);

    expect(screen.getByText("Backend Developer")).toBeInTheDocument();
  });
});

describe("Selected Projects (FAC-HOME-003, FAC-HOME-004)", () => {
  it("renders a card per featured project", () => {
    render(<ProjectsSection />);

    expect(screen.getByRole("heading", { name: "Alpha Project" })).toBeInTheDocument();
  });

  it("renders no filler card beyond the real projects", () => {
    render(<ProjectsSection />);

    // One project in, one article out. No empty slot, no "Coming Soon".
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
  });

  it("shows status, role, and technologies on the card", () => {
    render(<ProjectsSection />);

    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText(/Backend Developer/)).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("links the card to its case study", () => {
    render(<ProjectsSection />);

    expect(screen.getByRole("link", { name: "Alpha Project" })).toHaveAttribute(
      "href",
      "/projects/alpha-project",
    );
  });

  it("offers View All Projects", () => {
    render(<ProjectsSection />);

    expect(screen.getByRole("link", { name: "View All Projects" })).toHaveAttribute(
      "href",
      "/projects",
    );
  });
});

describe("Work Experience (FAC-EXP-001)", () => {
  it("renders company, position, dates, and the current indicator", () => {
    render(<ExperienceSection />);

    expect(screen.getByText("Example Company")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Backend Developer" })).toBeInTheDocument();
    expect(screen.getByText(/Jan 2024 — Present/)).toBeInTheDocument();
    expect(screen.getByText("Current")).toBeInTheDocument();
  });

  it("renders responsibilities and contributions separately", () => {
    render(<ExperienceSection />);

    expect(screen.getByText("Built backend services.")).toBeInTheDocument();
    expect(screen.getByText("Shipped an integration.")).toBeInTheDocument();
  });
});

describe("Technical Skills (FAC-SKILL-001, FAC-SKILL-003)", () => {
  it("groups skills by discipline with a classification label", () => {
    render(<SkillsSection />);

    expect(screen.getByRole("heading", { name: "Languages" })).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Strong working skill")).toBeInTheDocument();
  });

  it("renders no percentage, progress bar, or star rating", () => {
    const { container } = render(<SkillsSection />);

    expect(container.querySelector("progress")).toBeNull();
    expect(container.querySelector('[role="progressbar"]')).toBeNull();
    expect(container.textContent).not.toMatch(/\d+\s*%/);
  });
});

describe("AI-Assisted Engineering (FAC-AI-001, FAC-AI-002)", () => {
  it("renders the activity, tool, human responsibility, and verification", () => {
    render(<AIWorkflowSection />);

    expect(screen.getByRole("heading", { name: "Repository analysis" })).toBeInTheDocument();
    expect(screen.getByText(/Claude Code/)).toBeInTheDocument();
    expect(screen.getByText(/I confirm the analysis/)).toBeInTheDocument();
    expect(screen.getByText(/Checked against actual source/)).toBeInTheDocument();
  });

  it("always pairs AI activity with human accountability (FAC-AI-002)", () => {
    render(<AIWorkflowSection />);

    expect(screen.getByRole("heading", { name: /My responsibility/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /How it is verified/i })).toBeInTheDocument();
  });
});

describe("Contact (FAC-CONTACT-001..005)", () => {
  it("uses a mailto link as the primary action", () => {
    render(<ContactSection />);

    expect(screen.getByRole("link", { name: "Email Randi" })).toHaveAttribute(
      "href",
      "mailto:randifajar2307@gmail.com",
    );
  });

  it("renders LinkedIn and GitHub with safe new-tab attributes", () => {
    render(<ContactSection />);

    for (const name of ["LinkedIn", "GitHub"]) {
      const link = screen.getByRole("link", { name: new RegExp(name) });
      expect(link.getAttribute("rel")).toContain("noopener");
      expect(link.getAttribute("rel")).toContain("noreferrer");
    }
  });

  it("contains no form and no submit control (FAC-CONTACT-005)", () => {
    const { container } = render(<ContactSection />);

    expect(container.querySelector("form")).toBeNull();
    expect(container.querySelector("input")).toBeNull();
    expect(container.querySelector("textarea")).toBeNull();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("never claims a message was sent (FAC-CONTACT-002, NFAC-REL-002)", () => {
    const { container } = render(<ContactSection />);

    expect(container.textContent).not.toMatch(
      /message sent|thank you for your message|we'll be in touch/i,
    );
  });
});
