import "@testing-library/jest-dom/vitest";

/*
 * jsdom has no layout, so it implements no scrolling: window.scrollTo logs
 * "Not implemented" and does nothing. The mode hero calls it whenever a client
 * render creates it (UX3 6.5), which is every component test that renders a
 * mode route's layout. A silent no-op keeps that noise out of the output;
 * tests that care about the call spy on it, as mode-hero.test.tsx does.
 */
window.scrollTo = () => {};
