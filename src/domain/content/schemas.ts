import { z } from "zod";
import {
  CONFIDENTIALITY_CLASSIFICATIONS,
  DISCIPLINES,
  EXTERNAL_PLATFORMS,
  MEDIA_TYPES,
  MODES,
  PROJECT_DELIVERY_STATUSES,
  PROJECT_TYPES,
  PUBLICATION_STATUSES,
  SKILL_CLASSIFICATIONS,
  SKILL_GROUPS,
} from "@/domain/content/types";

/**
 * Zod schemas for every content type.
 *
 * These encode the rules a single record can enforce on its own. Rules that
 * span records — unique slugs, valid cross-references, exactly one active
 * Resume — belong to the cross-record validation layer in P09, because no
 * schema can see its siblings.
 *
 * Field names and optionality follow PRD section 7 and Technical Design 9.2.
 */

/* ------------------------------------------------------------------------- */
/* Shared primitives                                                          */
/* ------------------------------------------------------------------------- */

const identifier = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Identifiers must be lowercase kebab-case.");

const slug = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slugs must be lowercase kebab-case and URL safe.");

const nonEmptyText = z.string().trim().min(1);

/**
 * ISO date (YYYY-MM-DD). Stored as a string so content modules stay plain data
 * and diffs remain readable in review.
 */
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Dates must be ISO format (YYYY-MM-DD).");

/**
 * NFAC-SEC-003 allows only https for public external destinations. http is
 * rejected outright rather than silently upgraded.
 */
const httpsUrl = z
  .string()
  .url()
  .refine((value) => value.startsWith("https://"), {
    message: "External URLs must use https.",
  });

/** Public asset paths must be local. A remote path would bypass review. */
const localAssetPath = z
  .string()
  .regex(/^\/[^\s]*$/, "Public media paths must be local and start with '/'.");

const publicationStatus = z.enum(PUBLICATION_STATUSES);
const confidentialityClass = z.enum(CONFIDENTIALITY_CLASSIFICATIONS);

/* ------------------------------------------------------------------------- */
/* Professional Profile                                                       */
/* ------------------------------------------------------------------------- */

export const professionalProfileSchema = z.object({
  id: identifier,
  fullName: nonEmptyText,
  displayName: nonEmptyText,
  professionalTitle: nonEmptyText,
  headline: nonEmptyText,
  summary: nonEmptyText,
  // The V3 Overall profile statement (UX3 7.1). Optional so the v2 site, which
  // never reads it, is unaffected; V3 omits the section without it.
  statement: nonEmptyText.optional(),
  location: nonEmptyText,
  photoAssetId: identifier.optional(),
  publicationStatus,
  updatedAt: isoDate,
});

/* ------------------------------------------------------------------------- */
/* Work Experience                                                            */
/* ------------------------------------------------------------------------- */

export const workExperienceSchema = z
  .object({
    id: identifier,
    companyName: nonEmptyText,
    position: nonEmptyText,
    startDate: isoDate,
    endDate: isoDate.optional(),
    isCurrent: z.boolean(),
    locationOrArrangement: nonEmptyText.optional(),
    summary: nonEmptyText,
    responsibilities: z.array(nonEmptyText).min(1),
    contributions: z.array(nonEmptyText).optional(),
    technologyIds: z.array(identifier).optional(),
    projectIds: z.array(identifier).optional(),
    // Which V3 mode pages show the role (UX3 7.2, 7.3). Required, because a
    // role tagged with nothing would silently vanish from both.
    disciplines: z.array(z.enum(DISCIPLINES)).min(1),
    confidentialityClass,
    publicationStatus,
    sortOrder: z.number().int(),
  })
  // FAC-EXP-002: a non-current role must have an end date.
  .refine((value) => value.isCurrent || value.endDate !== undefined, {
    message: "endDate is required when isCurrent is false.",
    path: ["endDate"],
  })
  // A current role cannot also have ended.
  .refine((value) => !value.isCurrent || value.endDate === undefined, {
    message: "A current role must not have an endDate.",
    path: ["endDate"],
  })
  // FAC-EXP-002: endDate must not precede startDate.
  .refine((value) => value.endDate === undefined || value.endDate >= value.startDate, {
    message: "endDate must not precede startDate.",
    path: ["endDate"],
  });

/* ------------------------------------------------------------------------- */
/* Project Case Study                                                         */
/* ------------------------------------------------------------------------- */

const challengeSchema = z.object({
  title: nonEmptyText,
  description: nonEmptyText,
});

const decisionSchema = z.object({
  decision: nonEmptyText,
  rationale: nonEmptyText,
  tradeoff: nonEmptyText.optional(),
});

/**
 * TD 9.5: an explicit confirmation object, required only for production
 * status. The note is public-safe and must not expose deployment internals.
 */
const productionConfirmationSchema = z.object({
  verified: z.literal(true),
  note: nonEmptyText,
});

export const projectCaseStudySchema = z
  .object({
    id: identifier,
    slug,
    title: nonEmptyText,
    summary: nonEmptyText,
    projectType: z.enum(PROJECT_TYPES),
    // The V3 projects filter (UX3 7.4). Optional: a project with no discipline
    // appears only under "All", as the personal portfolio does.
    disciplines: z.array(z.enum(DISCIPLINES)).optional(),
    role: nonEmptyText,
    deliveryStatus: z.enum(PROJECT_DELIVERY_STATUSES),
    period: nonEmptyText.optional(),

    context: nonEmptyText,
    problem: nonEmptyText,
    // FAC-PROJECT-003: personal contribution must always be explicit.
    personalResponsibilities: z.array(nonEmptyText).min(1),
    teamResponsibilities: z.array(nonEmptyText).optional(),
    technicalApproach: nonEmptyText,
    workflowOrArchitecture: nonEmptyText.optional(),
    challenges: z.array(challengeSchema).min(1),
    decisionsAndTradeoffs: z.array(decisionSchema).min(1),
    implementationSummary: nonEmptyText,
    testingAndVerification: nonEmptyText,
    outcome: nonEmptyText,
    aiUsage: nonEmptyText.optional(),
    lessonsLearned: nonEmptyText,

    technologyIds: z.array(identifier).min(1),
    mediaAssetIds: z.array(identifier).optional(),
    repositoryUrl: httpsUrl.optional(),
    confidentialityNote: nonEmptyText.optional(),
    productionConfirmation: productionConfirmationSchema.optional(),

    confidentialityClass,
    featured: z.boolean(),
    featuredPriority: z.number().int().positive().optional(),
    publicationStatus,
    updatedAt: isoDate,
  })
  // TD 9.5 and FAC-PROJECT-004: Production requires explicit confirmation, so
  // the label can never be applied by accident.
  .refine(
    (value) =>
      value.deliveryStatus !== "production" || value.productionConfirmation?.verified === true,
    {
      message:
        "deliveryStatus 'production' requires productionConfirmation.verified to be true. " +
        "Work that did not reach production must not use the Production status.",
      path: ["productionConfirmation"],
    },
  )
  // The inverse: confirmation is meaningless on a non-production project and
  // usually signals a copy-paste error.
  .refine(
    (value) => value.deliveryStatus === "production" || value.productionConfirmation === undefined,
    {
      message: "productionConfirmation is only valid when deliveryStatus is 'production'.",
      path: ["productionConfirmation"],
    },
  );

/* ------------------------------------------------------------------------- */
/* Technical Skill                                                            */
/* ------------------------------------------------------------------------- */

export const technicalSkillSchema = z.object({
  id: identifier,
  name: nonEmptyText,
  group: z.enum(SKILL_GROUPS),
  classification: z.enum(SKILL_CLASSIFICATIONS),
  description: nonEmptyText.optional(),
  relatedProjectIds: z.array(identifier).optional(),
  relatedExperienceIds: z.array(identifier).optional(),
  publicationStatus,
  sortOrder: z.number().int(),
});

/* ------------------------------------------------------------------------- */
/* Resume                                                                     */
/* ------------------------------------------------------------------------- */

export const resumeSchema = z.object({
  id: identifier,
  fileName: nonEmptyText,
  fileFormat: z.literal("pdf"),
  version: nonEmptyText,
  publicationDate: isoDate,
  publicPath: localAssetPath.refine((value) => value.toLowerCase().endsWith(".pdf"), {
    message: "The Resume public path must point to a .pdf file.",
  }),
  isActive: z.boolean(),
  // DEC-059: two résumés, one per discipline. FAC-RESUME-004 now allows one
  // active Published résumé per variant rather than one in total.
  variant: z.enum(DISCIPLINES),
  // PRD 7.6: the active Resume is public by definition.
  confidentialityClass: z.literal("public"),
  publicationStatus,
});

/* ------------------------------------------------------------------------- */
/* Contact Channel                                                            */
/* ------------------------------------------------------------------------- */

export const contactChannelSchema = z.object({
  id: identifier,
  type: z.literal("email"),
  label: nonEmptyText,
  value: z.string().email(),
  publicLink: z.string().refine((value) => value.startsWith("mailto:"), {
    message: "The email contact link must use the mailto: scheme.",
  }),
  publicationStatus,
});

/* ------------------------------------------------------------------------- */
/* External Professional Profile                                              */
/* ------------------------------------------------------------------------- */

export const externalProfileSchema = z.object({
  id: identifier,
  platform: z.enum(EXTERNAL_PLATFORMS),
  label: nonEmptyText,
  url: httpsUrl,
  publicationStatus,
});

/* ------------------------------------------------------------------------- */
/* Media Asset                                                                */
/* ------------------------------------------------------------------------- */

export const mediaAssetSchema = z
  .object({
    id: identifier,
    type: z.enum(MEDIA_TYPES),
    filePath: localAssetPath,
    altText: nonEmptyText.optional(),
    caption: nonEmptyText.optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    ownerType: z.enum(["profile", "project", "resume", "metadata"]),
    ownerId: identifier,
    confidentialityClass,
    publicationStatus,
  })
  // NFAC-A11Y-004: a meaningful image needs alternative text. Decorative
  // assets are the only ones allowed to omit it.
  .refine(
    (value) =>
      value.type === "favicon" ||
      value.type === "resume-pdf" ||
      (value.altText !== undefined && value.altText.length > 0),
    {
      message: "Meaningful images require altText.",
      path: ["altText"],
    },
  );

/* ------------------------------------------------------------------------- */
/* V3 records (UX/UI specification v3.0)                                       */
/* ------------------------------------------------------------------------- */

/**
 * The hero copy for one mode (UX3 7). Content, not code, so that wording
 * changes never touch a component. Two heading lines because the design sets
 * them at two different sizes; a cross-record rule requires every published
 * intro to name the engineer (V3-CONT-003).
 */
export const modeIntroSchema = z.object({
  id: identifier,
  mode: z.enum(MODES),
  eyebrow: nonEmptyText,
  headingLines: z.tuple([nonEmptyText, nonEmptyText]),
  description: nonEmptyText.optional(),
  action: z.object({
    label: nonEmptyText,
    // The id of the section the action scrolls to on the same page.
    targetId: identifier,
  }),
  publicationStatus,
});

/**
 * One chapter of the Overall career sequence (UX3 7.1, 8.4). The grouping by
 * year is editorial, so a chapter points at real experience records instead of
 * restating their dates; cross-record rules check that those records exist and
 * that the year falls inside them.
 */
export const careerChapterSchema = z.object({
  id: identifier,
  year: z.number().int().min(2000).max(2100),
  label: nonEmptyText,
  headline: nonEmptyText,
  body: nonEmptyText,
  experienceIds: z.array(identifier).min(1),
  publicationStatus,
  sortOrder: z.number().int(),
});

export const educationSchema = z
  .object({
    id: identifier,
    institution: nonEmptyText,
    qualification: nonEmptyText,
    // For example a grade point average. Stated only as the résumé states it.
    detail: nonEmptyText.optional(),
    location: nonEmptyText.optional(),
    startDate: isoDate,
    endDate: isoDate,
    publicationStatus,
    sortOrder: z.number().int(),
  })
  .refine((value) => value.endDate >= value.startDate, {
    message: "endDate must not precede startDate.",
    path: ["endDate"],
  });

export const certificationSchema = z.object({
  id: identifier,
  name: nonEmptyText,
  issuer: nonEmptyText,
  year: z.number().int().min(2000).max(2100),
  publicationStatus,
  sortOrder: z.number().int(),
});

export const languageSchema = z.object({
  id: identifier,
  name: nonEmptyText,
  proficiency: nonEmptyText,
  publicationStatus,
  sortOrder: z.number().int(),
});

/**
 * One item of "How I approach engineering" (UX3 7.1). Each must restate a line
 * from Randi's résumés, which the content module records beside it.
 */
export const engineeringPracticeSchema = z.object({
  id: identifier,
  title: nonEmptyText,
  description: nonEmptyText,
  publicationStatus,
  sortOrder: z.number().int(),
});

/**
 * One group of a mode page's toolkit (UX3 7.2, 7.3). Plain tool names, with no
 * level attached: classification belongs to the skills, and a toolkit only
 * says what is used together.
 */
export const toolkitGroupSchema = z.object({
  id: identifier,
  discipline: z.enum(DISCIPLINES),
  label: nonEmptyText,
  items: z.array(nonEmptyText).min(1),
  publicationStatus,
  sortOrder: z.number().int(),
});

/**
 * A project shown as a short overview: no case study and no route (DEC-060).
 *
 * A separate type rather than a flag on the case study. An overview has no
 * slug, so "an overview never gets a route" holds by construction instead of
 * by a rule someone has to remember, and nothing the v2 case-study pages read
 * changes. Titles are working titles until Randi confirms them (OPEN-011).
 *
 * Technologies are optional on purpose: a technology is listed only where the
 * résumé line for that project names it. Attaching the stack of the role to
 * the project would be inventing a project-specific claim.
 */
export const projectOverviewSchema = z.object({
  id: identifier,
  title: nonEmptyText,
  summary: nonEmptyText,
  contribution: nonEmptyText,
  technologies: z.array(nonEmptyText).optional(),
  disciplines: z.array(z.enum(DISCIPLINES)).min(1),
  confidentialityClass,
  publicationStatus,
  sortOrder: z.number().int(),
});

/**
 * The opening of a discipline's page (UX3 7.2, 7.3): the paragraph under its
 * first heading. Infrastructure's also carries the scope line of its
 * transition facts. The headings are the page's, not content, as section
 * headlines are elsewhere; the paragraph is a claim, so it is content.
 */
export const disciplineIntroSchema = z.object({
  id: identifier,
  discipline: z.enum(DISCIPLINES),
  lead: nonEmptyText,
  scope: nonEmptyText.optional(),
  publicationStatus,
});

/**
 * One area of a discipline's work, as its page presents it (UX3 7.2, 7.3): a
 * label, a title, and a paragraph restating résumé lines. It cites the roles
 * it restates, so a cross-record rule can check that they exist and share its
 * discipline. `context` frames the work without claiming more of it — that a
 * migration was part of a wider effort, for example.
 */
export const workAreaSchema = z.object({
  id: identifier,
  discipline: z.enum(DISCIPLINES),
  label: nonEmptyText,
  title: nonEmptyText,
  body: nonEmptyText,
  context: nonEmptyText.optional(),
  experienceIds: z.array(identifier).min(1),
  publicationStatus,
  sortOrder: z.number().int(),
});

/* ------------------------------------------------------------------------- */
/* Site configuration                                                         */
/* ------------------------------------------------------------------------- */

export const siteConfigSchema = z.object({
  name: nonEmptyText,
  defaultTitle: nonEmptyText,
  titleTemplate: nonEmptyText,
  defaultDescription: nonEmptyText,
  ownerName: nonEmptyText,
  locale: nonEmptyText,
  email: z.string().email(),
  linkedInUrl: httpsUrl,
  gitHubUrl: httpsUrl,
  defaultSocialImagePath: localAssetPath,
});

/* ------------------------------------------------------------------------- */
/* Inferred types                                                             */
/* ------------------------------------------------------------------------- */

export type ProfessionalProfile = z.infer<typeof professionalProfileSchema>;
export type WorkExperience = z.infer<typeof workExperienceSchema>;
export type ProjectCaseStudy = z.infer<typeof projectCaseStudySchema>;
export type TechnicalSkill = z.infer<typeof technicalSkillSchema>;
export type Resume = z.infer<typeof resumeSchema>;
export type ContactChannel = z.infer<typeof contactChannelSchema>;
export type ExternalProfile = z.infer<typeof externalProfileSchema>;
export type MediaAsset = z.infer<typeof mediaAssetSchema>;
export type SiteConfig = z.infer<typeof siteConfigSchema>;
export type ModeIntro = z.infer<typeof modeIntroSchema>;
export type CareerChapter = z.infer<typeof careerChapterSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Language = z.infer<typeof languageSchema>;
export type EngineeringPractice = z.infer<typeof engineeringPracticeSchema>;
export type ToolkitGroup = z.infer<typeof toolkitGroupSchema>;
export type ProjectOverview = z.infer<typeof projectOverviewSchema>;
export type DisciplineIntro = z.infer<typeof disciplineIntroSchema>;
export type WorkArea = z.infer<typeof workAreaSchema>;
