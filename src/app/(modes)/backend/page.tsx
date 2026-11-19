import type { Metadata } from "next";
import { BackendExperienceSection, BackendWorkSection } from "@/components/modes/backend-sections";
import { DisciplineWorkSection, ToolkitSection } from "@/components/modes/discipline-sections";
import { buildModeMetadata } from "@/domain/metadata/build-metadata";

/**
 * Backend (DEC-056, UX3 7.2).
 *
 * The hero is the `(modes)` layout's, shared with the other two modes. Below
 * it, in the approved order: the backend work, selected work, the backend
 * roles, and the toolkit.
 */
export const metadata: Metadata = buildModeMetadata("backend");

export default function BackendPage() {
  return (
    <>
      <BackendWorkSection />
      <DisciplineWorkSection discipline="backend" surface="white" heading="Backend work." />
      <BackendExperienceSection />
      <ToolkitSection discipline="backend" eyebrow="Toolkit" accent="how I use it." />
    </>
  );
}
