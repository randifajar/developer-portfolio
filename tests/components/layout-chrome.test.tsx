import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { NAVIGATION_LINKS } from "@/components/layout/navigation-links";

const externalLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/randifajar" },
  { label: "GitHub", href: "https://github.com/randifajar" },
];

function renderMenu(resumeHref: string | null = "/resume.pdf") {
  return render(
    <MobileNavigation
      links={NAVIGATION_LINKS}
      resumeHref={resumeHref}
      externalLinks={externalLinks}
    />,
  );
}

describe("navigation inventory (UX 6.1)", () => {
  it("covers every approved destination", () => {
    expect(NAVIGATION_LINKS.map((link) => link.label)).toEqual([
      "Projects",
      "Experience",
      "Skills",
      "AI Workflow",
      "Contact",
    ]);
  });

  it("uses absolute anchors so they resolve from a Project Detail page too", () => {
    const anchors = NAVIGATION_LINKS.filter((link) => link.href.includes("#"));

    expect(anchors.length).toBeGreaterThan(0);
    for (const link of anchors) {
      expect(link.href.startsWith("/#")).toBe(true);
    }
  });
});

describe("MobileNavigation accessibility (UX 6.2, TD 15.2)", () => {
  it("reports collapsed state before opening", () => {
    renderMenu();

    expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("reports expanded state after opening", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("button", { name: /open menu/i }));

    expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("gives the menu an accessible label", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("button", { name: /open menu/i }));

    expect(screen.getByRole("navigation", { name: /site navigation/i })).toBeInTheDocument();
  });

  it("closes on Escape from anywhere", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByRole("navigation", { name: /site navigation/i })).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("navigation", { name: /site navigation/i })).not.toBeInTheDocument();
  });

  it("closes when a link is selected", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    const menu = screen.getByRole("navigation", { name: /site navigation/i });
    await user.click(within(menu).getByRole("link", { name: "Projects" }));

    expect(screen.queryByRole("navigation", { name: /site navigation/i })).not.toBeInTheDocument();
  });

  it("returns focus to the trigger on close, so the keyboard position is not lost", async () => {
    const user = userEvent.setup();
    renderMenu();

    const trigger = screen.getByRole("button", { name: /open menu/i });
    await user.click(trigger);
    await user.keyboard("{Escape}");

    expect(trigger).toHaveFocus();
  });

  it("moves focus into the drawer when it opens", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("button", { name: /open menu/i }));

    expect(screen.getByRole("button", { name: /close menu/i })).toHaveFocus();
  });

  it("locks background scrolling while open and restores it on close", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("exposes every navigation destination on mobile (NFAC-RESP-002)", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    const menu = screen.getByRole("navigation", { name: /site navigation/i });

    for (const link of NAVIGATION_LINKS) {
      expect(within(menu).getByRole("link", { name: link.label })).toBeInTheDocument();
    }
  });

  it("offers the Resume action when one is active", async () => {
    const user = userEvent.setup();
    renderMenu("/resume.pdf");

    await user.click(screen.getByRole("button", { name: /open menu/i }));

    expect(screen.getByRole("link", { name: /view resume/i })).toBeInTheDocument();
  });

  it("omits the Resume action when none is active (FAC-RESUME-003)", async () => {
    const user = userEvent.setup();
    renderMenu(null);

    await user.click(screen.getByRole("button", { name: /open menu/i }));

    expect(screen.queryByRole("link", { name: /view resume/i })).not.toBeInTheDocument();
  });

  it("applies safe new-tab attributes to external links in the menu", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    const gitHub = screen.getByRole("link", { name: /GitHub/ });

    expect(gitHub.getAttribute("rel")).toContain("noopener");
    expect(gitHub.getAttribute("rel")).toContain("noreferrer");
  });

  it("meets the 44px touch target minimum on the trigger (NFAC-RESP-004)", () => {
    renderMenu();

    const trigger = screen.getByRole("button", { name: /open menu/i });

    expect(trigger.className).toContain("min-h-11");
    expect(trigger.className).toContain("min-w-11");
  });
});

describe("Header", () => {
  it("identifies the site even while the profile is Draft", () => {
    render(<Header />);

    expect(screen.getAllByRole("link", { name: "Randi Fajar Wicaksono" }).length).toBeGreaterThan(
      0,
    );
  });

  it("renders the main navigation landmark", () => {
    render(<Header />);

    expect(screen.getByRole("navigation", { name: /main navigation/i })).toBeInTheDocument();
  });

  it("offers the Resume action now that one is active and Published", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: /view resume/i })).toHaveAttribute(
      "href",
      "/resume.pdf",
    );
  });
});

describe("Footer", () => {
  it("renders the owner name and the supplied year", () => {
    render(<Footer year={2026} />);

    expect(screen.getByText("Randi Fajar Wicaksono")).toBeInTheDocument();
    expect(screen.getByText("© 2026")).toBeInTheDocument();
  });

  it("renders the approved public links (FAC-CONTACT-001, 003, 004)", () => {
    render(<Footer year={2026} />);

    expect(screen.getByRole("link", { name: /randifajar2307@gmail.com/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /LinkedIn/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /GitHub/ })).toBeInTheDocument();
  });

  it("uses a mailto link for email and never claims delivery (FAC-CONTACT-002)", () => {
    render(<Footer year={2026} />);

    const email = screen.getByRole("link", { name: /randifajar2307@gmail.com/ });

    expect(email.getAttribute("href")).toMatch(/^mailto:/);
  });

  it("provides a back-to-top action", () => {
    render(<Footer year={2026} />);

    expect(screen.getByRole("link", { name: /back to top/i })).toHaveAttribute(
      "href",
      "#main-content",
    );
  });
});
