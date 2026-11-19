import type { Metadata } from "next";
import { ModeIntroHero } from "@/components/sections/mode-intro-hero";
import { buildModeMetadata } from "@/domain/metadata/build-metadata";

/**
 * The Backend mode (DEC-056, UX3 7.2).
 *
 * The intro only, for now. The full page — the backend work, experience, and
 * toolkit — arrives in V3 P6, and the persistent animated hero in P5.
 */
export const metadata: Metadata = buildModeMetadata("backend");

export default function BackendPage() {
  return <ModeIntroHero mode="backend" />;
}
