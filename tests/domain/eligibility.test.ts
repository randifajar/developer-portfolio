import { describe, expect, it } from "vitest";
import {
  CONFIDENTIALITY_CLASSIFICATIONS,
  PUBLICATION_STATUSES,
  isPubliclyEligible,
} from "@/domain/content/types";

/**
 * isPubliclyEligible is the single gate every selector applies. If it is wrong,
 * Draft, Private, or Restricted content reaches a public page — so it is tested
 * exhaustively across the full status/classification matrix rather than by
 * example.
 */
describe("public eligibility (PRD 7.10)", () => {
  it("admits only published + public or published + sanitized", () => {
    const eligible: string[] = [];

    for (const publicationStatus of PUBLICATION_STATUSES) {
      for (const confidentialityClass of CONFIDENTIALITY_CLASSIFICATIONS) {
        if (isPubliclyEligible({ publicationStatus, confidentialityClass })) {
          eligible.push(`${publicationStatus}+${confidentialityClass}`);
        }
      }
    }

    expect(eligible.sort()).toEqual(["published+public", "published+sanitized"]);
  });

  it("excludes every draft record regardless of classification (FAC-PUBLISH-001)", () => {
    for (const confidentialityClass of CONFIDENTIALITY_CLASSIFICATIONS) {
      expect(isPubliclyEligible({ publicationStatus: "draft", confidentialityClass })).toBe(false);
    }
  });

  it("excludes every archived record regardless of classification", () => {
    for (const confidentialityClass of CONFIDENTIALITY_CLASSIFICATIONS) {
      expect(isPubliclyEligible({ publicationStatus: "archived", confidentialityClass })).toBe(
        false,
      );
    }
  });

  it("excludes private and restricted even when published (FAC-PUBLISH-002)", () => {
    expect(
      isPubliclyEligible({ publicationStatus: "published", confidentialityClass: "private" }),
    ).toBe(false);
    expect(
      isPubliclyEligible({ publicationStatus: "published", confidentialityClass: "restricted" }),
    ).toBe(false);
  });

  it("treats records without a confidentiality axis on publication status alone", () => {
    expect(isPubliclyEligible({ publicationStatus: "published" })).toBe(true);
    expect(isPubliclyEligible({ publicationStatus: "draft" })).toBe(false);
    expect(isPubliclyEligible({ publicationStatus: "archived" })).toBe(false);
  });
});
