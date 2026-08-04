import { describe, expect, it } from "vitest";
import { PROJECT_DELIVERY_STATUSES } from "@/domain/content/types";
import {
  DELIVERY_STATUS_PRESENTATION,
  getDeliveryStatusLabel,
  getDeliveryStatusPresentation,
} from "@/domain/projects/delivery-status";

describe("delivery status presentation", () => {
  it("defines a presentation for every approved status (DEC-045)", () => {
    for (const status of PROJECT_DELIVERY_STATUSES) {
      expect(() => getDeliveryStatusPresentation(status)).not.toThrow();
    }
  });

  it("has no status without a mapping and no mapping without a status", () => {
    expect(Object.keys(DELIVERY_STATUS_PRESENTATION).sort()).toEqual(
      [...PROJECT_DELIVERY_STATUSES].sort(),
    );
  });

  it("gives each status a unique label so NFAC-CONTENT-003 terminology stays consistent", () => {
    const labels = PROJECT_DELIVERY_STATUSES.map(getDeliveryStatusLabel);

    expect(new Set(labels).size).toBe(labels.length);
  });

  it("provides a non-empty accessible description for every status", () => {
    for (const status of PROJECT_DELIVERY_STATUSES) {
      const { description } = getDeliveryStatusPresentation(status);

      expect(description.length).toBeGreaterThan(0);
    }
  });

  it("uses the approved public labels", () => {
    expect(getDeliveryStatusLabel("personal-project")).toBe("Personal Project");
    expect(getDeliveryStatusLabel("in-development")).toBe("In Development");
    expect(getDeliveryStatusLabel("completed")).toBe("Completed");
    expect(getDeliveryStatusLabel("internal-release")).toBe("Internal Release");
    expect(getDeliveryStatusLabel("proof-of-concept")).toBe("Proof of Concept");
    expect(getDeliveryStatusLabel("production")).toBe("Production");
    expect(getDeliveryStatusLabel("archived")).toBe("Archived");
  });

  it("does not let Completed or Proof of Concept imply production (FAC-PROJECT-004)", () => {
    // The description is what a screen reader announces, so the disclaimer has
    // to live there rather than only in prose elsewhere.
    expect(getDeliveryStatusPresentation("completed").description).toMatch(/not imply production/i);
    expect(getDeliveryStatusPresentation("proof-of-concept").description).toMatch(
      /not imply general production/i,
    );
  });

  it("reserves the success treatment for Production alone", () => {
    const successStatuses = PROJECT_DELIVERY_STATUSES.filter(
      (status) => getDeliveryStatusPresentation(status).treatment === "success",
    );

    expect(successStatuses).toEqual(["production"]);
  });

  it("throws on an unknown status rather than defaulting (FAC-PROJECT-004)", () => {
    expect(() =>
      // Deliberately bypassing the type to simulate invalid parsed content.
      getDeliveryStatusPresentation("shipped-to-mars" as never),
    ).toThrow(/Unknown project delivery status/);
  });
});
