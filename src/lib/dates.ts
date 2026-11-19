/**
 * Date presentation for employment and education records.
 *
 * Moved here from the v2 Work Experience section, which V3 P5 removed, so the
 * career chapters and the mode pages share one formatter. Exact dates are a
 * Confirmed decision (DEC-020) and FAC-EXP-001 requires them shown; this
 * abbreviates presentation without hiding the underlying precision.
 *
 * Stored dates are month precision with the day set to the first, so only the
 * year and month are ever read.
 */

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** "2024-07-01" → "Jul 2024". An unparseable value is returned unchanged. */
export function formatMonthYear(isoDate: string): string {
  const [year, month] = isoDate.split("-");
  const name = month ? MONTH_NAMES[Number(month) - 1] : undefined;

  return year && name ? `${name} ${year}` : isoDate;
}

/** A role's span: "Jul 2024 – Oct 2024", or "Aug 2026 – Present" while current. */
export function formatRoleDates(role: {
  readonly startDate: string;
  readonly endDate?: string;
  readonly isCurrent: boolean;
}): string {
  const end = role.isCurrent ? "Present" : formatMonthYear(role.endDate ?? "");

  return `${formatMonthYear(role.startDate)} – ${end}`;
}

/**
 * Whole years from an ISO date to `now`, for statements like "2+ years".
 * Counts completed years only, so it never rounds up a claim.
 */
export function completedYearsSince(isoDate: string, now: Date = new Date()): number {
  const [year, month] = isoDate.split("-").map(Number);
  if (!year || !month) return 0;

  const months = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);

  return Math.max(0, Math.floor(months / 12));
}
