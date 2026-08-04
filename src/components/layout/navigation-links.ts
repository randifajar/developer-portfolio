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
 */
export const NAVIGATION_LINKS: readonly NavigationLink[] = [
  { label: "Projects", href: ROUTES.projects },
  { label: "Experience", href: `${ROUTES.home}#${SECTION_IDS.experience}` },
  { label: "Skills", href: `${ROUTES.home}#${SECTION_IDS.skills}` },
  { label: "AI Workflow", href: `${ROUTES.home}#${SECTION_IDS.aiWorkflow}` },
  { label: "Contact", href: `${ROUTES.home}#${SECTION_IDS.contact}` },
];
