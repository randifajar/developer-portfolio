import { useEffect, type RefObject } from "react";

/**
 * The mode hero's motion (UX3 8.2, 8.3; DEC-062), apart from its structure.
 *
 * Web Animations and a few event listeners; no library. All of it is
 * decoration. Where the API is missing, or the visitor asks for reduced
 * motion, the copy swaps at once and nothing moves (V3-MOT-005, V3-MOT-006).
 *
 * The CSS keyframes in globals.css play the hero's entrance on first load
 * (UX3 8.1). These play when the mode changes, while the hero stays mounted.
 */

/** Tags the animations this module starts, so only they are ever cancelled. */
const MOTION_ID = "mode-hero";
const EASE_OUT = "cubic-bezier(0.2, 0.75, 0.2, 1)";

/** Whether to animate: the API exists and the visitor has not asked for less motion. */
export function motionAllowed(): boolean {
  if (typeof window === "undefined" || typeof Element.prototype.animate !== "function") {
    return false;
  }

  return !(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
}

function heroParts(root: HTMLElement) {
  return {
    lines: [...root.querySelectorAll<HTMLElement>("[data-hero-line] > span")],
    rest: [...root.querySelectorAll<HTMLElement>("[data-hero-rest]")],
  };
}

function start(element: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
  const animation = element.animate(keyframes, options);
  animation.id = MOTION_ID;
  return animation;
}

/** Stops whatever this module was doing to the hero, so the next change starts from rest. */
export function cancelHeroMotion(root: HTMLElement) {
  for (const animation of root.getAnimations({ subtree: true })) {
    if (animation.id === MOTION_ID) {
      animation.cancel();
    }
  }
}

/**
 * The current copy leaves: about 220 ms, staggered by 25 ms (UX3 8.2). It
 * holds its end state until the new copy replaces it. Resolves when done, and
 * also when cancelled, since a newer change then decides what happens next.
 */
export function exitHero(root: HTMLElement): Promise<void> {
  const { lines, rest } = heroParts(root);
  const finished = [...lines, ...rest].map(
    (element, index) =>
      start(
        element,
        [
          { opacity: 1, transform: "none" },
          { opacity: 0, transform: "translateY(-0.12em)" },
        ],
        { duration: 220, delay: index * 25, easing: "ease-in", fill: "forwards" },
      ).finished,
  );

  return Promise.all(finished).then(
    () => undefined,
    () => undefined,
  );
}

/**
 * The new copy enters (UX3 8.2): the heading lines rise out of their line
 * boxes over 450 ms, 58 ms apart, and the eyebrow, description, and action
 * follow over 340 ms, after 95 ms plus 38 ms each. Settled about 0.75 s after
 * the click.
 */
export function enterHero(root: HTMLElement) {
  const { lines, rest } = heroParts(root);

  lines.forEach((element, index) => {
    start(element, [{ transform: "translateY(106%)" }, { transform: "none" }], {
      duration: 450,
      delay: index * 58,
      easing: EASE_OUT,
      fill: "backwards",
    });
  });

  rest.forEach((element, index) => {
    start(
      element,
      [
        { opacity: 0, transform: "translateY(10px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 340, delay: 95 + index * 38, easing: EASE_OUT, fill: "backwards" },
    );
  });
}

/**
 * The pointer light (UX3 8.3): one blue light in the hero that eases toward
 * the mouse, closing 12% of the gap each frame and only while it moves. Full
 * strength while moving, 0.32 at rest, gone when the pointer leaves.
 *
 * Mouse only, on devices that hover with a fine pointer, and never under
 * reduced motion. No loop runs at rest.
 */
export function usePointerLight(
  hostRef: RefObject<HTMLElement | null>,
  haloRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const host = hostRef.current;
    const halo = haloRef.current;
    const finePointer = window.matchMedia?.("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");

    if (!host || !halo || !finePointer || !reducedMotion) {
      return;
    }

    let frame = 0;
    let idle = 0;
    let placed = false;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;

    const step = () => {
      x += (targetX - x) * 0.12;
      y += (targetY - y) * 0.12;
      halo.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.5 ? requestAnimationFrame(step) : 0;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !finePointer.matches || reducedMotion.matches) {
        return;
      }

      const box = host.getBoundingClientRect();
      targetX = event.clientX - box.left;
      targetY = event.clientY - box.top;

      if (!placed) {
        x = targetX;
        y = targetY;
        placed = true;
      }

      halo.style.opacity = "1";
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        halo.style.opacity = "0.32";
      }, 900);

      if (!frame) {
        frame = requestAnimationFrame(step);
      }
    };

    const onLeave = () => {
      window.clearTimeout(idle);
      halo.style.opacity = "0";
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      window.clearTimeout(idle);
    };
  }, [hostRef, haloRef]);
}
