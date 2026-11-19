import type { Metadata } from "next";
import { buildModeMetadata } from "@/domain/metadata/build-metadata";

/**
 * The Backend mode (DEC-056, UX3 7.2).
 *
 * The hero is the `(modes)` layout's, shared with the other two modes. The
 * sections below it — the backend work, experience, and toolkit — arrive in
 * V3 P6.
 */
export const metadata: Metadata = buildModeMetadata("backend");

export default function BackendPage() {
  return null;
}
