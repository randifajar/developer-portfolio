import { ApproachSection } from "@/components/overall/approach-section";
import { CareerSection } from "@/components/overall/career-section";
import { EducationSection } from "@/components/overall/education-section";
import { ExploreSection } from "@/components/overall/explore-section";
import { FocusSection } from "@/components/overall/focus-section";
import { ProfileSection } from "@/components/overall/profile-section";
import { SelectedWorkSection } from "@/components/overall/selected-work-section";

/**
 * Overall — the home page and the first of the three modes (UX3 7.1).
 *
 * The hero, with the page's h1, is the `(modes)` layout's; this is everything
 * below it, in the approved order: profile, engineering focus, career,
 * selected work, how I approach engineering, education and credentials, and
 * explore further. The footer follows from the root layout.
 *
 * The order is asserted by tests/components/overall-page.test.tsx, as v2's was:
 * an approved sequence that nothing checks can drift in any refactor.
 *
 * Each section reads its content through selectors and renders nothing when
 * it has nothing published to show.
 *
 * This replaced the v2 homepage in V3 P5.
 */
export default function OverallPage() {
  return (
    <>
      <ProfileSection />
      <FocusSection />
      <CareerSection />
      <SelectedWorkSection />
      <ApproachSection />
      <EducationSection />
      <ExploreSection />
    </>
  );
}
