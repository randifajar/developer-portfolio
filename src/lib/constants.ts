/**
 * Stable identifiers shared across routes and components.
 *
 * Defined once so an anchor link and its target section can never drift apart,
 * and so the Resume path is written in exactly one place.
 */

/**
 * Homepage section anchors.
 *
 * The navigation links to these and the corresponding sections declare them as
 * `id` attributes (UX 6.3, FAC-NAV-002).
 */
export const SECTION_IDS = {
  about: "about",
  projects: "projects",
  experience: "experience",
  skills: "skills",
  aiWorkflow: "ai-workflow",
  contact: "contact",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

/**
 * The skip-to-content target declared by the root layout (NFAC-A11Y-002).
 */
export const MAIN_CONTENT_ID = "main-content";

/**
 * The single public path for the active Resume.
 *
 * Technical Design 11.6 requires every Resume action to use this stable path
 * rather than deriving one per component.
 */
export const RESUME_PATH = "/resume.pdf";

/**
 * Public route paths.
 */
export const ROUTES = {
  home: "/",
  projects: "/projects",
  projectDetail: (slug: string) => `/projects/${slug}`,
} as const;
