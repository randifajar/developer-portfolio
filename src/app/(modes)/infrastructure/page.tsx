import type { Metadata } from "next";
import { buildModeMetadata } from "@/domain/metadata/build-metadata";

/**
 * The Infrastructure mode (DEC-056, UX3 7.3).
 *
 * The hero is the `(modes)` layout's, shared with the other two modes. The
 * sections below it — the transition, the infrastructure work, and the tools —
 * arrive in V3 P6.
 */
export const metadata: Metadata = buildModeMetadata("infrastructure");

export default function InfrastructurePage() {
  return null;
}
