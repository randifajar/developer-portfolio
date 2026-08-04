import { AboutSection } from "@/components/sections/about-section";
import { AIWorkflowSection } from "@/components/sections/ai-workflow-section";
import { ContactSection } from "@/components/sections/contact-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SkillsSection } from "@/components/sections/skills-section";

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
  return (
    <>
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
