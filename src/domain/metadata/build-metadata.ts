import type { Metadata } from "next";
import {
  getPublishedModeIntro,
  getSiteConfig,
  isPubliclyLaunchReady,
} from "@/domain/content/selectors";
import type { ProjectCaseStudy } from "@/domain/content/schemas";
import { absoluteUrl, getSiteUrl } from "@/lib/environment";
import { ROUTES } from "@/lib/constants";

/**
 * Metadata construction.
 *
 * Kept in the domain layer so every route builds its metadata the same way and
 * no page can accidentally emit a value derived from unpublished content.
 *
 * Only fields already approved for public display are used. A project's
 * metadata comes from its title and summary — never from a confidentiality
 * note, internal identifier, or any field not intended for a link preview
 * (NFAC-SEC-006). Its social card is held to the same two fields
 * (social-card.tsx).
 */

/** Metadata shared by every route. */
export function buildRootMetadata(): Metadata {
  const siteConfig = getSiteConfig();
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),

    /*
     * Pre-launch, every page carries noindex in addition to the robots.txt
     * disallow.
     *
     * The two are not redundant. robots.txt asks a crawler not to *fetch* a
     * page; a URL linked from somewhere else can still be indexed without ever
     * being fetched, showing up as a bare result. The meta directive is what
     * actually keeps it out of the index.
     *
     * Flips automatically once the launch content is published.
     */
    robots: isPubliclyLaunchReady()
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },

    title: {
      default: siteConfig.defaultTitle,
      template: siteConfig.titleTemplate,
    },
    description: siteConfig.defaultDescription,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.ownerName }],
    creator: siteConfig.ownerName,
    alternates: {
      canonical: ROUTES.home,
    },
    openGraph: {
      type: "profile",
      siteName: siteConfig.name,
      title: siteConfig.defaultTitle,
      description: siteConfig.defaultDescription,
      url: siteUrl,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.defaultTitle,
      description: siteConfig.defaultDescription,
    },
  };
}

/**
 * The Projects Index's own words for a link preview. Its social card shows the
 * same ones, so the card cannot say something the preview does not.
 */
export const projectsIndexPreview = {
  title: "Projects",
  description:
    "Selected project case studies covering the problem, my responsibility, the technical " +
    "approach, and how each result was verified.",
} as const;

/**
 * Metadata for the Projects Index.
 *
 * It sets its own `twitter` fields. Without them the route inherits the root's,
 * and a link to it previewed on X with the home page's title and description.
 */
export function buildProjectsIndexMetadata(): Metadata {
  const siteConfig = getSiteConfig();
  const { title, description } = projectsIndexPreview;

  return {
    title,
    description,
    alternates: { canonical: ROUTES.projects },
    openGraph: {
      type: "website",
      title: `${title} — ${siteConfig.ownerName}`,
      description,
      url: absoluteUrl(ROUTES.projects),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${siteConfig.ownerName}`,
      description,
    },
  };
}

/**
 * Metadata for a V3 mode route, `/backend` or `/infrastructure` (DEC-056).
 *
 * The description is the mode intro's, so a link preview says what the page
 * says. The image is the route's own card, from its opengraph-image file.
 */
export function buildModeMetadata(mode: "backend" | "infrastructure"): Metadata {
  const siteConfig = getSiteConfig();
  const canonical = ROUTES[mode];
  const title = mode === "backend" ? "Backend" : "Infrastructure";
  const description = getPublishedModeIntro(mode)?.description ?? siteConfig.defaultDescription;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: `${title} — ${siteConfig.ownerName}`,
      description,
      url: absoluteUrl(canonical),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${siteConfig.ownerName}`,
      description,
    },
  };
}

/**
 * Metadata for a single Project Detail page.
 *
 * Called only after the route has resolved a publicly eligible project, so an
 * unpublished project can never reach this function. The image is the case
 * study's own card, from src/app/projects/[slug]/opengraph-image.tsx.
 */
export function buildProjectMetadata(project: ProjectCaseStudy): Metadata {
  const siteConfig = getSiteConfig();
  const canonical = ROUTES.projectDetail(project.slug);

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: `${project.title} — ${siteConfig.ownerName}`,
      description: project.summary,
      url: absoluteUrl(canonical),
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ${siteConfig.ownerName}`,
      description: project.summary,
    },
  };
}
