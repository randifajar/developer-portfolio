import { describe, expect, it } from "vitest";

/**
 * Proves the Vitest harness itself works: TypeScript compiles, the path alias
 * resolves, and jest-dom matchers are registered by vitest.setup.ts.
 *
 * Replaced by real domain tests from P06 onward.
 */
describe("test harness", () => {
  it("runs TypeScript test files", () => {
    const value: string = "ready";
    expect(value).toBe("ready");
  });

  it("registers jest-dom matchers", () => {
    const element = document.createElement("p");
    element.textContent = "visible";
    document.body.appendChild(element);

    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent("visible");

    element.remove();
  });
});
