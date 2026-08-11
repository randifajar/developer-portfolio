import { ROUTES, SECTION_IDS } from "@/lib/constants";

export interface NavigationLink {
  readonly label: string;
  readonly href: string;
}

/**
 * The approved navigation inventory (UX 6.1).
 *
 * Shared by the desktop header and the mobile menu so the two can never drift
 * apart — NFAC-RESP-002 requires mobile visitors to reach the same essential
 * information as desktop ones.
 *
 * Section anchors are absolute (`/#experience`) rather than bare fragments so
 * they still resolve when the visitor is on a Project Detail page.
 *
 * Experience leads, following the homepage hierarchy (SUP-005, v1.1 Issue 5).
 *
 * Projects is the odd one out here: it targets the /projects route rather than
 * a homepage anchor, so it is not strictly part of the section order. The other
 * four do mirror the homepage, which makes this read as a table of contents
 * with Projects hoisted out — and leaving it first would have had the header
 * and the page it describes disagree about what comes first.
 */
export const NAVIGATION_LINKS: readonly NavigationLink[] = [
  { label: "Experience", href: `${ROUTES.home}#${SECTION_IDS.experience}` },
  { label: "Projects", href: ROUTES.projects },
  { label: "Skills", href: `${ROUTES.home}#${SECTION_IDS.skills}` },
  { label: "AI Workflow", href: `${ROUTES.home}#${SECTION_IDS.aiWorkflow}` },
  { label: "Contact", href: `${ROUTES.home}#${SECTION_IDS.contact}` },
];
