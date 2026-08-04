import type { ProjectDeliveryStatus } from "@/domain/content/types";
import type { StatusTreatment } from "@/domain/projects/delivery-status";
import { getDeliveryStatusPresentation } from "@/domain/projects/delivery-status";

/**
 * Visual treatment per status (UX 4.5).
 *
 * Each pairs a tinted background with a high-contrast foreground so the label
 * stays readable, because the text — not the colour — carries the meaning.
 */
const TREATMENT_CLASSES: Record<StatusTreatment, string> = {
  accent: "bg-accent/10 text-accent border-accent/30",
  warning: "bg-status-warning/10 text-status-warning border-status-warning/30",
  neutral: "bg-status-neutral/10 text-status-neutral border-status-neutral/30",
  success: "bg-status-success/10 text-status-success border-status-success/30",
  muted: "bg-surface-muted text-text-muted border-border",
};

interface StatusBadgeProps {
  readonly status: ProjectDeliveryStatus;
  readonly className?: string;
}

/**
 * Displays a Project Delivery Status.
 *
 * Accepts only a valid enum value and reads its label from the single mapping
 * module, so a component can never invent alternative wording and status
 * terminology stays consistent everywhere (NFAC-CONTENT-003).
 *
 * Meaning never depends on colour alone (UX 4.5, NFAC-A11Y-005): the label is
 * always rendered as text, and the longer description is exposed to assistive
 * technology through a visually hidden element rather than a title attribute,
 * which screen readers announce inconsistently.
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, treatment, description } = getDeliveryStatusPresentation(status);

  const classes = [
    "inline-flex items-center rounded-(--radius-badge) border px-3 py-1",
    "text-sm font-medium",
    TREATMENT_CLASSES[treatment],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} data-status={status}>
      {label}
      <span className="sr-only">. {description}</span>
    </span>
  );
}
