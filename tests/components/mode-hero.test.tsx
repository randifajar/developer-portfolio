import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { ModeHero, type ModeHeroIntro } from "@/components/layout/mode-hero";
import type { Mode } from "@/domain/content/types";

/**
 * The persistent mode hero (UX3 6.5, 7; V3 plan 3.3).
 *
 * The scroll and focus rules are the reason this component is more than
 * markup, and each entry path is asserted on its own: a page load, a mode
 * change, arriving from another route, and Back or Forward. The router side of
 * the arrangement — that its own scroll handler runs before this one — is
 * React's effect order and is exercised end to end in e2e/navigation.spec.ts.
 */

const navigation = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname }));

const INTROS: readonly ModeHeroIntro[] = [
  {
    mode: "overall",
    eyebrow: "Software Engineer · Backend & Infrastructure",
    headingLines: ["Randi Fajar", "Wicaksono"],
    action: { label: "Explore the journey", targetId: "profile" },
  },
  {
    mode: "backend",
    eyebrow: "Randi Fajar Wicaksono · Backend",
    headingLines: ["Behind the", "Application."],
    description: "A backend description.",
    action: { label: "Explore backend work", targetId: "backend-work" },
  },
  {
    mode: "infrastructure",
    eyebrow: "Randi Fajar Wicaksono · Infrastructure",
    headingLines: ["Beyond", "Deployment."],
    description: "An infrastructure description.",
    action: { label: "Explore infrastructure work", targetId: "infrastructure-work" },
  },
];

function hero(actionModes: readonly Mode[] = ["overall"]) {
  return (
    <ModeHero intros={INTROS} actionModes={actionModes}>
      <p>The page below</p>
    </ModeHero>
  );
}

/** Server-render, then hydrate: what a page load or a reload does. */
function hydrateHero() {
  const container = document.createElement("div");
  container.innerHTML = renderToString(hero());
  document.body.appendChild(container);

  return render(hero(), { container, hydrate: true });
}

let scrollTo: MockInstance<typeof window.scrollTo>;

beforeEach(() => {
  // jsdom does not implement scrolling.
  scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  // A click clears any traversal an earlier test left recorded; the tracking
  // is module state, shared by every test in this file.
  document.body.click();
});

afterEach(() => {
  navigation.pathname = "/";
  scrollTo.mockRestore();
  document.body.innerHTML = "";
});

describe("ModeHero content (UX3 7)", () => {
  it("renders the current route's intro, with the heading lines as one name", () => {
    navigation.pathname = "/backend";
    render(hero());

    expect(
      screen.getByRole("heading", { level: 1, name: "Behind the Application." }),
    ).toBeVisible();
    expect(screen.getByText("Randi Fajar Wicaksono · Backend")).toBeVisible();
    expect(screen.getByText("A backend description.")).toBeVisible();
  });

  it("names the region by its heading", () => {
    render(hero());

    expect(screen.getByRole("region", { name: "Randi Fajar Wicaksono" })).toHaveAttribute(
      "data-surface",
      "dark",
    );
  });

  it("renders the page below the hero", () => {
    render(hero());

    expect(screen.getByText("The page below")).toBeVisible();
  });

  it("shows the photograph placeholder on Overall only, hidden from assistive technology", () => {
    const { container, rerender } = render(hero());
    const placeholder = container.querySelector("[data-photograph-placeholder]");

    expect(placeholder).not.toBeNull();
    expect(placeholder).toHaveAttribute("aria-hidden", "true");

    navigation.pathname = "/infrastructure";
    rerender(hero());

    expect(container.querySelector("[data-photograph-placeholder]")).toBeNull();
  });

  it("offers the action only on a mode whose page has its target", () => {
    const { rerender } = render(hero(["overall"]));

    expect(screen.getByRole("link", { name: /explore the journey/i })).toHaveAttribute(
      "href",
      "#profile",
    );

    navigation.pathname = "/backend";
    rerender(hero(["overall"]));

    expect(screen.queryByRole("link", { name: /explore backend work/i })).toBeNull();

    rerender(hero(["overall", "backend"]));

    expect(screen.getByRole("link", { name: /explore backend work/i })).toHaveAttribute(
      "href",
      "#backend-work",
    );
  });

  it("renders no hero, and so no stray heading, for a mode without a published intro", () => {
    navigation.pathname = "/backend";
    render(
      <ModeHero intros={INTROS.filter((intro) => intro.mode !== "backend")} actionModes={[]}>
        <p>The page below</p>
      </ModeHero>,
    );

    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
    expect(screen.getByText("The page below")).toBeVisible();
  });
});

describe("ModeHero scroll and focus (UX3 6.5)", () => {
  it("leaves a page load alone: no scroll, no focus", () => {
    hydrateHero();

    expect(scrollTo).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { level: 1 })).not.toHaveFocus();
  });

  it("puts a mode change at the top, with focus on the new heading", () => {
    const { rerender } = hydrateHero();

    navigation.pathname = "/backend";
    rerender(hero());

    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "instant" });
    expect(
      screen.getByRole("heading", { level: 1, name: "Behind the Application." }),
    ).toHaveFocus();
  });

  it("does the same when a client navigation creates the hero, as from the projects pages", () => {
    // A plain client render is what a navigation from outside the group does:
    // nothing is hydrated, the hero is created fresh.
    render(hero());

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "instant" });
    expect(screen.getByRole("heading", { level: 1 })).toHaveFocus();
  });

  it("leaves Back and Forward to the browser's scroll restoration", () => {
    const { rerender } = hydrateHero();

    window.dispatchEvent(new PopStateEvent("popstate"));
    navigation.pathname = "/infrastructure";
    rerender(hero());

    expect(scrollTo).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { level: 1 })).not.toHaveFocus();
  });

  it("does not let a Back that never changed the route swallow the next mode change", () => {
    const { rerender } = hydrateHero();

    // Back to an in-page anchor: a popstate, but the route is unchanged, so
    // the hero has nothing to consume it with.
    window.dispatchEvent(new PopStateEvent("popstate"));

    // The next mode change starts with a click on a link.
    document.body.click();
    navigation.pathname = "/backend";
    rerender(hero());

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "instant" });
    expect(screen.getByRole("heading", { level: 1 })).toHaveFocus();
  });

  it("does nothing when the route has not changed", () => {
    const { rerender } = hydrateHero();

    rerender(hero(["overall", "backend"]));

    expect(scrollTo).not.toHaveBeenCalled();
  });
});

describe("ModeHero and in-page anchors (UX3 6.5)", () => {
  afterEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("leaves a navigation to an anchor on the new page to the router", () => {
    // Arriving from the projects page's "← Overall", which links to /#work.
    window.history.replaceState(null, "", "/#work");
    render(hero());

    expect(scrollTo).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { level: 1 })).not.toHaveFocus();
  });
});

/**
 * The mode change with motion (UX3 8.2). jsdom has no Web Animations API, so
 * these stand one in: each animation is a promise the test finishes by hand,
 * which is what lets them check what the hero shows mid-change.
 */
describe("ModeHero mode change with motion (UX3 8.2)", () => {
  interface FakeAnimation {
    id: string;
    element: Element;
    keyframes: Keyframe[];
    finished: Promise<void>;
    finish: () => void;
    cancel: () => void;
  }

  let created: FakeAnimation[] = [];
  let reduced = false;
  const originalAnimate = Element.prototype.animate;
  const originalGetAnimations = Element.prototype.getAnimations;
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    created = [];
    reduced = false;
    Element.prototype.animate = function (this: Element, keyframes: Keyframe[]) {
      let finish!: () => void;
      const finished = new Promise<void>((resolve) => {
        finish = resolve;
      });
      const animation = { id: "", element: this, keyframes, finished, finish, cancel: () => {} };
      created.push(animation);
      return animation as unknown as Animation;
    } as typeof Element.prototype.animate;
    Element.prototype.getAnimations = function (this: Element) {
      return created.filter((animation) =>
        this.contains(animation.element),
      ) as unknown as Animation[];
    };
    window.matchMedia = ((query: string) => ({
      matches: query.includes("reduced-motion") ? reduced : false,
    })) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    Element.prototype.animate = originalAnimate;
    Element.prototype.getAnimations = originalGetAnimations;
    window.matchMedia = originalMatchMedia;
  });

  const finishExits = async () => {
    await act(async () => {
      for (const animation of created) {
        if (JSON.stringify(animation.keyframes).includes('"opacity":0')) animation.finish();
      }
    });
  };

  it("keeps the old copy while it leaves, then shows the new copy and focuses it", async () => {
    const { rerender } = hydrateHero();

    navigation.pathname = "/backend";
    rerender(hero());

    // The route has changed and the page is at the top, but the copy is still
    // leaving: the old heading stays, and focus waits for the new one.
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "instant" });
    expect(screen.getByRole("heading", { level: 1 })).toHaveAccessibleName("Randi Fajar Wicaksono");
    expect(screen.getByRole("heading", { level: 1 })).not.toHaveFocus();

    await finishExits();

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveAccessibleName("Behind the Application.");
    expect(heading).toHaveFocus();
    // The new heading lines rose in.
    expect(
      created.some((animation) => JSON.stringify(animation.keyframes).includes("translateY(106%)")),
    ).toBe(true);
  });

  it("settles on the last of several quick changes", async () => {
    const { rerender } = hydrateHero();

    navigation.pathname = "/backend";
    rerender(hero());
    navigation.pathname = "/infrastructure";
    rerender(hero());

    await finishExits();
    await finishExits();

    expect(screen.getByRole("heading", { level: 1 })).toHaveAccessibleName("Beyond Deployment.");
  });

  it("swaps at once, with no animation, under reduced motion (UX3 8.6)", () => {
    reduced = true;
    const { rerender } = hydrateHero();

    navigation.pathname = "/backend";
    rerender(hero());

    expect(screen.getByRole("heading", { level: 1 })).toHaveAccessibleName(
      "Behind the Application.",
    );
    expect(created).toHaveLength(0);
  });
});
