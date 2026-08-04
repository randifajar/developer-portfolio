import type { ProjectDeliveryStatus } from "@/domain/content/types";

/**
 * The single mapping from Project Delivery Status to its public presentation.
 *
 * Components receive a status value and read the label, treatment, and
 * accessible description from here. They must never invent an alternative
 * wording (Technical Design 9.1), because NFAC-CONTENT-003 requires status
 * terminology to stay consistent across homepage cards, the Projects Index,
 * Project Detail, and metadata.
 *
 * `treatment` maps to the approved visual direction in UX 4.5. Status meaning
 * must never depend on colour alone, so every badge also renders `label` as
 * text and exposes `description` to assistive technology (NFAC-A11Y-005).
 */
export type StatusTreatment = "accent" | "warning" | "neutral" | "success" | "muted";

export interface DeliveryStatusPresentation {
  readonly label: string;
  readonly treatment: StatusTreatment;
  readonly description: string;
}

const PRESENTATION: Readonly<Record<ProjectDeliveryStatus, DeliveryStatusPresentation>> = {
  "personal-project": {
    label: "Personal Project",
    treatment: "accent",
    description: "Built independently outside professional employment.",
  },
  "in-development": {
    label: "In Development",
    treatment: "warning",
    description: "Active work in progress; not yet complete.",
  },
  completed: {
    label: "Completed",
    treatment: "neutral",
    // FAC-PROJECT-004: Completed must not imply production deployment.
    description: "Finished and delivered; this does not imply production deployment.",
  },
  "internal-release": {
    label: "Internal Release",
    treatment: "neutral",
    description: "Released for internal use rather than to public production.",
  },
  "proof-of-concept": {
    label: "Proof of Concept",
    treatment: "neutral",
    // FAC-PROJECT-004: Proof of Concept must not imply general production use.
    description: "An exploratory build; this does not imply general production use.",
  },
  production: {
    label: "Production",
    treatment: "success",
    description: "Verified as deployed and running in production.",
  },
  archived: {
    label: "Archived",
    treatment: "muted",
    description: "No longer active or maintained.",
  },
};

/**
 * Resolve the approved presentation for a delivery status.
 *
 * The parameter is typed to the enum, so an invalid value cannot reach this
 * function from typed code. The runtime guard exists because content is parsed
 * from modules at build time and an invalid status must fail loudly rather than
 * silently degrade — FAC-PROJECT-004 requires that an invalid status never
 * defaults to Production.
 */
export function getDeliveryStatusPresentation(
  status: ProjectDeliveryStatus,
): DeliveryStatusPresentation {
  const presentation = PRESENTATION[status];

  if (!presentation) {
    throw new Error(
      `Unknown project delivery status: "${status}". ` +
        `Every status must have an approved label and treatment.`,
    );
  }

  return presentation;
}

/** The public label only. */
export function getDeliveryStatusLabel(status: ProjectDeliveryStatus): string {
  return getDeliveryStatusPresentation(status).label;
}

export { PRESENTATION as DELIVERY_STATUS_PRESENTATION };
