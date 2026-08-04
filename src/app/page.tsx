import { AboutSection } from "@/components/sections/about-section";
import { AIWorkflowSection } from "@/components/sections/ai-workflow-section";
import { ContactSection } from "@/components/sections/contact-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { getPublishedProfile, getSiteConfig } from "@/domain/content/selectors";

/**
 * Home.
 *
 * A Server Component that composes the approved section order from DEC-025:
 * Navigation, Hero, About, Selected Projects, Work Experience, Technical
 * Skills, AI-Assisted Engineering, Contact, Footer. Navigation and Footer come
 * from the root layout.
 *
 * Each section reads its own data through a selector and returns null when it
 * has nothing publicly eligible to show. While content is Draft the page
 * therefore renders as chrome only — correct and truthful, and exactly what
 * release validation reports as launch-blocking.
 */
export default function Home() {
  // The Hero owns the page's h1, but it renders nothing while the profile is
  // Draft — which left the live homepage with no h1 at all, breaking the
  // one-primary-heading requirement in NFAC-A11Y-003.
  //
  // A visually hidden fallback keeps the document outline valid without
  // inventing visible content on an otherwise empty page. It uses the owner
  // name, which is a Confirmed decision (DEC-012), not placeholder text.
  const hasHeroHeading = getPublishedProfile() !== null;

  return (
    <>
      {hasHeroHeading ? null : <h1 className="sr-only">{getSiteConfig().ownerName}</h1>}

      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ExperienceSection />
      <SkillsSection />
      <AIWorkflowSection />
      <ContactSection />
    </>
  );
}
