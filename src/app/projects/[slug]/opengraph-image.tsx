import { notFound } from "next/navigation";
import { getPublishedProjectBySlug, getPublishedProjects } from "@/domain/content/selectors";
import {
  SOCIAL_CARD_SIZE,
  caseStudyCardKicker,
  caseStudyCardText,
  renderSocialCard,
} from "@/domain/metadata/social-card";

/**
 * A case study's social card (V3 plan 3.9): its title and summary, the only
 * project fields approved for a link preview (NFAC-SEC-006).
 *
 * One card per Published case study, rendered at build time, and no other. The
 * two exports below are the ones that guard the page (FAC-NAV-006, DEC-047),
 * and Next applies them to this route too: any other slug's card is a 404
 * without this file executing, so a hidden project's card URL cannot be told
 * apart from one that never existed.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedProjects().map((project) => ({ slug: project.slug }));
}

/**
 * One alt for every case study, since Next takes it as a constant. A
 * per-project alt would need generateImageMetadata, which renders the cards on
 * request instead of at build time; the project's title is already the
 * preview's title.
 */
export const alt = caseStudyCardKicker();
export const size = SOCIAL_CARD_SIZE;
export const contentType = "image/png";

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getPublishedProjectBySlug(slug);

  // Unreachable while dynamicParams is false; kept so a slug that is not
  // publicly eligible can never be rendered, whatever the route config says.
  if (!project) {
    notFound();
  }

  return renderSocialCard(caseStudyCardText(project));
}
