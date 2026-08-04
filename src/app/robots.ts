import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/environment";

/**
 * Robots (TD 11.8).
 *
 * Public pages are crawlable. There is deliberately no disallow list for
 * unpublished content: those routes are never generated, so there is nothing
 * to disallow. Listing them would be worse than useless — a disallow entry
 * publishes the existence of the very paths it is trying to hide, which is
 * exactly what DEC-047 forbids.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
