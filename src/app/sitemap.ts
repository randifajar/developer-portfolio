import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/domain/content/selectors";
import { ROUTES } from "@/lib/constants";
import { absoluteUrl } from "@/lib/environment";

/**
 * Sitemap (TD 11.7).
 *
 * Home, Projects Index, and publicly eligible Project Detail routes only.
 *
 * Unpublished projects are absent because the selector never returns them —
 * there is no separate exclusion list to keep in sync, which is what makes
 * NFAC-SEO-002 and NFAC-SEC-006 hold by construction rather than by
 * maintenance.
 *
 * The Resume is excluded: it is a downloadable asset, not a page to index.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getPublishedProjects();

  return [
    {
      url: absoluteUrl(ROUTES.home),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl(ROUTES.projects),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...projects.map((project) => ({
      url: absoluteUrl(ROUTES.projectDetail(project.slug)),
      lastModified: new Date(project.updatedAt),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
