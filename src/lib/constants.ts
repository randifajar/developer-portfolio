/**
 * Stable identifiers shared across routes and components.
 *
 * Defined once so an anchor link and its target section can never drift apart,
 * and so the Resume path is written in exactly one place.
 */

/**
 * In-page anchors: the Overall page's linked sections and the footer.
 *
 * The links and the sections they target both read these, so neither can be
 * renamed without the other. v2's header linked homepage sections by id
 * (FAC-NAV-002); the V3 header does not (UX3 6.1).
 */
export const SECTION_IDS = {
  // V3 Overall (UX3 7.1). `profile` is the Overall hero's action target, so it
  // must match the mode intro in src/content/modes.ts.
  profile: "profile",
  career: "career",
  work: "work",
  education: "education",
  // The footer, on every page (UX3 7.7). v2's Contact section and its other
  // anchors — about, experience, projects, skills, ai-workflow — went in P5.
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
 * The two disciplines' display names: the mode switch's labels, and the
 * labels a project row shows for its disciplines (UX3 7.1, 7.4).
 */
export const DISCIPLINE_LABELS = {
  backend: "Backend",
  infrastructure: "Infrastructure",
} as const;

/**
 * Public route paths.
 */
export const ROUTES = {
  home: "/",
  // The two V3 mode routes (DEC-056). `home` doubles as the Overall mode.
  backend: "/backend",
  infrastructure: "/infrastructure",
  projects: "/projects",
  projectDetail: (slug: string) => `/projects/${slug}`,
} as const;
