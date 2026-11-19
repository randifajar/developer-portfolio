import type { Metadata } from "next";
import { DisciplineWorkSection, ToolkitSection } from "@/components/modes/discipline-sections";
import {
  InfrastructureWorkSection,
  TransitionSection,
} from "@/components/modes/infrastructure-sections";
import { buildModeMetadata } from "@/domain/metadata/build-metadata";

/**
 * Infrastructure (DEC-056, UX3 7.3).
 *
 * The hero is the `(modes)` layout's, shared with the other two modes. Below
 * it, in the approved order: the transition, the infrastructure work,
 * selected work, and the tools.
 */
export const metadata: Metadata = buildModeMetadata("infrastructure");

export default function InfrastructurePage() {
  return (
    <>
      <TransitionSection />
      <InfrastructureWorkSection />
      <DisciplineWorkSection
        discipline="infrastructure"
        surface="light"
        heading="Infrastructure projects."
      />
      <ToolkitSection
        discipline="infrastructure"
        eyebrow="Tools & practices"
        accent="how I use them."
        crossLink={{
          text: "The backend side of this work is on its own page.",
          discipline: "backend",
        }}
      />
    </>
  );
}
