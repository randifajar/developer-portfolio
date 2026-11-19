import type { Metadata } from "next";
import { ModeIntroHero } from "@/components/sections/mode-intro-hero";
import { buildModeMetadata } from "@/domain/metadata/build-metadata";

/**
 * The Infrastructure mode (DEC-056, UX3 7.3).
 *
 * The intro only, for now. The full page — the transition, the infrastructure
 * work, and the tools — arrives in V3 P6, and the persistent animated hero in
 * P5.
 */
export const metadata: Metadata = buildModeMetadata("infrastructure");

export default function InfrastructurePage() {
  return <ModeIntroHero mode="infrastructure" />;
}
