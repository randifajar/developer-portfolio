import type { MetadataRoute } from "next";
import { isPubliclyLaunchReady } from "@/domain/content/selectors";
import { absoluteUrl } from "@/lib/environment";

/**
 * Robots (TD 11.8).
 *
 * Once the site is launch-ready, public pages are crawlable. There is
 * deliberately no disallow list for unpublished content: those routes are never
 * generated, so there is nothing to disallow. Listing them would be worse than
 * useless — a disallow entry publishes the existence of the very paths it is
 * trying to hide, which is exactly what DEC-047 forbids.
 *
 * Before launch, crawling is refused outright. The deployment is publicly
 * reachable from the moment Vercel connects, and an incomplete portfolio being
 * indexed and cached works directly against the product goal (PRD 1.2): a
 * recruiter finding a near-empty page is worse than finding nothing.
 *
 * This reverses itself automatically when the launch content is published, so
 * it cannot be forgotten in either direction.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isPubliclyLaunchReady()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
