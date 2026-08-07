import type { SiteConfig } from "@/domain/content/schemas";
import type { ContentSet } from "@/domain/content/validation";
import { isPubliclyEligible } from "@/domain/content/types";

/**
 * Link validation.
 *
 * Release plan step 5 requires that no destination the site offers a visitor is
 * broken. This module collects every link reachable from content and decides
 * what each result means; scripts/check-links.ts performs the filesystem and
 * network calls.
 *
 * The split exists so the decisions are testable without a network. A checker
 * whose rules can only be exercised by hitting live hosts is one whose rules
 * are never exercised at all.
 */

export type LinkKind = "external" | "email" | "local-asset";

export interface LinkTarget {
  readonly kind: LinkKind;
  /** The literal value as authored: an https URL, a mailto: link, or a path. */
  readonly value: string;
  /** Where this link came from, for a report a human can act on. */
  readonly sources: readonly string[];
  /**
   * Whether a visitor can actually reach this link today.
   *
   * Draft records still carry links, and those links routinely point at files
   * that do not exist yet — the professional photograph and the resume PDF are
   * both deliberately absent (FAC-HOME-006 requires the site to degrade to text
   * rather than depend on them). Failing on those would make the gate red for
   * the whole of development and train everyone to ignore it.
   *
   * So an unreachable link fails the check only when it is publicly visible.
   * The rest are reported as pending, which is a truthful description of a file
   * that is coming rather than a file that is broken.
   */
  readonly isPublic: boolean;
}

/**
 * Hosts that answer an automated request with a challenge instead of the real
 * status of the resource.
 *
 * LinkedIn returns 999 to non-browser clients whether or not the profile
 * exists, so a failing result there proves nothing either way. Treating it as
 * broken would make the gate permanently red; treating it as reachable would
 * be a lie. It is reported as needing a human, which is exactly what the
 * release checklist already asks for.
 */
const BOT_HOSTILE_HOSTNAMES: readonly string[] = ["linkedin.com"];

/** 999 is not a real HTTP status. Only anti-bot systems emit it. */
const ANTI_BOT_STATUSES: readonly number[] = [403, 429, 999];

export type ExternalVerdict = "reachable" | "requires-manual-check" | "broken";

function hostnameOf(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function isBotHostile(url: string): boolean {
  const hostname = hostnameOf(url);

  if (hostname === null) return false;

  return BOT_HOSTILE_HOSTNAMES.some(
    (blocked) => hostname === blocked || hostname.endsWith(`.${blocked}`),
  );
}

/**
 * Decide what an HTTP status means for a link.
 *
 * A 404 from LinkedIn is still a failure — only the statuses that specifically
 * indicate an anti-bot challenge are excused, and only for hosts known to send
 * them. Excusing every non-2xx from those hosts would hide a genuinely deleted
 * profile.
 */
export function classifyExternalStatus(url: string, status: number): ExternalVerdict {
  if (status >= 200 && status < 400) return "reachable";

  if (status === 999) return "requires-manual-check";

  if (isBotHostile(url) && ANTI_BOT_STATUSES.includes(status)) {
    return "requires-manual-check";
  }

  return "broken";
}

/**
 * The filesystem locations that would satisfy a local public path.
 *
 * A path is served either by a file in public/ or by an App Router route that
 * generates it. /opengraph-image is the second kind: it is rendered on request
 * by src/app/opengraph-image.tsx and no file exists for it. A checker that only
 * looked in public/ would report the working social card as broken.
 */
export function localAssetCandidates(publicPath: string): {
  readonly publicFile: string;
  readonly routeFiles: readonly string[];
} {
  const trimmed = publicPath.replace(/^\/+/, "").replace(/\/+$/, "");
  const extensions = ["tsx", "ts", "jsx", "js"];

  return {
    publicFile: `public/${trimmed}`,
    routeFiles: [
      ...extensions.map((extension) => `src/app/${trimmed}.${extension}`),
      ...extensions.map((extension) => `src/app/${trimmed}/route.${extension}`),
    ],
  };
}

/** The address part of a mailto: link, or null when the link is malformed. */
export function emailAddressOf(mailtoLink: string): string | null {
  if (!mailtoLink.startsWith("mailto:")) return null;

  const address = mailtoLink.slice("mailto:".length).split("?")[0]?.trim() ?? "";

  if (address.length === 0) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) return null;

  return address;
}

/**
 * Every link reachable from content, deduplicated by value.
 *
 * The same destination is often authored twice — the LinkedIn URL is both site
 * configuration and an External Professional Profile. Both sources are recorded
 * so a failure names every place that needs fixing, but the destination is only
 * requested once.
 */
export function collectLinks(content: ContentSet, siteConfig: SiteConfig): readonly LinkTarget[] {
  const collected = new Map<string, { kind: LinkKind; sources: string[]; isPublic: boolean }>();

  const add = (kind: LinkKind, value: string, source: string, isPublic: boolean): void => {
    const existing = collected.get(value);

    if (existing) {
      existing.sources.push(source);
      // A destination shown anywhere public is public.
      existing.isPublic ||= isPublic;
      return;
    }

    collected.set(value, { kind, sources: [source], isPublic });
  };

  /* Site configuration renders site-wide, so these are always public. -------- */
  add("external", siteConfig.linkedInUrl, "Site Configuration: linkedInUrl", true);
  add("external", siteConfig.gitHubUrl, "Site Configuration: gitHubUrl", true);
  add("local-asset", siteConfig.defaultSocialImagePath, "Site Configuration: social image", true);

  for (const channel of content.contactChannels) {
    add(
      "email",
      channel.publicLink,
      `Contact Channel [${channel.id}]`,
      isPubliclyEligible(channel),
    );
  }

  for (const externalProfile of content.externalProfiles) {
    add(
      "external",
      externalProfile.url,
      `External Professional Profile [${externalProfile.id}]`,
      isPubliclyEligible(externalProfile),
    );
  }

  for (const asset of content.mediaAssets) {
    add("local-asset", asset.filePath, `Media Asset [${asset.id}]`, isPubliclyEligible(asset));
  }

  for (const resume of content.resumes) {
    // A Resume is only offered to a visitor when it is both active and
    // Published (FAC-RESUME-001), so an inactive record's file being absent is
    // not a broken link.
    add(
      "local-asset",
      resume.publicPath,
      `Resume [${resume.id}]`,
      resume.isActive && isPubliclyEligible(resume),
    );
  }

  for (const project of content.projects) {
    if (project.repositoryUrl === undefined) continue;

    add(
      "external",
      project.repositoryUrl,
      `Project Case Study [${project.id}]`,
      isPubliclyEligible(project),
    );
  }

  return [...collected.entries()].map(([value, entry]) => ({
    kind: entry.kind,
    value,
    sources: entry.sources,
    isPublic: entry.isPublic,
  }));
}
