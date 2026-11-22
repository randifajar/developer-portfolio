import { describe, expect, it } from "vitest";
import { completedYearsSince, formatMonthYear, formatRoleDates } from "@/lib/dates";
import { countInWords, countedNoun } from "@/lib/numbers";

describe("formatMonthYear (DEC-020)", () => {
  it("shows month and year, never the stored day", () => {
    expect(formatMonthYear("2024-07-01")).toBe("Jul 2024");
    expect(formatMonthYear("2026-12-01")).toBe("Dec 2026");
  });

  it("returns an unparseable value unchanged rather than inventing a date", () => {
    expect(formatMonthYear("2024")).toBe("2024");
    expect(formatMonthYear("2024-13-01")).toBe("2024-13-01");
  });
});

describe("formatRoleDates", () => {
  it("spans a finished role with an en dash", () => {
    expect(
      formatRoleDates({ startDate: "2024-07-01", endDate: "2024-10-01", isCurrent: false }),
    ).toBe("Jul 2024 – Oct 2024");
  });

  it("ends a current role at Present, whatever end date is stored", () => {
    expect(formatRoleDates({ startDate: "2026-08-01", isCurrent: true })).toBe(
      "Aug 2026 – Present",
    );
  });
});

describe("completedYearsSince", () => {
  const now = new Date(2026, 10, 20); // 20 November 2026

  it("counts completed years only, never rounding up a claim", () => {
    expect(completedYearsSince("2024-07-01", now)).toBe(2);
    expect(completedYearsSince("2024-12-01", now)).toBe(1);
    expect(completedYearsSince("2025-11-01", now)).toBe(1);
    expect(completedYearsSince("2025-12-01", now)).toBe(0);
  });

  it("never goes negative for a future date", () => {
    expect(completedYearsSince("2030-01-01", now)).toBe(0);
  });
});

describe("counts in headings", () => {
  it("spells small counts and keeps larger ones as digits", () => {
    expect(countInWords(3)).toBe("three");
    expect(countInWords(9)).toBe("nine");
    expect(countInWords(12)).toBe("12");
  });

  it("agrees the noun with the count", () => {
    expect(countedNoun(3, "chapter")).toBe("Three chapters");
    expect(countedNoun(1, "chapter")).toBe("One chapter");
    expect(countedNoun(2, "discipline")).toBe("Two disciplines");
  });
});
