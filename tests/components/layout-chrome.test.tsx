import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyEmail } from "@/components/layout/copy-email";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ModeSwitch } from "@/components/layout/mode-switch";
import { ResumeMenu, type ResumeMenuItem } from "@/components/layout/resume-menu";

/**
 * The V3 chrome: header, mode switch, Résumé menu, footer (UX3 6, 7.7).
 *
 * This file replaced the v2 suite for the section links and the mobile menu,
 * both of which V3 removed: the header now holds the mode switch and the
 * Résumé menu only (UX3 6.1).
 */

const navigation = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname }));

afterEach(() => {
  navigation.pathname = "/";
});

describe("ModeSwitch (UX3 6.2)", () => {
  it("links the three modes, in order, to real routes (V3-NAV-001, 002)", () => {
    render(<ModeSwitch />);
    const links = within(screen.getByRole("navigation", { name: "Modes" })).getAllByRole("link");

    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/",
      "/backend",
      "/infrastructure",
    ]);
  });

  it("marks the current mode, and only it", () => {
    navigation.pathname = "/backend";
    render(<ModeSwitch />);

    expect(screen.getByRole("link", { name: "Backend" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Overall" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "Infrastructure" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("marks no mode off the mode routes", () => {
    navigation.pathname = "/projects";
    render(<ModeSwitch />);

    for (const link of screen.getAllByRole("link")) {
      expect(link).not.toHaveAttribute("aria-current");
    }
  });

  it("keeps the full accessible name where the label shortens to Infra", () => {
    render(<ModeSwitch />);
    const link = screen.getByRole("link", { name: "Infrastructure" });

    expect(link).toHaveTextContent("Infra");
  });

  it("shows the current mode by shape, not colour alone (a filled pill)", () => {
    navigation.pathname = "/infrastructure";
    render(<ModeSwitch />);

    expect(screen.getByRole("link", { name: "Infrastructure" }).className).toContain(
      "rounded-full",
    );
    expect(screen.getByRole("link", { name: "Infrastructure" }).className).toContain("bg-accent");
    expect(screen.getByRole("link", { name: "Overall" }).className).not.toContain("bg-accent");
  });
});

describe("ResumeMenu (UX3 6.3)", () => {
  const items: readonly ResumeMenuItem[] = [
    { variant: "backend", label: "Backend résumé", href: "/resume.pdf" },
    { variant: "infrastructure", label: "Infrastructure résumé", href: null },
  ];

  it("is a native popover that the button controls, so it works without JavaScript", () => {
    const { container } = render(<ResumeMenu items={items} />);
    const button = screen.getByRole("button", { name: /résumé/i });
    const menu = container.querySelector("#resume-menu");

    expect(button).toHaveAttribute("popovertarget", "resume-menu");
    expect(menu).toHaveAttribute("popover", "auto");
  });

  it("links a Published résumé safely, in a new tab", () => {
    render(<ResumeMenu items={items} />);
    const link = screen.getByRole("link", { name: /backend résumé/i, hidden: true });

    expect(link).toHaveAttribute("href", "/resume.pdf");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("offers no download for a résumé that awaits approval (FAC-RESUME-003)", () => {
    render(<ResumeMenu items={items} />);

    expect(screen.queryByRole("link", { name: /infrastructure résumé/i, hidden: true })).toBeNull();
    expect(screen.getByText("PDF available after approval")).toBeInTheDocument();
  });

  it("marks the résumé that matches the current page", () => {
    navigation.pathname = "/backend";
    render(<ResumeMenu items={items} />);

    expect(screen.getByRole("link", { name: /backend résumé/i, hidden: true })).toHaveTextContent(
      "this page",
    );
  });

  it("marks none on Overall", () => {
    render(<ResumeMenu items={items} />);

    expect(screen.queryByText(/this page/)).toBeNull();
  });

  it("moves between items with the arrow keys, wrapping at the ends", async () => {
    const user = userEvent.setup();
    const both: readonly ResumeMenuItem[] = [
      { variant: "backend", label: "Backend résumé", href: "/resume.pdf" },
      { variant: "infrastructure", label: "Infrastructure résumé", href: "/resume/infra.pdf" },
    ];
    render(<ResumeMenu items={both} />);
    const backend = screen.getByRole("link", { name: /backend résumé/i, hidden: true });
    const infrastructure = screen.getByRole("link", {
      name: /infrastructure résumé/i,
      hidden: true,
    });

    backend.focus();
    await user.keyboard("{ArrowDown}");
    expect(infrastructure).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(backend).toHaveFocus();

    await user.keyboard("{ArrowUp}");
    expect(infrastructure).toHaveFocus();
  });
});

describe("Header (UX3 6.1)", () => {
  it("holds the mode switch and the Résumé menu, and no other control", () => {
    render(<Header />);
    const banner = screen.getByRole("banner");

    expect(within(banner).getByRole("navigation", { name: "Modes" })).toBeInTheDocument();
    expect(within(banner).getAllByRole("button")).toHaveLength(1);
    // The three mode links. The résumé link is inside the closed popover, so
    // it is hidden until the menu opens, as a closed menu should be.
    expect(within(banner).getAllByRole("link")).toHaveLength(3);
  });

  it("offers the backend résumé and shows the infrastructure one as awaiting approval", () => {
    render(<Header />);
    const banner = screen.getByRole("banner");

    expect(
      within(banner).getByRole("link", { name: /backend résumé/i, hidden: true }),
    ).toHaveAttribute("href", "/resume.pdf");
    expect(within(banner).getByText("PDF available after approval")).toBeInTheDocument();
  });
});

describe("Footer (UX3 7.7)", () => {
  it("identifies the portfolio on every page: name, year, location (FAC-NAV-004)", () => {
    render(<Footer year={2026} />);

    expect(
      screen.getByText("© 2026 Randi Fajar Wicaksono · Sleman, Yogyakarta, Indonesia"),
    ).toBeInTheDocument();
  });

  it("renders the approved public links (FAC-CONTACT-001, 003, 004)", () => {
    render(<Footer year={2026} />);

    expect(screen.getByRole("link", { name: /randifajar2307@gmail.com/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /LinkedIn/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /GitHub/ })).toBeInTheDocument();
  });

  it("uses a mailto link for email and never claims delivery (FAC-CONTACT-002)", () => {
    render(<Footer year={2026} />);

    expect(
      screen.getByRole("link", { name: /randifajar2307@gmail.com/ }).getAttribute("href"),
    ).toMatch(/^mailto:/);
  });

  it("lists the pages, so Projects and the modes are reachable from every page", () => {
    render(<Footer year={2026} />);
    const pages = within(screen.getByRole("navigation", { name: "Pages" })).getAllByRole("link");

    expect(pages.map((link) => [link.textContent, link.getAttribute("href")])).toEqual([
      ["Overall", "/"],
      ["Backend", "/backend"],
      ["Infrastructure", "/infrastructure"],
      ["Projects", "/projects"],
    ]);
  });

  it("offers the Published résumé", () => {
    render(<Footer year={2026} />);

    expect(screen.getByRole("link", { name: /^Résumé/ })).toHaveAttribute("href", "/resume.pdf");
  });

  it("provides a back-to-top action", () => {
    render(<Footer year={2026} />);

    expect(screen.getByRole("link", { name: /back to top/i })).toHaveAttribute(
      "href",
      "#main-content",
    );
  });

  it("states no availability and no phone number (SUP-011)", () => {
    const { container } = render(<Footer year={2026} />);

    expect(container.textContent).not.toMatch(/open to/i);
    expect(container.textContent).not.toMatch(/(\+62|\b08)[0-9 -]{8,}/);
  });
});

describe("CopyEmail (UX3 7.7)", () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, "clipboard");
  });

  it("renders nothing where the browser cannot copy, never a dead button", () => {
    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
    const { container } = render(<CopyEmail email="someone@example.com" />);

    expect(container).toBeEmptyDOMElement();
  });

  it("copies the address and announces it", async () => {
    // setup() installs user-event's own clipboard stub, so the mock goes in after it.
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<CopyEmail email="someone@example.com" />);

    await user.click(screen.getByRole("button", { name: "Copy address" }));

    expect(writeText).toHaveBeenCalledWith("someone@example.com");
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Email address copied");
  });
});
